// Layout constants
export const MENU_BAR_HEIGHT = 40;
export const DOCK_HEIGHT_DESKTOP = 64;
export const DOCK_HEIGHT_MOBILE = 70;
export const WINDOW_MARGIN = 0;

export const MIN_WINDOW_WIDTH = 400;
export const MIN_WINDOW_HEIGHT = 200;

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
export const getWindowSizes = (dockHeight: number) => ({
  default: { width: 600, height: 500 },
  music: { width: 400, height: 600 },
  mobile: {
    width: window.innerWidth, // Use full width for mobile
    height: window.innerHeight - MENU_BAR_HEIGHT - dockHeight,
  },
});

// Icon positions for bagel layout
export const getBagelIconPositions = (centerX: number, centerY: number) => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const minDimension = Math.min(screenWidth, screenHeight);

  const scaleFactor = minDimension < 600 ? 0.15 : 0.21;
  const baseRadius = Math.min(minDimension * scaleFactor, 200);
  const radiusX = Math.max(baseRadius, 60);
  const radiusY = Math.max(baseRadius * 1.05, 65);

  // Calculate about me position first
  const aboutX = centerX + radiusX * Math.cos((220 * Math.PI) / 180);
  const aboutY = centerY + radiusY * Math.sin((230 * Math.PI) / 180);

  // Calculate blog position: 45 degrees up and to the right from about me
  const distance = 70; // Distance from about me icon
  const blogX = aboutX + distance * Math.cos((45 * Math.PI) / 180);
  const blogY = aboutY - distance * Math.sin((45 * Math.PI) / 180);

  return {
    about: {
      x: aboutX,
      y: aboutY,
    },
    work: {
      x: centerX + radiusX * Math.cos((350 * Math.PI) / 180),
      y: centerY + radiusY * Math.sin((300 * Math.PI) / 180),
    },
    blog: {
      x: blogX,
      y: blogY,
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
