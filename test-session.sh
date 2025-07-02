#!/bin/bash
curl -X POST https://noxasense-api-v4.vercel.app/api/track/session \
  -H "Content-Type: application/json" \
  -d '{
    "session": {
      "session_id": "test-123",
      "application_id": "test-app-123",
      "datetime": "2024-01-01T00:00:00Z",
      "browser": "chrome",
      "user_agent": "test",
      "os": "macOS",
      "screen_resolution": "1920x1080",
      "timezone": "UTC",
      "language": "en",
      "device_type": "desktop",
      "device_memory": "8",
      "referrer": ""
    }
  }' 