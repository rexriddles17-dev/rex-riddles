/*
 * Dino portraits (original art). Head-and-shoulders drawings on a 100x100 grid, facing right.
 *   RR.art.portrait(species, color)  → SVG shapes (no <svg> wrapper)
 *   RR.art.avatar(dino)              → round avatar for a suspect { name, color, icon }
 * Species: trex raptor compy micro galli spino ptero brachio bronto trike stego anky para pachy
 */
(function () {
  const O = "#3B2614";                       // outline
  const line = `stroke="${O}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;

  // Lighten (amt > 0) or darken (amt < 0) a #rrggbb color
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const mix = (c) => Math.round(amt > 0 ? c + (255 - c) * amt : c * (1 + amt));
    const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  RR.art.shade = shade;

  const eye = (x, y, r = 7) => `
    <circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${line}/>
    <circle cx="${x + r * .3}" cy="${y + r * .1}" r="${r * .55}" fill="#2A1B0E"/>
    <circle cx="${x + r * .5}" cy="${y - r * .2}" r="${r * .2}" fill="#fff"/>`;
  const blush = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="#FF8A80" opacity=".55"/>`;
  // A thick neck drawn as an outlined stroke
  const neck = (d, w, c) => `<path d="${d}" fill="none" stroke="${O}" stroke-width="${w + 5}" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;

  const draw = {
    trex: (c, d, l) => `
      <path d="M8 100 Q12 70 40 60 L60 68 Q52 86 54 100Z" fill="${c}" ${line}/>
      <path d="M38 56 Q50 66 58 70 L52 100 L40 100 Q42 78 36 62Z" fill="${l}"/>
      <path d="M14 78 l4 -10 5 8 M22 68 l5 -10 4 9 M31 61 l6 -9 3 9" fill="#FF7A1A" ${line}/>
      <path d="M32 42 Q34 20 58 18 L82 20 Q96 23 95 38 L94 50 Q80 59 62 58 Q42 60 36 54Z" fill="${c}" ${line}/>
      <path d="M62 49 Q80 51 93 46" fill="none" ${line}/>
      <path d="M66 49 l3 4 3 -4 3 4 3 -4 3 4 3 -4 3 3" fill="#fff" stroke="${O}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M56 26 Q66 20 76 25" fill="none" stroke="${d}" stroke-width="4" stroke-linecap="round"/>
      ${eye(67, 33)}
      <circle cx="88" cy="29" r="1.8" fill="${O}"/>
      ${blush(80, 40)}
      <path d="M50 78 q9 0 11 8" fill="none" stroke="${O}" stroke-width="8" stroke-linecap="round"/>
      <path d="M50 78 q9 0 11 8" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/>`,

    raptor: (c, d, l) => `
      <path d="M14 100 Q16 72 40 60 L56 66 Q48 84 50 100Z" fill="${c}" ${line}/>
      <path d="M22 84 l10 -4 M24 92 l10 -4 M30 72 l8 -5" stroke="${d}" stroke-width="4" stroke-linecap="round"/>
      <path d="M36 44 q-16 -10 -24 -2 q10 0 18 8 M36 50 q-18 -2 -24 8 q10 -4 20 -2" fill="${d}" ${line}/>
      <path d="M34 46 Q38 30 56 30 L84 37 Q97 42 95 50 Q86 57 60 57 Q42 58 34 46Z" fill="${c}" ${line}/>
      <path d="M58 51 L92 49" fill="none" ${line}/>
      <path d="M64 51 l2 3 2 -3 2 3 2 -3 2 3 2 -3 2 3 2 -3" fill="#fff" stroke="${O}" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M52 34 Q60 29 70 33" fill="none" stroke="${d}" stroke-width="4" stroke-linecap="round"/>
      ${eye(62, 40, 6.5)}
      <circle cx="89" cy="41" r="1.6" fill="${O}"/>`,

    compy: (c, d, l) => `
      <path d="M24 100 Q20 78 38 72 Q56 70 60 88 L62 100Z" fill="${c}" ${line}/>
      <ellipse cx="44" cy="90" rx="10" ry="9" fill="${l}"/>
      <path d="M40 66 Q44 76 50 76 L54 66Z" fill="${c}"/>
      <path d="M30 48 Q30 26 54 26 Q72 26 82 40 Q90 48 84 56 Q74 66 50 64 Q30 62 30 48Z" fill="${c}" ${line}/>
      <path d="M66 56 Q76 57 84 53" fill="none" ${line}/>
      ${eye(55, 42, 10)}
      ${blush(70, 54)}
      <circle cx="80" cy="44" r="1.6" fill="${O}"/>
      <path d="M58 82 q6 2 6 7" fill="none" stroke="${O}" stroke-width="6" stroke-linecap="round"/>
      <path d="M58 82 q6 2 6 7" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`,

    micro: (c, d, l) => `
      <path d="M2 100 Q4 62 30 60 Q22 72 26 78 Q14 76 10 88 Q22 84 30 90 Q20 92 18 100Z" fill="${d}" ${line}/>
      <path d="M20 100 Q22 72 44 62 L58 68 Q52 86 54 100Z" fill="${c}" ${line}/>
      <path d="M40 40 q-6 -16 4 -22 q0 10 6 16 M46 36 q2 -16 12 -18 q-4 10 -2 18" fill="${d}" ${line}/>
      <path d="M36 48 Q38 32 56 32 Q74 32 86 42 Q94 48 90 54 Q80 60 58 60 Q40 60 36 48Z" fill="${c}" ${line}/>
      <path d="M64 54 L88 52" fill="none" ${line}/>
      ${eye(58, 43, 8)}
      ${blush(72, 52)}
      <circle cx="86" cy="45" r="1.6" fill="${O}"/>`,

    galli: (c, d, l) => `
      <path d="M6 100 Q10 80 30 78 Q46 80 50 100Z" fill="${c}" ${line}/>
      <path d="M14 86 q-8 -4 -10 2 M20 82 q-6 -8 -12 -4" fill="none" stroke="${d}" stroke-width="3" stroke-linecap="round"/>
      ${neck("M32 92 Q34 52 60 34", 12, c)}
      <path d="M44 70 l-8 -2 M48 58 l-8 -4" stroke="${d}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="66" cy="30" rx="15" ry="11" fill="${c}" ${line}/>
      <path d="M78 26 L97 33 L78 38Z" fill="#F2C14E" ${line}/>
      ${eye(68, 27, 6)}
      <path d="M56 20 q-2 -10 6 -12 M62 19 q2 -10 10 -9" fill="none" stroke="${d}" stroke-width="3" stroke-linecap="round"/>`,

    spino: (c, d, l) => `
      <path d="M2 86 Q6 24 40 20 Q56 30 58 62 Z" fill="#E86A3A" ${line}/>
      <path d="M12 82 L14 40 M22 76 L26 28 M33 70 L38 24 M44 66 L48 30" stroke="#B5482A" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M10 100 Q14 72 40 62 L60 68 Q54 86 56 100Z" fill="${c}" ${line}/>
      <path d="M42 46 Q46 32 60 33 L94 44 Q99 50 93 54 L62 58 Q46 58 42 46Z" fill="${c}" ${line}/>
      <path d="M62 52 L92 50" fill="none" ${line}/>
      <path d="M68 52 l2 3 2 -3 2 3 2 -3 2 3 2 -3 2 3 2 -3" fill="#fff" stroke="${O}" stroke-width="1.3" stroke-linejoin="round"/>
      ${eye(58, 40, 6.5)}
      <circle cx="88" cy="44" r="1.6" fill="${O}"/>
      <path d="M44 74 q8 -2 12 4 M42 84 q8 -2 12 4" fill="none" stroke="${d}" stroke-width="3" stroke-linecap="round"/>`,

    ptero: (c, d, l) => `
      <path d="M0 100 Q8 66 40 64 Q70 64 86 100Z" fill="${d}" ${line}/>
      <path d="M20 100 L40 72 M56 100 L46 72" stroke="${shade(d, -.25)}" stroke-width="2.5"/>
      <ellipse cx="44" cy="84" rx="12" ry="14" fill="${c}" ${line}/>
      <path d="M40 40 L6 22 L44 56Z" fill="${c}" ${line}/>
      <path d="M58 40 L98 54 L58 60Z" fill="#F2C14E" ${line}/>
      <path d="M62 52 L94 54" fill="none" stroke="${O}" stroke-width="1.8"/>
      <circle cx="50" cy="48" r="15" fill="${c}" ${line}/>
      ${eye(53, 45, 7)}
      ${blush(56, 56)}`,

    brachio: (c, d, l) => `
      <path d="M0 100 Q4 74 30 72 Q52 74 56 100Z" fill="${c}" ${line}/>
      ${neck("M34 92 Q36 50 56 24", 20, c)}
      <path d="M44 84 Q44 60 52 40" fill="none" stroke="${l}" stroke-width="6" stroke-linecap="round" opacity=".7"/>
      <circle cx="40" cy="62" r="3" fill="${d}"/><circle cx="46" cy="50" r="2.5" fill="${d}"/><circle cx="36" cy="76" r="3.5" fill="${d}"/>
      <path d="M48 12 Q56 2 66 10 L66 16 L48 16Z" fill="${c}" ${line}/>
      <path d="M42 24 Q44 10 62 12 Q82 14 90 24 Q94 32 86 36 Q70 40 52 36 Q42 34 42 24Z" fill="${c}" ${line}/>
      <path d="M68 31 Q78 33 86 30" fill="none" ${line}/>
      ${eye(60, 22, 6.5)}
      ${blush(74, 32)}
      <circle cx="84" cy="24" r="1.5" fill="${O}"/>`,

    bronto: (c, d, l) => `
      <path d="M0 100 Q0 64 30 62 Q58 64 64 100Z" fill="${c}" ${line}/>
      <path d="M8 100 Q12 80 30 80 Q48 82 52 100Z" fill="${l}" opacity=".8"/>
      ${neck("M34 74 Q46 48 68 40", 18, c)}
      <path d="M38 72 Q48 54 64 46" fill="none" stroke="${l}" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      <path d="M56 40 Q58 26 74 26 Q90 28 94 38 Q96 46 88 48 Q74 52 62 48 Q56 46 56 40Z" fill="${c}" ${line}/>
      <path d="M76 44 Q84 46 92 42" fill="none" ${line}/>
      ${eye(70, 35, 6)}
      ${blush(82, 44)}
      <circle cx="90" cy="34" r="1.5" fill="${O}"/>`,

    trike: (c, d, l) => `
      <path d="M10 100 Q14 78 40 74 Q62 76 66 100Z" fill="${c}" ${line}/>
      <circle cx="40" cy="46" r="32" fill="${d}" ${line}/>
      <circle cx="40" cy="46" r="24" fill="${shade(c, .35)}"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => { const a = Math.PI * (0.55 + i * 0.22);
        return `<circle cx="${40 + 30 * Math.cos(a)}" cy="${46 - 30 * Math.sin(a)}" r="3.5" fill="#F3EBD3" ${line}/>`; }).join("")}
      <path d="M38 44 Q46 30 68 34 L88 50 Q94 60 84 66 L58 72 Q40 70 36 58Z" fill="${c}" ${line}/>
      <path d="M84 52 L98 60 L84 68Z" fill="#8A5A2E" ${line}/>
      <path d="M52 36 L66 6 L62 40Z" fill="#F3EBD3" ${line}/>
      <path d="M64 38 L84 12 L72 42Z" fill="#F3EBD3" ${line}/>
      <path d="M80 48 L86 34 L88 52Z" fill="#F3EBD3" ${line}/>
      ${eye(62, 50, 6.5)}
      ${blush(70, 60)}
      <path d="M66 64 Q74 67 82 64" fill="none" ${line}/>`,

    stego: (c, d, l) => `
      ${[[6, 72, 10], [16, 52, 14], [32, 40, 16], [50, 40, 14], [64, 52, 10]].map(([x, y, s]) =>
        `<path d="M${x - s * .7} ${y + s} L${x - s * .5} ${y} L${x} ${y - s} L${x + s * .5} ${y} L${x + s * .7} ${y + s}Z" fill="#FF7A1A" ${line}/>`).join("")}
      <path d="M-4 100 Q-2 58 34 54 Q66 54 72 82 L74 100Z" fill="${c}" ${line}/>
      <path d="M6 100 Q10 82 34 80 Q56 82 62 100Z" fill="${l}" opacity=".8"/>
      <circle cx="24" cy="70" r="3" fill="${d}"/><circle cx="44" cy="66" r="3.5" fill="${d}"/><circle cx="58" cy="74" r="3" fill="${d}"/>
      <path d="M64 72 Q66 60 80 60 Q94 62 96 72 Q96 80 86 82 Q70 84 66 78Z" fill="${c}" ${line}/>
      <path d="M82 77 Q88 78 94 75" fill="none" ${line}/>
      ${eye(80, 68, 5.5)}
      ${blush(88, 76)}`,

    anky: (c, d, l) => `
      <path d="M-2 76 L12 60 M12 60" stroke="${O}" stroke-width="6" stroke-linecap="round"/>
      <path d="M-2 76 L12 60" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="12" cy="56" r="9" fill="${d}" ${line}/>
      <path d="M4 100 Q4 56 46 52 Q82 54 84 92 L84 100Z" fill="${c}" ${line}/>
      ${[[22, 66], [36, 60], [50, 60], [64, 64], [28, 80], [44, 76], [60, 78], [74, 80]].map(([x, y]) =>
        `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" fill="${d}" ${line}/>`).join("")}
      ${[[14, 60], [30, 52], [48, 50], [66, 54]].map(([x, y]) =>
        `<path d="M${x - 5} ${y + 3} L${x} ${y - 8} L${x + 5} ${y + 3}Z" fill="#F3EBD3" ${line}/>`).join("")}
      <path d="M74 80 Q76 66 88 66 Q98 68 98 78 Q98 88 88 90 Q78 90 74 80Z" fill="${c}" ${line}/>
      <path d="M78 68 Q86 62 96 70" fill="none" stroke="${d}" stroke-width="5" stroke-linecap="round"/>
      ${eye(86, 76, 5)}
      <path d="M88 85 Q93 86 97 83" fill="none" ${line}/>`,

    para: (c, d, l) => `
      ${neck("M48 36 Q30 22 12 8", 10, "#E86A3A")}
      <path d="M12 100 Q16 72 40 62 L60 68 Q54 86 56 100Z" fill="${c}" ${line}/>
      <path d="M38 48 Q42 30 60 31 Q78 32 90 46 Q98 54 90 58 L62 60 Q42 60 38 48Z" fill="${c}" ${line}/>
      <path d="M76 44 Q90 46 96 52 Q96 58 88 60 L72 58Z" fill="${l}" ${line}/>
      ${eye(58, 42, 7)}
      ${blush(66, 53)}
      <path d="M20 84 q8 -4 14 0 M24 94 q8 -4 14 0" fill="none" stroke="${d}" stroke-width="3" stroke-linecap="round"/>`,

    pachy: (c, d, l) => `
      <path d="M10 100 Q14 72 40 64 L62 70 Q56 86 58 100Z" fill="${c}" ${line}/>
      <path d="M32 50 Q34 70 58 70 Q80 70 92 58 Q96 50 86 46 L60 44Z" fill="${c}" ${line}/>
      <path d="M28 46 Q28 14 56 14 Q82 16 84 44 Q60 52 28 46Z" fill="${shade(c, .45)}" ${line}/>
      ${[[30, 50], [40, 54], [80, 48], [88, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#F3EBD3" ${line}/>`).join("")}
      <path d="M44 24 Q52 18 62 20" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
      ${eye(64, 54, 6.5)}
      ${blush(74, 62)}
      <path d="M72 66 Q80 67 88 62" fill="none" ${line}/>`
  };

  RR.art.portrait = function (species, color) {
    const c = color || "#4CAF62";
    const art = (draw[species] || draw.trex)(c, shade(c, -.28), shade(c, .45));
    const nudge = { anky: "translate(-9 -6)", galli: "translate(-8 -2) scale(1.12)" }[species];
    return nudge ? `<g transform="${nudge}">${art}</g>` : art;
  };

  // Work out the species from a dino's name, e.g. "Tara the Triceratops" → trike
  const KEYS = [["microraptor", "micro"], ["raptor", "raptor"], ["t-rex", "trex"], ["compy", "compy"],
    ["gallimimus", "galli"], ["spinosaurus", "spino"], ["pter", "ptero"], ["brachio", "brachio"],
    ["bronto", "bronto"], ["triceratops", "trike"], ["stegosaurus", "stego"], ["ankylo", "anky"],
    ["parasaurolophus", "para"], ["pachy", "pachy"]];
  RR.art.speciesOf = name => { const k = KEYS.find(([w]) => (name || "").toLowerCase().includes(w)); return k && k[1]; };

  RR.art.avatar = function (dino, cls = "") {
    const sp = dino.species || RR.art.speciesOf(dino.name);
    if (!sp) return `<span class="dt-avatar ${cls}" style="background:${dino.color}">${dino.icon}</span>`;
    return `<span class="dt-avatar art ${cls}" style="background:${shade(dino.color, .7)}">
      <svg viewBox="0 0 100 100" role="img" aria-label="${dino.name}">${RR.art.portrait(sp, dino.color)}</svg></span>`;
  };
})();
