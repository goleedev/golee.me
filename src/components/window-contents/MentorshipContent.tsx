import { Github, Linkedin } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type MentorshipEntry = {
  timestamp: string;
  name: string;
  topic: string;
  feedback: string;
  linkedin?: string;
  github?: string;
};

const MENTORSHIP_DATA: MentorshipEntry[] = [];

export const MentorshipContent: React.FC = () => {
  const [entries, setEntries] = useState<MentorshipEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로딩 시뮬레이션
    setTimeout(() => {
      setEntries(MENTORSHIP_DATA);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDate = (timestamp: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(new Date(timestamp));
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="p-8 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-light mb-2 text-gray-900">Mentorship</h2>
          <p className="text-gray-600 font-light">
            Sharing knowledge, offering guidance, and making an impact—one
            mentorship at a time
          </p>
        </div>

        {/* Status Notice */}
        <div className="bg-yellow-50/90 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200/60 mb-8">
          <p className="text-yellow-800 font-light">
            <span className="font-medium">Currently on pause</span> — Taking a
            break to focus on personal projects and exploring new opportunities.
          </p>
        </div>

        {/* Error State 제거 */}

        {isLoading ? (
          <LoadingSkeleton />
        ) : entries.length > 0 ? (
          <div className="space-y-6 mb-8">
            {entries
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
              )
              .map((entry, index) => (
                <div
                  key={`${entry.timestamp}-${index}`}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/40 shadow-sm"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100/80 text-blue-800 border border-blue-200/40">
                          {entry.topic}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {entry.name}
                      </h3>
                    </div>

                    {/* Social Links */}
                    {(entry.linkedin || entry.github) && (
                      <div className="flex space-x-2">
                        {entry.linkedin && (
                          <a
                            href={entry.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50"
                            aria-label={`${entry.name}'s LinkedIn`}
                          >
                            <Linkedin size={16} />
                          </a>
                        )}
                        {entry.github && (
                          <a
                            href={entry.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-md hover:bg-gray-50"
                            aria-label={`${entry.name}'s GitHub`}
                          >
                            <Github size={16} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feedback */}
                  <p className="text-gray-700 font-normal leading-relaxed text-sm">
                    "{entry.feedback}"
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No feedback yet
            </h3>
            <p className="text-gray-600 font-normal">
              Mentorship feedback will appear here when available.
            </p>
          </div>
        )}

        {/* What I Offer Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/40 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6">What I Offer</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-normal">
                Career guidance and transition advice
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-normal">
                Technical mentorship in frontend development
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-normal">
                International job search strategies
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-normal">
                Building and scaling tech communities
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6 mb-8">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/40 shadow-sm animate-pulse"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="h-6 bg-gray-200/60 rounded-full w-24"></div>
                <div className="h-4 bg-gray-200/60 rounded w-16"></div>
              </div>
              <div className="h-6 bg-gray-200/60 rounded w-32"></div>
            </div>
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-gray-200/60 rounded"></div>
              <div className="w-4 h-4 bg-gray-200/60 rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200/60 rounded w-full"></div>
            <div className="h-4 bg-gray-200/60 rounded w-full"></div>
            <div className="h-4 bg-gray-200/60 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
