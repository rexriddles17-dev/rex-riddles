/*
 * All saving goes through here. On the web it uses localStorage.
 * For the iOS app, only this file changes (e.g. to Capacitor Preferences).
 */
RR.storage = {
  prefix: "rr:",
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(this.prefix + key, JSON.stringify(value)); } catch (e) {}
  }
};
