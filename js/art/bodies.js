/*
 * Full-body dinos for the player's character, plus the accessories from the Dino Shop.
 * Everything is on a 200x200 grid, facing right, feet at y≈187 (same as Rexy, so Hangman lines up).
 *
 *   RR.art.dinoBody(look)  → SVG shapes for the whole dino with its accessories
 *   RR.art.dinoHead(look)  → the same dino cropped to its head (for 100x100 avatars)
 *   look = { species, color, hat, eyes, neck, back, paint }   (ids from js/data/shop.js; paint = { itemId: paintId })
 *
 * Realistic but friendly style: thin outline, skin dark on top and pale underneath, scaly texture, calm eyes.
 */
(function () {
  const OL = "#241C10";
  const line = `stroke="${OL}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"`;

  /* ---------- color helpers (shared with portraits.js) ---------- */
  function shade(hex, amt) {             // lighten (amt > 0) or darken (amt < 0)
    const n = parseInt(hex.slice(1), 16);
    const f = c => Math.round(amt > 0 ? c + (255 - c) * amt : c * (1 + amt));
    const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  function mix(a, b, t) {                // blend two colors (t = 0 → a, t = 1 → b)
    const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const A = p(a), B = p(b);
    return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
  }
  RR.art.shade = shade;
  RR.art.mix = mix;

  /* ---------- skin: gradient + scale texture for one color ---------- */
  function skinKit(colorId) {
    const colors = (RR.data.shop && RR.data.shop.colors) || [];
    const base = (colors.find(c => c.id === colorId) || { hex: "#6E7A3C" }).hex;
    const id = "sk" + base.slice(1);
    const defs = `<defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${shade(base, -.42)}"/><stop offset=".45" stop-color="${base}"/>
        <stop offset=".8" stop-color="${mix(base, "#D6C79A", .45)}"/><stop offset="1" stop-color="${mix(base, "#E4D7AC", .7)}"/>
      </linearGradient>
      <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${shade(base, -.55)}"/><stop offset="1" stop-color="${shade(base, -.2)}"/>
      </linearGradient>
      <pattern id="rexScales" width="6" height="6" patternUnits="userSpaceOnUse">
        <path d="M0 3 a3 3 0 0 1 6 0 M-3 6 a3 3 0 0 1 6 0 M3 6 a3 3 0 0 1 6 0" fill="none" stroke="#1E2410" stroke-width=".45" opacity=".3"/>
        <path d="M1.2 1.6 a2 2 0 0 1 2.6 -.4 M4.2 4.6 a2 2 0 0 1 2.6 -.4 M-1.8 4.6 a2 2 0 0 1 2.6 -.4" fill="none" stroke="#fff" stroke-width=".4" opacity=".14"/>
      </pattern>
      ${SKIN_FX}
    </defs>`;
    // fill with lighting + texture, scales on top, then the outline
    const part = (d, fill) => `<path d="${d}" fill="${fill}" filter="url(#rexSkin)"/><path d="${d}" fill="url(#rexScales)"/><path d="${d}" fill="none" ${line}/>`;
    return {
      defs, base, dark: shade(base, -.45),
      S: d => part(d, `url(#${id})`),
      F: d => part(d, `url(#${id}f)`)
    };
  }

  /* Skin lighting (one SVG filter used by every body part):
   * bumpy skin lit from the top left, darker blotches, a shadow along the bottom edge and a soft shine on top,
   * so each part looks round instead of flat. */
  const SKIN_FX = `
      <filter id="rexSkin" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="4" result="n"/>
        <feDiffuseLighting in="n" surfaceScale="1.4" lighting-color="#fff" result="bump"><feDistantLight azimuth="235" elevation="58"/></feDiffuseLighting>
        <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="9" result="m"/>
        <feColorMatrix in="m" type="matrix" values=".9 0 0 0 .5  .9 0 0 0 .5  .9 0 0 0 .5  0 0 0 0 1" result="blot"/>
        <feComposite in="bump" in2="blot" operator="arithmetic" k1="1.2" result="lum"/>
        <feComposite in="lum" in2="SourceGraphic" operator="arithmetic" k1="1" result="tex"/>
        <feGaussianBlur in="SourceAlpha" stdDeviation="3.5" result="b"/>
        <feOffset in="b" dx="1.5" dy="-4.5" result="bLow"/>
        <feComposite in="SourceAlpha" in2="bLow" operator="out" result="lowEdge"/>
        <feFlood flood-color="#141808" flood-opacity=".5"/><feComposite in2="lowEdge" operator="in" result="shadow"/>
        <feOffset in="b" dx="-1" dy="3.5" result="bHigh"/>
        <feComposite in="SourceAlpha" in2="bHigh" operator="out" result="highEdge"/>
        <feFlood flood-color="#FFF4D0" flood-opacity=".28"/><feComposite in2="highEdge" operator="in" result="shine"/>
        <feMerge result="all"><feMergeNode in="tex"/><feMergeNode in="shadow"/><feMergeNode in="shine"/></feMerge>
        <feComposite in="all" in2="SourceAlpha" operator="in"/>
      </filter>`;

  const eye = (x, y, r = 3.4) => `
    <circle cx="${x}" cy="${y}" r="${r}" fill="#D89A2B" stroke="${OL}" stroke-width="1"/>
    <circle cx="${x + r * .15}" cy="${y}" r="${r * .47}" fill="#120E08"/><circle cx="${x + r * .35}" cy="${y - r * .3}" r="${r * .18}" fill="#fff"/>`;
  // Friendly brow: lifted a little and lighter so the face doesn't frown
  const brow = d => `<path transform="translate(0 -1.5)" d="${d}" fill="none" stroke="#2C3418" stroke-width="2.6" stroke-linecap="round" opacity=".55"/>`;
  /* Smiling mouth: from the snout tip (fx,fy) back to the corner (bx,by), sagging in the middle and
   * curling up at the corner, with a cheek crease. teeth = how many small teeth hang from the front part. */
  const smile = (bx, by, fx, fy, sag = 4, teeth = 0, w = 1.6) => {
    const cx = (bx + fx) / 2, cy = (by + fy) / 2 + sag;
    const at = t => [(1 - t) ** 2 * fx + 2 * t * (1 - t) * cx + t * t * bx, (1 - t) ** 2 * fy + 2 * t * (1 - t) * cy + t * t * by];
    const tooth = [...Array(teeth)].map((_, i) => { const [x, y] = at(.15 + i * .55 / Math.max(teeth - 1, 1));
      return `M${(x - 1.4).toFixed(1)} ${(y - .3).toFixed(1)} l1.4 3.4 1.4 -3.4Z`; }).join(" ");
    return (teeth ? `<path d="${tooth}" fill="#F2EAD3" stroke="${OL}" stroke-width=".7" stroke-linejoin="round"/>` : "") +
      `<path d="M${fx} ${fy} Q${cx} ${cy} ${bx} ${by} q-2.6 -.6 -3.4 -4.4" fill="none" stroke="${OL}" stroke-width="${w}" stroke-linecap="round"/>` +
      `<path d="M${bx - 5} ${by - 7} q-1.6 3.4 .6 6.6" fill="none" stroke="${OL}" stroke-width="${w * .7}" stroke-linecap="round" opacity=".55"/>`;
  };
  const marks = (d, w = 2) => `<path d="${d}" fill="none" stroke="#1E2410" stroke-width="${w}" opacity=".35" stroke-linecap="round"/>`;
  const BONE = "#E2D6B8";

  /* ---------- the five dinos ----------
   * anchors: where accessories go → [x, y, rotate, scale]; head: [x, y, size] square used for avatars */
  const SPECIES = {
    trex: {
      anchors: { eyes: [167, 52, 0, 1], hat: [171, 41, -6, 1], neck: [161, 95, -35, .9], back: [126, 80, 0, 1] },
      head: [124, 22, 78],
      draw: k => `
        ${k.F("M80 100 Q94 90 106 100 Q112 116 106 132 Q96 140 86 134 Q78 120 80 100Z")}
        ${k.F("M92 132 L106 136 L97 166 L85 164Z")}${k.F("M84 161 L97 163 L114 176 L126 180 Q129 184 125 186 L86 186 Q80 178 84 161Z")}
        <g class="rexy-tail">${k.S("M92 80 Q58 78 30 85 Q12 90 2 95 Q14 99 32 102 Q62 108 88 122Z")}${marks("M30 92 q4 -3 8 0 M46 90 q5 -4 10 0 M62 88 q5 -4 10 0")}</g>
        ${k.S("M74 90 Q96 72 132 74 Q150 76 158 90 Q160 108 148 120 Q128 132 104 128 Q82 124 72 110Z")}
        ${marks("M90 82 q4 6 2 12 M104 76 q4 7 2 13 M118 74 q4 7 2 13 M132 76 q3 6 1 12", 2.5)}
        ${k.S("M136 76 Q148 64 160 58 L170 84 Q160 100 150 108 Q146 92 136 86Z")}
        ${k.S("M88 96 Q112 84 127 104 Q131 124 119 140 Q105 147 94 137 Q84 120 88 96Z")}
        ${marks("M98 104 Q112 96 122 108 M100 128 Q108 134 116 130", 1.6)}
        ${k.S("M108 132 L124 136 L113 168 L100 166Z")}${k.S("M99 163 L113 165 L132 179 L146 182 Q149 186 145 188 L100 188 Q95 180 99 163Z")}
        <path d="M144 182 l6 3 -6 2Z M133 181 l6 3 -6 2Z M122 182 l5 3 -5 2Z" fill="#CFC2A0" stroke="${OL}" stroke-width=".9"/>
        <path d="M148 104 Q156 106 160 112" fill="none" stroke="${OL}" stroke-width="6.5" stroke-linecap="round"/>
        <path d="M148 104 Q156 106 160 112" fill="none" stroke="${k.base}" stroke-width="4" stroke-linecap="round"/>
        <path d="M160 112 l4 1 M159 113 l3 3" stroke="#E9DFC4" stroke-width="1.5" stroke-linecap="round"/>
        ${k.S("M156 72 L196 68 Q194 78 180 82 L166 84 Q158 82 156 72Z")}
        ${k.S("M150 56 Q152 42 168 40 L184 42 Q197 45 199 56 L198 68 Q194 76 182 78 L164 80 Q153 79 150 72Z")}
        ${smile(161, 68, 196, 67, 7, 4)}
        <ellipse cx="160" cy="62" rx="5" ry="3.5" fill="#2C3418" opacity=".35"/>
        ${brow("M160 49 Q166 44 173 47")}${eye(167, 52)}
        <path d="M190 47 q3 -1 4 1" fill="none" stroke="${OL}" stroke-width="1.6" stroke-linecap="round"/>`
    },

    raptor: {
      anchors: { eyes: [152, 55, 0, .8], hat: [155, 47, -4, .8], neck: [137, 88, -40, .75], back: [104, 80, 0, .8] },
      head: [122, 26, 72],
      draw: k => `
        ${k.F("M84 100 Q96 92 104 104 Q106 118 98 126 Q90 128 86 120 Q80 110 84 100Z")}
        ${k.F("M90 122 L100 124 L92 160 L84 158Z")}${k.F("M82 156 L94 158 L108 172 L114 177 Q116 181 112 182 L82 182 Q78 172 82 156Z")}
        <g class="rexy-tail">${k.S("M72 88 Q40 84 8 78 Q4 83 8 86 Q40 96 74 106Z")}
          <path d="M9 79 l-8 -5 M8 83 l-8 0 M9 86 l-7 5" stroke="${k.dark}" stroke-width="2.5" stroke-linecap="round"/></g>
        ${k.S("M64 92 Q82 76 110 78 Q128 82 132 96 Q130 112 114 118 Q90 122 72 112Z")}
        ${marks("M84 82 q3 6 1 11 M98 79 q3 6 1 11 M112 80 q3 6 1 10", 2.2)}
        ${k.S("M116 82 Q128 70 138 60 L152 70 Q140 88 128 104Z")}
        <path d="M136 52 q-9 -10 -15 -5 q6 2 11 8Z M138 48 q-4 -13 -13 -12 q5 4 9 12Z" fill="${k.dark}" ${line}/>
        ${k.S("M134 58 Q138 46 152 46 L182 53 Q193 57 191 62 Q185 69 160 69 Q141 69 134 58Z")}
        ${smile(156, 61, 189, 61, 6, 3, 1.4)}
        ${brow("M146 51 Q152 47 158 50")}${eye(152, 55, 3)}
        <circle cx="186" cy="56" r="1.1" fill="${OL}"/>
        ${k.S("M94 102 Q108 92 118 104 Q122 120 112 130 Q102 134 96 126 Q88 114 94 102Z")}
        ${k.S("M102 126 L114 128 L106 166 L98 164Z")}${k.S("M96 162 L108 164 L124 178 L132 182 Q134 186 130 187 L96 187 Q92 178 96 162Z")}
        <path d="M101 173 Q93 166 98 157" fill="none" stroke="${BONE}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M122 100 Q130 112 141 114 L137 105Z" fill="${k.dark}" ${line}/>
        <path d="M124 98 Q134 102 140 110" fill="none" stroke="${OL}" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M124 98 Q134 102 140 110" fill="none" stroke="${k.base}" stroke-width="3" stroke-linecap="round"/>`
    },

    trike: {
      anchors: { eyes: [172, 77, 0, .9], hat: [163, 26, -18, .85], neck: [160, 101, -8, .9], back: [104, 74, 0, 1] },
      head: [126, 6, 80],
      draw: k => `
        ${k.F("M128 122 L126 180 L140 180 L142 120Z")}${k.F("M62 120 L60 180 L76 180 L78 122Z")}
        <g class="rexy-tail">${k.S("M58 106 Q30 108 4 124 Q6 130 12 130 Q34 128 60 128Z")}</g>
        ${k.S("M48 102 Q66 72 114 72 Q146 76 154 102 Q154 128 134 136 L66 138 Q46 130 48 102Z")}
        ${marks("M70 86 q4 8 2 16 M88 78 q4 8 2 16 M106 76 q4 8 2 16 M124 78 q4 8 2 16", 2.5)}
        ${k.S("M66 104 Q84 94 98 108 Q102 128 94 140 L92 186 L70 186 L72 140 Q62 126 66 104Z")}
        ${k.S("M136 114 Q146 108 156 114 L156 186 L136 186Z")}
        <path d="M72 186 q3 -4 6 0 M80 186 q3 -4 6 0 M138 186 q3 -4 6 0 M146 186 q3 -4 6 0" fill="${BONE}" stroke="${OL}" stroke-width=".8"/>
        ${k.S("M138 62 Q140 24 168 20 Q194 24 191 62 Q186 88 160 92 Q144 88 138 62Z")}
        <path d="M146 60 Q148 34 168 30 Q186 34 184 60 Q180 80 162 84 Q150 80 146 60Z" fill="#1E2410" opacity=".14"/>
        ${[...Array(9)].map((_, i) => { const a = Math.PI * (1.05 - i * .14), x = 165 + 27 * Math.cos(a), y = 56 - 34 * Math.sin(a);
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="${BONE}" stroke="${OL}" stroke-width=".9"/>`; }).join("")}
        <path d="M160 64 L170 30 L166 66Z" fill="${shade(BONE, -.15)}" ${line}/>
        ${k.S("M150 66 Q162 54 178 60 L196 84 Q199 94 190 98 L166 104 Q152 100 150 86Z")}
        <path d="M188 84 L199 95 L188 100Z" fill="#5A4A36" ${line}/>
        <path d="M170 62 L186 26 L178 66Z" fill="${BONE}" ${line}/>
        <path d="M186 80 L192 66 L194 86Z" fill="${BONE}" ${line}/>
        ${smile(170, 96, 188, 97, 5, 0, 1.4)}
        ${brow("M166 72 Q172 68 178 71")}${eye(172, 77, 3.2)}`
    },

    stego: {
      anchors: { eyes: [176, 112, 0, .6], hat: [175, 103, -6, .62], neck: [160, 119, -60, .6], back: [100, 72, 0, .9] },
      head: [140, 74, 64],
      draw: k => {
        const plate = mix(k.base, "#9C5A3A", .6);
        const plates = [[30, 100, 9], [44, 94, 13], [58, 82, 17], [75, 72, 20], [93, 68, 22], [111, 70, 20], [127, 78, 16], [141, 90, 12]]
          .map(([x, y, s]) => `<path d="M${x - s * .55} ${y + s * .3} Q${x - s * .65} ${y - s} ${x} ${y - s * 1.55} Q${x + s * .65} ${y - s} ${x + s * .55} ${y + s * .3}Z" fill="${plate}" ${line}/>
            <path d="M${x} ${y - s * 1.2} L${x} ${y}" stroke="#1E2410" stroke-width="1" opacity=".3"/>`).join("");
        return `
        ${plates}
        ${k.F("M54 118 L52 180 L68 180 L70 116Z")}${k.F("M120 120 L118 180 L132 180 L134 120Z")}
        <g class="rexy-tail">${k.S("M44 108 Q22 104 4 88 Q2 94 6 98 Q24 116 48 126Z")}
          <path d="M8 92 L-2 80 L12 90Z M16 98 L8 83 L20 96Z M10 95 L-4 98 L10 99Z" fill="${BONE}" ${line}/></g>
        ${k.S("M38 110 Q56 66 100 66 Q136 70 150 104 Q152 126 132 134 L58 134 Q40 128 38 110Z")}
        ${marks("M64 80 q3 8 1 16 M82 72 q3 8 1 16 M100 70 q3 8 1 16 M118 74 q3 8 1 16", 2.5)}
        ${k.S("M138 98 Q156 100 166 110 L170 124 Q156 128 142 124Z")}
        ${k.S("M158 110 Q166 100 182 104 Q197 110 197 119 Q192 128 178 128 L164 128 Q156 122 158 110Z")}
        ${smile(185, 121, 195, 120, 3, 0, 1.3)}
        ${brow("M171 108 Q176 105 181 108")}${eye(176, 112, 2.4)}
        ${k.S("M64 112 Q80 100 94 114 L94 186 L70 186 Q62 140 64 112Z")}
        ${k.S("M128 120 L146 120 L146 186 L130 186Z")}
        <path d="M72 186 q3 -4 6 0 M82 186 q3 -4 6 0 M132 186 q3 -4 6 0 M140 186 q3 -4 6 0" fill="${BONE}" stroke="${OL}" stroke-width=".8"/>`;
      }
    },

    brachio: {
      anchors: { eyes: [163, 24, 0, .7], hat: [168, 11, -4, .72], neck: [146, 62, -55, .8], back: [98, 94, 0, .9] },
      head: [134, -12, 68],
      draw: k => `
        ${k.F("M104 126 L102 180 L118 180 L120 122Z")}${k.F("M44 130 L42 180 L56 180 L60 128Z")}
        <g class="rexy-tail">${k.S("M40 118 Q20 122 4 140 Q6 146 12 144 Q28 134 46 138Z")}</g>
        ${k.S("M34 124 Q44 94 90 92 Q126 92 140 110 Q146 134 126 144 L56 146 Q34 140 34 124Z")}
        ${k.S("M110 108 Q116 66 146 30 L164 36 Q138 76 140 114Z")}
        <ellipse cx="128" cy="84" rx="3" ry="4" fill="#1E2410" opacity=".22"/><ellipse cx="138" cy="62" rx="2.5" ry="3.5" fill="#1E2410" opacity=".22"/>
        <ellipse cx="76" cy="104" rx="4" ry="3" fill="#1E2410" opacity=".2"/><ellipse cx="96" cy="100" rx="5" ry="3.5" fill="#1E2410" opacity=".2"/>
        ${k.S("M146 28 Q148 16 158 14 Q164 6 174 12 Q188 14 196 24 Q197 33 187 36 L160 38 Q148 36 146 28Z")}
        ${smile(177, 30, 193, 29, 3, 0, 1.3)}
        ${brow("M158 20 Q163 17 168 20")}${eye(163, 24, 2.8)}
        ${k.S("M50 128 Q64 120 76 130 L74 186 L54 186Z")}${k.S("M118 124 L138 120 L136 186 L118 186Z")}
        <path d="M56 186 q3 -4 6 0 M64 186 q3 -4 6 0 M120 186 q3 -4 6 0 M128 186 q3 -4 6 0" fill="${BONE}" stroke="${OL}" stroke-width=".8"/>`
    }
  };

  /* ---------- accessories (drawn around 0,0; x+ is the way the dino faces) ----------
   * Each one has a main color that players can repaint in the shop.
   * draw(m, d, l): m = main color, d = a darker shade, l = a lighter shade */
  const ACC = {
    // hats: 0,0 is the top of the head
    cap: { color: "#D63B3B", draw: (m, d) => `<path d="M-16 1 Q-17 -18 0 -20 Q15 -19 16 1Z" fill="${m}" ${line}/><path d="M12 -1 Q26 -1 34 4 Q26 7 12 4Z" fill="${d}" ${line}/>
          <circle cx="0" cy="-20" r="2" fill="${d}"/><path d="M-5 -18 Q-3 -8 -3 0" stroke="${d}" stroke-width="1.2" fill="none"/>` },
    party: { color: "#4FA3E0", draw: m => `<path d="M-13 1 L1 -38 L13 1Z" fill="${m}" ${line}/><path d="M-9 -9 L9 -9 M-5 -21 L5 -21" stroke="#FFD23F" stroke-width="4"/>
          <circle cx="1" cy="-39" r="5" fill="#FF5DA2" ${line}/>` },
    cowboy: { color: "#9A6A3A", draw: (m, d, l) => `<path d="M-11 -1 Q-14 -24 -4 -22 Q0 -17 4 -22 Q14 -24 11 -1Z" fill="${m}" ${line}/>
          <path d="M-28 -1 Q-20 -8 0 -4 Q20 -8 30 -2 Q22 6 0 3 Q-20 6 -28 -1Z" fill="${l}" ${line}/>
          <path d="M-11 -6 Q0 -3 11 -6" stroke="${d}" stroke-width="2.5" fill="none"/>` },
    pirate: { color: "#1F1B24", draw: m => `<path d="M-26 0 Q-16 -30 0 -28 Q16 -30 26 0 Q0 -9 -26 0Z" fill="${m}" ${line}/>
          <path d="M-22 -3 Q0 -12 22 -3" stroke="#D9B44A" stroke-width="2" fill="none"/>
          <circle cx="0" cy="-18" r="4" fill="#fff"/><path d="M-5 -11 L5 -8 M5 -11 L-5 -8" stroke="#fff" stroke-width="1.6"/>` },
    tophat: { color: "#1F1B24", draw: m => `<ellipse cx="0" cy="0" rx="21" ry="4.5" fill="${m}" ${line}/><path d="M-12 0 L-13 -34 Q0 -37 13 -34 L12 0Z" fill="${m}" ${line}/>
          <path d="M-12.4 -8 L12.4 -8 L12.6 -13 L-12.6 -13Z" fill="#B02E2E"/>` },
    wizard: { color: "#4B3A9C", draw: m => `<path d="M-16 0 L6 -52 Q8 -54 9 -50 L16 0Z" fill="${m}" ${line}/><ellipse cx="0" cy="0" rx="22" ry="4.5" fill="${m}" ${line}/>
          <path d="M0 -27 l2 5 5 0 -4 3 2 5 -5 -3 -5 3 2 -5 -4 -3 5 0Z" fill="#FFD23F"/><circle cx="6" cy="-40" r="1.6" fill="#FFD23F"/><circle cx="-6" cy="-10" r="1.6" fill="#FFD23F"/>` },
    crown: { color: "#F2C230", draw: m => `<path d="M-15 0 L-17 -18 L-8 -9 L0 -22 L8 -9 L17 -18 L15 0Z" fill="${m}" ${line}/>
          <circle cx="0" cy="-6" r="3" fill="#D63B3B" stroke="${OL}" stroke-width="1"/><circle cx="-9" cy="-4" r="2" fill="#3C9CE0"/><circle cx="9" cy="-4" r="2" fill="#3CB371"/>
          <circle cx="0" cy="-22" r="2" fill="#fff"/><circle cx="-17" cy="-18" r="1.6" fill="#fff"/><circle cx="17" cy="-18" r="1.6" fill="#fff"/>` },
    // glasses: 0,0 is the eye
    shades: { color: "#1C1A2E", draw: (m, d, l) => `<path d="M-30 -2 L-10 -3" stroke="${m}" stroke-width="3" stroke-linecap="round"/>
          <path d="M-11 -6 L15 -7 Q16 4 7 6 L-3 6 Q-11 5 -11 -6Z" fill="${m}" ${line}/>
          <path d="M-8 -4 L14 -5 Q14 -1 12 0 L-6 1Z" fill="${l}"/><path d="M-4 3 L0 -2 M3 3 L6 -1" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>` },
    starglasses: { color: "#FF5DA2", draw: m => `<path d="M-30 -2 L-11 -2" stroke="${m}" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M0 -12 L3.5 -4 12 -4 5 1.5 7.5 10 0 5 -7.5 10 -5 1.5 -12 -4 -3.5 -4Z" fill="${m}" ${line}/>
          <circle cx="0" cy="0" r="3.5" fill="#fff" opacity=".6"/>` },
    nerd: { color: "#241C10", draw: m => `<path d="M-28 -2 L-9 -1" stroke="${m}" stroke-width="2" stroke-linecap="round"/>
          <circle cx="0" cy="0" r="8.5" fill="#CFE9FF" fill-opacity=".35" stroke="${m}" stroke-width="2.6"/>
          <path d="M-4 -4 Q-1 -6 2 -5" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/>` },
    // neck: 0,0 is the throat
    bowtie: { color: "#D63B3B", draw: (m, d) => `<path d="M0 0 L-11 -7 L-11 7Z M0 0 L11 -7 L11 7Z" fill="${m}" ${line}/><rect x="-3" y="-3.5" width="6" height="7" rx="2" fill="${d}" ${line}/>` },
    scarf: { color: "#E04848", draw: m => `<path d="M-8 0 L-12 22 L-4 22 L-2 2Z" fill="${m}" ${line}/><path d="M-14 -6 Q0 -10 14 -6 L14 4 Q0 0 -14 4Z" fill="${m}" ${line}/>
          <path d="M-7 -8 L-7 2 M0 -9 L0 1 M7 -8 L7 2 M-11 12 L-4 12" stroke="#fff" stroke-width="2.2" opacity=".85"/>` },
    chain: { color: "#F2C230", draw: (m, d) => `<path d="M-14 -6 Q0 14 14 -6" fill="none" stroke="${m}" stroke-width="3" stroke-dasharray="3 1.5"/>
          <circle cx="0" cy="8" r="6.5" fill="${m}" ${line}/>
          <text x="0" y="11" text-anchor="middle" font-family="Bungee, Arial Black, sans-serif" font-size="8" fill="${shade(m, -.5)}">R</text>` },
    // back: 0,0 is the top of the shoulders
    cape: { color: "#C62828", draw: (m, d) => `<path d="M10 -4 Q-24 -22 -66 -12 Q-84 6 -80 34 Q-64 20 -50 30 Q-34 8 12 14Z" fill="${m}" ${line}/>
          <path d="M-56 -8 Q-50 6 -60 22 M-36 -12 Q-30 0 -38 14" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M10 -4 L12 14" stroke="#F2C230" stroke-width="3" stroke-linecap="round"/>` },
    rocket: { color: "#9AA5B1", draw: (m, d, l) => `<rect x="-20" y="-8" width="16" height="30" rx="6" fill="${m}" ${line}/><rect x="-6" y="-6" width="12" height="26" rx="5" fill="${l}" ${line}/>
          <path d="M-18 22 L-12 38 L-6 22Z M-4 20 L0 33 L4 20Z" fill="#FF7A1A"/><path d="M-15 22 L-12 31 L-9 22Z" fill="#FFD23F"/>
          <circle cx="-12" cy="2" r="2.5" fill="#D63B3B"/>` }
  };

  // look.paint = { cap: "blue", ... } → that item's main color (ids from RR.data.shop.paints)
  function paintOf(id, paint) {
    const paints = (RR.data.shop && RR.data.shop.paints) || [];
    const p = paints.find(x => x.id === (paint || {})[id]);
    return p ? p.hex : ACC[id].color;
  }

  const place = (id, a, paint) => {
    if (!id || !ACC[id] || !a) return "";
    const [x, y, r, s] = a, m = paintOf(id, paint);
    return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">${ACC[id].draw(m, shade(m, -.28), shade(m, .25))}</g>`;
  };

  const DEFAULT = { species: "trex", color: "natural", hat: null, eyes: null, neck: null, back: null, paint: {} };

  const ON_TOP = ["rocket"];   // back items that sit on the dino instead of flowing behind it

  RR.art.dinoBody = function (look) {
    const L = Object.assign({}, DEFAULT, look);
    const sp = SPECIES[L.species] || SPECIES.trex, k = skinKit(L.color), a = sp.anchors, p = L.paint;
    const back = place(L.back, a.back, p), onTop = ON_TOP.includes(L.back);
    return k.defs + (onTop ? "" : back) + sp.draw(k) + (onTop ? back : "") +
      place(L.neck, a.neck, p) + place(L.eyes, a.eyes, p) + place(L.hat, a.hat, p);
  };

  // The dino cropped to its head, for a 100x100 picture (leaves room for a hat)
  RR.art.dinoHead = function (look) {
    const L = Object.assign({}, DEFAULT, look);
    let [x, y, w] = (SPECIES[L.species] || SPECIES.trex).head;
    if (L.hat) { x -= w * .1; y -= w * .32; w *= 1.3; }
    const s = 100 / w;
    return `<g transform="translate(${(-x * s).toFixed(1)} ${(-y * s).toFixed(1)}) scale(${s.toFixed(3)})">${RR.art.dinoBody(L)}</g>`;
  };

  RR.art.accessories = ACC;
})();
