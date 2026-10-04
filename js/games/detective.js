/* ===== Dino Detective ===== */
(function () {
  let el, state, level;
  const levels = () => RR.data.detectiveLevels;
  const cases = () => RR.data.detectiveCases.filter(c => (c.level || "easy") === level);
  const solvedList = () => RR.storage.get("detective:solved", []);
  // Easy keeps the original key so saved progress still counts
  const dailyKey = lv => "detective:dailySolved" + (lv === "easy" ? "" : ":" + lv);
  const dailyDone = () => RR.storage.get(dailyKey(level), null) === RR.detectiveDaily.todayKey();

  function freshState(caseId) {
    // Keep the case in state so the daily case can't change mid-game at midnight
    const c = caseId === "daily" ? RR.detectiveDaily.today(level) : RR.data.detectiveCases.find(x => x.id === caseId);
    const rules = levels()[c.level || "easy"];
    return { caseId, c, rules, triesLeft: rules.tries, found: [], lastFind: null, talkedTo: null,
             accusing: false, wrongMsg: null, solved: false, failed: false };
  }

  /* ---------- Case list ---------- */
  function renderList() {
    const solved = solvedList();
    const daily = RR.detectiveDaily.today(level);
    el.innerHTML = `
      <a class="back" href="#/">‹ Back to games</a>
      <h2 class="screen-title">Dino Detective 🔍</h2>
      <p class="dt-lead">Pick a case. Search for clues, talk to suspects, and catch the culprit!</p>
      <div class="dt-levels">
        ${Object.entries(levels()).map(([id, L]) => `
          <button class="dt-level ${id === level ? "on" : ""}" data-level="${id}">
            <span>${L.label}</span><span class="dt-stars">${L.stars}</span>
          </button>`).join("")}
      </div>
      <p class="dt-about">${levels()[level].about}</p>
      ${daily ? `
      <button class="dt-case dt-daily" data-case="daily">
        <span class="dt-case-icon">${daily.icon}</span>
        <span><span class="dt-daily-tag">📅 Case of the Day</span><span class="dt-case-title">${daily.title}</span></span>
        <span class="dt-case-meta">${dailyDone() ? "✅ Solved" : "+" + daily.xp + " XP"}</span>
      </button>
      <p class="dt-daily-note">A new mystery every day. Same one for all your friends!</p>` : ""}
      <div class="dt-cases">
        ${cases().map(c => `
          <button class="dt-case" data-case="${c.id}">
            <span class="dt-case-icon">${c.icon}</span>
            <span class="dt-case-title">${c.title}</span>
            <span class="dt-case-meta">${solved.includes(c.id) ? "✅ Solved" : "+" + c.xp + " XP"}</span>
          </button>`).join("")}
      </div>`;
    el.querySelectorAll(".dt-level").forEach(b => b.addEventListener("click", () => {
      level = b.dataset.level;
      RR.storage.set("detective:level", level);
      renderList();
    }));
    el.querySelectorAll(".dt-case").forEach(b =>
      b.addEventListener("click", () => { state = freshState(b.dataset.case); renderCase(); window.scrollTo(0, 0); }));
  }

  /* ---------- One case ---------- */
  function renderCase() {
    const c = state.c;
    const R = state.rules;
    const need = R.cluesNeeded === "all" ? c.places.length : Math.min(R.cluesNeeded, c.places.length);
    const canAccuse = state.found.length >= need;
    const suspect = id => c.suspects.find(s => s.id === id);
    const avatar = s => RR.art.avatar(s);
    const triesNote = R.tries ? `<p class="dt-tries">Guesses left: ${"🔍".repeat(state.triesLeft)}</p>` : "";

    if (state.failed) {
      el.innerHTML = `
        <button class="back dt-link" id="toList">‹ All cases</button>
        <div class="dt-solved">
          <div class="dt-stamp dt-stamp-fail">GOT<br>AWAY!</div>
          <h2 class="screen-title">${c.title}</h2>
          <p>Oh no! You ran out of guesses, and the culprit sneaked away. Read your clues again and try once more, Detective!</p>
          <button class="big-btn" id="retry">Try this case again</button>
        </div>`;
      el.querySelector("#toList").onclick = renderList;
      el.querySelector("#retry").onclick = () => {
        state = Object.assign(freshState(state.caseId), { c });   // same case, fresh start
        renderCase(); window.scrollTo(0, 0);
      };
      return;
    }

    if (state.solved) {
      el.innerHTML = `
        <button class="back dt-link" id="toList">‹ All cases</button>
        <div class="dt-solved">
          <div class="dt-stamp">CASE<br>CLOSED</div>
          ${avatar(suspect(c.culprit))}
          <h2 class="screen-title">${c.title}</h2>
          <p>${c.ending}</p>
          <button class="big-btn" id="toList2">More cases</button>
        </div>`;
      el.querySelector("#toList").onclick = el.querySelector("#toList2").onclick = renderList;
      return;
    }

    el.innerHTML = `
      <button class="back dt-link" id="toList">‹ All cases</button>
      <h2 class="screen-title">${c.icon} ${c.title}</h2>
      <p class="dt-lead">${c.intro}</p>

      <h3 class="dt-h">1. Search for clues</h3>
      <div class="dt-grid">
        ${c.places.map(p => `
          <button class="dt-tile ${state.found.includes(p.id) ? "done" : ""}" data-place="${p.id}">
            <span class="dt-tile-icon">${p.icon}</span><span>${p.name}</span>
            ${state.found.includes(p.id) ? '<span class="dt-check">✓</span>' : ""}
          </button>`).join("")}
      </div>
      ${state.lastFind ? `<div class="dt-find">🔍 <b>Clue found!</b> ${c.places.find(p => p.id === state.lastFind).clue}</div>` : ""}

      <h3 class="dt-h">2. Talk to the suspects</h3>
      <div class="dt-grid">
        ${c.suspects.map(s => `
          <button class="dt-tile dt-suspect ${state.talkedTo === s.id ? "active" : ""}" data-suspect="${s.id}">
            ${avatar(s)}<span>${s.name}</span>
          </button>`).join("")}
      </div>
      ${state.talkedTo ? `<div class="dt-quote">${avatar(suspect(state.talkedTo))}<p><b>${suspect(state.talkedTo).name}:</b> “${suspect(state.talkedTo).says}”</p></div>` : ""}

      <h3 class="dt-h">📒 Detective notebook (${state.found.length}/${c.places.length} clues)</h3>
      <ol class="dt-notebook">
        ${state.found.length
          ? state.found.map(id => `<li>${c.places.find(p => p.id === id).clue}</li>`).join("")
          : "<li class='dt-empty'>No clues yet. Tap a place to search it!</li>"}
      </ol>

      <h3 class="dt-h">3. Who did it?</h3>
      ${!canAccuse
        ? `<p class="dt-need">Find ${need - state.found.length} more clue${need - state.found.length === 1 ? "" : "s"} before you can name the culprit.</p>`
        : state.accusing
          ? `<div class="dt-accuse ${state.wrongMsg ? "dt-shake" : ""}">
               ${state.wrongMsg ? `<p class="dt-wrong">❌ ${state.wrongMsg}</p>` : "<p>Tap the dino you think did it:</p>"}
               ${triesNote}
               <div class="dt-grid">
                 ${c.suspects.map(s => `<button class="dt-tile" data-accuse="${s.id}">${avatar(s)}<span>${s.name}</span></button>`).join("")}
               </div>
             </div>`
          : `${triesNote}<button class="big-btn" id="accuse">I know who did it!</button>`}`;

    el.querySelector("#toList").onclick = renderList;
    el.querySelectorAll("[data-place]").forEach(b => b.onclick = () => {
      const id = b.dataset.place;
      if (!state.found.includes(id)) state.found.push(id);
      state.lastFind = id;
      renderCase();
    });
    el.querySelectorAll("[data-suspect]").forEach(b => b.onclick = () => { state.talkedTo = b.dataset.suspect; renderCase(); });
    const acc = el.querySelector("#accuse");
    if (acc) acc.onclick = () => { state.accusing = true; renderCase(); };
    el.querySelectorAll("[data-accuse]").forEach(b => b.onclick = () => accuse(c, b.dataset.accuse));
  }

  function accuse(c, id) {
    if (id !== c.culprit) {
      const name = c.suspects.find(s => s.id === id).name;
      if (state.rules.tries && --state.triesLeft <= 0) { state.failed = true; renderCase(); window.scrollTo(0, 0); return; }
      state.wrongMsg = state.rules.hints ? `${name} has a good alibi! ${c.wrong}` : `Not ${name}! Think hard before you guess again.`;
      renderCase();
      return;
    }
    state.solved = true;
    const solved = solvedList();
    if (c.daily) {                             // daily case: XP once per day for each level
      const key = dailyKey(c.level);
      if (RR.storage.get(key, null) !== c.date) {
        RR.storage.set(key, c.date);
        RR.progress.addXP(c.xp);
      } else {
        RR.toast("Solved again! Come back tomorrow for a new case 🔍");
      }
    } else if (!solved.includes(c.id)) {       // XP only the first time a case is solved
      RR.storage.set("detective:solved", solved.concat(c.id));
      RR.progress.addXP(c.xp);
    } else {
      RR.toast("Solved again! 🔍");
    }
    renderCase();
    window.scrollTo(0, 0);
  }

  RR.registerGame({
    id: "detective",
    title: "Dino Detective",
    icon: "🔍",
    blurb: "Find clues, question suspects, and crack the case. Easy, Medium and Hard! +20–30 XP",
    ready: true,
    mount(container) {
      el = container; state = null;
      const saved = RR.storage.get("detective:level", "easy");
      level = levels()[saved] ? saved : "easy";
      renderList();
    },
    unmount() { state = null; }
  });
})();
