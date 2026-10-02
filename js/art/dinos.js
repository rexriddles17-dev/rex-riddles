/* Reusable dinosaur drawings (original art, drawn as SVG). */
RR.art.mascotName = "Rexy";

/* Rexy's body shapes on a 200x200 grid, so any screen can place and scale him. */
RR.art.rexyShapes = `
  <path d="M40 150 Q10 140 5 110 Q30 130 55 125Z" fill="#3E8E4F"/>
  <ellipse cx="85" cy="125" rx="50" ry="38" fill="#4CAF62"/>
  <ellipse cx="90" cy="135" rx="30" ry="22" fill="#B8E07A"/>
  <rect x="65" y="150" width="18" height="36" rx="8" fill="#3E8E4F"/>
  <rect x="98" y="150" width="18" height="36" rx="8" fill="#3E8E4F"/>
  <ellipse cx="74" cy="187" rx="14" ry="6" fill="#2F6F3D"/>
  <ellipse cx="107" cy="187" rx="14" ry="6" fill="#2F6F3D"/>
  <path d="M108 100 Q110 70 135 60 L175 62 Q192 66 190 88 L188 100 Q170 112 140 110 Z" fill="#4CAF62"/>
  <path d="M150 100 L186 98 L182 106 L150 108Z" fill="#fff"/>
  <path d="M152 100 l4 6 4-6 4 6 4-6 4 6 4-6" stroke="#2F6F3D" stroke-width="1.5" fill="none"/>
  <circle cx="160" cy="76" r="9" fill="#fff"/><circle cx="163" cy="77" r="5" fill="#2A1B0E"/>
  <circle cx="165" cy="75" r="1.6" fill="#fff"/>
  <path d="M118 128 q14 2 16 12" stroke="#3E8E4F" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M60 92 l8 -12 8 10 8 -14 8 12" fill="#FF7A1A"/>`;

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
