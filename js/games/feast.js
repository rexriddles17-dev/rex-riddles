/* ===== Feast Catch (Gobble Fest, limited time) =====
 * Food falls from the sky! Walk your own dino left and right to catch it. Dodge the pinecones.
 * Drawn on a <canvas>; the game world is 300 steps tall and as wide as the screen allows.
 * XP: 1 per `xpEvery` points, up to `xpPerDay` a day (settings in js/data/thanksgiving.js).
 * Saved: feast:best, feast:xpToday {date, xp}
 */
(function () {
  const H = 300, GROUND = 268, DINO = 92, FEET = DINO * 187 / 200, ITEM = 34;
  const F = () => RR.data.feast;

  let el, canvas, ctx, W = 500, scale = 1, raf = 0, last = 0, img = {}, run, state;
  let keys = { left: false, right: false }, target = null;
  const $ = sel => el.querySelector(sel);

  function svgImage(inner, viewBox) {
    const i = new Image();
    i.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="200" height="200">${inner}</svg>`);
    return i;
  }
  function loadImages() {
    img = {};
    F().foods.concat(F().hazard).forEach(f => { img[f.id] = svgImage(RR.art.harvest[f.id], "0 0 100 100"); });
    img.dino = svgImage(RR.art.dinoBody(RR.player.look()), "0 0 200 200");
    img.leaf = svgImage(RR.art.harvest.leaf, "0 0 100 100");
  }
  const draw = (i, x, y, w, h) => { if (i && i.complete && i.naturalWidth) ctx.drawImage(i, x, y, w, h); };

  function resize() {
    const wrap = $(".fc-stage"), cssW = wrap.clientWidth;
    const cssH = Math.round(Math.max(300, Math.min(440, cssW * .9)));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.height = cssH + "px";
    canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
    scale = canvas.height / H; W = canvas.width / scale;
    if (run) run.x = Math.min(Math.max(run.x, DINO / 2), W - DINO / 2);
    if (state !== "play") paint();
  }

  /* ---------- game ---------- */

  function newRun() {
    run = { t: 0, x: W / 2, face: 1, step: 0, things: [], nextDrop: .6, points: 0, lives: F().lives, popups: [], bonk: 0 };
  }

  function pick() {
    const all = F().foods.concat(Object.assign({ hazard: true }, F().hazard, { weight: F().hazard.weight + F().hazard.weightUp * run.t }));
    let r = Math.random() * all.reduce((s, x) => s + x.weight, 0);
    for (const x of all) { r -= x.weight; if (r <= 0) return x; }
    return all[0];
  }

  function step(dt) {
    run.t += dt;
    const fall = Math.min(F().maxFall, F().startFall + F().speedUp * run.t);

    // move: buttons/keys, or walk toward where the finger is
    let dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    if (!dir && target !== null && Math.abs(target - run.x) > 4) dir = Math.sign(target - run.x);
    if (dir) { run.face = dir; run.step += dt; }
    run.x = Math.min(Math.max(run.x + dir * F().moveSpeed * dt, DINO / 2), W - DINO / 2);

    // drop new things
    run.nextDrop -= dt;
    if (run.nextDrop <= 0) {
      const kind = pick();
      run.things.push({ kind, x: ITEM / 2 + Math.random() * (W - ITEM), y: -ITEM, spin: (Math.random() - .5) * 3, rot: 0, v: fall * (.85 + Math.random() * .3) });
      run.nextDrop = Math.max(F().minDropEvery, F().dropEvery - run.t * .012);
    }

    // fall and catch: the catch zone is the top half of the dino
    const top = GROUND - FEET + 6, bottom = GROUND - FEET * .45;
    run.things.forEach(t => {
      t.y += t.v * dt; t.rot += t.spin * dt;
      if (state === "play" && !t.gone && t.y + ITEM / 2 > top && t.y < bottom && Math.abs(t.x - run.x) < DINO * .42) {
        t.gone = true;
        if (t.kind.hazard) {
          run.lives--; run.bonk = .6;
          run.popups.push({ text: "BONK!", x: run.x, y: top - 10, t: 0, bad: true });
          if (run.lives <= 0) end();
        } else {
          run.points += t.kind.pts;
          const yum = F().yums[Math.floor(Math.random() * F().yums.length)];
          run.popups.push({ text: "+" + t.kind.pts + " " + yum, x: t.x, y: top - 10, t: 0 });
        }
      }
    });
    run.things = run.things.filter(t => !t.gone && t.y < H + ITEM);
    run.popups.forEach(p => p.t += dt * 1.2);
    run.popups = run.popups.filter(p => p.t < 1);
    run.bonk = Math.max(0, run.bonk - dt);
  }

  function paint() {
    if (!ctx) return;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    // autumn sky, sun, hills and a field
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#F6B26B"); sky.addColorStop(.6, "#FCE3BA"); sky.addColorStop(1, "#FCE3BA");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,240,190,.9)"; ctx.beginPath(); ctx.arc(W * .82, 54, 26, 0, 7); ctx.fill();
    ctx.fillStyle = "#C98A3E"; ctx.beginPath(); ctx.moveTo(0, 200);
    ctx.quadraticCurveTo(W * .25, 150, W * .5, 190); ctx.quadraticCurveTo(W * .75, 160, W, 186); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    ctx.fillStyle = "#A8642A"; ctx.beginPath(); ctx.moveTo(0, 226);
    ctx.quadraticCurveTo(W * .4, 204, W, 222); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    ctx.fillStyle = "#D9B25A"; ctx.fillRect(0, GROUND - 4, W, H);
    ctx.strokeStyle = "#B8893A"; ctx.lineWidth = 2;
    for (let x = 8; x < W; x += 22) { ctx.beginPath(); ctx.moveTo(x, GROUND + 6); ctx.lineTo(x + 6, GROUND + 22); ctx.stroke(); }
    // fence
    ctx.fillStyle = "#7A4A26";
    for (let x = 14; x < W; x += 60) ctx.fillRect(x, GROUND - 34, 6, 32);
    ctx.fillRect(0, GROUND - 28, W, 4); ctx.fillRect(0, GROUND - 16, W, 4);

    if (run) {
      run.things.forEach(t => {
        ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.rot);
        draw(img[t.kind.id], -ITEM / 2, -ITEM / 2, ITEM, ITEM); ctx.restore();
      });
      // dino (bobs while walking, flashes when bonked)
      const bob = run.step ? Math.abs(Math.sin(run.step * 14)) * 3 : 0;
      ctx.fillStyle = "rgba(60,30,10,.25)"; ctx.beginPath(); ctx.ellipse(run.x, GROUND + 2, DINO * .34, 5, 0, 0, 7); ctx.fill();
      ctx.save(); ctx.translate(run.x, GROUND - FEET - bob);
      if (run.face < 0) ctx.scale(-1, 1);
      if (run.bonk && Math.floor(run.bonk * 12) % 2) ctx.globalAlpha = .45;
      draw(img.dino, -DINO / 2, 0, DINO, DINO);
      ctx.restore();
      // popups
      ctx.font = "15px Bungee, 'Arial Black', sans-serif"; ctx.textAlign = "center"; ctx.lineWidth = 4; ctx.strokeStyle = "#3B2614";
      run.popups.forEach(p => {
        ctx.globalAlpha = 1 - p.t; ctx.fillStyle = p.bad ? "#FF6B5B" : "#FFE27A";
        ctx.strokeText(p.text, p.x, p.y - p.t * 30); ctx.fillText(p.text, p.x, p.y - p.t * 30);
      });
      ctx.globalAlpha = 1;
      // score and lives
      ctx.textAlign = "left"; ctx.font = "18px Bungee, 'Arial Black', sans-serif"; ctx.fillStyle = "#fff";
      ctx.strokeText(String(run.points), 12, 28); ctx.fillText(String(run.points), 12, 28);
      for (let i = 0; i < F().lives; i++) {
        ctx.globalAlpha = i < run.lives ? 1 : .25;
        draw(img.leaf, W - 34 - i * 26, 8, 24, 24);
      }
      ctx.globalAlpha = 1;
    }
  }

  function loop(now) {
    if (state !== "play") return;
    const dt = Math.min(.033, (now - last) / 1000);
    last = now;
    step(dt);
    if (state === "play") { paint(); raf = requestAnimationFrame(loop); }
  }

  function start() {
    newRun(); state = "play";
    $(".fc-intro").hidden = true; $(".fc-over").hidden = true;
    last = performance.now(); raf = requestAnimationFrame(loop);
  }

  function end() {
    state = "over"; cancelAnimationFrame(raf); paint();
    const best = RR.storage.get("feast:best", 0), newBest = run.points > best;
    if (newBest) RR.storage.set("feast:best", run.points);
    const today = RR.daily.todayKey(), saved = RR.storage.get("feast:xpToday", null);
    const had = saved && saved.date === today ? saved.xp : 0;
    const xp = Math.min(Math.floor(run.points / F().xpEvery), F().xpPerDay - had);
    if (xp > 0) RR.storage.set("feast:xpToday", { date: today, xp: had + xp });
    const box = $(".fc-over");
    box.innerHTML = `
      <h2>Feast's over!</h2>
      <p class="fc-big">${run.points} points</p>
      <p>${newBest ? "🏆 New best!" : "Best: " + Math.max(best, run.points)}</p>
      <p class="fc-xp">${xp > 0 ? `+${xp} XP` : had >= F().xpPerDay ? "You got all your XP for today!" : `Get ${F().xpEvery} points for 1 XP.`}</p>
      <button class="big-btn fc-go" type="button">Play again</button>`;
    box.hidden = false;
    box.querySelector(".fc-go").addEventListener("click", start);
    $(".fc-best").textContent = "Best: " + Math.max(best, run.points);
    if (xp > 0) RR.progress.addXP(xp);
  }

  /* ---------- input ---------- */

  function onKey(e) {
    const k = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right" }[e.code];
    if (!k) return;
    e.preventDefault();
    keys[k] = e.type === "keydown"; target = null;
  }
  function pointerX(e) { const r = canvas.getBoundingClientRect(); return (e.clientX - r.left) / r.width * W; }
  function onHidden() {
    if (document.hidden && state === "play") { cancelAnimationFrame(raf); state = "paused"; $(".fc-pause").hidden = false; }
  }
  function resume() {
    if (state !== "paused") return;
    $(".fc-pause").hidden = true; state = "play"; last = performance.now(); raf = requestAnimationFrame(loop);
  }

  RR.registerGame({
    id: "feast",
    event: "thanksgiving",
    section: "thanksgiving",
    title: "Feast Catch",
    icon: "🥧",
    blurb: "Catch the falling feast and dodge the pinecones! Up to +" + RR.data.feast.xpPerDay + " XP a day",
    ready: true,

    mount(container) {
      el = container;
      el.innerHTML = `
        <a class="back" href="#/">‹ Back to games</a>
        <div class="fc-top">
          <h1 class="screen-title">Feast Catch</h1>
          <span class="fc-best">Best: ${RR.storage.get("feast:best", 0)}</span>
        </div>
        <div class="fc-stage">
          <canvas class="fc-canvas" aria-label="Your dino catching falling food. Drag or use the arrow buttons to move."></canvas>
          <div class="fc-panel fc-intro">
            <h2>Hungry, ${RR.player.name()}?</h2>
            <p>The Gobble Fest feast is falling from the sky!</p>
            <p>Move left and right to catch corn 🌽, apples 🍎 and pies 🥧.</p>
            <p>Dodge the pinecones! 3 bonks and the feast is over.</p>
            <button class="big-btn fc-go" type="button">Let's eat!</button>
          </div>
          <div class="fc-panel fc-over" hidden></div>
          <div class="fc-panel fc-pause" hidden><h2>Paused</h2><button class="big-btn fc-resume" type="button">Keep catching</button></div>
        </div>
        <div class="fc-pad">
          <button class="fc-btn" data-dir="left" type="button" aria-label="Move left">◀</button>
          <button class="fc-btn" data-dir="right" type="button" aria-label="Move right">▶</button>
        </div>
        <p class="fc-help">Tip: hold the arrows, or drag your finger on the picture. On a keyboard, use ← →.</p>`;

      canvas = $(".fc-canvas"); ctx = canvas.getContext("2d");
      run = null; state = "intro"; keys = { left: false, right: false }; target = null;
      loadImages();
      resize();
      newRun(); paint();   // show the field and your dino behind the intro
      Object.values(img).forEach(i => i.addEventListener("load", () => { if (state !== "play" && ctx) paint(); }));

      $(".fc-go").addEventListener("click", start);
      $(".fc-resume").addEventListener("click", resume);
      el.querySelectorAll(".fc-btn").forEach(b => {
        const k = b.dataset.dir, up = () => { keys[k] = false; };
        b.addEventListener("pointerdown", e => { e.preventDefault(); keys[k] = true; target = null; });
        ["pointerup", "pointercancel", "pointerleave"].forEach(ev => b.addEventListener(ev, up));
        b.addEventListener("contextmenu", e => e.preventDefault());
      });
      canvas.addEventListener("pointerdown", e => { target = pointerX(e); canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); });
      canvas.addEventListener("pointermove", e => { if (e.buttons || e.pointerType === "touch") target = pointerX(e); });
      canvas.addEventListener("pointerup", () => { target = null; });
      canvas.addEventListener("pointercancel", () => { target = null; });
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
