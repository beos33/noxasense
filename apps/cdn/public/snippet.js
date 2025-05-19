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
  
      // Create a copy of the queue and clear it after
      const payload = [...batchQueue];
      batchQueue.length = 0;
  
      const apiUrl = 'https://noxasense-api-v4.vercel.app/api/track';

      // Use fetchLater if available
      if ('fetchLater' in navigator) {
        try {
          navigator.fetchLater(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            priority: 'high',
            keepalive: true
          });
          console.log('NoxaSense: Data queued for sending via fetchLater');
        } catch (error) {
          console.error('NoxaSense: Error using fetchLater:', error);
          // Fallback to regular fetch if fetchLater fails
          sendWithFetch(payload);
        }
      } else {
        sendWithFetch(payload);
      }
    }

    function sendWithFetch(payload) {
      if ('sendBeacon' in navigator) {
        const success = navigator.sendBeacon(apiUrl, JSON.stringify(payload));
        if (!success) {
          console.error('NoxaSense: Failed to send data via sendBeacon');
          // Fallback to fetch if sendBeacon fails
          fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true,
          }).catch(error => console.error('NoxaSense: Error sending data:', error));
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
  
    // Collect initial session data
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
  
    // Collect initial pageview data
    collectData('pageview', {
      pageview_id: pageviewId,
      session_id: sessionId,
      application_id: appId,
      datetime: new Date().toISOString(),
      domain: location.hostname,
      path: location.pathname,
      parameters: location.search,
    });
  
    // Send initial batch after a short delay to ensure all data is collected
    setTimeout(sendBatch, 100);
  
    // Send data when page is hidden or unloaded
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendBatch();
      }
    });
  
    window.addEventListener('pagehide', sendBatch);
  })();