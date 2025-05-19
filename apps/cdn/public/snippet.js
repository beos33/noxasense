(() => {
    const batchQueue = [];
    const appId = window.NOXASENSE_APP_ID;
    const apiUrl = 'https://noxasense-api-v4.vercel.app/api/track';
  
    if (!appId) {
      console.error('NoxaSense: NOXASENSE_APP_ID is not set');
      return;
    }

    function collectData(eventType, data) {
      batchQueue.push({ eventType, data });
    }
  
    async function sendWithFetchLater(payload) {
      try {
        // Check if fetchLater is available and supported
        if (typeof navigator.fetchLater === 'function') {
          const result = await navigator.fetchLater(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            priority: 'high',
            keepalive: true
          });
          console.log('NoxaSense: Data queued for sending via fetchLater', result);
          return true;
        }
      } catch (error) {
        console.error('NoxaSense: Error using fetchLater:', error);
      }
      return false;
    }

    async function sendWithBeacon(payload) {
      try {
        if (typeof navigator.sendBeacon === 'function') {
          const success = navigator.sendBeacon(apiUrl, JSON.stringify(payload));
          if (success) {
            console.log('NoxaSense: Data sent via sendBeacon');
            return true;
          }
        }
      } catch (error) {
        console.error('NoxaSense: Error using sendBeacon:', error);
      }
      return false;
    }

    async function sendWithFetch(payload) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        });
        if (response.ok) {
          console.log('NoxaSense: Data sent via fetch');
          return true;
        }
      } catch (error) {
        console.error('NoxaSense: Error using fetch:', error);
      }
      return false;
    }
  
    async function sendBatch() {
      if (batchQueue.length === 0) return;
  
      // Create a copy of the queue and clear it after
      const payload = [...batchQueue];
      batchQueue.length = 0;
  
      // Try each method in order until one succeeds
      const sent = await sendWithFetchLater(payload) || 
                  await sendWithBeacon(payload) || 
                  await sendWithFetch(payload);
      
      if (!sent) {
        console.error('NoxaSense: Failed to send data with all methods');
        // Put the data back in the queue to try again later
        batchQueue.push(...payload);
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
  
    window.addEventListener('pagehide', () => {
      // Use sendBeacon for the final send as it's most reliable for page unload
      if (batchQueue.length > 0) {
        const payload = [...batchQueue];
        batchQueue.length = 0;
        navigator.sendBeacon(apiUrl, JSON.stringify(payload));
      }
    });

    // Also try to send any remaining data periodically
    setInterval(sendBatch, 5000);
  })();