/* ===== Dino Battle =====
 * Taekwondo-style sparring: your own dino (from the Dino Shop) and a rival move around the mat in real time.
 * Step ◀ ▶, Kick (2 points), Spin Kick (4 points), hold Block, and a special move for your kind of dino
 * that charges up with good hits and blocks. Push the other dino off the mat for a penalty point.
 * Best of 3 rounds; most points wins a round, a tie goes to Golden Point. Cartoon only: no health, just points.
 * XP: a rival's xp the first time you beat it; rematches give a little, with a daily cap.
 * Training Gym: quick tap and timing drills level up your dino (a few drills a day, set by trainingPerDay).
 * Settings in js/data/battle.js.  Saved: battle:beaten (rival ids), battle:xpToday {date, xp}, battle:upgrades {id: level}, battle:trainToday {date, n}
 */
(function () {
  const B = () => RR.data.battle;
  let el, timers = [], fight = null;
  const $ = sel => el.querySelector(sel);
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  let raf = 0;
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); raf = 0; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const speciesName = id => ((RR.data.shop.species.find(s => s.id === id)) || { name: "Dino" }).name;

  const beaten = () => RR.storage.get("battle:beaten", []);
  const unlocked = i => i === 0 || beaten().includes(B().rivals[i - 1].id);

  /* ---------- the list of rivals ---------- */

  function showList() {
    clearTimers(); unkeys(); fight = null;
    const done = beaten();
    el.innerHTML = `
      <a class="back" href="#/">‹ Back to games</a>
      <h1 class="screen-title">Dino Battle</h1>
      <p class="bt-intro">Taekwondo sparring! Move around the mat, kick and block. Most points wins a round. Win 2 rounds to win the match!</p>
      <button class="big-btn bt-howto-btn" type="button">❓ How to Play</button>
      <div class="bt-list">
        ${B().rivals.map((r, i) => {
          const open = unlocked(i), won = done.includes(r.id);
          return `<button class="bt-rival ${won ? "won" : ""}" data-i="${i}" ${open ? "" : "disabled"} type="button">
            <svg viewBox="0 0 100 100" aria-hidden="true">${open ? RR.art.dinoHead(look(r)) : `<text x="50" y="64" text-anchor="middle" font-size="44">🔒</text>`}</svg>
            <span class="bt-rival-text">
              <b>${open ? r.name : "Locked"}</b>
              <small>${open ? speciesName(r.species) + " · " + "⭐".repeat(Math.ceil((i + 1) / 2)) : "Beat " + B().rivals[i - 1].name + " first"}</small>
            </span>
            <span class="bt-rival-prize">${won ? "✓ Beaten" : open ? "+" + r.xp + " XP" : ""}</span>
          </button>`;
        }).join("")}
      </div>
      <section class="bt-gym" aria-labelledby="btGymTitle">${gymHTML()}</section>
      <p class="bt-help">Want a different fighter? Change your dino in the <a href="#/shop">Dino Shop</a>. Each kind has its own special move!</p>`;
    el.querySelectorAll(".bt-rival:not([disabled])").forEach(b => b.addEventListener("click", () => startFight(+b.dataset.i)));
    $(".bt-howto-btn").addEventListener("click", showHowTo);
    wireGym();
  }

  /* ---------- How to Play ---------- */

  // what each kind of special move does, in kid words
  const specialHow = {
    spin:    "A giant spinning tail kick.",
    double:  "Two super fast kicks in a row.",
    rush:    "Dash forward and kick hard.",
    counter: "Get in a guard stance. If they kick you, you block and kick right back!",
    long:    "A kick that reaches really far."
  };

  function showHowTo() {
    clearTimers(); unkeys();
    const M = B().moves, m = B().match, mine = RR.player.look().species;
    const specials = RR.data.shop.species.filter(s => B().species[s.id]).map(s => {
      const sp = B().species[s.id].special, you = s.id === mine;
      return `<li class="${you ? "bt-you" : ""}"><b>${s.name}: ${sp.name}</b>${you ? " <em>(your dino!)</em>" : ""}<br>${specialHow[sp.kind] || "A big move!"}</li>`;
    }).join("");
    el.innerHTML = `
      <button class="back bt-to-list" type="button">‹ Back to Dino Battle</button>
      <h1 class="screen-title">How to Play</h1>
      <div class="bt-howto">
        <section><h2>🥋 The match</h2>
          <p>You are <b class="bt-blue">Blue</b>. Your rival is <b class="bt-red">Red</b>.</p>
          <p>Each round is ${m.roundSeconds} seconds. Get the most points to win the round.</p>
          <p>Win 2 rounds to win the match!</p>
          <p>Tie? It's <b>Golden Point</b>. The next point wins.</p>
        </section>
        <section><h2>🎮 Your buttons</h2>
          <ul class="bt-keys-list">
            <li><span>◀ ▶</span><span>Step around the mat.<br><i class="bt-kbds">Keys: <kbd>←</kbd> <kbd>→</kbd></i></span></li>
            <li><span>${M.kick.icon}</span><span><b>Kick</b>: fast. Scores ${M.kick.pts} points.<br><i class="bt-kbds">Keys: <kbd>Z</kbd> or <kbd>J</kbd></i></span></li>
            <li><span>${M.spin.icon}</span><span><b>Spin Kick</b>: slow but strong. Scores ${M.spin.pts} points.<br><i class="bt-kbds">Keys: <kbd>X</kbd> or <kbd>K</kbd></i></span></li>
            <li><span>${M.block.icon}</span><span><b>Block</b>: hold it down to stop kicks.<br><i class="bt-kbds">Keys: hold <kbd>↓</kbd> or <kbd>S</kbd></i></span></li>
            <li><span>⚡</span><span><b>Special</b>: your big move!<br><i class="bt-kbds">Keys: <kbd>Space</kbd> or <kbd>L</kbd></i></span></li>
          </ul>
          <p>On a computer? Tap the buttons or use the keys.</p>
        </section>
        <section><h2>⚡ Special moves</h2>
          <p>Land good kicks and blocks to charge it up. When the button lights up, it's ready.</p>
          <p>Specials can't be blocked!</p>
          <ul class="bt-specials">${specials}</ul>
          <p>Want a different special? Get a new kind of dino in the <a href="#/shop">Dino Shop</a>.</p>
        </section>
        <section><h2>⚠️ Stay on the mat!</h2>
          <p>If you get pushed off the mat, the other dino gets +${m.ringOut} point. This is called <b class="bt-nowrap">gam-jeom</b>.</p>
        </section>
        <section><h2>🗣️ What the referee says</h2>
          <ul class="bt-calls">${Object.values(B().calls).map(([ko, en]) => `<li><b>${ko}</b> means ${en}</li>`).join("")}</ul>
        </section>
        <section><h2>💪 Training Gym</h2>
          <p>Play quick drills to make your dino better. It's free. No XP needed!</p>
          <p>You can train ${B().trainingPerDay} times a day. Then your dino needs a rest.</p>
        </section>
        <section><h2>⭐ Tips</h2>
          <p>Block when they get ready to kick. Then kick right back!</p>
          <p>Beat a rival to unlock the next one. Each new win gives XP.</p>
        </section>
      </div>
      <button class="big-btn bt-howto-done" type="button">Let's spar! 🥋</button>`;
    $(".bt-to-list").addEventListener("click", showList);
    $(".bt-howto-done").addEventListener("click", showList);
    window.scrollTo(0, 0);
  }

  /* ---------- Training Gym: drills that make your dino better ---------- */

  const level = id => RR.storage.get("battle:upgrades", {})[id] || 0;
  const upgrade = id => B().upgrades.find(u => u.id === id);
  const boost = id => (upgrade(id) || { per: 0 }).per * level(id);

  // drills left today (your dino gets tired after trainingPerDay)
  function energy() {
    const t = RR.storage.get("battle:trainToday", { date: null, n: 0 });
    return Math.max(0, B().trainingPerDay - (t.date === RR.daily.todayKey() ? t.n : 0));
  }
  function useEnergy() {
    const today = RR.daily.todayKey(), t = RR.storage.get("battle:trainToday", { date: null, n: 0 });
    RR.storage.set("battle:trainToday", { date: today, n: (t.date === today ? t.n : 0) + 1 });
  }

  const mySpecies = () => B().species[RR.player.look().species] || B().species.trex;
  const kiNeed = () => Math.max(1, B().specialCharge - boost("charge"));

  // your dino's sparring numbers with every upgrade
  function stats() {
    const S = mySpecies(), pct = n => Math.round(n * 100) + "%";
    return `👟 ${pct(S.speed * (1 + boost("hp")))} speed · 🦶 kicks ${pct(1 + boost("power"))} quick · 🧱 ${pct(boost("armor"))} steadier · 📏 +${S.reach + boost("snacks")} reach · ⚡ ${S.special.name} after ${kiNeed()} hit${kiNeed() === 1 ? "" : "s"}`;
  }

  function gymHTML() {
    const left = energy();
    return `
      <div class="bt-gym-top">
        <h2 id="btGymTitle">💪 Training Gym</h2>
        <span class="bt-energy" aria-label="${left} training sessions left today">${"⚡".repeat(left)}${"·".repeat(B().trainingPerDay - left)}</span>
      </div>
      <p class="bt-gym-stats">${stats()}</p>
      <p class="bt-gym-note">${left ? `Pass a drill to level up. ${left} training session${left === 1 ? "" : "s"} left today.` : "Your dino is tired! 😴 Come back tomorrow to train more."}</p>
      <div class="bt-ups">${B().upgrades.map(u => {
        const lv = level(u.id), full = lv >= u.levels;
        return `<button class="bt-up" type="button" data-up="${u.id}" ${full || !left ? "disabled" : ""}>
          <span class="bt-icon">${u.icon}</span>
          <span class="bt-up-text"><b>${u.name}</b><small>${u.tip} · Level ${lv}/${u.levels}</small>
            <span class="bt-pips">${[...Array(u.levels)].map((_, i) => `<i class="${i < lv ? "on" : ""}"></i>`).join("")}</span></span>
          <span class="bt-price">${full ? "MAX" : "Train"}</span>
        </button>`;
      }).join("")}</div>`;
  }

  function wireGym() {
    el.querySelectorAll(".bt-up[data-up]:not([disabled])").forEach(b => b.addEventListener("click", () => drill(b.dataset.up)));
  }
  function backToGym() {
    stopDrill();
    const g = $(".bt-gym"); if (!g) return;
    g.innerHTML = gymHTML(); wireGym();
  }

  const stopDrill = () => { cancelAnimationFrame(raf); raf = 0; };

  function drill(id) {
    const u = upgrade(id), lv = level(id);
    if (!u || lv >= u.levels || !energy()) return;
    const g = $(".bt-gym");
    g.scrollIntoView({ block: "start", behavior: "smooth" });
    (u.drill === "tap" ? tapDrill : timingDrill)(g, u, lv, ok => finishDrill(g, u, ok));
  }

  // tap as fast as you can before the time runs out
  function tapDrill(g, u, lv, done) {
    const need = u.need + u.needUp * lv, secs = B().tapSeconds;
    let count = 0, start = 0, over = false;
    g.innerHTML = `
      <h2>${u.icon} ${u.title}</h2>
      <p>Tap <b>${u.action}</b> ${need} times in ${secs} seconds! The clock starts on your first tap.</p>
      <div class="bt-meter"><span class="bt-meter-fill"></span><b class="bt-count">0 / ${need}</b></div>
      <div class="bt-clock"><span></span></div>
      <button class="bt-drill-btn" type="button">${u.action}</button>
      <button class="bt-quit" type="button">Stop training</button>`;
    const fill = g.querySelector(".bt-meter-fill"), clock = g.querySelector(".bt-clock span"), btn = g.querySelector(".bt-drill-btn");
    g.querySelector(".bt-quit").addEventListener("click", backToGym);
    const end = ok => { if (over) return; over = true; stopDrill(); btn.disabled = true; later(400, () => done(ok)); };
    function tick(now) {
      const t = (now - start) / 1000;
      clock.style.width = Math.max(0, 100 - t / secs * 100) + "%";
      if (t >= secs) return end(count >= need);
      raf = requestAnimationFrame(tick);
    }
    btn.addEventListener("pointerdown", e => {
      e.preventDefault();
      if (over) return;
      if (!start) { start = performance.now(); useEnergy(); raf = requestAnimationFrame(tick); }
      count++;
      fill.style.width = Math.min(100, count / need * 100) + "%";
      g.querySelector(".bt-count").textContent = `${count} / ${need}`;
      btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
      if (count >= need) end(true);
    });
  }

  // tap when the moving target is inside the green zone: 3 good taps out of 5
  function timingDrill(g, u, lv, done) {
    const width = Math.max(10, 28 - lv * 4), speed = .55 + lv * .14;      // zone size (%), sweeps per second
    let hits = 0, tries = 0, zone = 0, pos = 0, dir = 1, last = 0, over = false, started = false;
    g.innerHTML = `
      <h2>${u.icon} ${u.title}</h2>
      <p>Tap <b>${u.action}</b> when the ${u.target} is in the green zone. Get 3 out of 5!</p>
      <div class="bt-track"><span class="bt-zone"></span><span class="bt-target">${u.target}</span></div>
      <div class="bt-tries">${[...Array(5)].map(() => "<i></i>").join("")}</div>
      <p class="bt-judge" aria-live="polite">&nbsp;</p>
      <button class="bt-drill-btn" type="button">${u.action}</button>
      <button class="bt-quit" type="button">Stop training</button>`;
    const zoneEl = g.querySelector(".bt-zone"), tgt = g.querySelector(".bt-target"), btn = g.querySelector(".bt-drill-btn");
    g.querySelector(".bt-quit").addEventListener("click", backToGym);
    const newZone = () => { zone = 6 + Math.random() * (88 - width); zoneEl.style.left = zone + "%"; zoneEl.style.width = width + "%"; };
    newZone();
    function tick(now) {
      const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
      pos += dir * speed * 100 * dt;
      if (pos > 100) { pos = 100; dir = -1; } else if (pos < 0) { pos = 0; dir = 1; }
      tgt.style.left = pos + "%";
      raf = requestAnimationFrame(tick);
    }
    last = performance.now(); raf = requestAnimationFrame(tick);
    btn.addEventListener("pointerdown", e => {
      e.preventDefault();
      if (over) return;
      if (!started) { started = true; useEnergy(); }
      const good = pos >= zone - 2 && pos <= zone + width + 2;
      g.querySelectorAll(".bt-tries i")[tries].className = good ? "good" : "miss";
      tries++; if (good) hits++;
      g.querySelector(".bt-judge").textContent = good ? pick(["Nice!", "Great!", "Perfect!", "Awesome!"]) : "Oops, missed!";
      tgt.classList.remove("bump"); void tgt.offsetWidth; tgt.classList.add("bump");
      if (hits >= 3 || tries - hits >= 3) { over = true; btn.disabled = true; later(500, () => { stopDrill(); done(hits >= 3); }); }
      else newZone();
    });
  }

  function finishDrill(g, u, ok) {
    if (!el) return;
    let msg;
    if (ok) {
      const all = RR.storage.get("battle:upgrades", {});
      all[u.id] = level(u.id) + 1;
      RR.storage.set("battle:upgrades", all);
      msg = `<h2>💪 Great training!</h2><p><b>${u.name}</b> is now level ${all[u.id]}! ${RR.player.name()} is getting better.</p>`;
    } else {
      msg = `<h2>So close!</h2><p>${RR.player.name()} needs a bit more practice. Try again!</p>`;
    }
    const left = energy();
    g.innerHTML = `${msg}
      <p class="bt-gym-note">${left ? `${left} training session${left === 1 ? "" : "s"} left today.` : "Your dino is tired now. 😴 Come back tomorrow!"}</p>
      <div class="bt-btns">
        ${!ok && left ? `<button class="big-btn bt-again" type="button">Try again</button>` : ""}
        <button class="big-btn bt-alt bt-back-gym" type="button">Back to the gym</button>
      </div>`;
    g.querySelector(".bt-back-gym").addEventListener("click", backToGym);
    const again = g.querySelector(".bt-again"); if (again) again.addEventListener("click", () => drill(u.id));
  }


  const look = r => ({ species: r.species, color: r.color, hat: r.hat || null, eyes: r.eyes || null, neck: r.neck || null, back: r.back || null, paint: {} });

  /* ---------- a sparring match ---------- */

  // the mat, in scene units (the scene is 400 wide)
  const MAT_L = 18, MAT_R = 382, WALK_L = 30, WALK_R = 370, GAP = 62, GROUND = 196, START = [128, 272];

  function fighter(side, lk, name, S) {
    return {
      side, look: lk, name, face: side === "me" ? 1 : -1,
      speed: S.speed, reach: S.reach, quick: 1, steady: 0, special: S.special, need: B().specialCharge,
      x: 0, vx: 0, state: "idle", t: 0, spec: null, move: 0, guard: false, ki: 0,
      pts: 0, rounds: 0, hits: 0, out: false
    };
  }

  function startFight(i) {
    clearTimers();
    const r = B().rivals[i], mine = RR.player.look();
    const me = fighter("me", mine, RR.player.name(), mySpecies());
    me.speed *= 1 + boost("hp");                      // Training Gym upgrades
    me.quick = 1 / (1 + boost("power"));
    me.steady = Math.min(.6, boost("armor"));
    me.reach += boost("snacks");
    me.need = kiNeed();
    const foe = fighter("foe", look(r), r.name, B().species[r.species] || B().species.trex);
    foe.speed *= r.speed;
    fight = { i, rival: r, me, foe, round: 0, phase: "intro", clock: 0, golden: false, over: false, last: 0, ai: 0, aiBlockUntil: 0, now: 0 };
    el.innerHTML = `
      <button class="back bt-to-list" type="button">‹ All rivals</button>
      <div class="bt-board">
        ${side("me", "Blue")}
        <div class="bt-time"><small class="bt-round">Round 1</small><b class="bt-clockt">0:${B().match.roundSeconds}</b></div>
        ${side("foe", "Red")}
      </div>
      <div class="bt-stage">
        <svg class="bt-scene" viewBox="0 0 400 220" aria-label="${me.name} and ${foe.name} spar on the mat">
          ${scene()}
          ${dinoSVG("foe", foe)}${dinoSVG("me", me)}
        </svg>
        <div class="bt-call" aria-hidden="true"></div>
        <div class="bt-panel" hidden></div>
      </div>
      <p class="bt-msg" aria-live="polite">Kicks score 2. Spin Kicks score 4. Push them off the mat for +1!</p>
      <div class="bt-pad">
        <button class="bt-key bt-step" data-k="left" type="button" aria-label="Step left">◀</button>
        <button class="bt-key bt-step" data-k="right" type="button" aria-label="Step right">▶</button>
        <button class="bt-key bt-act" data-k="kick" type="button"><span class="bt-icon">🦶</span><b>Kick</b><small>2 points</small></button>
        <button class="bt-key bt-act" data-k="spin" type="button"><span class="bt-icon">🌀</span><b>Spin Kick</b><small>4 points</small></button>
        <button class="bt-key bt-act bt-blk" data-k="block" type="button"><span class="bt-icon">✋</span><b>Block</b><small>Hold it</small></button>
        <button class="bt-key bt-act bt-special" data-k="special" type="button" style="--p:0"><span class="bt-icon">⚡</span><b>${me.special.name}</b><small class="bt-ki"></small></button>
      </div>`;
    $(".bt-to-list").addEventListener("click", showList);
    wirePad();
    drawBoard();
    newRound();
    fight.last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  const side = (s, color) => `
    <div class="bt-side bt-side-${s} ${color.toLowerCase()}">
      <b class="bt-name"></b>
      <span class="bt-pts">0</span>
      <span class="bt-wins" aria-label="rounds won"></span>
    </div>`;

  // one dino on the mat: shadow, body, kick swoosh and block guard
  const dinoSVG = (s, f) => `
    <g class="bt-f bt-${s}">
      <ellipse cx="0" cy="2" rx="40" ry="5" fill="#16264A" opacity=".35"/>
      <g class="bt-pose"><g transform="scale(.52) translate(-100 -191)">${RR.art.dinoBody(f.look)}</g></g>
      <g class="bt-fx">
        <path class="bt-swoosh" d="M10 -62 Q70 -96 96 -48" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0"/>
        <path class="bt-guard" d="M44 -96 Q66 -56 44 -10" fill="none" stroke="#7FD3F0" stroke-width="7" stroke-linecap="round" opacity="0"/>
      </g>
    </g>`;

  // a taekwondo gym (dojang) with a sparring mat
  function scene() {
    const win = x => `<rect x="${x}" y="26" width="58" height="50" rx="6" fill="url(#btWin)" stroke="#6B4A2A" stroke-width="4"/>
      <path d="M${x + 29} 26 V76 M${x} 51 H${x + 58}" stroke="#6B4A2A" stroke-width="3"/>`;
    return `
      <defs>
        <linearGradient id="btWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3E2C2"/><stop offset="1" stop-color="#E4C998"/></linearGradient>
        <linearGradient id="btWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD3EA"/><stop offset=".65" stop-color="#CDEFF5"/><stop offset=".66" stop-color="#6FB04A"/><stop offset="1" stop-color="#4E8530"/></linearGradient>
        <linearGradient id="btMat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3D7BD9"/><stop offset="1" stop-color="#2556A8"/></linearGradient>
        <linearGradient id="btFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8915A"/><stop offset="1" stop-color="#9C6A3A"/></linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#btWall)"/>
      <rect y="112" width="400" height="10" fill="#B07A45"/>
      ${win(26)}${win(316)}
      <g transform="translate(200 18)">
        <rect x="-62" y="0" width="124" height="44" rx="6" fill="#C8372D" stroke="#7A1E18" stroke-width="3"/>
        <text x="0" y="20" text-anchor="middle" font-family="Bungee, sans-serif" font-size="13" fill="#FFF3D6">DINO DOJANG</text>
        <text x="0" y="36" text-anchor="middle" font-size="12">🦖 🥋 🦕</text>
      </g>
      <path d="M0 122 H400 V220 H0Z" fill="url(#btFloor)"/>
      ${[40, 120, 200, 280, 360].map(x => `<path d="M${x} 122 L${x + (x - 200) * .5} 220" stroke="#8A5B30" stroke-width="2" opacity=".5"/>`).join("")}
      <path d="M${MAT_L - 14} 150 H${MAT_R + 14} L${MAT_R + 20} 212 H${MAT_L - 20}Z" fill="url(#btMat)" stroke="#173B78" stroke-width="3"/>
      <path d="M${MAT_L + 40} 156 H${MAT_R - 40} L${MAT_R - 34} 206 H${MAT_L + 34}Z" fill="#E8B83A" opacity=".9"/>
      <path d="M${MAT_L + 48} 160 H${MAT_R - 48} L${MAT_R - 43} 202 H${MAT_L + 43}Z" fill="#D5463A"/>
      <path d="M${MAT_L - 14} 150 H${MAT_R + 14}" stroke="#fff" stroke-width="2" opacity=".5"/>`;
  }

  function drawBoard() {
    const M = B().match, win = Math.ceil(M.rounds / 2);
    ["me", "foe"].forEach(s => {
      const f = fight[s], c = $(".bt-side-" + s);
      c.querySelector(".bt-name").textContent = f.name;
      c.querySelector(".bt-pts").textContent = f.pts;
      c.querySelector(".bt-wins").innerHTML = [...Array(win)].map((_, k) => `<i class="${k < f.rounds ? "on" : ""}"></i>`).join("");
    });
    $(".bt-round").textContent = fight.golden ? "Golden Point" : "Round " + fight.round;
    drawKi();
  }

  function drawClock() {
    const s = Math.max(0, Math.ceil(fight.clock));
    $(".bt-clockt").textContent = `0:${String(s).padStart(2, "0")}`;
    $(".bt-time").classList.toggle("hurry", s <= 5 && fight.phase === "fight");
  }

  function drawKi() {
    const me = fight.me, ready = me.ki >= me.need, btn = $(".bt-special");
    btn.style.setProperty("--p", Math.min(1, me.ki / me.need));
    btn.classList.toggle("ready", ready);
    btn.querySelector(".bt-ki").textContent = ready ? "Ready! Can't be blocked" : `${me.need - me.ki} more good hit${me.need - me.ki === 1 ? "" : "s"}`;
  }

  const say = t => { const m = $(".bt-msg"); if (m) m.textContent = t; };

  // the referee calls out a word, big in the middle of the mat
  function call(key, ms = 900) {
    const [word, meaning] = B().calls[key] || [key, ""];
    const c = $(".bt-call");
    c.innerHTML = `<b>${word}</b>${meaning ? `<small>${meaning}</small>` : ""}`;
    c.classList.remove("show"); void c.offsetWidth; c.classList.add("show");
    later(ms, () => c && c.classList.remove("show"));
  }

  // floating words over a dino: "+2", "BLOCKED!"
  function pop(s, text, kind = "hit") {
    const f = fight[s], p = document.createElement("div");
    p.className = "bt-pop " + kind;
    p.textContent = text;
    p.style.left = (f.x / 400 * 100) + "%";
    $(".bt-stage").appendChild(p);
    later(1000, () => p.remove());
  }

  /* ---------- rounds ---------- */

  function newRound() {
    const M = B().match;
    fight.round++; fight.golden = false; fight.clock = M.roundSeconds;
    ["me", "foe"].forEach((s, k) => Object.assign(fight[s], { pts: 0, hits: 0, x: START[k], vx: 0, state: "idle", t: 0, move: 0, out: false }));
    fight.phase = "intro";
    drawBoard(); drawClock();
    if (fight.round === 1) {
      fight.bow = true;
      call("bow", 1000); say(`Bow to your partner. Taekwondo starts with respect!`);
      later(1100, () => { fight.bow = false; call("ready", 800); });
      later(2000, go);
    } else {
      call("ready", 800); say(`Round ${fight.round}! Points start at 0 again.`);
      later(1000, go);
    }
  }

  function go() {
    if (!fight || fight.over) return;
    call("begin", 700);
    fight.phase = "fight";
    fight.ai = fight.now + 400;
  }

  // after a ring-out: both dinos go back to their marks, then start again
  function breakAndReset() {
    fight.phase = "break";
    call("brk", 800);
    later(900, () => {
      if (!fight || fight.over) return;
      ["me", "foe"].forEach((s, k) => Object.assign(fight[s], { x: START[k], vx: 0, state: "idle", t: 0, out: false }));
      go();
    });
  }

  function endRound() {
    const { me, foe } = fight, M = B().match;
    if (me.pts === foe.pts && !fight.golden) {
      fight.golden = true; fight.clock = M.goldenSeconds;
      fight.phase = "break";
      say("It's a tie! Golden Point: the next point wins the round.");
      drawBoard(); drawClock();
      call("stop", 800);
      later(900, breakAndReset);
      return;
    }
    fight.phase = "break";
    // still tied after Golden Point: more clean hits wins, then the player (be nice)
    const iWon = me.pts !== foe.pts ? me.pts > foe.pts : me.hits >= foe.hits;
    const w = iWon ? me : foe;
    w.rounds++;
    call("stop", 900);
    drawBoard();
    say(`${w.name} wins round ${fight.round}!`);
    const need = Math.ceil(M.rounds / 2);
    if (w.rounds >= need) { fight.over = true; later(1400, () => iWon ? win() : lose()); }
    else later(1600, newRound);
  }

  /* ---------- the controls ---------- */

  const held = { left: false, right: false, block: false };
  let keyHandler = null;

  function press(k, down) {
    if (!fight) return;
    if (k in held) held[k] = down;
    else if (down) act(fight.me, k);
  }

  function wirePad() {
    el.querySelectorAll(".bt-key").forEach(b => {
      const k = b.dataset.k;
      b.addEventListener("pointerdown", e => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch (_) {} b.classList.add("down"); press(k, true); });
      const up = () => { b.classList.remove("down"); press(k, false); };
      b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up); b.addEventListener("lostpointercapture", up);
      b.addEventListener("contextmenu", e => e.preventDefault());
    });
    // keyboard too: arrows to move, Z / X to kick, down arrow to block, space for the special
    const map = { ArrowLeft: "left", ArrowRight: "right", ArrowDown: "block", KeyS: "block", KeyZ: "kick", KeyJ: "kick", KeyX: "spin", KeyK: "spin", Space: "special", KeyL: "special" };
    unkeys();
    keyHandler = e => {
      const k = map[e.code]; if (!k || !fight) return;
      e.preventDefault();
      if (e.type === "keydown" && e.repeat && !(k in held)) return;
      press(k, e.type === "keydown");
    };
    document.addEventListener("keydown", keyHandler);
    document.addEventListener("keyup", keyHandler);
  }
  function unkeys() {
    held.left = held.right = held.block = false;
    if (!keyHandler) return;
    document.removeEventListener("keydown", keyHandler);
    document.removeEventListener("keyup", keyHandler);
    keyHandler = null;
  }

  /* ---------- moves ---------- */

  const other = f => f.side === "me" ? fight.foe : fight.me;
  const free = f => f.state === "idle" || f.state === "walk" || f.state === "block";

  // start an attack (kick, spin or special)
  function act(f, id) {
    if (!fight || fight.phase !== "fight" || !free(f)) return;
    let spec;
    if (id === "special") {
      if (f.ki < f.need) return;
      f.ki = 0; spec = f.special; f.specialOn = true;
      say(`${f.name} used ${spec.name}!`);
      if (f.side === "me") drawKi();
      if (spec.kind === "counter") { f.state = "counter"; f.t = spec.active; f.spec = spec; pop(f.side, "SPIKE GUARD!", "info"); return; }
    } else { spec = B().moves[id]; f.specialOn = false; }
    if (!spec || !spec.windup) return;
    f.guard = false;
    f.spec = spec; f.state = "windup"; f.t = spec.windup * f.quick;
  }

  // the kick lands (or not) at the start of its active part
  function strike(a) {
    const d = other(a), s = a.spec, dist = Math.abs(d.x - a.x), dir = a.face;
    if (dist > s.reach + a.reach) return;                 // too far: just a swoosh
    if (d.state === "counter") {                           // Stegosaurus Spike Guard: block and kick back
      d.state = "recover"; d.t = 300;
      score(d, d.spec.pts, "SPIKE GUARD!");
      knock(a, -dir * d.spec.push);
      a.state = "hurt"; a.t = 380;
      return;
    }
    if (d.state === "block" && !a.specialOn) {
      pop(d.side, "BLOCKED!", "info");
      knock(d, dir * B().moves.block.push);
      knock(a, -dir * 8);
      d.ki = Math.min(d.need, d.ki + 1);
      if (d.side === "me") { drawKi(); say("Nice block!"); }
      return;
    }
    score(a, s.pts);
    a.hits++;
    a.ki = Math.min(a.need, a.ki + 1);
    if (a.side === "me") drawKi();
    d.state = "hurt"; d.t = 320; d.spec = null;           // a hit stops their kick
    knock(d, dir * s.push);
  }

  function score(f, n, word) {
    f.pts += n;
    pop(f === fight.me ? "foe" : "me", (word ? word + " " : "") + "+" + n, f.side === "me" ? "hit" : "ouch");
    if (f.side === "me" && !word) say(pick(B().cheers) + ` +${n} for ${f.name}.`);
    else if (!word) say(`${f.name} scores ${n}!`);
    drawBoard();
    if (fight.golden) { fight.phase = "break"; later(300, endRound); }
  }

  // knockback: a push that slides and slows down (Steady Stance makes it shorter)
  const knock = (f, dist) => { f.vx += dist * (1 - f.steady) * 8; };

  /* ---------- the rival's brain ---------- */

  function think(now) {
    const f = fight.foe, me = fight.me, r = fight.rival, dist = f.x - me.x;
    const kick = B().moves.kick, spin = B().moves.spin;
    // see a kick coming? maybe block it (faster rivals react sooner)
    if (me.state === "windup" && !me.seen) {
      me.seen = true;
      if (Math.random() < r.guard && dist < me.spec.reach + me.reach + 30 && !me.specialOn) {
        later(r.think * .3, () => { if (fight && free(f)) { f.state = "block"; fight.aiBlockUntil = fight.now + 450; } });
      }
    }
    if (me.state !== "windup") me.seen = false;
    if (f.state === "block" && now > fight.aiBlockUntil) f.state = "idle";
    // you missed or got blocked and are getting your leg back? smart rivals kick right then
    if (me.state === "recover" && !me.punish) {
      me.punish = true;
      if (free(f) && dist <= kick.reach - 4 && Math.random() < r.guard) { f.move = 0; return act(f, "kick"); }
    }
    if (me.state !== "recover") me.punish = false;
    if (now < fight.ai || !free(f) || f.state === "block") return;
    fight.ai = now + r.think * (.7 + Math.random() * .6);
    const roll = Math.random(), sp = f.special;
    f.move = 0;
    if (f.ki >= f.need && (sp.kind === "counter" ? dist < 150 : dist <= (sp.reach + (sp.dash || 0)))) return act(f, "special");
    if (dist <= kick.reach - 4) {
      if (roll < r.spin) return act(f, "spin");
      if (roll < .72) return act(f, "kick");
      if (f.x < WALK_R - 40) f.move = 1;                   // step back
      return;
    }
    if (dist <= spin.reach - 4 && roll < r.spin) return act(f, "spin");
    f.move = roll < .85 || f.x > WALK_R - 50 ? -1 : 1;     // step in (mostly)
  }

  /* ---------- the game loop ---------- */

  function frame(now) {
    if (!fight || !el) return;
    const dt = Math.min(.05, (now - fight.last) / 1000); fight.last = now; fight.now = now;
    const F = fight, { me, foe } = F;
    if (F.phase === "fight") {
      F.clock -= dt;
      if (F.clock <= 0) { F.clock = 0; drawClock(); endRound(); }
      else drawClock();
      // you
      me.move = (held.right ? 1 : 0) - (held.left ? 1 : 0);
      if (me.state === "idle" || me.state === "walk" || me.state === "block") me.state = held.block ? "block" : me.move ? "walk" : "idle";
      think(now);
      if (foe.state === "idle" || foe.state === "walk") foe.state = foe.move ? "walk" : "idle";
      step(me, dt); step(foe, dt);
      // pushed off the mat? that's a penalty point for the other dino
      [me, foe].forEach(f => {
        if (F.phase === "fight" && (f.x < MAT_L || f.x > MAT_R)) {
          f.out = true;
          const o = other(f);
          say(`${f.name} stepped off the mat! Gam-jeom: +${B().match.ringOut} for ${o.name}.`);
          F.phase = "break";
          o.pts += B().match.ringOut; pop(f.side, "OUT!", "info");
          drawBoard();
          if (F.golden) later(400, endRound); else breakAndReset();
        }
      });
    } else {
      // between points: slide to a stop, stay on the mat
      [me, foe].forEach(f => { f.x += f.vx * dt; f.vx *= Math.exp(-8 * dt); if (!f.out) f.x = Math.max(MAT_L - 4, Math.min(MAT_R + 4, f.x)); });
    }
    draw(now);
    raf = requestAnimationFrame(frame);
  }

  function step(f, dt) {
    const o = other(f);
    f.t -= dt * 1000;
    if (f.state === "walk") {
      let nx = f.x + f.move * B().walkSpeed * f.speed * dt;
      nx = Math.max(WALK_L, Math.min(WALK_R, nx));
      f.x = f.side === "me" ? Math.min(nx, o.x - GAP) : Math.max(nx, o.x + GAP);
    }
    if (f.state === "windup" && f.spec.dash) {
      const nx = f.x + f.face * f.spec.dash / f.spec.windup * 1000 * dt;
      f.x = f.side === "me" ? Math.min(nx, o.x - GAP) : Math.max(nx, o.x + GAP);
    }
    if (f.t <= 0) {
      if (f.state === "windup") { f.state = "active"; f.t = f.spec.active; strike(f); }
      else if (f.state === "active") {
        if (f.spec.then) { f.spec = f.spec.then; f.state = "windup"; f.t = f.spec.windup * f.quick; }
        else { f.state = "recover"; f.t = f.spec.recover; }
      }
      else if (f.state === "recover" || f.state === "hurt" || f.state === "counter") { f.state = "idle"; f.spec = null; f.specialOn = false; }
    }
    // knockback slides; you can't be pushed through the other dino
    f.x += f.vx * dt; f.vx *= Math.exp(-8 * dt);
    if (Math.abs(f.vx) < 2) f.vx = 0;
    if (f.side === "me") f.x = Math.min(f.x, o.x - GAP + 6); else f.x = Math.max(f.x, o.x + GAP - 6);
  }

  // move and pose both dinos for this frame
  function draw(now) {
    ["me", "foe"].forEach(s => {
      const f = fight[s], g = $(".bt-" + s), sp = f.spec || {}, face = f.face;
      let dx = 0, dy = 0, rot = 0, sx = 1, sy = 1, swoosh = 0, guard = 0;
      const prog = sp.windup && f.state === "windup" ? 1 - f.t / (sp.windup * f.quick) : f.state === "active" && sp.active ? 1 - f.t / sp.active : 0;
      if (f.state === "walk") dy = -Math.abs(Math.sin(now / 70)) * 3;
      if (f.state === "windup") { rot = -10 * prog; dx = -4 * prog; if (sp.spin) sx = Math.cos(prog * Math.PI); }
      if (f.state === "active") { dx = sp.lunge || 10; rot = 6; swoosh = 1 - prog * .7; if (sp.spin) sx = -Math.cos(prog * Math.PI); }
      if (f.state === "block") { sy = .95; guard = 1; }
      if (f.state === "counter") { sy = .93; guard = .6 + .4 * Math.sin(now / 60); }
      if (f.state === "hurt") { dx = Math.sin(now / 25) * 3; rot = -8; }
      if (fight.bow) { rot = 22; }
      if (fight.over && fight.phase === "break") {
        const winner = (f.rounds > other(f).rounds);
        if (winner) dy = -Math.abs(Math.sin(now / 160)) * 10; else rot = 14;
      }
      g.setAttribute("transform", `translate(${f.x.toFixed(1)} ${GROUND})`);
      g.querySelector(".bt-pose").setAttribute("transform",
        `translate(${(dx * face).toFixed(1)} ${dy.toFixed(1)}) rotate(${(rot * face).toFixed(1)}) scale(${(face * sx).toFixed(3)} ${sy})`);
      const fx = g.querySelector(".bt-fx");
      fx.setAttribute("transform", `translate(${(dx * face).toFixed(1)} 0) scale(${face} 1)`);
      const sw = fx.querySelector(".bt-swoosh");
      sw.setAttribute("opacity", swoosh.toFixed(2));
      sw.setAttribute("d", sp.spin ? "M-10 -84 Q60 -112 100 -56" : `M10 -62 Q70 -96 ${Math.min(130, 70 + (sp.reach || 86) * .35)} -48`);
      fx.querySelector(".bt-guard").setAttribute("opacity", guard.toFixed(2));
    });
  }

  /* ---------- results ---------- */

  function win() {
    const r = fight.rival, done = beaten(), first = !done.includes(r.id);
    let xp = 0, note = "";
    if (first) {
      xp = r.xp;
      RR.storage.set("battle:beaten", done.concat(r.id));
    } else {
      const today = RR.daily.todayKey(), got = RR.storage.get("battle:xpToday", { date: null, xp: 0 });
      const soFar = got.date === today ? got.xp : 0;
      xp = Math.max(0, Math.min(B().rematchXP, B().rematchXpPerDay - soFar));
      if (xp) RR.storage.set("battle:xpToday", { date: today, xp: soFar + xp });
      else note = "You've earned all the rematch XP for today. Come back tomorrow!";
    }
    if (xp) RR.progress.addXP(xp);
    const next = B().rivals[fight.i + 1], champ = !next;
    panel(`
      <h2>${champ && first ? "🏆 CHAMPION!" : "You win the match!"}</h2>
      <p>${fight.me.name} beat <b>${r.name}</b> ${fight.me.rounds}–${fight.foe.rounds}. Bow to your partner! 🙇</p>
      ${xp ? `<p class="bt-xp">+${xp} XP</p>` : ""}
      ${note ? `<p>${note}</p>` : ""}
      ${first && next ? `<p>New rival unlocked: <b>${next.name}</b>!</p>` : ""}
      ${champ && first ? `<p>You beat every rival. You are the Dino Dojang champion!</p>` : ""}
      <div class="bt-btns">
        ${next ? `<button class="big-btn" data-go="${fight.i + 1}" type="button">Next: ${next.name}</button>` : ""}
        <button class="big-btn bt-alt" data-go="${fight.i}" type="button">Spar again</button>
        <button class="big-btn bt-alt" data-go="list" type="button">All rivals</button>
      </div>`);
  }

  function lose() {
    panel(`
      <h2>Good match!</h2>
      <p><b>${fight.rival.name}</b> won ${fight.foe.rounds}–${fight.me.rounds}. Bow, shake it off, and try again!</p>
      <p class="bt-tip">Tip: Block when they get ready to kick, then kick right back! Stay away from the edge of the mat.</p>
      <div class="bt-btns">
        <button class="big-btn" data-go="${fight.i}" type="button">Try again</button>
        <button class="big-btn bt-alt" data-go="list" type="button">All rivals</button>
      </div>`);
  }

  function panel(html) {
    const p = $(".bt-panel");
    p.innerHTML = html; p.hidden = false;
    p.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () =>
      b.dataset.go === "list" ? showList() : startFight(+b.dataset.go)));
    const first = p.querySelector("button"); if (first) first.focus();
  }

  RR.registerGame({
    id: "battle",
    title: "Dino Battle",
    icon: "🥋",
    blurb: "Taekwondo sparring! Kick, block and spin against 6 rival dinos. +5–30 XP",
    section: "fun",
    ready: true,
    mount(container) { el = container; showList(); },
    unmount() { clearTimers(); unkeys(); fight = null; el = null; }
  });
})();
