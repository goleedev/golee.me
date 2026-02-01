import { AlertCircle, Github, Linkedin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  getMentorshipData,
  type MentorshipEntry,
} from '../../services/mentorshipService';
import { StatCard } from '../shared/StatCard';

export const MentorshipContent: React.FC = () => {
  const [entries, setEntries] = useState<MentorshipEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMentorshipData();

      if (data.length === 0) {
        setError('No data found. Please check the CSV URL.');
        setEntries([]);
        return;
      }

      const reversedData = data.reverse();
      setEntries(reversedData);
    } catch {
      setError('Failed to load mentorship data. Please try again.');
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (timestamp: string) => {
    try {
      let dateStr = timestamp;
      dateStr = dateStr.replace('오전', 'AM').replace('오후', 'PM');
      dateStr = dateStr.replace(
        /(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/,
        (year, month, day) => {
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        },
      );

      const date = new Date(dateStr);

      if (isNaN(date.getTime())) {
        const dateMatch = timestamp.match(
          /(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/,
        );
        if (dateMatch) {
          return `${dateMatch[2]}/${dateMatch[3]}/${dateMatch[1]}`;
        }
        return 'Invalid Date';
      }

      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(date);
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="px-6 pt-6 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="w-full mx-auto min-w-0">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light mb-2 text-gray-900">Mentorship</h2>
          <p className="text-gray-600 font-light">
            Sharing knowledge, offering guidance, and making an impact.
          </p>
        </div>

        {error && (
          <div className="bg-red-50/90 backdrop-blur-sm rounded-2xl p-6 border border-red-200/60 mb-8">
            <div className="flex items-center space-x-2">
              <AlertCircle size={16} className="text-red-600" />
              <p className="text-red-800 font-light">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 mb-8">
          <p className="text-blue-800 font-light">
            <span className="font-medium">Currently unavailable</span> —
            Mentorship is on hold while I focus on personal projects. I plan to
            resume in the future.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard metric={0} label="Total Sessions" isLoading={true} />
              <StatCard metric={0} label="Topics Covered" isLoading={true} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 rounded-2xl p-6 border border-gray-100 animate-pulse"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : entries.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatCard
                metric={entries.length}
                label="Total Sessions"
                isLoading={isLoading}
              />
              <StatCard
                metric={new Set(entries.map((e) => e.topic)).size}
                label="Topics Covered"
                isLoading={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
              {entries.map((entry, index) => (
                <div
                  key={`${entry.timestamp}-${index}`}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-light whitespace-nowrap flex-shrink-0 max-w-40 md:max-w-none truncate">
                          {entry.topic}
                        </span>
                        <span className="text-xs h-full text-gray-500 whitespace-nowrap flex-shrink-0">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {entry.name}
                      </h3>
                    </div>

                    <div className="flex space-x-2">
                      {entry.linkedin && (
                        <a
                          href={entry.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50"
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
                        >
                          <Github size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  <blockquote className="text-gray-700 font-light leading-relaxed text-sm">
                    "{entry.feedback}"
                  </blockquote>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No feedback yet
            </h3>
            <p className="text-gray-600 font-light">
              Mentorship testimonials will appear here.
            </p>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-medium text-gray-900 mb-4">What I Offer</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <span className="text-gray-700 font-light">
                Career guidance and transition advice
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <span className="text-gray-700 font-light">
                Technical mentorship in frontend development
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <span className="text-gray-700 font-light">
                International job search strategies
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <span className="text-gray-700 font-light">
                Building and scaling tech communities
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
