import React from 'react';

interface SkillBadgeProps {
  skill: string;
  className?: string;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  className = '',
}) => {
  return (
    <span
      className={`px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-light border border-gray-200 ${className}`}
    >
      {skill}
    </span>
  );
};
