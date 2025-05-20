import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  // Set CORS headers for actual requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let payload;
    try {
      payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    if (!payload.session || !Array.isArray(payload.pageviews)) {
      return res.status(400).json({ error: 'Invalid payload format' });
    }

    // Insert session data
    if (!payload.session.application_id || !payload.session.session_id) {
      return res.status(400).json({ error: 'Missing required session fields' });
    }

    const { error: sessionError } = await supabase
      .from('sessions')
      .upsert([payload.session], {
        onConflict: 'session_id',
        ignoreDuplicates: false
      });

    if (sessionError) {
      console.error('Error inserting session:', sessionError);
      return res.status(500).json({ error: 'Database error', details: sessionError.message });
    }

    // Insert pageview data
    for (const pageview of payload.pageviews) {
      if (!pageview.pageview_id || !pageview.session_id) {
        console.warn('Skipping invalid pageview:', pageview);
        continue;
      }

      const { error: pageviewError } = await supabase
        .from('pageviews')
        .upsert([pageview], {
          onConflict: 'pageview_id',
          ignoreDuplicates: false
        });

      if (pageviewError) {
        console.error('Error inserting pageview:', pageviewError);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('API error in /track:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}