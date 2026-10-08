/* ===== Dino Trivia of the Day =====
 * Same questions for every friend on the same day (picked from the date).
 * XP once per day. A practice round afterwards is just for fun (no XP).
 * Saved: trivia:today (answers so far, so you can come back), trivia:lastSolved, trivia:streak
 */
(function () {
  let el, game;          // game = { mode, date, qs: [{q, a, fact, choices}], answers: [], shown }
  const T = () => RR.data.trivia;
  const $ = id => el.querySelector("#" + id);

  /* ---------- picking questions ---------- */

  // Walk through the whole question list in a fixed mixed-up order, perDay at a time
  function dailyQuestions(dateKey) {
    const all = T().questions, n = all.length, per = Math.min(T().perDay, n);
    const order = RR.daily.shuffle([...all.keys()], RR.daily.seededRandom("rex-riddles:trivia"));
    const start = (RR.daily.dayNumber(dateKey) * per) % n;
    return [...Array(per)].map((_, i) => withChoices(all[order[(start + i) % n]], RR.daily.seededRandom(dateKey + ":" + i)));
  }

  function practiceQuestions() {
    return RR.daily.shuffle(T().questions).slice(0, T().perDay).map(q => withChoices(q, Math.random));
  }

  function withChoices(q, rand) {
    return { q: q.q, a: q.a, fact: q.fact, choices: RR.daily.shuffle([q.a].concat(q.wrong), rand) };
  }

  /* ---------- saving ---------- */

  function save() {
    if (game.mode === "daily") RR.storage.set("trivia:today", { date: game.date, picks: game.qs.map(x => x.q), answers: game.answers });
  }

  function startDaily() {
    const date = RR.daily.todayKey();
    const qs = dailyQuestions(date);
    const saved = RR.storage.get("trivia:today", null);
    const same = saved && saved.date === date && saved.picks.join("|") === qs.map(x => x.q).join("|");
    game = { mode: "daily", date, qs, answers: same ? saved.answers : [], shown: false };
    render();
  }

  function startPractice() {
    game = { mode: "practice", date: null, qs: practiceQuestions(), answers: [], shown: false };
    render(); window.scrollTo(0, 0);
  }

  const score = () => game.answers.filter((x, i) => x === game.qs[i].a).length;

  function finishDaily() {
    if (RR.storage.get("trivia:lastSolved", null) === game.date) return null;   // XP once per day
    RR.storage.set("trivia:lastSolved", game.date);
    const s = RR.storage.get("trivia:streak", { count: 0, last: null });
    const streak = { count: s.last === RR.daily.yesterdayKey(game.date) ? s.count + 1 : 1, last: game.date };
    RR.storage.set("trivia:streak", streak);
    const right = score(), xp = right * T().xpEach + (right === game.qs.length ? T().perfectBonus : 0);
    if (xp) RR.progress.addXP(xp);
    return xp;
  }

  /* ---------- screens ---------- */

  // Rexy the host: a 3D picture when the device can draw 3D
  const rexy = () => RR.d3.ok()
    ? `<img class="tv-rexy tv-rexy-3d" src="${RR.d3.dinoPicture({ species: "trex", color: "natural" }, "head", 160)}" alt="Rexy">`
    : RR.art.avatar({ name: "Rexy the T-Rex", color: "#4CAF62" }, "tv-rexy");
  const prettyDate = key => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  };

  function header() {
    const s = RR.storage.get("trivia:streak", { count: 0, last: null });
    const live = s.last === RR.daily.todayKey() || s.last === RR.daily.yesterdayKey(RR.daily.todayKey());
    return `
      <a class="back" href="#/">‹ Back to games</a>
      <div class="tv-top">
        <h2 class="screen-title">Dino Trivia</h2>
        ${live && s.count > 1 ? `<span class="tv-streak">🔥 ${s.count}-day streak</span>` : ""}
      </div>
      <p class="tv-date">${game.mode === "daily" ? "📅 " + prettyDate(game.date) : "🎯 Practice round (no XP)"}</p>
      <div class="tv-dots">${game.qs.map((q, i) => {
        const a = game.answers[i];
        return `<span class="tv-dot ${a === undefined ? "" : a === q.a ? "right" : "wrong"} ${i === game.answers.length && !game.shown ? "now" : ""}"></span>`;
      }).join("")}</div>`;
  }

  function render() {
    const i = game.answers.length;
    // finished all questions (and the last answer has been seen)
    if (i >= game.qs.length && !game.shown) return renderResults();
    const idx = game.shown ? i - 1 : i;
    const q = game.qs[idx], picked = game.shown ? game.answers[idx] : null;
    const letters = "ABCD";

    el.innerHTML = `
      ${header()}
      <div class="tv-card">
        <div class="tv-ask">${rexy()}<div class="tv-bubble"><span class="tv-num">Question ${idx + 1} of ${game.qs.length}</span>${q.q}</div></div>
        <div class="tv-choices">
          ${q.choices.map((c, k) => {
            const cls = !picked ? "" : c === q.a ? "right" : c === picked ? "wrong" : "dim";
            return `<button class="tv-choice ${cls}" data-k="${k}" ${picked ? "disabled" : ""}><span class="tv-letter">${letters[k]}</span><span>${c}</span></button>`;
          }).join("")}
        </div>
        ${picked ? `
          <div class="tv-feedback ${picked === q.a ? "right" : "wrong"}">
            <b>${picked === q.a ? "ROAR! That's right!" : "Not quite! It's: " + q.a}</b>
            <p>🦴 Fun fact: ${q.fact}</p>
          </div>
          <button class="big-btn" id="next">${i >= game.qs.length ? "See my score" : "Next question ›"}</button>` : ""}
      </div>`;

    el.querySelectorAll(".tv-choice").forEach(b => b.onclick = () => {
      game.answers.push(q.choices[+b.dataset.k]);
      game.shown = true;
      save(); render();
    });
    const next = $("next");
    if (next) next.onclick = () => { game.shown = false; render(); window.scrollTo(0, 0); };
  }

  function renderResults() {
    const right = score(), total = game.qs.length;
    const xp = game.mode === "daily" ? finishDaily() : null;
    const streak = RR.storage.get("trivia:streak", { count: 0 });
    const title = right === total ? "PERFECT! Dino genius!" : right >= total - 1 ? "ROAR! Great job!" : right >= total / 2 ? "Nice work!" : "Good try!";
    const stars = [...Array(total)].map((_, k) => `<span class="${k < right ? "on" : ""}">★</span>`).join("");

    el.innerHTML = `
      ${header()}
      <div class="tv-card tv-results">
        ${rexy()}
        <h3>${title}</h3>
        <div class="tv-score">${right} / ${total}</div>
        <div class="tv-stars">${stars}</div>
        ${game.mode === "daily"
          ? `<p>${xp ? `You earned <b>+${xp} XP</b>!` : xp === 0 ? "No XP this time, but you learned some cool facts!" : "You already played today."}
               ${streak.count > 1 ? `<br>🔥 ${streak.count} days in a row!` : ""}</p>
             <p class="tv-tomorrow">Come back tomorrow for ${total} new questions!</p>`
          : `<p>Practice is just for fun. Your daily XP is safe!</p>`}
        <ol class="tv-review">
          ${game.qs.map((q, k) => `<li class="${game.answers[k] === q.a ? "right" : "wrong"}">${game.answers[k] === q.a ? "✅" : "❌"} ${q.q}<br><small>Answer: ${q.a}</small></li>`).join("")}
        </ol>
        <button class="big-btn" id="practice">Practice round</button>
      </div>`;
    $("practice").onclick = startPractice;
  }

  RR.registerGame({
    id: "trivia",
    title: "Trivia of the Day",
    icon: "❓",
    blurb: `${RR.data.trivia.perDay} new dino questions every day! +${RR.data.trivia.xpEach} XP each`,
    ready: true,
    mount(container) { el = container; startDaily(); },
    unmount() { game = null; }
  });
})();
