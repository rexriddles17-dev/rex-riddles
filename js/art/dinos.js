/* Reusable dinosaur drawings (original art, drawn as SVG). */
RR.art.mascotName = "Rexy";

/*
 * Rexy on a 200x200 grid (feet at y≈187, facing right), so any screen can place and scale him.
 * Realistic style: real T. rex shape (big head, level back, long tail, tiny 2-finger arms),
 * olive skin that is darker on top and pale underneath, and a scaly texture.
 * Friendly on purpose: calm eye, mouth closed. The tail is in <g class="rexy-tail"> so CSS can wag it.
 */
(function () {
  const line = 'stroke="#241C10" stroke-width="1.6" stroke-linejoin="round"';
  // Gradients + scale texture (ids are shared; every copy defines them the same way)
  const defs = `<defs>
    <linearGradient id="rexSkin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3F4A22"/><stop offset=".45" stop-color="#6E7A3C"/><stop offset=".8" stop-color="#A49A62"/><stop offset="1" stop-color="#D6C79A"/>
    </linearGradient>
    <linearGradient id="rexSkinFar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2E3618"/><stop offset="1" stop-color="#5C5A36"/>
    </linearGradient>
    <linearGradient id="rexBelly" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#B9AE7A" stop-opacity="0"/><stop offset="1" stop-color="#E4D7AC"/>
    </linearGradient>
    <pattern id="rexScales" width="6" height="5" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r=".7" fill="#1E2410" opacity=".22"/><circle cx="4.5" cy="4" r=".8" fill="#fff" opacity=".08"/>
    </pattern>
  </defs>`;
  const skin = d => `<path d="${d}" fill="url(#rexSkin)" ${line}/><path d="${d}" fill="url(#rexScales)"/>`;
  const far = d => `<path d="${d}" fill="url(#rexSkinFar)" ${line}/><path d="${d}" fill="url(#rexScales)"/>`;

  const TAIL = "M92 80 Q58 78 30 85 Q12 90 2 95 Q14 99 32 102 Q62 108 88 122Z";
  const BODY = "M74 90 Q96 72 132 74 Q150 76 158 90 Q160 108 148 120 Q128 132 104 128 Q82 124 72 110Z";
  const NECK = "M136 76 Q148 64 160 58 L170 84 Q160 100 150 108 Q146 92 136 86Z";
  const HEAD = "M150 56 Q152 42 168 40 L184 42 Q197 45 199 56 L198 68 Q194 76 182 78 L164 80 Q153 79 150 72Z";
  const JAW = "M156 72 L196 68 Q194 78 180 82 L166 84 Q158 82 156 72Z";
  const THIGH = "M88 96 Q112 84 127 104 Q131 124 119 140 Q105 147 94 137 Q84 120 88 96Z";
  const SHIN = "M108 132 L124 136 L113 168 L100 166Z";
  const FOOT = "M99 163 L113 165 L132 179 L146 182 Q149 186 145 188 L100 188 Q95 180 99 163Z";
  const FAR_THIGH = "M76 98 Q98 88 110 106 Q113 124 103 138 Q91 144 82 134 Q72 120 76 98Z";
  const FAR_SHIN = "M92 132 L106 136 L97 166 L85 164Z";
  const FAR_FOOT = "M84 161 L97 163 L114 176 L126 180 Q129 184 125 186 L86 186 Q80 178 84 161Z";

  RR.art.rexyShapes = `${defs}
  ${far(FAR_THIGH)}${far(FAR_SHIN)}${far(FAR_FOOT)}
  <g class="rexy-tail">${skin(TAIL)}
    <path d="M30 92 q4 -3 8 0 M46 90 q5 -4 10 0 M62 88 q5 -4 10 0" fill="none" stroke="#2C3418" stroke-width="2" opacity=".45" stroke-linecap="round"/>
  </g>
  ${skin(BODY)}
  <path d="M84 112 Q110 132 146 118 Q130 130 104 128 Q86 124 84 112Z" fill="url(#rexBelly)"/>
  <path d="M90 82 q4 6 2 12 M104 76 q4 7 2 13 M118 74 q4 7 2 13 M132 76 q3 6 1 12" fill="none" stroke="#2C3418" stroke-width="2.5" opacity=".4" stroke-linecap="round"/>
  ${skin(NECK)}
  <path d="M152 86 q6 4 8 10 M148 94 q6 3 7 9" fill="none" stroke="#2C3418" stroke-width="1.4" opacity=".5" stroke-linecap="round"/>
  ${skin(THIGH)}
  <path d="M98 104 Q112 96 122 108 M100 128 Q108 134 116 130" fill="none" stroke="#2C3418" stroke-width="1.6" opacity=".45" stroke-linecap="round"/>
  ${skin(SHIN)}${skin(FOOT)}
  <path d="M144 182 l6 3 -6 2Z M133 181 l6 3 -6 2Z M122 182 l5 3 -5 2Z" fill="#CFC2A0" stroke="#241C10" stroke-width=".9"/>
  <path d="M118 187 L121 176 M130 187 L132 180" stroke="#2C3418" stroke-width="1.2" opacity=".5"/>
  <path d="M148 104 Q156 106 160 112" fill="none" stroke="#241C10" stroke-width="6.5" stroke-linecap="round"/>
  <path d="M148 104 Q156 106 160 112" fill="none" stroke="#6E7A3C" stroke-width="4" stroke-linecap="round"/>
  <path d="M160 112 l4 1 M159 113 l3 3" stroke="#E9DFC4" stroke-width="1.5" stroke-linecap="round"/>
  ${skin(JAW)}
  ${skin(HEAD)}
  <path d="M158 72 L196 67" fill="none" stroke="#241C10" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M164 71 l1.5 4 1.5 -4 M171 70 l1.5 4 1.5 -4 M178 69 l1.5 4 1.5 -4 M185 68 l1.5 3.5 1.5 -3.5 M191 67.5 l1.2 3 1.2 -3"
        fill="#F2EAD3" stroke="#241C10" stroke-width=".8"/>
  <ellipse cx="160" cy="62" rx="5" ry="3.5" fill="#2C3418" opacity=".35"/>
  <path d="M160 49 Q166 44 173 47" fill="none" stroke="#2C3418" stroke-width="3" stroke-linecap="round"/>
  <circle cx="167" cy="52" r="3.4" fill="#D89A2B" stroke="#241C10" stroke-width="1"/>
  <circle cx="167.5" cy="52" r="1.6" fill="#120E08"/><circle cx="168.6" cy="51" r=".6" fill="#fff"/>
  <path d="M190 47 q3 -1 4 1" fill="none" stroke="#241C10" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M176 44 q4 -2 8 0 M154 52 q2 -3 5 -4" fill="none" stroke="#2C3418" stroke-width="1.3" opacity=".5" stroke-linecap="round"/>`;
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
