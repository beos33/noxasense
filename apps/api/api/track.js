import { createClient } from '@supabase/supabase-js';

// Supabase client initialized with root-level .env variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;

    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: 'Invalid payload format' });
    }

    for (const item of payload) {
      if (!item.eventType || !item.data) continue;

      if (item.eventType === 'session') {
        const { error } = await supabase.from('sessions').insert([item.data]);
        if (error) throw error;
      } else if (item.eventType === 'pageview') {
        const { error } = await supabase.from('pageviews').insert([item.data]);
        if (error) throw error;
      } else {
        console.warn('Unknown event type:', item.eventType);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('API error in /track:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}