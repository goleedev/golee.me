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
    // Extract base page ID from URL (e.g., "blog" from "blog/some-post")
    const basePageId = currentPageId.split('/')[0];

    if (basePageId && basePageId !== '' && dockItems.length > 0) {
      // Check if we've already processed this base page
      if (processedUrlRef.current !== basePageId) {
        processedUrlRef.current = basePageId;

        const existingWindow = windows.find((w) => w.id === basePageId);

        if (!existingWindow) {
          const dockItem = dockItems.find((item) => item.id === basePageId);
          if (dockItem) {
            openWindow(basePageId, dockItem, getWindowContent);
            setTimeout(() => {
              const newWindow = windows.find((w) => w.id === basePageId);
              if (newWindow && !newWindow.isMaximized) {
                maximizeWindow(basePageId);
              }
            }, 200);
          }
        } else {
          bringToFront(basePageId);
          if (!existingWindow.isMaximized) {
            setTimeout(() => {
              maximizeWindow(basePageId);
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
