function getCountryName(countryCode) {
  const countryNames = {
    GB: 'United Kingdom',
    US: 'United States',
    KR: 'South Korea',
    JP: 'Japan',
    CN: 'China',
    DE: 'Germany',
    FR: 'France',
    IT: 'Italy',
    ES: 'Spain',
    CA: 'Canada',
    AU: 'Australia',
    NZ: 'New Zealand',
    IN: 'India',
    SG: 'Singapore',
    HK: 'Hong Kong',
    TW: 'Taiwan',
    NL: 'Netherlands',
    BE: 'Belgium',
    SE: 'Sweden',
    NO: 'Norway',
    DK: 'Denmark',
    FI: 'Finland',
    CH: 'Switzerland',
    AT: 'Austria',
    PL: 'Poland',
    PT: 'Portugal',
    IE: 'Ireland',
    BR: 'Brazil',
    MX: 'Mexico',
    AR: 'Argentina',
    RU: 'Russia',
    TR: 'Turkey',
    SA: 'Saudi Arabia',
    AE: 'United Arab Emirates',
    IL: 'Israel',
    ZA: 'South Africa',
    TH: 'Thailand',
    VN: 'Vietnam',
    ID: 'Indonesia',
    MY: 'Malaysia',
    PH: 'Philippines',
  };

  return countryNames[countryCode] || countryCode;
}

async function hashFingerprint(userAgent, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(userAgent + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 16);
}

export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!env.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'D1 database not bound',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // POST - Track visit with privacy-first approach
    if (request.method === 'POST') {
      try {
        const userAgent = request.headers.get('User-Agent') || 'unknown';

        // Use environment variable for salt, with secure fallback
        const salt = env.ANALYTICS_SALT || 'fallback-' + crypto.randomUUID();

        const fingerprint = await hashFingerprint(userAgent, salt);

        const recentVisit = await env.DB.prepare(
          `SELECT id FROM analytics_visits 
           WHERE fingerprint = ? 
           AND visited_at > datetime('now', '-30 minutes')
           LIMIT 1`
        )
          .bind(fingerprint)
          .first();

        // Skip if already tracked recently (reduces DB writes)
        if (recentVisit) {
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Visit already tracked recently',
            }),
            {
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        // Get country from Cloudflare headers
        // This is aggregated data and privacy-compliant
        const countryCode = request.headers.get('CF-IPCountry') || 'Unknown';
        const country =
          countryCode !== 'Unknown' ? getCountryName(countryCode) : 'Unknown';

        let referrer = 'Direct';
        try {
          const body = await request.json();
          referrer = body.referrer || 'Direct';
        } catch (e) {
          referrer = request.headers.get('Referer') || 'Direct';
        }

        const timestamp = new Date().toISOString();

        // Create analytics table with indexes
        await env.DB.prepare(
          `CREATE TABLE IF NOT EXISTS analytics_visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            country TEXT,
            referrer TEXT,
            fingerprint TEXT,
            visited_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )`
        ).run();

        // Create indexes for performance (will only create if they don't exist)
        await env.DB.prepare(
          `CREATE INDEX IF NOT EXISTS idx_fingerprint ON analytics_visits(fingerprint)`
        ).run();

        await env.DB.prepare(
          `CREATE INDEX IF NOT EXISTS idx_visited_at ON analytics_visits(visited_at)`
        ).run();

        // Insert visit with anonymized data only
        await env.DB.prepare(
          `INSERT INTO analytics_visits (country, referrer, fingerprint, visited_at)
           VALUES (?, ?, ?, ?)`
        )
          .bind(country, referrer, fingerprint, timestamp)
          .run();

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Visit tracked',
          }),
          {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      } catch (error) {
        console.error('Error tracking visit:', error);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to track visit',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
    }

    // GET - Get analytics data with caching
    if (request.method === 'GET') {
      try {
        // Ensure table exists
        await env.DB.prepare(
          `CREATE TABLE IF NOT EXISTS analytics_visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            country TEXT,
            referrer TEXT,
            fingerprint TEXT,
            visited_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )`
        ).run();

        // Get today's views
        const today = new Date().toISOString().split('T')[0];
        const todayViews = await env.DB.prepare(
          `SELECT COUNT(*) as count 
           FROM analytics_visits 
           WHERE DATE(visited_at) = ?`
        )
          .bind(today)
          .first();

        // Get total pageviews
        const totalViews = await env.DB.prepare(
          `SELECT COUNT(*) as count FROM analytics_visits`
        ).first();

        // Get top 10 countries only (reduced from all)
        const countries = await env.DB.prepare(
          `SELECT country, COUNT(*) as count 
           FROM analytics_visits 
           WHERE country != 'Unknown'
           GROUP BY country 
           ORDER BY count DESC
           LIMIT 10`
        ).all();

        // Get last visit
        const lastVisit = await env.DB.prepare(
          `SELECT visited_at FROM analytics_visits 
           ORDER BY visited_at DESC 
           LIMIT 1`
        ).first();

        // Calculate last visitor time
        let lastVisitorTime = '--';
        if (lastVisit?.visited_at) {
          const lastVisitDate = new Date(lastVisit.visited_at);
          const now = new Date();
          const diffMs = now.getTime() - lastVisitDate.getTime();
          const diffMins = Math.floor(diffMs / 60000);

          if (diffMins < 1) {
            lastVisitorTime = 'just now';
          } else if (diffMins < 60) {
            lastVisitorTime = `${diffMins}m ago`;
          } else if (diffMins < 1440) {
            lastVisitorTime = `${Math.floor(diffMins / 60)}h ago`;
          } else {
            lastVisitorTime = `${Math.floor(diffMins / 1440)}d ago`;
          }
        }

        const totalCountries = countries.results?.length || 0;
        const topCountry = countries.results?.[0]?.country || '--';

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              todaysViews: todayViews?.count || 0,
              totalViews: totalViews?.count || 0,
              totalCountries: totalCountries,
              topCountry: topCountry,
              lastVisitor: lastVisitorTime,
            },
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=60',
              'Content-Security-Policy':
                "default-src 'self'; script-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';",
              ...corsHeaders,
            },
          }
        );
      } catch (error) {
        console.error('Error fetching analytics:', error);
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              todaysViews: 0,
              totalViews: 0,
              totalCountries: 0,
              topCountry: '--',
              lastVisitor: '--',
            },
            error: 'Failed to fetch analytics',
          }),
          {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
    }

    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}
