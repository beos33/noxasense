const { createClient } = require('@supabase/supabase-js');

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

module.exports = async function handler(req, res) {
  // Set CORS headers for all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // Parse request body
    let payload;
    try {
      payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (error) {
      console.error('Failed to parse request body:', error);
      res.status(400).json({ error: 'Invalid JSON payload' });
      return;
    }

    // Validate payload
    if (!payload || (!payload.pageviews && !payload.pageview_id)) {
      console.error('Invalid payload format:', payload);
      res.status(400).json({ error: 'Invalid pageview data format' });
      return;
    }

    // Extract pageview data
    const pageviewData = payload.pageviews ? payload.pageviews[0] : payload;

    // Insert into Supabase
    const { error: dbError } = await supabase
      .from('pageviews')
      .insert([pageviewData]);

    if (dbError) {
      console.error('Error inserting pageview:', dbError);
      res.status(500).json({ error: 'Failed to insert pageview data' });
      return;
    }

    console.log('Successfully inserted pageview:', pageviewData.pageview_id);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('API error in /track/pageview:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 