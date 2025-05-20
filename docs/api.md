# API Project

## Description

The API receives performance data from the CDN snippet and stores it in Supabase. It handles both session and pageview data in a single endpoint.

## Functional Requirements

### Endpoints

- `POST /api/track`: Accepts performance data payload containing session and pageviews
  ```json
  {
    "session": {
      "session_id": "uuid",
      "application_id": "string",
      "created_at": "iso-timestamp",
      "browser": "string",
      "os": "string",
      "screen_resolution": "string",
      "timezone": "string",
      "language": "string",
      "device_type": "mobile|desktop",
      "referrer": "string"
    },
    "pageviews": [
      {
        "pageview_id": "uuid",
        "session_id": "uuid",
        "created_at": "iso-timestamp",
        "domain": "string",
        "path": "string",
        "parameters": "string",
        "cls": "number",
        "lcp": "number",
        "fid": "number",
        "ttfb": "number",
        "fcp": "number",
        "inp": "number",
        "dom_interactive": "number",
        "dom_content_loaded": "number",
        "dom_complete": "number",
        "load_time": "number"
      }
    ]
  }
  ```

### Database Integration
- Uses Supabase JS client
- Inserts session data into `sessions` table
- Inserts pageview data into `pageviews` table
- Links sessions to applications via `application_id`

## Implementation Overview

- Uses a single API handler (`api/track.js`)
- Processes session and pageview data in a single transaction
- Logs errors and returns HTTP status codes accordingly
- Handles CORS for all origins
- Supports both OPTIONS (preflight) and POST requests

### Sample Server Code

```js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Set CORS headers for actual requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    let payload;
    try {
      payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: 'Invalid payload format - must be an array' });
    }

    for (const item of payload) {
      if (!item.eventType || !item.data) {
        console.error('Invalid item format:', item);
        continue;
      }

      try {
        if (item.eventType === 'session') {
          if (!item.data.application_id) {
            console.error('Missing application_id in session data:', item);
            continue;
          }
          const { error } = await supabase.from('sessions').insert([item.data]);
          if (error) throw error;
        } else if (item.eventType === 'pageview') {
          const { error } = await supabase.from('pageviews').insert([item.data]);
          if (error) throw error;
        }
      } catch (itemError) {
        console.error(`Error processing ${item.eventType}:`, itemError);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('API error in /track:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
```

## Environment Variables

Set in `.env` (root):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
```

## Deployment

- Deployed via Vercel inside `apps/api` folder
- Uses API file routing to expose `/api/track`
- Works without extra `vercel.json` configuration

## Notes

- No validation or rate limiting included (yet)
- For production, consider adding:
  - Schema validation for session and pageview data
  - Rate limiting per application_id
  - RLS policies in Supabase
  - Error logging with monitoring tools
- Each session is tied to an `application_id` for multi-app support
- Pageviews are linked to sessions via `session_id`
- CORS is configured to accept requests from all origins
