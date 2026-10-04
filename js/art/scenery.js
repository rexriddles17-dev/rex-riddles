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

  RR.art.palm = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M0 0 Q-4 -40 6 -78" fill="none" stroke="#8A5A2E" stroke-width="9" stroke-linecap="round"/>
      <path d="M-2 -12 h7 M-1 -28 h7 M1 -44 h7 M3 -60 h7" stroke="#6B4423" stroke-width="2"/>
      <g fill="#3E8E4F">
        <path d="M6 -78 Q-20 -96 -44 -80 Q-20 -86 6 -74Z"/>
        <path d="M6 -78 Q30 -100 54 -84 Q30 -88 6 -74Z"/>
        <path d="M6 -78 Q-14 -76 -30 -56 Q-10 -70 6 -74Z"/>
        <path d="M6 -78 Q28 -76 42 -54 Q22 -70 6 -74Z"/>
        <path d="M6 -78 Q4 -104 22 -112 Q10 -96 8 -76Z"/>
      </g>
    </g>`;

  RR.art.fern = (x, y, s = 1, color = "#4CAF62") => `
    <g transform="translate(${x} ${y}) scale(${s})" fill="${color}">
      <path d="M0 0 Q-30 -10 -40 -34 Q-20 -24 0 -4Z"/>
      <path d="M0 0 Q30 -12 38 -38 Q18 -26 0 -4Z"/>
      <path d="M0 0 Q-10 -30 4 -50 Q6 -28 2 -2Z"/>
      <path d="M0 0 Q-20 -2 -30 -14 Q-12 -10 0 -2Z" opacity=".8"/>
    </g>`;

  RR.art.cloud = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".9">
      <ellipse cx="0" cy="0" rx="22" ry="10"/><ellipse cx="-12" cy="-6" rx="11" ry="9"/><ellipse cx="8" cy="-9" rx="13" ry="11"/>
    </g>`;

  const volcano = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <circle cx="4" cy="-96" r="10" fill="#d8cfc4" opacity=".8"/><circle cx="14" cy="-110" r="13" fill="#e6ded4" opacity=".7"/>
      <circle cx="2" cy="-124" r="9" fill="#efe9e1" opacity=".6"/>
      <path d="M-60 0 L-14 -80 L14 -80 L60 0Z" fill="#8A5A2E" ${line}/>
      <path d="M-14 -80 L14 -80 L10 -70 L-10 -70Z" fill="#FF7A1A"/>
      <path d="M-8 -72 Q-14 -56 -10 -44 Q-4 -50 -2 -60 Q2 -46 8 -40 Q12 -56 6 -72Z" fill="#FF7A1A"/>
      <path d="M-40 -10 L-20 -46 M30 -18 L18 -50" stroke="#6B4423" stroke-width="3" stroke-linecap="round"/>
    </g>`;
  RR.art.volcano = volcano;

  RR.art.heroScene = () => `
    <svg class="hero-scene" viewBox="0 0 400 170" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path d="M0 110 Q60 70 120 96 T240 88 T400 80 V170 H0Z" fill="#A8D8B9"/>
      ${volcano(300, 112, .85)}
      ${RR.art.cloud(70, 30, 1)}${RR.art.cloud(210, 18, .7)}
      <path d="M0 128 Q80 108 170 124 T400 116 V170 H0Z" fill="#7CC24E"/>
      ${RR.art.palm(30, 140, .8)}${RR.art.palm(372, 136, .7)}
      <path d="M0 146 Q100 132 200 146 T400 142 V170 H0Z" fill="#5FAE3E"/>
      <g class="hero-rexy">
        <ellipse cx="208" cy="161" rx="44" ry="6" fill="#2F6F3D" opacity=".35"/>
        <g transform="translate(150 50) scale(.6)">${RR.art.dinoBody(RR.player.look())}</g>
      </g>
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
      ${footprint(50, 62, .75, "#4CAF62")}`
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
