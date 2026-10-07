/*
 * Rex Riddles global namespace.
 * Plain <script> files (no build step) so the site works on GitHub Pages,
 * when opened from disk, and inside an iOS app wrapper (Capacitor) unchanged.
 */
window.RR = {
  games: [],        // every game registers itself here (see registerGame)
  data: {},         // word lists, ranks, puzzles
  art: {},          // reusable SVG drawings
  screens: {},      // non-game screens (home)

  /*
   * A game is an object:
   *   id       – used in the URL: #/<id>
   *   title, icon, blurb – shown on the home tile
   *   ready    – false shows a "Coming soon" tile
   *   section  – home section id from js/data/sections.js (default: the first)
   *   mount(el)   – draw the game inside el
   *   unmount()   – stop timers/listeners when leaving (optional)
   */
  registerGame(game) { this.games.push(game); }
};
