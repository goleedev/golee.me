const ANALYTICS_COOLDOWN = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY = 'analytics_last_tracked';

export const trackVisit = (): void => {
  const lastTracked = localStorage.getItem(STORAGE_KEY);
  const now = Date.now();

  if (lastTracked && now - parseInt(lastTracked) < ANALYTICS_COOLDOWN) {
    console.log('Analytics: Skipping - recently tracked');
    return;
  }

  const referrer = document.referrer || 'Direct';

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ referrer }), // Only send referrer
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        localStorage.setItem(STORAGE_KEY, now.toString());
        console.log('Analytics: Visit tracked successfully', data);
      } else {
        console.error('Analytics: Failed to track', data);
      }
    })
    .catch((err) => console.error('Analytics tracking failed:', err));
};
