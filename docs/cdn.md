# CDN Project

## Description

The CDN hosts the JavaScript snippet that websites integrate to collect performance data from users. The snippet collects Core Web Vitals and other performance metrics, along with session and pageview data.

## Functional Requirements

- Track Core Web Vitals:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
  - INP (Interaction to Next Paint)
- Additional Performance Metrics:
  - TTFB (Time to First Byte)
  - FCP (First Contentful Paint)
  - DOM timings (Interactive, ContentLoaded, Complete)
  - Page load time
- Session Management:
  - 30-minute session duration
  - Unique session ID per visit
  - Device and browser information
- Pageview Tracking:
  - Unique pageview ID
  - URL and path information
  - Associated session ID
  - Performance metrics
- Application-level association via `NOXASENSE_APP_ID`

## Structure

- `snippet.js`: Core JavaScript snippet file, hosted in `public/`
- `server.js`: Express server for serving the snippet

## Data Collection & Sending

The snippet implements a reliable data collection and sending strategy:

1. **Data Collection:**
   - Collects Web Vitals metrics in real-time
   - Updates metrics as they become available
   - Stores session data in localStorage
   - Creates new session after 30 minutes

2. **Sending Strategy:**
   - Sends session data after page is fully loaded
   - Sends pageview data when user leaves the page
   - Uses `navigator.sendBeacon()` for guaranteed delivery during page unload
   - Falls back to `fetch(..., { keepalive: true })` for older browsers

3. **Session Management:**
   - Creates new session on first visit
   - Refreshes session after 30 minutes
   - Maintains session ID across pageviews

## Integration

Add the following script to your website:

```html
<script>
  window.NOXASENSE_APP_ID = 'your-application-id';
</script>
<script src="https://noxasense-api-v4.vercel.app/snippet.js" async></script>
```

## Deployment

- Deployed via Vercel CDN for global availability
- Automatically handles CORS and caching headers
- Supports all modern browsers
- Uses HTTPS for secure data transmission

## Data Structure

### Session Data
```javascript
{
  session_id: "uuid",
  application_id: "string",
  created_at: "iso-timestamp",
  browser: "string",
  os: "string",
  screen_resolution: "string",
  timezone: "string",
  language: "string",
  device_type: "mobile|desktop",
  referrer: "string"
}
```

### Pageview Data
```javascript
{
  pageview_id: "uuid",
  session_id: "uuid",
  created_at: "iso-timestamp",
  domain: "string",
  path: "string",
  parameters: "string",
  cls: "number",
  lcp: "number",
  fid: "number",
  ttfb: "number",
  fcp: "number",
  inp: "number",
  dom_interactive: "number",
  dom_content_loaded: "number",
  dom_complete: "number",
  load_time: "number"
}
```
