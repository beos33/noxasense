# CDN Project

## Description

The CDN hosts the JavaScript snippet that websites integrate to collect performance data from users.

## Functional Requirements

- Track metrics including Core Web Vitals (LCP, FID, CLS), TTFB, TTI, INP, DOM timings, and page load metrics.
- Collect session and pageview attributes for comprehensive performance insights.
- Include application-level association via `application_id`.
- Data batching for efficient, reliable delivery to the API without data loss.

## Structure

- `snippet.js`: Core JavaScript snippet file, hosted in `public/`.

## Batching & Deferred Sending

NoxaSense uses a modern batching approach to ensure reliable data delivery with minimal impact on performance. The snippet:

- Collects both session and pageview data into a local in-memory queue.
- Defers sending using `navigator.fetchLater()` if available.
- Falls back to `navigator.sendBeacon()` or `fetch(..., { keepalive: true })`.
- Automatically triggers sending on `visibilitychange` and `pagehide` events to ensure data is not lost.

## Deployment

- Deployed via Vercel CDN for global availability.
- Can be referenced by client sites via:

```html
<script src="https://your-vercel-cdn-url.vercel.app/snippet.js" async></script>
```
