export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Security headers
  const securityHeaders = {
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; connect-src 'self';",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
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
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...securityHeaders,
          },
        }
      );
    }

    // Create table WITHOUT any IP-related fields
    await env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS guestbook_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        message TEXT NOT NULL,
        website TEXT,
        location TEXT,
        created_at TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'approved',
        is_featured INTEGER DEFAULT 0
      )`
    ).run();

    // GET request - Fetch guestbook entries
    if (request.method === 'GET') {
      const entries = await env.DB.prepare(
        `SELECT id, name, message, email, website, location, created_at, status 
         FROM guestbook_entries 
         WHERE status = ? 
         ORDER BY created_at DESC 
         LIMIT 10`
      )
        .bind('approved')
        .all();

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            entries: entries.results || [],
            pagination: {
              page: 1,
              limit: 10,
              total: entries.results?.length || 0,
              totalPages: 1,
            },
          },
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=60',
            ...corsHeaders,
            ...securityHeaders,
          },
        }
      );
    }

    // POST request - Rely ONLY on client-side rate limiting
    if (request.method === 'POST') {
      const body = await request.json();
      const { name, message, email, website, location } = body;

      // Validate required fields
      if (!name?.trim() || !message?.trim()) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Name and message are required',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
              ...securityHeaders,
            },
          }
        );
      }

      // Basic spam detection (keyword-based only)
      const spamKeywords = [
        'viagra',
        'casino',
        'lottery',
        'crypto-invest',
        'buy now',
        'click here',
        'limited offer',
        'act now',
        'free money',
        'click link',
        'winner',
        'congratulations',
      ];
      const messageText = message.toLowerCase();
      if (spamKeywords.some((keyword) => messageText.includes(keyword))) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Message contains prohibited content',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
              ...securityHeaders,
            },
          }
        );
      }

      // Prevent excessively long input
      if (name.length > 100 || message.length > 1000) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Name or message exceeds maximum length',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
              ...securityHeaders,
            },
          }
        );
      }

      // Additional server-side protection:
      // Check for too many recent submissions (global rate limit)
      const recentCount = await env.DB.prepare(
        `SELECT COUNT(*) as count 
         FROM guestbook_entries 
         WHERE created_at > datetime("now", "-1 minute")`
      ).first();

      // If more than 10 submissions in the last minute, likely spam attack
      if (recentCount && recentCount.count > 10) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Too many submissions. Please try again later.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '60',
              ...corsHeaders,
              ...securityHeaders,
            },
          }
        );
      }

      // Insert entry WITHOUT any IP data
      const result = await env.DB.prepare(
        `INSERT INTO guestbook_entries (name, message, email, website, location, created_at, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          name.trim().substring(0, 100),
          message.trim().substring(0, 1000),
          email?.trim()?.substring(0, 100) || null,
          website?.trim()?.substring(0, 200) || null,
          location?.trim()?.substring(0, 100) || null,
          new Date().toISOString(),
          'approved'
        )
        .run();

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            message: 'Entry added successfully',
            id: result.meta.last_row_id,
          },
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...securityHeaders,
          },
        }
      );
    }

    return new Response('Method not allowed', {
      status: 405,
      headers: { ...corsHeaders, ...securityHeaders },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
          ...securityHeaders,
        },
      }
    );
  }
}
