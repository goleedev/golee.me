import { useEffect, useState } from 'react';
import {
  RESPONSIVE_BREAKPOINTS,
  DOCK_HEIGHT_DESKTOP,
  DOCK_HEIGHT_MOBILE,
} from '../data/constants';

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= RESPONSIVE_BREAKPOINTS.mobile
  );

  useEffect(() => {
    const checkMobile = () => {
      // Add a small buffer to prevent flickering at exact breakpoint
      const buffer = 5;
      setIsMobile(window.innerWidth <= RESPONSIVE_BREAKPOINTS.mobile + buffer);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const dockHeight = isMobile ? DOCK_HEIGHT_MOBILE : DOCK_HEIGHT_DESKTOP;

  return {
    isMobile,
    dockHeight,
    isTablet:
      window.innerWidth >= RESPONSIVE_BREAKPOINTS.mobile &&
      window.innerWidth < RESPONSIVE_BREAKPOINTS.tablet,
    isDesktop: window.innerWidth >= RESPONSIVE_BREAKPOINTS.desktop,
  };
};
