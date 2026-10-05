/* "For grown-ups" page (#/grown-ups): privacy, copyright and contact. Linked from the footer. */
RR.screens["grown-ups"] = {
  contact: "rexriddles17@gmail.com",
  updated: "October 5, 2026",

  render(el) {
    el.innerHTML = `
      <a class="back" href="#/">‹ Back to games</a>
      <h1 class="screen-title">For grown-ups</h1>
      <article class="grownups">
        <p>Rex Riddles is a free puzzle site for kids, made by a family. A kid is the game director.</p>

        <h2>Privacy</h2>
        <ul>
          <li><b>We don't collect any personal information.</b> No accounts, no real names, no emails, no photos, no locations.</li>
          <li>No ads, no tracking, no analytics and no chat. Players can't contact each other.</li>
          <li>Dino names are built from word lists, so kids never type their own name.</li>
          <li>Progress (XP, rank, dino and solved puzzles) is saved only in this browser on this device. It is never sent to us. Clearing the browser's site data erases it.</li>
          <li>Everything, including the fonts, loads from this site. Nothing loads from other companies.</li>
          <li>The site is hosted on GitHub Pages. Like any web host, GitHub may keep basic server logs (such as IP addresses) for security. We can't see them and don't use them.</li>
        </ul>

        <h2>Copyright</h2>
        <p>© 2026 Rex Riddles. All games, puzzles, stories and dino art are original. Please don't copy or re-post them.</p>
        <p>Fonts: Bungee and Nunito, used under the SIL Open Font License
          (<a href="fonts/OFL-Bungee.txt">Bungee license</a>, <a href="fonts/OFL-Nunito.txt">Nunito license</a>).</p>

        <h2>Contact</h2>
        <p>Questions or problems? Email <b class="contact">${this.contact}</b></p>

        <p class="updated">Last updated ${this.updated}</p>
      </article>`;
  }
};
