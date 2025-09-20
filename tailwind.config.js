/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        macos: {
          bg: '#E5E5E7',
          window: 'rgba(255, 255, 255, 0.8)',
          dock: 'rgba(255, 255, 255, 0.3)',
          blue: '#007AFF',
          red: '#FF3B30',
          yellow: '#FFCC00',
          green: '#34C759',
          folder: '#54C7FC',
          text: '#1D1D1F',
          'text-secondary': '#86868B',
        },
      },
      fontFamily: {
        sf: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'sans-serif',
        ],
      },
      backdropBlur: {
        macos: '20px',
      },
      boxShadow: {
        'macos-window': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'macos-dock': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'macos-icon': '0 4px 20px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'dock-bounce': 'dockBounce 0.6s ease-out',
        'window-open': 'windowOpen 0.3s ease-out',
      },
      keyframes: {
        dockBounce: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
          '100%': { transform: 'translateY(0)' },
        },
        windowOpen: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
