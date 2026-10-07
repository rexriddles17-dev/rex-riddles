/* Home screen: jungle hero + one section of tiles per entry in RR.data.sections. */
RR.screens.home = {
  render(el) {
    const badge = g => RR.art.badges[g.id]
      ? `<svg class="tile-art" viewBox="0 0 100 100" aria-hidden="true">${RR.art.badges[g.id]}</svg>`
      : `<span class="icon">${g.icon}</span>`;
    const tile = g => g.ready
      ? `<a class="game-tile" href="#/${g.id}">${badge(g)}<span class="tile-text"><h3>${g.title}</h3><span>${g.blurb}</span></span><span class="tile-go" aria-hidden="true">›</span></a>`
      : `<div class="game-tile locked" aria-disabled="true">${badge(g)}<span class="tile-text"><h3>${g.title}</h3><span class="soon">Coming soon</span></span></div>`;

    // Games without a section go in the first one
    const first = RR.data.sections[0].id;
    const sections = RR.data.sections.map(sec => {
      const games = RR.games.filter(g => (g.section || first) === sec.id);
      if (!games.length) return "";
      return `<section class="game-section" aria-labelledby="sec-${sec.id}">
          <h2 class="section-title" id="sec-${sec.id}">${sec.title}</h2>
          <p class="section-blurb">${sec.blurb}</p>
          <div class="games">${games.map(tile).join("")}</div>
        </section>`;
    }).join("");

    el.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <h1>Rex Riddles</h1>
          <p>Solve puzzles, earn XP, and grow from a tiny egg into a mighty T-Rex!</p>
        </div>
        ${RR.art.heroScene()}
        <a class="hero-name" href="#/shop">${RR.player.name()}</a>
      </section>
      ${sections}`;
  }
};
