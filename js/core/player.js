/*
 * The player's own dino: what it looks like, what they own, and XP they can spend.
 * Spending never lowers the rank: rank uses all XP ever earned (RR.progress.xp),
 * the shop uses   balance = all XP earned − XP spent.
 * Saved: shop:look, shop:owned, shop:spent
 */
RR.player = {
  DEFAULT_LOOK: { species: "trex", color: "natural", hat: null, eyes: null, neck: null, back: null, paint: {} },
  SLOTS: ["hat", "eyes", "neck", "back"],

  look() { return Object.assign({}, this.DEFAULT_LOOK, RR.storage.get("shop:look", {})); },
  spent() { return RR.storage.get("shop:spent", 0); },
  balance() { return Math.max(0, RR.progress.xp - this.spent()); },

  // Every catalog entry with a kind: species, color, or the item's slot
  catalog() {
    const S = RR.data.shop;
    return [].concat(
      S.species.map(x => Object.assign({ kind: "species" }, x)),
      S.colors.map(x => Object.assign({ kind: "color" }, x)),
      S.items.map(x => Object.assign({ kind: x.slot }, x)));
  },
  find(id) { return this.catalog().find(x => x.id === id); },

  owns(id) {
    const item = this.find(id);
    return !!item && (item.price === 0 || RR.storage.get("shop:owned", []).includes(id));
  },

  // What the dino would look like wearing / being this item
  withItem(look, item) {
    const next = Object.assign({}, look);
    if (item.kind === "species") next.species = item.id;
    else if (item.kind === "color") next.color = item.id;
    else next[item.kind] = item.id;
    return next;
  },

  isWearing(id) {
    const L = this.look();
    return [L.species, L.color].concat(this.SLOTS.map(s => L[s])).includes(id);
  },

  buy(id) {
    const item = this.find(id);
    if (!item || this.owns(id)) return false;
    if (this.balance() < item.price) return false;
    RR.storage.set("shop:spent", this.spent() + item.price);
    RR.storage.set("shop:owned", RR.storage.get("shop:owned", []).concat(id));
    return true;
  },

  // Put on an owned item. Tapping a worn hat/glasses/etc. again takes it off.
  equip(id) {
    const item = this.find(id);
    if (!item || !this.owns(id)) return false;
    let L = this.look();
    if (this.SLOTS.includes(item.kind) && L[item.kind] === id) L[item.kind] = null;
    else L = this.withItem(L, item);
    RR.storage.set("shop:look", L);
    this.drawBadge();
    return true;
  },

  // Repaint an owned hat/glasses/neck/back item. paintId null = back to its original color.
  // Each item keeps its own paint, even when you take it off.
  setPaint(itemId, paintId) {
    if (!this.owns(itemId)) return false;
    const L = this.look();
    L.paint = Object.assign({}, L.paint);
    if (paintId) L.paint[itemId] = paintId; else delete L.paint[itemId];
    RR.storage.set("shop:look", L);
    this.drawBadge();
    return true;
  },

  // The dino's name is built from two word lists (no typing, so no real names). Saved as shop:name.
  nameParts() {
    const P = RR.data.shop.nameParts, saved = RR.storage.get("shop:name", null);
    const ok = saved && P.first.includes(saved.first) && P.second.includes(saved.second);
    return ok ? saved : { first: "", second: "Chomp" };
  },
  name() { const n = this.nameParts(); return (n.first ? n.first + " " : "") + n.second; },
  setName(first, second) {
    RR.storage.set("shop:name", { first, second });
    this.drawBadge();
  },
  randomName() {
    const P = RR.data.shop.nameParts, pick = list => list[Math.floor(Math.random() * list.length)];
    this.setName(pick(P.first), pick(P.second));
  },

  // Small picture of your dino in the top bar
  drawBadge() {
    const a = document.getElementById("meBadge");
    if (!a) return;
    a.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true">${RR.art.dinoHead(this.look())}</svg>`;
    a.title = this.name();
    a.setAttribute("aria-label", this.name() + ": open the Dino Shop");
  }
};
