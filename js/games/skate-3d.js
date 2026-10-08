/*
 * Dino Skate in 3D. js/games/skate.js runs the game (jumping, scoring, XP) in its flat 300-step-tall
 * world; this file draws that same world in 3D. 25 game steps = 1 unit in 3D.
 * Devices without 3D keep the flat drawing in skate.js.
 *
 *   RR.skate3d.create(stageEl, look) → { canvas, resize() → game width W, paint(run, state, W), dispose() }
 */
(function () {
  RR.skate3d = {
    create(box, cfg) {
      const T = THREE, D = RR.d3, SC = D.scenery;
      const U = 25, H = 300, GROUND = cfg.GROUND, DINO_X = cfg.DINO_X;
      const st = D.stage(null, { fov: 38, lights: { shadow: false, hemi: 2.3, sun: 2.4 },
        height: w => Math.round(Math.max(220, Math.min(380, w * .62))), onResize: (w, h) => aim(w, h) });
      const scene = st.scene;
      scene.fog = new T.Fog(0xcfeef5, 30, 90);
      let W = 500, lastDist = 0;

      // HUD on top of the 3D view
      const hud = document.createElement("div");
      hud.className = "sk-hud";
      hud.innerHTML = `<span class="sk-score"></span><span class="sk-pops"></span><span class="sk-word"></span>`;
      box.prepend(hud);
      st.mount(box);
      box.prepend(st.canvas);
      st.canvas.classList.add("sk-canvas");
      st.canvas.setAttribute("aria-label", "Your dino skating. Tap to jump.");

      /* ---------- the world ---------- */
      const grass = D.mesh(new T.PlaneGeometry(400, 160), D.mat("#7CC24E"), [0, -.01, -40], [-Math.PI / 2, 0, 0]);
      grass.castShadow = false; scene.add(grass);

      // dirt track with stripes that scroll so you can feel the speed
      const tc = document.createElement("canvas"); tc.width = 256; tc.height = 64;
      const g = tc.getContext("2d");
      g.fillStyle = "#C9A26B"; g.fillRect(0, 0, 256, 64);
      g.fillStyle = "#B48D58"; for (let i = 0; i < 4; i++) g.fillRect(i * 64 + 8, 0, 18, 64);
      g.fillStyle = "#A9824F"; [[40, 14], [110, 44], [180, 22], [230, 50]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x, y, 6, 4, 0, 0, 7); g.fill(); });
      const tex = new T.CanvasTexture(tc);
      tex.wrapS = T.RepeatWrapping; tex.colorSpace = T.SRGBColorSpace; tex.repeat.set(20, 1);
      const track = D.mesh(new T.PlaneGeometry(200, 3.2), new T.MeshStandardMaterial({ map: tex, roughness: .95 }), [60, 0, 0], [-Math.PI / 2, 0, 0]);
      track.castShadow = false; scene.add(track);
      [1.65, -1.65].forEach(z => { const e = D.mesh(new T.BoxGeometry(200, .12, .22), D.mat("#5FAE3E"), [60, .03, z]); e.castShadow = false; scene.add(e); });

      // scenery that loops past: [maker, count, spacing, z range, y]
      const decor = [];
      const addLoop = (make, n, gap, zMin, zMax, speed = 1) => {
        for (let i = 0; i < n; i++) {
          const o = make(i); o.position.set(i * gap + Math.random() * gap * .5 - 8, o.position.y, zMin + Math.random() * (zMax - zMin));
          o.rotation.y = Math.random() * 6; scene.add(o); decor.push({ o, span: n * gap, speed });
        }
      };
      addLoop(i => SC.palm(2.6 + (i % 3) * .5), 9, 7, -9, -4);
      addLoop(i => SC.fern(.9 + (i % 2) * .3, i % 2 ? "#5FAE3E" : "#3E8E4F"), 12, 5, -3.6, -2.2);
      addLoop(i => SC.fern(.6, "#4E9E45"), 6, 11, 2.4, 3.4);
      addLoop(i => SC.rock(.35 + (i % 3) * .15), 8, 8, -3, -2);
      addLoop(i => SC.bush(.9), 5, 13, -14, -10);
      addLoop(() => SC.volcano(4), 2, 45, -48, -44, .25);
      addLoop(i => { const c = SC.cloud(2 + (i % 2)); c.position.y = 12 + (i % 3) * 3; return c; }, 5, 22, -50, -36, .15);

      /* ---------- your dino and the board ---------- */
      const rider = new T.Group();
      const dino = D.dino(cfg.look);
      const bb = new T.Box3().setFromObject(dino), c = bb.getCenter(new T.Vector3());
      dino.children[0].position.x = -c.x;
      dino.position.y = .32;
      rider.add(dino);

      const board = new T.Group();
      const deckShape = new T.Shape();
      deckShape.moveTo(-1.5, -.3); deckShape.lineTo(1.5, -.3); deckShape.absarc(1.5, 0, .3, -Math.PI / 2, Math.PI / 2); deckShape.lineTo(-1.5, .3); deckShape.absarc(-1.5, 0, .3, Math.PI / 2, Math.PI * 1.5);
      const deck = D.mesh(new T.ExtrudeGeometry(deckShape, { depth: .08, bevelEnabled: true, bevelSize: .03, bevelThickness: .03, bevelSegments: 2 }),
        D.mat("#FF7A1A", { roughness: .5 }), [0, .2, 0], [Math.PI / 2, 0, 0]);
      const stripe = D.mesh(new T.BoxGeometry(1.2, .02, .58), D.mat("#FFD23F"), [0, .245, 0]);
      board.add(deck, stripe);
      [-1.05, 1.05].forEach(x => {
        board.add(D.mesh(new T.BoxGeometry(.18, .1, .5), D.mat("#9AA5B1", { metalness: .6, roughness: .35 }), [x, .1, 0]));
        [-.28, .28].forEach(z => board.add(D.mesh(new T.CylinderGeometry(.11, .11, .1, 16), D.mat("#3B3F4A"), [x, .1, z], [Math.PI / 2, 0, 0])));
      });
      const boardWrap = new T.Group(); boardWrap.add(board);
      rider.add(boardWrap);
      scene.add(rider);

      const blob = D.mesh(new T.CircleGeometry(1, 28), new T.MeshBasicMaterial({ color: 0x3c2814, transparent: true, opacity: .28, depthWrite: false }), [0, .02, 0], [-Math.PI / 2, 0, 0]);
      blob.castShadow = false; scene.add(blob);

      // stars spinning over a crashed dino
      const stars = new T.Group();
      for (let i = 0; i < 3; i++) {
        const s = new T.Shape(); for (let k = 0; k < 10; k++) { const a = Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? .1 : .24; k ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
        stars.add(D.mesh(new T.ExtrudeGeometry(s, { depth: .06, bevelEnabled: false }), D.mat("#FFD23F", { emissive: new T.Color("#FFB000"), emissiveIntensity: .6 })));
      }
      stars.visible = false; scene.add(stars);

      /* ---------- obstacles and eggs (one model each, copied as they appear) ---------- */
      const models = { rock: SC.rock(1), log: SC.log(1), bone: SC.bone(1), bush: SC.bush(1), egg: SC.egg(1) };
      const shelf = new T.Group(); shelf.visible = false; scene.add(shelf);
      Object.values(models).forEach(m => shelf.add(m));
      function fit(model, w, h) {           // copy a model and stretch it to the game's hit-box size
        const o = model.clone(true);
        const b = new T.Box3().setFromObject(model), s = b.getSize(new T.Vector3());
        const sx = w / U / s.x, sy = h / U / s.y, sz = Math.min(2.2 / s.z, (sx + sy) / 2);
        o.scale.set(sx, sy, sz);
        o.position.y = -b.min.y * sy;
        const wrap = new T.Group(); wrap.add(o);
        return wrap;
      }

      function syncThings(run) {
        const live = new Set();
        for (const t of run.things) {
          if (t.kind === "egg" && t.gone) continue;
          if (!t.mesh) {
            t.mesh = t.kind === "block" ? fit(models[t.id] || models.rock, t.w, t.h) : fit(models.egg, t.w, t.h);
            scene.add(t.mesh);
          }
          live.add(t.mesh);
          if (t.kind === "block") t.mesh.position.set((t.x + t.w / 2) / U, 0, 0);
          else {
            t.mesh.position.set((t.x + t.w / 2) / U, (GROUND - t.y - t.h) / U + Math.sin(run.t * 6 + t.x) * .12, 0);
            t.mesh.rotation.y = run.t * 3 + t.x;
          }
        }
        scene.children.slice().forEach(o => { if (o.userData.thing && !live.has(o)) scene.remove(o); });
        live.forEach(m => m.userData.thing = true);
      }

      /* ---------- camera ---------- */
      function resize() { st.resize(); return W; }
      function aim(w, h) {
        W = H * w / h;
        const half = W / 2 / U, fov = st.camera.fov * Math.PI / 360;
        const d = Math.max(9, half / Math.tan(fov) / st.camera.aspect * .92);
        const tx = half + .6;
        st.camera.position.set(tx - 2.6, 3.4, d * 1.12);
        st.camera.lookAt(tx - .9, 1.7, 0);
        st.camera.updateProjectionMatrix();
      }

      /* ---------- draw one frame ---------- */
      function paint(run, state) {
        const r = run || { y: 0, vy: 0, t: 0, flip: 0, crash: null, dist: 0, things: [], popups: [] };
        const dist = r.dist || 0, moved = (dist - lastDist) / U;
        lastDist = dist;
        if (moved > 0 && moved < 5) decor.forEach(d => {
          d.o.position.x -= moved * d.speed;
          if (d.o.position.x < -12) d.o.position.x += d.span;
        });
        tex.offset.x = (dist / U / 10) % 1;
        if (moved < 0) lastDist = 0;

        const cx = (DINO_X + 50) / U, cr = r.crash;
        const bob = r.y === 0 && state === "play" && !cr ? Math.sin(r.t * 18) * .04 : 0;
        const tilt = Math.max(-.25, Math.min(.25, r.vy / 2600));
        dino.userData.anim(r.t || st.t);
        if (cr) {
          rider.position.set(cx + cr.x / U, -cr.y / U, 0);
          rider.rotation.set(0, 0, 0);
          dino.rotation.z = -cr.rot;
          dino.position.y = .32;
          boardWrap.position.set(cr.boardX / U - cr.x / U, cr.y / U, 0);
          boardWrap.rotation.set(0, 0, -cr.boardX * .01);
          stars.visible = true;
          stars.children.forEach((s, i) => {
            const a = cr.t * 6 + i * 2.1;
            s.position.set(rider.position.x + Math.cos(a) * 1.3, 3.6 - cr.y / U * 0 + Math.sin(a) * .3 + rider.position.y, Math.sin(a) * 1.3);
            s.rotation.y = a * 2;
          });
        } else {
          stars.visible = false;
          rider.position.set(cx, -r.y / U, 0);
          rider.rotation.set(0, 0, -tilt);
          dino.rotation.z = 0;
          dino.position.y = .32 + bob;
          boardWrap.position.set(0, 0, 0);
          boardWrap.rotation.set(r.flip ? r.flip * Math.PI * 2 : 0, 0, 0);
        }
        const air = Math.max(0, rider.position.y);
        blob.position.x = rider.position.x;
        blob.scale.set(1.9 - Math.min(1, air / 5), 1 - Math.min(.5, air / 8), 1);
        blob.material.opacity = .3 - Math.min(.18, air / 25);

        syncThings(r);
        st.render();

        // HUD
        const score = run ? Math.floor(run.dist / 10) + run.bonus : "";
        hud.querySelector(".sk-score").textContent = run ? score : "";
        hud.querySelector(".sk-pops").innerHTML = (r.popups || []).map(p => `<span style="opacity:${(1 - p.t).toFixed(2)};transform:translateY(${(-p.t * 14).toFixed(0)}px)">${p.text}</span>`).join("");
        const word = hud.querySelector(".sk-word");
        word.textContent = cr ? run.word : "";
        word.classList.toggle("on", !!cr);
      }

      return {
        canvas: st.canvas,
        resize,
        paint,
        dispose() { tex.dispose(); hud.remove(); st.dispose(); }
      };
    }
  };
})();
