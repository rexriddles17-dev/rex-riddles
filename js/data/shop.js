/*
 * Dino Shop catalog. Prices are in XP. Price 0 = free for everyone.
 * Spending XP never lowers your rank: your rank counts all the XP you ever earned.
 *
 *   species: the kind of dino (drawings in js/art/bodies.js)
 *   colors:  skin colors (hex = the main skin color)
 *   items:   things to wear. slot = hat, eyes, neck or back (one of each at a time)
 *            id must match a drawing in js/art/bodies.js
 *   event:   an event id from js/data/events.js = only for sale while that event is on (limited time).
 *            An event item with price 0 is a free gift: players tap "Get it FREE!" to keep it.
 *   nameParts: players name their dino by picking one word from each list (no typing,
 *            so nobody types a real name). Add more fun words!
 */
RR.data.shop = {
  species: [
    { id: "trex",    name: "T-Rex",         price: 0 },
    { id: "raptor",  name: "Raptor",        price: 40 },
    { id: "trike",   name: "Triceratops",   price: 60 },
    { id: "stego",   name: "Stegosaurus",   price: 80 },
    { id: "brachio", name: "Brachiosaurus", price: 120 },
    { id: "turkey",  name: "Turkey",        price: 50, event: "thanksgiving" }
  ],
  colors: [
    { id: "natural",  name: "Natural",      hex: "#6E7A3C", price: 0 },
    { id: "jungle",   name: "Jungle Green", hex: "#3F8A3A", price: 15 },
    { id: "sand",     name: "Desert Sand",  hex: "#B8955A", price: 15 },
    { id: "ocean",    name: "Ocean Blue",   hex: "#3C6E9C", price: 20 },
    { id: "lava",     name: "Lava Red",     hex: "#A8402E", price: 25 },
    { id: "purple",   name: "Royal Purple", hex: "#6B4A9C", price: 30 },
    { id: "midnight", name: "Midnight",     hex: "#2E3550", price: 40 },
    { id: "gold",     name: "Golden",       hex: "#C9A227", price: 100 },
    { id: "pumpkinorange", name: "Pumpkin Orange", hex: "#C8641E", price: 20, event: "thanksgiving" },
    { id: "cranberry", name: "Cranberry",   hex: "#8E2B3A", price: 20, event: "thanksgiving" },
    { id: "chestnut",  name: "Chestnut Brown", hex: "#8A4E2A", price: 0, event: "thanksgiving" }   // free gift
  ],
  items: [
    { id: "cap",         slot: "hat",  name: "Baseball Cap",   price: 20 },
    { id: "party",       slot: "hat",  name: "Party Hat",      price: 25 },
    { id: "cowboy",      slot: "hat",  name: "Cowboy Hat",     price: 40 },
    { id: "pirate",      slot: "hat",  name: "Pirate Hat",     price: 50 },
    { id: "tophat",      slot: "hat",  name: "Top Hat",        price: 60 },
    { id: "wizard",      slot: "hat",  name: "Wizard Hat",     price: 90 },
    { id: "crown",       slot: "hat",  name: "Royal Crown",    price: 150 },
    { id: "shades",      slot: "eyes", name: "Cool Shades",    price: 30 },
    { id: "nerd",        slot: "eyes", name: "Smart Glasses",  price: 20 },
    { id: "starglasses", slot: "eyes", name: "Star Glasses",   price: 45 },
    { id: "bowtie",      slot: "neck", name: "Bow Tie",        price: 15 },
    { id: "scarf",       slot: "neck", name: "Cozy Scarf",     price: 25 },
    { id: "chain",       slot: "neck", name: "Gold Chain",     price: 75 },
    { id: "cape",        slot: "back", name: "Superhero Cape", price: 120 },
    { id: "rocket",      slot: "back", name: "Rocket Pack",    price: 140 },
    // Gobble Fest (Thanksgiving): only for sale during the event. Bought ones are yours forever.
    { id: "pilgrim",     slot: "hat",  name: "Pilgrim Hat",    price: 30, event: "thanksgiving" },
    { id: "pumpkin",     slot: "hat",  name: "Pumpkin Hat",    price: 25, event: "thanksgiving" },
    { id: "leafcrown",   slot: "hat",  name: "Autumn Leaf Crown", price: 40, event: "thanksgiving" },
    { id: "bib",         slot: "neck", name: "Feast Bib",      price: 15, event: "thanksgiving" },
    { id: "feathers",    slot: "back", name: "Turkey Tail Feathers", price: 35, event: "thanksgiving" },
    // Free Gobble Fest gifts (price 0): tap "Get it FREE!" during the event and keep them forever
    { id: "turkeyhat",   slot: "hat",  name: "Turkey Buddy Hat", price: 0, event: "thanksgiving" },
    { id: "helmet",      slot: "hat",  name: "Football Helmet",  price: 0, event: "thanksgiving" },
    { id: "corncrown",   slot: "hat",  name: "Golden Corn Crown", price: 0, event: "thanksgiving" },
    { id: "chefhat",     slot: "hat",  name: "Feast Chef Hat",   price: 0, event: "thanksgiving" },
    { id: "leafshades",  slot: "eyes", name: "Blaze Leaf Shades", price: 0, event: "thanksgiving" },
    { id: "goggles",     slot: "eyes", name: "Parade Pilot Goggles", price: 0, event: "thanksgiving" },
    { id: "wishbone",    slot: "neck", name: "Lucky Wishbone",   price: 0, event: "thanksgiving" },
    { id: "leafcape",    slot: "back", name: "Autumn Hero Cape", price: 0, event: "thanksgiving" },
    { id: "pumpkinjet",  slot: "back", name: "Pumpkin Jetpack",  price: 0, event: "thanksgiving" }
  ],
  // Paints for hats, glasses, neck and back items. Free once you own the item.
  paints: [
    { id: "red",    name: "Red",    hex: "#D63B3B" },
    { id: "orange", name: "Orange", hex: "#F2852B" },
    { id: "yellow", name: "Yellow", hex: "#F2C230" },
    { id: "green",  name: "Green",  hex: "#3CA455" },
    { id: "blue",   name: "Blue",   hex: "#3C7DD9" },
    { id: "purple", name: "Purple", hex: "#7B4FC9" },
    { id: "pink",   name: "Pink",   hex: "#F06BAA" },
    { id: "brown",  name: "Brown",  hex: "#9A6A3A" },
    { id: "black",  name: "Black",  hex: "#1F1B24" },
    { id: "white",  name: "White",  hex: "#F4F1EA" }
  ],
  nameParts: {
    first:  ["", "Captain", "Sir", "Lady", "Big", "Little", "Mighty", "Sneaky", "Dr.", "Professor",
             "Turbo", "Sparkle", "Thunder", "Lucky", "Fuzzy", "Super", "Silly", "Brave"],
    second: ["Chomp", "Stomp", "Spike", "Blaze", "Pebble", "Rocket", "Noodle", "Ziggy", "Boulder",
             "Fang", "Sprout", "Comet", "Taco", "Waffle", "Bolt", "Mango", "Gizmo", "Nugget", "Pickle",
             "Gobble", "Pumpkin", "Acorn", "Cranberry"]
  }
};
