/*
 * Limited-time events (Gobble Fest for Thanksgiving, ...). Dates live in js/data/events.js.
 *   RR.events.active()      → the event that's on today, or null
 *   RR.events.isOn(id)      → true while that event is on
 *   RR.events.visible(x)    → false for a game/case/item tagged `event: "<id>"` when that event is off
 *   RR.events.endsText(ev)  → "Ends Nov 30"
 *   RR.events.applyTheme()  → puts the event's look on the page (class "ev-<id>" on <html>)
 */
RR.events = {
  MONTHS: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

  // ?event=thanksgiving shows an event on any day, ?event=off hides them all (for grown-ups to preview)
  override() {
    try { return new URLSearchParams(location.search).get("event"); } catch (e) { return null; }
  },

  active() {
    const list = RR.data.events || [], forced = this.override();
    if (forced) return list.find(ev => ev.id === forced) || null;
    const md = RR.daily.todayKey().slice(5);       // "11-10"
    return list.find(ev => ev.from <= md && md <= ev.to) || null;
  },

  isOn(id) { const ev = this.active(); return !!ev && ev.id === id; },
  visible(thing) { return !thing || !thing.event || this.isOn(thing.event); },

  endsText(ev) {
    const [m, d] = ev.to.split("-").map(Number);
    return "Ends " + this.MONTHS[m - 1] + " " + d;
  },

  applyTheme() {
    const ev = this.active(), root = document.documentElement;
    (RR.data.events || []).forEach(e => root.classList.toggle("ev-" + e.id, !!ev && e.id === ev.id));
    if (!ev) return;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && ev.themeColor) meta.content = ev.themeColor;
    // a few leaves drifting down behind everything (CSS in the event's stylesheet)
    if (RR.art.eventDecor && RR.art.eventDecor[ev.id] && !document.querySelector(".ev-decor")) {
      const d = document.createElement("div");
      d.className = "ev-decor";
      d.setAttribute("aria-hidden", "true");
      d.innerHTML = RR.art.eventDecor[ev.id]();
      document.body.prepend(d);
    }
  }
};
