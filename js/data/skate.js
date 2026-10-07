/*
 * Dino Skate settings. Change the numbers to make it easier or harder.
 *   speeds are in game steps per second (the game is 300 steps tall)
 *   points: 1 point for every 10 steps you skate, plus bonuses below
 *   XP: 1 XP for every `xpEvery` points in a run, up to `xpPerDay` XP each day
 */
RR.data.skate = {
  startSpeed: 260,     // how fast you skate at the start
  maxSpeed: 620,       // top speed
  speedUp: 6,          // how much faster every second
  jump: 720,           // how high you jump (bigger = higher)
  gravity: 2200,       // how fast you fall back down

  eggPoints: 25,       // golden egg
  flipPoints: 10,      // kickflip (tap again while in the air)

  xpEvery: 200,
  xpPerDay: 20,

  // Things to jump over. w/h = size on screen. Add more by drawing them in js/games/skate.js
  obstacles: [
    { id: "rock", w: 40, h: 28 },
    { id: "log",  w: 56, h: 26 },
    { id: "bone", w: 46, h: 22 },
    { id: "bush", w: 38, h: 40 }
  ],

  // Words that pop up when you crash
  wipeouts: ["WIPEOUT!", "BONK!", "OOPS-A-SAURUS!", "FACE PLANT!", "TUMBLE TIME!"]
};
