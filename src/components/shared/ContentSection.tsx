import React from 'react';

interface ContentSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm min-w-0 ${className}`}
    >
      {title && (
        <h3 className="font-medium text-gray-900 mb-4 break-words">{title}</h3>
      )}
      <div className="min-w-0">{children}</div>
    </div>
  );
};
