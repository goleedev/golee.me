import { useCallback, useEffect, useRef, useState } from 'react';
import type { Position, Size, WindowState } from '../types';
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from '../data/constants';

interface ResizeState {
  isResizing: boolean;
  windowId: string | null;
  direction: string;
  startPos: Position;
  startSize: Size;
  startWindowPos: Position;
}

export const useResize = (
  windows: WindowState[],
  setWindows: (windows: WindowState[]) => void,
  constrainSize: (size: Size, position: Position) => Size,
  constrainPosition: (pos: Position, size: Size) => Position,
  isMobile: boolean,
  bringToFront?: (windowId: string) => void
) => {
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    windowId: null,
    direction: '',
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
    startWindowPos: { x: 0, y: 0 },
  });

  const rafId = useRef<number | null>(null);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, windowId: string, direction: string) => {
      if (isMobile) return;

      e.preventDefault();
      e.stopPropagation();

      const window = windows.find((w) => w.id === windowId);
      if (!window) return;

      // 리사이즈 시작 시 윈도우를 앞으로 가져오기
      if (bringToFront) {
        bringToFront(windowId);
      }

      setResizeState({
        isResizing: true,
        windowId,
        direction,
        startPos: { x: e.clientX, y: e.clientY },
        startSize: window.size,
        startWindowPos: window.position,
      });
    },
    [windows, isMobile, bringToFront]
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

        const maxWidth = globalThis.window.innerWidth;
        const maxHeight = globalThis.window.innerHeight;

        switch (resizeState.direction) {
          case 'se': {
            newSize.width = Math.max(
              MIN_WINDOW_WIDTH,
              Math.min(
                resizeState.startSize.width + deltaX,
                maxWidth - resizeState.startWindowPos.x
              )
            );
            newSize.height = Math.max(
              MIN_WINDOW_HEIGHT,
              Math.min(
                resizeState.startSize.height + deltaY,
                maxHeight - resizeState.startWindowPos.y
              )
            );
            break;
          }

          case 'sw': {
            const newWidthSW = Math.max(
              MIN_WINDOW_WIDTH,
              resizeState.startSize.width - deltaX
            );
            const newXSW =
              resizeState.startWindowPos.x +
              (resizeState.startSize.width - newWidthSW);

            if (newXSW >= 0) {
              newSize.width = newWidthSW;
              newPosition.x = newXSW;
            } else {
              newSize.width =
                resizeState.startWindowPos.x + resizeState.startSize.width;
              newPosition.x = 0;
            }

            newSize.height = Math.max(
              MIN_WINDOW_HEIGHT,
              Math.min(
                resizeState.startSize.height + deltaY,
                maxHeight - resizeState.startWindowPos.y
              )
            );
            break;
          }

          case 'ne': {
            newSize.width = Math.max(
              MIN_WINDOW_WIDTH,
              Math.min(
                resizeState.startSize.width + deltaX,
                maxWidth - resizeState.startWindowPos.x
              )
            );

            const newHeightNE = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeState.startSize.height - deltaY
            );
            const newYNE =
              resizeState.startWindowPos.y +
              (resizeState.startSize.height - newHeightNE);

            if (newYNE >= 40) {
              newSize.height = newHeightNE;
              newPosition.y = newYNE;
            } else {
              newSize.height =
                resizeState.startWindowPos.y +
                resizeState.startSize.height -
                40;
              newPosition.y = 40;
            }
            break;
          }

          case 'nw': {
            const newWidthNW = Math.max(
              MIN_WINDOW_WIDTH,
              resizeState.startSize.width - deltaX
            );
            const newXNW =
              resizeState.startWindowPos.x +
              (resizeState.startSize.width - newWidthNW);

            if (newXNW >= 0) {
              newSize.width = newWidthNW;
              newPosition.x = newXNW;
            } else {
              newSize.width =
                resizeState.startWindowPos.x + resizeState.startSize.width;
              newPosition.x = 0;
            }

            const newHeightNW = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeState.startSize.height - deltaY
            );
            const newYNW =
              resizeState.startWindowPos.y +
              (resizeState.startSize.height - newHeightNW);

            if (newYNW >= 40) {
              newSize.height = newHeightNW;
              newPosition.y = newYNW;
            } else {
              newSize.height =
                resizeState.startWindowPos.y +
                resizeState.startSize.height -
                40;
              newPosition.y = 40;
            }
            break;
          }

          case 'n': {
            const newHeightN = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeState.startSize.height - deltaY
            );
            const newYN =
              resizeState.startWindowPos.y +
              (resizeState.startSize.height - newHeightN);

            if (newYN >= 40) {
              newSize.height = newHeightN;
              newPosition.y = newYN;
            } else {
              newSize.height =
                resizeState.startWindowPos.y +
                resizeState.startSize.height -
                40;
              newPosition.y = 40;
            }
            break;
          }

          case 's': {
            newSize.height = Math.max(
              MIN_WINDOW_HEIGHT,
              Math.min(
                resizeState.startSize.height + deltaY,
                maxHeight - resizeState.startWindowPos.y
              )
            );
            break;
          }

          case 'e': {
            newSize.width = Math.max(
              MIN_WINDOW_WIDTH,
              Math.min(
                resizeState.startSize.width + deltaX,
                maxWidth - resizeState.startWindowPos.x
              )
            );
            break;
          }

          case 'w': {
            const newWidthW = Math.max(
              MIN_WINDOW_WIDTH,
              resizeState.startSize.width - deltaX
            );
            const newXW =
              resizeState.startWindowPos.x +
              (resizeState.startSize.width - newWidthW);

            if (newXW >= 0) {
              newSize.width = newWidthW;
              newPosition.x = newXW;
            } else {
              newSize.width =
                resizeState.startWindowPos.x + resizeState.startSize.width;
              newPosition.x = 0;
            }
            break;
          }
        }

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
    [
      resizeState,
      windows,
      constrainSize,
      constrainPosition,
      isMobile,
      setWindows,
    ]
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

  return {
    handleResizeMouseDown,
  };
};
