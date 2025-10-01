import { useCallback, useEffect, useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import Desktop from './components/desktop/Desktop';
import Dock from './components/dock/Dock';
import MenuBar from './components/layout/MenuBar';
import Window from './components/layout/Window';
import Stickies from './components/shared/Stickies';
import { initialDockItems } from './data/dockItems';
import { useDesktopIcons } from './hooks/useDesktopIcons';
import { useDrag } from './hooks/useDrag';
import { useIconDrag } from './hooks/useIconDrag';
import { useMusic } from './hooks/useMusic';
import { useResize } from './hooks/useResize';
import { useResponsive } from './hooks/useResponsive';
import { useStickyNotes } from './hooks/useStickyNotes';
import { useUrlNavigation } from './hooks/useUrlNavigation';
import { useWindowManagement } from './hooks/useWindowManagement';
import type { DockItem } from './types';
import { trackVisit } from './utils/analytics';
import { getIconForItem } from './utils/iconMapper';
import { getWindowContent } from './utils/windowContentProvider';

const BagelOSPortfolio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dockItems, setDockItems] = useState<DockItem[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentPageId = location.pathname.substring(1);

  // Responsive hook
  const { isMobile, dockHeight } = useResponsive();

  // Custom hooks
  const {
    windows,
    setWindows,
    highestZIndex,
    setHighestZIndex,
    constrainPosition,
    constrainSize,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
  } = useWindowManagement(isMobile, dockHeight);

  const { currentTrack, isLoadingTrack, isPlaying, setIsPlaying } = useMusic();

  const {
    desktopIconPositions,
    setDesktopIconPositions,
    selectedIcon,
    handleIconClick,
  } = useDesktopIcons(isMobile);

  const { handleWindowMouseDown } = useDrag(
    windows,
    setWindows,
    constrainPosition,
    isMobile
  );

  const { handleResizeMouseDown } = useResize(
    windows,
    setWindows,
    constrainSize,
    constrainPosition,
    isMobile
  );

  const { stickies, handleStickyMouseDown } = useStickyNotes(dockHeight);

  const { iconDragState, hasDraggedIcon, handleIconMouseDown } = useIconDrag(
    setDesktopIconPositions,
    dockHeight
  );

  // Window content provider with music props
  const getContent = useCallback(
    (id: string) => {
      return getWindowContent(id, {
        currentTrack,
        isLoadingTrack,
        isPlaying,
        setIsPlaying,
      });
    },
    [currentTrack, isLoadingTrack, isPlaying, setIsPlaying]
  );

  // URL navigation handling
  useUrlNavigation(
    currentPageId,
    dockItems,
    windows,
    openWindow,
    maximizeWindow,
    bringToFront,
    getContent
  );

  // Force re-render of music window when music state changes
  useEffect(() => {
    if (currentPageId === 'music') {
      const musicWindow = windows.find((w) => w.id === 'music');
      if (musicWindow) {
        const updatedWindows = windows.map((w) =>
          w.id === 'music' ? { ...w, content: getContent('music') } : w
        );
        setWindows(updatedWindows);
      }
    }
  }, [currentTrack, isLoadingTrack, isPlaying, currentPageId]);

  // Track page visit on mount
  useEffect(() => {
    trackVisit();
  }, []);

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Image loading
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = '/bagel.png';

    const timeout = setTimeout(() => setImageLoaded(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Initialize dock items with icons
  useEffect(() => {
    const dockItemsWithIcons = initialDockItems.map((item) => ({
      ...item,
      icon: getIconForItem(item.id),
    }));
    setDockItems(dockItemsWithIcons);
  }, []);

  // Dock item click handler
  const dockItemClick = useCallback(
    (itemId: string) => {
      const existingWindow = windows.find((w) => w.id === itemId);

      if (existingWindow && existingWindow.isMinimized && !isMobile) {
        setWindows(
          windows.map((w) =>
            w.id === itemId
              ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 }
              : w
          )
        );
        setHighestZIndex((prev) => prev + 1);
      } else if (existingWindow && !existingWindow.isMinimized) {
        bringToFront(itemId);
      } else {
        const dockItem = dockItems.find((item) => item.id === itemId);
        if (dockItem) {
          openWindow(itemId, dockItem, getContent);
        }
      }

      if (window.history) {
        window.history.pushState({}, '', `/${itemId}`);
      }
    },
    [
      windows,
      isMobile,
      highestZIndex,
      dockItems,
      setWindows,
      setHighestZIndex,
      bringToFront,
      openWindow,
      getContent,
    ]
  );

  const handleLogoClick = useCallback(() => {
    setWindows([]);
    navigate('/');
  }, [setWindows, navigate]);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gray-100">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-light">Loading...</p>
          </div>
        </div>
      )}

      <MenuBar currentTime={currentTime} onLogoClick={handleLogoClick} />

      {/* Sticky Notes */}
      {stickies.map((sticky) => (
        <Stickies
          key={sticky.id}
          sticky={sticky}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleStickyMouseDown(e, sticky.id, sticky.position);
          }}
          isMobile={isMobile}
        />
      ))}

      {/* Desktop Background with Icons */}
      <Desktop
        dockItems={dockItems}
        desktopIconPositions={desktopIconPositions}
        selectedIcon={selectedIcon}
        iconDragState={iconDragState}
        hasDraggedIcon={hasDraggedIcon}
        imageLoaded={imageLoaded}
        isMobile={isMobile}
        onIconMouseDown={handleIconMouseDown}
        onIconClick={handleIconClick}
        onDockItemClick={dockItemClick}
      />

      {/* Windows */}
      {windows
        .filter((w) => w.isOpen)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => (
          <div key={window.id} style={{ zIndex: window.zIndex + 1000 }}>
            <Window
              window={window}
              onMouseDown={handleWindowMouseDown}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onMaximize={maximizeWindow}
              onResizeMouseDown={handleResizeMouseDown}
              isMobile={isMobile}
            />
          </div>
        ))}

      {/* Dock */}
      <Dock
        dockItems={dockItems}
        windows={windows}
        onDockItemClick={dockItemClick}
        isMobile={isMobile}
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<BagelOSPortfolio />} />
      </Routes>
    </Router>
  );
};

export default App;
