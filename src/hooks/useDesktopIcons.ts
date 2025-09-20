import { useState, useEffect, useCallback } from 'react';
import type { Position } from '../types';
import { getBagelIconPositions } from '../data/constants';

export const useDesktopIcons = (isMobile: boolean) => {
  const [desktopIconPositions, setDesktopIconPositions] = useState<
    Record<string, Position>
  >({});
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [lastClickTime, setLastClickTime] = useState(0);

  const bringIconToFront = useCallback(() => {
    if (isMobile) return;
    // This would need to be handled by the parent component
  }, [isMobile]);

  const handleIconClick = useCallback(
    (
      e: React.MouseEvent,
      iconId: string,
      hasDraggedIcon: boolean,
      onDockItemClick: (id: string) => void
    ) => {
      if (isMobile) return;

      e.preventDefault();
      e.stopPropagation();

      if (hasDraggedIcon) return;

      bringIconToFront();

      const currentTime = Date.now();
      const isDoubleClick =
        currentTime - lastClickTime < 500 && selectedIcon === iconId;

      if (isDoubleClick) {
        onDockItemClick(iconId);
        setSelectedIcon(null);
      } else {
        setSelectedIcon(iconId);
        setLastClickTime(currentTime);
      }
    },
    [lastClickTime, selectedIcon, bringIconToFront, isMobile]
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

  useEffect(() => {
    if (!isMobile) {
      const centerX = window.innerWidth * 0.5;
      const centerY = window.innerHeight * 0.5;
      const positions = getBagelIconPositions(centerX, centerY);
      setDesktopIconPositions(positions);
    }
  }, [isMobile]);

  useEffect(() => {
    const updateDesktopSize = () => {
      if (!isMobile) {
        const centerX = window.innerWidth * 0.5;
        const centerY = window.innerHeight * 0.5;
        const positions = getBagelIconPositions(centerX, centerY);
        setDesktopIconPositions(positions);
      }
    };

    updateDesktopSize();
    window.addEventListener('resize', updateDesktopSize);
    return () => window.removeEventListener('resize', updateDesktopSize);
  }, [isMobile]);

  return {
    desktopIconPositions,
    setDesktopIconPositions,
    selectedIcon,
    setSelectedIcon,
    handleIconClick,
  };
};
