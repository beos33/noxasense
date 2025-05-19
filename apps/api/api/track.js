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
    console.log('Received payload:', JSON.stringify(payload, null, 2));

    if (!Array.isArray(payload)) {
      console.error('Invalid payload format - not an array:', payload);
      return res.status(400).json({ error: 'Invalid payload format - must be an array' });
    }

    if (payload.length === 0) {
      console.warn('Empty payload received');
      return res.status(200).json({ status: 'ok', message: 'Empty payload' });
    }

    for (const item of payload) {
      if (!item.eventType || !item.data) {
        console.error('Invalid item format:', item);
        continue;
      }

      if (!item.data.application_id) {
        console.error('Missing application_id in data:', item);
        continue;
      }

      try {
        if (item.eventType === 'session') {
          const { error } = await supabase.from('sessions').insert([item.data]);
          if (error) {
            console.error('Error inserting session:', error);
            throw error;
          }
        } else if (item.eventType === 'pageview') {
          const { error } = await supabase.from('pageviews').insert([item.data]);
          if (error) {
            console.error('Error inserting pageview:', error);
            throw error;
          }
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