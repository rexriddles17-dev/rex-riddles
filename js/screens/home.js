/* Home screen: hero + one tile per registered game. */
RR.screens.home = {
  render(el) {
    const tiles = RR.games.map(g => g.ready
      ? `<a class="game-tile" href="#/${g.id}"><span class="icon">${g.icon}</span><h3>${g.title}</h3><span>${g.blurb}</span></a>`
      : `<div class="game-tile locked" aria-disabled="true"><span class="icon">${g.icon}</span><h3>${g.title}</h3><span class="soon">Coming soon</span></div>`
    ).join("");

    el.innerHTML = `
      <section class="hero">
        <div>
          <h1>Rex<br>Riddles</h1>
          <p>Solve puzzles, earn XP, and grow from a tiny egg into a mighty T-Rex!</p>
        </div>
        ${RR.art.rexy("rexy")}
      </section>
      <section class="games">${tiles}</section>`;
  }
};
