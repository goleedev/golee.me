import { ExternalLink as ExternalLinkIcon } from 'lucide-react';
import React from 'react';

interface ExternalLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export const ExternalLink = ({
  href,
  icon,
  label,
  className = '',
}: ExternalLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors ${className}`}
    >
      {icon}
      <span className="text-sm text-gray-700">{label}</span>
      <ExternalLinkIcon size={12} className="text-gray-400 ml-auto" />
    </a>
  );
};
