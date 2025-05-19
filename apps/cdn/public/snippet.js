(() => {
    const batchQueue = [];
    const appId = window.NOXASENSE_APP_ID;
  
    if (!appId) {
      console.error('NoxaSense: NOXASENSE_APP_ID is not set');
      return;
    }

    function collectData(eventType, data) {
      batchQueue.push({ eventType, data });
    }
  
    function sendBatch() {
      if (batchQueue.length === 0) return;
  
      const payload = batchQueue;
      batchQueue.length = 0;
  
      const apiUrl = 'https://noxasense-api-v4.vercel.app/api/track';

      if ('fetchLater' in navigator) {
        navigator.fetchLater(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(error => console.error('NoxaSense: Error sending data:', error));
      } else if ('sendBeacon' in navigator) {
        const success = navigator.sendBeacon(apiUrl, JSON.stringify(payload));
        if (!success) {
          console.error('NoxaSense: Failed to send data via sendBeacon');
        }
      } else {
        fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(error => console.error('NoxaSense: Error sending data:', error));
      }
    }
  
    const sessionId = crypto.randomUUID();
    const pageviewId = crypto.randomUUID();
  
    collectData('session', {
      session_id: sessionId,
      application_id: appId,
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
      application_id: appId,
      datetime: new Date().toISOString(),
      domain: location.hostname,
      path: location.pathname,
      parameters: location.search,
    });
  
    // Send initial batch
    sendBatch();
  
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendBatch();
      }
    });
  
    window.addEventListener('pagehide', sendBatch);
  })();