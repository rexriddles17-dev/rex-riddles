/*
 * Dino Sudoku settings. Change the pictures or make it easier/harder here!
 * icons: the first 4 are used on the small board, all 6 on the big board.
 * art:   the drawing to show (from js/art). Leave it out to show the emoji instead.
 * Levels:
 *   size   4 or 6 squares across (boxRows x boxCols = one box)
 *   keep   how many squares start filled in (more = easier)
 *   eggs   mistakes allowed before the round is over
 *   reasons  true: explain why a pick is wrong ("already a Bone in this row!")
 */
RR.data.sudoku = {
  icons: [
    { i: "🦖", name: "T-Rex",     art: "rexy" },
    { i: "🦕", name: "Long-neck", art: "brachio" },
    { i: "🦴", name: "Bone",      art: "bone" },
    { i: "🌿", name: "Fern",      art: "fern" },
    { i: "🌋", name: "Volcano",   art: "volcano" },
    { i: "☄️", name: "Meteor",    art: "meteor" }
  ],
  levels: {
    easy:   { label: "Easy",   stars: "⭐",     size: 4, boxRows: 2, boxCols: 2, keep: 8,  eggs: 3, reasons: true,  xp: 10 },
    medium: { label: "Medium", stars: "⭐⭐",   size: 6, boxRows: 2, boxCols: 3, keep: 18, eggs: 3, reasons: true,  xp: 20 },
    hard:   { label: "Hard",   stars: "⭐⭐⭐", size: 6, boxRows: 2, boxCols: 3, keep: 11, eggs: 2, reasons: false, xp: 30 }
  }
};
