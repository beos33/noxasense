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
| session_id         | UUID      |
| created_at         | Timestamp |
| domain             | Text      |
| path               | Text      |
| parameters         | Text      |
| browser            | Text      |
| browser_version    | Text      |
| user_agent         | Text      |
| screen_width       | Integer   |
| screen_height      | Integer   |
| timezone           | Text      |
| language           | Text      |
| device_type        | Text      |
| device_memory      | Float     |
| referrer           | Text      |
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
- Pageviews are self-contained with session information included.
- No foreign key relationship needed since session data is embedded.

---

## Suggested Indexes

To improve query performance, especially when filtering or joining:

```sql
-- Applications
create index idx_applications_user_id on applications (user_id);

-- Pageviews
create index idx_pageviews_session_id on pageviews (session_id);
create index idx_pageviews_created_at on pageviews (created_at);
create index idx_pageviews_path on pageviews (path);
create index idx_pageviews_domain on pageviews (domain);
create index idx_pageviews_browser on pageviews (browser);
```

These indexes support common lookup patterns such as:
- Filtering by session_id to get all pageviews for a session
- Time-based analytics and reporting
- Browser and domain-specific queries

---

This schema is now aligned with the updated system and MVP tracking setup.