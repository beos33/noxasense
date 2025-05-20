const { createClient } = require('@supabase/supabase-js');

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    // Extract pageview data
    const { eventType, data: pageviewData } = payload;

    if (!pageviewData) {
      return res.status(400).json({ error: 'Invalid pageview data format' });
    }

    // Insert into Supabase
    const { error } = await supabase.from('pageviews').insert([pageviewData]);
    if (error) {
      console.error('Error inserting pageview:', error);
      return res.status(500).json({ error: 'Failed to insert pageview data' });
    }

    console.log('Successfully inserted pageview:', pageviewData.pageview_id);
    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('API error in /track/pageview:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 