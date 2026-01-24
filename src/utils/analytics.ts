const ANALYTICS_COOLDOWN = 24 * 60 * 60 * 1000; // 24시간
const STORAGE_KEY = 'analytics_last_tracked';
const CACHE_KEY = 'analytics_cache'; // 추가

export const trackVisit = (): void => {
  const lastTracked = localStorage.getItem(STORAGE_KEY);
  const now = Date.now();

  if (lastTracked && now - parseInt(lastTracked) < ANALYTICS_COOLDOWN) {
    if (import.meta.env.DEV) {
      const remaining = Math.ceil(
        (ANALYTICS_COOLDOWN - (now - parseInt(lastTracked))) / 1000
      );
      console.log(`[Analytics] Cooldown: ${remaining}s remaining`);
    }
    return;
  }

  const referrer = document.referrer || 'Direct';

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ referrer }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.message === 'Visit tracked') {
        localStorage.setItem(STORAGE_KEY, now.toString());

        // 🎯 캐시 무효화 - Analytics Sticky가 즉시 새 데이터 가져옴
        localStorage.removeItem(CACHE_KEY);

        if (import.meta.env.DEV) {
          console.log('[Analytics] ✅ Visit tracked, cache invalidated');
        }
      }
    })
    .catch((err) => {
      console.error('[Analytics] Error:', err);
    });
};
