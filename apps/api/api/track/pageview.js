const { createClient } = require('@supabase/supabase-js');

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    let data = req.body;
    
    // Parse if string
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        res.status(400).json({ error: 'Invalid JSON' });
        return;
      }
    }

    // Ensure we have the required fields
    if (!data.pageview_id || !data.session_id) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Upsert into Supabase
    const { error } = await supabase
      .from('pageviews')
      .upsert([data], {
        onConflict: 'pageview_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ error: 'Database error', details: error.message });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
} 