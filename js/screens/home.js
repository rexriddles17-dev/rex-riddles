/* Home screen: jungle hero + event banner (during an event) + one section of tiles per entry in RR.data.sections. */
RR.screens.home = {
  render(el) {
    const badge = g => RR.art.badges[g.id]
      ? `<svg class="tile-art" viewBox="0 0 100 100" aria-hidden="true">${RR.art.badges[g.id]}</svg>`
      : `<span class="icon">${g.icon}</span>`;
    const tile = g => g.ready
      ? `<a class="game-tile" href="#/${g.id}">${badge(g)}<span class="tile-text"><h3>${g.title}</h3><span>${g.blurb}</span></span><span class="tile-go" aria-hidden="true">›</span></a>`
      : `<div class="game-tile locked" aria-disabled="true">${badge(g)}<span class="tile-text"><h3>${g.title}</h3><span class="soon">Coming soon</span></span></div>`;

    // Games without a section go in "puzzles". Event sections and games hide when their event is off.
    const sections = RR.data.sections.filter(sec => RR.events.visible(sec)).map(sec => {
      const games = RR.games.filter(g => (g.section || "puzzles") === sec.id && RR.events.visible(g));
      if (!games.length) return "";
      const ev = sec.event && RR.events.active();
      return `<section class="game-section ${ev ? "ev-section" : ""}" aria-labelledby="sec-${sec.id}">
          <h2 class="section-title" id="sec-${sec.id}">${sec.title}${ev ? ` <span class="ev-ends">${RR.events.endsText(ev)}</span>` : ""}</h2>
          <p class="section-blurb">${sec.blurb}</p>
          <div class="games">${games.map(tile).join("")}</div>
        </section>`;
    }).join("");

    const ev = RR.events.active();
    const banner = ev ? `
      <section class="ev-banner" aria-label="${ev.name}">
        <span class="ev-banner-icon" aria-hidden="true">${ev.icon}</span>
        <div>
          <h2>${ev.name} is here!</h2>
          <p>${ev.banner}</p>
          <p class="ev-banner-links"><a href="#/shop">🛍️ Dino Shop</a><a href="#/detective">🔍 Mysteries</a><span class="ev-ends">⏳ ${RR.events.endsText(ev)}</span></p>
        </div>
      </section>` : "";

    el.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <h1>Rex Riddles</h1>
          <p>Solve puzzles, earn XP, and grow from a tiny egg into a mighty T-Rex!</p>
        </div>
        ${RR.art.heroScene()}
        <a class="hero-name" href="#/shop">${RR.player.name()}</a>
      </section>
      ${banner}
      ${sections}`;
  }
};
