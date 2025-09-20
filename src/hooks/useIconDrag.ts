import { useCallback, useEffect, useState } from 'react';
import type { Position } from '../types';

interface IconDragState {
  isDragging: boolean;
  iconId: string | null;
  startPos: Position;
  startIconPos: Position;
}

export const useIconDrag = (
  setDesktopIconPositions: React.Dispatch<
    React.SetStateAction<Record<string, Position>>
  >,
  dockHeight: number
) => {
  const [iconDragState, setIconDragState] = useState<IconDragState>({
    isDragging: false,
    iconId: null,
    startPos: { x: 0, y: 0 },
    startIconPos: { x: 0, y: 0 },
  });

  const [hasDraggedIcon, setHasDraggedIcon] = useState(false);

  const handleIconMouseDown = useCallback(
    (e: React.MouseEvent, iconId: string, currentPos: Position) => {
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
    []
  );

  const handleIconMouseMove = useCallback(
    (e: MouseEvent) => {
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
        y: Math.max(
          72,
          Math.min(newPosition.y, window.innerHeight - dockHeight - 32)
        ),
      };

      setDesktopIconPositions((prev) => ({
        ...prev,
        [iconDragState.iconId!]: constrainedPosition,
      }));
    },
    [iconDragState, setDesktopIconPositions, dockHeight]
  );

  const handleIconMouseUp = useCallback(() => {
    setIconDragState({
      isDragging: false,
      iconId: null,
      startPos: { x: 0, y: 0 },
      startIconPos: { x: 0, y: 0 },
    });

    setTimeout(() => {
      setHasDraggedIcon(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (iconDragState.iconId) {
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
  ]);

  return {
    iconDragState,
    hasDraggedIcon,
    handleIconMouseDown,
  };
};
