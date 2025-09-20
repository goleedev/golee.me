import type { StickyState } from '../types';

export const getInitialStickies = (isMobile: boolean): StickyState[] => {
  if (isMobile) {
    return [
      {
        id: 'analytics',
        type: 'analytics',
        position: { x: 16, y: 64 },
        zIndex: 1000,
        isExpanded: false,
      },
      {
        id: 'privacy',
        type: 'privacy',
        position: {
          x: window.innerWidth - 264 - 16,
          y: window.innerHeight - 208 - 80,
        },
        zIndex: 1001,
        isExpanded: false,
      },
    ];
  }

  return [
    {
      id: 'analytics',
      type: 'analytics',
      position: { x: 16, y: 64 },
      zIndex: 1000,
      isExpanded: false,
    },
    {
      id: 'privacy',
      type: 'privacy',
      position: {
        x: 16 + 100,
        y: 64 + 200,
      },
      zIndex: 1001,
      isExpanded: false,
    },
  ];
};
