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
  },
  {
    id: "cookie-caper",
    title: "The Cookie Jar Caper",
    icon: "🍪",
    xp: 20,
    intro: "Grandma Dino baked a jar of cookies for the bake sale. When she came back, the jar was empty! Find the cookie crook.",
    places: [
      { id: "shelf",  name: "Tall Shelf", icon: "🫙",
        clue: "The cookie jar was on a very high shelf. Short arms could never reach it. The crook has long arms!" },
      { id: "floor",  name: "Bakery Floor", icon: "💧",
        clue: "Wet, drippy puddles go from the door to the shelf. The crook was soaking wet!" },
      { id: "window", name: "Bakery Window", icon: "🪟",
        clue: "Grandma saw a shadow go past the window. It had a big, tall SAIL on its back." },
      { id: "river",  name: "Rushing River", icon: "🌊",
        clue: "Cookie crumbs are floating in the river. Someone ate cookies while swimming!" }
    ],
    suspects: [
      { id: "rexy",  name: "Rexy the T-Rex", icon: "🦖", color: "#4CAF62",
        says: "A high shelf? My arms are so short, I can't even scratch my nose!" },
      { id: "spino", name: "Spino the Spinosaurus", icon: "🐊", color: "#5B8DEF",
        says: "I was swimming in the river all day. Just… fishing. Yep. Only fish." },
      { id: "para",  name: "Para the Parasaurolophus", icon: "🎺", color: "#E07A5F",
        says: "I was at band practice all day. I'm totally dry. Feel my head!" },
      { id: "tiny",  name: "Tiny the Compy", icon: "🐾", color: "#F2C14E",
        says: "I'm smaller than a chicken! That shelf is like a mountain to me." }
    ],
    culprit: "spino",
    ending: "Case closed! Spino has long arms, a big sail, and he was dripping wet from the river. He says the cookies smelled too good! Now he's helping Grandma bake a new batch for the sale.",
    wrong: "Look again! Who has a sail and loves to swim?"
  },
  {
    id: "night-noise",
    title: "The Spooky Night Noise",
    icon: "🌙",
    xp: 20,
    intro: "Every night at Dino Camp, a loud spooky sound wakes everyone up: HOOOONK! Who is making that noise?",
    places: [
      { id: "fire",  name: "Campfire", icon: "🔥",
        clue: "Listen closely. The sound goes HOOOONK, like a giant horn. It is not a roar and not a bonk." },
      { id: "tent",  name: "Big Tent", icon: "⛺",
        clue: "A sign on the tent says: 'Dino Talent Show on Saturday! Best music wins a prize!'" },
      { id: "hill",  name: "Echo Hill", icon: "⛰️",
        clue: "At the top of Echo Hill you find music notes scribbled in the dirt. Someone practices music up here!" },
      { id: "lake",  name: "Moon Lake", icon: "🌕",
        clue: "In the moonlight, a frog saw a dino with a long tube-shaped crest on its head walking up Echo Hill." }
    ],
    suspects: [
      { id: "rexy",   name: "Rexy the T-Rex", icon: "🦖", color: "#4CAF62",
        says: "I can ROAR really loud. But my roar goes RAAAWR, not HONK!" },
      { id: "pachy",  name: "Pachy the Pachycephalosaurus", icon: "🪨", color: "#8A5A2E",
        says: "My head is round and hard. When I hit things it goes BONK, not HONK!" },
      { id: "bronto", name: "Bronto the Brontosaurus", icon: "🦕", color: "#7FB3D5",
        says: "Me? I just hum softly. Hmmm-hmmm. I was asleep by 7 o'clock." },
      { id: "para",   name: "Para the Parasaurolophus", icon: "🎺", color: "#E07A5F",
        says: "I was, um, sleeping. Very quietly. I don't even want to win the talent show." }
    ],
    culprit: "para",
    ending: "You solved it! Para blows air through her long crest to make a HONK, like a trumpet. She was practicing for the talent show. Now she practices in the daytime, and she won first prize!",
    wrong: "Not them! Which dino could make a sound like a giant horn?"
  },
  {
    id: "purple-spots",
    title: "The Purple Spots Puzzle",
    icon: "🎨",
    xp: 20,
    intro: "Someone painted purple spots all over the rocks in Dino Park! Find out who the secret painter is.",
    places: [
      { id: "rock", name: "Big Rock", icon: "🪨",
        clue: "The purple spots are on TOP of the big rock. There are no footprints around it. The painter came from the sky!" },
      { id: "shop", name: "Paint Shop", icon: "🖌️",
        clue: "The shop owner says: 'I sold purple paint yesterday to a little dino with lots of pretty feathers.'" },
      { id: "tree", name: "Twisty Tree", icon: "🌳",
        clue: "A purple feather is stuck on a high branch. Someone glided down from this tree." },
      { id: "pond", name: "Lily Pond", icon: "🪷",
        clue: "A paint brush is floating in the pond. The handle has tiny bite marks from small, sharp teeth." }
    ],
    suspects: [
      { id: "mika",   name: "Mika the Microraptor", icon: "🪶", color: "#9B6BD3",
        says: "I just glide from tree to tree. Purple is my favorite color! I mean… what paint?" },
      { id: "bronto", name: "Bronto the Brontosaurus", icon: "🦕", color: "#7FB3D5",
        says: "My feet are HUGE. If I walked by that rock, you'd see giant footprints!" },
      { id: "tara",   name: "Tara the Triceratops", icon: "🦏", color: "#C9A227",
        says: "Feathers? I don't have any feathers. I have horns!" },
      { id: "rexy",   name: "Rexy the T-Rex", icon: "🦖", color: "#4CAF62",
        says: "My teeth are as big as bananas. And painting with tiny arms is SO hard." }
    ],
    culprit: "mika",
    ending: "Great work, Detective! Mika has feathers and small teeth, and she can glide down from the trees. She wanted to make the park pretty. Now the park has a Painting Wall where everyone can paint!",
    wrong: "Hmm. Who could come from the sky and has feathers?"
  },
  {
    id: "race-trophy",
    title: "The Vanishing Race Trophy",
    icon: "🏆",
    xp: 25,
    intro: "The Dino Race trophy disappeared from its shelf! This case is tricky. Someone is not telling the truth.",
    places: [
      { id: "shelf",   name: "Trophy Shelf", icon: "🕛",
        clue: "The clock by the shelf got bumped and stopped at 12 o'clock noon. That's when the trophy was taken!" },
      { id: "weather", name: "Weather Board", icon: "🌧️",
        clue: "The weather board says: 'BIG rainstorm at 12 o'clock noon! No sun at all. Everyone ran inside.'" },
      { id: "track",   name: "Race Track", icon: "🏁",
        clue: "There are skid marks near the shelf. Only a super speedy runner could stop that fast." },
      { id: "lost",    name: "Lost and Found", icon: "📦",
        clue: "A striped racing sweatband was found under the shelf. Only racers wear these." }
    ],
    suspects: [
      { id: "milo",   name: "Milo the Mini Raptor", icon: "🦖", color: "#5B8DEF",
        says: "At 12 o'clock I was lying on the big rock in the sun. It was so warm and sunny!" },
      { id: "galli",  name: "Galli the Gallimimus", icon: "💨", color: "#E07A5F",
        says: "I won that trophy this morning! At noon I hid from the rain in the barn." },
      { id: "bronto", name: "Bronto the Brontosaurus", icon: "🦕", color: "#7FB3D5",
        says: "I'm the slowest dino ever. I was in the barn at noon. Galli was there too!" },
      { id: "tiny",   name: "Tiny the Compy", icon: "🐾", color: "#F2C14E",
        says: "I was in the barn with Bronto and Galli. The rain was SO loud!" }
    ],
    culprit: "milo",
    ending: "Amazing! Milo said it was sunny at noon, but it was raining! He came in second and just wanted to hold the trophy for a little while. He gave it back, and Galli made him a 'Super Speedy' ribbon.",
    wrong: "Their story checks out. Look at the weather. Who said something that can't be true?"
  }
];
