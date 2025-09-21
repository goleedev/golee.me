// functions/api/guestbook.js
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
    // 기본 환경 체크
    if (!env.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'D1 database not bound',
          debug: { hasDB: false, envKeys: Object.keys(env) },
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // 테이블 존재 확인
    const tableCheck = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='guestbook_entries'"
    ).first();

    if (!tableCheck) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Table not found',
          debug: { tableExists: false },
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // GET 요청 처리
    if (request.method === 'GET') {
      const entries = await env.DB.prepare(
        'SELECT * FROM guestbook_entries WHERE status = ? ORDER BY created_at DESC LIMIT 10'
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
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // POST 요청 처리
    if (request.method === 'POST') {
      const body = await request.json();
      const { name, message, email, website, location } = body;

      if (!name?.trim() || !message?.trim()) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Name and message are required',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }

      const result = await env.DB.prepare(
        `
        INSERT INTO guestbook_entries (name, message, email, website, location, created_at, status, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
        .bind(
          name.trim(),
          message.trim(),
          email?.trim() || null,
          website?.trim() || null,
          location?.trim() || null,
          new Date().toISOString(),
          'approved',
          request.headers.get('CF-Connecting-IP') || 'unknown'
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
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Database error',
        details: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}
