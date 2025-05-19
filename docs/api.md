# API Project

## Description

The API receives performance data and stores it in Supabase.

## Functional Requirements

### Endpoints

- `POST /api/track`: Accepts batched payload of session and pageview events.
  - Each item must contain:
    ```json
    {
      "eventType": "session" | "pageview",
      "data": { ...fields... }
    }
    ```

### Database Integration
- Uses Supabase JS client.
- Inserts session data into `sessions` table.
- Inserts pageview data into `pageviews` table.
- Links sessions to applications via `application_id`.

## Implementation Overview

- Uses a single API handler (`api/track.js`).
- Iterates over batched items and inserts to correct tables.
- Logs errors and returns HTTP status codes accordingly.

### Sample Server Code (Simplified)

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
    const payload = req.body;

    for (const item of payload) {
      if (item.eventType === 'session') {
        const { error } = await supabase.from('sessions').insert([item.data]);
        if (error) throw error;
      } else if (item.eventType === 'pageview') {
        const { error } = await supabase.from('pageviews').insert([item.data]);
        if (error) throw error;
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

- Deployed via Vercel inside `apps/api` folder.
- Uses API file routing to expose `/api/track`.
- Works without extra `vercel.json` configuration.

## Notes

- No validation or rate limiting included (yet).
- For production, consider adding schema validation, RLS policies, and error logging with monitoring tools.
- Each session should be tied to an `application_id` for multi-app support.
