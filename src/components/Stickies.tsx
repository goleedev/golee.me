import React, { useEffect, useState } from 'react';
import type { StickyState } from '../types';

interface MetricsData {
  visitors: number;
  pageViews: number;
  countries: number;
  lastVisitor: string;
  topCountry: string;
}

interface StickiesProps {
  sticky: StickyState;
  onMouseDown: (e: React.MouseEvent, stickyId: string) => void;
  isMobile: boolean;
}

const Stickies = ({ sticky, onMouseDown, isMobile }: StickiesProps) => {
  const [metrics, setMetrics] = useState<MetricsData>({
    visitors: 0,
    pageViews: 0,
    countries: 0,
    lastVisitor: '',
    topCountry: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Pages Functions API로 데이터 가져오기
  const fetchMetrics = async () => {
    try {
      setIsLoading(true);

      // Pages Functions API 호출
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

      if (!result.success) {
        throw new Error(result.error || 'API call failed');
      }

      setMetrics(result.data);
      console.log('Analytics data updated successfully from Pages Functions');
    } catch (error) {
      console.error('Analytics API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    // 5분마다 업데이트
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
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
        cursor: isMobile ? 'default' : 'move', // Remove cursor move on mobile
      }}
      onMouseDown={(e) => !isMobile && onMouseDown(e, sticky.id)} // Disable drag on mobile
    >
      <div className="text-xs leading-relaxed pointer-events-none">
        <span className="font-semibold">🔍 Site Analytics</span>
        <br />
        <br />
        {isLoading ? (
          <div className="h-[78px] flex items-center">Loading...</div>
        ) : (
          <>
            Today's visitors: {metrics.visitors.toLocaleString() || '--'}
            <br />
            Page views: {metrics.pageViews.toLocaleString() || '--'}
            <br />
            Countries: {metrics.countries || '--'}
            <br />
            Top country: {metrics.topCountry || '--'}
            <br />
            Last visitor: {metrics.lastVisitor || '--'}
          </>
        )}
        <br />
        <br />
        Powered by Cloudflare Analytics
      </div>
    </div>
  );
};

export default Stickies;
