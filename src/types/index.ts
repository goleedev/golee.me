export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type WindowState = {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: Position;
  size: Size;
  originalPosition?: Position;
  originalSize?: Size;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
  url: string;
};

export type DockItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  bounceCount: number;
  angle: number;
  zIndex: number;
};

export type DragState = {
  isDragging: boolean;
  windowId: string | null;
  startPos: Position;
  startWindowPos: Position;
};

export interface IconDragState {
  isDragging: boolean;
  iconId: string | null;
  startPos: Position;
  startIconPos: Position;
}

export type StickyState = {
  id: string;
  position: Position;
  zIndex: number;
};

export interface StickyDragState {
  isDragging: boolean;
  stickyId: string | null;
  startPos: Position;
  startStickyPos: Position;
}
