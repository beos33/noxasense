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
        "domInteractive": "number",
        "domContentLoaded": "number",
        "domComplete": "number",
        "loadTime": "number"
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

### Sample Server Code

```js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { session, pageviews } = req.body;

    // Insert session if it doesn't exist
    const { error: sessionError } = await supabase
      .from('sessions')
      .upsert([session], { onConflict: 'session_id' });
    
    if (sessionError) throw sessionError;

    // Insert pageviews
    if (pageviews && pageviews.length > 0) {
      const { error: pageviewError } = await supabase
        .from('pageviews')
        .insert(pageviews);
      
      if (pageviewError) throw pageviewError;
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
