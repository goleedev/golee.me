import React, { useEffect, useState } from 'react';
import type { StickyState } from '../../types';
import { PrivacySticky } from './PrivacySticky';
import { AnalyticsSticky } from './AnalyticsSticky';

export interface MetricsData {
  todaysViews: number;
  totalViews: number;
  totalCountries: number;
  topCountry: string;
  lastVisitor: string;
}

interface StickiesProps {
  sticky: StickyState;
  onMouseDown: (e: React.MouseEvent, stickyId: string) => void;
  onToggleExpand: (stickyId: string) => void;
  isMobile: boolean;
}

const CACHE_DURATION = 1 * 60 * 1000; // 1분
const CACHE_KEY = 'analytics_cache';

const Stickies = ({
  sticky,
  onMouseDown,
  onToggleExpand,
  isMobile,
}: StickiesProps) => {
  const [metrics, setMetrics] = useState<MetricsData>({
    todaysViews: 0,
    totalViews: 0,
    totalCountries: 0,
    topCountry: '--',
    lastVisitor: '--',
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    if (sticky.type !== 'analytics') return;

    try {
      // Check cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setMetrics(data);
            setIsLoading(false);
            return;
          }
        } catch {
          // Cache invalid, fetch fresh data
        }
      }

      setIsLoading(true);

      const response = await fetch('/api/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setMetrics(result.data);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: result.data,
            timestamp: Date.now(),
          }),
        );
      }
    } catch (error) {
      console.error('Analytics Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sticky.type === 'analytics') {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, CACHE_DURATION);
      return () => clearInterval(interval);
    }
  }, [sticky.type]);

  const getStickyColor = () => {
    switch (sticky.type) {
      case 'analytics':
        return '#fef08a';
      case 'privacy':
        return '#BEF4F8';
      default:
        return '#fef08a';
    }
  };

  const getBorderColor = () => {
    switch (sticky.type) {
      case 'analytics':
        return 'border-yellow-300/50';
      case 'privacy':
        return 'border-cyan-300/50';
      default:
        return 'border-yellow-300/50';
    }
  };

  const getStickySize = () => {
    if (sticky.isExpanded) {
      return {
        width: 'calc(100vw - 32px)',
        height: '100dvh',
        maxHeight: isMobile ? 'calc(100dvh - 140px)' : 'calc(100dvh - 120px)',
      };
    }
    return {
      width: '264px',
      height:
        sticky.type === 'privacy' && !isMobile
          ? '168px'
          : sticky.type === 'privacy' && isMobile
            ? '182px'
            : '208px',
    };
  };

  const size = getStickySize();

  return (
    <div
      className={`absolute shadow-sm border p-4 select-none ${getBorderColor()} ${
        sticky.isExpanded ? 'overflow-y-auto' : ''
      }`}
      style={{
        left: sticky.position.x,
        top: sticky.position.y,
        zIndex: sticky.zIndex,
        backgroundColor: getStickyColor(),
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        cursor: isMobile || sticky.isExpanded ? 'default' : 'move',
        ...size,
      }}
      onMouseDown={(e) =>
        !isMobile && !sticky.isExpanded && onMouseDown(e, sticky.id)
      }
    >
      <div className="text-xs leading-relaxed pointer-events-none">
        {sticky.type === 'analytics' ? (
          <AnalyticsSticky metrics={metrics} isLoading={isLoading} />
        ) : (
          <PrivacySticky
            isExpanded={sticky.isExpanded || false}
            onToggleExpand={() => onToggleExpand(sticky.id)}
          />
        )}
      </div>
    </div>
  );
};

export default Stickies;
