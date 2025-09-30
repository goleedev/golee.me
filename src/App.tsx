import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import DesktopIcon from './components/desktop/DesktopIcon';
import Dock from './components/dock/Dock';
import MenuBar from './components/layout/MenuBar';
import Stickies from './components/shared/Stickies';
import Window from './components/layout/Window';
import { AboutContent } from './components/windows/AboutContent';
import { CommunityContent } from './components/windows/CommunityContent';
import { GuestbookContent } from './components/windows/GuestbookContent';
import { MentorshipContent } from './components/windows/MentorshipContent';
import { MusicContent } from './components/windows/MusicContent';
import { WorkContent } from './components/windows/WorkContent';
import { ActivitiesContent } from './components/windows/ActivitiesContent';
import { initialDockItems } from './data/dockItems';
import { initialStickies } from './data/initialStickies';
import { useWindowManagement } from './hooks/useWindowManagement';
import { useMusic } from './hooks/useMusic';
import { useDesktopIcons } from './hooks/useDesktopIcons';
import FolderIcon from './components/shared/icons/FolderIcon';
import MusicIcon from './components/shared/icons/MusicIcon';
import NoteIcon from './components/shared/icons/NoteIcon';
import type {
  DockItem,
  Position,
  Size,
  StickyState,
  DragState,
  IconDragState,
  StickyDragState,
} from './types';

const trackVisit = () => {
  let country = 'Unknown';
  try {
    const locale = navigator.language || 'en-US';
    const regionCode = locale.split('-')[1]; // en-US -> US

    if (regionCode) {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      country = regionNames.of(regionCode) || locale;
    } else {
      country = locale;
    }
  } catch {
    country = navigator.language || 'Unknown';
  }

  const referrer = document.referrer || 'Direct';

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country, referrer }),
  }).catch((err) => console.error('Analytics tracking failed:', err));
};

