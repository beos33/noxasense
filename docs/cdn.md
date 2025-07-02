# CDN Project

## Description

The CDN hosts the JavaScript snippet that websites integrate to collect performance data from users. The snippet collects Core Web Vitals and other performance metrics, along with session and pageview data. The CDN now runs as a dedicated HTTPS server.

## Server Configuration

- Runs as an Express HTTPS server
- Uses SSL/TLS certificates for secure delivery
- CORS enabled for all origins
- Default port: 3001 (configurable via PORT environment variable)

## SSL/TLS Requirements

The server requires SSL/TLS certificates in the `certs` directory:
- `certs/key.pem`: Private key file
- `certs/cert.pem`: Certificate file

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
  - TTI (Time to Interactive)
- Session Management:
  - 30-minute session duration
  - Unique session ID per visit
  - Device and browser information
  - Browser version and memory info
- Pageview Tracking:
  - Unique pageview ID
  - URL and path information
  - Associated session ID
  - Performance metrics
- Application-level association via `NOXASENSE_APP_ID`

## Structure

- `server.js`: HTTPS server implementation
- `public/snippet.js`: Core JavaScript snippet file
- `certs/`: SSL/TLS certificates directory

## Data Collection & Sending

The snippet implements a reliable data collection and sending strategy:

1. **Session Management:**
   - Creates new session on first visit
   - Stores session data in localStorage
   - Refreshes session after 30 minutes
   - Maintains session ID across pageviews

2. **Data Collection:**
   - Collects Web Vitals metrics in real-time
   - Updates metrics as they become available
   - Tracks browser and device capabilities
   - Records screen dimensions and timezone
   - Collects Navigation Timing metrics
   - Embeds session information in pageview data

3. **Sending Strategy:**
   - Sends unified pageview data when user leaves the page
   - Includes all performance metrics and session information in single record
   - Uses `fetch` with `keepalive: true` for reliable delivery
   - Implements retry logic for failed attempts
   - Prevents duplicate sends via tracking
   - Improved error handling and logging

## Integration

Add the following script to your website:

```html
<script>
  window.NOXASENSE_APP_ID = 'your-application-id';
</script>
<script src="https://your-cdn-domain:3001/snippet.js" async></script>
```

## Deployment

- Requires valid SSL/TLS certificates
- Runs as standalone HTTPS server
- Configure firewall to allow port 3001 (or custom port)
- Set up DNS records for your CDN domain

## Data Structures

### Unified Pageview Data
```javascript
{
  pageview_id: "uuid",
  session_id: "uuid",
  created_at: "iso-timestamp",
  domain: "string",
  path: "string",
  parameters: "string",
  // Session information (embedded)
  browser: "string",
  browser_version: "string",
  user_agent: "string",
  screen_width: "number",
  screen_height: "number",
  timezone: "string",
  language: "string",
  device_type: "mobile|desktop",
  device_memory: "number",
  referrer: "string",
  // Performance metrics
  cls: "number",
  lcp: "number",
  fid: "number",
  ttfb: "number",
  fcp: "number",
  inp: "number",
  dom_interactive: "number",
  dom_content_loaded: "number",
  dom_complete: "number",
  load_time: "number",
  tti: "number"
}
```

**Note**: Session and pageview data are now unified into a single record for improved performance and simplified data management.

## Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```
