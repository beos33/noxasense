# Database Schema

## Sessions Table

| Field             | Type      |
|-------------------|-----------|
| session_id        | UUID      |
| datetime          | Timestamp |
| browser           | Text      |
| user_agent        | Text      |
| os                | Text      |
| screen_resolution | Text      |
| timezone          | Text      |
| language          | Text      |
| device_type       | Text      |
| device_memory     | Text      |
| referrer          | Text      |

### Relationships
- One session has many pageviews.

---

## Pageviews Table

| Field              | Type      |
|--------------------|-----------|
| pageview_id        | UUID      |
| session_id         | UUID      |
| datetime           | Timestamp |
| domain             | Text      |
| path               | Text      |
| parameters         | Text      |
| lcp                | Float     |
| fid                | Float     |
| cls                | Float     |
| ttfb               | Float     |
| tti                | Float     |
| inp                | Float     |
| visible_duration   | Float     |
| dom_interactive    | Float     |
| dom_content_loaded | Float     |
| dom_complete       | Float     |
| load_time          | Float     |

---

## Applications Table

| Field           | Type      |
|-----------------|-----------|
| application_id  | UUID      |
| name            | Text      |
| user_id         | UUID      |
| domain          | Text      |
| created_at      | Timestamp |

### Relationships
- An application belongs to a user.
- Users can manage multiple applications.