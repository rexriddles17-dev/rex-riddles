/* Placeholder tiles. When a game is built, it gets its own file and this entry is removed.
 * Example: { id: "maze", title: "Dino Maze", icon: "🌀" } */
[
].forEach(g => RR.registerGame({ ...g, ready: false }));
