const CACHE_KEY = 'analytics_cache';

export const trackVisit = (): void => {
  const referrer = document.referrer || 'Direct';

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ referrer }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.message === 'Visit tracked') {
        // 🎯 캐시 무효화 - Analytics Sticky가 즉시 새 데이터 가져옴
        localStorage.removeItem(CACHE_KEY);

        if (import.meta.env.DEV) {
          console.log('[Analytics] ✅ Visit tracked, cache invalidated');
        }
      } else if (data.success && data.message === 'Duplicate visit skipped') {
        // 🎯 중복 방문 - 캐시 유지, Analytics Sticky는 기존 데이터 계속 사용
      }
    })
    .catch((err) => {
      console.error('[Analytics] Error:', err);
    });
};
