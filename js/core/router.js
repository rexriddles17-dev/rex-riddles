/*
 * Hash routing: #/ is home, #/hangman is a game.
 * Hash URLs work on GitHub Pages and in an iOS app with no server setup,
 * and the browser/phone back button works.
 */
RR.router = {
  current: null,

  start() {
    window.addEventListener("hashchange", () => this.go());
    this.go();
  },

  go() {
    const id = location.hash.replace(/^#\/?/, "");
    const app = document.getElementById("app");

    if (this.current && this.current.unmount) this.current.unmount();
    this.current = null;
    app.innerHTML = "";
    window.scrollTo(0, 0);

    const game = RR.games.find(g => g.id === id && g.ready);
    if (game) { this.current = game; game.mount(app); }
    else if (id !== "home" && RR.screens[id]) RR.screens[id].render(app);   // e.g. #/grown-ups
    else RR.screens.home.render(app);
  }
};
