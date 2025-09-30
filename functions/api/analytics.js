// functions/api/analytics.js
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

    // POST - Track visit
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const { country, referrer } = body;
        const userAgent = request.headers.get('User-Agent') || 'unknown';
        const timestamp = new Date().toISOString();

        // Create analytics table if not exists (IP 제거)
        await env.DB.prepare(
          `
          CREATE TABLE IF NOT EXISTS analytics_visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            country TEXT,
            referrer TEXT,
            user_agent TEXT,
            visited_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `
        ).run();

        // Insert visit (IP 없이)
        await env.DB.prepare(
          `
          INSERT INTO analytics_visits (country, referrer, user_agent, visited_at)
          VALUES (?, ?, ?, ?)
        `
        )
          .bind(
            country || 'Unknown',
            referrer || 'Direct',
            userAgent,
            timestamp
          )
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
            error: error.message,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
    }

    // GET - Get analytics data
    if (request.method === 'GET') {
      try {
        // Ensure table exists
        await env.DB.prepare(
          `
          CREATE TABLE IF NOT EXISTS analytics_visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            country TEXT,
            referrer TEXT,
            user_agent TEXT,
            visited_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `
        ).run();

        // Get today's views
        const today = new Date().toISOString().split('T')[0];
        const todayViews = await env.DB.prepare(
          `
          SELECT COUNT(*) as count 
          FROM analytics_visits 
          WHERE DATE(visited_at) = ?
        `
        )
          .bind(today)
          .first();

        // Get total pageviews (all visits)
        const totalViews = await env.DB.prepare(
          `
          SELECT COUNT(*) as count FROM analytics_visits
        `
        ).first();

        // Get countries
        const countries = await env.DB.prepare(
          `
          SELECT country, COUNT(*) as count 
          FROM analytics_visits 
          WHERE country != 'Unknown'
          GROUP BY country 
          ORDER BY count DESC
        `
        ).all();

        // Get last visit
        const lastVisit = await env.DB.prepare(
          `
          SELECT visited_at FROM analytics_visits 
          ORDER BY visited_at DESC 
          LIMIT 1
        `
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
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
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
            error: error.message,
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
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}
