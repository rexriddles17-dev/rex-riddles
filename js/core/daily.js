/*
 * Helpers for "of the day" games. Everything is built from the date,
 * so every friend gets the same puzzle on the same day, with no server.
 */
RR.daily = {
  // "2026-10-04" for the player's local date
  todayKey(date) {
    const d = date || new Date();
    const pad = n => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  },

  // The day before a date key
  yesterdayKey(key) {
    const [y, m, d] = key.split("-").map(Number);
    return RR.daily.todayKey(new Date(y, m - 1, d - 1));
  },

  // Days since 1970-01-01 for a date key (counts up by 1 each day)
  dayNumber(key) {
    const [y, m, d] = key.split("-").map(Number);
    return Math.round(Date.UTC(y, m - 1, d) / 86400000);
  },

  // Same text in → same random numbers out
  seededRandom(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
    return function () {
      h = (h + 0x6D2B79F5) | 0;
      let t = Math.imul(h ^ (h >>> 15), 1 | h);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },

  shuffle(list, rand = Math.random) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
};
