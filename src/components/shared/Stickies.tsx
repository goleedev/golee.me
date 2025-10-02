import React, { useEffect, useState } from 'react';
import type { StickyState } from '../../types';

interface MetricsData {
  todaysViews: number;
  totalViews: number;
  totalCountries: number;
  topCountry: string;
  lastVisitor: string;
}

interface StickiesProps {
  sticky: StickyState;
  onMouseDown: (e: React.MouseEvent, stickyId: string) => void;
  isMobile: boolean;
}

const CACHE_DURATION = 15 * 60 * 1000;
const CACHE_KEY = 'analytics_cache';

const Stickies = ({ sticky, onMouseDown, isMobile }: StickiesProps) => {
  const [metrics, setMetrics] = useState<MetricsData>({
    todaysViews: 0,
    totalViews: 0,
    totalCountries: 0,
    topCountry: '',
    lastVisitor: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setMetrics(data);
            setIsLoading(false);
            console.log('Analytics: Using cached data');
            return;
          }
        } catch {
          // Invalid cache, continue to fetch
          console.log('Analytics: Cache invalid, fetching fresh data');
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

        // Cache the result
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: result.data,
            timestamp: Date.now(),
          })
        );
        console.log('Analytics: Data fetched and cached');
      } else {
        console.error('Failed to fetch analytics:', result.error);
        setMetrics({
          todaysViews: 0,
          totalViews: 0,
          totalCountries: 0,
          topCountry: '--',
          lastVisitor: '--',
        });
      }
    } catch (error) {
      console.error('Analytics Error:', error);
      setMetrics({
        todaysViews: 0,
        totalViews: 0,
        totalCountries: 0,
        topCountry: '--',
        lastVisitor: '--',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    const interval = setInterval(fetchMetrics, CACHE_DURATION);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute bg-yellow-200 w-64 h-52 shadow-sm border border-yellow-300/50 p-4 select-none"
      style={{
        left: sticky.position.x,
        top: sticky.position.y,
        zIndex: sticky.zIndex,
        backgroundColor: '#fef08a',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        cursor: isMobile ? 'default' : 'move',
      }}
      onMouseDown={(e) => !isMobile && onMouseDown(e, sticky.id)}
    >
      <div className="text-xs leading-relaxed pointer-events-none">
        <span className="font-semibold">🔍 Analytics</span>
        <br />
        <br />
        {isLoading ? (
          <div className="h-[78px] flex items-center">Loading...</div>
        ) : (
          <>
            · Today's views: {metrics.todaysViews.toLocaleString() || '--'}
            <br />· Total views: {metrics.totalViews.toLocaleString() || '--'}
            <br />· Total countries: {metrics.totalCountries || '--'}
            <br />· Top country: {metrics.topCountry || '--'}
            <br />· Last visitor: {metrics.lastVisitor || '--'}
          </>
        )}
        <br />
        <br />
        Powered by Cloudflare D1
      </div>
    </div>
  );
};

export default Stickies;
