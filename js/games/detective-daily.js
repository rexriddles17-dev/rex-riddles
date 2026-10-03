/*
 * Daily Detective case generator. Builds a brand-new case from today's date,
 * so every friend gets the same mystery on the same day.
 * The building blocks (dinos, clues, places) live in js/data/detective-daily.js.
 *
 * Fair-play rule: every clue matches the culprit, and every other suspect is
 * missing at least 2 of the 4 clues. So any 3 clues are enough to solve it.
 */
RR.detectiveDaily = (function () {
  // Same text in → same random numbers out
  function seededRandom(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
    return function () {
      h = (h + 0x6D2B79F5) | 0;
      let t = Math.imul(h ^ (h >>> 15), 1 | h);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function todayKey(date) {
    const d = date || new Date();
    const pad = n => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function shuffle(list, rand) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const pick = (list, rand) => list[Math.floor(rand() * list.length)];

  function listJoin(items) {
    return items.length > 1 ? items.slice(0, -1).join(", ") + ", and " + items[items.length - 1] : items[0];
  }

  function build(dateKey) {
    const D = RR.data.dailyDetective;
    const rand = seededRandom("rex-riddles:" + dateKey);
    const scene = pick(D.scenes, rand);

    for (const culprit of shuffle(D.dinos.filter(d => d.traits.length >= 4), rand)) {
      const clueTraits = shuffle(culprit.traits, rand).slice(0, 4);
      const innocents = shuffle(D.dinos.filter(d =>
        d !== culprit && clueTraits.filter(t => !d.traits.includes(t)).length >= 2), rand).slice(0, 3);
      if (innocents.length < 3) continue;

      const places = shuffle(scene.places, rand);
      const first = culprit.name.split(" ")[0];
      const item = scene.item.replace(/^the /, "");
      const title = "The Case of the Missing " + item.replace(/\b\w/g, ch => ch.toUpperCase());

      // Each innocent's alibi is a clue trait they don't have (try not to repeat alibis)
      const usedAlibis = [];
      const suspects = shuffle([culprit].concat(innocents), rand).map(d => {
        let says = pick(D.nervous, rand);
        if (d !== culprit) {
          const missing = clueTraits.filter(t => !d.traits.includes(t));
          const fresh = missing.filter(t => !usedAlibis.includes(t));
          const t = pick(fresh.length ? fresh : missing, rand);
          usedAlibis.push(t);
          says = D.traits[t].no;
        }
        return { id: d.id, name: d.name, icon: d.icon, color: d.color, says };
      });

      return {
        id: "daily",
        daily: true,
        date: dateKey,
        title,
        icon: scene.icon,
        xp: D.xp,
        intro: "Oh no! " + scene.item[0].toUpperCase() + scene.item.slice(1) + " went missing from " + scene.where +
               "! Search for clues, talk to the suspects, and find the thief.",
        places: places.map((p, i) => ({ id: "p" + i, name: p[0], icon: p[1], clue: D.traits[clueTraits[i]].clue })),
        suspects,
        culprit: culprit.id,
        ending: "Case closed! Only " + first + " " + listJoin(clueTraits.map(t => D.traits[t].has)) + ". " +
                first + " " + pick(D.reasons, rand) + " " + first + " said sorry and gave back " + scene.item + ".",
        wrong: "Check your notebook. Does that dino match every clue?"
      };
    }
    return null;   // only if the data can't make a fair case
  }

  return { todayKey, build, today: () => build(todayKey()) };
})();
