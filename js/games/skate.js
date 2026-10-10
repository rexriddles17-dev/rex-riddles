/* ===== Dino Skate =====
 * Your own dino on a skateboard. Tap JUMP to hop over rocks and logs,
 * tap again in the air for a kickflip, grab golden eggs. Speeds up as you go.
 * Drawn on a <canvas>; the game world is 300 steps tall and as wide as the screen allows.
 * XP: 1 per `xpEvery` points, up to `xpPerDay` a day (settings in js/data/skate.js).
 * Saved: skate:best, skate:xpToday
 */
(function () {
  const H = 300, GROUND = 252, DINO_X = 24, DINO_SIZE = 100;
  const FEET = DINO_SIZE * 187 / 200;          // dino feet inside its 200x200 drawing
  const BOARD_Y = GROUND - 12;                 // top of the skateboard deck
  const O = "#3B2614";
  const S = () => RR.data.skate;

  let el, canvas, ctx, W = 500, scale = 1, raf = 0, last = 0, img = {}, run, state, held = false;
  const $ = sel => el.querySelector(sel);

  /* ---------- pictures (SVG drawn once into images) ---------- */

  function svgImage(inner, viewBox, w, h) {
    const i = new Image();
    i.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}">${inner}</svg>`);
    return i;
  }

  const line = `stroke="${O}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
  const ART = {
    rock: [`<path d="M4 38 Q2 22 12 14 Q22 3 36 5 Q52 8 56 24 Q59 36 54 38Z" fill="#8C8577" ${line}/>
            <path d="M16 16 Q24 9 34 10" fill="none" stroke="#B9B3A6" stroke-width="4" stroke-linecap="round"/>
            <path d="M40 24 l6 8 M22 28 l-4 6" stroke="#6E685C" stroke-width="2.5" stroke-linecap="round"/>`, "0 0 60 40"],
    log:  [`<rect x="3" y="5" width="66" height="30" rx="14" fill="#8A5A2E" ${line}/>
            <path d="M14 13 H44 M22 24 H56" stroke="#6B4423" stroke-width="3" stroke-linecap="round"/>
            <ellipse cx="57" cy="20" rx="11" ry="14" fill="#E2B77A" ${line}/>
            <ellipse cx="57" cy="20" rx="6" ry="8" fill="none" stroke="#B8864A" stroke-width="2"/>`, "0 0 72 38"],
    bone: [`<g transform="translate(0 -24)">${RR.art.icons.bone}</g>`, "0 0 100 50"],
    bush: [RR.art.fern(30, 50, 1.1) + RR.art.fern(30, 50, .7, "#3E8E4F"), "-16 -10 92 62"],
    egg:  [`<ellipse cx="20" cy="26" rx="15" ry="19" fill="#FFD23F" ${line}/>
            <ellipse cx="14" cy="18" rx="4" ry="6" fill="#FFF1A8"/>
            <circle cx="24" cy="30" r="2.5" fill="#E0A21B"/><circle cx="16" cy="36" r="2" fill="#E0A21B"/><circle cx="27" cy="19" r="1.8" fill="#E0A21B"/>`, "0 0 40 48"],
    palm: [RR.art.palm(0, 0, 1), "-50 -115 108 118"],
    volcano: [RR.art.volcano(0, 0, 1), "-62 -136 124 138"],
    cloud: [RR.art.cloud(0, 0, 1), "-26 -22 52 34"]
  };

  function loadImages() {
    img = {};
    for (const k in ART) img[k] = svgImage(ART[k][0], ART[k][1], 200, 200);
    img.dino = svgImage(RR.art.dinoBody(RR.player.look()), "0 0 200 200", 200, 200);
  }

  function draw(i, x, y, w, h) { if (i && i.complete && i.naturalWidth) ctx.drawImage(i, x, y, w, h); }

  /* ---------- sizing ---------- */

  function resize() {
    const wrap = $(".sk-stage"), cssW = wrap.clientWidth;
    const cssH = Math.round(Math.max(220, Math.min(380, cssW * .62)));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.height = cssH + "px";
    canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
    scale = canvas.height / H; W = canvas.width / scale;
    if (state !== "play") paint();
  }

  /* ---------- game state ---------- */

  function newRun() {
    run = {
      t: 0, dist: 0, speed: S().startSpeed, y: 0, vy: 0, air: false,
      flip: 0, flips: 0, eggs: 0, bonus: 0,
      things: [], nextAt: 420, popups: [], crash: null
    };
  }

  const score = () => Math.floor(run.dist / 10) + run.bonus;

  function start() {
    newRun(); state = "play";
    $(".sk-over").hidden = true; $(".sk-intro").hidden = true;
    last = performance.now(); loop(last);
  }

  // Tap: jump on the ground, kickflip in the air
  function press() {
    if (state === "intro" || state === "over") { if (state === "intro" || $(".sk-over").dataset.ready) start(); return; }
    if (state !== "play" || run.crash) return;
    held = true;
    if (!run.air) { run.vy = -S().jump; run.air = true; }
    else if (run.flip === 0) { run.flip = 0.0001; }
  }
  function release() {
    held = false;
    if (state === "play" && run.air && run.vy < -320) run.vy = -320;   // short tap = small hop
  }

  function spawn() {
    const list = S().obstacles, o = list[Math.floor(Math.random() * list.length)];
    run.things.push({ kind: "block", id: o.id, x: W + 20, w: o.w, h: o.h });
    // sometimes a golden egg floats above it, or out on its own
    if (Math.random() < .45) run.things.push({ kind: "egg", x: W + 20 + o.w / 2 - 13 + (Math.random() < .5 ? 0 : 140), y: GROUND - 95 - Math.random() * 40, w: 26, h: 32 });
    const gap = run.speed * (1.0 + Math.random() * 1.1) + 40;
    run.nextAt = run.dist + gap;
  }

  // Forgiving hit boxes so it feels fair
  function dinoBox() {
    const top = BOARD_Y - FEET + run.y;
    return { x: DINO_X + 38, y: top + 30, w: 46, h: FEET - 30 + 8 };
  }
  const hits = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  function step(dt) {
    const s = S();
    if (run.crash) {
      const c = run.crash;
      c.t += dt; c.vy += s.gravity * .7 * dt; c.y += c.vy * dt; c.rot += 7 * dt; c.x += 120 * dt; c.boardX += 260 * dt;
      if (c.t > 1.1 && state === "play") gameOver();
      return;
    }
    run.t += dt;
    run.speed = Math.min(s.maxSpeed, s.startSpeed + s.speedUp * run.t);
    const dx = run.speed * dt;
    run.dist += dx;

    if (run.air) {
      run.vy += s.gravity * dt * (held || run.vy > 0 ? 1 : 1.4);
      run.y += run.vy * dt;
      if (run.y >= 0) {                       // landed
        run.y = 0; run.vy = 0; run.air = false;
        if (run.flip > 0) { run.flip = 0; }   // landed mid-flip still counts, we're nice
      }
    }
    if (run.flip > 0) {
      run.flip += dt / .4;
      if (run.flip >= 1) { run.flip = 0; run.flips++; run.bonus += s.flipPoints; popup("KICKFLIP! +" + s.flipPoints); }
    }

    if (run.dist >= run.nextAt) spawn();
    const box = dinoBox();
    for (const t of run.things) {
      t.x -= dx;
      if (t.gone) continue;
      if (t.kind === "block") {
        const b = { x: t.x + 6, y: GROUND - t.h + 6, w: t.w - 12, h: t.h - 6 };
        if (hits(box, b)) return crash();
      } else if (hits(box, t)) {
        t.gone = true; run.eggs++; run.bonus += s.eggPoints; popup("GOLDEN EGG! +" + s.eggPoints);
      }
    }
    run.things = run.things.filter(t => t.x > -100 && !(t.kind === "egg" && t.gone));
    run.popups.forEach(p => p.t += dt);
    run.popups = run.popups.filter(p => p.t < 1);
  }

  function popup(text) { run.popups.push({ text, t: 0 }); }

  function crash() {
    run.crash = { t: 0, y: 0, vy: -520, rot: 0, x: 0, boardX: 0 };
    const words = S().wipeouts;
    run.word = words[Math.floor(Math.random() * words.length)];
  }

  function gameOver() {
    state = "over";
    const pts = score(), best = RR.storage.get("skate:best", 0), isBest = pts > best;
    if (isBest) RR.storage.set("skate:best", pts);

    // XP, capped per day
    const today = RR.daily.todayKey(), got = RR.storage.get("skate:xpToday", { date: null, xp: 0 });
    const soFar = got.date === today ? got.xp : 0;
    const xp = Math.max(0, Math.min(Math.floor(pts / S().xpEvery), S().xpPerDay - soFar));
    if (xp) { RR.storage.set("skate:xpToday", { date: today, xp: soFar + xp }); RR.progress.addXP(xp); }

    const left = S().xpPerDay - soFar - xp;
    const over = $(".sk-over");
    over.innerHTML = `
      <h2>${run.word}</h2>
      <p class="sk-big">${pts} points</p>
      <p>${isBest ? "🏆 New best score!" : "Best: " + Math.max(best, pts)}</p>
      <p>🥚 ${run.eggs} egg${run.eggs === 1 ? "" : "s"} · 🛹 ${run.flips} kickflip${run.flips === 1 ? "" : "s"}</p>
      <p class="sk-xp">${xp ? "+" + xp + " XP!" : left > 0 ? "Get " + S().xpEvery + " points to earn XP." : "You got all your skate XP today. Skate just for fun!"}</p>
      <button class="big-btn sk-again" type="button">Skate again</button>`;
    over.hidden = false; delete over.dataset.ready;
    // a short wait so a frantic tap doesn't skip the score
    setTimeout(() => { if (state === "over") over.dataset.ready = "1"; }, 600);
    over.querySelector(".sk-again").addEventListener("click", start);
    $(".sk-best").textContent = "Best: " + Math.max(best, pts);
  }

  /* ---------- drawing ---------- */

  function paint() {
    if (!ctx) return;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    const d = run ? run.dist : 0;

    // sky
    const g = ctx.createLinearGradient(0, 0, 0, GROUND);
    g.addColorStop(0, "#8FD3E8"); g.addColorStop(1, "#E3F5F8");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // clouds and volcano far away (slow), then hills, then palms (faster)
    for (let i = -1; i < W / 220 + 1; i++) {
      const x = i * 220 - (d * .08) % 220;
      draw(img.cloud, x + 40, 30 + (i & 1) * 26, 70, 46);
    }
    for (let i = -1; i < W / 640 + 1; i++) {
      const x = i * 640 - (d * .15) % 640;
      draw(img.volcano, x + 360, GROUND - 160, 130, 145);
    }
    const hills = ctx.createLinearGradient(0, GROUND - 60, 0, GROUND);
    hills.addColorStop(0, "#9CC9B4"); hills.addColorStop(1, "#C4E3D2");
    ctx.fillStyle = hills;
    ctx.beginPath(); ctx.moveTo(0, GROUND);
    for (let x = 0; x <= W + 10; x += 10) ctx.lineTo(x, GROUND - 40 - 18 * Math.sin((x + d * .3) / 90));
    ctx.lineTo(W, GROUND); ctx.fill();
    for (let i = -1; i < W / 330 + 1; i++) {
      const x = i * 330 - (d * .5) % 330;
      draw(img.palm, x + 120, GROUND - 120, 110, 122);
    }

    // ground: grass edge + dirt with pebbles
    const dirt = ctx.createLinearGradient(0, GROUND, 0, H);
    dirt.addColorStop(0, "#B48D58"); dirt.addColorStop(1, "#8A6A42");
    ctx.fillStyle = dirt; ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = "#6A9E42"; ctx.fillRect(0, GROUND - 2, W, 9);
    ctx.fillStyle = "#5FAE3E"; ctx.fillRect(0, GROUND + 7, W, 3);
    ctx.fillStyle = "#A9824F";
    for (let i = -1; i < W / 60 + 1; i++) {
      const x = i * 60 - d % 60;
      ctx.beginPath(); ctx.ellipse(x + 20, GROUND + 22 + (i & 1) * 16, 5, 3, 0, 0, 7); ctx.fill();
    }

    if (run) {
      for (const t of run.things) {
        if (t.kind === "block") draw(img[t.id], t.x, GROUND - t.h, t.w, t.h);
        else draw(img.egg, t.x, t.y + Math.sin(run.t * 6 + t.x) * 3, t.w, t.h);
      }
    }
    drawSkater();
    drawHud();
  }

  function drawBoard(x, y, flip, rot) {
    ctx.save();
    ctx.translate(x + 50, y + 6); ctx.rotate(rot || 0);
    if (flip) ctx.scale(1, Math.cos(flip * Math.PI * 2));
    ctx.lineWidth = 2; ctx.strokeStyle = O;
    // deck
    ctx.fillStyle = "#FF7A1A";
    ctx.beginPath(); ctx.moveTo(-42, -2); ctx.quadraticCurveTo(-50, -10, -46, -3); ctx.lineTo(-40, 3); ctx.lineTo(40, 3); ctx.lineTo(46, -3);
    ctx.quadraticCurveTo(50, -10, 42, -2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#FFD23F"; ctx.fillRect(-14, -1, 28, 3);
    // wheels
    ctx.fillStyle = "#3B3F4A";
    [-28, 28].forEach(wx => { ctx.beginPath(); ctx.arc(wx, 8, 5, 0, 7); ctx.fill(); ctx.stroke(); });
    ctx.restore();
  }

  function drawSkater() {
    const r = run || { y: 0, flip: 0, vy: 0, t: 0, crash: null };
    const c = r.crash;
    const top = BOARD_Y - FEET + r.y;
    if (c) {
      drawBoard(DINO_X + c.boardX, BOARD_Y, 0, c.boardX * .01);
      ctx.save();
      ctx.translate(DINO_X + 50 + c.x, top + 50 + c.y);
      ctx.rotate(c.rot);
      draw(img.dino, -50, -50, DINO_SIZE, DINO_SIZE);
      ctx.restore();
      // stars
      ctx.font = "22px sans-serif"; ctx.textAlign = "center";
      ["⭐", "💫", "⭐"].forEach((s, i) => ctx.fillText(s, DINO_X + 50 + c.x + Math.cos(c.t * 6 + i * 2) * 34, top + 20 + c.y + Math.sin(c.t * 6 + i * 2) * 12));
      ctx.font = "28px Bungee, 'Arial Black', sans-serif"; ctx.lineWidth = 6; ctx.strokeStyle = O; ctx.fillStyle = "#FFD23F";
      ctx.strokeText(r.word, W / 2, 100); ctx.fillText(r.word, W / 2, 100);
      return;
    }
    // little bob while rolling, lean while in the air
    const bob = r.y === 0 && state === "play" ? Math.sin(r.t * 18) * 1.2 : 0;
    const tilt = Math.max(-.25, Math.min(.25, r.vy / 2600));
    ctx.save();
    ctx.translate(DINO_X + 50, BOARD_Y + r.y);
    ctx.rotate(tilt);
    ctx.translate(-(DINO_X + 50), -(BOARD_Y + r.y));
    draw(img.dino, DINO_X, top + bob, DINO_SIZE, DINO_SIZE);
    drawBoard(DINO_X, BOARD_Y + r.y, r.flip);
    ctx.restore();
    // shadow
    ctx.fillStyle = "rgba(60,40,20,.25)";
    ctx.beginPath(); ctx.ellipse(DINO_X + 50, GROUND + 2, 40 - Math.min(20, -r.y / 6), 4, 0, 0, 7); ctx.fill();
  }

  function drawHud() {
    if (!run) return;
    ctx.textAlign = "left"; ctx.font = "20px Bungee, 'Arial Black', sans-serif";
    ctx.lineWidth = 5; ctx.strokeStyle = O; ctx.fillStyle = "#fff";
    const txt = String(score());
    ctx.strokeText(txt, 12, 32); ctx.fillText(txt, 12, 32);
    ctx.font = "15px Bungee, 'Arial Black', sans-serif";
    run.popups.forEach((p, i) => {
      ctx.globalAlpha = 1 - p.t;
      ctx.fillStyle = "#FFD23F";
      const y = 60 + i * 22 - p.t * 14;
      ctx.strokeText(p.text, 12, y); ctx.fillText(p.text, 12, y);
    });
    ctx.globalAlpha = 1;
  }

  function loop(now) {
    if (state !== "play") return;
    const dt = Math.min(.033, (now - last) / 1000);
    last = now;
    step(dt);
    paint();
    if (state === "play") raf = requestAnimationFrame(loop);
  }

  /* ---------- input ---------- */

  function onKey(e) {
    if (e.repeat && (e.code === "Space" || e.code === "ArrowUp")) { e.preventDefault(); return; }
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
      e.preventDefault();
      if (e.type === "keydown") press(); else release();
    }
  }

  function onHidden() {
    if (document.hidden && state === "play" && !run.crash) { cancelAnimationFrame(raf); state = "paused"; $(".sk-pause").hidden = false; }
  }

  function resume() {
    if (state !== "paused") return;
    $(".sk-pause").hidden = true; state = "play"; last = performance.now(); loop(last);
  }

  RR.registerGame({
    id: "skate",
    title: "Dino Skate",
    icon: "🛹",
    blurb: "Jump, kickflip and grab golden eggs! Up to +" + RR.data.skate.xpPerDay + " XP a day",
    section: "fun",
    ready: true,

    mount(container) {
      el = container;
      const best = RR.storage.get("skate:best", 0);
      el.innerHTML = `
        <a class="back" href="#/">‹ Back to games</a>
        <div class="sk-top">
          <h1 class="screen-title">Dino Skate</h1>
          <span class="sk-best">Best: ${best}</span>
        </div>
        <div class="sk-stage">
          <canvas class="sk-canvas" aria-label="Your dino skating. Tap to jump."></canvas>
          <div class="sk-panel sk-intro">
            <h2>Ready, ${RR.player.name()}?</h2>
            <p>Tap <b>JUMP</b> to hop over rocks and logs.</p>
            <p>Tap again in the air to do a <b>kickflip</b>!</p>
            <p>Grab the golden eggs 🥚 for extra points.</p>
            <button class="big-btn sk-go" type="button">Let's skate!</button>
          </div>
          <div class="sk-panel sk-over" hidden></div>
          <div class="sk-panel sk-pause" hidden>
            <h2>Paused</h2>
            <button class="big-btn sk-resume" type="button">Keep skating</button>
          </div>
        </div>
        <button class="sk-jump" type="button" aria-label="Jump">JUMP</button>
        <p class="sk-help">Tip: hold JUMP to jump higher. On a keyboard, use the space bar.</p>`;

      canvas = $(".sk-canvas"); ctx = canvas.getContext("2d");
      run = null; state = "intro"; held = false;
      loadImages();
      resize();
      // repaint the still scene once the pictures are ready
      Object.values(img).forEach(i => i.addEventListener("load", () => { if (state !== "play") paint(); }));

      $(".sk-go").addEventListener("click", start);
      $(".sk-resume").addEventListener("click", resume);
      const jump = $(".sk-jump");
      // pointerdown (not click) so it reacts the moment a finger touches it
      [jump, canvas].forEach(t => {
        t.addEventListener("pointerdown", e => { e.preventDefault(); press(); });
        t.addEventListener("pointerup", release);
        t.addEventListener("pointercancel", release);
        t.addEventListener("pointerleave", release);
      });
      document.addEventListener("keydown", onKey);
      document.addEventListener("keyup", onKey);
      document.addEventListener("visibilitychange", onHidden);
      window.addEventListener("resize", resize);
    },

    unmount() {
      cancelAnimationFrame(raf);
      state = "gone";
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKey);
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("resize", resize);
      el = canvas = ctx = null;
    }
  });
})();
