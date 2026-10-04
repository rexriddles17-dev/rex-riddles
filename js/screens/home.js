/* Home screen: jungle hero + one tile per registered game. */
RR.screens.home = {
  render(el) {
    const badge = g => RR.art.badges[g.id]
      ? `<svg class="tile-art" viewBox="0 0 100 100" aria-hidden="true">${RR.art.badges[g.id]}</svg>`
      : `<span class="icon">${g.icon}</span>`;
    const tiles = RR.games.map(g => g.ready
      ? `<a class="game-tile" href="#/${g.id}">${badge(g)}<span class="tile-text"><h3>${g.title}</h3><span>${g.blurb}</span></span><span class="tile-go" aria-hidden="true">›</span></a>`
      : `<div class="game-tile locked" aria-disabled="true">${badge(g)}<span class="tile-text"><h3>${g.title}</h3><span class="soon">Coming soon</span></span></div>`
    ).join("");

    el.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <h1>Rex Riddles</h1>
          <p>Solve puzzles, earn XP, and grow from a tiny egg into a mighty T-Rex!</p>
        </div>
        ${RR.art.heroScene()}
      </section>
      <section class="games">${tiles}</section>`;
  }
};
