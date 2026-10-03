/*
 * Dino Detective cases. Write your own!
 * Each case needs: places (each hides one clue), suspects (each says something),
 * the culprit's id, and an ending. Clues should point to the culprit so players can work it out.
 * level: "easy", "medium" or "hard" (rules for each level are in detective-levels.js).
 */
RR.data.detectiveCases = [
  {
    id: "golden-egg",
    level: "easy",
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
    level: "easy",
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
    level: "medium",
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
    level: "easy",
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
    level: "easy",
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
    level: "medium",
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
    level: "hard",
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
  },

  /* ===== More EASY cases ===== */
  {
    id: "splash-pool",
    level: "easy",
    title: "The Big Pool Splash",
    icon: "🏊",
    xp: 20,
    intro: "Someone jumped into the Dino Swim Pool so hard that almost all the water splashed out! Who made the giant splash?",
    places: [
      { id: "pool",  name: "Empty Pool", icon: "🏊",
        clue: "Only a tiny puddle is left. Whoever jumped in was HUGE and super heavy." },
      { id: "fence", name: "Tall Fence", icon: "🚧",
        clue: "The lifeguard saw a head peek over the tall fence on a super long neck." },
      { id: "grass", name: "Wet Grass", icon: "👣",
        clue: "Giant round footprints, as big as a pool float, lead away from the pool." },
      { id: "snack", name: "Snack Stand", icon: "🥗",
        clue: "A whole bowl of salad is gone. Only a plant eater would eat it." }
    ],
    suspects: [
      { id: "bronto", name: "Bronto the Brontosaurus", icon: "🦕", color: "#7FB3D5",
        says: "Splash? Um… I was just… drying off. I mean, I was never wet! Nope!" },
      { id: "tiny",   name: "Tiny the Compy", icon: "🐾", color: "#F2C14E",
        says: "I'm smaller than a chicken! My splash is just a little plip." },
      { id: "petey",  name: "Petey the Pteranodon", icon: "🪽", color: "#E07A5F",
        says: "I'm light as a feather. And I only eat fish, not salad!" },
      { id: "pachy",  name: "Pachy the Pachycephalosaurus", icon: "🪨", color: "#A0785A",
        says: "My neck is short. I couldn't peek over that tall fence!" }
    ],
    culprit: "bronto",
    ending: "Case closed! Bronto is huge, has a long neck and giant feet, and loves salad. He did a big cannonball and splashed all the water out! He helped fill the pool back up with his long neck as a hose.",
    wrong: "Not them! Who is huge, with a super long neck?"
  },
  {
    id: "popped-balloons",
    level: "easy",
    title: "The Popped Party Balloons",
    icon: "🎈",
    xp: 20,
    intro: "POP! POP! POP! All the balloons at Tara's birthday party got popped! Find out who popped them.",
    places: [
      { id: "balloons", name: "Balloon Pile", icon: "🎈",
        clue: "Each balloon has a little hole, like it was poked by something sharp and pointy." },
      { id: "wall",     name: "Party Tent Wall", icon: "⛺",
        clue: "A shadow on the tent showed big flat plates sticking up along a dino's back." },
      { id: "table",    name: "Snack Table", icon: "🥗",
        clue: "The leafy party salad is all gone. Only a plant eater would munch that." },
      { id: "floor",    name: "Dance Floor", icon: "🪩",
        clue: "The popped balloons are all low, near the ground, right where a swishy tail would hit them." }
    ],
    suspects: [
      { id: "steggy", name: "Steggy the Stegosaurus", icon: "🌿", color: "#6BBF59",
        says: "Balloons? I was dancing! Swish, swish! Um… was that loud?" },
      { id: "rexy",   name: "Rexy the T-Rex", icon: "🦖", color: "#4CAF62",
        says: "Salad? Yuck! I only eat meat. And I don't have any pointy plates." },
      { id: "bree",   name: "Bree the Brachiosaurus", icon: "🦕", color: "#7FB3D5",
        says: "My skin is smooth, nothing pointy at all. And I was way up high, eating treetops." },
      { id: "para",   name: "Para the Parasaurolophus", icon: "🎺", color: "#D96C8A",
        says: "I was playing music on my crest. My back is smooth, no plates!" }
    ],
    culprit: "steggy",
    ending: "You got it! Steggy has pointy plates and tail spikes, and he loves salad. When he danced, his spiky tail went POP, POP, POP! He felt bad and blew up new balloons for Tara.",
    wrong: "Not quite! Who has plates on its back?"
  },

  /* ===== More MEDIUM cases: you need to put clues together ===== */
  {
    id: "sandcastle-smash",
    level: "medium",
    title: "The Sandcastle Smash",
    icon: "🏖️",
    xp: 25,
    intro: "The Dino Kids built a giant sandcastle at the beach. Now it's smashed flat! No single clue solves this one. Put them together!",
    places: [
      { id: "trail",  name: "Wet Trail", icon: "🌊",
        clue: "Wet drips lead from the castle straight back into the sea. The smasher swims!" },
      { id: "castle", name: "Smashed Castle", icon: "🏰",
        clue: "Sand was swept away in a giant curve, like a big, heavy tail swung through it." },
      { id: "bones",  name: "Beach Towel", icon: "🐟",
        clue: "Fish bones were left on the towel. The smasher had a fishy snack." },
      { id: "prints", name: "Footprints", icon: "👣",
        clue: "Big footprints with long, sharp claw marks go around the castle." },
      { id: "gull",   name: "Seagull Rock", icon: "🪨",
        clue: "A seagull says: 'Lots of dinos came to the beach today. It was busy!'" }
    ],
    suspects: [
      { id: "spino", name: "Spino the Spinosaurus", icon: "🐊", color: "#5B8DEF",
        says: "I was fishing in the sea all morning. Ask anyone! I love the beach." },
      { id: "petey", name: "Petey the Pteranodon", icon: "🪽", color: "#E07A5F",
        says: "I catch fish in the sea, sure. But my tail is tiny, and my feet are little!" },
      { id: "anky",  name: "Anky the Ankylosaurus", icon: "🛡️", color: "#8A5A2E",
        says: "I have a big tail, but I can't swim. I sink like a rock!" },
      { id: "rexy",  name: "Rexy the T-Rex", icon: "🦖", color: "#4CAF62",
        says: "I have big claws. But swimming? No way! I stay on the sand." },
      { id: "para",  name: "Para the Parasaurolophus", icon: "🎺", color: "#D96C8A",
        says: "I swim a little. But fish? Yuck! I only eat plants." }
    ],
    culprit: "spino",
    ending: "Super sleuthing! Spino swims, eats fish, has big claws, AND a huge tail. He was chasing a fish and his tail swooshed right through the castle! He helped the Dino Kids build an even bigger one.",
    wrong: "Check every clue. The smasher swims, eats fish, has big claws, and a big tail."
  },
  {
    id: "library-book",
    level: "medium",
    title: "The Library Book Mystery",
    icon: "📚",
    xp: 25,
    intro: "The book 'How to Paint Rainbows' went missing from the very top shelf of the Dino Library. The door was locked all night!",
    places: [
      { id: "shelf",  name: "Top Shelf", icon: "📚",
        clue: "The ladder is still locked up. The book-taker got up high by flying or gliding." },
      { id: "window", name: "Little Window", icon: "🪟",
        clue: "The only way in was a tiny window near the roof. The book-taker is very small." },
      { id: "feather", name: "Reading Chair", icon: "🪶",
        clue: "A small, fluffy feather is stuck on the chair. The book-taker has feathers." },
      { id: "desk",   name: "Front Desk", icon: "🛎️",
        clue: "Giant footprints by the desk! But those are Bree's. She works here and stamps the books every day." },
      { id: "spot",   name: "Book Cart", icon: "🎨",
        clue: "A drop of purple paint is on the cart. Someone loves to paint purple!" }
    ],
    suspects: [
      { id: "bree",  name: "Bree the Brachiosaurus", icon: "🦕", color: "#7FB3D5",
        says: "I work at the library. But I'm way too big for that tiny window!" },
      { id: "petey", name: "Petey the Pteranodon", icon: "🪽", color: "#E07A5F",
        says: "I can fly. But feathers? My wings are smooth skin, no feathers!" },
      { id: "galli", name: "Galli the Gallimimus", icon: "💨", color: "#E8A33D",
        says: "I have feathers, but I can't fly or glide. I just run fast!" },
      { id: "tiny",  name: "Tiny the Compy", icon: "🐾", color: "#F2C14E",
        says: "I'm small, but I can't fly! I can't even reach the second shelf." },
      { id: "mika",  name: "Mika the Microraptor", icon: "🪶", color: "#9B6BD3",
        says: "I love books! I read every day after school." }
    ],
    culprit: "mika",
    ending: "Case closed! Only Mika is tiny, has feathers, and can glide. And remember the Purple Spots? Mika loves purple paint! She just wanted to learn to paint rainbows. Now she has her own library card.",
    wrong: "Not them. Who is tiny, has feathers, AND can glide?"
  },
  {
    id: "broken-bridge",
    level: "medium",
    title: "The Broken Bridge",
    icon: "🌉",
    xp: 25,
    intro: "The wooden bridge over Fern River broke in the middle! Somebody crossed it this afternoon and CRACK! Who broke it?",
    places: [
      { id: "middle", name: "Bridge Middle", icon: "🪵",
        clue: "The middle boards snapped. Something VERY heavy stood here." },
      { id: "holes",  name: "Bridge Rail", icon: "🕳️",
        clue: "The rail has round holes poked in it, at HEAD height. Something pointy on a head did that." },
      { id: "juice",  name: "Berry Bush", icon: "🫐",
        clue: "Berry juice footprints go onto the bridge. The bridge-breaker eats berries, so it eats plants." },
      { id: "roar",   name: "Fishing Spot", icon: "🎣",
        clue: "A fisher heard a giant ROAR this morning. But the bridge broke in the afternoon." },
      { id: "bird",   name: "Bird Nest", icon: "🐦",
        clue: "A bird says: 'I saw a big round shape around the dino's head, like a giant collar.'" }
    ],
    suspects: [
      { id: "tara",   name: "Tara the Triceratops", icon: "🦏", color: "#C9A227",
        says: "I was eating berries by the river this afternoon, like every day." },
      { id: "steggy", name: "Steggy the Stegosaurus", icon: "🌿", color: "#6BBF59",
        says: "My spikes are on the end of my tail, not on my head!" },
      { id: "anky",   name: "Anky the Ankylosaurus", icon: "🛡️", color: "#8A5A2E",
        says: "My head is bumpy, but it isn't pointy. And I don't have a collar." },
      { id: "rexy",   name: "Rexy the T-Rex", icon: "🦖", color: "#4CAF62",
        says: "Yes, I roared this morning. But berries? Yuck! I only eat meat." },
      { id: "bronto", name: "Bronto the Brontosaurus", icon: "🦕", color: "#7FB3D5",
        says: "I'm heavy, yes. But I don't have anything pointy at all!" }
    ],
    culprit: "tara",
    ending: "Brilliant! Tara is heavy, eats berries, has pointy horns on her head, and a big frill like a collar. Her horns were itchy, so she scratched them on the rail. Then CRACK! She's helping build a stronger bridge.",
    wrong: "Look again! The pointy holes were at HEAD height. And who has a collar?"
  },

  /* ===== More HARD cases: tricky clues, and someone isn't telling the truth ===== */
  {
    id: "star-map",
    level: "hard",
    title: "The Midnight Star Map",
    icon: "🗺️",
    xp: 30,
    intro: "The museum's old Star Map was taken at night when the lights went out. Careful, Detective! One suspect is fibbing.",
    places: [
      { id: "clock",  name: "Museum Clock", icon: "🕘",
        clue: "The clock stopped at 9 o'clock at night, when the lights went out. That's when the map was taken." },
      { id: "switch", name: "Light Switch", icon: "💡",
        clue: "The light switch is way up high near the ceiling, and the ladder is locked away. The thief is very tall." },
      { id: "pond",   name: "Duck Pond", icon: "🦆",
        clue: "A duck says: 'At 9 o'clock, a dino with a super long neck walked through my pond toward the museum.'" },
      { id: "mud",    name: "Muddy Floor", icon: "🟫",
        clue: "Muddy water is on the floor. But lots of dinos walked through mud today. It rained." },
      { id: "chart",  name: "Sky Chart", icon: "🌑",
        clue: "The sky chart says: 'Tonight there is NO moon. The darkest night of the year!'" }
    ],
    suspects: [
      { id: "bree",   name: "Bree the Brachiosaurus", icon: "🦕", color: "#7FB3D5",
        says: "At 9 o'clock I was at Library Story Night. Everyone saw me there!" },
      { id: "bronto", name: "Bronto the Brontosaurus", icon: "🦕", color: "#5FA8A0",
        says: "At 9 o'clock I was on my hill, looking at the big, bright moon. So pretty!" },
      { id: "spino",  name: "Spino the Spinosaurus", icon: "🐊", color: "#5B8DEF",
        says: "I'm tall, but my neck is short. I was swimming in the river all night." },
      { id: "rexy",   name: "Rexy the T-Rex", icon: "🦖", color: "#4CAF62",
        says: "My neck is short and thick. And I was fast asleep by 8 o'clock." },
      { id: "para",   name: "Para the Parasaurolophus", icon: "🎺", color: "#D96C8A",
        says: "I can't reach anything that high! I'm only as tall as a door." }
    ],
    culprit: "bronto",
    ending: "Wow! Bronto said he saw a bright moon, but there was NO moon that night! He took the Star Map because he wanted to learn about stars. He gave it back, and the museum made him a Junior Star Guide.",
    wrong: "Someone's story can't be true. Check the sky!"
  },
  {
    id: "prize-pumpkin",
    level: "hard",
    title: "The Great Pumpkin Grab",
    icon: "🎃",
    xp: 30,
    intro: "Grandma Dino's giant prize pumpkin vanished the day before the Fall Fair! Watch the times very carefully.",
    places: [
      { id: "patch",   name: "Pumpkin Patch", icon: "🎃",
        clue: "The pumpkin is as heavy as a car! Long drag marks show a big, strong dino pulled it away." },
      { id: "river",   name: "River Bank", icon: "🌊",
        clue: "The drag marks stop at the river. The pumpkin floated across, and the thief swam behind it!" },
      { id: "grandma", name: "Grandma's Porch", icon: "👵",
        clue: "Grandma says: 'I checked my pumpkin at 4 o'clock. It was still there.'" },
      { id: "weather", name: "Weather Dino", icon: "🌧️",
        clue: "The Weather Dino says: 'The rain started at 6 o'clock. Not one drop fell before that!' The drag marks are full of rain, so the pumpkin was gone before 6." },
      { id: "carrots", name: "Garden Fence", icon: "🥕",
        clue: "Half-eaten carrots by the fence. But every dino in town snacks in Grandma's garden." }
    ],
    suspects: [
      { id: "spino", name: "Spino the Spinosaurus", icon: "🐊", color: "#5B8DEF",
        says: "From 4 to 6 o'clock I was teaching swim class. Twenty dino kids saw me!" },
      { id: "para",  name: "Para the Parasaurolophus", icon: "🎺", color: "#D96C8A",
        says: "I was home, nice and dry. I watched the rain start at 5 o'clock from my window." },
      { id: "petey", name: "Petey the Pteranodon", icon: "🪽", color: "#E07A5F",
        says: "I can swim, but I'm too light to pull a pumpkin! I can only carry a fish." },
      { id: "anky",  name: "Anky the Ankylosaurus", icon: "🛡️", color: "#8A5A2E",
        says: "I'm strong. But I can't swim. I sink like a rock!" },
      { id: "tara",  name: "Tara the Triceratops", icon: "🦏", color: "#C9A227",
        says: "Swim across the river? No way! I don't even like baths." }
    ],
    culprit: "para",
    ending: "Amazing! Para said the rain started at 5, but it started at 6! Para wanted to make the pumpkin into a giant drum for the band. Para gave it back, and Grandma and Para both won a ribbon at the fair.",
    wrong: "Their story checks out."
  },
  {
    id: "chalkboard",
    level: "hard",
    title: "The Secret Chalkboard Message",
    icon: "✏️",
    xp: 30,
    intro: "Someone wrote 'NO HOMEWORK TODAY!' way up high on the Dino School chalkboard during recess. Some clues are tricks!",
    places: [
      { id: "board",   name: "Chalkboard", icon: "🧑‍🏫",
        clue: "The writing is way up at the top, near the ceiling. The writer can fly or is super tall." },
      { id: "window",  name: "Tiny Window", icon: "🪟",
        clue: "The door was locked. Chalk dust is on the tiny window. The writer is small enough to fit through it." },
      { id: "chalk",   name: "Chalk Box", icon: "🖍️",
        clue: "The chalk has peck marks on it, like it was held in a pointy beak." },
      { id: "feather", name: "Floor", icon: "🪶",
        clue: "A feather is on the floor. But Mika sits right there, and her feathers fall out every day." },
      { id: "lunch",   name: "Lunchroom", icon: "🍽️",
        clue: "A sign says: 'Lunchroom CLOSED during recess for cleaning. Door locked.'" }
    ],
    suspects: [
      { id: "mika",  name: "Mika the Microraptor", icon: "🪶", color: "#9B6BD3",
        says: "I don't have a beak, just a little mouth with teeth. At recess I was on the swings with Tiny." },
      { id: "tiny",  name: "Tiny the Compy", icon: "🐾", color: "#F2C14E",
        says: "Mika and I were on the swings all recess! And I can't reach high places anyway." },
      { id: "galli", name: "Galli the Gallimimus", icon: "💨", color: "#E8A33D",
        says: "I can't fly, and I'm way too big for that tiny window." },
      { id: "bree",  name: "Bree the Brachiosaurus", icon: "🦕", color: "#7FB3D5",
        says: "I'm tall, but that window is SO tiny. Only my nose would fit!" },
      { id: "petey", name: "Petey the Pteranodon", icon: "🪽", color: "#E07A5F",
        says: "At recess I was eating my fish lunch in the lunchroom. Lunch is the best!" }
    ],
    culprit: "petey",
    ending: "Great thinking! The lunchroom was closed, so Petey couldn't have been there! He flew in the tiny window and wrote with the chalk in his beak. The teacher laughed. Tonight's homework: draw your favorite dino!",
    wrong: "That dino's story checks out."
  },
  {
    id: "movie-popcorn",
    level: "hard",
    title: "The Movie Night Popcorn Puzzle",
    icon: "🍿",
    xp: 30,
    intro: "At Movie Night, the lights were off. When they came back on, the giant popcorn bowl was EMPTY! Look for a clue that clears someone.",
    places: [
      { id: "couch",  name: "Under the Couch", icon: "🛋️",
        clue: "A popcorn trail goes under the couch and out the tiny pet door. Only a very small dino fits through it." },
      { id: "prints", name: "Kitchen Floor", icon: "👣",
        clue: "Buttery little footprints with three thin toes and claws." },
      { id: "smudge", name: "Big Chair", icon: "🧈",
        clue: "A giant buttery smudge on the big chair. But that's from Rexy's own popcorn. Rexy always gets his own bowl." },
      { id: "sister", name: "Bree's Little Sister", icon: "👧",
        clue: "Bree's little sister says: 'During the scary storm part, Mika sat on my lap the whole time. She was scared!'" },
      { id: "speaker", name: "Speakers", icon: "🔊",
        clue: "The popcorn vanished during the scary storm part. It was SO loud, nobody heard any crunching." }
    ],
    suspects: [
      { id: "tiny",  name: "Tiny the Compy", icon: "🐾", color: "#F2C14E",
        says: "The storm part was too scary! I hid under a blanket the whole time." },
      { id: "mika",  name: "Mika the Microraptor", icon: "🪶", color: "#9B6BD3",
        says: "I'm small, but I didn't take it! The storm part was so scary." },
      { id: "milo",  name: "Milo the Velociraptor", icon: "🦖", color: "#3D7DD8",
        says: "I have three toes and claws, but I'm way too big for that pet door." },
      { id: "rexy",  name: "Rexy the T-Rex", icon: "🦖", color: "#4CAF62",
        says: "That smudge is from MY popcorn! I could never fit under a couch." },
      { id: "petey", name: "Petey the Pteranodon", icon: "🪽", color: "#E07A5F",
        says: "My feet are flat and webbed. No thin toes and no claws on me!" }
    ],
    culprit: "tiny",
    ending: "Case closed! Tiny and Mika both fit the clues, but Mika was on the little sister's lap. So it was Tiny! He gets snacky when he's scared. Next movie night, Tiny gets his own popcorn and a cozy nightlight.",
    wrong: "That dino has a good reason."
  }
];
