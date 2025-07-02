# API Project

## Description

The API receives performance data from the CDN snippet and stores it in Supabase. It now uses separate endpoints for session and pageview data handling.

## Functional Requirements

### Endpoints

#### Session Endpoint
- `POST /api/track/session`: Accepts session data payload
  ```json
  {
    "session": {
      "session_id": "uuid",
      "application_id": "string",
      "created_at": "iso-timestamp",
      "browser": "string",
      "browser_version": "string",
      "user_agent": "string",
      "screen_width": "number",
      "screen_height": "number",
      "timezone": "string",
      "language": "string",
      "device_type": "mobile|desktop",
      "device_memory": "number",
      "referrer": "string"
    }
  }
  ```

#### Pageview Endpoint
- `POST /api/track`: Accepts pageview data payload
  ```json
  {
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
        "load_time": "number",
        "tti": "number"
      }
    ]
  }
  ```

### CORS and Caching Configuration

The API implements the following CORS and caching headers for all endpoints:
```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "7200",
  "Cache-Control": "public, max-age=7200",
  "Vary": "Origin"
}
```

### Database Integration
- Uses Supabase JS client v2.49.4
- Inserts session data into `sessions` table
- Inserts pageview data into `pageviews` table
- Links sessions to applications via `application_id`

## Implementation Overview

- Separate API handlers for sessions (`api/track/session.js`) and pageviews (`api/track.js`)
- Processes session and pageview data independently
- Logs errors and returns appropriate HTTP status codes
- Handles CORS for all origins with preflight requests
- Supports both OPTIONS (preflight) and POST requests

### Sample Server Code - Session Handler

```js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Set CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '7200',
    'Cache-Control': 'public, max-age=7200'
  };

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Vary', 'Origin');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session } = req.body;
    const { error } = await supabase.from('sessions').insert([session]);
    
    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Session API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}
```

## Environment Variables

Required in `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
```

## Deployment

- Deployed via Vercel inside `apps/api` folder
- Uses API file routing to expose `/api/track` and `/api/track/session`
- CORS and caching configured via `vercel.json`

## Notes

- Each endpoint handles its specific data type independently
- Session data is sent only when a new session is created
- Pageview data is sent when the user leaves the page
- All endpoints are public but require valid payload structure
- Consider implementing:
  - Schema validation for payloads
  - Rate limiting per application_id
  - RLS policies in Supabase
  - Error logging with monitoring tools
