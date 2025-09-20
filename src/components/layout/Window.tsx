import React from 'react';
import type { WindowState } from '../../types';

interface WindowProps {
  window: WindowState;
  onMouseDown: (e: React.MouseEvent, windowId: string) => void;
  onClose: (windowId: string) => void;
  onMinimize: (windowId: string) => void;
  onMaximize: (windowId: string) => void;
  onResizeMouseDown: (
    e: React.MouseEvent,
    windowId: string,
    direction: string
  ) => void;
  onBringToFront: (windowId: string) => void;
  isMobile: boolean;
}

const Window = ({
  window,
  onMouseDown,
  onClose,
  onMinimize,
  onMaximize,
  onResizeMouseDown,
  onBringToFront,
  isMobile,
}: WindowProps) => (
  <div
    className={`absolute bg-white/95 backdrop-blur-xl overflow-hidden transition-all duration-300 ${
      isMobile
        ? 'rounded-none border-none max-w-full'
        : 'rounded-2xl shadow-2xl border border-white/20'
    } ${
      window.isMinimized
        ? 'opacity-0 pointer-events-none scale-95 transform-gpu'
        : 'opacity-100 pointer-events-auto scale-100'
    }`}
    style={{
      left: window.position.x,
      top: window.position.y,
      width: window.size.width,
      height: window.size.height,
      zIndex: window.zIndex,
      visibility: window.isMinimized ? 'hidden' : 'visible',
      willChange: 'transform',
      transition: 'none',
    }}
    onMouseDown={(e) => {
      if (!window.isMinimized && !isMobile) {
        onBringToFront(window.id);
        onMouseDown(e, window.id);
      }
    }}
  >
    {/* Title bar with resize handles */}
    <div
      className={`relative flex items-center justify-between border-b border-gray-200/30 ${
        isMobile
          ? 'px-4 py-3'
          : 'px-4 py-1.5 cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* Top-left corner resize handle */}
      {!window.isMaximized && !window.isMinimized && !isMobile && (
        <div
          className="absolute top-0 left-0 w-8 h-full cursor-nw-resize z-20"
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeMouseDown(e, window.id, 'nw');
          }}
          title="Resize"
        />
      )}

      {/* Top edge resize handle */}
      {!window.isMaximized && !window.isMinimized && !isMobile && (
        <div
          className="absolute top-0 left-8 right-8 h-2 cursor-n-resize z-20"
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeMouseDown(e, window.id, 'n');
          }}
          title="Resize"
        />
      )}

      {/* Top-right corner resize handle */}
      {!window.isMaximized && !window.isMinimized && !isMobile && (
        <div
          className="absolute top-0 right-0 w-8 h-full cursor-ne-resize z-20"
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeMouseDown(e, window.id, 'ne');
          }}
          title="Resize"
        />
      )}

      <div className="flex items-center space-x-3 relative z-30">
        {/* Window controls - only show on desktop */}
        {!isMobile && (
          <div className="flex space-x-1.5 window-controls">
            <button
              className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClose(window.id);
              }}
            />
            <button
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                window.isMaximized
                  ? 'bg-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (!window.isMaximized) {
                  onMinimize(window.id);
                }
              }}
              disabled={window.isMaximized}
            />
            <button
              className="w-2.5 h-2.5 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onMaximize(window.id);
              }}
            />
          </div>
        )}
        <div className="flex items-center space-x-3 pointer-events-none">
          <span
            className={`font-light text-gray-900 ${
              isMobile ? 'text-base' : 'text-sm'
            }`}
          >
            {window.title}
          </span>
        </div>
      </div>
    </div>

    {/* Content area */}
    <div
      className="overflow-auto relative"
      style={{
        height: isMobile ? `calc(100% - 48px)` : `calc(100% - 33px)`,
      }}
      onMouseDown={() => {
        if (!window.isMinimized && !isMobile) {
          onBringToFront(window.id);
        }
      }}
    >
      {window.content}

      {/* Resize handles - only show on desktop */}
      {!window.isMaximized && !window.isMinimized && !isMobile && (
        <>
          {/* Bottom corner handles */}
          <div
            className="absolute bottom-0 left-0 w-6 h-6 cursor-sw-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 'sw')}
            title="Resize"
          />
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 'se')}
            title="Resize"
          />

          {/* Edge handles */}
          <div
            className="absolute bottom-0 left-6 right-6 h-3 cursor-s-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 's')}
            title="Resize"
          />
          <div
            className="absolute left-0 top-6 bottom-6 w-3 cursor-w-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 'w')}
            title="Resize"
          />
          <div
            className="absolute right-0 top-6 bottom-6 w-3 cursor-e-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 'e')}
            title="Resize"
          />
        </>
      )}
    </div>
  </div>
);

export default Window;
