/*
 * Gobble Fest (Thanksgiving) game settings. Change the numbers to make the games easier or harder.
 * Pictures are drawn in js/art/thanksgiving.js (RR.art.harvest).
 */

// Harvest Match: flip two cards, find the pairs
RR.data.harvest = {
  pictures: ["pumpkin", "pie", "corn", "apple", "leaf", "acorn", "cranberry", "turkey"],
  levels: {
    easy: { label: "Easy", stars: "⭐",   pairs: 6, xp: 5 },    // 12 cards
    hard: { label: "Hard", stars: "⭐⭐", pairs: 8, xp: 10 }    // 16 cards
  },
  winsPerDay: 3,     // XP for the first 3 wins each day
  peekMs: 900        // how long two wrong cards stay face up
};

// Feast Catch: move your dino to catch falling food, dodge the pinecones
RR.data.feast = {
  moveSpeed: 360,        // how fast your dino walks (game steps per second; the game is 300 steps tall)
  startFall: 110,        // how fast things fall at the start
  maxFall: 290,
  speedUp: 3.2,          // falls this much faster every second
  dropEvery: .95,        // seconds between drops at the start…
  minDropEvery: .4,      // …and at the fastest
  lives: 3,              // pinecone bonks before the game ends

  foods: [               // weight = how often it falls (bigger = more often)
    { id: "corn",      pts: 1, weight: 4 },
    { id: "apple",     pts: 1, weight: 4 },
    { id: "cranberry", pts: 2, weight: 2 },
    { id: "pumpkin",   pts: 3, weight: 1.5 },
    { id: "pie",       pts: 5, weight: .6 }
  ],
  hazard: { id: "pinecone", weight: 1.4, weightUp: .05 },   // pinecones get a bit more common each second

  xpEvery: 10,           // 1 XP for every 10 points
  xpPerDay: 20,

  yums: ["YUM!", "GOBBLE!", "CRUNCH!", "TASTY!", "NOM NOM!"]
};
