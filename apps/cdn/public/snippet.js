(() => {
    const batchQueue = [];
  
    function collectData(eventType, data) {
      batchQueue.push({ eventType, data });
    }
  
    function sendBatch() {
      if (batchQueue.length === 0) return;
  
      const payload = JSON.stringify(batchQueue);
      batchQueue.length = 0;
  
      const apiUrl = 'https://noxasense-api-v4.vercel.app/api/track';

      if ('fetchLater' in navigator) {
        navigator.fetchLater(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
        });
      } else if ('sendBeacon' in navigator) {
        navigator.sendBeacon(apiUrl, payload);
      } else {
        fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        });
      }
    }
  
    const sessionId = crypto.randomUUID();
    const pageviewId = crypto.randomUUID();
  
    collectData('session', {
      session_id: sessionId,
      datetime: new Date().toISOString(),
      browser: navigator.userAgent,
      os: navigator.platform,
      screen_resolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      device_type: /Mobi/.test(navigator.userAgent) ? 'mobile' : 'desktop',
      referrer: document.referrer,
    });
  
    collectData('pageview', {
      pageview_id: pageviewId,
      session_id: sessionId,
      datetime: new Date().toISOString(),
      domain: location.hostname,
      path: location.pathname,
      parameters: location.search,
    });
  
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendBatch();
      }
    });
  
    window.addEventListener('pagehide', sendBatch);
  })();