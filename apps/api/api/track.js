import { createClient } from '@supabase/supabase-js';

// Check if environment variables are set
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!process.env.SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req, res) {
  try {
    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      console.log('Handling OPTIONS request');
      res.status(200).end();
      return;
    }

    console.log('Handling request:', req.method);

    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the payload from the request body
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Validate payload structure
    if (!Array.isArray(payload.pageviews)) {
      return res.status(400).json({ error: 'Invalid payload structure' });
    }

    // Insert pageview data if any
    if (payload.pageviews.length > 0) {
      try {
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
      } catch (supabaseError) {
        console.error('Supabase connection error:', supabaseError);
        return res.status(500).json({ 
          error: 'Database connection failed',
          details: supabaseError.message
        });
      }
    }

    return res.status(200).json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      version: '2.0'
    });
  } catch (error) {
    console.error('Unhandled error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}