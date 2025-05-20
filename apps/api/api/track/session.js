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

    // Extract just the session data, removing eventType
    const { eventType, ...sessionData } = payload;

    // Validate session data
    if (!sessionData.application_id) {
      return res.status(400).json({ error: 'Missing application_id in session data' });
    }

    // Insert into Supabase
    const { error } = await supabase.from('sessions').insert([sessionData]);
    if (error) {
      console.error('Error inserting session:', error);
      return res.status(500).json({ error: 'Failed to insert session data' });
    }

    console.log('Successfully inserted session:', sessionData.session_id);
    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('API error in /track/session:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 