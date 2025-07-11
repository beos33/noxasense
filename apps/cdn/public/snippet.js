/**
 * Noxasense Analytics Tracking Snippet
 * 
 * This script handles user session management and pageview tracking.
 * It collects performance metrics using Web Vitals and sends the data
 * to the Noxasense API for analytics processing.
 */

(() => {
  // Web Vitals 4.2.4 IIFE Build (Minified
  var webVitals = function (e) { "use strict"; var n, t, r, i, o, a = -1, c = function (e) { addEventListener("pageshow", (function (n) { n.persisted && (a = n.timeStamp, e(n)) }), !0) }, u = function () { var e = self.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0]; if (e && e.responseStart > 0 && e.responseStart < performance.now()) return e }, s = function () { var e = u(); return e && e.activationStart || 0 }, f = function (e, n) { var t = u(), r = "navigate"; a >= 0 ? r = "back-forward-cache" : t && (document.prerendering || s() > 0 ? r = "prerender" : document.wasDiscarded ? r = "restore" : t.type && (r = t.type.replace(/_/g, "-"))); return { name: e, value: void 0 === n ? -1 : n, rating: "good", delta: 0, entries: [], id: "v4-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12), navigationType: r } }, d = function (e, n, t) { try { if (PerformanceObserver.supportedEntryTypes.includes(e)) { var r = new PerformanceObserver((function (e) { Promise.resolve().then((function () { n(e.getEntries()) })) })); return r.observe(Object.assign({ type: e, buffered: !0 }, t || {})), r } } catch (e) { } }, l = function (e, n, t, r) { var i, o; return function (a) { n.value >= 0 && (a || r) && ((o = n.value - (i || 0)) || void 0 === i) && (i = n.value, n.delta = o, n.rating = function (e, n) { return e > n[1] ? "poor" : e > n[0] ? "needs-improvement" : "good" }(n.value, t), e(n)) } }, p = function (e) { requestAnimationFrame((function () { return requestAnimationFrame((function () { return e() })) })) }, v = function (e) { document.addEventListener("visibilitychange", (function () { "hidden" === document.visibilityState && e() })) }, m = function (e) { var n = !1; return function () { n || (e(), n = !0) } }, h = -1, g = function () { return "hidden" !== document.visibilityState || document.prerendering ? 1 / 0 : 0 }, T = function (e) { "hidden" === document.visibilityState && h > -1 && (h = "visibilitychange" === e.type ? e.timeStamp : 0, E()) }, y = function () { addEventListener("visibilitychange", T, !0), addEventListener("prerenderingchange", T, !0) }, E = function () { removeEventListener("visibilitychange", T, !0), removeEventListener("prerenderingchange", T, !0) }, C = function () { return h < 0 && (h = g(), y(), c((function () { setTimeout((function () { h = g(), y() }), 0) }))), { get firstHiddenTime() { return h } } }, L = function (e) { document.prerendering ? addEventListener("prerenderingchange", (function () { return e() }), !0) : e() }, S = [1800, 3e3], b = function (e, n) { n = n || {}, L((function () { var t, r = C(), i = f("FCP"), o = d("paint", (function (e) { e.forEach((function (e) { "first-contentful-paint" === e.name && (o.disconnect(), e.startTime < r.firstHiddenTime && (i.value = Math.max(e.startTime - s(), 0), i.entries.push(e), t(!0))) })) })); o && (t = l(e, i, S, n.reportAllChanges), c((function (r) { i = f("FCP"), t = l(e, i, S, n.reportAllChanges), p((function () { i.value = performance.now() - r.timeStamp, t(!0) })) }))) })) }, w = [.1, .25], I = 0, P = 1 / 0, A = 0, F = function (e) { e.forEach((function (e) { e.interactionId && (P = Math.min(P, e.interactionId), A = Math.max(A, e.interactionId), I = A ? (A - P) / 7 + 1 : 0) })) }, M = function () { return n ? I : performance.interactionCount || 0 }, k = function () { "interactionCount" in performance || n || (n = d("event", F, { type: "event", buffered: !0, durationThreshold: 0 })) }, D = [], B = new Map, R = 0, x = function () { var e = Math.min(D.length - 1, Math.floor((M() - R) / 50)); return D[e] }, H = [], N = function (e) { if (H.forEach((function (n) { return n(e) })), e.interactionId || "first-input" === e.entryType) { var n = D[D.length - 1], t = B.get(e.interactionId); if (t || D.length < 10 || e.duration > n.latency) { if (t) e.duration > t.latency ? (t.entries = [e], t.latency = e.duration) : e.duration === t.latency && e.startTime === t.entries[0].startTime && t.entries.push(e); else { var r = { id: e.interactionId, latency: e.duration, entries: [e] }; B.set(r.id, r), D.push(r) } D.sort((function (e, n) { return n.latency - e.latency })), D.length > 10 && D.splice(10).forEach((function (e) { return B.delete(e.id) })) } } }, q = function (e) { var n = self.requestIdleCallback || self.setTimeout, t = -1; return e = m(e), "hidden" === document.visibilityState ? e() : (t = n(e), v(e)), t }, O = [200, 500], j = [2500, 4e3], V = {}, _ = [800, 1800], z = function e(n) { document.prerendering ? L((function () { return e(n) })) : "complete" !== document.readyState ? addEventListener("load", (function () { return e(n) }), !0) : setTimeout(n, 0) }, G = { passive: !0, capture: !0 }, J = new Date, K = function (e, n) { t || (t = n, r = e, i = new Date, W(removeEventListener), Q()) }, Q = function () { if (r >= 0 && r < i - J) { var e = { entryType: "first-input", name: t.type, target: t.target, cancelable: t.cancelable, startTime: t.timeStamp, processingStart: t.timeStamp + r }; o.forEach((function (n) { n(e) })), o = [] } }, U = function (e) { if (e.cancelable) { var n = (e.timeStamp > 1e12 ? new Date : performance.now()) - e.timeStamp; "pointerdown" == e.type ? function (e, n) { var t = function () { K(e, n), i() }, r = function () { i() }, i = function () { removeEventListener("pointerup", t, G), removeEventListener("pointercancel", r, G) }; addEventListener("pointerup", t, G), addEventListener("pointercancel", r, G) }(n, e) : K(n, e) } }, W = function (e) { ["mousedown", "keydown", "touchstart", "pointerdown"].forEach((function (n) { return e(n, U, G) })) }, X = [100, 300]; return e.CLSThresholds = w, e.FCPThresholds = S, e.FIDThresholds = X, e.INPThresholds = O, e.LCPThresholds = j, e.TTFBThresholds = _, e.onCLS = function (e, n) { n = n || {}, b(m((function () { var t, r = f("CLS", 0), i = 0, o = [], a = function (e) { e.forEach((function (e) { if (!e.hadRecentInput) { var n = o[0], t = o[o.length - 1]; i && e.startTime - t.startTime < 1e3 && e.startTime - n.startTime < 5e3 ? (i += e.value, o.push(e)) : (i = e.value, o = [e]) } })), i > r.value && (r.value = i, r.entries = o, t()) }, u = d("layout-shift", a); u && (t = l(e, r, w, n.reportAllChanges), v((function () { a(u.takeRecords()), t(!0) })), c((function () { i = 0, r = f("CLS", 0), t = l(e, r, w, n.reportAllChanges), p((function () { return t() })) })), setTimeout(t, 0)) }))) }, e.onFCP = b, e.onFID = function (e, n) { n = n || {}, L((function () { var i, a = C(), u = f("FID"), s = function (e) { e.startTime < a.firstHiddenTime && (u.value = e.processingStart - e.startTime, u.entries.push(e), i(!0)) }, p = function (e) { e.forEach(s) }, h = d("first-input", p); i = l(e, u, X, n.reportAllChanges), h && (v(m((function () { p(h.takeRecords()), h.disconnect() }))), c((function () { var a; u = f("FID"), i = l(e, u, X, n.reportAllChanges), o = [], r = -1, t = null, W(addEventListener), a = s, o.push(a), Q() }))) })) }, e.onINP = function (e, n) { "PerformanceEventTiming" in self && "interactionId" in PerformanceEventTiming.prototype && (n = n || {}, L((function () { var t; k(); var r, i = f("INP"), o = function (e) { q((function () { e.forEach(N); var n = x(); n && n.latency !== i.value && (i.value = n.latency, i.entries = n.entries, r()) })) }, a = d("event", o, { durationThreshold: null !== (t = n.durationThreshold) && void 0 !== t ? t : 40 }); r = l(e, i, O, n.reportAllChanges), a && (a.observe({ type: "first-input", buffered: !0 }), v((function () { o(a.takeRecords()), r(!0) })), c((function () { R = M(), D.length = 0, B.clear(), i = f("INP"), r = l(e, i, O, n.reportAllChanges) }))) }))) }, e.onLCP = function (e, n) { n = n || {}, L((function () { var t, r = C(), i = f("LCP"), o = function (e) { n.reportAllChanges || (e = e.slice(-1)), e.forEach((function (e) { e.startTime < r.firstHiddenTime && (i.value = Math.max(e.startTime - s(), 0), i.entries = [e], t()) })) }, a = d("largest-contentful-paint", o); if (a) { t = l(e, i, j, n.reportAllChanges); var u = m((function () { V[i.id] || (o(a.takeRecords()), a.disconnect(), V[i.id] = !0, t(!0)) }));["keydown", "click"].forEach((function (e) { addEventListener(e, (function () { return q(u) }), { once: !0, capture: !0 }) })), v(u), c((function (r) { i = f("LCP"), t = l(e, i, j, n.reportAllChanges), p((function () { i.value = performance.now() - r.timeStamp, V[i.id] = !0, t(!0) })) })) } })) }, e.onTTFB = function (e, n) { n = n || {}; var t = f("TTFB"), r = l(e, t, _, n.reportAllChanges); z((function () { var i = u(); i && (t.value = Math.max(i.responseStart - s(), 0), t.entries = [i], r(!0), c((function () { t = f("TTFB", 0), (r = l(e, t, _, n.reportAllChanges))(!0) }))) })) }, e }({});

  // Configuration constants
  const appId = window.NOXASENSE_APP_ID;  // Set via script tag data-app-id attribute
  const apiUrl = 'https://noxasense-api-v4.vercel.app/api/track';
  const SESSION_KEY = "noxasense_session";
  const SESSION_MAX_AGE = 30 * 60 * 1000; // 30 minutes in milliseconds

  /**
   * Session Management
   * Handles creation, storage, and validation of user sessions
   */
  class SessionManager {
    constructor() {
      this.session = this.getOrCreateSession();
      // Send session if it's new
      if (this.session._isNew) {
        // Send session immediately
        this.sendSession();
      }
    }

    /**
     * Creates a new session with unique identifier and user context
     * @returns {Object} New session object
     */
    createNewSession() {
      // Detect OS
      let os = 'unknown';
      if (navigator.userAgent.includes('Windows')) os = 'Windows';
      else if (navigator.userAgent.includes('Mac')) os = 'macOS';
      else if (navigator.userAgent.includes('Linux')) os = 'Linux';
      else if (navigator.userAgent.includes('Android')) os = 'Android';
      else if (navigator.userAgent.includes('iOS')) os = 'iOS';

      return {
        session_id: crypto.randomUUID(),
        application_id: appId,
        created_at: new Date().toISOString(),
        browser: navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)?.[1]?.toLowerCase() || 'unknown',
        browser_version: navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)?.[2] || 'unknown',
        user_agent: navigator.userAgent,
        os: os,
        screen_width: screen.width,
        screen_height: screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        device_type: /Mobi/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        device_memory: navigator.deviceMemory || null,
        referrer: document.referrer,
        _isNew: true
      };
    }

    /**
     * Validates a session object and checks if it's still valid
     * @param {Object} session - Session object to validate
     * @returns {boolean} True if session is valid and not expired
     */
    isSessionValid(session) {
      if (!session || !session.session_id || !session.application_id || !session.created_at) {
        return false;
      }
      const now = new Date().getTime();
      const sessionAge = now - new Date(session.created_at).getTime();
      return sessionAge < SESSION_MAX_AGE;
    }

    /**
     * Retrieves existing session from storage or creates new one
     * @returns {Object} Valid session object
     */
    getOrCreateSession() {
      try {
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
          const session = JSON.parse(stored);
          if (this.isSessionValid(session)) {
            session._isNew = false;
            return session;
          }
        }
      } catch (e) {
        console.error('Error reading session:', e);
      }

      const newSession = this.createNewSession();
      this.saveSession(newSession);
      return newSession;
    }

    /**
     * Saves session to localStorage
     * @param {Object} session - Session to save
     */
    saveSession(session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

      /**
   * Sends the session data to the API
   * Only sends new sessions and marks them as sent
   */
  async sendSession() {
    if (!this.session._isNew) {
      return; // Don't send if already sent
    }

    try {
      const sessionPayload = {
        session: {
          session_id: this.session.session_id,
          application_id: this.session.application_id,
          datetime: this.session.created_at,
          browser: this.session.browser,
          user_agent: this.session.user_agent,
          os: this.session.os || null,
          screen_resolution: `${this.session.screen_width}x${this.session.screen_height}`,
          timezone: this.session.timezone,
          language: this.session.language,
          device_type: this.session.device_type,
          device_memory: this.session.device_memory,
          referrer: this.session.referrer
        }
      };

      const response = await fetch('https://noxasense-api-v4.vercel.app/api/track/session', {
        method: 'POST',
        body: JSON.stringify(sessionPayload),
        keepalive: true,
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        this.session._isNew = false;
        this.saveSession(this.session);
        console.log('NoxaSense: Session sent successfully');
      } else {
        console.warn('NoxaSense: Failed to send session:', response.status);
      }
    } catch (error) {
      console.warn('NoxaSense: Error sending session:', error.message);
    }
  }

    getSessionId() {
      return this.session.session_id;
    }

    getSession() {
      return this.session;
    }
  }

  // Initialize session management
  const sessionManager = new SessionManager();
  window.__SESSION_ID__ = sessionManager.getSessionId();

  /**
   * Pageview Tracking
   * Collects and sends pageview data with performance metrics
   */

  // Track sent pageviews to prevent duplicates
  const sentPageviews = new Set();

  /**
   * Creates a new pageview data structure for each page load
   * @returns {Object} Fresh pageview data object
   */
  function createPageviewData() {
    return {
      pageview_id: crypto.randomUUID(),
      session_id: sessionManager.getSessionId(),
      created_at: new Date().toISOString(),
      domain: window.location.hostname,
      path: window.location.pathname,
      parameters: window.location.search,
      // Session information
      browser: sessionManager.getSession().browser,
      browser_version: sessionManager.getSession().browser_version,
      user_agent: sessionManager.getSession().user_agent,
      screen_width: sessionManager.getSession().screen_width,
      screen_height: sessionManager.getSession().screen_height,
      timezone: sessionManager.getSession().timezone,
      language: sessionManager.getSession().language,
      device_type: sessionManager.getSession().device_type,
      device_memory: sessionManager.getSession().device_memory,
      referrer: sessionManager.getSession().referrer,
      // Performance metrics (populated by Web Vitals)
      cls: undefined,         // Cumulative Layout Shift
      lcp: undefined,         // Largest Contentful Paint
      fid: undefined,         // First Input Delay
      ttfb: undefined,        // Time to First Byte
      fcp: undefined,         // First Contentful Paint
      inp: undefined,         // Interaction to Next Paint
      visible_duration: undefined,
      // Navigation Timing metrics
      dom_interactive: undefined,
      dom_content_loaded: undefined,
      dom_complete: undefined,
      load_time: undefined,
      tti: undefined         // Time to Interactive
    };
  }

  // Initialize pageview data structure for current page load
  let pageviewData = createPageviewData();

  /**
   * Sends data to the API endpoint
   * @param {string} endpoint - API endpoint URL
   * @param {Object} data - Data to send
   * @returns {Promise<boolean>} Success status
   */
  function sendBeacon(endpoint, data) {
    try {
      return fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        keepalive: true,
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        if (!response.ok) {
          console.warn('NoxaSense: API request failed with status:', response.status);
          return false;
        }
        return true;
      }).catch((error) => {
        console.warn('NoxaSense: Failed to send data:', error.message);
        return false;
      });
    } catch (error) {
      console.warn('NoxaSense: Error in sendBeacon:', error.message);
      return false;
    }
  }

  /**
   * Sends pageview data to the API
   * Includes retry logic for failed attempts
   */
  function sendPageviewData() {
    // Prevent duplicate sends
    if (sentPageviews.has(pageviewData.pageview_id)) {
      return;
    }

    const payload = {
      pageviews: [pageviewData]
    };
    
    const sendWithRetry = async (retries = 2) => {
      const success = await sendBeacon(apiUrl, payload);
      if (success) {
        sentPageviews.add(pageviewData.pageview_id);
        console.log('NoxaSense: Data sent successfully');
      } else if (retries > 0) {
        console.log(`NoxaSense: Retrying... (${retries} attempts left)`);
        setTimeout(() => sendWithRetry(retries - 1), 1000);
      } else {
        console.warn('NoxaSense: Failed to send data after all retries');
      }
    };
    
    sendWithRetry();
    
    // Create new pageview data for next page load
    pageviewData = createPageviewData();
  }

  /**
   * Updates a metric in the pageview data
   * Converts camelCase metric names to snake_case for database compatibility
   */
  function updatePageviewMetric(field, value) {
    const snakeField = field.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    pageviewData[snakeField] = value;
  }

  // Web Vitals metric collection
  webVitals.onCLS(metric => updatePageviewMetric('cls', metric.value));
  webVitals.onLCP(metric => updatePageviewMetric('lcp', metric.value));
  webVitals.onFID(metric => updatePageviewMetric('fid', metric.value));
  webVitals.onTTFB(metric => updatePageviewMetric('ttfb', metric.value));
  webVitals.onFCP(metric => updatePageviewMetric('fcp', metric.value));
  webVitals.onINP(metric => updatePageviewMetric('inp', metric.value));

  // Collect Navigation Timing metrics and create new pageview data on page load
  window.addEventListener("load", function () {
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav) {
        updatePageviewMetric('dom_interactive', nav.domInteractive);
        updatePageviewMetric('dom_content_loaded', nav.domContentLoadedEventEnd);
        updatePageviewMetric('dom_complete', nav.domComplete);
        updatePageviewMetric('load_time', nav.loadEventEnd);
      }
    } catch (e) {
      console.warn("Failed to update DOM timing metrics", e);
    }
    
    // Create new pageview data for next page load (for SPAs and page refreshes)
    pageviewData = createPageviewData();
  });

  // Send pageview data when user leaves the page
  window.addEventListener('pagehide', sendPageviewData);
  window.addEventListener('beforeunload', sendPageviewData);
  window.addEventListener('unload', sendPageviewData);

})();