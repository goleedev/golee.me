'use client';

import { useEffect, useState } from 'react';
import PageTitle from '@/components/page-title';
import { getMentorshipData } from '@/utils/mentorship';
import { FrownIcon } from 'lucide-react';

type MentorshipEntry = {
  timestamp: string;
  name: string;
  topic: string;
  feedback: string;
  linkedin?: string;
  github?: string;
};

export default function MentorshipPage() {
  const [entries, setEntries] = useState<MentorshipEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMentorshipData();
        setEntries(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section className="flex flex-col gap-8">
      <PageTitle
        title="🌱 Mentorship."
        description="Sharing knowledge, offering guidance, and making an impact—one mentorship at a time."
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : entries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
          {entries
            .sort(
              (a, b) =>
                Number(new Date(b.timestamp)) - Number(new Date(a.timestamp))
            )
            .map((entry, index) => {
              const isExpanded = expandedEntries.has(index);
              const shouldShowReadMore = entry.feedback.length > 100;

              return (
                <div
                  key={index}
                  className="flex relative flex-col px-3 pt-2 pb-5 rounded-xl bg-black-lighter border border-black transition-all hover:scale-105 cursor-default hover:bg-blue-lighter dark:bg-gray-lighter dark:border-gray-light"
                >
                  <div className="flex justify-between">
                    <p className="text-sm text-orange font-semibold font-mono dark:text-blue">
                      {entry.topic}
                    </p>
                    <time className="min-w-max px-1 py-0.5 bg-blue-lighter text-gray text-xs dark:bg-orange-light dark:text-white">
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      }).format(new Date(entry.timestamp))}
                    </time>
                  </div>
                  <div className="pt-3 h-full">
                    <p className="font-bold text-lg leading-6 line-clamp-1">
                      {entry.name}
                    </p>
                    <p
                      className={`pt-1 text-sm tracking-tight ${
                        isExpanded ? '' : 'line-clamp-1 sm:line-clamp-3'
                      }`}
                    >
                      {entry.feedback}
                    </p>
                    {shouldShowReadMore && (
                      <button
                        className="mt-2 text-blue-500 text-sm font-medium hover:underline"
                        onClick={() => toggleExpand(index)}
                      >
                        {isExpanded ? 'Read Less' : 'Read More'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <section className="w-full flex flex-col items-center justify-center text-center max-w-screen-md min-h-[calc(100vh-380px)]">
          <FrownIcon size={40} className="text-gray-400" />
          <h2 className="text-xl font-semibold font-mono tracking-tighter">
            No feedback found
          </h2>
        </section>
      )}

      <button
        type="button"
        disabled
        className="w-fit mx-auto disabled:cursor-not-allowed disabled:opacity-60 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors bg-orange hover:bg-orange-light dark:bg-blue dark:hover:bg-blue-light"
      >
        Mentorship on Pause
      </button>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse h-[140px] flex relative flex-col pt-3 pb-5 px-3 rounded-xl bg-gray-light border border-gray-light transition-all cursor-default dark:bg-gray dark:border-gray"
        >
          <div className="h-6 bg-gray-lighter rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-lighter rounded w-1/2 mb-4"></div>
          <div className="h-16 bg-gray-lighter rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}
