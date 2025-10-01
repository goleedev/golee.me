import { useEffect, useRef } from 'react';
import type { WindowState, DockItem } from '../types';

export const useUrlNavigation = (
  currentPageId: string,
  dockItems: DockItem[],
  windows: WindowState[],
  openWindow: (
    windowId: string,
    dockItem: DockItem,
    getContent: (id: string) => React.ReactNode
  ) => void,
  maximizeWindow: (windowId: string) => void,
  bringToFront: (windowId: string) => void,
  getWindowContent: (id: string) => React.ReactNode
) => {
  const processedUrlRef = useRef<string>('');

  useEffect(() => {
    if (currentPageId && currentPageId !== '' && dockItems.length > 0) {
      if (processedUrlRef.current !== currentPageId) {
        processedUrlRef.current = currentPageId;

        const existingWindow = windows.find((w) => w.id === currentPageId);

        if (!existingWindow) {
          const dockItem = dockItems.find((item) => item.id === currentPageId);
          if (dockItem) {
            openWindow(currentPageId, dockItem, getWindowContent);
            setTimeout(() => {
              const newWindow = windows.find((w) => w.id === currentPageId);
              if (newWindow && !newWindow.isMaximized) {
                maximizeWindow(currentPageId);
              }
            }, 200);
          }
        } else {
          bringToFront(currentPageId);
          if (!existingWindow.isMaximized) {
            setTimeout(() => {
              maximizeWindow(currentPageId);
            }, 100);
          }
        }
      }
    }
  }, [
    currentPageId,
    dockItems.length,
    windows.length,
    openWindow,
    maximizeWindow,
    bringToFront,
    getWindowContent,
  ]);
};
