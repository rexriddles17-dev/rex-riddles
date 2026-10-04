/* Reusable dinosaur drawings (original art, drawn as SVG). */
RR.art.mascotName = "Rexy";

/*
 * Rexy on a 200x200 grid (feet at y≈187, facing right), so any screen can place and scale him.
 * Cool mode: wraparound shades, lava back spikes, tiger stripes, fist pump.
 * The tail is in <g class="rexy-tail"> and the lens shine in <g class="rexy-glint"> so CSS can animate them.
 */
(function () {
  const O = 'stroke="#2A1B0E" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const C = "#4CAF62", D = "#2F7A43", L = "#C6E88A";
  const spike = (x, y, s, r) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
    <path d="M-7 4 L0 -14 L7 4Z" fill="#FF7A1A" ${O}/><path d="M-2.5 0 L0 -8 L2.5 0Z" fill="#FFD23F"/></g>`;

  RR.art.rexyShapes = `
  <g class="rexy-tail">
    ${spike(51, 80, .95, 40)}${spike(35, 65, .8, 40)}${spike(21, 51, .65, 40)}
    <path d="M72 100 Q30 70 6 44 Q30 88 80 144Z" fill="${C}" ${O}/>
    <path d="M54 90 l-8 9 M38 74 l-7 8 M24 59 l-5 6" stroke="${D}" stroke-width="4.5" stroke-linecap="round"/>
  </g>
  <ellipse cx="80" cy="150" rx="16" ry="19" fill="${D}" ${O}/>
  <path d="M72 160 L66 182 L86 182 L86 162Z" fill="${D}" ${O}/>
  <path d="M60 188 Q62 179 76 179 Q90 179 92 188Z" fill="${D}" ${O}/>
  ${spike(66, 104, 1, -35)}${spike(76, 90, 1.15, -20)}${spike(92, 82, 1.25, -5)}${spike(108, 80, 1.15, 8)}${spike(122, 76, 1, 15)}
  <path d="M60 112 Q68 82 110 84 Q142 88 148 114 Q150 148 118 158 Q80 164 62 140Z" fill="${C}" ${O}/>
  <ellipse cx="118" cy="126" rx="19" ry="28" transform="rotate(-22 118 126)" fill="${L}"/>
  <path d="M104 112 Q118 117 132 110 M102 126 Q118 131 134 124 M104 140 Q118 145 130 138" fill="none" stroke="#9CCB5E" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M78 92 q5 10 1 19 M92 87 q5 10 1 19 M106 86 q5 9 1 17" fill="none" stroke="${D}" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="102" cy="148" rx="23" ry="21" fill="${C}" ${O}/>
  <path d="M90 144 q8 -8 20 -6" fill="none" stroke="${D}" stroke-width="4" stroke-linecap="round"/>
  <path d="M100 162 Q106 176 102 184 L120 184 Q116 172 118 158Z" fill="${C}" ${O}/>
  <path d="M94 189 Q96 179 110 179 Q126 179 130 189Z" fill="${D}" ${O}/>
  <path d="M124 184 l9 2 -8 3Z M116 183 l8 2 -7 3Z" fill="#fff" stroke="#2A1B0E" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M120 98 Q122 72 140 62 L158 92 Q148 106 134 110Z" fill="${C}" ${O}/>
  <path d="M124 70 Q124 36 156 30 L182 30 Q198 32 198 48 L198 62 Q194 78 172 80 L146 81 Q128 81 124 70Z" fill="${C}" ${O}/>
  <path d="M150 64 Q170 70 196 58" fill="none" ${O}/>
  <path d="M154 65 l3 7 4 -5 4 7 4 -6 4 7 4 -7 4 6 4 -8 3 3" fill="#fff" stroke="#2A1B0E" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M146 76 Q170 84 192 70" fill="none" stroke="${D}" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="190" cy="40" r="2.2" fill="#2A1B0E"/>
  <path d="M146 40 L128 46" stroke="#1C1A2E" stroke-width="5" stroke-linecap="round"/>
  <path d="M142 38 L188 35 Q190 50 178 53 L160 54 Q146 53 142 38Z" fill="#1C1A2E" ${O}/>
  <path d="M146 40 L186 37 Q187 43 182 46 L150 47Z" fill="#3B3870"/>
  <g class="rexy-glint"><path d="M152 46 L158 40 M162 46 L167 41" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>
  <path d="M126 106 Q142 108 148 94" fill="none" stroke="#2A1B0E" stroke-width="11" stroke-linecap="round"/>
  <path d="M126 106 Q142 108 148 94" fill="none" stroke="${C}" stroke-width="6" stroke-linecap="round"/>
  <circle cx="149" cy="93" r="6" fill="${C}" ${O}/>
  <path d="M152 88 l5 -4 1 5Z M154 93 l6 -1 -3 5Z" fill="#fff" stroke="#2A1B0E" stroke-width="1.3" stroke-linejoin="round"/>`;
})();

/* Full-size Rexy as a standalone picture. */
RR.art.rexy = (cls = "") =>
  `<svg class="${cls}" viewBox="0 0 200 200" role="img" aria-label="${RR.art.mascotName} the T-Rex">${RR.art.rexyShapes}</svg>`;

/* Dino fossil skeleton (scene coordinates used by Hangman). */
RR.art.fossil = `
  <g fill="none" stroke="#7A5A3A" stroke-width="2.5" stroke-linecap="round">
    <path d="M66 140 Q90 128 112 136"/>
    <path d="M74 137 v8 M82 134 v9 M90 132 v10 M98 132 v9 M106 134 v8"/>
    <path d="M66 140 Q56 146 46 142"/>
    <path d="M112 136 l6 -6 h12 q6 0 6 6 l-2 6 h-14 z" fill="#F3EBD3"/>
    <circle cx="126" cy="134" r="2" fill="#7A5A3A" stroke="none"/>
    <path d="M120 142 l2 3 2 -3 2 3 2 -3"/>
  </g>`;
