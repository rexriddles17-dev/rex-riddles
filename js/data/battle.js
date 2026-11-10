/*
 * Dino Battle settings: taekwondo-style sparring. Change the numbers to make matches easier or harder.
 *
 *   match:   best of 3 rounds. Each round lasts roundSeconds; most points wins the round.
 *            A tie goes to Golden Point: the next point wins (up to goldenSeconds).
 *            ringOut = points the other dino gets when you are pushed off the mat (a "gam-jeom").
 *   moves:   the kicks every dino has. Times are in milliseconds:
 *              windup = getting ready (you can be hit out of it), active = the kick, recover = getting back
 *            pts = points it scores, reach = how far it lands, push = how far it knocks the other dino back
 *   species: your dino's strengths, by kind (speed 1 = normal, reach = extra kick reach)
 *            special = the big move. It is ready after specialCharge good hits or blocks. Specials can't be blocked!
 *              kind: spin    = a spinning tail kick
 *                    double  = two quick kicks (then = the second kick)
 *                    rush    = dash forward (dash = how far) and kick
 *                    counter = a guard stance: if they kick you during it, you block and kick back
 *                    long    = an extra-long kick
 *   rivals:  the dinos you spar with, easiest first. Beat one to unlock the next.
 *            species/color/hat/eyes/neck/back use the ids from js/data/shop.js
 *            speed = how fast they move, think = ms between their choices (smaller = faster),
 *            guard = chance they block a kick they see coming, spin = how often they try spin kicks
 *            xp = XP for beating them the first time
 */
RR.data.battle = {
  match: { rounds: 3, roundSeconds: 30, goldenSeconds: 15, ringOut: 1 },
  walkSpeed: 120,          // mat steps per second

  moves: {
    kick:  { name: "Kick",      icon: "🦶", pts: 2, windup: 150, active: 110, recover: 230, reach: 86,  push: 22, lunge: 10, tip: "Fast · 2 points" },
    spin:  { name: "Spin Kick", icon: "🌀", pts: 4, windup: 360, active: 140, recover: 380, reach: 100, push: 38, lunge: 14, spin: true, tip: "Slow · 4 points" },
    block: { name: "Block",     icon: "✋", push: 10, tip: "Hold to guard" }
  },
  specialCharge: 3,        // good hits or blocks before your special move is ready

  species: {
    trex:    { speed: 1,    reach: 0,  special: { name: "Thunder Tail Spin", kind: "spin",    pts: 5, windup: 300, active: 160, recover: 360, reach: 112, push: 50, lunge: 12, spin: true } },
    raptor:  { speed: 1.18, reach: 0,  special: { name: "Double Flash Kick", kind: "double",  pts: 2, windup: 110, active: 100, recover: 120, reach: 90,  push: 14, lunge: 10,
               then: { pts: 3, windup: 90, active: 110, recover: 300, reach: 94, push: 32, lunge: 14 } } },
    trike:   { speed: .95,  reach: 0,  special: { name: "Horn Rush",         kind: "rush",    pts: 3, windup: 320, active: 150, recover: 320, reach: 86,  push: 70, lunge: 16, dash: 80 } },
    stego:   { speed: .9,   reach: 0,  special: { name: "Spike Guard",       kind: "counter", pts: 3, active: 1400, push: 44 } },
    brachio: { speed: .85,  reach: 14, special: { name: "Long Neck Axe Kick", kind: "long",   pts: 4, windup: 280, active: 150, recover: 360, reach: 145, push: 34, lunge: 10 } }
  },

  // Training Gym: your dino trains with quick drills to get better. Pass a drill = that skill goes up 1 level.
  //   drill "tap"    = tap as fast as you can before time runs out (need = taps, +needUp each level)
  //   drill "timing" = tap when the marker is in the green zone (need 3 good taps out of 5; the zone shrinks each level)
  //   per = how much better each level makes you, levels = top level
  //   (the ids are older names kept so saved training still counts)
  upgrades: [
    { id: "hp",     name: "Fast Feet",     icon: "👟", per: .06, levels: 5, tip: "Move 6% faster",
      drill: "tap",    title: "Jog laps!",          action: "RUN!",     need: 22, needUp: 4 },
    { id: "power",  name: "Snappy Kicks",  icon: "🦶", per: .06, levels: 5, tip: "Kicks start 6% faster",
      drill: "timing", title: "Kick the pads!",     action: "KICK!",    target: "🎯" },
    { id: "armor",  name: "Steady Stance", icon: "🧱", per: .1,  levels: 5, tip: "Get pushed back 10% less",
      drill: "timing", title: "Block the coconuts!", action: "BLOCK!",  target: "🥥" },
    { id: "snacks", name: "Long Legs",     icon: "📏", per: 5,   levels: 3, tip: "Kicks reach a bit farther",
      drill: "tap",    title: "Stretch it out!",    action: "STRETCH!", need: 26, needUp: 5 },
    { id: "charge", name: "Quick Ki",      icon: "⚡", per: 1,   levels: 2, tip: "Special ready 1 hit sooner",
      drill: "timing", title: "Catch the lightning!", action: "ZAP!",   target: "⚡" }
  ],
  tapSeconds: 6,           // how long a tap drill lasts
  trainingPerDay: 5,       // drills a day before your dino is too tired (comes back tomorrow)

  rivals: [
    { id: "pip",   name: "Pip Pebbles",     species: "raptor",  color: "sand",    speed: .7,  think: 700, guard: .1,  spin: .1,  xp: 5,  hat: "cap" },
    { id: "muddy", name: "Muddy Max",       species: "stego",   color: "natural", speed: .8,  think: 600, guard: .2,  spin: .15, xp: 10, neck: "bowtie" },
    { id: "spark", name: "Sir Sprinkles",   species: "trike",   color: "purple",  speed: .85, think: 520, guard: .3,  spin: .2,  xp: 15, hat: "party" },
    { id: "zippy", name: "Zippy Zoom",      species: "raptor",  color: "ocean",   speed: 1.05, think: 440, guard: .35, spin: .25, xp: 20, eyes: "shades" },
    { id: "lenny", name: "Long Lenny",      species: "brachio", color: "jungle",  speed: .95, think: 360, guard: .5,  spin: .3,  xp: 25, neck: "scarf" },
    { id: "king",  name: "King Thunderjaw", species: "trex",    color: "lava",    speed: 1.05, think: 280, guard: .65, spin: .35, xp: 30, hat: "crown", back: "cape" }
  ],

  // Rematches against rivals you already beat
  rematchXP: 2,
  rematchXpPerDay: 10,

  // What the referee says (real taekwondo words, with what they mean)
  calls: {
    bow:   ["Kyeong-rye!", "Bow!"],
    ready: ["Joon-bi!", "Get ready!"],
    begin: ["Shi-jak!", "Begin!"],
    brk:   ["Kal-yeo!", "Break!"],
    stop:  ["Keu-man!", "Stop!"]
  },
  cheers: ["Nice kick!", "Great hit!", "Point!", "Awesome!"]
};
