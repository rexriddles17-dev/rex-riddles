/* Home screen sections, in order. A game picks one with `section: "<id>"`
 * in its RR.registerGame call; games without one go in "puzzles".
 * A section with `event` only shows while that event is on (js/data/events.js). */
RR.data.sections = [
  { id: "thanksgiving", title: "🦃 Gobble Fest", blurb: "Thanksgiving games for a limited time only!", event: "thanksgiving" },
  { id: "puzzles", title: "Riddles & Puzzles", blurb: "Use your brain and earn XP!" },
  { id: "fun",     title: "Just for Fun",      blurb: "Games and dino stuff with no riddles." }
];
