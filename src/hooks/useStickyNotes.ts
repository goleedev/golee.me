import { useCallback, useEffect, useState } from 'react';
import type { Position, StickyState } from '../types';
import { getInitialStickies } from '../data/initialStickies';

interface StickyDragState {
  isDragging: boolean;
  stickyId: string | null;
  startPos: Position;
  startStickyPos: Position;
}

const STICKY_WIDTH = 264;
const STICKY_HEIGHT = 208;
const STICKY_MARGIN = 16;

export const useStickyNotes = (dockHeight: number, isMobile: boolean) => {
  const [stickies, setStickies] = useState<StickyState[]>([]);
  const [stickyDragState, setStickyDragState] = useState<StickyDragState>({
    isDragging: false,
    stickyId: null,
    startPos: { x: 0, y: 0 },
    startStickyPos: { x: 0, y: 0 },
  });

  useEffect(() => {
    setStickies(getInitialStickies(isMobile));
  }, [isMobile]);

  const handleToggleExpand = useCallback((stickyId: string) => {
    setStickies((prevStickies) =>
      prevStickies.map((sticky) => {
        if (sticky.id !== stickyId) return sticky;

        const isCurrentlyExpanded = sticky.isExpanded || false;

        if (isCurrentlyExpanded) {
          return {
            ...sticky,
            isExpanded: false,
            position: sticky.originalPosition || sticky.position,
            originalPosition: undefined,
          };
        } else {
          const expandedPosition = {
            x: STICKY_MARGIN,
            y: 40 + STICKY_MARGIN,
          };

          return {
            ...sticky,
            isExpanded: true,
            originalPosition: { ...sticky.position },
            position: expandedPosition,
          };
        }
      })
    );
  }, []);

  const handleStickyMouseDown = useCallback(
    (e: React.MouseEvent, stickyId: string) => {
      e.preventDefault();
      e.stopPropagation();

      const sticky = stickies.find((s) => s.id === stickyId);
      if (!sticky || sticky.isExpanded) return;

      setStickyDragState({
        isDragging: true,
        stickyId,
        startPos: { x: e.clientX, y: e.clientY },
        startStickyPos: sticky.position,
      });
    },
    [stickies]
  );

  const handleStickyMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!stickyDragState.isDragging || !stickyDragState.stickyId) return;

      const sticky = stickies.find((s) => s.id === stickyDragState.stickyId);
      if (!sticky || sticky.isExpanded) return;

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

      setStickies((prevStickies) =>
        prevStickies.map((s) =>
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

  useEffect(() => {
    const handleResize = () => {
      setStickies((prevStickies) =>
        prevStickies.map((sticky) => {
          if (sticky.isExpanded) {
            return {
              ...sticky,
              position: {
                x: STICKY_MARGIN,
                y: 40 + STICKY_MARGIN,
              },
            };
          }

          if (isMobile && sticky.type === 'privacy') {
            return {
              ...sticky,
              position: {
                x: window.innerWidth - STICKY_WIDTH - STICKY_MARGIN,
                y: window.innerHeight - STICKY_HEIGHT - 80,
              },
            };
          }

          return {
            ...sticky,
            position: {
              x: Math.min(sticky.position.x, window.innerWidth - STICKY_WIDTH),
              y: Math.min(
                sticky.position.y,
                window.innerHeight - dockHeight - STICKY_HEIGHT - STICKY_MARGIN
              ),
            },
          };
        })
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dockHeight, isMobile]);

  return {
    stickies,
    handleStickyMouseDown,
    handleToggleExpand,
  };
};
