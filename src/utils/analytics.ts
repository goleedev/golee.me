const ANALYTICS_COOLDOWN = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY = 'analytics_last_tracked';

export const trackVisit = (): void => {
  const lastTracked = localStorage.getItem(STORAGE_KEY);
  const now = Date.now();

  if (lastTracked && now - parseInt(lastTracked) < ANALYTICS_COOLDOWN) {
    console.log('Analytics: Skipping - recently tracked');
    return;
  }

  let country = 'Unknown';

  try {
    const locale = navigator.language || 'en-US';
    const regionCode = locale.split('-')[1];

    if (regionCode) {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      country = regionNames.of(regionCode) || locale;
    } else {
      country = locale;
    }
  } catch {
    country = navigator.language || 'Unknown';
  }

  const referrer = document.referrer || 'Direct';

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country, referrer }),
  })
    .then(() => {
      localStorage.setItem(STORAGE_KEY, now.toString());
      console.log('Analytics: Visit tracked successfully');
    })
    .catch((err) => console.error('Analytics tracking failed:', err));
};
