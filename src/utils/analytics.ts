export const trackVisit = (): void => {
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
  }).catch((err) => console.error('Analytics tracking failed:', err));
};
