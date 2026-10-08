/* Home screen: 3D jungle hero with your dino + one section of tiles per entry in RR.data.sections. */
RR.screens.home = {
  stage: null,

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

    const three = RR.d3.ok();
    el.innerHTML = `
      <section class="hero ${three ? "hero-is-3d" : ""}">
        <div class="hero-text">
          <h1>Rex Riddles</h1>
          <p>Solve puzzles, earn XP, and grow from a tiny egg into a mighty T-Rex!</p>
        </div>
        ${three ? `<div class="hero-3d" aria-label="Your dino on Dino Island. Drag to spin it, tap it to make it jump."></div>` : RR.art.heroScene()}
        <a class="hero-name" href="#/shop">${RR.player.name()}</a>
      </section>
      ${sections}`;
    if (three) this.hero3d(el.querySelector(".hero-3d"));
    RR.tilt(el);
  },

  // Your dino on a little jungle island. Drag to spin it, tap to make it hop.
  hero3d(box) {
    const T = THREE;
    let hop = 0;
    const st = RR.d3.stage(null, {
      height: w => Math.round(Math.max(240, Math.min(400, w * .62))),
      drag: true, fov: 32, lights: { shadowSize: 8 },
      onFrame: (dt, t) => {
        dino.userData.anim(t);
        isle.anim(t);
        if (hop > 0) { hop = Math.max(0, hop - dt * 1.6); dino.position.y = Math.sin(hop * Math.PI) * 1.1; dino.rotation.z = Math.sin(hop * Math.PI * 2) * .08; }
        if (!st.dragging && Math.abs(st.vel) < .2) st.yaw += (Math.sin(t * .35) * .5 - st.yaw) * dt * .5;   // gently look around
      }
    });
    const isle = RR.d3.jungle(st.scene);
    const spin = new T.Group(), dino = RR.d3.dino(RR.player.look());
    // center the dino on its spin point
    const bb = new T.Box3().setFromObject(dino), c = bb.getCenter(new T.Vector3());
    dino.position.set(0, 0, 0); dino.children[0].position.x = -c.x;
    spin.add(dino); spin.position.set(0, 0, .6); st.scene.add(spin); st.spin = spin;
    const h = bb.max.y;
    st.camera.position.set(0, 2.2 + h * .45, 11.5);
    st.camera.lookAt(0, 1.7 + h * .12, 0);
    st.yaw = -.5;
    st.canvas.addEventListener("click", () => { if (hop === 0) hop = 1; });
    st.mount(box);
    st.start();
    this.stage = st;
  },

  leave() { if (this.stage) { this.stage.dispose(); this.stage = null; } }
};
