/*
 * Dino Detective cases. Write your own!
 * Each case needs: places (each hides one clue), suspects (each says something),
 * the culprit's id, and an ending. Clues should point to the culprit so players can work it out.
 */
RR.data.detectiveCases = [
  {
    id: "golden-egg",
    title: "The Missing Golden Egg",
    icon: "🥚",
    xp: 20,
    intro: "Rexy's shiny golden egg was in a nest on top of Tall Cliff. This morning it was gone! Search for clues, talk to the suspects, then name the egg-napper.",
    places: [
      { id: "nest",  name: "The Empty Nest", icon: "🪺",
        clue: "The nest is at the very top of Tall Cliff. The rocks are too steep to climb. You would need wings to get up here!" },
      { id: "cliff", name: "Bottom of the Cliff", icon: "🏔️",
        clue: "Giant footprints with three round toes stop at the bottom of the cliff. They don't go up. Whoever made them stayed on the ground." },
      { id: "lake",  name: "Sleepy Lake", icon: "🏞️",
        clue: "The ducks say a big spiky dino snored by the lake all night. 'So loud!' they quack." },
      { id: "tree",  name: "Tallest Tree", icon: "🌳",
        clue: "A small nest at the top of the tree is full of shiny things: a bottle cap, a gold leaf, and a sparkly stone. Someone here LOVES shiny stuff." }
    ],
    suspects: [
      { id: "tara",   name: "Tara the Triceratops", icon: "🦏", color: "#C9A227",
        says: "I was eating ferns at the bottom of the cliff. I'm way too heavy to climb up there!" },
      { id: "steggy", name: "Steggy the Stegosaurus", icon: "🦕", color: "#4CAF62",
        says: "Huh? Egg? I was asleep by the lake all night. Ask the ducks." },
      { id: "petey",  name: "Petey the Pterodactyl", icon: "🪽", color: "#E07A5F",
        says: "Me? I was just, um, flying around. Looking at… nothing shiny. Nope." },
      { id: "milo",   name: "Milo the Mini Raptor", icon: "🦖", color: "#5B8DEF",
        says: "I can run super fast, but I can't fly! Wings would be so cool though." }
    ],
    culprit: "petey",
    ending: "You got it, Detective! Only Petey could fly up to the nest, and he loves shiny things. He says sorry. He thought the egg looked cold and wanted to keep it warm. The egg is back home, safe and sound!",
    wrong: "Hmm, look at your clues again. How could someone get up to that nest?"
  },
  {
    id: "treetop-snack",
    title: "The Treetop Snack Attack",
    icon: "🌿",
    xp: 20,
    intro: "The Dino Party is tonight, but someone ate all the leaves off the party trees! Find out who the hungry snacker was.",
    places: [
      { id: "trees",  name: "Party Trees", icon: "🌳",
        clue: "Only the leaves at the very TOP of the tallest trees are gone. The low leaves are fine. The snacker must have a super long neck." },
      { id: "ground", name: "Muddy Path", icon: "👣",
        clue: "Huge round footprints, as big as a pool float, go right up to the trees." },
      { id: "cave",   name: "Rexy's Cave", icon: "🕳️",
        clue: "Rexy's lunch box is full of meat. A sign on the wall says: 'Rexy does NOT eat leaves. Yuck!'" },
      { id: "bush",   name: "Short Bushes", icon: "🌱",
        clue: "Someone with a club tail was munching low bushes here. They didn't touch the tall trees at all." }
    ],
    suspects: [
      { id: "rexy",  name: "Rexy the T-Rex", icon: "🦖", color: "#4CAF62",
        says: "Leaves? Gross! I only eat meat. And my arms are too short to reach anything!" },
      { id: "anky",  name: "Anky the Ankylosaurus", icon: "🛡️", color: "#8A5A2E",
        says: "I'm low to the ground. I only eat the little bushes down here." },
      { id: "bree",  name: "Bree the Brachiosaurus", icon: "🦕", color: "#7FB3D5",
        says: "Oh, the treetops? They looked SO tasty… I mean, I didn't see anything!" },
      { id: "tiny",  name: "Tiny the Compy", icon: "🐾", color: "#F2C14E",
        says: "I'm smaller than a chicken! I can't even see the treetops!" }
    ],
    culprit: "bree",
    ending: "Case closed! Bree's long neck reaches the treetops, and her giant round feet made those prints. She was just really hungry. She's planting new trees for the party to make up for it!",
    wrong: "Not quite. Who could reach the very top of the tallest trees?"
  },
  {
    id: "museum-mess",
    title: "The Museum Mess",
    icon: "🏛️",
    xp: 25,
    intro: "Someone knocked over the fossil display at the Dino Museum last night! The stand has a mark on it. Find out who did it.",
    places: [
      { id: "stand",  name: "Fossil Stand", icon: "🦴",
        clue: "There's a big ROUND dent in the stand, like something heavy and ball-shaped hit it. Not a hole, and not a scratch." },
      { id: "floor",  name: "Museum Floor", icon: "🧹",
        clue: "Wide, low footprints in the dust. Whoever made them walks close to the ground." },
      { id: "camera", name: "Security Camera", icon: "📹",
        clue: "The video is blurry, but you can hear a giant sneeze, then a CLONK!" },
      { id: "door",   name: "Back Door", icon: "🚪",
        clue: "The door has tiny claw scratches, but they are old and dusty. They were made a long time ago." }
    ],
    suspects: [
      { id: "spike",  name: "Spike the Stegosaurus", icon: "🦕", color: "#4CAF62",
        says: "My tail has pointy spikes. If I hit something, it would have holes in it, not a dent!" },
      { id: "velma",  name: "Velma the Velociraptor", icon: "🦖", color: "#5B8DEF",
        says: "My claws scratch things, sure. But I was home last night. Achoo-free!" },
      { id: "trixie", name: "Trixie the Triceratops", icon: "🦏", color: "#C9A227",
        says: "My horns poke holes. And I'm too tall to make low footprints." },
      { id: "anky2",  name: "Anky the Ankylosaurus", icon: "🛡️", color: "#8A5A2E",
        says: "*sniff* I had a really bad cold last night… *sniff* Why do you ask?" }
    ],
    culprit: "anky2",
    ending: "Brilliant detective work! Anky's tail ends in a big round club. He sneezed so hard his tail swung and CLONKED the stand. It was an accident! He's helping the museum fix it.",
    wrong: "Close! What kind of tail would make a round dent?"
  }
];
