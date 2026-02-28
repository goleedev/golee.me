interface StatCardProps {
  metric: string | number;
  label: string;
  className?: string;
  isLoading?: boolean;
}

export const StatCard = ({
  metric,
  label,
  className = '',
  isLoading = false,
}: StatCardProps) => {
  if (isLoading) {
    return (
      <div
        className={`h-full flex flex-col justify-center bg-gray-50/80 rounded-2xl p-3 sm:p-4 text-center ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-7 w-12 mx-auto bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-20 mx-auto bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-[72px] sm:h-full flex flex-col justify-center bg-gray-50/80 rounded-2xl p-3 sm:p-4 text-center ${className}`}
    >
      <div className="text-base sm:text-xl font-light text-gray-700 mb-1">
        {metric}
      </div>
      <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide leading-tight">
        {label}
      </div>
    </div>
  );
};
