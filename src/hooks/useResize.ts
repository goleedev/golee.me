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
  isMobile: boolean
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
            newSize.width = Math.max(
              MIN_WINDOW_WIDTH,
              resizeState.startSize.width + deltaX
            );
            newSize.height = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeState.startSize.height + deltaY
            );
            break;
          case 'sw':
            newSize.width = Math.max(
              MIN_WINDOW_WIDTH,
              resizeState.startSize.width - deltaX
            );
            newSize.height = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeState.startSize.height + deltaY
            );
            newPosition.x =
              resizeState.startWindowPos.x +
              (resizeState.startSize.width - newSize.width);
            break;
          case 'ne':
            newSize.width = Math.max(
              MIN_WINDOW_WIDTH,
              resizeState.startSize.width + deltaX
            );
            newSize.height = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeState.startSize.height - deltaY
            );
            newPosition.y =
              resizeState.startWindowPos.y +
              (resizeState.startSize.height - newSize.height);
            break;
          case 'nw':
            newSize.width = Math.max(
              MIN_WINDOW_WIDTH,
              resizeState.startSize.width - deltaX
            );
            newSize.height = Math.max(
              MIN_WINDOW_HEIGHT,
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
              MIN_WINDOW_HEIGHT,
              resizeState.startSize.height - deltaY
            );
            newPosition.y =
              resizeState.startWindowPos.y +
              (resizeState.startSize.height - newSize.height);
            break;
          case 's':
            newSize.height = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeState.startSize.height + deltaY
            );
            break;
          case 'e':
            newSize.width = Math.max(
              MIN_WINDOW_WIDTH,
              resizeState.startSize.width + deltaX
            );
            break;
          case 'w':
            newSize.width = Math.max(
              MIN_WINDOW_WIDTH,
              resizeState.startSize.width - deltaX
            );
            newPosition.x =
              resizeState.startWindowPos.x +
              (resizeState.startSize.width - newSize.width);
            break;
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
