# Rex Riddles 🦖

A dinosaur-themed puzzle site for kids. Solve puzzles, earn XP, level up from Egg to T-Rex.

Live site: https://rexriddles17-dev.github.io/rex-riddles

## Folders

```
index.html            App shell: top bar + where screens are drawn. Loads everything below.
css/
  base.css            Colors, fonts, top bar, shared buttons (used everywhere)
  home.css            Home screen
  hangman.css         Dino Hangman
  detective.css       Dino Detective
js/
  core/               The engine — rarely changes
    namespace.js      RR object + registerGame()
    storage.js        Saving progress (the only file to swap for the iOS app)
    progress.js       XP, levels, pop-up messages
    router.js         #/ home, #/hangman, … (back button works)
  data/               ✏️ Easy to edit
    ranks.js          Level names and XP needed
    hangman-words.js  Hangman words and hints
    detective-cases.js Detective mysteries (write your own!)
  art/dinos.js        Rexy and other drawings
  games/              One file per game
    hangman.js
    detective.js
    coming-soon.js    Locked tiles for games not built yet
  screens/home.js     Home screen
  main.js             Starts the app
```

## Updating the live site

Upload the changed files to the GitHub repo **keeping the same folders**
(drag the whole `rex-riddles` folder's contents into *Add file → Upload files*).
GitHub Actions redeploys automatically in a minute or two.

## Adding a new game

1. Create `js/games/<game>.js` that calls `RR.registerGame({ id, title, icon, blurb, ready: true, mount, unmount })`.
2. Create `css/<game>.css`.
3. Add both to `index.html` (games scripts go before `screens/home.js`).
4. Remove its entry from `js/games/coming-soon.js`.
5. Award XP with `RR.progress.addXP(n)`.
