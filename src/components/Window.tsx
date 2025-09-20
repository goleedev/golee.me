import React from 'react';
import type { WindowState } from '../types';

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
  isMobile: boolean;
}

const Window = ({
  window,
  onMouseDown,
  onClose,
  onMinimize,
  onMaximize,
  onResizeMouseDown,
  isMobile,
}: WindowProps) => (
  <div
    className={`absolute bg-white/95 backdrop-blur-xl overflow-hidden transition-all duration-300 ${
      isMobile
        ? 'rounded-none border-none'
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
      // minimize 시 완전히 숨김 but DOM에는 유지
      visibility: window.isMinimized ? 'hidden' : 'visible',
      willChange: 'transform',
      transition: 'none',
    }}
    onMouseDown={(e) =>
      !window.isMinimized && !isMobile && onMouseDown(e, window.id)
    }
  >
    {/* Title bar - different styles for mobile */}
    <div
      className={`flex items-center justify-between border-b border-gray-200/30 ${
        isMobile
          ? 'px-4 py-3'
          : 'px-4 py-1.5 cursor-grab active:cursor-grabbing'
      }`}
    >
      <div className="flex items-center space-x-3">
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
      className="overflow-hidden relative"
      style={{
        height: isMobile
          ? `calc(100% - 48px)` // Larger title bar on mobile
          : `calc(100% - 33px)`,
      }}
    >
      {window.content}

      {/* Resize handles - only show on desktop */}
      {!window.isMaximized && !window.isMinimized && !isMobile && (
        <>
          {/* Corner handles - 대각선 리사이즈 */}
          <div
            className="absolute top-0 left-0 w-6 h-6 cursor-nw-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 'nw')}
          />
          <div
            className="absolute top-0 right-0 w-6 h-6 cursor-ne-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 'ne')}
          />
          <div
            className="absolute bottom-0 left-0 w-6 h-6 cursor-sw-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 'sw')}
          />
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 'se')}
          />

          {/* Edge handles - 직선 리사이즈 */}
          <div
            className="absolute top-0 left-6 right-6 h-3 cursor-n-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 'n')}
          />
          <div
            className="absolute bottom-0 left-6 right-6 h-3 cursor-s-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 's')}
          />
          <div
            className="absolute left-0 top-6 bottom-6 w-3 cursor-w-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 'w')}
          />
          <div
            className="absolute right-0 top-6 bottom-6 w-3 cursor-e-resize z-10"
            onMouseDown={(e) => onResizeMouseDown(e, window.id, 'e')}
          />
        </>
      )}
    </div>
  </div>
);

export default Window;
