const countryCodeToName = {
  US: 'United States',
  KR: 'South Korea',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  JP: 'Japan',
  CN: 'China',
  IN: 'India',
  BR: 'Brazil',
  MX: 'Mexico',
  IT: 'Italy',
  ES: 'Spain',
  NL: 'Netherlands',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  BE: 'Belgium',
  CH: 'Switzerland',
  AT: 'Austria',
  IE: 'Ireland',
  PT: 'Portugal',
  PL: 'Poland',
  RU: 'Russia',
  TR: 'Turkey',
  IL: 'Israel',
  AE: 'United Arab Emirates',
  SG: 'Singapore',
  HK: 'Hong Kong',
  TW: 'Taiwan',
  TH: 'Thailand',
  VN: 'Vietnam',
  MY: 'Malaysia',
  ID: 'Indonesia',
  PH: 'Philippines',
  NZ: 'New Zealand',
  ZA: 'South Africa',
  EG: 'Egypt',
  AR: 'Argentina',
  CL: 'Chile',
  CO: 'Colombia',
  PE: 'Peru',
};

export async function onRequest(context) {
  const { request, env } = context;

  // CORS 헤더 설정
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // GET 요청만 처리
  if (request.method !== 'GET') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    // 환경변수에서 토큰과 Account ID 가져오기
    const API_TOKEN = env.CLOUDFLARE_API_TOKEN;
    const ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID;

    if (!API_TOKEN || !ACCOUNT_ID) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({
          error: 'API credentials not configured',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // 24시간 전부터 현재까지 필터
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Cloudflare Analytics API 호출
    const response = await fetch(
      'https://api.cloudflare.com/client/v4/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({
          query: `
          query WebAnalytics($accountTag: String!, $filter: RumPageloadEventsAdaptiveFilter) {
            viewer {
              accounts(filter: {accountTag: $accountTag}) {
                rumPageloadEventsAdaptiveGroups(
                  filter: $filter
                  limit: 1000
                  orderBy: [datetimeHour_DESC]
                ) {
                  count
                  sum {
                    visits
                  }
                  dimensions {
                    datetimeHour
                    countryName
                  }
                }
              }
            }
          }`,
          variables: {
            accountTag: ACCOUNT_ID,
            filter: {
              datetime_geq: yesterday.toISOString(),
              datetime_leq: now.toISOString(),
              bot: 0,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error('GraphQL query failed');
    }

    const rawData =
      data.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups || [];

    // 데이터 처리
    const totalVisits = rawData.reduce((sum, item) => sum + item.sum.visits, 0);
    const totalPageViews = rawData.reduce((sum, item) => sum + item.count, 0);

    // 국가별 집계 (풀네임으로 변환)
    const countries = {};
    rawData.forEach((item) => {
      const countryCode = item.dimensions.countryName;
      if (countryCode && countryCode !== 'Unknown') {
        // 국가 코드를 풀네임으로 변환
        const countryName = countryCodeToName[countryCode] || countryCode;
        countries[countryName] =
          (countries[countryName] || 0) + item.sum.visits;
      }
    });

    const topCountry =
      Object.entries(countries).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      'Unknown';

    // 마지막 방문 시간 계산
    const lastVisit = rawData[0]?.dimensions?.datetimeHour;
    const lastVisitor = lastVisit ? getTimeAgo(new Date(lastVisit)) : 'Unknown';

    const processedData = {
      visitors: totalVisits,
      pageViews: totalPageViews,
      countries: Object.keys(countries).length,
      topCountry,
      lastVisitor,
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: processedData,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Analytics API Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

// 상대 시간 계산 헬퍼 함수
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}
