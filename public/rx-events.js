/* RogueX first party stats: counts only, no cookies, nothing personal. Listens to page events and never changes the page. */
(function () {
  "use strict";
  if (!window.JSON || !document.addEventListener) return;
  var END = "/rx-e.php", path = location.pathname || "/", q = [], timer = null, sentScroll = {}, started = {}, viewed = {};
  function flush() {
    if (!q.length) return;
    var body = JSON.stringify({ e: q.splice(0, 20) });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(END, new Blob([body], { type: "text/plain" }))) return;
      if (window.fetch) fetch(END, { method: "POST", body: body, keepalive: true, credentials: "omit", headers: { "Content-Type": "text/plain" } });
    } catch (e) {}
  }
  function ev(type, label, now) {
    q.push([type, path, label || ""]);
    clearTimeout(timer);
    if (now || q.length >= 20) flush(); else timer = setTimeout(flush, 2000);
  }
  ev("pv");
  // Phone, text and email taps
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var h = (a.getAttribute("href") || "").toLowerCase();
    if (h.indexOf("tel:") === 0) ev("tel", "", true);
    else if (h.indexOf("sms:") === 0) ev("sms", "", true);
    else if (h.indexOf("mailto:") === 0) ev("email", "", true);
  }, { capture: true, passive: true });
  // Booking and contact forms: view, first field focus, submit
  function formName(f, i) {
    var n = f.getAttribute("id") || f.getAttribute("name") || "form" + (i + 1);
    return String(n).replace(/[^A-Za-z0-9_\-]/g, "").slice(0, 40) || "form" + (i + 1);
  }
  function watchForms() {
    var forms = [].slice.call(document.querySelectorAll("form")).filter(function (f) {
      return (f.getAttribute("method") || "get").toLowerCase() === "post" && f.getAttribute("role") !== "search";
    });
    forms.forEach(function (f, i) {
      if (f.__rxw) return; f.__rxw = 1;
      var n = formName(f, i);
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (ents) {
          ents.forEach(function (en) { if (en.isIntersecting && !viewed[n]) { viewed[n] = 1; ev("form_view", n); io.disconnect(); } });
        }, { threshold: 0.25 });
        io.observe(f);
      } else if (!viewed[n]) { viewed[n] = 1; ev("form_view", n); }
      f.addEventListener("focusin", function () { if (!started[n]) { started[n] = 1; ev("form_start", n); } }, { passive: true });
      f.addEventListener("submit", function () { ev("form_submit", n, true); }, { passive: true });
    });
  }
  // Scroll depth: 25, 50, 75, 100 percent, once each per page view
  var ticking = false;
  function depth() {
    ticking = false;
    var de = document.documentElement, b = document.body;
    var h = Math.max(de.scrollHeight, b ? b.scrollHeight : 0), seen = (window.pageYOffset || de.scrollTop) + window.innerHeight;
    var pct = h > 0 ? seen / h * 100 : 100;
    [25, 50, 75, 100].forEach(function (m) { if (pct >= (m === 100 ? 98 : m) && !sentScroll[m]) { sentScroll[m] = 1; ev("scroll", String(m)); } });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; (window.requestAnimationFrame || setTimeout)(depth); } }, { passive: true });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("pagehide", flush);
  function init() { watchForms(); setTimeout(depth, 800); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
