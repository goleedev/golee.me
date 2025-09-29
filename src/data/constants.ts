// Layout constants
export const MENU_BAR_HEIGHT = 40;
export const DOCK_HEIGHT = 70;
export const WINDOW_MARGIN = 0;

// Responsive breakpoints
export const RESPONSIVE_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
} as const;

// Check if screen is small enough to auto-maximize windows
export const shouldAutoMaximize = () => {
  return window.innerWidth <= RESPONSIVE_BREAKPOINTS.tablet;
};

// Window size configurations
export const WINDOW_SIZES = {
  default: { width: 600, height: 500 },
  music: { width: 300, height: 500 },
  mobile: {
    width: window.innerWidth,
    height: window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT,
  },
} as const;

// Icon positions for bagel layout
export const getBagelIconPositions = (centerX: number, centerY: number) => {
  // Calculate responsive radius based on screen size
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const minDimension = Math.min(screenWidth, screenHeight);

  // Responsive radius that scales with screen size
  // For smaller screens, make icons closer together
  const scaleFactor = minDimension < 600 ? 0.15 : 0.21; // Closer for small screens
  const baseRadius = Math.min(minDimension * scaleFactor, 200); // Cap at 200px
  const radiusX = Math.max(baseRadius, 60); // Minimum 60px for very small screens
  const radiusY = Math.max(baseRadius * 1.05, 65); // Slightly larger Y radius

  return {
    about: {
      x: centerX + radiusX * Math.cos((220 * Math.PI) / 180),
      y: centerY + radiusY * Math.sin((230 * Math.PI) / 180),
    },
    work: {
      x: centerX + radiusX * Math.cos((350 * Math.PI) / 180),
      y: centerY + radiusY * Math.sin((300 * Math.PI) / 180),
    },
    community: {
      x: centerX + radiusX * Math.cos((315 * Math.PI) / 180),
      y: centerY + radiusY * Math.sin((320 * Math.PI) / 180),
    },
    activities: {
      x: centerX + radiusX * Math.cos((360 * Math.PI) / 180),
      y: centerY + radiusY * Math.sin((345 * Math.PI) / 180),
    },
    music: {
      x: centerX + radiusX * Math.cos((40 * Math.PI) / 180),
      y: centerY + radiusY * Math.sin((60 * Math.PI) / 180),
    },
    mentorship: {
      x: centerX + radiusX * Math.cos((120 * Math.PI) / 180),
      y: centerY + radiusY * Math.sin((130 * Math.PI) / 180),
    },
    guestbook: {
      x: centerX + radiusX * Math.cos((150 * Math.PI) / 180),
      y: centerY + radiusY * Math.sin((150 * Math.PI) / 180),
    },
  };
};
