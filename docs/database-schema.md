# Database Schema

## Applications Table

| Field           | Type      |
|-----------------|-----------|
| application_id  | UUID (PK) |
| name            | Text      |
| user_id         | UUID      |
| domain          | Text      |
| created_at      | Timestamp |

### Relationships
- One user can own multiple applications.
- Applications link to sessions via `application_id`.

---

## Sessions Table

| Field             | Type      |
|-------------------|-----------|
| session_id        | UUID (PK) |
| application_id    | UUID (FK → applications.application_id) |
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
- Many sessions per application.
- One-to-many: sessions → pageviews

---

## Pageviews Table

| Field              | Type      |
|--------------------|-----------|
| pageview_id        | UUID (PK) |
| session_id         | UUID (FK → sessions.session_id) |
| created_at         | Timestamp |
| domain             | Text      |
| path               | Text      |
| parameters         | Text      |
| cls                | Float     |
| lcp                | Float     |
| fid                | Float     |
| ttfb               | Float     |
| fcp                | Float     |
| inp                | Float     |
| dom_interactive    | Float     |
| dom_content_loaded | Float     |
| dom_complete       | Float     |
| load_time          | Float     |

### Relationships
- Many pageviews per session.

---

## Suggested Indexes

To improve query performance, especially when filtering or joining:

```sql
-- Applications
create index idx_applications_user_id on applications (user_id);

-- Sessions
create index idx_sessions_application_id on sessions (application_id);
create index idx_sessions_datetime on sessions (datetime);

-- Pageviews
create index idx_pageviews_session_id on pageviews (session_id);
create index idx_pageviews_datetime on pageviews (datetime);
create index idx_pageviews_path on pageviews (path);
```

These indexes support common lookup patterns such as:
- Filtering by `application_id` to get all sessions
- Filtering by `session_id` to get all pageviews
- Time-based analytics

---

This schema is now aligned with the updated system and MVP tracking setup.