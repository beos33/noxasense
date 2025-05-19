(() => {
    // Initialize batch queue from localStorage first
    const BATCH_KEY = 'noxasense_batch';
    const SESSION_KEY = 'noxasense_session';
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
    const appId = window.NOXASENSE_APP_ID;
    const apiUrl = 'https://noxasense-api-v4.vercel.app/api/track';

    // Session ID
    const key = "session_data";
    const maxAge = 30 * 60 * 1000;
    const now = Date.now();
    let data;
  
    try {
      data = JSON.parse(localStorage.getItem(key)) || {};
    } catch (e) {
      data = {};
    }
  
    if (!data.session_id || now - data.created_at > maxAge) {
      data = { 
        session_id: crypto.randomUUID(),
        application_id: appId,
        created_at: now
      };
      localStorage.setItem(key, JSON.stringify(data));
    }
  
    window.__SESSION_ID__ = data.session_id;
  
  })();