import React from 'react';
import DesktopIcon from './DesktopIcon';
import type { DockItem, Position } from '../../types';

interface DesktopProps {
  dockItems: DockItem[];
  desktopIconPositions: Record<string, Position>;
  selectedIcon: string | null;
  iconDragState: {
    isDragging: boolean;
    iconId: string | null;
  };
  hasDraggedIcon: boolean;
  imageLoaded: boolean;
  isMobile: boolean;
  onIconMouseDown: (
    e: React.MouseEvent,
    iconId: string,
    position: Position
  ) => void;
  onIconClick: (
    e: React.MouseEvent,
    iconId: string,
    hasDragged: boolean,
    onDockItemClick: (id: string) => void
  ) => void;
  onDockItemClick: (itemId: string) => void;
}

const Desktop: React.FC<DesktopProps> = ({
  dockItems,
  desktopIconPositions,
  selectedIcon,
  iconDragState,
  hasDraggedIcon,
  imageLoaded,
  isMobile,
  onIconMouseDown,
  onIconClick,
  onDockItemClick,
}) => {
  return (
    <div className="absolute inset-0">
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: 'url(/bagel.png)',
          backgroundColor: '#fff',
          filter: imageLoaded ? 'blur(0px)' : 'blur(5px)',
          transition: 'filter 1s ease-in-out',
          zIndex: 0,
        }}
      >
        {/* Desktop icons - only show on desktop */}
        {!isMobile &&
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
                onMouseDown={(e) => onIconMouseDown(e, item.id, iconPos)}
                onClick={(e) => {
                  e.stopPropagation();
                  onIconClick(e, item.id, hasDraggedIcon, onDockItemClick);
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Desktop;
