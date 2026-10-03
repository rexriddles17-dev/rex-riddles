/*
 * Dino Detective levels. Change how hard each level is here!
 *   cluesNeeded: clues to find before you can accuse ("all" = every place)
 *   tries:       wrong guesses allowed before the culprit gets away (0 = no limit)
 *   hints:       show the case's hint after a wrong guess
 *   daily:       how the Case of the Day is built for this level
 *     suspects    how many dinos to question
 *     minMissing  each innocent dino misses at least this many clues (smaller = harder)
 *     calm        true: the culprit sounds calm instead of nervous
 *     decoy       true: one extra place has a clue that doesn't help
 */
RR.data.detectiveLevels = {
  easy: {
    label: "Easy", stars: "⭐", cluesNeeded: 3, tries: 0, hints: true,
    about: "Find 3 clues, then guess as many times as you need.",
    daily: { xp: 20, suspects: 4, minMissing: 2, calm: false, decoy: false }
  },
  medium: {
    label: "Medium", stars: "⭐⭐", cluesNeeded: "all", tries: 3, hints: true,
    about: "Find every clue. You get 3 guesses.",
    daily: { xp: 25, suspects: 5, minMissing: 1, calm: true, decoy: false }
  },
  hard: {
    label: "Hard", stars: "⭐⭐⭐", cluesNeeded: "all", tries: 2, hints: false,
    about: "Find every clue. Some clues are tricks! Only 2 guesses and no hints.",
    daily: { xp: 30, suspects: 6, minMissing: 1, calm: true, decoy: true }
  }
};
