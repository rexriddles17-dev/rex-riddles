/* Placeholder tiles. When a game is built, it gets its own file and this entry is removed. */
[
  { id: "daily",     title: "Puzzle of the Day", icon: "📅" },
].forEach(g => RR.registerGame({ ...g, ready: false }));
