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
    const payload = JSON.parse(req.body);

    // Validate payload structure
    if (!payload.session || !Array.isArray(payload.pageviews)) {
      return res.status(400).json({ error: 'Invalid payload structure' });
    }

    // Check if session already exists
    const { data: existingSession } = await supabase
      .from('sessions')
      .select('session_id')
      .eq('session_id', payload.session.session_id)
      .single();

    // Only insert session if it doesn't exist
    if (!existingSession) {
      const { error: sessionError } = await supabase
        .from('sessions')
        .insert(payload.session);

      if (sessionError) {
        console.error('Session insert error:', sessionError);
        return res.status(500).json({ 
          error: 'Failed to insert session data',
          details: sessionError.message
        });
      }
    }

    // Insert pageview data if any
    if (payload.pageviews.length > 0) {
      const { error: pageviewError } = await supabase
        .from('pageviews')
        .insert(payload.pageviews);

      if (pageviewError) {
        console.error('Pageview insert error:', pageviewError);
        return res.status(500).json({ 
          error: 'Failed to insert pageview data',
          details: pageviewError.message
        });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Unhandled error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}