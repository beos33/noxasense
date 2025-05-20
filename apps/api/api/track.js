import { createClient } from '@supabase/supabase-js';

// Supabase client initialized with root-level .env variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  // Set CORS headers for actual requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle actual requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let payload;
    try {
      // Handle both string and object payloads
      payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    // Handle both array and single object payloads
    const items = Array.isArray(payload) ? payload : [payload];
    
    if (items.length === 0) {
      console.warn('Empty payload received');
      return res.status(200).json({ status: 'ok', message: 'Empty payload' });
    }

    for (const item of items) {
      if (!item.eventType || !item.data) {
        console.error('Invalid item format:', item);
        continue;
      }

      try {
        if (item.eventType === 'session') {
          // Only check application_id for session events
          if (!item.data.application_id) {
            console.error('Missing application_id in session data:', item);
            continue;
          }
          const { error } = await supabase.from('sessions').insert([item.data]);
          if (error) {
            console.error('Error inserting session:', error);
            throw error;
          }
          console.log('Successfully inserted session:', item.data.session_id);
        } else if (item.eventType === 'pageview') {
          const { error } = await supabase.from('pageviews').insert([item.data]);
          if (error) {
            console.error('Error inserting pageview:', error);
            throw error;
          }
          console.log('Successfully inserted pageview:', item.data.pageview_id);
        } else {
          console.warn('Unknown event type:', item.eventType);
        }
      } catch (itemError) {
        console.error(`Error processing ${item.eventType}:`, itemError);
        // Continue processing other items even if one fails
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('API error in /track:', error.message);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}