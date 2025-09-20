import type { MetricsData } from './Stickies';

export const AnalyticsSticky: React.FC<{
  metrics: MetricsData;
  isLoading: boolean;
}> = ({ metrics, isLoading }) => (
  <>
    <div className="flex items-center justify-between mb-2">
      <span className="font-semibold">🔍 Analytics</span>
    </div>
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
  </>
);
