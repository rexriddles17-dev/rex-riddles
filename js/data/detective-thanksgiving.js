/*
 * Gobble Fest (Thanksgiving) detective cases. They only show while the event is on
 * (event: "thanksgiving", dates in js/data/events.js). Same format as js/data/detective-cases.js.
 */
RR.data.detectiveCases.push(
  {
    id: "tg-pumpkin-pie",
    event: "thanksgiving",
    level: "easy",
    title: "The Pumpkin Pie Puzzle",
    icon: "🥧",
    xp: 20,
    intro: "Rexy's pumpkin pie was cooling on the kitchen windowsill for the Thanksgiving feast. Now the plate is empty! Find the pie snatcher.",
    places: [
      { id: "sill",  name: "Kitchen Windowsill", icon: "🪟",
        clue: "The plate is licked clean. A trail of orange pie crumbs goes from the window toward the race track." },
      { id: "track", name: "Race Track", icon: "🏁",
        clue: "Long, skinny footprints with big gaps between them. Someone ran here super, super fast!" },
      { id: "barn",  name: "Feast Barn", icon: "🛖",
        clue: "A note on the door: 'Anky and Steggy were here all afternoon, building the big feast table.'" },
      { id: "door",  name: "Kitchen Door", icon: "🚪",
        clue: "A little feather with sticky orange pie filling on it is stuck to the door." }
    ],
    suspects: [
      { id: "galli",  name: "Galli the Gallimimus", icon: "💨", color: "#E07A5F",
        says: "Pie? What pie? I was just running laps. I'm the fastest dino around!" },
      { id: "anky",   name: "Anky the Ankylosaurus", icon: "🛡️", color: "#8A5A2E",
        says: "Steggy and I built the feast table in the barn all afternoon. Look how long it is!" },
      { id: "steggy", name: "Steggy the Stegosaurus", icon: "🦕", color: "#4CAF62",
        says: "I was in the barn with Anky. Also, I'm really slow. I couldn't run off with anything!" },
      { id: "rexy",   name: "Rexy the T-Rex", icon: "🦖", color: "#4CAF62",
        says: "That was MY pie! And look at me: I don't have one single feather." }
    ],
    culprit: "galli",
    ending: "Case closed! Galli's fast, skinny feet made the prints, and the crumbs went to the race track. Galli smelled the pie and just couldn't wait. Galli baked Rexy TWO new pies, and everyone shared them at the feast!",
    wrong: "Look at the crumbs and the footprints. Who runs super fast and has feathers?"
  },
  {
    id: "tg-leaf-pile",
    event: "thanksgiving",
    level: "easy",
    title: "The Great Leaf Pile Flop",
    icon: "🍂",
    xp: 20,
    intro: "Everyone raked the biggest leaf pile ever. Then someone flopped right into it, and leaves flew everywhere! Who did the big flop?",
    places: [
      { id: "pile",  name: "Squished Leaf Pile", icon: "🍂",
        clue: "The pile is squished flat in a long, long shape. Whoever flopped in had a super long neck and tail." },
      { id: "path",  name: "Garden Path", icon: "👣",
        clue: "Giant round footprints, as big as a pizza, go right up to the pile." },
      { id: "shed",  name: "Rake Shed", icon: "🧹",
        clue: "A note on the shed: 'Pachy and Para are raking the FRONT yard. Back soon!'" },
      { id: "tree",  name: "Maple Tree", icon: "🍁",
        clue: "Leaves are stuck high up in the branches, way above the ground. Someone tall sneezed them up there. ACHOO!" }
    ],
    suspects: [
      { id: "bronto", name: "Bronto the Brontosaurus", icon: "🦕", color: "#7FB3D5",
        says: "Leaf pile? I didn't see any leaf pile. *ACHOO!* Sorry, I have a leaf up my nose." },
      { id: "tiny",   name: "Tiny the Compy", icon: "🐾", color: "#F2C14E",
        says: "If I jumped in that pile, I'd get lost forever! I'm smaller than a chicken." },
      { id: "pachy",  name: "Pachy the Pachycephalosaurus", icon: "🪖", color: "#C46A3A",
        says: "Para and I were raking the front yard. We made our own pile!" },
      { id: "para",   name: "Para the Parasaurolophus", icon: "🎺", color: "#D96C8A",
        says: "Pachy and I were out front the whole time. Toot toot!" }
    ],
    culprit: "bronto",
    ending: "You cracked it! Bronto's long neck and tail made the long squish, and those giant round prints were Bronto's. Bronto just LOVES jumping in leaves. Everyone raked a new pile, and this time they all jumped in together!",
    wrong: "Look at the shape of the squished pile. Who is super long?"
  },
  {
    id: "tg-cranberry-crash",
    event: "thanksgiving",
    level: "medium",
    title: "The Cranberry Crash",
    icon: "🫐",
    xp: 25,
    intro: "Right before the Thanksgiving feast, the big bowl of cranberry sauce got smashed! Red sauce is everywhere. Find out who made the mess.",
    places: [
      { id: "bowl",  name: "Smashed Bowl", icon: "🥣",
        clue: "The bowl has one big ROUND dent, low down near the floor. Something round and heavy hit it hard." },
      { id: "wall",  name: "Kitchen Wall", icon: "🧱",
        clue: "There's a long scrape on the wall, low to the ground, like a tail swung sideways. There are no holes, so it wasn't spikes." },
      { id: "floor", name: "Kitchen Floor", icon: "🧹",
        clue: "Red sauce footprints go out the door. They are wide and flat with short toes. Not long or skinny." },
      { id: "list",  name: "Chore List", icon: "📋",
        clue: "The chore list says: 'Pachy and Para: set up the chairs in the yard all morning.'" }
    ],
    suspects: [
      { id: "anky",   name: "Anky the Ankylosaurus", icon: "🛡️", color: "#8A5A2E",
        says: "I was just walking past the kitchen. My tail? It swings all the time. I can't help it!" },
      { id: "steggy", name: "Steggy the Stegosaurus", icon: "🦕", color: "#4CAF62",
        says: "My tail has four sharp spikes. They poke holes in everything I bump!" },
      { id: "pachy",  name: "Pachy the Pachycephalosaurus", icon: "🪖", color: "#C46A3A",
        says: "My head is round and hard, but I set up chairs in the yard with Para all morning." },
      { id: "para",   name: "Para the Parasaurolophus", icon: "🎺", color: "#D96C8A",
        says: "Pachy and I set up 40 chairs! I tooted a song the whole time." },
      { id: "galli",  name: "Galli the Gallimimus", icon: "💨", color: "#E07A5F",
        says: "My feet are long and skinny. I run on my tippy toes!" }
    ],
    culprit: "anky",
    ending: "Great work! Anky's big round tail club swung low, scraped the wall and smashed the bowl. It was an accident! Anky helped clean up and made a new batch of cranberry sauce. Extra sweet!",
    wrong: "Look at the dent, the scrape and the footprints again. Whose tail is round and heavy?"
  },
  {
    id: "tg-parade-balloon",
    event: "thanksgiving",
    level: "hard",
    title: "The Runaway Parade Balloon",
    icon: "🎈",
    xp: 30,
    intro: "The giant pumpkin balloon for the Gobble Fest Parade floated away! Someone untied its rope. Careful, Detective: one suspect is not telling the truth.",
    places: [
      { id: "rope",   name: "Untied Rope", icon: "🪢",
        clue: "The knot was untied, not chewed or cut. Whoever did it has clever hands with claws." },
      { id: "clock",  name: "Town Clock", icon: "🕗",
        clue: "Mr. Owl saw the balloon float away at 8 o'clock in the morning." },
      { id: "bakery", name: "Bakery Window", icon: "🥐",
        clue: "A sign on the bakery: 'CLOSED all morning. Our oven broke! No muffins today. Sorry!'" },
      { id: "street", name: "Muddy Street", icon: "🟫",
        clue: "Lots and lots of footprints. The whole town walked here to see the parade." },
      { id: "race",   name: "Turkey Trot Race", icon: "🏃",
        clue: "The Turkey Trot race started at 8 o'clock. The winner's photo shows Galli crossing the finish line!" }
    ],
    suspects: [
      { id: "rizzo",  name: "Rizzo the Raptor", icon: "🦖", color: "#5B8DEF",
        says: "At 8 o'clock I was at the bakery, eating a warm blueberry muffin. Yum!" },
      { id: "galli",  name: "Galli the Gallimimus", icon: "💨", color: "#E07A5F",
        says: "I have hands, but at 8 o'clock I was running in the Turkey Trot. I won!" },
      { id: "bronto", name: "Bronto the Brontosaurus", icon: "🦕", color: "#7FB3D5",
        says: "I don't have hands. Just four big round feet!" },
      { id: "rexy",   name: "Rexy the T-Rex", icon: "🦖", color: "#4CAF62",
        says: "My arms are way too short to untie a knot. I can't even tie my own shoes!" },
      { id: "para",   name: "Para the Parasaurolophus", icon: "🎺", color: "#D96C8A",
        says: "My hands are clumsy! I can't untie knots. I was tooting in the parade band." }
    ],
    culprit: "rizzo",
    ending: "Amazing detective work! Rizzo said he ate a muffin at the bakery, but the bakery was closed all morning. Rizzo untied the balloon to see if it could fly him up to the clouds. It couldn't! Petey the Pterodactyl flew up and towed the balloon back just in time for the parade.",
    wrong: "Their story checks out."
  }
);
