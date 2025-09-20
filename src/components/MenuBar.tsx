interface MenuBarProps {
  currentTime: Date;
}

const MenuBar = ({ currentTime }: MenuBarProps) => {
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
    <div className="text-black font-medium flex justify-between items-center text-sm fixed top-0 w-full z-[9999] bg-white/75 backdrop-blur-xs px-4 py-1.5 shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="text-lg">🏁</span>
        <span className="font-medium">golee.dev</span>
      </div>
      <div className="flex items-center space-x-1 text-xs font-light">
        <span>{weekday}</span>
        <span>{day}</span>
        <span>{month}</span>
        <span>{formattedTime}</span>
      </div>
    </div>
  );
};

export default MenuBar;
