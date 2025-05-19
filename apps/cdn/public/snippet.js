(() => {
    // Initialize batch queue from localStorage first
    const BATCH_KEY = 'noxasense_batch';
    const SESSION_KEY = 'noxasense_session';
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
    const appId = window.NOXASENSE_APP_ID;
    const apiUrl = 'https://noxasense-api-v4.vercel.app/api/track';

    // Sessions
    const key = "session_data";
    const maxAge = 30 * 60 * 1000; // 30 minutes in milliseconds
    let data;

    function createNewSession() {
        const now = new Date().toISOString();
        return {
            session_id: crypto.randomUUID(),
            application_id: appId,
            created_at: now,
            browser: navigator.userAgent,
            os: navigator.platform,
            screen_resolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            device_type: /Mobi/.test(navigator.userAgent) ? 'mobile' : 'desktop',
            referrer: document.referrer,
        };
    }

    function getOrCreateSession() {
        try {
            data = JSON.parse(localStorage.getItem(key));
            const now = new Date().getTime();
            if (!data || !data.session_id || now - new Date(data.created_at).getTime() > maxAge) {
                data = createNewSession();
                localStorage.setItem(key, JSON.stringify(data));
            }
        } catch (e) {
            data = createNewSession();
            localStorage.setItem(key, JSON.stringify(data));
        }
        return data;
    }

    // Only run this once to get or create the session
    const sessionData = getOrCreateSession();
    window.__SESSION_ID__ = sessionData.session_id;

    // Pageviews
    const storageKey = "pageview_data";

    // Create a new pageview entry
    const newEntry = {
      created_at: new Date().toISOString(),
      domain: window.location.hostname,
      path: window.location.pathname
    };
  
    // Load existing log or start a new one
    let log = [];
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) {
        log = JSON.parse(existing);
        if (!Array.isArray(log)) log = [];
      }
    } catch (e) {
      console.warn("Could not parse localStorage pageviews log:", e);
      log = [];
    }
  
    // Add the new entry and save back to localStorage
    log.push(newEntry);
    localStorage.setItem(storageKey, JSON.stringify(log));
  
  })();