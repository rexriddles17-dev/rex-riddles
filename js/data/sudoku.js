/*
 * Dino Sudoku settings. Change the pictures or make it easier/harder here!
 * icons: the first 4 are used on the small board, all 6 on the big board.
 * art:   the drawing to show (from js/art). Leave it out to show the emoji instead.
 * keep:  how many squares start filled in (more = easier).
 */
RR.data.sudoku = {
  icons: [
    { i: "🦖", name: "T-Rex",     art: "trex" },
    { i: "🦕", name: "Long-neck", art: "brachio" },
    { i: "🦴", name: "Bone",      art: "bone" },
    { i: "🌿", name: "Fern",      art: "fern" },
    { i: "🌋", name: "Volcano",   art: "volcano" },
    { i: "☄️", name: "Meteor",    art: "meteor" }
  ],
  levels: {
    small: { label: "Easy 4×4",   size: 4, boxRows: 2, boxCols: 2, keep: 7,  xp: 10 },
    big:   { label: "Tricky 6×6", size: 6, boxRows: 2, boxCols: 3, keep: 16, xp: 20 }
  },
  eggs: 3   // mistakes allowed before the round is over
};
