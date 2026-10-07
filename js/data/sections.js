/* Home screen sections, in order. A game picks one with `section: "<id>"`
 * in its RR.registerGame call; games without one go in the first section. */
RR.data.sections = [
  { id: "puzzles", title: "Riddles & Puzzles", blurb: "Use your brain and earn XP!" },
  { id: "fun",     title: "Just for Fun",      blurb: "Games and dino stuff with no riddles." }
];
