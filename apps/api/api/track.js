import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Max-Age': '86400'
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
    const payload = JSON.parse(req.body);

    // Validate payload structure
    if (!payload.session || !Array.isArray(payload.pageviews)) {
      return res.status(400).json({ error: 'Invalid payload structure' });
    }

    // Insert session data
    const { error: sessionError } = await supabase
      .from('sessions')
      .upsert(payload.session, {
        onConflict: 'session_id',
        ignoreDuplicates: false
      });

    if (sessionError) {
      return res.status(500).json({ error: 'Failed to insert session data' });
    }

    // Insert pageview data if any
    if (payload.pageviews.length > 0) {
      const { error: pageviewError } = await supabase
        .from('pageviews')
        .insert(payload.pageviews);

      if (pageviewError) {
        return res.status(500).json({ error: 'Failed to insert pageview data' });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}