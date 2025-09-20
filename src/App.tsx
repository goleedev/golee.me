import React, { useCallback, useEffect, useRef, useState } from 'react';
import DesktopIcon from './components/DesktopIcon';
import Dock from './components/Dock';
import FolderIcon from './components/FolderIcon';
import MenuBar from './components/MenuBar';
import MusicIcon from './components/MusicIcon';
import NoteIcon from './components/NoteIcon';
import Stickies from './components/Stickies';
import Window from './components/Window';
import { CommunityContent, SpeakingContent } from './components/WindowContent';
import type {
  DockItem,
  DragState,
  IconDragState,
  Position,
  Size,
  StickyDragState,
  StickyState,
  Track,
  WindowState,
} from './types';
import { MusicContent } from './components/window-contents/MusicContent';
import { AboutContent } from './components/window-contents/AboutContent';
import { WorkContent } from './components/window-contents/WorkContent';
import { MentorshipContent } from './components/window-contents/MentorshipContent';
import { GuestbookContent } from './components/window-contents/GuestbookContent';

const MacOSPortfolio = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [dockItems, setDockItems] = useState<DockItem[]>([]);
  const [stickies, setStickies] = useState<StickyState[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(1000);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isLoadingTrack, setIsLoadingTrack] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    windowId: null,
    startPos: { x: 0, y: 0 },
    startWindowPos: { x: 0, y: 0 },
  });

  const [iconDragState, setIconDragState] = useState<IconDragState>({
    isDragging: false,
    iconId: null,
    startPos: { x: 0, y: 0 },
    startIconPos: { x: 0, y: 0 },
  });

  const [stickyDragState, setStickyDragState] = useState<StickyDragState>({
    isDragging: false,
    stickyId: null,
    startPos: { x: 0, y: 0 },
    startStickyPos: { x: 0, y: 0 },
  });

  const [hasDraggedIcon, setHasDraggedIcon] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [resizeState, setResizeState] = useState<{
    isResizing: boolean;
    windowId: string | null;
    direction: string;
    startPos: Position;
    startSize: Size;
  }>({
    isResizing: false,
    windowId: null,
    direction: '',
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
  });

  const [desktopIconPositions, setDesktopIconPositions] = useState<
    Record<string, Position>
  >({});

  const desktopRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(null);

  // Constants for layout constraints
  const MENU_BAR_HEIGHT = 40;
  const DOCK_HEIGHT = 70;
  const WINDOW_MARGIN = 0;

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Window contents mapping
  const getWindowContent = (id: string) => {
    const contents = {
      about: <AboutContent />,
      work: <WorkContent />,
      speaking: <SpeakingContent />,
      community: <CommunityContent />,
      mentorship: <MentorshipContent />,
      guestbook: <GuestbookContent />,
      music: (
        <MusicContent
          currentTrack={currentTrack}
          isLoadingTrack={isLoadingTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      ),
    };
    return contents[id as keyof typeof contents] || <AboutContent />;
  };

  // All icons are now folder-style with consistent design (no hover effects)
  const initialDockItems = [
    {
      id: 'about',
      icon: <NoteIcon />,
      title: 'About Me',
      isActive: false,
      bounceCount: 0,
      angle: -90,
      zIndex: 10,
    },
    {
      id: 'work',
      icon: <FolderIcon />,
      title: 'Work',
      isActive: false,
      bounceCount: 0,
      angle: -60,
      zIndex: 11,
    },
    {
      id: 'community',
      icon: <FolderIcon />,
      title: 'Community',
      isActive: false,
      bounceCount: 0,
      angle: -30,
      zIndex: 12,
    },
    {
      id: 'mentorship',
      icon: <FolderIcon />,
      title: 'Mentorship',
      isActive: false,
      bounceCount: 0,
      angle: 0,
      zIndex: 13,
    },
    {
      id: 'speaking',
      icon: <FolderIcon />,
      title: 'Speaking',
      isActive: false,
      bounceCount: 0,
      angle: 30,
      zIndex: 14,
    },
    {
      id: 'guestbook',
      icon: <FolderIcon />,
      title: 'Guest Book',
      isActive: false,
      bounceCount: 0,
      angle: 60,
      zIndex: 15,
    },
    {
      id: 'music',
      icon: <MusicIcon />,
      title: 'Music',
      isActive: false,
      bounceCount: 0,
      angle: 90,
      zIndex: 16,
    },
  ];

  // Initialize
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = '/bagel.png';

    const timeout = setTimeout(() => setImageLoaded(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Get specific icon positions based on the exact image layout
  const getBagelIconPositions = (centerX: number, centerY: number) => {
    // 베이글의 타원형 반지름
    const radiusX = Math.min(window.innerWidth, window.innerHeight) * 0.21;
    const radiusY = Math.min(window.innerWidth, window.innerHeight) * 0.22;

    // 시계 방향: 12시가 -90°(270°), 3시가 0°, 6시가 90°, 9시가 180°
    return {
      // About Me - 10시 방향 (10시 = 210°)
      about: {
        x: centerX + radiusX * Math.cos((220 * Math.PI) / 180),
        y: centerY + radiusY * Math.sin((230 * Math.PI) / 180),
      },
      // Work - 2시 방향 (2시 = -30° = 330°)
      work: {
        x: centerX + radiusX * Math.cos((350 * Math.PI) / 180),
        y: centerY + radiusY * Math.sin((300 * Math.PI) / 180),
      },
      // Community - 2시 방향 아래 왼쪽 (1시 30분 = 315°)
      community: {
        x: centerX + radiusX * Math.cos((315 * Math.PI) / 180),
        y: centerY + radiusY * Math.sin((320 * Math.PI) / 180),
      },
      // Speaking - 2시 방향 아래 오른쪽 (2시 30분 = 345°)
      speaking: {
        x: centerX + radiusX * Math.cos((360 * Math.PI) / 180),
        y: centerY + radiusY * Math.sin((345 * Math.PI) / 180),
      },
      // Music - 5시 방향 (5시 = 60°)
      music: {
        x: centerX + radiusX * Math.cos((40 * Math.PI) / 180),
        y: centerY + radiusY * Math.sin((60 * Math.PI) / 180),
      },
      // Mentorship - 7시 방향 (7시 = 120°)
      mentorship: {
        x: centerX + radiusX * Math.cos((120 * Math.PI) / 180),
        y: centerY + radiusY * Math.sin((130 * Math.PI) / 180),
      },
      // Guest Book - 7시 방향 근처 (8시 = 150°)
      guestbook: {
        x: centerX + radiusX * Math.cos((150 * Math.PI) / 180),
        y: centerY + radiusY * Math.sin((150 * Math.PI) / 180),
      },
    };
  };

  useEffect(() => {
    setDockItems(initialDockItems);

    if (!isMobile) {
      const centerX = window.innerWidth * 0.5;
      const centerY = window.innerHeight * 0.5;
      const positions = getBagelIconPositions(centerX, centerY);
      setDesktopIconPositions(positions);
    }

    // Initialize stickies
    setStickies([
      {
        id: 'analytics',
        position: { x: 16, y: 64 },
        zIndex: 1001,
      },
    ]);

    fetchYouTubeTrack();
  }, [isMobile]);

  useEffect(() => {
    const updateDesktopSize = () => {
      if (desktopRef.current && !isMobile) {
        if (Object.keys(desktopIconPositions).length === 0) {
          const centerX = window.innerWidth * 0.5;
          const centerY = window.innerHeight * 0.5;
          const positions = getBagelIconPositions(centerX, centerY);
          setDesktopIconPositions(positions);
        }
      }
    };

    updateDesktopSize();
    window.addEventListener('resize', updateDesktopSize);
    return () => window.removeEventListener('resize', updateDesktopSize);
  }, [desktopIconPositions, isMobile]);

  const fetchYouTubeTrack = async () => {
    setIsLoadingTrack(true);

    const track: Track = {
      id: 'rA6DIHIg5To',
      title: 'Gone Girl',
      artist: 'SZA',
      duration: '3:59',
      thumbnail: 'https://img.youtube.com/vi/rA6DIHIg5To/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=rA6DIHIg5To',
    };

    setTimeout(() => {
      setCurrentTrack(track);
      setIsLoadingTrack(false);
    }, 1000);
  };

  // Updated constrainPosition to avoid dock area (desktop only)
  const constrainPosition = (pos: Position, size: Size): Position => {
    if (isMobile) {
      return { x: 0, y: MENU_BAR_HEIGHT };
    }

    const availableHeight = window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT;

    return {
      x: Math.max(
        WINDOW_MARGIN,
        Math.min(pos.x, window.innerWidth - size.width - WINDOW_MARGIN)
      ),
      y: Math.max(
        MENU_BAR_HEIGHT,
        Math.min(pos.y, availableHeight - size.height + MENU_BAR_HEIGHT)
      ),
    };
  };

  // Updated constrainSize for resize operations (desktop only)
  const constrainSize = (size: Size, position: Position): Size => {
    if (isMobile) {
      return {
        width: window.innerWidth,
        height: window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT,
      };
    }

    const maxWidth = window.innerWidth - position.x - WINDOW_MARGIN;
    const maxHeight =
      window.innerHeight -
      MENU_BAR_HEIGHT -
      DOCK_HEIGHT -
      position.y +
      MENU_BAR_HEIGHT;

    return {
      width: Math.min(Math.max(300, size.width), maxWidth),
      height: Math.min(Math.max(200, size.height), maxHeight),
    };
  };

  // 아이콘을 맨 앞으로 가져오는 함수
  const bringIconToFront = useCallback(
    (iconId: string) => {
      if (isMobile) return; // Disable on mobile

      setDockItems((items) => {
        const maxZIndex = Math.max(...items.map((item) => item.zIndex));
        return items.map((item) =>
          item.id === iconId ? { ...item, zIndex: maxZIndex + 1 } : item
        );
      });
    },
    [isMobile]
  );

  // 스티키를 맨 앞으로 가져오는 함수
  const bringStickyToFront = useCallback(
    (stickyId: string) => {
      if (isMobile) return; // Disable drag on mobile

      setStickies((stickies) =>
        stickies.map((s) =>
          s.id === stickyId ? { ...s, zIndex: highestZIndex + 1 } : s
        )
      );
      setHighestZIndex((prev) => prev + 1);
    },
    [highestZIndex, isMobile]
  );

  const openWindow = (windowId: string) => {
    const existingWindow = windows.find((w) => w.id === windowId);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows(
          windows.map((w) =>
            w.id === windowId
              ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 }
              : w
          )
        );
        setHighestZIndex((prev) => prev + 1);
      } else {
        bringToFront(windowId);
      }
      return;
    }

    const dockItem = initialDockItems.find((item) => item.id === windowId);
    if (!dockItem) return;

    // Mobile: full screen, Desktop: normal size
    const baseSize = isMobile
      ? {
          width: window.innerWidth,
          height: window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT,
        }
      : { width: 600, height: 500 };

    const newSize = isMobile
      ? baseSize
      : windowId === 'music'
      ? { width: 300, height: 500 }
      : baseSize;

    const newWindow: WindowState = {
      id: windowId,
      title: dockItem.title,
      icon: dockItem.icon,
      content: getWindowContent(windowId),
      isOpen: true,
      isMinimized: false,
      isMaximized: isMobile, // Always maximized on mobile
      zIndex: highestZIndex + 1,
      position: constrainPosition(
        isMobile
          ? { x: 0, y: MENU_BAR_HEIGHT }
          : {
              x: Math.random() * 200 + 100,
              y: Math.random() * 100 + 80,
            },
        newSize
      ),
      size: newSize,
    };

    setWindows([...windows, newWindow]);
    setHighestZIndex((prev) => prev + 1);

    setDockItems((items) =>
      items.map((item) =>
        item.id === windowId
          ? { ...item, isActive: true, bounceCount: 0 }
          : item
      )
    );
  };

  const closeWindow = (windowId: string) => {
    setWindows(windows.filter((w) => w.id !== windowId));
    setDockItems((items) =>
      items.map((item) =>
        item.id === windowId
          ? { ...item, isActive: false, bounceCount: 0 }
          : item
      )
    );
  };

  const minimizeWindow = (windowId: string) => {
    if (isMobile) return; // Disable minimize on mobile

    setWindows(
      windows.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w))
    );

    setDockItems((items) =>
      items.map((item) =>
        item.id === windowId
          ? { ...item, bounceCount: item.bounceCount + 1 }
          : item
      )
    );
  };

  // Updated maximizeWindow to avoid dock area (disabled on mobile)
  const maximizeWindow = (windowId: string) => {
    if (isMobile) return; // Already maximized on mobile

    const availableHeight = window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT;

    setWindows(
      windows.map((w): WindowState => {
        if (w.id !== windowId) return w;

        if (w.isMaximized) {
          // 이미 최대화된 상태라면 원래 크기로 복원
          const restoredPosition = w.originalPosition || w.position;
          const restoredSize = w.originalSize || w.size;

          return {
            ...w,
            isMaximized: false,
            position: restoredPosition,
            size: restoredSize,
            // 복원 후에는 original 값들을 제거
            originalPosition: undefined,
            originalSize: undefined,
          };
        } else {
          // 최대화되지 않은 상태라면 최대화하면서 원래 위치/크기 저장
          return {
            ...w,
            isMaximized: true,
            originalPosition: { ...w.position }, // 현재 위치 저장
            originalSize: { ...w.size }, // 현재 크기 저장
            position: { x: WINDOW_MARGIN, y: MENU_BAR_HEIGHT },
            size: {
              width: window.innerWidth - WINDOW_MARGIN * 2,
              height: availableHeight - WINDOW_MARGIN,
            },
          };
        }
      })
    );
  };

  const bringToFront = (windowId: string) => {
    setWindows(
      windows.map((w) =>
        w.id === windowId ? { ...w, zIndex: highestZIndex + 1 } : w
      )
    );
    setHighestZIndex((prev) => prev + 1);
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, windowId: string) => {
      if (isMobile) return; // Disable drag on mobile
      if ((e.target as HTMLElement).closest('.window-controls')) return;

      const window = windows.find((w) => w.id === windowId);
      if (!window || window.isMaximized) return;

      bringToFront(windowId);

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
    [dragState, windows, constrainPosition, isMobile]
  );

  const handleIconMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isMobile) return; // Disable icon drag on mobile

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
          Math.min(newPosition.y, window.innerHeight - DOCK_HEIGHT - 32)
        ),
      };

      setDesktopIconPositions((prev) => ({
        ...prev,
        [iconDragState.iconId!]: constrainedPosition,
      }));
    },
    [iconDragState, isMobile]
  );

  // 스티키 드래그 핸들러들
  const handleStickyMouseDown = useCallback(
    (e: React.MouseEvent, stickyId: string) => {
      if (isMobile) return; // Disable sticky drag on mobile

      e.preventDefault();
      e.stopPropagation();

      const sticky = stickies.find((s) => s.id === stickyId);
      if (!sticky) return;

      bringStickyToFront(stickyId);

      setStickyDragState({
        isDragging: true,
        stickyId,
        startPos: { x: e.clientX, y: e.clientY },
        startStickyPos: sticky.position,
      });
    },
    [stickies, bringStickyToFront, isMobile]
  );

  const handleStickyMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isMobile || !stickyDragState.isDragging || !stickyDragState.stickyId)
        return;

      const deltaX = e.clientX - stickyDragState.startPos.x;
      const deltaY = e.clientY - stickyDragState.startPos.y;

      const newPosition = {
        x: stickyDragState.startStickyPos.x + deltaX,
        y: stickyDragState.startStickyPos.y + deltaY,
      };

      const constrainedPosition = {
        x: Math.max(0, Math.min(newPosition.x, window.innerWidth - 256)),
        y: Math.max(
          MENU_BAR_HEIGHT,
          Math.min(newPosition.y, window.innerHeight - DOCK_HEIGHT - 288)
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
    [stickyDragState, stickies, isMobile]
  );

  const handleStickyMouseUp = useCallback(() => {
    if (isMobile) return;

    setStickyDragState({
      isDragging: false,
      stickyId: null,
      startPos: { x: 0, y: 0 },
      startStickyPos: { x: 0, y: 0 },
    });
  }, [isMobile]);

  const handleMouseUp = useCallback(() => {
    if (isMobile) return;

    setDragState({
      isDragging: false,
      windowId: null,
      startPos: { x: 0, y: 0 },
      startWindowPos: { x: 0, y: 0 },
    });
  }, [isMobile]);

  const handleIconMouseUp = useCallback(() => {
    if (isMobile) return;

    setIconDragState({
      isDragging: false,
      iconId: null,
      startPos: { x: 0, y: 0 },
      startIconPos: { x: 0, y: 0 },
    });

    setTimeout(() => {
      setHasDraggedIcon(false);
    }, 100);
  }, [isMobile]);

  const handleIconClick = useCallback(
    (e: React.MouseEvent, iconId: string) => {
      if (isMobile) return; // Disable desktop icons on mobile

      e.preventDefault();
      e.stopPropagation();

      if (hasDraggedIcon) return;

      bringIconToFront(iconId);

      const currentTime = Date.now();
      const isDoubleClick =
        currentTime - lastClickTime < 500 && selectedIcon === iconId;

      if (isDoubleClick) {
        dockItemClick(iconId);
        setSelectedIcon(null);
      } else {
        setSelectedIcon(iconId);
        setLastClickTime(currentTime);
      }
    },
    [hasDraggedIcon, lastClickTime, selectedIcon, bringIconToFront, isMobile]
  );

  useEffect(() => {
    const handleDocumentClick = () => {
      if (!isMobile) {
        setSelectedIcon(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [isMobile]);

  const handleIconMouseDown = useCallback(
    (e: React.MouseEvent, iconId: string) => {
      if (isMobile) return; // Disable desktop icons on mobile

      e.preventDefault();
      e.stopPropagation();

      const currentPos = desktopIconPositions[iconId];
      if (!currentPos) return;

      bringIconToFront(iconId);

      setHasDraggedIcon(false);

      setIconDragState({
        isDragging: false,
        iconId,
        startPos: { x: e.clientX, y: e.clientY },
        startIconPos: currentPos,
      });
    },
    [desktopIconPositions, bringIconToFront, isMobile]
  );

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

  useEffect(() => {
    if (!isMobile && iconDragState.iconId) {
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
    isMobile,
  ]);

  // 스티키 드래그 이벤트 리스너
  useEffect(() => {
    if (!isMobile && stickyDragState.isDragging) {
      document.addEventListener('mousemove', handleStickyMouseMove);
      document.addEventListener('mouseup', handleStickyMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleStickyMouseMove);
        document.removeEventListener('mouseup', handleStickyMouseUp);
      };
    }
  }, [
    stickyDragState.isDragging,
    handleStickyMouseMove,
    handleStickyMouseUp,
    isMobile,
  ]);

  // Dock hover animation effect - Only tooltip, no scaling (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const dockItems = document.querySelectorAll('.dock-item');

    dockItems.forEach((item) => {
      const tooltip = item.querySelector('.tooltip') as HTMLElement;

      item.addEventListener('mouseenter', () => {
        if (tooltip) {
          tooltip.style.opacity = '0.8';
          tooltip.style.transform = 'translateY(0px) translateX(-50%)';
        }
      });

      item.addEventListener('mouseleave', () => {
        if (tooltip) {
          tooltip.style.opacity = '0';
          tooltip.style.transform = 'translateY(10px) translateX(-50%)';
        }
      });
    });

    const dockContainer = document.querySelector('.fixed.bottom-2');
    if (dockContainer) {
      dockContainer.addEventListener('mouseleave', () => {
        const allTooltips = document.querySelectorAll('.tooltip');
        allTooltips.forEach((tooltip) => {
          const tooltipEl = tooltip as HTMLElement;
          tooltipEl.style.opacity = '0';
          tooltipEl.style.transform = 'translateY(10px) translateX(-50%)';
        });
      });
    }

    return () => {
      dockItems.forEach((item) => {
        item.removeEventListener('mouseenter', () => {});
        item.removeEventListener('mouseleave', () => {});
      });
      if (dockContainer) {
        dockContainer.removeEventListener('mouseleave', () => {});
      }
    };
  }, [dockItems, isMobile]);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, windowId: string, direction: string) => {
      if (isMobile) return; // Disable resize on mobile

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
      });
    },
    [windows, isMobile]
  );

  // Updated handleResizeMouseMove with dock constraints (desktop only)
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
        const newPosition = { ...window.position };

        switch (resizeState.direction) {
          case 'se':
            newSize.width = Math.max(300, resizeState.startSize.width + deltaX);
            newSize.height = Math.max(
              200,
              resizeState.startSize.height + deltaY
            );
            break;
          case 'sw':
            newSize.width = Math.max(300, resizeState.startSize.width - deltaX);
            newSize.height = Math.max(
              200,
              resizeState.startSize.height + deltaY
            );
            newPosition.x =
              window.position.x + (resizeState.startSize.width - newSize.width);
            break;
          case 'ne':
            newSize.width = Math.max(300, resizeState.startSize.width + deltaX);
            newSize.height = Math.max(
              200,
              resizeState.startSize.height - deltaY
            );
            newPosition.y =
              window.position.y +
              (resizeState.startSize.height - newSize.height);
            break;
          case 'nw':
            newSize.width = Math.max(300, resizeState.startSize.width - deltaX);
            newSize.height = Math.max(
              200,
              resizeState.startSize.height - deltaY
            );
            newPosition.x =
              window.position.x + (resizeState.startSize.width - newSize.width);
            newPosition.y =
              window.position.y +
              (resizeState.startSize.height - newSize.height);
            break;
          case 'n':
            newSize.height = Math.max(
              200,
              resizeState.startSize.height - deltaY
            );
            newPosition.y =
              window.position.y +
              (resizeState.startSize.height - newSize.height);
            break;
          case 's':
            newSize.height = Math.max(
              200,
              resizeState.startSize.height + deltaY
            );
            break;
          case 'e':
            newSize.width = Math.max(300, resizeState.startSize.width + deltaX);
            break;
          case 'w':
            newSize.width = Math.max(300, resizeState.startSize.width - deltaX);
            newPosition.x =
              window.position.x + (resizeState.startSize.width - newSize.width);
            break;
        }

        // Apply constraints for both size and position
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
    [resizeState, windows, constrainSize, constrainPosition, isMobile]
  );

  const handleResizeMouseUp = useCallback(() => {
    if (isMobile) return;

    setResizeState({
      isResizing: false,
      windowId: null,
      direction: '',
      startPos: { x: 0, y: 0 },
      startSize: { width: 0, height: 0 },
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

  const dockItemClick = (itemId: string) => {
    const existingWindow = windows.find((w) => w.id === itemId);
    if (existingWindow && existingWindow.isMinimized && !isMobile) {
      // Restore minimized window (desktop only)
      setWindows(
        windows.map((w) =>
          w.id === itemId
            ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 }
            : w
        )
      );
      setHighestZIndex((prev) => prev + 1);
    } else if (existingWindow && !existingWindow.isMinimized) {
      // Bring to front if already open
      bringToFront(itemId);
    } else {
      // Open new window
      openWindow(itemId);
    }
  };

  return (
    <div
      ref={desktopRef}
      className="h-screen w-full relative overflow-hidden bg-gray-100"
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-light">Loading...</p>
          </div>
        </div>
      )}
      <MenuBar currentTime={currentTime} />

      {/* 스티키 노트 렌더링 */}
      {stickies.map((sticky) => (
        <Stickies
          key={sticky.id}
          sticky={sticky}
          onMouseDown={handleStickyMouseDown}
          isMobile={isMobile}
        />
      ))}

      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: 'url(/bagel.png)',
            backgroundColor: '#fff',
            filter: imageLoaded ? 'none' : 'blur(5px)',
            transition: 'filter 0.5s ease-in-out',
            opacity: imageLoaded ? 1 : 0,
            transitionDelay: imageLoaded ? '0.5s' : '0s',
          }}
          onLoad={() => setImageLoaded(true)}
        >
          {/* Desktop icons - only show on desktop */}
          {!isMobile &&
            imageLoaded &&
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
                  onMouseDown={handleIconMouseDown}
                  onClick={handleIconClick}
                />
              );
            })}
        </div>
      </div>

      {windows
        .filter((w) => w.isOpen)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => (
          <Window
            key={window.id}
            window={window}
            onMouseDown={handleMouseDown}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onResizeMouseDown={handleResizeMouseDown}
            isMobile={isMobile}
          />
        ))}

      <Dock
        dockItems={dockItems}
        windows={windows}
        onDockItemClick={dockItemClick}
        isMobile={isMobile}
      />
    </div>
  );
};

export default MacOSPortfolio;
