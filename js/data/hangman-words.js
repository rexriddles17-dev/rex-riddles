/*
 * Dino Hangman levels and words. Add your own!
 * Words: use CAPITAL letters; spaces are allowed. h = the hint.
 *
 * Level settings:
 *   tries      wrong guesses before the meteor lands
 *   xp         XP for a win
 *   showFirst  true: the first letter is filled in for you
 *   freeHint   true: the hint is shown. false: the hint costs 1 meteor try
 */
RR.data.hangmanLevels = {
  easy:   { label: "Easy",   stars: "⭐",     tries: 8, xp: 5,  showFirst: true,  freeHint: true },
  medium: { label: "Medium", stars: "⭐⭐",   tries: 6, xp: 10, showFirst: false, freeHint: true },
  hard:   { label: "Hard",   stars: "⭐⭐⭐", tries: 5, xp: 20, showFirst: false, freeHint: false }
};

RR.data.hangmanWords = {
  easy: [
    { w: "EGG",   h: "Baby dinosaurs hatch from this" },
    { w: "BONE",  h: "Skeletons are made of these" },
    { w: "NEST",  h: "Where dino moms laid their eggs" },
    { w: "CLAW",  h: "A sharp, curvy nail on a foot" },
    { w: "ROAR",  h: "A big, loud T-Rex sound" },
    { w: "TAIL",  h: "Stegosaurus had spikes on the end of this" },
    { w: "TOOTH", h: "T-Rex had about 60 of these" },
    { w: "ROCK",  h: "Fossils are found inside this" },
    { w: "DIG",   h: "What you do with a shovel to find fossils" },
    { w: "MUD",   h: "Wet, squishy dirt that keeps footprints" },
    { w: "LAVA",  h: "Hot, melted rock from a volcano" },
    { w: "FERN",  h: "A leafy green plant that dinos ate" },
    { w: "HORN",  h: "Triceratops had three of these" },
    { w: "WING",  h: "Pterosaurs flew with these" },
    { w: "SPIKE", h: "A sharp, pointy part on a dino's back or tail" }
  ],
  medium: [
    { w: "FOSSIL",      h: "What dinosaur bones turn into over millions of years" },
    { w: "METEOR",      h: "A space rock that may have ended the dinosaurs" },
    { w: "VOLCANO",     h: "A mountain that erupts with lava" },
    { w: "JURASSIC",    h: "A famous time period of the dinosaurs" },
    { w: "HERBIVORE",   h: "An animal that only eats plants" },
    { w: "CARNIVORE",   h: "An animal that eats meat" },
    { w: "TRICERATOPS", h: "Three horns and a big frill" },
    { w: "STEGOSAURUS", h: "Plates on its back and spikes on its tail" },
    { w: "DINO EGG",    h: "Baby dinosaurs hatch from this" },
    { w: "SKELETON",    h: "All the bones of a body, put together" },
    { w: "FOOTPRINT",   h: "A track left in the mud by a foot" },
    { w: "RAPTOR",      h: "A small, fast, feathered hunter" },
    { w: "PTERODACTYL", h: "A flying reptile with big wings" },
    { w: "SPINOSAURUS", h: "A fish-eating dino with a sail on its back" },
    { w: "EXTINCT",     h: "When an animal is gone forever" }
  ],
  hard: [
    { w: "TYRANNOSAURUS",   h: "The king of the dinosaurs, with tiny arms" },
    { w: "VELOCIRAPTOR",    h: "Its name means \"swift thief\"" },
    { w: "PALEONTOLOGIST",  h: "A scientist who digs up dinosaurs" },
    { w: "BRACHIOSAURUS",   h: "Super long neck for eating treetops" },
    { w: "ANKYLOSAURUS",    h: "Armored dino with a club tail" },
    { w: "CRETACEOUS",      h: "The last time period of the dinosaurs" },
    { w: "COPROLITE",       h: "Fossil poop!" },
    { w: "QUETZALCOATLUS",  h: "A flying reptile as tall as a giraffe" },
    { w: "ICHTHYOSAUR",     h: "A sea reptile that looked like a dolphin" },
    { w: "PARASAUROLOPHUS", h: "A dino with a long, honking head crest" },
    { w: "COMPSOGNATHUS",   h: "A tiny dino about the size of a chicken" },
    { w: "GALLIMIMUS",      h: "A fast dino that looked like an ostrich" },
    { w: "MOSASAUR",        h: "A giant sea lizard, not a dinosaur" },
    { w: "AMBER",           h: "Old tree sap that turned hard as stone" },
    { w: "MEGALOSAURUS",    h: "The very first dinosaur ever named" }
  ]
};
