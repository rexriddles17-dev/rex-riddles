/* ===== Dino Shop =====
 * Spend XP on new dinos, colors, hats, glasses, neckwear and capes.
 * Tap anything to try it on; buy it if you have enough XP; tap owned things to wear them.
 */
(function () {
  let el, tab = "species", previewId = null, st = null, shown = null, shownKey = "";
  const P = () => RR.player;
  const TABS = [["species", "Dinos", "🦖"], ["color", "Colors", "🎨"], ["hat", "Hats", "🎩"],
                ["eyes", "Glasses", "🕶️"], ["neck", "Neck", "🎀"], ["back", "Back", "🦸"]];

  const stage = look => `
    <svg viewBox="-20 -45 240 240" role="img" aria-label="Your dino">
      <defs><linearGradient id="shopSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3e8"/><stop offset="1" stop-color="#d4f0f6"/></linearGradient></defs>
      <rect x="-20" y="-45" width="240" height="240" fill="url(#shopSky)"/>
      ${RR.art.cloud(10, -15, .8)}${RR.art.cloud(170, -28, .6)}
      <path d="M-20 170 Q60 158 120 168 T220 164 V195 H-20Z" fill="#7CC24E"/>
      <ellipse cx="110" cy="187" rx="70" ry="6" fill="#2F6F3D" opacity=".35"/>
      <g class="shop-dino">${RR.art.dinoBody(look)}</g>
      ${RR.art.fern(-6, 196, .7, "#3E8E4F")}${RR.art.fern(214, 196, .7)}
    </svg>`;

  // Picture on each card: the item on your dino (capes show the whole dino)
  function cardArt(item) {
    const look = P().withItem(P().look(), item);
    if (RR.d3.ok()) return `<img class="shop-pic ${item.kind === "back" || item.kind === "species" ? "body" : ""}" src="${
      RR.d3.dinoPicture(look, item.kind === "back" || item.kind === "species" ? "body" : "head", 152)}" alt="">`;
    return item.kind === "back"
      ? `<svg viewBox="-40 -10 260 210" aria-hidden="true">${RR.art.dinoBody(look)}</svg>`
      : `<svg viewBox="0 0 100 100" aria-hidden="true">${RR.art.dinoHead(look)}</svg>`;
  }

  const nameSelect = (id, list, current, blank) =>
    `<select class="shop-select" id="${id}" aria-label="Dino name part">${list.map(w =>
      `<option value="${w}" ${w === current ? "selected" : ""}>${w || blank}</option>`).join("")}</select>`;

  // Color choices under the stage: skin colors on the Dinos tab, paints for the item you're wearing
  function paintRow(look) {
    if (tab === "species") {
      return `<div class="shop-paint"><span class="shop-paint-label">🎨 Skin color</span><div class="shop-swatches">
        ${RR.data.shop.colors.map(c => {
          const owned = P().owns(c.id);
          return `<button class="shop-swatch ${look.color === c.id ? "on" : ""} ${owned ? "" : "locked"}" data-skin="${c.id}"
            style="background:${c.hex}" aria-label="${c.name}${owned ? "" : `, ${c.price} XP`}" title="${c.name}">${owned ? "" : "🔒"}</button>`;
        }).join("")}</div></div>`;
    }
    const worn = look[tab];
    if (!P().SLOTS.includes(tab) || !worn) return "";
    const cur = look.paint[worn];
    return `<div class="shop-paint"><span class="shop-paint-label">🎨 Paint your ${P().find(worn).name}</span><div class="shop-swatches">
      <button class="shop-swatch reset ${cur ? "" : "on"}" data-paint="" aria-label="Original color" title="Original color">↺</button>
      ${RR.data.shop.paints.map(p => `<button class="shop-swatch ${cur === p.id ? "on" : ""}" data-paint="${p.id}"
        style="background:${p.hex}" aria-label="${p.name}" title="${p.name}"></button>`).join("")}</div></div>`;
  }

  // The live 3D stage survives re-renders: it moves into the new .shop-3d box and swaps the dino
  function show3d(look) {
    const T = THREE;
    if (!st) {
      st = RR.d3.stage(null, { height: w => Math.round(Math.min(420, w * .92)), drag: true, autoSpin: .35, fov: 30,
        onFrame: (dt, t) => { if (shown) shown.userData.anim(t); } });
      const ground = RR.d3.scenery.ground(3.2); st.scene.add(ground);
      [[-2.3, -1.4, .8], [2.4, -1.2, .7, "#5FAE3E"]].forEach(([x, z, s, c]) => { const f = RR.d3.scenery.fern(s, c); f.position.set(x, 0, z); st.scene.add(f); });
      st.spin = new T.Group(); st.scene.add(st.spin);
      st.yaw = -.6;
    }
    st.mount(el.querySelector(".shop-3d"));
    const key = JSON.stringify(look);
    if (key !== shownKey) {
      if (shown) { st.spin.remove(shown); RR.d3.disposeTree(shown); }
      shown = RR.d3.dino(look); shownKey = key;
      const bb = new T.Box3().setFromObject(shown), c = bb.getCenter(new T.Vector3());
      shown.children[0].position.x = -c.x;
      st.spin.add(shown);
      const h = bb.max.y, len = bb.max.x - bb.min.x;
      const d = Math.max(h * 2.3, len * 1.9, 7);
      st.camera.position.set(0, h * .55 + 1.2, d);
      st.camera.lookAt(0, h * .45, 0);
    }
    st.start();
  }

  function actionHTML(item) {
    if (!item) return `<p>Tap something below to try it on!</p>`;
    const slotItem = P().SLOTS.includes(item.kind);
    if (P().owns(item.id)) {
      if (P().isWearing(item.id)) return slotItem
        ? `<p>You're wearing the <b>${item.name}</b>.</p><button class="big-btn shop-off" data-act="equip">Take it off</button>`
        : `<p>Your dino is <b>${item.name}</b>. Looking good!</p>`;
      return `<p><b>${item.name}</b> is yours!</p><button class="big-btn" data-act="equip">Wear it!</button>`;
    }
    const need = item.price - P().balance();
    return need > 0
      ? `<p><b>${item.name}</b> costs ⭐ ${item.price} XP.</p><p class="shop-need">You need ${need} more XP. Play games to earn it!</p>`
      : `<p><b>${item.name}</b> costs ⭐ ${item.price} XP.</p><button class="big-btn" data-act="buy">Buy for ${item.price} XP</button>`;
  }

  function render() {
    const look = P().look();
    const item = previewId ? P().find(previewId) : null;
    const items = P().catalog().filter(x => x.kind === tab);

    el.innerHTML = `
      <a class="back" href="#/">‹ Back to games</a>
      <div class="shop-top">
        <h2 class="screen-title">Dino Shop</h2>
        <span class="shop-balance">⭐ <b>${P().balance()}</b> XP to spend</span>
      </div>
      <p class="shop-note">Earn XP by playing games. Spending XP never lowers your rank!</p>
      <div class="shop-stage">${RR.d3.ok() ? `<div class="shop-3d" aria-label="Your dino. Drag to spin it."></div><span class="shop-spin">↻ Drag to spin</span>` : stage(item ? P().withItem(look, item) : look)}
        <span class="shop-dino-name">${P().name()}</span></div>
      <div class="shop-naming">
        <span class="shop-naming-label">Name:</span>
        ${nameSelect("nFirst", RR.data.shop.nameParts.first, P().nameParts().first, "(no title)")}
        ${nameSelect("nSecond", RR.data.shop.nameParts.second, P().nameParts().second)}
        <button class="shop-dice" id="nDice" aria-label="Pick a random name">🎲</button>
      </div>
      <div class="shop-action">${actionHTML(item)}</div>
      ${paintRow(look)}
      <div class="shop-tabs">${TABS.map(([id, label, icon]) =>
        `<button class="shop-tab ${id === tab ? "on" : ""}" data-tab="${id}"><span>${icon}</span>${label}</button>`).join("")}</div>
      <div class="shop-grid">${items.map(x => {
        const owned = P().owns(x.id), wearing = P().isWearing(x.id);
        const tag = wearing ? "Wearing" : owned ? "Owned ✓" : `⭐ ${x.price}`;
        const cls = [x.id === previewId ? "sel" : "", wearing ? "wearing" : "", !owned && x.price > P().balance() ? "pricey" : ""].join(" ");
        return `<button class="shop-card ${cls}" data-id="${x.id}">${cardArt(x)}<span class="shop-name">${x.name}</span><span class="shop-tag">${tag}</span></button>`;
      }).join("")}</div>`;
    if (RR.d3.ok()) show3d(item ? P().withItem(look, item) : look);
    RR.tilt(el);

    el.querySelectorAll(".shop-tab").forEach(b => b.onclick = () => { tab = b.dataset.tab; previewId = null; render(); });
    el.querySelectorAll(".shop-card").forEach(b => b.onclick = () => {
      const id = b.dataset.id;
      if (P().owns(id) && !P().isWearing(id)) { P().equip(id); previewId = id; }   // owned: just put it on
      else previewId = id;
      render();
      el.querySelector(".shop-stage").scrollIntoView({ behavior: "smooth", block: "center" });
    });
    el.querySelectorAll("[data-skin]").forEach(b => b.onclick = () => {
      const id = b.dataset.skin;
      if (P().owns(id)) { P().equip(id); previewId = null; } else previewId = id;   // locked: try it on
      render();
    });
    el.querySelectorAll("[data-paint]").forEach(b => b.onclick = () => {
      P().setPaint(look[tab], b.dataset.paint || null);
      render();
    });
    const setName = () => { P().setName(el.querySelector("#nFirst").value, el.querySelector("#nSecond").value); render(); };
    el.querySelector("#nFirst").onchange = el.querySelector("#nSecond").onchange = setName;
    el.querySelector("#nDice").onclick = () => { P().randomName(); render(); };
    const act = el.querySelector("[data-act]");
    if (act) act.onclick = () => {
      if (act.dataset.act === "buy" && P().buy(item.id)) {
        P().equip(item.id);
        RR.toast(`You got the ${item.name}! 🎉`);
      } else if (act.dataset.act === "equip") P().equip(item.id);
      render();
    };
  }

  RR.registerGame({
    id: "shop",
    section: "fun",
    title: "Dino Shop",
    icon: "🛍️",
    blurb: "Spend your XP on new dinos, colors, hats, shades and capes!",
    ready: true,
    mount(container) { el = container; tab = "species"; previewId = null; render(); },
    unmount() {
      previewId = null;
      if (st) { st.dispose(); st = null; shown = null; shownKey = ""; }
    }
  });
})();
