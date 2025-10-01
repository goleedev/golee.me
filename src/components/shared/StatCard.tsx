import React from 'react';

interface StatCardProps {
  metric: string | number;
  label: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  metric,
  label,
  className = '',
}) => {
  return (
    <div
      className={`h-full flex flex-col justify-center bg-gray-50/80 rounded-2xl p-3 sm:p-4 text-center ${className}`}
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
