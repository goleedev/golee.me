import { useCallback, useEffect, useRef, useState } from 'react';
import type { Position, WindowState } from '../types';

interface DragState {
  isDragging: boolean;
  windowId: string | null;
  startPos: Position;
  startWindowPos: Position;
}

export const useDrag = (
  windows: WindowState[],
  setWindows: (windows: WindowState[]) => void,
  constrainPosition: (
    pos: Position,
    size: { width: number; height: number }
  ) => Position,
  isMobile: boolean
) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    windowId: null,
    startPos: { x: 0, y: 0 },
    startWindowPos: { x: 0, y: 0 },
  });

  const rafId = useRef<number | null>(null);

  const handleWindowMouseDown = useCallback(
    (e: React.MouseEvent, windowId: string) => {
      if (isMobile) return;
      if ((e.target as HTMLElement).closest('.window-controls')) return;

      const window = windows.find((w) => w.id === windowId);
      if (!window || window.isMaximized) return;

      setDragState({
        isDragging: true,
        windowId,
        startPos: { x: e.clientX, y: e.clientY },
        startWindowPos: window.position,
      });
    },
    [windows, isMobile]
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
    [dragState, windows, constrainPosition, isMobile, setWindows]
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

  return {
    handleWindowMouseDown,
  };
};
