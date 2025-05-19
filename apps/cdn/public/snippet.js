(() => {
    // Initialize batch queue from localStorage first
    const BATCH_KEY = 'noxasense_batch';
    const SESSION_KEY = 'noxasense_session';
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
    const appId = window.NOXASENSE_APP_ID;
    const apiUrl = 'https://noxasense-api-v4.vercel.app/api/track';

    // Debug function to check localStorage state
    function debugLocalStorage() {
      const allKeys = Object.keys(localStorage);
      console.log('NoxaSense: All localStorage keys:', allKeys);
      allKeys.forEach(key => {
        console.log(`NoxaSense: localStorage[${key}]:`, localStorage.getItem(key));
      });
    }

    // Batch queue management
    const BatchQueue = {
      queue: [],
      
      load() {
        try {
          const stored = localStorage.getItem(BATCH_KEY);
          if (stored) {
            this.queue = JSON.parse(stored);
            console.log('NoxaSense: Loaded batch queue:', this.queue);
          } else {
            console.log('NoxaSense: No existing batch queue found');
            this.queue = [];
          }
        } catch (error) {
          console.error('NoxaSense: Error loading batch queue:', error);
          this.queue = [];
        }
      },

      save() {
        try {
          const queueToSave = JSON.stringify(this.queue);
          console.log('NoxaSense: Saving batch queue:', {
            queueLength: this.queue.length,
            queueContent: this.queue,
            stringifiedLength: queueToSave.length
          });
          localStorage.setItem(BATCH_KEY, queueToSave);
          // Verify the save
          const saved = localStorage.getItem(BATCH_KEY);
          console.log('NoxaSense: Verified saved batch queue:', saved);
          debugLocalStorage();
        } catch (error) {
          console.error('NoxaSense: Error saving batch queue:', error);
        }
      },

      add(eventType, data) {
        console.log(`NoxaSense: Adding ${eventType} to queue:`, data);
        this.queue.push({ eventType, data });
        this.save();
      },

      clear() {
        console.log('NoxaSense: Clearing batch queue');
        this.queue = [];
        localStorage.removeItem(BATCH_KEY);
        debugLocalStorage();
      },

      get() {
        return [...this.queue];
      }
    };

    console.log('NoxaSense: Script starting, checking localStorage...');
    debugLocalStorage();

    // Initialize batch queue
    BatchQueue.load();
  
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
      const queue = BatchQueue.get();
      if (queue.length === 0) {
        console.log('NoxaSense: No data to send in batch');
        return;
      }
  
      console.log('NoxaSense: Preparing to send batch:', queue);
  
      // Try each method in order until one succeeds
      const sent = await sendWithFetchLater(queue) || 
                  await sendWithBeacon(queue) || 
                  await sendWithFetch(queue);
      
      if (sent) {
        console.log('NoxaSense: Successfully sent batch, clearing queue');
        BatchQueue.clear();
      } else {
        console.error('NoxaSense: Failed to send data with all methods');
      }
    }

    // Initialize session
    const { sessionId, isNewSession } = getOrCreateSessionId();
  
    // Collect session data if it's a new session
    if (isNewSession) {
      console.log('NoxaSense: Collecting new session data');
      BatchQueue.add('session', {
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
    BatchQueue.add('pageview', {
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
  
    // Handle page unload
    window.addEventListener('beforeunload', () => {
      const queue = BatchQueue.get();
      if (queue.length > 0) {
        console.log('NoxaSense: Page unloading, preparing final batch');
        navigator.sendBeacon(apiUrl, JSON.stringify(queue));
      }
    });
  })();