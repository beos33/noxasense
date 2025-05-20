(() => {
  // Web Vitals library (v4.2.4) - Used for collecting Core Web Vitals metrics
  // This is the minified IIFE build that provides methods like onCLS, onLCP, onFID, etc.
  var webVitals = function (e) { "use strict"; var n, t, r, i, o, a = -1, c = function (e) { addEventListener("pageshow", (function (n) { n.persisted && (a = n.timeStamp, e(n)) }), !0) }, u = function () { var e = self.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0]; if (e && e.responseStart > 0 && e.responseStart < performance.now()) return e }, s = function () { var e = u(); return e && e.activationStart || 0 }, f = function (e, n) { var t = u(), r = "navigate"; a >= 0 ? r = "back-forward-cache" : t && (document.prerendering || s() > 0 ? r = "prerender" : document.wasDiscarded ? r = "restore" : t.type && (r = t.type.replace(/_/g, "-"))); return { name: e, value: void 0 === n ? -1 : n, rating: "good", delta: 0, entries: [], id: "v4-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12), navigationType: r } }, d = function (e, n, t) { try { if (PerformanceObserver.supportedEntryTypes.includes(e)) { var r = new PerformanceObserver((function (e) { Promise.resolve().then((function () { n(e.getEntries()) })) })); return r.observe(Object.assign({ type: e, buffered: !0 }, t || {})), r } } catch (e) { } }, l = function (e, n, t, r) { var i, o; return function (a) { n.value >= 0 && (a || r) && ((o = n.value - (i || 0)) || void 0 === i) && (i = n.value, n.delta = o, n.rating = function (e, n) { return e > n[1] ? "poor" : e > n[0] ? "needs-improvement" : "good" }(n.value, t), e(n)) } }, p = function (e) { requestAnimationFrame((function () { return requestAnimationFrame((function () { return e() })) })) }, v = function (e) { document.addEventListener("visibilitychange", (function () { "hidden" === document.visibilityState && e() })) }, m = function (e) { var n = !1; return function () { n || (e(), n = !0) } }, h = -1, g = function () { return "hidden" !== document.visibilityState || document.prerendering ? 1 / 0 : 0 }, T = function (e) { "hidden" === document.visibilityState && h > -1 && (h = "visibilitychange" === e.type ? e.timeStamp : 0, E()) }, y = function () { addEventListener("visibilitychange", T, !0), addEventListener("prerenderingchange", T, !0) }, E = function () { removeEventListener("visibilitychange", T, !0), removeEventListener("prerenderingchange", T, !0) }, C = function () { return h < 0 && (h = g(), y(), c((function () { setTimeout((function () { h = g(), y() }), 0) }))), { get firstHiddenTime() { return h } } }, L = function (e) { document.prerendering ? addEventListener("prerenderingchange", (function () { return e() }), !0) : e() }, S = [1800, 3e3], b = function (e, n) { n = n || {}, L((function () { var t, r = C(), i = f("FCP"), o = d("paint", (function (e) { e.forEach((function (e) { "first-contentful-paint" === e.name && (o.disconnect(), e.startTime < r.firstHiddenTime && (i.value = Math.max(e.startTime - s(), 0), i.entries.push(e), t(!0))) })) })); o && (t = l(e, i, S, n.reportAllChanges), c((function (r) { i = f("FCP"), t = l(e, i, S, n.reportAllChanges), p((function () { i.value = performance.now() - r.timeStamp, t(!0) })) }))) })) }, w = [.1, .25], I = 0, P = 1 / 0, A = 0, F = function (e) { e.forEach((function (e) { e.interactionId && (P = Math.min(P, e.interactionId), A = Math.max(A, e.interactionId), I = A ? (A - P) / 7 + 1 : 0) })) }, M = function () { return n ? I : performance.interactionCount || 0 }, k = function () { "interactionCount" in performance || n || (n = d("event", F, { type: "event", buffered: !0, durationThreshold: 0 })) }, D = [], B = new Map, R = 0, x = function () { var e = Math.min(D.length - 1, Math.floor((M() - R) / 50)); return D[e] }, H = [], N = function (e) { if (H.forEach((function (n) { return n(e) })), e.interactionId || "first-input" === e.entryType) { var n = D[D.length - 1], t = B.get(e.interactionId); if (t || D.length < 10 || e.duration > n.latency) { if (t) e.duration > t.latency ? (t.entries = [e], t.latency = e.duration) : e.duration === t.latency && e.startTime === t.entries[0].startTime && t.entries.push(e); else { var r = { id: e.interactionId, latency: e.duration, entries: [e] }; B.set(r.id, r), D.push(r) } D.sort((function (e, n) { return n.latency - e.latency })), D.length > 10 && D.splice(10).forEach((function (e) { return B.delete(e.id) })) } } }, q = function (e) { var n = self.requestIdleCallback || self.setTimeout, t = -1; return e = m(e), "hidden" === document.visibilityState ? e() : (t = n(e), v(e)), t }, O = [200, 500], j = [2500, 4e3], V = {}, _ = [800, 1800], z = function e(n) { document.prerendering ? L((function () { return e(n) })) : "complete" !== document.readyState ? addEventListener("load", (function () { return e(n) }), !0) : setTimeout(n, 0) }, G = { passive: !0, capture: !0 }, J = new Date, K = function (e, n) { t || (t = n, r = e, i = new Date, W(removeEventListener), Q()) }, Q = function () { if (r >= 0 && r < i - J) { var e = { entryType: "first-input", name: t.type, target: t.target, cancelable: t.cancelable, startTime: t.timeStamp, processingStart: t.timeStamp + r }; o.forEach((function (n) { n(e) })), o = [] } }, U = function (e) { if (e.cancelable) { var n = (e.timeStamp > 1e12 ? new Date : performance.now()) - e.timeStamp; "pointerdown" == e.type ? function (e, n) { var t = function () { K(e, n), i() }, r = function () { i() }, i = function () { removeEventListener("pointerup", t, G), removeEventListener("pointercancel", r, G) }; addEventListener("pointerup", t, G), addEventListener("pointercancel", r, G) }(n, e) : K(n, e) } }, W = function (e) { ["mousedown", "keydown", "touchstart", "pointerdown"].forEach((function (n) { return e(n, U, G) })) }, X = [100, 300]; return e.CLSThresholds = w, e.FCPThresholds = S, e.FIDThresholds = X, e.INPThresholds = O, e.LCPThresholds = j, e.TTFBThresholds = _, e.onCLS = function (e, n) { n = n || {}, b(m((function () { var t, r = f("CLS", 0), i = 0, o = [], a = function (e) { e.forEach((function (e) { if (!e.hadRecentInput) { var n = o[0], t = o[o.length - 1]; i && e.startTime - t.startTime < 1e3 && e.startTime - n.startTime < 5e3 ? (i += e.value, o.push(e)) : (i = e.value, o = [e]) } })), i > r.value && (r.value = i, r.entries = o, t()) }, u = d("layout-shift", a); u && (t = l(e, r, w, n.reportAllChanges), v((function () { a(u.takeRecords()), t(!0) })), c((function () { i = 0, r = f("CLS", 0), t = l(e, r, w, n.reportAllChanges), p((function () { return t() })) })), setTimeout(t, 0)) }))) }, e.onFCP = b, e.onFID = function (e, n) { n = n || {}, L((function () { var i, a = C(), u = f("FID"), s = function (e) { e.startTime < a.firstHiddenTime && (u.value = e.processingStart - e.startTime, u.entries.push(e), i(!0)) }, p = function (e) { e.forEach(s) }, h = d("first-input", p); i = l(e, u, X, n.reportAllChanges), h && (v(m((function () { p(h.takeRecords()), h.disconnect() }))), c((function () { var a; u = f("FID"), i = l(e, u, X, n.reportAllChanges), o = [], r = -1, t = null, W(addEventListener), a = s, o.push(a), Q() }))) })) }, e.onINP = function (e, n) { "PerformanceEventTiming" in self && "interactionId" in PerformanceEventTiming.prototype && (n = n || {}, L((function () { var t; k(); var r, i = f("INP"), o = function (e) { q((function () { e.forEach(N); var n = x(); n && n.latency !== i.value && (i.value = n.latency, i.entries = n.entries, r()) })) }, a = d("event", o, { durationThreshold: null !== (t = n.durationThreshold) && void 0 !== t ? t : 40 }); r = l(e, i, O, n.reportAllChanges), a && (a.observe({ type: "first-input", buffered: !0 }), v((function () { o(a.takeRecords()), r(!0) })), c((function () { R = M(), D.length = 0, B.clear(), i = f("INP"), r = l(e, i, O, n.reportAllChanges) }))) }))) }, e.onLCP = function (e, n) { n = n || {}, L((function () { var t, r = C(), i = f("LCP"), o = function (e) { n.reportAllChanges || (e = e.slice(-1)), e.forEach((function (e) { e.startTime < r.firstHiddenTime && (i.value = Math.max(e.startTime - s(), 0), i.entries = [e], t()) })) }, a = d("largest-contentful-paint", o); if (a) { t = l(e, i, j, n.reportAllChanges); var u = m((function () { V[i.id] || (o(a.takeRecords()), a.disconnect(), V[i.id] = !0, t(!0)) }));["keydown", "click"].forEach((function (e) { addEventListener(e, (function () { return q(u) }), { once: !0, capture: !0 }) })), v(u), c((function (r) { i = f("LCP"), t = l(e, i, j, n.reportAllChanges), p((function () { i.value = performance.now() - r.timeStamp, V[i.id] = !0, t(!0) })) })) } })) }, e.onTTFB = function (e, n) { n = n || {}; var t = f("TTFB"), r = l(e, t, _, n.reportAllChanges); z((function () { var i = u(); i && (t.value = Math.max(i.responseStart - s(), 0), t.entries = [i], r(!0), c((function () { t = f("TTFB", 0), (r = l(e, t, _, n.reportAllChanges))(!0) }))) })) }, e }({});

  // Storage keys and configuration
  const BATCH_KEY = 'noxasense_batch';          // Key for storing batched events
  const SESSION_KEY = 'noxasense_session';      // Key for storing session data
  const SESSION_DURATION = 30 * 60 * 1000;      // Session duration: 30 minutes in milliseconds
  const appId = window.NOXASENSE_APP_ID;        // Application ID from global configuration
  const apiUrl = 'https://noxasense-api-v4.vercel.app/api/track';  // API endpoint for tracking

  // Session management
  const key = "session_data";                   // LocalStorage key for session data
  const maxAge = 30 * 60 * 1000;                // Maximum session age: 30 minutes
  let data;                                     // Current session data

  /**
   * Creates a new session with user and device information
   * @returns {Object} Session object containing user and device details
   */
  function createNewSession() {
    const now = new Date().toISOString();
    return {
      session_id: crypto.randomUUID(),          // Unique session identifier
      application_id: appId,                    // Application identifier
      created_at: new Date().toISOString(),     // Session creation timestamp
      browser: navigator.userAgent,             // Browser user agent string
      os: navigator.platform,                   // Operating system
      screen_resolution: `${screen.width}x${screen.height}`,  // Screen dimensions
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,  // User's timezone
      language: navigator.language,             // User's preferred language
      device_type: /Mobi/.test(navigator.userAgent) ? 'mobile' : 'desktop',  // Device type detection
      referrer: document.referrer,              // Previous page URL
    };
  }

  /**
   * Retrieves existing session or creates a new one if expired/not found
   * @returns {Object} Current or new session data
   */
  function getOrCreateSession() {
    try {
      data = JSON.parse(localStorage.getItem(key));
      const now = new Date().getTime();
      // Create new session if none exists or current one is expired
      if (!data || !data.session_id || now - new Date(data.created_at).getTime() > maxAge) {
        data = createNewSession();
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {
      // If any error occurs, create a new session
      data = createNewSession();
      localStorage.setItem(key, JSON.stringify(data));
    }
    return data;
  }

  // Initialize session and expose session ID globally
  const sessionData = getOrCreateSession();
  window.__SESSION_ID__ = sessionData.session_id;

  // Pageview tracking
  const storageKey = "pageview_data";           // LocalStorage key for pageview data
  let latestPageviewId;                         // ID of the most recently created pageview

  /**
   * Creates a new pageview entry with current page information
   */
  const newEntry = {
    pageview_id: crypto.randomUUID(),           // Unique pageview identifier
    created_at: new Date().toISOString(),       // Pageview timestamp
    domain: window.location.hostname,           // Current domain
    path: window.location.pathname,             // Current path
    parameters: location.search,                // URL parameters
    session_id: sessionData.session_id,         // Associated session ID
    cls: undefined,                            // Cumulative Layout Shift
    lcp: undefined,                            // Largest Contentful Paint
    fid: undefined,                            // First Input Delay
    ttfb: undefined,                           // Time to First Byte
    fcp: undefined,                            // First Contentful Paint
    inp: undefined,                            // Interaction to Next Paint
    domInteractive: undefined,                 // DOM Interactive timing
    domContentLoaded: undefined,               // DOM Content Loaded timing
    domComplete: undefined,                    // DOM Complete timing
    loadTime: undefined                        // Total page load time
  };

  // Store the latest pageview ID
  latestPageviewId = newEntry.pageview_id;

  // Load existing pageview log or initialize new one
  let log = [];
  try {
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      log = JSON.parse(existing);
      if (!Array.isArray(log)) log = [];
    }
  } catch (e) {
    console.warn("Failed to load existing pageview data:", e);
    log = [];
  }

  // Add new pageview and save to localStorage
  log.push(newEntry);
  localStorage.setItem(storageKey, JSON.stringify(log));

  /**
   * Updates a specific metric for the current pageview
   * @param {string} field - The metric field to update
   * @param {any} value - The new value for the metric
   */
  function updatePageviewMetric(field, value) {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (!Array.isArray(stored)) return;
      const entry = stored.find(p => p.pageview_id === latestPageviewId);
      if (!entry) return;
      entry[field] = value;
      localStorage.setItem(storageKey, JSON.stringify(stored));
    } catch (e) {
      console.warn("Failed to update field:", field, e);
    }
  }

  // Web Vitals metric collection
  webVitals.onCLS(metric => updatePageviewMetric('cls', metric.value));      // Cumulative Layout Shift
  webVitals.onLCP(metric => updatePageviewMetric('lcp', metric.value));      // Largest Contentful Paint
  webVitals.onFID(metric => updatePageviewMetric('fid', metric.value));      // First Input Delay
  webVitals.onTTFB(metric => updatePageviewMetric('ttfb', metric.value));    // Time to First Byte
  webVitals.onFCP(metric => updatePageviewMetric('fcp', metric.value));      // First Contentful Paint
  webVitals.onINP(metric => updatePageviewMetric('inp', metric.value));      // Interaction to Next Paint

  // Additional DOM timing metrics
  window.addEventListener("load", function () {
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav) {
        updatePageviewMetric('domInteractive', nav.domInteractive);
        updatePageviewMetric('domContentLoaded', nav.domContentLoadedEventEnd);
        updatePageviewMetric('domComplete', nav.domComplete);
        updatePageviewMetric('loadTime', nav.loadEventEnd);
      }
    } catch (e) {
      console.warn("Failed to update DOM timing metrics", e);
    }
  });

  /**
   * Sends RUM (Real User Monitoring) data to the server
   * Sends all available pageviews and clears the storage after sending
   */
  function sendRUMData() {
    try {
      const session = JSON.parse(localStorage.getItem(key));
      const pageviews = JSON.parse(localStorage.getItem(storageKey));

      // Validate data before sending
      if (!session?.session_id || !Array.isArray(pageviews) || pageviews.length === 0) {
        return;
      }

      const payload = JSON.stringify({ session, pageviews });

      // Use sendBeacon for guaranteed delivery during page unload
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          'https://noxasense-api-v4.vercel.app/api/track',
          new Blob([payload], { type: 'application/json' })
        );
      } else {
        // Fallback to fetch with keepalive for older browsers
        fetch('https://noxasense-api-v4.vercel.app/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(console.warn);
      }

      // Clear the pageview data after successful send
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn('Failed to send RUM data:', e);
    }
  }

  /**
   * Checks if we should send data based on pageview count
   * Sends data if we have 10 or more pageviews
   */
  function checkAndSend() {
    try {
      const pageviews = JSON.parse(localStorage.getItem(storageKey));
      if (Array.isArray(pageviews) && pageviews.length >= 10) {
        sendRUMData();
      }
    } catch (e) {
      console.warn('Failed to check pageview count:', e);
    }
  }

  // Send data when user leaves the page
  window.addEventListener('pagehide', sendRUMData);

  // Check if we should send after adding new pageview
  checkAndSend();

})();