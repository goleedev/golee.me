interface MenuBarProps {
  currentTime: Date;
  onLogoClick: () => void;
  onAskClick: () => void;
}

const MenuBar = ({ currentTime, onLogoClick, onAskClick }: MenuBarProps) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const day = currentTime.getDate();
  const month = months[currentTime.getMonth()];
  const weekday = weekdays[currentTime.getDay()];

  const formattedTime = currentTime
    .toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .toLowerCase();

  return (
    <div className="text-black h-10 font-medium flex justify-between items-center text-sm fixed top-0 w-full z-[9999] bg-white/75 backdrop-blur-md px-4 py-1.5 shadow-sm">
      {/* Logo */}
      <button
        onClick={onLogoClick}
        className="flex items-center space-x-2 cursor-pointer hover:opacity-70 transition-opacity"
        style={{ minHeight: 'unset', minWidth: 'unset' }}
      >
        <span className="text-lg leading-none">🏁</span>
        <span className="font-medium text-sm">golee.dev</span>
      </button>

      {/* Right side */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Ask button */}
        <button
          onClick={onAskClick}
          className="flex items-center gap-1 text-xs font-medium text-black/70 hover:text-black active:bg-black/12 transition-colors px-2.5 py-1"
          style={{ minHeight: 'unset', minWidth: 'unset' }}
          aria-label="Ask AI about Go"
        >
          <span className="text-base sm:text-xs leading-none opacity-60">
            ✦
          </span>
          <span>Ask</span>
        </button>

        {/* Clock */}
        <div className="flex items-center gap-1 text-xs font-light text-gray-600 select-none">
          <span>{weekday}</span>
          <span>{day}</span>
          <span>{month}</span>
          <span>{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
