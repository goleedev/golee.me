import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
}) => {
  return (
    <div className="text-center mb-6 sm:mb-8">
      {icon && <div className="mb-4">{icon}</div>}
      <h2 className="text-xl sm:text-2xl font-light mb-2 text-gray-900">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-gray-600 font-light px-4">
        {subtitle}
      </p>
    </div>
  );
};
