import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CORS headers for public API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

export default async function handler(req, res) {
  // Set CORS headers for all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log raw body for debugging
    console.log('Raw request body:', req.body);
    
    let payload;
    try {
      payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.log('Parsed payload:', payload);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(400).json({ error: 'Invalid JSON payload', details: parseError.message });
    }

    // Validate payload structure
    if (!payload.session || !Array.isArray(payload.pageviews)) {
      console.error('Invalid payload structure:', payload);
      return res.status(400).json({ 
        error: 'Invalid payload structure',
        expected: { session: 'object', pageviews: 'array' },
        received: {
          session: typeof payload.session,
          pageviews: Array.isArray(payload.pageviews) ? 'array' : typeof payload.pageviews
        }
      });
    }

    // Log session data
    console.log('Attempting to insert session:', payload.session);

    // Insert session data
    const { error: sessionError } = await supabase
      .from('sessions')
      .upsert(payload.session, {
        onConflict: 'session_id',
        ignoreDuplicates: false
      });

    if (sessionError) {
      console.error('Session insert error:', sessionError);
      return res.status(500).json({ 
        error: 'Failed to insert session data',
        details: sessionError.message,
        code: sessionError.code
      });
    }

    // Insert pageview data if any
    if (payload.pageviews.length > 0) {
      console.log('Attempting to insert pageviews:', payload.pageviews);
      
      const { error: pageviewError } = await supabase
        .from('pageviews')
        .insert(payload.pageviews);

      if (pageviewError) {
        console.error('Pageview insert error:', pageviewError);
        return res.status(500).json({ 
          error: 'Failed to insert pageview data',
          details: pageviewError.message,
          code: pageviewError.code
        });
      }
    }

    console.log('Successfully processed request');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Unhandled error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      type: error.constructor.name
    });
  }
}