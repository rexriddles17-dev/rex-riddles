/*
 * Scenery, game badges and small icons (original art).
 *   RR.art.palm(x, y, s), RR.art.fern(x, y, s), RR.art.cloud(x, y, s)  → pieces for scenes
 *   RR.art.heroScene()      → the jungle picture on the home screen
 *   RR.art.badges[gameId]   → picture for each home tile (100x100)
 *   RR.art.icons[name]      → bone, fern, volcano, meteor (100x100)
 */
(function () {
  const O = "#3B2614";
  const line = `stroke="${O}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;

  const f1 = n => n.toFixed(1);
  const rnd = (i, k) => { const h = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return h - Math.floor(h); };
  const bez = (a, c, b, t) => [(1 - t) ** 2 * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1]];

  /* A leafy frond: a stem curving from a (through control c) to b, with thin leaflets on both sides.
   * len = longest leaflet, droop = how much leaflets hang down. Returns path data for stroking. */
  function frond(a, c, b, len, droop, n = 16) {
    let d = `M${f1(a[0])} ${f1(a[1])} Q${f1(c[0])} ${f1(c[1])} ${f1(b[0])} ${f1(b[1])}`;
    for (let i = 1; i < n; i++) {
      const t = i / n, p = bez(a, c, b, t), q = bez(a, c, b, Math.min(1, t + .02));
      const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
      const l = len * Math.sin(Math.PI * Math.min(1, t * 1.1 + .05)) * (.8 + rnd(i, len) * .3);
      [-1, 1].forEach(side => {
        const ex = p[0] + (-uy * side * .8 + ux * .6) * l, ey = p[1] + (ux * side * .8 + uy * .6) * l + droop * l;
        d += ` M${f1(p[0])} ${f1(p[1])} Q${f1((p[0] + ex) / 2 - uy * side * l * .1)} ${f1((p[1] + ey) / 2 - l * .2)} ${f1(ex)} ${f1(ey)}`;
      });
    }
    return d;
  }
  const leaves = (d, col, w) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;

  RR.art.palm = (x, y, s = 1) => {
    const top = [6, -78];
    const fr = [[-50, -78, -22, -104], [56, -82, 30, -106], [-36, -50, -16, -84], [44, -50, 26, -84], [18, -116, 0, -112], [-14, -116, -20, -100], [62, -64, 40, -92]];
    const back = fr.slice(0, 3).map(([bx, by, cx, cy]) => leaves(frond(top, [cx, cy], [bx, by], 15, .45, 14), "#2E6B33", 2.6)).join("");
    const front = fr.slice(3).concat(fr.slice(0, 2)).map(([bx, by, cx, cy], i) =>
      leaves(frond(top, [cx, cy + 3], [bx * .92, by + 4], 13, .5, 14), i % 2 ? "#4A9447" : "#3E8540", 2.2)).join("");
    const rings = [...Array(9)].map((_, i) => { const t = (i + .5) / 9, p = bez([0, 0], [-4, -40], top, t);
      return `M${f1(p[0] - 5 + t * 1.5)} ${f1(p[1])} q${f1(5 - t * 1.5)} 2.6 ${f1(10 - t * 3)} -.5`; }).join(" ");
    return `
    <g transform="translate(${x} ${y}) scale(${s})">
      <defs><linearGradient id="palmTrunk" x1="0" x2="1"><stop offset="0" stop-color="#A57A4E"/><stop offset=".55" stop-color="#8A5E36"/><stop offset="1" stop-color="#5E3E22"/></linearGradient></defs>
      ${back}
      <path d="M-5.5 0 Q-9 -40 2 -78 L10 -78 Q1 -40 5.5 0Z" fill="url(#palmTrunk)" stroke="#4A2F18" stroke-width="1"/>
      <path d="${rings}" fill="none" stroke="#4A2F18" stroke-width="1.2" opacity=".7"/>
      <circle cx="2" cy="-74" r="4" fill="#5A3A1E"/><circle cx="9" cy="-73" r="3.6" fill="#4A2F18"/><circle cx="5" cy="-70" r="3.4" fill="#6B4423"/>
      ${front}
    </g>`;
  };

  RR.art.fern = (x, y, s = 1, color = "#4CAF62") => {
    const dark = RR.art.shade(color, -.3);
    const fr = [[-44, -30, -26, -40], [42, -34, 24, -46], [-8, -56, -14, -36], [10, -54, 14, -36], [-30, -6, -24, -22], [32, -8, 24, -24]];
    return `<g transform="translate(${x} ${y}) scale(${s})">
      ${fr.map(([bx, by, cx, cy], i) => leaves(frond([0, 0], [cx, cy], [bx, by], 7, .3, 12), i < 2 ? dark : color, 1.8)).join("")}
    </g>`;
  };

  // fluffy cloud: bright top, soft blue-grey shadow underneath, blurred edges
  RR.art.cloud = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <defs>
        <linearGradient id="cloudG" x1="0" y1="0" x2="0" y2="1"><stop offset=".3" stop-color="#fff"/><stop offset="1" stop-color="#C9D8E6"/></linearGradient>
        <filter id="cloudSoft" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation=".9"/></filter>
      </defs>
      <g fill="url(#cloudG)" filter="url(#cloudSoft)">
        <ellipse cx="0" cy="0" rx="24" ry="9"/><ellipse cx="-12" cy="-5" rx="11" ry="9"/><ellipse cx="7" cy="-8" rx="13" ry="11"/><ellipse cx="18" cy="-2" rx="8" ry="7"/>
      </g>
      <ellipse cx="2" cy="-12" rx="7" ry="3.5" fill="#fff" opacity=".8" filter="url(#cloudSoft)"/>
    </g>`;

  const volcano = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <defs>
        <linearGradient id="volG" x1="0" x2="1"><stop offset="0" stop-color="#9A7656"/><stop offset=".5" stop-color="#7A5A40"/><stop offset="1" stop-color="#4E3828"/></linearGradient>
        <linearGradient id="volTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E2420" stop-opacity=".8"/><stop offset="1" stop-color="#2E2420" stop-opacity="0"/></linearGradient>
        <radialGradient id="lavaGlow"><stop offset="0" stop-color="#FFB040" stop-opacity=".8"/><stop offset="1" stop-color="#FF5A00" stop-opacity="0"/></radialGradient>
        <filter id="smokeSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <g filter="url(#smokeSoft)">
        <circle cx="4" cy="-94" r="11" fill="#bdb3a8" opacity=".75"/><circle cx="16" cy="-110" r="15" fill="#d4ccc2" opacity=".65"/>
        <circle cx="6" cy="-128" r="12" fill="#e6e0d8" opacity=".55"/><circle cx="24" cy="-138" r="10" fill="#efebe5" opacity=".45"/>
      </g>
      <circle cx="0" cy="-82" r="22" fill="url(#lavaGlow)"/>
      <path d="M-62 0 Q-40 -30 -16 -78 Q0 -82 14 -79 Q38 -34 62 0Z" fill="url(#volG)" stroke="#3B2614" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M-30 -48 Q-16 -78 -16 -78 Q0 -82 14 -79 Q26 -60 30 -48 Q0 -40 -30 -48Z" fill="url(#volTop)"/>
      <path d="M-46 -6 Q-36 -24 -26 -40 M-20 -4 Q-14 -26 -12 -44 M22 -6 Q16 -30 10 -52 M44 -8 Q32 -24 24 -40" fill="none" stroke="#3E2A1C" stroke-width="1.6" opacity=".45" stroke-linecap="round"/>
      <path d="M-14 -79 Q0 -84 14 -79 L10 -73 Q0 -76 -10 -73Z" fill="#FF8A1A"/>
      <path d="M-7 -75 Q-13 -58 -9 -44 Q-4 -50 -2 -60 Q2 -46 8 -38 Q12 -56 6 -75Z" fill="#FF6A10"/>
      <path d="M-5 -74 Q-8 -62 -6 -54 M5 -74 Q8 -60 7 -48" fill="none" stroke="#FFD23F" stroke-width="1.6" stroke-linecap="round"/>
    </g>`;
  RR.art.volcano = volcano;

  // little clumps of grass blades along a ground line
  const tufts = (y, n, col, seed, h = 7) => `<path d="${[...Array(n)].map((_, i) => {
      const x = (i + rnd(i, seed)) * 400 / n, hh = h * (.6 + rnd(i, seed + 1) * .6);
      return `M${f1(x)} ${y} q-1 ${f1(-hh * .6)} -3 ${f1(-hh)} M${f1(x)} ${y} q.5 ${f1(-hh * .7)} 1 ${f1(-hh * 1.1)} M${f1(x)} ${y} q1.5 ${f1(-hh * .5)} 4 ${f1(-hh * .85)}`;
    }).join(" ")}" fill="none" stroke="${col}" stroke-width="1.2" stroke-linecap="round"/>`;

  RR.art.heroScene = () => `
    <svg class="hero-scene" viewBox="0 0 400 170" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="hsFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC9B4"/><stop offset="1" stop-color="#C4E3D2"/></linearGradient>
        <linearGradient id="hsMid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86B65A"/><stop offset="1" stop-color="#6A9E42"/></linearGradient>
        <linearGradient id="hsNear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E9A3A"/><stop offset="1" stop-color="#3E7428"/></linearGradient>
        <radialGradient id="hsSun"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".25" stop-color="#FFF0A8" stop-opacity=".8"/><stop offset="1" stop-color="#FFF0A8" stop-opacity="0"/></radialGradient>
      </defs>
      <circle cx="350" cy="28" r="46" fill="url(#hsSun)"/>
      <path d="M0 104 Q40 84 80 96 Q120 70 170 92 Q220 78 260 90 Q320 72 400 86 V170 H0Z" fill="#B7D8D0" opacity=".8"/>
      <path d="M0 110 Q60 76 120 96 T240 88 T400 82 V170 H0Z" fill="url(#hsFar)"/>
      ${volcano(300, 112, .85)}
      ${RR.art.cloud(70, 30, 1)}${RR.art.cloud(210, 18, .7)}${RR.art.cloud(150, 44, .45)}
      <path d="M0 128 Q80 108 170 124 T400 116 V170 H0Z" fill="url(#hsMid)"/>
      ${tufts(130, 40, "#5C8F38", 3, 5)}
      ${RR.art.palm(30, 140, .8)}${RR.art.palm(372, 136, .7)}${RR.art.palm(345, 132, .5)}
      <path d="M0 146 Q100 132 200 146 T400 142 V170 H0Z" fill="url(#hsNear)"/>
      <ellipse cx="62" cy="150" rx="12" ry="5" fill="#857D70"/><ellipse cx="60" cy="148" rx="9" ry="3.5" fill="#A39B8C"/>
      <g class="hero-rexy">
        <ellipse cx="208" cy="161" rx="46" ry="6" fill="#1E4A20" opacity=".45"/>
        <g transform="translate(150 50) scale(.6)">${RR.art.dinoBody(RR.player.look())}</g>
      </g>
      ${tufts(170, 60, "#2F5E22", 7, 9)}
      ${RR.art.fern(120, 166, .8)}${RR.art.fern(290, 168, .9, "#3E8E4F")}${RR.art.fern(20, 170, .7, "#3E8E4F")}${RR.art.fern(386, 170, .7)}
      <ellipse cx="100" cy="156" rx="10" ry="13" fill="#FFF6DC" ${line}/>
      <path d="M91 154 l3 -4 3 4 3 -4 3 4 3 -4" fill="none" stroke="${O}" stroke-width="1.8"/>
    </svg>`;

  /* ---------- Small icons for Sudoku pieces (100x100) ---------- */
  RR.art.icons = {
    bone: `
      <g transform="rotate(-30 50 50)">
        <path d="M28 42 H72 Q74 30 84 30 Q94 32 92 42 Q100 48 92 56 Q94 68 84 68 Q74 68 72 58 H28 Q26 68 16 68 Q6 68 8 58 Q0 50 8 42 Q6 30 16 30 Q26 30 28 42Z" fill="#FFF6DC" ${line}/>
        <path d="M32 46 H66" stroke="#e6d6b4" stroke-width="4" stroke-linecap="round"/>
      </g>`,
    fern: `
      <path d="M50 94 Q48 60 56 12" fill="none" stroke="#2F6F3D" stroke-width="4" stroke-linecap="round"/>
      ${[[86, 1], [72, .9], [58, .8], [44, .7], [30, .55]].map(([y, s]) => `
        <path d="M${50 + (94 - y) * .07} ${y} q-${30 * s} -2 -${36 * s} -${16 * s} q${22 * s} -2 ${36 * s} ${12 * s}Z" fill="#4CAF62" ${line} stroke-width="2"/>
        <path d="M${50 + (94 - y) * .07} ${y} q${30 * s} -6 ${36 * s} -${22 * s} q-${22 * s} 2 -${36 * s} ${18 * s}Z" fill="#6BBF59" ${line} stroke-width="2"/>`).join("")}
      <path d="M56 12 q-8 2 -6 10 q8 -2 6 -10Z" fill="#6BBF59" ${line} stroke-width="2"/>`,
    volcano: `<g transform="translate(50 92) scale(.72)">${volcano(0, 0, 1)}</g>`,
    meteor: `
      <path d="M14 14 L54 54" stroke="#FFB347" stroke-width="26" stroke-linecap="round" opacity=".55"/>
      <path d="M22 22 L54 54" stroke="#FFE27A" stroke-width="12" stroke-linecap="round"/>
      <circle cx="60" cy="60" r="24" fill="#6B4A2E" ${line}/>
      <circle cx="52" cy="54" r="5" fill="#4a321d"/><circle cx="68" cy="66" r="4" fill="#4a321d"/><circle cx="66" cy="50" r="2.5" fill="#4a321d"/>
      <path d="M46 70 Q54 80 68 80" fill="none" stroke="#8a6a48" stroke-width="3" stroke-linecap="round"/>`
  };

  /* ---------- Home tile badges (100x100) ---------- */
  const badgeBg = c => `<rect x="2" y="2" width="96" height="96" rx="24" fill="${c}" ${line}/>`;
  const footprint = (x, y, s, c) => `
    <g transform="translate(${x} ${y}) scale(${s})" fill="${c}">
      <ellipse cx="0" cy="8" rx="11" ry="13"/>
      <path d="M-8 -2 Q-22 -16 -18 -26 Q-10 -18 -3 -6Z"/><path d="M-3 -4 Q0 -24 4 -30 Q8 -20 4 -4Z"/>
      <path d="M3 -2 Q16 -14 20 -24 Q22 -12 8 -2Z"/>
    </g>`;

  RR.art.badges = {
    hangman: `
      ${badgeBg("#BFE8F2")}
      <clipPath id="bgHang"><rect x="3" y="3" width="94" height="94" rx="23"/></clipPath>
      <g clip-path="url(#bgHang)">
        <path d="M0 78 Q50 66 100 76 V100 H0Z" fill="#7CC24E"/>
        ${volcano(70, 80, .45)}
        <path d="M18 14 L52 46" stroke="#FFB347" stroke-width="14" stroke-linecap="round" opacity=".6"/>
        <path d="M24 20 L52 46" stroke="#FFE27A" stroke-width="7" stroke-linecap="round"/>
        <circle cx="54" cy="48" r="13" fill="#6B4A2E" ${line}/>
        <circle cx="50" cy="45" r="3" fill="#4a321d"/><circle cx="58" cy="52" r="2" fill="#4a321d"/>
        <g transform="translate(6 56) scale(.22)">${RR.art.rexyShapes}</g>
      </g>`,
    detective: `
      ${badgeBg("#FFE27A")}
      ${footprint(42, 50, 1.3, "#C9A227")}
      <circle cx="56" cy="44" r="22" fill="#BFE8F2" fill-opacity=".55" stroke="${O}" stroke-width="6"/>
      <circle cx="56" cy="44" r="22" fill="none" stroke="#8A5A2E" stroke-width="3"/>
      <path d="M48 32 Q54 28 60 30" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <path d="M72 60 L88 78" stroke="${O}" stroke-width="12" stroke-linecap="round"/>
      <path d="M72 60 L88 78" stroke="#FF7A1A" stroke-width="7" stroke-linecap="round"/>`,
    sudoku: `
      ${badgeBg("#FFF6DC")}
      <rect x="12" y="12" width="76" height="76" rx="8" fill="#5A3A1E"/>
      ${[[0, 0, "rexy", "#4CAF62"], [1, 0, null, null], [0, 1, null, null], [1, 1, "brachio", "#7FB3D5"]].map(([i, j, sp, c]) =>
        `<rect x="${15 + i * 36}" y="${15 + j * 36}" width="34" height="34" rx="6" fill="${sp ? "#ecd394" : "#FFF6DC"}"/>
         ${sp ? `<svg x="${15 + i * 36}" y="${15 + j * 36}" width="34" height="34" viewBox="0 0 100 100">${RR.art.portrait(sp, c)}</svg>` : ""}`).join("")}
      <svg x="51" y="15" width="34" height="34" viewBox="0 0 100 100"><g transform="translate(10 10) scale(.8)">${RR.art.icons.bone}</g></svg>
      <svg x="15" y="51" width="34" height="34" viewBox="0 0 100 100"><g transform="translate(10 10) scale(.8)">${RR.art.icons.fern}</g></svg>`,
    trivia: `
      ${badgeBg("#D8C8F0")}
      <path d="M20 16 H80 Q90 16 90 26 V56 Q90 66 80 66 H48 L34 80 L36 66 H20 Q10 66 10 56 V26 Q10 16 20 16Z" fill="#fff" ${line}/>
      <text x="50" y="56" text-anchor="middle" font-family="Bungee, Arial Black, sans-serif" font-size="40" fill="#FF7A1A" stroke="${O}" stroke-width="2">?</text>
      <svg x="52" y="52" width="46" height="46" viewBox="0 0 100 100">${RR.art.portrait("rexy")}</svg>`,
    daily: `
      ${badgeBg("#FFD3C4")}
      <rect x="18" y="22" width="64" height="62" rx="8" fill="#fff" ${line}/>
      <path d="M18 30 Q18 22 26 22 H74 Q82 22 82 30 V40 H18Z" fill="#FF7A1A" ${line}/>
      <path d="M34 16 V28 M66 16 V28" ${line} stroke-width="5"/>
      ${footprint(50, 62, .75, "#4CAF62")}`,
    skate: `
      ${badgeBg("#BFE8F2")}
      <clipPath id="bgSkate"><rect x="3" y="3" width="94" height="94" rx="23"/></clipPath>
      <g clip-path="url(#bgSkate)">
        <path d="M0 84 H100 V100 H0Z" fill="#C9A26B"/><path d="M0 82 H100 V87 H0Z" fill="#7CC24E"/>
        <path d="M6 40 H18 M2 52 H16 M8 64 H18" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
        <g transform="translate(16 4) scale(.36)">${RR.art.rexyShapes}</g>
        <path d="M24 74 Q20 70 22 69 L26 72 H78 L82 69 Q84 70 80 74Z" fill="#FF7A1A" ${line} stroke-width="2"/>
        <circle cx="34" cy="78" r="4" fill="#3B3F4A" ${line} stroke-width="1.5"/><circle cx="70" cy="78" r="4" fill="#3B3F4A" ${line} stroke-width="1.5"/>
        <ellipse cx="86" cy="30" rx="7" ry="9" fill="#FFD23F" ${line} stroke-width="2"/>
      </g>`
  };

})();

/* The Dino Shop tile shows your own dino, so it is drawn fresh each time. */
Object.defineProperty(RR.art.badges, "shop", {
  get() {
    return `<rect x="2" y="2" width="96" height="96" rx="24" fill="#FFE27A" stroke="#3B2614" stroke-width="2.5"/>
      <clipPath id="bgShop"><rect x="3" y="3" width="94" height="94" rx="23"/></clipPath>
      <g clip-path="url(#bgShop)"><circle cx="50" cy="54" r="38" fill="#DCEFF4"/>
        <svg x="4" y="8" width="92" height="92" viewBox="0 0 100 100">${RR.art.dinoHead(RR.player.look())}</svg></g>
      <path d="M70 10 l3 7 7 0 -6 4 2 7 -6 -4 -6 4 2 -7 -6 -4 7 0Z" fill="#FF7A1A" stroke="#3B2614" stroke-width="1.5"/>`;
  },
  enumerable: true
});
