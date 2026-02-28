import React from 'react';

interface TimelineItemProps {
  title: string;
  subtitle?: string;
  date: string;
  description?: string;
  tags?: string[];
  achievements?: string[];
  isLast?: boolean;
  isFeatured?: boolean;
  isCurrent?: boolean;
  children?: React.ReactNode;
}

export const TimelineItem = ({
  title,
  subtitle,
  date,
  description,
  tags = [],
  achievements = [],
  isLast = false,
  isFeatured = false,
  isCurrent = false,
  children,
}: TimelineItemProps) => {
  return (
    <div className="relative">
      {/* Timeline dot */}
      <div className="absolute left-0 top-0 w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>

      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-0.5 top-4 w-0.5 h-full bg-gray-200"></div>
      )}

      {/* Content */}
      <div className="ml-6 sm:ml-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                {title}
              </h3>
              {isCurrent && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-800/50 text-white whitespace-nowrap">
                  Current
                </span>
              )}
              {isFeatured && !isCurrent && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-800/50 text-white whitespace-nowrap">
                  Featured
                </span>
              )}
            </div>
            {subtitle && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-gray-600 mt-0.5">
                <span className="font-medium">{subtitle}</span>
              </div>
            )}
            <div className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {date}
            </div>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-700 font-light leading-relaxed mb-4">
            {description}
          </p>
        )}

        {/* Children (for custom content like images) */}
        {children}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-2">
              {achievements.map((achievement, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 font-light leading-relaxed flex items-start"
                >
                  <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">
                    •
                  </span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-light"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
