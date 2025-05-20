const { createClient } = require('@supabase/supabase-js');

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      const data = req.body;
      console.log('Received data:', data);

      const { error } = await supabase
        .from('pageviews')
        .insert([data]);

      if (error) {
        console.error('Supabase error:', error);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      res.status(200).json({ success: true });
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Server error' });
    }
    return;
  }

  // Handle other methods
  res.status(405).json({ error: 'Method not allowed' });
} 