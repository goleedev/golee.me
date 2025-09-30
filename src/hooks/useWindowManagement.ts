import { useCallback, useState, useEffect } from 'react';
import type { WindowState, DockItem, Position, Size } from '../types';
import {
  MENU_BAR_HEIGHT,
  DOCK_HEIGHT,
  WINDOW_MARGIN,
  WINDOW_SIZES,
  shouldAutoMaximize,
} from '../data/constants';

export const useWindowManagement = (isMobile: boolean) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(1000);

  const constrainPosition = useCallback(
    (pos: Position, size: Size): Position => {
      if (isMobile) {
        return { x: 0, y: MENU_BAR_HEIGHT };
      }

      const availableHeight =
        window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT;

      return {
        x: Math.max(
          WINDOW_MARGIN,
          Math.min(pos.x, window.innerWidth - size.width - WINDOW_MARGIN)
        ),
        y: Math.max(
          MENU_BAR_HEIGHT,
          Math.min(pos.y, availableHeight - size.height + MENU_BAR_HEIGHT)
        ),
      };
    },
    [isMobile]
  );

  const constrainSize = useCallback(
    (size: Size, position: Position): Size => {
      if (isMobile) {
        return WINDOW_SIZES.mobile;
      }

      const maxWidth = window.innerWidth - position.x - WINDOW_MARGIN;
      const maxHeight =
        window.innerHeight -
        MENU_BAR_HEIGHT -
        DOCK_HEIGHT -
        (position.y - MENU_BAR_HEIGHT);

      return {
        width: Math.min(Math.max(300, size.width), maxWidth),
        height: Math.min(Math.max(200, size.height), maxHeight),
      };
    },
    [isMobile]
  );

  const openWindow = useCallback(
    (
      windowId: string,
      dockItem: DockItem,
      getWindowContent: (id: string) => React.ReactNode
    ) => {
      const existingWindow = windows.find((w) => w.id === windowId);
      if (existingWindow) {
        if (existingWindow.isMinimized) {
          setWindows(
            windows.map((w) =>
              w.id === windowId
                ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 }
                : w
            )
          );
          setHighestZIndex((prev) => prev + 1);
        } else {
          bringToFront(windowId);
        }
        return;
      }

      const baseSize = isMobile ? WINDOW_SIZES.mobile : WINDOW_SIZES.default;
      const newSize = isMobile
        ? baseSize
        : windowId === 'music'
        ? WINDOW_SIZES.music
        : baseSize;

      const newWindow: WindowState = {
        id: windowId,
        title: dockItem.title,
        icon: dockItem.icon,
        content: getWindowContent(windowId),
        isOpen: true,
        isMinimized: false,
        isMaximized: isMobile,
        zIndex: highestZIndex + 1,
        position: constrainPosition(
          isMobile
            ? { x: 0, y: MENU_BAR_HEIGHT }
            : {
                x: Math.random() * 200 + 100,
                y: Math.random() * 100 + 80,
              },
          newSize
        ),
        size: newSize,
      };

      setWindows([...windows, newWindow]);
      setHighestZIndex((prev) => prev + 1);
    },
    [windows, highestZIndex, isMobile, constrainPosition]
  );

  const closeWindow = useCallback(
    (windowId: string) => {
      setWindows(windows.filter((w) => w.id !== windowId));

      // Update URL to root when window is closed
      if (window.history) {
        window.history.pushState({}, '', '/');
      }
    },
    [windows]
  );

  const minimizeWindow = useCallback(
    (windowId: string) => {
      if (isMobile) return;

      setWindows(
        windows.map((w) =>
          w.id === windowId ? { ...w, isMinimized: true } : w
        )
      );
    },
    [windows, isMobile]
  );

  const maximizeWindow = useCallback(
    (windowId: string) => {
      if (isMobile) return;

      const availableHeight =
        window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT;

      const newWindows = windows.map((w): WindowState => {
        if (w.id !== windowId) return w;

        if (w.isMaximized) {
          const restoredPosition = w.originalPosition || w.position;
          const restoredSize = w.originalSize || w.size;

          return {
            ...w,
            isMaximized: false,
            position: restoredPosition,
            size: restoredSize,
            originalPosition: undefined,
            originalSize: undefined,
          };
        } else {
          const newPosition = { x: WINDOW_MARGIN, y: MENU_BAR_HEIGHT };
          const newSize = {
            width: window.innerWidth - WINDOW_MARGIN * 2,
            height: availableHeight - WINDOW_MARGIN,
          };

          return {
            ...w,
            isMaximized: true,
            wasAutoMaximized: false, // Manual maximization, not auto
            originalPosition: { ...w.position },
            originalSize: { ...w.size },
            position: newPosition,
            size: newSize,
          };
        }
      });

      setWindows(newWindows);
    },
    [windows, isMobile]
  );

  const bringToFront = useCallback(
    (windowId: string) => {
      setWindows(
        windows.map((w) =>
          w.id === windowId ? { ...w, zIndex: highestZIndex + 1 } : w
        )
      );
      setHighestZIndex((prev) => prev + 1);
    },
    [windows, highestZIndex]
  );

  // Responsive window management
  useEffect(() => {
    const handleResize = () => {
      if (isMobile) return;

      const shouldMaximize = shouldAutoMaximize();
      const availableHeight =
        globalThis.window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT;

      setWindows((prevWindows) =>
        prevWindows.map((window) => {
          // If screen is small enough, auto-maximize all open windows
          if (shouldMaximize && window.isOpen && !window.isMinimized) {
            return {
              ...window,
              isMaximized: true,
              wasAutoMaximized: true, // Mark as auto-maximized
              originalPosition: window.originalPosition || window.position,
              originalSize: window.originalSize || window.size,
              position: { x: WINDOW_MARGIN, y: MENU_BAR_HEIGHT },
              size: {
                width: globalThis.window.innerWidth - WINDOW_MARGIN * 2,
                height: availableHeight - WINDOW_MARGIN,
              },
            };
          }
          // If screen is large enough, restore original size if it was auto-maximized
          else if (
            !shouldMaximize &&
            window.isMaximized &&
            window.wasAutoMaximized &&
            window.originalPosition &&
            window.originalSize
          ) {
            return {
              ...window,
              isMaximized: false,
              wasAutoMaximized: false, // Reset auto-maximized flag
              position: window.originalPosition,
              size: window.originalSize,
              originalPosition: undefined,
              originalSize: undefined,
            };
          }
          return window;
        })
      );
    };

    // Initial check
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  return {
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
  };
};
