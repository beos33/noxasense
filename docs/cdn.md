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
- Application-level association via `NOXASENSE_APP_ID`

## Structure

- `snippet.js`: Core JavaScript snippet file, hosted in `public/`

## Data Collection & Sending

The snippet implements a reliable data collection and sending strategy:

1. **Data Collection:**
   - Stores session and pageview data in localStorage
   - Collects Web Vitals metrics in real-time
   - Updates metrics as they become available

2. **Sending Strategy:**
   - Sends data when 10 pageviews are collected
   - Sends remaining data when user leaves the page
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
