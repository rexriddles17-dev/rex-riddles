/*
 * Daily Detective case generator. Builds a brand-new case from today's date,
 * so every friend gets the same mystery on the same day.
 * The building blocks (dinos, clues, places) live in js/data/detective-daily.js.
 *
 * There is one case per level (easy / medium / hard), settings in js/data/detective-levels.js.
 *
 * Fair-play rule: every clue matches the culprit, and every other suspect is
 * missing at least `minMissing` of the 4 clues and says so when you talk to them.
 * Easy (minMissing 2): any 3 clues solve it. Medium/Hard (minMissing 1): you need all 4.
 */
RR.detectiveDaily = (function () {
  const { seededRandom, todayKey, shuffle } = RR.daily;
  const pick = (list, rand) => list[Math.floor(rand() * list.length)];

  function listJoin(items) {
    return items.length > 1 ? items.slice(0, -1).join(", ") + ", and " + items[items.length - 1] : items[0];
  }

  function build(dateKey, levelId) {
    const D = RR.data.dailyDetective;
    levelId = levelId || "easy";
    const L = RR.data.detectiveLevels[levelId].daily;
    // Easy keeps the original seed so its case didn't change when levels were added
    const rand = seededRandom("rex-riddles:" + dateKey + (levelId === "easy" ? "" : ":" + levelId));
    const scene = pick(D.scenes, rand);
    const missingCount = (d, clues) => clues.filter(t => !d.traits.includes(t)).length;

    for (const culprit of shuffle(D.dinos.filter(d => d.traits.length >= 4), rand)) {
      const clueTraits = shuffle(culprit.traits, rand).slice(0, 4);
      let pool = shuffle(D.dinos.filter(d => d !== culprit && missingCount(d, clueTraits) >= L.minMissing), rand);
      // Harder levels pick look-alike suspects: the ones that match the most clues
      if (L.minMissing < 2) pool.sort((a, b) => missingCount(a, clueTraits) - missingCount(b, clueTraits));
      const innocents = pool.slice(0, L.suspects - 1);
      if (innocents.length < L.suspects - 1) continue;

      const places = shuffle(scene.places, rand).map((p, i) =>
        ({ id: "p" + i, name: p[0], icon: p[1], clue: D.traits[clueTraits[i]].clue }));
      if (L.decoy) {
        const d = pick(D.decoys, rand);
        places.splice(Math.floor(rand() * (places.length + 1)), 0, { id: "decoy", name: d[0], icon: d[1], clue: d[2] });
      }
      const first = culprit.name.split(" ")[0];
      const item = scene.item.replace(/^the /, "");
      const title = "The Case of the Missing " + item.replace(/\b\w/g, ch => ch.toUpperCase());

      // Each innocent's alibi is a clue trait they don't have (try not to repeat alibis)
      const usedAlibis = [];
      const suspects = shuffle([culprit].concat(innocents), rand).map(d => {
        let says = pick(D.nervous, rand);
        if (d === culprit && L.calm) {
          // A calm, true alibi about something that isn't one of the clues
          says = D.traits[pick(Object.keys(D.traits).filter(t => !culprit.traits.includes(t)), rand)].no;
        } else if (d !== culprit) {
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
        level: levelId,
        xp: L.xp,
        intro: "Oh no! " + scene.item[0].toUpperCase() + scene.item.slice(1) + " went missing from " + scene.where +
               "! Search for clues, talk to the suspects, and find the thief.",
        places,
        suspects,
        culprit: culprit.id,
        ending: "Case closed! Only " + first + " " + listJoin(clueTraits.map(t => D.traits[t].has)) + ". " +
                first + " " + pick(D.reasons, rand) + " " + first + " said sorry and gave back " + scene.item + ".",
        wrong: "Check your notebook. Does that dino match every clue?"
      };
    }
    return null;   // only if the data can't make a fair case
  }

  return { todayKey, build, today: levelId => build(todayKey(), levelId) };
})();
