import React from 'react';
import type { DockItem, Position } from '../../types';

interface DesktopIconProps {
  item: DockItem;
  position: Position;
  isSelected: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent, iconId: string) => void;
  onClick: (e: React.MouseEvent, iconId: string) => void;
}

const DesktopIcon = ({
  item,
  position,
  isSelected,
  isDragging,
  onMouseDown,
  onClick,
}: DesktopIconProps) => (
  <div
    className="absolute cursor-pointer group select-none flex flex-col items-center"
    style={{
      left: position.x,
      top: position.y,
      transform: 'translate(-50%, -50%)',
      cursor: isDragging ? 'grabbing' : 'pointer',
      zIndex: item.zIndex, // 아이콘의 z-index 적용
    }}
    onMouseDown={(e) => onMouseDown(e, item.id)}
    onClick={(e) => onClick(e, item.id)}
  >
    {/* Icon Container with Selection State */}
    <div className="relative mb-1">
      {/* Selection Background - appears behind icon when selected */}
      {isSelected && (
        <div className="absolute -inset-1 bg-black/20 rounded-lg"></div>
      )}

      {/* Selection Border - appears around icon when selected */}
      {isSelected && (
        <div className="absolute -inset-1 border border-white/60 rounded-lg"></div>
      )}

      {/* Icon */}
      <div
        className={`transform transition-all duration-300 relative z-10 ${
          isDragging ? 'scale-105 opacity-90' : 'hover:brightness-110'
        }`}
      >
        {item.icon}
      </div>
    </div>

    {/* Title */}
    <div
      className={`text-xs font-medium px-2 py-0.5 rounded text-center max-w-20 leading-tight ${
        isSelected
          ? 'bg-blue-500 text-white shadow-sm'
          : 'text-white drop-shadow-md hover:bg-white/10'
      }`}
      style={{
        textShadow: isSelected ? 'none' : '0 1px 2px rgba(0,0,0,0.8)',
      }}
    >
      {item.title}
    </div>
  </div>
);

export default DesktopIcon;
