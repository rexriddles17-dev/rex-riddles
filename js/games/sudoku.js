/* ===== Dino Sudoku =====
 * Every row, column and box gets each dino picture once.
 * Puzzles are made fresh each round, and always have exactly one answer.
 */
(function () {
  let el, level, solution, board, given, selected, mistakes, over, timers = [], keyHandler;
  const $ = id => el.querySelector("#" + id);
  const cfg = () => RR.data.sudoku;
  const icon = v => cfg().icons[v - 1];
  const DINO_COLORS = { trex: "#4CAF62", brachio: "#7FB3D5" };
  // The picture for a piece: a drawing if there is one, else the emoji
  function pic(v) {
    const a = icon(v).art;
    const shapes = !a ? null : RR.art.icons[a] || RR.art.portrait(a, DINO_COLORS[a]);
    return shapes ? `<svg class="sd-art" viewBox="0 0 100 100" aria-hidden="true">${shapes}</svg>` : icon(v).i;
  }

  /* ---------- puzzle maker ---------- */

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Can value v go at index idx of grid g (0 = empty)?
  function fits(g, L, idx, v) {
    const n = L.size, r = Math.floor(idx / n), c = idx % n;
    const br = r - r % L.boxRows, bc = c - c % L.boxCols;
    for (let k = 0; k < n; k++) {
      if (g[r * n + k] === v || g[k * n + c] === v) return false;
    }
    for (let y = br; y < br + L.boxRows; y++)
      for (let x = bc; x < bc + L.boxCols; x++)
        if (g[y * n + x] === v) return false;
    return true;
  }

  // Fill empty cells; returns how many solutions were found (stops at `limit`).
  function solve(g, L, limit, randomize) {
    const idx = g.indexOf(0);
    if (idx < 0) return 1;
    let count = 0;
    const vals = [...Array(L.size)].map((_, i) => i + 1);
    for (const v of randomize ? shuffle(vals) : vals) {
      if (!fits(g, L, idx, v)) continue;
      g[idx] = v;
      count += solve(g, L, limit - count, randomize);
      if (count >= limit) { if (!randomize) g[idx] = 0; return count; }
      g[idx] = 0;
    }
    return count;
  }

  function makePuzzle(L) {
    const full = Array(L.size * L.size).fill(0);
    solve(full, L, 1, true);                       // random finished board
    const puzzle = full.slice();
    let filled = puzzle.length;
    for (const idx of shuffle([...puzzle.keys()])) {
      if (filled <= L.keep) break;
      const v = puzzle[idx];
      puzzle[idx] = 0;
      if (solve(puzzle.slice(), L, 2, false) !== 1) puzzle[idx] = v;  // keep it if needed for one answer
      else filled--;
    }
    return { full, puzzle };
  }

  /* ---------- screen ---------- */

  const template = () => `
    <a class="back" href="#/">‹ Back to games</a>
    <div class="sd-top">
      <h2 class="screen-title">Dino Sudoku</h2>
      <span class="eggs" id="eggs" aria-label="Eggs left"></span>
    </div>
    <div class="sd-levels" id="levels">
      ${Object.entries(cfg().levels).map(([id, L]) =>
        `<button class="sd-level" data-level="${id}">${L.label}</button>`).join("")}
    </div>
    <p class="sd-help">Every row, column and box needs each dino once. Tap a square, then tap a dino!</p>
    <div class="sd-board" id="board"></div>
    <p class="sd-msg" id="msg" aria-live="polite"></p>
    <div class="sd-pad" id="pad"></div>
    <div class="result" id="result" hidden>
      <h3 id="resultTitle"></h3>
      <p id="resultText"></p>
      <button class="big-btn" id="again">New puzzle</button>
    </div>`;

  function newRound(levelId) {
    clearTimers();
    level = levelId || level;
    RR.storage.set("sudoku:level", level);
    const L = cfg().levels[level];
    const p = makePuzzle(L);
    solution = p.full; board = p.puzzle; given = board.map(v => v > 0);
    selected = board.indexOf(0); mistakes = 0; over = false;

    el.querySelectorAll(".sd-level").forEach(b => b.classList.toggle("on", b.dataset.level === level));
    $("board").style.setProperty("--n", L.size);
    $("board").className = "sd-board size-" + L.size;
    $("pad").style.setProperty("--n", L.size);
    $("result").hidden = true;
    $("msg").textContent = "";
    draw();
  }

  function draw() {
    const L = cfg().levels[level], n = L.size;
    const sel = selected >= 0 ? { r: Math.floor(selected / n), c: selected % n } : null;
    const sameBox = (r, c) => sel &&
      Math.floor(r / L.boxRows) === Math.floor(sel.r / L.boxRows) &&
      Math.floor(c / L.boxCols) === Math.floor(sel.c / L.boxCols);

    $("board").innerHTML = board.map((v, i) => {
      const r = Math.floor(i / n), c = i % n, cls = ["sd-cell"];
      if (given[i]) cls.push("given");
      if (c % L.boxCols === L.boxCols - 1 && c < n - 1) cls.push("edge-r");
      if (r % L.boxRows === L.boxRows - 1 && r < n - 1) cls.push("edge-b");
      if (i === selected) cls.push("sel");
      else if (sel && (r === sel.r || c === sel.c || sameBox(r, c))) cls.push("near");
      const label = v ? icon(v).name : "empty";
      return `<button class="${cls.join(" ")}" data-i="${i}" aria-label="Row ${r + 1}, column ${c + 1}: ${label}">${v ? pic(v) : ""}</button>`;
    }).join("");

    // a dino is greyed out on the pad once all of them are placed
    $("pad").innerHTML = [...Array(n)].map((_, k) => {
      const v = k + 1, done = board.filter(x => x === v).length === n;
      return `<button class="sd-pick" data-v="${v}" ${done || over ? "disabled" : ""} aria-label="${icon(v).name}">${pic(v)}</button>`;
    }).join("");

    $("eggs").innerHTML = [...Array(cfg().eggs)].map((_, k) =>
      `<span class="egg${k < mistakes ? " cracked" : ""}">🥚</span>`).join("");
  }

  function reason(idx, v) {
    const L = cfg().levels[level], n = L.size, r = Math.floor(idx / n), c = idx % n, name = icon(v).name;
    for (let k = 0; k < n; k++) if (board[r * n + k] === v) return `There's already a ${name} in this row!`;
    for (let k = 0; k < n; k++) if (board[k * n + c] === v) return `There's already a ${name} in this column!`;
    if (!fits(board, L, idx, v)) return `There's already a ${name} in this box!`;
    return `A ${name} doesn't go there. Look again!`;
  }

  function place(v) {
    if (over) return;
    if (selected < 0 || board[selected]) { $("msg").textContent = "Tap an empty square first!"; return; }
    const idx = selected;
    if (solution[idx] === v) {
      board[idx] = v;
      $("msg").textContent = "";
      selected = board.indexOf(0);
      draw();
      if (selected < 0) finish(true);
      return;
    }
    mistakes++;
    $("msg").textContent = reason(idx, v) + " An egg cracked.";
    draw();
    const cell = el.querySelector(`.sd-cell[data-i="${idx}"]`);
    cell.innerHTML = pic(v);
    cell.classList.add("wrong");
    timers.push(setTimeout(() => { cell.innerHTML = ""; cell.classList.remove("wrong"); }, 700));
    if (mistakes >= cfg().eggs) finish(false);
  }

  function finish(won) {
    over = true;
    if (!won) { board = solution.slice(); selected = -1; }
    draw();
    if (won) {
      $("board").classList.add("win");
      RR.progress.addXP(cfg().levels[level].xp);
      const solved = RR.storage.get("sudoku:solved", 0) + 1;
      RR.storage.set("sudoku:solved", solved);
      $("resultTitle").textContent = "ROAR! You solved it!";
      $("resultText").textContent = `Every dino is in the right spot. Puzzles solved: ${solved}.`;
    } else {
      $("resultTitle").textContent = "Oh no! All the eggs cracked!";
      $("resultText").textContent = "Here is the answer. Try a new puzzle!";
    }
    timers.push(setTimeout(() => { $("result").hidden = false; }, won ? 600 : 800));
  }

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  const levels = RR.data.sudoku.levels;

  RR.registerGame({
    id: "sudoku",
    title: "Dino Sudoku",
    icon: "🦕",
    blurb: `Put every dino in its place. +${levels.small.xp}–${levels.big.xp} XP`,
    ready: true,

    mount(container) {
      el = container;
      el.innerHTML = template();
      $("levels").addEventListener("click", e => {
        const b = e.target.closest(".sd-level"); if (b) newRound(b.dataset.level);
      });
      $("board").addEventListener("click", e => {
        const b = e.target.closest(".sd-cell"); if (!b || over) return;
        selected = +b.dataset.i; $("msg").textContent = ""; draw();
      });
      $("pad").addEventListener("click", e => {
        const b = e.target.closest(".sd-pick"); if (b) place(+b.dataset.v);
      });
      $("again").addEventListener("click", () => newRound());
      keyHandler = e => {                                     // optional: number keys on a computer
        const v = +e.key;
        if (v >= 1 && v <= cfg().levels[level].size) place(v);
      };
      document.addEventListener("keydown", keyHandler);
      const saved = RR.storage.get("sudoku:level", "small");
      newRound(cfg().levels[saved] ? saved : "small");
    },

    unmount() {
      clearTimers();
      document.removeEventListener("keydown", keyHandler);
    }
  });
})();
