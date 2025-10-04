import { useCallback, useEffect, useState } from 'react';
import type { Position, StickyState } from '../types';
import { initialStickies } from '../data/initialStickies';

interface StickyDragState {
  isDragging: boolean;
  stickyId: string | null;
  startPos: Position;
  startStickyPos: Position;
}

const STICKY_WIDTH = 256;
const STICKY_HEIGHT = 208;
const STICKY_MARGIN = 0;

export const useStickyNotes = (dockHeight: number) => {
  const [stickies, setStickies] = useState<StickyState[]>([]);
  const [stickyDragState, setStickyDragState] = useState<StickyDragState>({
    isDragging: false,
    stickyId: null,
    startPos: { x: 0, y: 0 },
    startStickyPos: { x: 0, y: 0 },
  });

  useEffect(() => {
    setStickies(initialStickies);
  }, []);

  const handleStickyMouseDown = useCallback(
    (e: React.MouseEvent, stickyId: string, stickyPosition: Position) => {
      e.preventDefault();
      e.stopPropagation();

      setStickyDragState({
        isDragging: true,
        stickyId,
        startPos: { x: e.clientX, y: e.clientY },
        startStickyPos: stickyPosition,
      });
    },
    []
  );

  const handleStickyMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!stickyDragState.isDragging || !stickyDragState.stickyId) return;

      const deltaX = e.clientX - stickyDragState.startPos.x;
      const deltaY = e.clientY - stickyDragState.startPos.y;

      const newPosition = {
        x: stickyDragState.startStickyPos.x + deltaX,
        y: stickyDragState.startStickyPos.y + deltaY,
      };

      const constrainedPosition = {
        x: Math.max(
          0,
          Math.min(newPosition.x, window.innerWidth - STICKY_WIDTH)
        ),
        y: Math.max(
          40,
          Math.min(
            newPosition.y,
            window.innerHeight - dockHeight - STICKY_HEIGHT - STICKY_MARGIN
          )
        ),
      };

      setStickies(
        stickies.map((s) =>
          s.id === stickyDragState.stickyId
            ? { ...s, position: constrainedPosition }
            : s
        )
      );
    },
    [stickyDragState, stickies, dockHeight]
  );

  const handleStickyMouseUp = useCallback(() => {
    setStickyDragState({
      isDragging: false,
      stickyId: null,
      startPos: { x: 0, y: 0 },
      startStickyPos: { x: 0, y: 0 },
    });
  }, []);

  useEffect(() => {
    if (stickyDragState.isDragging) {
      document.addEventListener('mousemove', handleStickyMouseMove);
      document.addEventListener('mouseup', handleStickyMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleStickyMouseMove);
        document.removeEventListener('mouseup', handleStickyMouseUp);
      };
    }
  }, [stickyDragState.isDragging, handleStickyMouseMove, handleStickyMouseUp]);

  return {
    stickies,
    handleStickyMouseDown,
  };
};
