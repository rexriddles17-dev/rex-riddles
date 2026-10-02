/* ===== Dino Detective ===== */
(function () {
  const CLUES_NEEDED = 3;          // clues to find before you can accuse

  let el, state;
  const cases = () => RR.data.detectiveCases;
  const solvedList = () => RR.storage.get("detective:solved", []);

  function freshState(caseId) {
    return { caseId, found: [], lastFind: null, talkedTo: null, accusing: false, wrongMsg: null, solved: false };
  }

  /* ---------- Case list ---------- */
  function renderList() {
    const solved = solvedList();
    el.innerHTML = `
      <a class="back" href="#/">‹ Back to games</a>
      <h2 class="screen-title">Dino Detective 🔍</h2>
      <p class="dt-lead">Pick a case. Search for clues, talk to suspects, and catch the culprit!</p>
      <div class="dt-cases">
        ${cases().map(c => `
          <button class="dt-case" data-case="${c.id}">
            <span class="dt-case-icon">${c.icon}</span>
            <span class="dt-case-title">${c.title}</span>
            <span class="dt-case-meta">${solved.includes(c.id) ? "✅ Solved" : "+" + c.xp + " XP"}</span>
          </button>`).join("")}
      </div>`;
    el.querySelectorAll(".dt-case").forEach(b =>
      b.addEventListener("click", () => { state = freshState(b.dataset.case); renderCase(); window.scrollTo(0, 0); }));
  }

  /* ---------- One case ---------- */
  function renderCase() {
    const c = cases().find(x => x.id === state.caseId);
    const canAccuse = state.found.length >= CLUES_NEEDED;
    const suspect = id => c.suspects.find(s => s.id === id);
    const avatar = s => `<span class="dt-avatar" style="background:${s.color}">${s.icon}</span>`;

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
        ? `<p class="dt-need">Find ${CLUES_NEEDED - state.found.length} more clue${CLUES_NEEDED - state.found.length === 1 ? "" : "s"} before you can name the culprit.</p>`
        : state.accusing
          ? `<div class="dt-accuse ${state.wrongMsg ? "dt-shake" : ""}">
               ${state.wrongMsg ? `<p class="dt-wrong">❌ ${state.wrongMsg}</p>` : "<p>Tap the dino you think did it:</p>"}
               <div class="dt-grid">
                 ${c.suspects.map(s => `<button class="dt-tile" data-accuse="${s.id}">${avatar(s)}<span>${s.name}</span></button>`).join("")}
               </div>
             </div>`
          : `<button class="big-btn" id="accuse">I know who did it!</button>`}`;

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
      state.wrongMsg = `${c.suspects.find(s => s.id === id).name} has a good alibi! ${c.wrong}`;
      renderCase();
      return;
    }
    state.solved = true;
    const solved = solvedList();
    if (!solved.includes(c.id)) {              // XP only the first time a case is solved
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
    blurb: "Find clues, question suspects, and crack the case. +20 XP",
    ready: true,
    mount(container) { el = container; state = null; renderList(); },
    unmount() { state = null; }
  });
})();
