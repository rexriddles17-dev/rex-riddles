/*
 * Gobble Fest (Thanksgiving) art. Original SVG, same bold style as scenery.js.
 *   RR.art.harvest[name]            → 100x100 pictures: pumpkin, pie, corn, apple, leaf, acorn, cranberry, turkey, pinecone
 *   RR.art.badges.harvest / .feast  → home tiles for the event games
 *   RR.art.harvestProps()           → pumpkins, hay and corn added to the home hero during the event
 *   RR.art.eventDecor.thanksgiving()→ leaves drifting down the page behind everything
 */
(function () {
  const O = "#3B2614";
  const line = `stroke="${O}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
  const badgeBg = c => `<rect x="2" y="2" width="96" height="96" rx="24" fill="${c}" ${line}/>`;

  const pumpkin = (c = "#E8792B", d = "#C45A1C") => `
    <path d="M50 26 q0 -10 8 -16" stroke="#5A6A2A" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="32" cy="58" rx="22" ry="28" fill="${d}" ${line}/><ellipse cx="68" cy="58" rx="22" ry="28" fill="${d}" ${line}/>
    <ellipse cx="50" cy="58" rx="20" ry="31" fill="${c}" ${line}/>
    <path d="M42 38 q-5 18 0 38" stroke="#FFB070" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M58 14 q16 -6 22 6 q-14 6 -22 -6Z" fill="#6BA03E" stroke="${O}" stroke-width="2"/>`;

  // Maple leaf, around 0,0, about 70 wide
  const mapleD = "M0 34 L2 18 Q14 26 22 22 L18 14 Q30 10 34 -2 L24 -2 Q28 -14 26 -24 Q16 -16 10 -18 L10 -28 Q4 -26 0 -38 Q-4 -26 -10 -28 L-10 -18 Q-16 -16 -26 -24 Q-28 -14 -24 -2 L-34 -2 Q-30 10 -18 14 L-22 22 Q-14 26 -2 18 L-2 34Z";
  const maple = (c, veins = true) => `<path d="${mapleD}" fill="${c}" ${line}/>` +
    (veins ? `<path d="M0 30 V-30 M0 4 L22 -14 M0 4 L-22 -14 M0 14 L18 14 M0 14 L-18 14" stroke="${O}" stroke-width="1.6" opacity=".45" fill="none"/>` : "");

  RR.art.maple = (c = "#E0632B") => `<svg viewBox="-40 -40 80 80" aria-hidden="true">${maple(c)}</svg>`;

  RR.art.harvest = {
    pumpkin: pumpkin(),
    pie: `
      <path d="M8 58 L92 58 L84 80 Q50 88 16 80Z" fill="#D9A55A" ${line}/>
      <path d="M8 58 Q12 40 50 36 Q88 40 92 58 Q50 66 8 58Z" fill="#D9762B" ${line}/>
      <path d="M10 58 Q50 68 90 58" fill="none" stroke="#F2C27A" stroke-width="7" stroke-linecap="round"/>
      <path d="M14 60 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0" fill="none" stroke="${O}" stroke-width="1.4"/>
      <ellipse cx="50" cy="44" rx="11" ry="5" fill="#FFF6E8" ${line} stroke-width="2"/><ellipse cx="47" cy="42" rx="4" ry="1.6" fill="#fff"/>
      <path d="M30 48 q8 -4 14 -2" stroke="#F09A50" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    corn: `
      <path d="M50 92 Q26 80 22 46 Q34 64 48 70Z" fill="#7DAE3E" ${line}/><path d="M50 92 Q74 80 78 46 Q66 64 52 70Z" fill="#5E9A35" ${line}/>
      <path d="M50 10 Q66 12 66 44 Q66 76 50 84 Q34 76 34 44 Q34 12 50 10Z" fill="#F2C230" ${line}/>
      ${[...Array(7)].map((_, r) => [...Array(3)].map((_, c) =>
        `<ellipse cx="${42 + c * 8}" cy="${22 + r * 9}" rx="3.4" ry="3.8" fill="${(r + c) % 2 ? "#F7D85A" : "#E3A923"}"/>`).join("")).join("")}
      <path d="M50 92 Q40 74 40 56 Q46 70 50 76Z" fill="#9BC04E" ${line} stroke-width="2"/>`,
    apple: `
      <path d="M50 28 Q30 14 18 34 Q6 60 26 82 Q38 94 50 86 Q62 94 74 82 Q94 60 82 34 Q70 14 50 28Z" fill="#D63B3B" ${line}/>
      <path d="M30 34 Q22 46 26 60" stroke="#F08A8A" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M50 28 Q50 16 56 8" stroke="#6B4423" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M54 16 Q70 4 82 14 Q70 26 54 16Z" fill="#6BA03E" stroke="${O}" stroke-width="2"/>`,
    leaf: `<g transform="translate(50 50) rotate(-12)">${maple("#E0632B")}</g>`,
    acorn: `
      <path d="M28 46 Q28 84 50 92 Q72 84 72 46Z" fill="#C88A44" ${line}/>
      <path d="M36 52 Q36 76 48 84" stroke="#E2B070" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M20 48 Q20 24 50 22 Q80 24 80 48 Q50 56 20 48Z" fill="#7A4A26" ${line}/>
      <path d="M28 40 l6 -6 M38 36 l6 -6 M50 34 l6 -6 M62 36 l6 -6 M30 46 l6 -6 M44 44 l6 -6 M58 44 l6 -6" stroke="#4E2E16" stroke-width="2" stroke-linecap="round"/>
      <path d="M50 22 Q50 12 58 8" stroke="#4E2E16" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    cranberry: `
      ${[[34, 58, 17], [64, 56, 17], [50, 34, 16], [48, 76, 15]].map(([x, y, r]) => `
        <circle cx="${x}" cy="${y}" r="${r}" fill="#B3243A" ${line}/>
        <circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .3}" fill="#F07A8A" opacity=".8"/>
        <path d="M${x - 2} ${y + r * .6} l2 -3 2 3" stroke="#5A0F1C" stroke-width="1.6" fill="none"/>`).join("")}
      <path d="M50 18 Q60 6 74 10 Q66 22 50 18Z" fill="#6BA03E" stroke="${O}" stroke-width="2"/>`,
    pinecone: `
      <path d="M50 8 Q72 24 72 52 Q70 80 50 94 Q30 80 28 52 Q28 24 50 8Z" fill="#6B4423" ${line}/>
      ${[[50, 22], [40, 34], [60, 34], [50, 46], [36, 50], [64, 50], [44, 62], [56, 62], [50, 76], [38, 72], [62, 72]].map(([x, y]) =>
        `<path d="M${x - 8} ${y} Q${x} ${y + 9} ${x + 8} ${y}" fill="#9A6A3A" ${line} stroke-width="2"/>`).join("")}
      <path d="M50 8 V2" stroke="#4E2E16" stroke-width="4" stroke-linecap="round"/>`
  };
  // the Turkey dino's own head, so the cards match the shop
  Object.defineProperty(RR.art.harvest, "turkey", {
    enumerable: true,
    get: () => `<rect x="0" y="0" width="100" height="100" fill="none"/>` + RR.art.dinoHead({ species: "turkey", color: "natural" })
  });

  RR.art.badges.harvest = `
    ${badgeBg("#FFE0B0")}
    <g transform="translate(14 22) rotate(-10) scale(.42)"><rect x="0" y="0" width="80" height="100" rx="12" fill="#6B3A1E" ${line} stroke-width="5"/>
      <path d="M14 14 h52 v72 h-52Z" fill="none" stroke="#E8A040" stroke-width="5" stroke-dasharray="8 6"/></g>
    <g transform="translate(48 18) rotate(10) scale(.42)"><rect x="0" y="0" width="80" height="100" rx="12" fill="#FFF6DC" ${line} stroke-width="5"/>
      <g transform="translate(-10 0)">${pumpkin()}</g></g>
    <g transform="translate(26 52) scale(.36)">${RR.art.harvest.leaf}</g>`;

  RR.art.badges.feast = `
    ${badgeBg("#FFD39A")}
    <clipPath id="bgFeast"><rect x="3" y="3" width="94" height="94" rx="23"/></clipPath>
    <g clip-path="url(#bgFeast)">
      <path d="M0 78 Q50 70 100 78 V100 H0Z" fill="#C9A24A"/>
      <g transform="translate(22 44) scale(.27)">${RR.art.dinoBody({ species: "turkey", color: "natural" })}</g>
      <g transform="translate(12 6) scale(.28)">${RR.art.harvest.corn}</g>
      <g transform="translate(62 10) scale(.3)">${RR.art.harvest.apple}</g>
      <g transform="translate(70 40) scale(.24)">${RR.art.harvest.pie}</g>
    </g>`;

  /* Fall things for the home hero (viewBox 0 0 400 170) */
  RR.art.harvestProps = () => `
    <g class="hero-harvest">
      <g transform="translate(14 136)"><rect x="0" y="0" width="54" height="30" rx="5" fill="#E2B85A" ${line}/>
        <path d="M6 8 h42 M6 16 h42 M6 24 h42" stroke="#B8893A" stroke-width="2"/><path d="M18 0 v30 M36 0 v30" stroke="#8A5A2E" stroke-width="3"/></g>
      <g transform="translate(36 108) scale(.32)">${pumpkin()}</g>
      <g transform="translate(300 134) scale(.34)">${pumpkin()}</g>
      <g transform="translate(326 146) scale(.24)">${pumpkin("#F2A040", "#D27A28")}</g>
      <g transform="translate(276 152) scale(.18)">${RR.art.harvest.acorn}</g>
      ${[[110, 60, 20, "#E0632B"], [250, 40, -30, "#F2A93B"], [340, 70, 40, "#C0392B"], [60, 50, -15, "#E8C23A"]].map(([x, y, r, c]) =>
        `<g class="hero-leaf" transform="translate(${x} ${y}) rotate(${r}) scale(.14)">${maple(c, false)}</g>`).join("")}
    </g>`;

  /* Leaves drifting down the page */
  RR.art.eventDecor = RR.art.eventDecor || {};
  RR.art.eventDecor.thanksgiving = () => {
    const colors = ["#C0392B", "#E0632B", "#F2A93B", "#B5651D", "#E8C23A", "#8E2B3A"];
    return [...Array(12)].map((_, i) =>
      `<svg class="ev-leaf" style="--x:${(i * 8.3 + 3) % 100}vw;--d:${11 + (i * 7) % 9}s;--w:${-(i * 3.1) % 14}s;--s:${.5 + (i % 4) * .18}"
        viewBox="-40 -40 80 80" width="40" height="40">${maple(colors[i % colors.length], false)}</svg>`).join("");
  };
})();
