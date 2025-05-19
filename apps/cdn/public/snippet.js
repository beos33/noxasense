(() => {
    const batchQueue = [];
    const appId = window.NOXASENSE_APP_ID;
    const apiUrl = 'https://noxasense-api-v4.vercel.app/api/track';
    const SESSION_KEY = 'noxasense_session';
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  
    if (!appId) {
      console.error('NoxaSense: NOXASENSE_APP_ID is not set');
      return;
    }

    function getOrCreateSessionId() {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const { sessionId, timestamp } = JSON.parse(stored);
        // Check if session is still valid (within 30 minutes)
        if (Date.now() - timestamp < SESSION_DURATION) {
          console.log('NoxaSense: Using existing session:', sessionId);
          return { sessionId, isNewSession: false };
        }
      }
      // Create new session if none exists or if expired
      const newSessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        sessionId: newSessionId,
        timestamp: Date.now()
      }));
      console.log('NoxaSense: Created new session:', newSessionId);
      return { sessionId: newSessionId, isNewSession: true };
    }

    function collectData(eventType, data) {
      console.log(`NoxaSense: Collecting ${eventType} data:`, data);
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
  
      console.log('NoxaSense: Sending batch:', payload);
  
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

    // Initialize session
    const { sessionId, isNewSession } = getOrCreateSessionId();
  
    // Collect session data if it's a new session
    if (isNewSession) {
      console.log('NoxaSense: Collecting new session data');
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
    }
  
    // Always collect pageview data
    console.log('NoxaSense: Collecting pageview data');
    collectData('pageview', {
      pageview_id: crypto.randomUUID(),
      session_id: sessionId,
      datetime: new Date().toISOString(),
      domain: location.hostname,
      path: location.pathname,
      parameters: location.search,
    });
  
    // Send data when page is hidden or unloaded
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        console.log('NoxaSense: Page hidden, sending batch');
        sendBatch();
      }
    });
  
    window.addEventListener('pagehide', () => {
      // Use sendBeacon for the final send as it's most reliable for page unload
      if (batchQueue.length > 0) {
        console.log('NoxaSense: Page unloading, sending final batch');
        const payload = [...batchQueue];
        batchQueue.length = 0;
        navigator.sendBeacon(apiUrl, JSON.stringify(payload));
      }
    });

    // Send initial batch immediately
    sendBatch();
  })();