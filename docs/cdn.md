# CDN Project

## Description

The CDN hosts the JavaScript snippet that websites integrate to collect performance data from users.

## Functional Requirements

- Track metrics including Core Web Vitals (LCP, FID, CLS), TTFB, TTI, INP, DOM timings, and page load metrics.
- Collect session and pageview attributes for comprehensive performance insights.
- Data batching for efficient, reliable delivery to the API without data loss.

## Structure

- `snippet.js`: Core JavaScript snippet file.

## Best Practices

- Optimize snippet performance and size.
- Batch API requests efficiently (e.g., using FetchLater).

## Deployment

- Deployed via Vercel CDN for global availability.

## Batching & Deferred Sending

NoxaSense uses a modern batching approach to ensure reliable data delivery with minimal impact on performance. The snippet:

- Collects both session and pageview data into a local in-memory queue.
- Defers sending using `navigator.fetchLater()` if available.
- Falls back to `navigator.sendBeacon()` or `fetch(..., { keepalive: true })`.
- Automatically triggers sending on `visibilitychange` and `pagehide` events to ensure data is not lost.