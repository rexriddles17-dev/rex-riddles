/*
 * Daily Detective building blocks. A new case is made from these every day.
 * Everyone gets the same case on the same date.
 *
 * traits:  clue   = what the detective finds (points to dinos WITH this trait)
 *          no     = what a dino WITHOUT this trait says as an alibi
 *          has    = used in the ending ("Only Mika can fly, ...")
 * dinos:   give each dino the traits it really has. A dino needs 4+ traits to be a culprit.
 * scenes:  the thing that went missing, where, and 4 places to search.
 */
RR.data.dailyDetective = {
  xp: 20,

  traits: {
    fly:        { clue: "There are no footprints anywhere! The thief must have come down from the sky.", no: "I can't fly. I don't have wings!", has: "can fly" },
    swim:       { clue: "Wet, drippy puddles go all the way to the river. The thief went for a swim!", no: "I don't like swimming. I always stay dry!", has: "loves to swim" },
    fish:       { clue: "It smells like stinky fish here. The thief just ate a fishy snack!", no: "Fish? Yuck! I never eat fish.", has: "eats fish" },
    tall:       { clue: "There are scratch marks way up high, higher than a house. The thief is super tall!", no: "I can't reach up that high.", has: "is super tall" },
    longneck:   { clue: "A giant head peeked in from way up high. Only a dino with a super long neck could do that!", no: "My neck is short. I can't peek in from up high.", has: "has a super long neck" },
    small:      { clue: "The thief got in through a tiny hole in the fence. Only a very small dino could fit!", no: "Look at me! I'm way too big for a tiny hole.", has: "is very small" },
    bigfeet:    { clue: "There are giant round footprints, as big as a pool float.", no: "My feet are not that big. See?", has: "has giant feet" },
    feathers:   { clue: "A fluffy feather is stuck right here.", no: "Feathers? I don't have a single feather!", has: "has feathers" },
    horns:      { clue: "Something has a round hole poked in it, like from a sharp horn.", no: "I don't have any horns on my head.", has: "has sharp horns" },
    frill:      { clue: "A bird saw a shadow with a big round frill around its head.", no: "I don't have a frill around my head.", has: "has a big frill" },
    plates:     { clue: "A shadow with big pointy plates all along its back was seen.", no: "I don't have plates on my back.", has: "has plates on its back" },
    sail:       { clue: "A frog saw a shadow with a tall sail on its back.", no: "I don't have a sail on my back.", has: "has a sail" },
    clubtail:   { clue: "Something has a big round dent, like from a heavy club tail. CLONK!", no: "My tail is not a club. Take a look!", has: "has a club tail" },
    spikes:     { clue: "There are pointy spike scratches right here.", no: "I don't have any spikes.", has: "has spikes" },
    armor:      { clue: "A chip of hard, bumpy armor was found on the ground.", no: "I don't have armor. My skin is soft!", has: "has bumpy armor" },
    dome:       { clue: "Someone heard a loud BONK, like a hard, round head bumping into something.", no: "My head isn't hard and round.", has: "has a hard dome head" },
    beak:       { clue: "There are peck marks, like from a pointy beak.", no: "I don't have a beak.", has: "has a beak" },
    claws:      { clue: "There are big, curvy claw scratches right here.", no: "My claws are not big and curvy.", has: "has big curvy claws" },
    sharpteeth: { clue: "There are bite marks from sharp, pointy teeth.", no: "I don't have sharp teeth.", has: "has sharp teeth" },
    plants:     { clue: "Half-eaten leaves were left behind. The thief eats plants.", no: "I never eat leaves. Yuck!", has: "eats plants" },
    fast:       { clue: "There are long skid marks on the path! The thief ran away super fast.", no: "I'm really slow. I can't run fast at all.", has: "runs super fast" },
    roar:       { clue: "Everyone heard a giant ROAR that shook the trees.", no: "I can't roar. I'm a quiet dino.", has: "has a giant roar" },
    honk:       { clue: "Someone heard a loud HONK, like a giant trumpet.", no: "I can't make a HONK sound.", has: "can HONK like a trumpet" }
  },

  dinos: [
    { id: "rexy",   name: "Rexy the T-Rex",               icon: "🦖", color: "#4CAF62", traits: ["sharpteeth", "bigfeet", "roar", "tall"] },
    { id: "spino",  name: "Spino the Spinosaurus",        icon: "🐊", color: "#5B8DEF", traits: ["swim", "fish", "sail", "sharpteeth", "tall"] },
    { id: "petey",  name: "Petey the Pteranodon",         icon: "🪽", color: "#E07A5F", traits: ["fly", "fish", "swim", "beak"] },
    { id: "bree",   name: "Bree the Brachiosaurus",       icon: "🦕", color: "#7FB3D5", traits: ["tall", "longneck", "bigfeet", "plants"] },
    { id: "tara",   name: "Tara the Triceratops",         icon: "🦏", color: "#C9A227", traits: ["horns", "frill", "plants", "bigfeet"] },
    { id: "steggy", name: "Steggy the Stegosaurus",       icon: "🌿", color: "#6BBF59", traits: ["plates", "spikes", "plants", "bigfeet"] },
    { id: "anky",   name: "Anky the Ankylosaurus",        icon: "🛡️", color: "#8A5A2E", traits: ["clubtail", "spikes", "armor", "plants"] },
    { id: "milo",   name: "Milo the Velociraptor",        icon: "🦖", color: "#3D7DD8", traits: ["fast", "feathers", "sharpteeth", "claws"] },
    { id: "mika",   name: "Mika the Microraptor",         icon: "🪶", color: "#9B6BD3", traits: ["fly", "feathers", "small", "sharpteeth"] },
    { id: "tiny",   name: "Tiny the Compy",               icon: "🐾", color: "#F2C14E", traits: ["small", "fast", "sharpteeth"] },
    { id: "para",   name: "Para the Parasaurolophus",     icon: "🎺", color: "#D96C8A", traits: ["honk", "plants", "beak", "swim"] },
    { id: "pachy",  name: "Pachy the Pachycephalosaurus", icon: "🪨", color: "#A0785A", traits: ["dome", "plants", "fast", "spikes"] },
    { id: "galli",  name: "Galli the Gallimimus",         icon: "💨", color: "#E8A33D", traits: ["fast", "feathers", "beak", "plants"] }
  ],

  scenes: [
    { item: "the Golden Bone",     icon: "🦴", where: "the Dino Museum",
      places: [["Display Case", "🦴"], ["Museum Door", "🚪"], ["Gift Shop", "🛍️"], ["Back Garden", "🌷"]] },
    { item: "the birthday cake",   icon: "🎂", where: "Grandma Dino's party",
      places: [["Party Table", "🎂"], ["Balloon Arch", "🎈"], ["Present Pile", "🎁"], ["Garden Gate", "🚧"]] },
    { item: "the shiny crown",     icon: "👑", where: "Fern Castle",
      places: [["Throne Room", "👑"], ["Castle Gate", "🏰"], ["Tower Stairs", "🪜"], ["Moat Bridge", "🌉"]] },
    { item: "the team soccer ball", icon: "⚽", where: "Dino Field",
      places: [["Goal Net", "🥅"], ["Team Bench", "🪑"], ["Snack Stand", "🌭"], ["Locker Room", "🚪"]] },
    { item: "the berry pie",       icon: "🥧", where: "the Bakery",
      places: [["Cooling Window", "🪟"], ["Big Oven", "🔥"], ["Flour Shelf", "🥖"], ["Back Door", "🚪"]] },
    { item: "the treasure chest",  icon: "🪙", where: "Pirate Cove",
      places: [["Sandy Beach", "🏖️"], ["Old Ship", "🚢"], ["Palm Tree", "🌴"], ["Rock Cave", "🕳️"]] },
    { item: "the magic book",      icon: "📖", where: "the Dino Library",
      places: [["Reading Nook", "📖"], ["Book Cart", "🛒"], ["Front Desk", "🛎️"], ["Window Seat", "🪟"]] },
    { item: "the gold medal",      icon: "🏅", where: "the Dino Games",
      places: [["Prize Stand", "🏅"], ["Swimming Pool", "🏊"], ["Running Track", "🏁"], ["Water Fountain", "⛲"]] }
  ],

  // What the culprit says when you talk to them
  nervous: [
    "Me? I was, um, at home. All day. Doing nothing!",
    "I didn't see anything! Why are you looking at me like that?",
    "What missing thing? I mean… oh no, how sad!",
    "I was taking a nap. A very long nap. Zzz…"
  ],

  // Why the culprit took it (shown in the ending)
  reasons: [
    "just wanted to borrow it for one day.",
    "thought it would look great at home.",
    "wanted to show it to a friend.",
    "was keeping it safe from the rain. Silly!"
  ]
};
