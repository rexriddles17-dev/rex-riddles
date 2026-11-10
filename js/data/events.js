/*
 * Limited-time events. While an event is on, the site gets its theme (background, banner),
 * its games show up on the home screen, and its Dino Shop items and detective cases are available.
 * After the event, games and unbought shop items hide again. Anything a player bought is kept forever.
 *
 *   from / to: "MM-DD", every year (both days count)
 *   Grown-ups can preview an event any day with ?event=<id> in the address (or ?event=off to hide it).
 */
RR.data.events = [
  {
    id: "thanksgiving",
    name: "Gobble Fest",
    from: "11-01",
    to: "11-30",
    icon: "🦃",
    banner: "Limited-time games, a Turkey dino and Thanksgiving clothes in the Dino Shop, and Thanksgiving mysteries in Dino Detective!",
    themeColor: "#6B3A1E"
  }
];
