/* ===== Harvest Match (Gobble Fest, limited time) =====
 * Flip two cards at a time and find all the matching Thanksgiving pairs.
 * XP for the first `winsPerDay` wins each day (settings in js/data/thanksgiving.js).
 * Saved: harvest:level, harvest:today {date, wins}, harvest:best {easy, hard} (fewest moves)
 */
(function () {
  let el, level, deck, open, matched, moves, lock, timer = 0;
  const H = () => RR.data.harvest;
  const $ = sel => el.querySelector(sel);

  const winsToday = () => {
    const t = RR.storage.get("harvest:today", null);
    return t && t.date === RR.daily.todayKey() ? t.wins : 0;
  };

  function newBoard() {
    clearTimeout(timer);
    const L = H().levels[level];
    const pics = RR.daily.shuffle(H().pictures).slice(0, L.pairs);
    deck = RR.daily.shuffle(pics.concat(pics)).map((pic, i) => ({ i, pic }));
    open = []; matched = []; moves = 0; lock = false;
    render();
  }

  function render() {
    const L = H().levels[level], best = RR.storage.get("harvest:best", {})[level];
    const left = Math.max(0, H().winsPerDay - winsToday());
    el.innerHTML = `
      <a class="back" href="#/">‹ Back to games</a>
      <h2 class="screen-title">Harvest Match 🍂</h2>
      <p class="hv-lead">Flip two cards. Find all the matching pairs!</p>
      <div class="hv-levels">${Object.entries(H().levels).map(([id, x]) =>
        `<button class="hv-level ${id === level ? "on" : ""}" data-level="${id}"><span>${x.label}</span><span>${x.stars}</span></button>`).join("")}</div>
      <div class="hv-stats">
        <span>Moves: <b class="hv-moves">${moves}</b></span>
        <span>Pairs: <b class="hv-pairs">${matched.length / 2}</b>/${L.pairs}</span>
        ${best ? `<span>Best: <b>${best}</b></span>` : ""}
      </div>
      <div class="hv-grid hv-${level}">${deck.map(c => `
        <button class="hv-card" data-i="${c.i}" aria-label="Card ${c.i + 1}, face down">
          <span class="hv-inner">
            <span class="hv-face hv-back" aria-hidden="true">${RR.art.maple("#F2A93B")}</span>
            <span class="hv-face hv-front"><svg viewBox="0 0 100 100" aria-hidden="true">${RR.art.harvest[c.pic]}</svg></span>
          </span>
        </button>`).join("")}</div>
      <div class="hv-win" hidden></div>
      <p class="hv-help">${left ? `Win to earn +${L.xp} XP. XP wins left today: ${left}` : "You got all your XP for today. Keep playing for fun!"}</p>`;
    el.querySelectorAll(".hv-level").forEach(b => b.onclick = () => {
      level = b.dataset.level; RR.storage.set("harvest:level", level); newBoard();
    });
    el.querySelectorAll(".hv-card").forEach(b => b.onclick = () => flip(+b.dataset.i));
  }

  function setFace(i, up) {
    const b = el.querySelector(`.hv-card[data-i="${i}"]`);
    b.classList.toggle("up", up);
    b.setAttribute("aria-label", up ? "Card " + (i + 1) + ": " + deck[i].pic : "Card " + (i + 1) + ", face down");
  }

  function flip(i) {
    if (lock || open.includes(i) || matched.includes(i)) return;
    open.push(i); setFace(i, true);
    if (open.length < 2) return;
    moves++;
    $(".hv-moves").textContent = moves;
    const [a, b] = open;
    if (deck[a].pic === deck[b].pic) {
      matched.push(a, b); open = [];
      [a, b].forEach(x => el.querySelector(`.hv-card[data-i="${x}"]`).classList.add("matched"));
      $(".hv-pairs").textContent = matched.length / 2;
      if (matched.length === deck.length) timer = setTimeout(win, 500);
    } else {
      lock = true;
      timer = setTimeout(() => { [a, b].forEach(x => setFace(x, false)); open = []; lock = false; }, H().peekMs);
    }
  }

  function win() {
    const L = H().levels[level];
    const stars = moves <= L.pairs + 3 ? 3 : moves <= L.pairs * 2 ? 2 : 1;
    const bestAll = RR.storage.get("harvest:best", {}), newBest = !bestAll[level] || moves < bestAll[level];
    if (newBest) RR.storage.set("harvest:best", Object.assign({}, bestAll, { [level]: moves }));
    const wins = winsToday();
    const earn = wins < H().winsPerDay;
    RR.storage.set("harvest:today", { date: RR.daily.todayKey(), wins: wins + 1 });
    const box = $(".hv-win");
    box.innerHTML = `
      <h3>You found them all! 🦃</h3>
      <p class="hv-stars">${"⭐".repeat(stars)}${"☆".repeat(3 - stars)}</p>
      <p>${moves} moves${newBest ? " · New best!" : ""}</p>
      <p>${earn ? `+${L.xp} XP` : "No more XP today, but great job!"}</p>
      <button class="big-btn hv-again" type="button">Play again</button>`;
    box.hidden = false;
    box.querySelector(".hv-again").onclick = newBoard;
    const left = Math.max(0, H().winsPerDay - winsToday());
    $(".hv-help").textContent = left ? `XP wins left today: ${left}` : "You got all your XP for today. Keep playing for fun!";
    box.scrollIntoView({ behavior: "smooth", block: "center" });
    if (earn) RR.progress.addXP(L.xp);
    else RR.toast("Matched them all! 🍂");
  }

  RR.registerGame({
    id: "harvest",
    event: "thanksgiving",
    section: "thanksgiving",
    title: "Harvest Match",
    icon: "🍂",
    blurb: "Flip cards and find the Thanksgiving pairs! +" + RR.data.harvest.levels.easy.xp + "–" + RR.data.harvest.levels.hard.xp + " XP",
    ready: true,
    mount(container) {
      el = container;
      const saved = RR.storage.get("harvest:level", "easy");
      level = H().levels[saved] ? saved : "easy";
      newBoard();
    },
    unmount() { clearTimeout(timer); el = null; }
  });
})();
