/* Reusable dinosaur drawings (original art, drawn as SVG). */
RR.art.mascotName = "Rexy";

/* Rexy, the mascot: the natural T-Rex from js/art/bodies.js (200x200, feet at y≈187). */
RR.art.rexyShapes = RR.art.dinoBody({ species: "trex", color: "natural" });

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
