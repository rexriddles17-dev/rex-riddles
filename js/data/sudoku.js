/*
 * Dino Sudoku settings. Change the pictures or make it easier/harder here!
 * icons: the first 4 are used on the small board, all 6 on the big board.
 * keep:  how many squares start filled in (more = easier).
 */
RR.data.sudoku = {
  icons: [
    { i: "🦖", name: "T-Rex" },
    { i: "🦕", name: "Long-neck" },
    { i: "🦴", name: "Bone" },
    { i: "🌿", name: "Fern" },
    { i: "🌋", name: "Volcano" },
    { i: "☄️", name: "Meteor" }
  ],
  levels: {
    small: { label: "Easy 4×4",   size: 4, boxRows: 2, boxCols: 2, keep: 7,  xp: 10 },
    big:   { label: "Tricky 6×6", size: 6, boxRows: 2, boxCols: 3, keep: 16, xp: 20 }
  },
  eggs: 3   // mistakes allowed before the round is over
};
