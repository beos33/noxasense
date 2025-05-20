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
  'Access-Control-Max-Age': '86400',
};

export default async function handler(req, res) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).setHeaders(corsHeaders).end();
  }

  // Set CORS headers for all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Processing POST request');
    const payload = JSON.parse(req.body);
    console.log('Received payload:', JSON.stringify(payload, null, 2));

    // Validate payload structure
    if (!payload.session || !Array.isArray(payload.pageviews)) {
      console.error('Invalid payload structure');
      return res.status(400).json({ error: 'Invalid payload structure' });
    }

    // Insert session data
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .upsert(payload.session, {
        onConflict: 'session_id',
        ignoreDuplicates: false
      });

    if (sessionError) {
      console.error('Session insert error:', sessionError);
      return res.status(500).json({ error: 'Failed to insert session data' });
    }

    // Insert pageview data if any
    if (payload.pageviews.length > 0) {
      const { data: pageviewData, error: pageviewError } = await supabase
        .from('pageviews')
        .insert(payload.pageviews);

      if (pageviewError) {
        console.error('Pageview insert error:', pageviewError);
        return res.status(500).json({ error: 'Failed to insert pageview data' });
      }
    }

    console.log('Successfully processed request');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}