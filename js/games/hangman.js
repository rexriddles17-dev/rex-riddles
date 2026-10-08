/* ===== Dino Hangman ===== */
(function () {
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let el, level, secret, hint, guessed, misses, over, lastWord, timers = [], keyHandler, h3 = null;
  const $ = id => el.querySelector("#" + id);
  const cfg = () => RR.data.hangmanLevels[level];

  // 3D scene (js/games/hangman-3d.js) when the device can draw 3D, else the flat picture below
  const scene3d = `<div class="scene scene-3d" id="scene"><div class="hm-boom" id="boomText">KABOOM!</div></div>`;

  const template = () => `
    <a class="back" href="#/">‹ Back to games</a>
    <div class="hm-top"><h2 class="screen-title">Dino Hangman</h2><span class="lives" id="lives"></span></div>
    <div class="hm-levels" id="levels">
      ${Object.entries(RR.data.hangmanLevels).map(([id, lv]) =>
        `<button class="hm-level" data-level="${id}"><span>${lv.label}</span><span class="hm-stars">${lv.stars}</span></button>`).join("")}
    </div>

    ${RR.d3.ok() ? scene3d : `<div class="scene" id="scene">
      <svg viewBox="0 0 400 170" aria-hidden="true">
        <defs>
          <linearGradient id="hmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8e0"/><stop offset="1" stop-color="#d4f0f6"/></linearGradient>
          <radialGradient id="hmGlow"><stop offset="0" stop-color="#FFE27A" stop-opacity=".9"/><stop offset="1" stop-color="#FF7A1A" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="400" height="170" fill="url(#hmSky)"/>
        <circle cx="340" cy="30" r="27" fill="#FFE27A" opacity=".35"/><circle cx="340" cy="30" r="18" fill="#FFE27A"/>
        ${RR.art.cloud(70, 34, .9)}${RR.art.cloud(205, 22, .65)}
        <path d="M0 122 Q70 92 140 112 T280 104 T400 100 V170 H0Z" fill="#A8D8B9"/>
        ${RR.art.volcano(300, 140, .75)}
        <path d="M0 140 Q100 120 200 140 T400 135 V170 H0Z" fill="#7CC24E"/>
        ${RR.art.palm(24, 146, .62)}
        <path d="M0 158 Q120 148 240 158 T400 154 V170 H0Z" fill="#5FAE3E"/>
        ${RR.art.fern(170, 172, .55)}${RR.art.fern(384, 172, .6, "#3E8E4F")}
        <g id="fossil" class="fossil">${RR.art.fossil}</g>
        <g id="dino" transform="translate(60 88) scale(.32)">${RR.art.dinoBody(RR.player.look())}</g>
        <g id="meteor" class="meteor">
          <circle r="28" fill="url(#hmGlow)"/>
          <path d="M6 -3 L50 -22" stroke="#FF7A1A" stroke-width="18" stroke-linecap="round" opacity=".45"/>
          <path d="M6 -3 L40 -17" stroke="#FFE27A" stroke-width="8" stroke-linecap="round"/>
          <circle r="13" fill="#6B4A2E" stroke="#3B2614" stroke-width="2.5"/><circle cx="-4" cy="-3" r="3" fill="#4a321d"/><circle cx="5" cy="4" r="2" fill="#4a321d"/>
        </g>
        <g id="boom" class="boom">
          <polygon fill="#FF7A1A" points="92,62 104,96 140,84 116,112 150,126 114,136 128,168 98,146 80,174 76,142 40,154 62,126 30,108 66,104 56,72 82,94"/>
          <polygon fill="#FFE27A" points="92,84 100,106 122,100 108,116 128,126 106,130 112,150 94,136 84,154 82,134 60,140 74,124 54,112 76,110 70,92 86,106"/>
          <text x="92" y="128" text-anchor="middle" font-family="Bungee, Arial Black, sans-serif" font-size="17" fill="#5A3A1E">KABOOM!</text>
        </g>
      </svg>
    </div>`}

    <p class="hint" id="hint"></p>
    <div class="word" id="word" aria-live="polite"></div>
    <div class="keys" id="keys"></div>

    <div class="result" id="result" hidden>
      <h3 id="resultTitle"></h3>
      <p id="resultText"></p>
      <button class="big-btn" id="again">Play again</button>
    </div>`;

  function newRound(levelId) {
    clearTimers();
    if (levelId) { level = levelId; RR.storage.set("hangman:level", level); }
    el.querySelectorAll(".hm-level").forEach(b => b.classList.toggle("on", b.dataset.level === level));
    const words = RR.data.hangmanWords[level];
    let pick;
    do { pick = words[Math.floor(Math.random() * words.length)]; }
    while (words.length > 1 && pick.w === lastWord);
    lastWord = pick.w;
    secret = pick.w; hint = pick.h; guessed = new Set(); misses = 0; over = false;

    if (h3) { h3.reset(); $("boomText").classList.remove("go"); }
    else {
      $("dino").style.display = "";
      $("meteor").style.display = "";
      $("boom").classList.remove("go");
      $("fossil").classList.remove("show");
    }
    $("scene").classList.remove("shake");
    $("result").hidden = true;
    $("hint").innerHTML = cfg().freeHint ? "Hint: " + hint
      : `<button class="hm-hint" id="buyHint">💡 Show hint <small>(costs 1 meteor try)</small></button>`;

    $("keys").innerHTML = [...LETTERS].map(L => `<button class="key" data-l="${L}">${L}</button>`).join("");
    if (cfg().showFirst) {                            // Easy: the first letter is a free gift
      const first = secret[0];
      guessed.add(first);
      const k = el.querySelector(`.key[data-l="${first}"]`);
      k.disabled = true; k.classList.add("hit");
    }
    drawWord(); drawMeteor();
  }

  function buyHint() {
    if (over || misses >= cfg().tries - 1) return;   // never let the hint end the game
    misses++;
    $("hint").textContent = "Hint: " + hint;
    drawMeteor(); drawWord();
  }

  function drawWord() {
    $("word").style.setProperty("--len", secret.length);
    $("word").innerHTML = [...secret].map(c =>
      c === " " ? '<span class="slot gap"></span>'
                : `<span class="slot">${guessed.has(c) || over ? c : ""}</span>`).join("");
    $("lives").textContent = "Meteor tries left: " + (cfg().tries - misses);
    const b = $("buyHint");
    if (b) b.disabled = over || misses >= cfg().tries - 1;
  }

  function drawMeteor() {
    const t = misses / cfg().tries;                   // 0 = far away, 1 = landed
    if (h3) return h3.meteor(t);
    $("meteor").setAttribute("transform", `translate(${380 - t * 260} ${10 + t * 110})`);
  }

  function guess(L) {
    if (over || guessed.has(L)) return;
    guessed.add(L);
    const btn = el.querySelector(`.key[data-l="${L}"]`);
    btn.disabled = true;
    if (secret.includes(L)) btn.classList.add("hit");
    else { btn.classList.add("miss"); misses++; drawMeteor(); }
    drawWord();
    const won = [...secret].every(c => c === " " || guessed.has(c));
    if (won || misses >= cfg().tries) finish(won);
  }

  function explode() {
    if (h3) {
      h3.explode();
      timers.push(setTimeout(() => { $("boomText").classList.add("go"); $("scene").classList.add("shake"); }, 550));
      return;
    }
    $("meteor").setAttribute("transform", "translate(95 118)");   // smash into Rexy
    timers.push(setTimeout(() => {
      $("meteor").style.display = "none";
      $("dino").style.display = "none";
      $("boom").classList.add("go");
      $("scene").classList.add("shake");
    }, 550));
    timers.push(setTimeout(() => $("fossil").classList.add("show"), 1300));
  }

  function finish(won) {
    over = true; drawWord();
    el.querySelectorAll(".key").forEach(k => k.disabled = true);
    if (!won) explode();
    $("resultTitle").textContent = won ? "ROAR! You got it!" : "KABOOM!";
    $("resultText").textContent = won
      ? "The word was " + secret + "."
      : `The meteor hit, and ${RR.player.name()} turned into a fossil! The word was ${secret}.`;
    timers.push(setTimeout(() => { $("result").hidden = false; }, won ? 0 : 1300));
    if (won) RR.progress.addXP(cfg().xp);
  }

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  const lv = RR.data.hangmanLevels;
  RR.registerGame({
    id: "hangman",
    title: "Dino Hangman",
    icon: "☄️",
    blurb: `Guess the dino word before the meteor lands. Easy, Medium and Hard! +${lv.easy.xp}–${lv.hard.xp} XP`,
    ready: true,

    mount(container) {
      el = container;
      el.innerHTML = template();
      if (RR.d3.ok()) h3 = RR.hangman3d.create($("scene"), RR.player.look());
      $("levels").addEventListener("click", e => { const b = e.target.closest(".hm-level"); if (b) newRound(b.dataset.level); });
      $("keys").addEventListener("click", e => { const k = e.target.closest(".key"); if (k) guess(k.dataset.l); });
      $("hint").addEventListener("click", e => { if (e.target.closest("#buyHint")) buyHint(); });
      $("again").addEventListener("click", () => newRound());
      keyHandler = e => { if (/^[a-z]$/i.test(e.key)) guess(e.key.toUpperCase()); };
      document.addEventListener("keydown", keyHandler);
      const saved = RR.storage.get("hangman:level", "medium");   // medium = how the game played before levels
      newRound(lv[saved] ? saved : "medium");
    },

    unmount() {
      clearTimers();
      if (h3) { h3.dispose(); h3 = null; }
      document.removeEventListener("keydown", keyHandler);
    }
  });
})();
