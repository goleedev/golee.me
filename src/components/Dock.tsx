import type { DockItem, WindowState } from '../types';
import FolderIcon from './FolderIcon';
import MusicIcon from './MusicIcon';
import NoteIcon from './NoteIcon';

// Icon Component - Folder style with consistent colors
const createIconComponent = (itemId: string) => {
  const folderIcons = {
    about: <NoteIcon />,
    work: <FolderIcon />,
    community: <FolderIcon />,
    mentorship: <FolderIcon />,
    speaking: <FolderIcon />,
    guestbook: <FolderIcon />,
    music: <MusicIcon />,
  };

  return folderIcons[itemId as keyof typeof folderIcons] || folderIcons.about;
};

interface DockItemComponentProps {
  item: DockItem;
  index: number;
  isActive: boolean;
  isMinimized: boolean;
  onClick: (itemId: string) => void;
}

const DockItemComponent = ({
  item,
  index,
  isActive,
  isMinimized,
  onClick,
}: DockItemComponentProps) => (
  <div
    className="relative group cursor-pointer dock-item flex flex-col items-center"
    data-index={index}
    onClick={() => onClick(item.id)}
  >
    {/* Icon Only - No hover effects */}
    <div
      className="relative dock-app-icon"
      style={{
        width: '40px',
        height: '40px',
      }}
    >
      <div className="relative w-full h-full">
        {createIconComponent(item.id)}
      </div>
    </div>

    {/* Active/Minimized indicator dot */}
    {(isActive || isMinimized) && (
      <div className="absolute bottom-[-6px] w-1 h-1 rounded-full bg-black/40" />
    )}

    {/* Tooltip - Only shows on hover */}
    <div
      className="tooltip absolute bottom-full mb-6 px-3 py-2 bg-gray-900/90 text-white text-xs rounded-lg opacity-0 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-lg"
      style={{
        transform: 'translateY(10px) translateX(-50%)',
        left: '50%',
      }}
    >
      {item.title}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90" />
    </div>
  </div>
);

interface DockProps {
  dockItems: DockItem[];
  windows: WindowState[];
  onDockItemClick: (itemId: string) => void;
  isMobile: boolean;
}

const Dock = ({ dockItems, windows, onDockItemClick, isMobile }: DockProps) => {
  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-[9998]">
      <div className="relative">
        <div className="relative px-3 py-2.5 rounded-2xl bg-[#f6f6f6]/20 backdrop-blur-lg shadow-lg border border-[#f6f6f6]/50 hover:bg-[#f6f6f6]/25 transition-all duration-300">
          <div
            className={`relative flex items-end ${
              isMobile ? 'space-x-4' : 'space-x-1.5'
            }`}
          >
            {dockItems.map((item, index) => {
              const isActive = windows.some(
                (w) => w.id === item.id && w.isOpen && !w.isMinimized
              );
              const isMinimized = windows.some(
                (w) => w.id === item.id && w.isOpen && w.isMinimized
              );

              return (
                <DockItemComponent
                  key={item.id}
                  item={item}
                  index={index}
                  isActive={isActive}
                  isMinimized={isMinimized}
                  onClick={onDockItemClick}
                />
              );
            })}
          </div>
        </div>

        {/* Dock reflection effect */}
        <div className="absolute top-full left-0 right-0 h-2 bg-gradient-to-b from-white/5 to-transparent rounded-b-2xl"></div>
      </div>
    </div>
  );
};

export default Dock;
