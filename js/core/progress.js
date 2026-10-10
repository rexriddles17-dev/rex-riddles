/* XP, levels and the little pop-up messages. Games call RR.progress.addXP(n). */
RR.progress = {
  xp: 0,

  init() {
    this.xp = RR.storage.get("xp", null);
    if (this.xp === null) {                    // carry over XP saved by version 1
      let old = 0;
      try { old = parseInt(localStorage.getItem("rexXP")) || 0; } catch (e) {}
      this.xp = old;
      RR.storage.set("xp", this.xp);
    }
    this.draw();
  },

  rankFor(x) {
    let r = RR.data.ranks[0];
    for (const k of RR.data.ranks) if (x >= k.xp) r = k;
    return r;
  },

  draw() {
    const ranks = RR.data.ranks, r = this.rankFor(this.xp), next = ranks[ranks.indexOf(r) + 1];
    document.getElementById("rankName").textContent = r.name + " · " + this.xp + " XP";
    const pct = next ? (this.xp - r.xp) / (next.xp - r.xp) * 100 : 100;
    document.getElementById("xpFill").style.width = pct + "%";
  },

  addXP(n) {
    const before = this.rankFor(this.xp).name;
    this.xp += n;
    RR.storage.set("xp", this.xp);
    this.draw();
    const after = this.rankFor(this.xp).name;
    RR.toast(after !== before ? "LEVEL UP! You're a " + after + "! 🎉" : "+" + n + " XP");
  }
};

RR.toast = function (msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2400);
};