const MacOSPortfolio = () => {
  const location = useLocation();
  const [dockItems, setDockItems] = useState<DockItem[]>([]);
  const [stickies, setStickies] = useState<StickyState[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get current page ID from URL
  const currentPageId = location.pathname.substring(1); // Remove leading slash

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
  } = useWindowManagement(isMobile);

  const { currentTrack, isLoadingTrack, isPlaying, setIsPlaying } = useMusic();

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    windowId: null,
    startPos: { x: 0, y: 0 },
    startWindowPos: { x: 0, y: 0 },
  });

  const [iconDragState, setIconDragState] = useState<IconDragState>({
    isDragging: false,
    iconId: null,
    startPos: { x: 0, y: 0 },
    startIconPos: { x: 0, y: 0 },
  });

  const [stickyDragState, setStickyDragState] = useState<StickyDragState>({
    isDragging: false,
    stickyId: null,
    startPos: { x: 0, y: 0 },
    startStickyPos: { x: 0, y: 0 },
  });

  const [hasDraggedIcon, setHasDraggedIcon] = useState(false);

  const {
    desktopIconPositions,
    setDesktopIconPositions,
    selectedIcon,
    handleIconClick,
  } = useDesktopIcons(isMobile);

  const [resizeState, setResizeState] = useState<{
    isResizing: boolean;
    windowId: string | null;
    direction: string;
    startPos: Position;
    startSize: Size;
    startWindowPos: Position;
  }>({
    isResizing: false,
    windowId: null,
    direction: '',
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
    startWindowPos: { x: 0, y: 0 },
  });

  const desktopRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(null);
  const processedUrlRef = useRef<string>('');

  // Window contents mapping
  const getWindowContent = useCallback(
    (id: string) => {
      const contents = {
        about: <AboutContent />,
        work: <WorkContent />,
        activities: <ActivitiesContent />,
        community: <CommunityContent />,
        mentorship: <MentorshipContent />,
        guestbook: <GuestbookContent />,
        music: (
          <MusicContent
            currentTrack={currentTrack}
            isLoadingTrack={isLoadingTrack}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        ),
      };
      return contents[id as keyof typeof contents] || <AboutContent />;
    },
    [currentTrack, isLoadingTrack, isPlaying, setIsPlaying]
  );

  // Auto-open window based on URL
  useEffect(() => {
    if (currentPageId && currentPageId !== '' && dockItems.length > 0) {
      // Only process if this URL hasn't been processed yet
      if (processedUrlRef.current !== currentPageId) {
        processedUrlRef.current = currentPageId;

        // Check if window is already open
        const existingWindow = windows.find((w) => w.id === currentPageId);

        if (!existingWindow) {
          // Open the window
          const dockItem = dockItems.find((item) => item.id === currentPageId);
          if (dockItem) {
            openWindow(currentPageId, dockItem, getWindowContent);
            // Wait for window to be created before maximizing
            setTimeout(() => {
              const newWindow = windows.find((w) => w.id === currentPageId);
              if (newWindow && !newWindow.isMaximized) {
                maximizeWindow(currentPageId);
              }
            }, 200);
          }
        } else {
          // If window is already open, just bring it to front and maximize
          bringToFront(currentPageId);
          if (!existingWindow.isMaximized) {
            setTimeout(() => {
              maximizeWindow(currentPageId);
            }, 100);
          }
        }
      }
    }
  }, [currentPageId, dockItems.length, windows.length, getWindowContent]);

  // Force re-render of music window when music state changes
  useEffect(() => {
    if (currentPageId === 'music') {
      const musicWindow = windows.find((w) => w.id === 'music');
      if (musicWindow) {
        // Force re-render by updating the window content
        const updatedWindows = windows.map((w) =>
          w.id === 'music' ? { ...w, content: getWindowContent('music') } : w
        );
        setWindows(updatedWindows);
      }
    }
  }, [currentTrack, isLoadingTrack, isPlaying, currentPageId]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track page visit on mount
  useEffect(() => {
    trackVisit();
  }, []);

  // Initialize
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = '/bagel.png';

    const timeout = setTimeout(() => setImageLoaded(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const dockItemsWithIcons = initialDockItems.map((item) => ({
      ...item,
      icon: getIconForItem(item.id),
    }));
    setDockItems(dockItemsWithIcons);
    setStickies(initialStickies);
  }, []);

  const getIconForItem = (id: string) => {
    const iconMap = {
      about: <NoteIcon />,
      work: <NoteIcon />,
      community: <FolderIcon />,
      mentorship: <NoteIcon />,
      activities: <FolderIcon />,
      guestbook: <FolderIcon />,
      music: <MusicIcon />,
    };
    return iconMap[id as keyof typeof iconMap] || <NoteIcon />;
  };

  const handleWindowMouseDown = useCallback(
    (e: React.MouseEvent, windowId: string) => {
      if (isMobile) return;
      if ((e.target as HTMLElement).closest('.window-controls')) return;

      const window = windows.find((w) => w.id === windowId);
      if (!window || window.isMaximized) return;

      bringToFront(windowId);

      setDragState({
        isDragging: true,
        windowId,
        startPos: { x: e.clientX, y: e.clientY },
        startWindowPos: window.position,
      });
    },
    [windows, isMobile, bringToFront]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isMobile || !dragState.isDragging || !dragState.windowId) return;

      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        const deltaX = e.clientX - dragState.startPos.x;
        const deltaY = e.clientY - dragState.startPos.y;

        const newPosition = {
          x: dragState.startWindowPos.x + deltaX,
          y: dragState.startWindowPos.y + deltaY,
        };

        const window = windows.find((w) => w.id === dragState.windowId);
        if (window) {
          const constrainedPosition = constrainPosition(
            newPosition,
            window.size
          );

          setWindows(
            windows.map((w) =>
              w.id === dragState.windowId
                ? { ...w, position: constrainedPosition }
                : w
            )
          );
        }
      });
    },
    [dragState, windows, constrainPosition, isMobile]
  );

  const handleMouseUp = useCallback(() => {
    if (isMobile) return;

    setDragState({
      isDragging: false,
      windowId: null,
      startPos: { x: 0, y: 0 },
      startWindowPos: { x: 0, y: 0 },
    });
  }, [isMobile]);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, windowId: string, direction: string) => {
      if (isMobile) return; // Disable resize on mobile

      e.preventDefault();
      e.stopPropagation();

      const window = windows.find((w) => w.id === windowId);
      if (!window) return;

      setResizeState({
        isResizing: true,
        windowId,
        direction,
        startPos: { x: e.clientX, y: e.clientY },
        startSize: window.size,
        startWindowPos: window.position,
      });
    },
    [windows, isMobile]
  );

  const handleResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isMobile || !resizeState.isResizing || !resizeState.windowId) return;

      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        const deltaX = e.clientX - resizeState.startPos.x;
        const deltaY = e.clientY - resizeState.startPos.y;

        const window = windows.find((w) => w.id === resizeState.windowId);
        if (!window) return;

        const newSize = { ...resizeState.startSize };
        const newPosition = { ...resizeState.startWindowPos };

        switch (resizeState.direction) {
          case 'se':
            newSize.width = Math.max(300, resizeState.startSize.width + deltaX);
            newSize.height = Math.max(
              200,
              resizeState.startSize.height + deltaY
            );
            break;
          case 'sw':
            newSize.width = Math.max(300, resizeState.startSize.width - deltaX);
            newSize.height = Math.max(
              200,
              resizeState.startSize.height + deltaY
            );
            newPosition.x =
              resizeState.startWindowPos.x +
              (resizeState.startSize.width - newSize.width);
            break;
          case 'ne':
            newSize.width = Math.max(300, resizeState.startSize.width + deltaX);
            newSize.height = Math.max(
              200,
              resizeState.startSize.height - deltaY
            );
            newPosition.y =
              resizeState.startWindowPos.y +
              (resizeState.startSize.height - newSize.height);
            break;
          case 'nw':
            newSize.width = Math.max(300, resizeState.startSize.width - deltaX);
            newSize.height = Math.max(
              200,
              resizeState.startSize.height - deltaY
            );
            newPosition.x =
              resizeState.startWindowPos.x +
              (resizeState.startSize.width - newSize.width);
            newPosition.y =
              resizeState.startWindowPos.y +
              (resizeState.startSize.height - newSize.height);
            break;
          case 'n':
            newSize.height = Math.max(
              200,
              resizeState.startSize.height - deltaY
            );
            newPosition.y =
              resizeState.startWindowPos.y +
              (resizeState.startSize.height - newSize.height);
            break;
          case 's':
            newSize.height = Math.max(
              200,
              resizeState.startSize.height + deltaY
            );
            break;
          case 'e':
            newSize.width = Math.max(300, resizeState.startSize.width + deltaX);
            break;
          case 'w':
            newSize.width = Math.max(300, resizeState.startSize.width - deltaX);
            newPosition.x =
              resizeState.startWindowPos.x +
              (resizeState.startSize.width - newSize.width);
            break;
        }

        // Apply constraints for both size and position
        const constrainedSize = constrainSize(newSize, newPosition);
        const constrainedPosition = constrainPosition(
          newPosition,
          constrainedSize
        );

        setWindows(
          windows.map((w) =>
            w.id === resizeState.windowId
              ? { ...w, size: constrainedSize, position: constrainedPosition }
              : w
          )
        );
      });
    },
    [resizeState, windows, constrainSize, constrainPosition, isMobile]
  );

  const handleResizeMouseUp = useCallback(() => {
    if (isMobile) return;

    setResizeState({
      isResizing: false,
      windowId: null,
      direction: '',
      startPos: { x: 0, y: 0 },
      startSize: { width: 0, height: 0 },
      startWindowPos: { x: 0, y: 0 },
    });
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile && resizeState.isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [
    resizeState.isResizing,
    handleResizeMouseMove,
    handleResizeMouseUp,
    isMobile,
  ]);

  // Window drag event listeners
  useEffect(() => {
    if (!isMobile && dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp, isMobile]);

  // Icon drag handlers
  const handleIconMouseDown = useCallback(
    (e: React.MouseEvent, iconId: string, currentPos: Position) => {
      if (isMobile) return;

      e.preventDefault();
      e.stopPropagation();

      setHasDraggedIcon(false);

      setIconDragState({
        isDragging: false,
        iconId,
        startPos: { x: e.clientX, y: e.clientY },
        startIconPos: currentPos,
      });
    },
    [isMobile]
  );

  const handleIconMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isMobile) return;

      if (!iconDragState.isDragging && iconDragState.iconId) {
        const deltaX = e.clientX - iconDragState.startPos.x;
        const deltaY = e.clientY - iconDragState.startPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 5) {
          setIconDragState((prev) => ({ ...prev, isDragging: true }));
          setHasDraggedIcon(true);
        }
        return;
      }

      if (!iconDragState.isDragging || !iconDragState.iconId) return;

      const deltaX = e.clientX - iconDragState.startPos.x;
      const deltaY = e.clientY - iconDragState.startPos.y;

      const newPosition = {
        x: iconDragState.startIconPos.x + deltaX,
        y: iconDragState.startIconPos.y + deltaY,
      };

      const constrainedPosition = {
        x: Math.max(32, Math.min(newPosition.x, window.innerWidth - 32)),
        y: Math.max(72, Math.min(newPosition.y, window.innerHeight - 70 - 32)),
      };

      setDesktopIconPositions((prev: Record<string, Position>) => ({
        ...prev,
        [iconDragState.iconId!]: constrainedPosition,
      }));
    },
    [iconDragState, isMobile]
  );

  const handleIconMouseUp = useCallback(() => {
    if (isMobile) return;

    setIconDragState({
      isDragging: false,
      iconId: null,
      startPos: { x: 0, y: 0 },
      startIconPos: { x: 0, y: 0 },
    });

    setTimeout(() => {
      setHasDraggedIcon(false);
    }, 100);
  }, [isMobile]);

  // Icon drag event listeners
  useEffect(() => {
    if (!isMobile && iconDragState.iconId) {
      document.addEventListener('mousemove', handleIconMouseMove);
      document.addEventListener('mouseup', handleIconMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleIconMouseMove);
        document.removeEventListener('mouseup', handleIconMouseUp);
      };
    }
  }, [
    iconDragState.iconId,
    iconDragState.isDragging,
    handleIconMouseMove,
    handleIconMouseUp,
    isMobile,
  ]);

  // Sticky drag handlers
  const handleStickyMouseDown = useCallback(
    (e: React.MouseEvent, stickyId: string, stickyPosition: Position) => {
      if (isMobile) return;

      e.preventDefault();
      e.stopPropagation();

      setStickyDragState({
        isDragging: true,
        stickyId,
        startPos: { x: e.clientX, y: e.clientY },
        startStickyPos: stickyPosition,
      });
    },
    [isMobile]
  );

  const handleStickyMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isMobile || !stickyDragState.isDragging || !stickyDragState.stickyId)
        return;

      const deltaX = e.clientX - stickyDragState.startPos.x;
      const deltaY = e.clientY - stickyDragState.startPos.y;

      const newPosition = {
        x: stickyDragState.startStickyPos.x + deltaX,
        y: stickyDragState.startStickyPos.y + deltaY,
      };

      const constrainedPosition = {
        x: Math.max(0, Math.min(newPosition.x, window.innerWidth - 256)),
        y: Math.max(40, Math.min(newPosition.y, window.innerHeight - 70 - 288)),
      };

      setStickies(
        stickies.map((s) =>
          s.id === stickyDragState.stickyId
            ? { ...s, position: constrainedPosition }
            : s
        )
      );
    },
    [stickyDragState, stickies, isMobile]
  );

  const handleStickyMouseUp = useCallback(() => {
    if (isMobile) return;

    setStickyDragState({
      isDragging: false,
      stickyId: null,
      startPos: { x: 0, y: 0 },
      startStickyPos: { x: 0, y: 0 },
    });
  }, [isMobile]);

  // Sticky drag event listeners
  useEffect(() => {
    if (!isMobile && stickyDragState.isDragging) {
      document.addEventListener('mousemove', handleStickyMouseMove);
      document.addEventListener('mouseup', handleStickyMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleStickyMouseMove);
        document.removeEventListener('mouseup', handleStickyMouseUp);
      };
    }
  }, [
    stickyDragState.isDragging,
    handleStickyMouseMove,
    handleStickyMouseUp,
    isMobile,
  ]);

  const dockItemClick = (itemId: string) => {
    const existingWindow = windows.find((w) => w.id === itemId);
    if (existingWindow && existingWindow.isMinimized && !isMobile) {
      // Restore minimized window (desktop only)
      setWindows(
        windows.map((w) =>
          w.id === itemId
            ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 }
            : w
        )
      );
      setHighestZIndex((prev) => prev + 1);
    } else if (existingWindow && !existingWindow.isMinimized) {
      // Bring to front if already open
      bringToFront(itemId);
    } else {
      // Open new window
      const dockItem = dockItems.find((item) => item.id === itemId);
      if (dockItem) {
        openWindow(itemId, dockItem, getWindowContent);
      }
    }

    // Update URL when window is opened
    if (window.history) {
      window.history.pushState({}, '', `/${itemId}`);
    }
  };

  return (
    <div
      ref={desktopRef}
      className="h-screen w-full relative overflow-hidden bg-gray-100"
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-light">Loading...</p>
          </div>
        </div>
      )}
      <MenuBar currentTime={currentTime} />

      {/* 스티키 노트 렌더링 */}
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

      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: 'url(/bagel.png)',
            backgroundColor: '#fff',
            filter: imageLoaded ? 'none' : 'blur(5px)',
            transition: 'filter 0.5s ease-in-out',
            opacity: imageLoaded ? 1 : 0,
            transitionDelay: imageLoaded ? '0.5s' : '0s',
            zIndex: 0,
          }}
          onLoad={() => setImageLoaded(true)}
        >
          {/* Desktop icons - only show on desktop */}
          {!isMobile &&
            imageLoaded &&
            dockItems.map((item) => {
              const iconPos = desktopIconPositions[item.id] || { x: 0, y: 0 };
              const isSelected = selectedIcon === item.id;
              const isDragging =
                iconDragState.isDragging && iconDragState.iconId === item.id;

              return (
                <DesktopIcon
                  key={item.id}
                  item={item}
                  position={iconPos}
                  isSelected={isSelected}
                  isDragging={isDragging}
                  onMouseDown={(e) => handleIconMouseDown(e, item.id, iconPos)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIconClick(e, item.id, hasDraggedIcon, dockItemClick);
                  }}
                />
              );
            })}
        </div>
      </div>

      {windows
        .filter((w) => w.isOpen)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => {
          return (
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
          );
        })}

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
        <Route path="/*" element={<MacOSPortfolio />} />
      </Routes>
    </Router>
  );
};

export default App;
