/*
 * 3D jungle pieces shared by the home screen, Hangman and Dino Skate.
 *   RR.d3.scenery.palm(h), fern(s), volcano(s), rock(s), log(s), bone(s), bush(s), egg(s), cloud(s), meteor(), ground(r)
 *   RR.d3.jungle(scene, opts) → a ready-made island with your dino's surroundings (home + Hangman)
 * Each returns a THREE.Group standing on y = 0.
 */
(function () {
  if (!RR.d3 || !window.THREE) return;
  const T = THREE, D = RR.d3, M = D.mat;
  const sm = (geo, mat, p, r, s) => D.mesh(geo, mat, p, r, s);
  const g = (...kids) => { const G = new T.Group(); kids.forEach(k => G.add(k)); return G; };

  const S = {
    palm(h = 2.6) {
      const G = new T.Group(), bend = .5;
      const pts = [[0, 0], [bend * .15, h * .35], [bend * .5, h * .7], [bend, h]];
      G.add(sm(D.tube(pts, [.14, .12, .1, .09], { seg: 12, rad: 10 }), M("#8A5A2E")));
      for (let i = 1; i < 6; i++) {           // trunk rings
        const p = new T.CatmullRomCurve3(pts.map(q => new T.Vector3(q[0], q[1], 0))).getPoint(i / 6);
        G.add(sm(new T.TorusGeometry(.12 - i * .006, .025, 6, 14), M("#6B4423"), [p.x, p.y, 0], [Math.PI / 2, 0, 0]));
      }
      const leaf = M("#3E8E4F", { side: T.DoubleSide }), leaf2 = M("#5FAE3E", { side: T.DoubleSide });
      for (let i = 0; i < 7; i++) {
        const a = i / 7 * Math.PI * 2, geo = new T.PlaneGeometry(1.3, .32, 8, 1), P = geo.attributes.position;
        for (let j = 0; j < P.count; j++) {
          const x = P.getX(j) + .65, y = P.getY(j);
          P.setXYZ(j, x, -x * x * .45 + .15, y * Math.sin(Math.min(1, x / 1.3) * Math.PI) * 1.2);
        }
        geo.computeVertexNormals();
        const l = sm(geo, i % 2 ? leaf : leaf2, [bend, h, 0], [0, a, 0]);
        G.add(l);
      }
      G.add(sm(new T.SphereGeometry(.09, 10, 8), M("#6B4423"), [bend + .08, h - .08, .06]));
      G.add(sm(new T.SphereGeometry(.09, 10, 8), M("#6B4423"), [bend - .05, h - .1, -.07]));
      return G;
    },

    fern(s = 1, color = "#3E8E4F") {
      const G = new T.Group(), mat = M(color, { side: T.DoubleSide });
      for (let i = 0; i < 6; i++) {
        const geo = new T.PlaneGeometry(.18, .9, 1, 6), P = geo.attributes.position;
        for (let j = 0; j < P.count; j++) {
          const y = P.getY(j) + .45, x = P.getX(j) * (1 - y / 1.1);
          P.setXYZ(j, x, y, y * y * .5);
        }
        geo.computeVertexNormals();
        G.add(sm(geo, mat, [0, 0, 0], [0, i / 6 * Math.PI * 2, 0]));
      }
      G.scale.setScalar(s);
      return G;
    },

    volcano(s = 1) {
      const G = new T.Group();
      const cone = new T.CylinderGeometry(.55, 2.1, 2.4, 28, 4, true);
      G.add(sm(cone, M("#7A5638", { flatShading: true }), [0, 1.2, 0]));
      G.add(sm(new T.CylinderGeometry(.5, .5, .06, 24), M("#FF7A1A", { emissive: new T.Color("#FF5A00"), emissiveIntensity: 1 }), [0, 2.36, 0]));
      [[.3, 2.25, .45, .5], [-.4, 1.9, .5, .42], [.55, 1.5, .52, .38]].forEach(([x, y, z, sc]) =>
        G.add(sm(new T.SphereGeometry(.4, 10, 8), M("#FF7A1A", { emissive: new T.Color("#FF5A00"), emissiveIntensity: .8 }), [x * 1.2, y, z * 1.6], 0, [sc * .25, sc * .9, sc * .25])));
      const smoke = new T.Group();
      for (let i = 0; i < 4; i++) smoke.add(sm(new T.SphereGeometry(.3 + i * .08, 14, 10), M("#D9D2C8", { transparent: true, opacity: .85 }), [i * .25, 2.7 + i * .45, 0]));
      smoke.children.forEach(c => c.castShadow = false);
      G.add(smoke);
      G.userData.anim = t => smoke.children.forEach((c, i) => {
        const k = (t * .25 + i / 4) % 1;
        c.position.set(k * 1.2, 2.5 + k * 2, 0); c.scale.setScalar(.6 + k * 1.2); c.material.opacity = .85 * (1 - k);
      });
      G.scale.setScalar(s);
      return G;
    },

    rock(s = 1) {
      const geo = new T.DodecahedronGeometry(.5, 1), P = geo.attributes.position;
      for (let i = 0; i < P.count; i++) {
        const h = Math.sin(P.getX(i) * 12.9 + P.getY(i) * 78.2 + P.getZ(i) * 37.7) * 43758.5;
        P.setXYZ(i, P.getX(i) * 1.25, Math.max(-.05, P.getY(i)) * .8, P.getZ(i));
        P.setXYZ(i, P.getX(i) * (.92 + (h - Math.floor(h)) * .16), P.getY(i), P.getZ(i));
      }
      geo.computeVertexNormals();
      const r = sm(geo, M("#8C8577", { flatShading: true }), [0, .02, 0]);
      r.receiveShadow = true;
      const G = g(r); G.scale.setScalar(s);
      return G;
    },

    log(s = 1) {
      const G = g(
        sm(new T.CylinderGeometry(.42, .45, 2.2, 20), M("#8A5A2E"), [0, .42, 0], [Math.PI / 2, 0, 0]),
        sm(new T.CylinderGeometry(.36, .36, .02, 20), M("#E2B77A"), [0, .42, 1.105], [Math.PI / 2, 0, 0]),
        sm(new T.CylinderGeometry(.36, .36, .02, 20), M("#E2B77A"), [0, .42, -1.105], [Math.PI / 2, 0, 0]),
        sm(new T.TorusGeometry(.2, .02, 6, 18), M("#B8864A"), [0, .42, 1.12]));
      G.scale.setScalar(s);
      return G;
    },

    bone(s = 1) {
      const b = M("#F2EAD3");
      const G = g(sm(new T.CylinderGeometry(.12, .12, 1.3, 14), b, [0, .2, 0], [0, 0, Math.PI / 2]));
      [[-.65, .1], [-.65, -.1], [.65, .1], [.65, -.1]].forEach(([x, z]) => G.add(sm(new T.SphereGeometry(.17, 14, 10), b, [x, .2, z * 1.4])));
      G.scale.setScalar(s);
      return G;
    },

    bush(s = 1) {
      const G = new T.Group();
      [[0, .45, 0, .5, "#3E8E4F"], [.35, .35, .2, .38, "#5FAE3E"], [-.35, .32, -.15, .36, "#4E9E45"], [.05, .75, .1, .3, "#5FAE3E"]]
        .forEach(([x, y, z, r, c]) => G.add(sm(new T.IcosahedronGeometry(r, 1), M(c, { flatShading: true }), [x, y, z])));
      G.scale.setScalar(s);
      return G;
    },

    egg(s = 1) {
      const G = g(sm(new T.SphereGeometry(.3, 22, 16), M("#FFD23F", { emissive: new T.Color("#FFB000"), emissiveIntensity: .35, roughness: .3, metalness: .3 }), [0, .38, 0], 0, [.8, 1, .8]));
      [[.12, .3, .2], [-.1, .45, .22], [.05, .55, -.22]].forEach(p => G.add(sm(new T.SphereGeometry(.035, 8, 6), M("#E0A21B"), p)));
      G.scale.setScalar(s);
      return G;
    },

    cloud(s = 1) {
      const G = new T.Group(), w = M("#ffffff", { roughness: 1, emissive: new T.Color("#ffffff"), emissiveIntensity: .25 });
      [[0, 0, 0, .7], [.7, -.1, 0, .5], [-.7, -.12, 0, .52], [.3, .3, 0, .5], [-.3, .25, .1, .45]].forEach(([x, y, z, r]) => {
        const m = sm(new T.SphereGeometry(r, 16, 12), w, [x, y, z]); m.castShadow = false; G.add(m);
      });
      G.scale.setScalar(s);
      return G;
    },

    meteor() {
      const G = new T.Group();
      const geo = new T.IcosahedronGeometry(.45, 1), P = geo.attributes.position;
      for (let i = 0; i < P.count; i++) { const h = Math.sin(i * 12.9898) * 43758.5; const f = .85 + (h - Math.floor(h)) * .3; P.setXYZ(i, P.getX(i) * f, P.getY(i) * f, P.getZ(i) * f); }
      geo.computeVertexNormals();
      G.add(sm(geo, M("#6B4A2E", { flatShading: true, emissive: new T.Color("#FF5A00"), emissiveIntensity: .35 })));
      const glow = sm(new T.SphereGeometry(.7, 20, 14), M("#FFB347", { transparent: true, opacity: .35, emissive: new T.Color("#FF7A1A"), emissiveIntensity: 1 }));
      glow.castShadow = false; G.add(glow);
      const trail = sm(new T.ConeGeometry(.5, 2.4, 20, 1, true), M("#FF7A1A", { transparent: true, opacity: .55, emissive: new T.Color("#FF7A1A"), emissiveIntensity: 1, side: T.DoubleSide }), [0, 1.3, 0]);
      const trail2 = sm(new T.ConeGeometry(.28, 1.6, 16, 1, true), M("#FFE27A", { transparent: true, opacity: .8, emissive: new T.Color("#FFD23F"), emissiveIntensity: 1.2, side: T.DoubleSide }), [0, .9, 0]);
      trail.castShadow = trail2.castShadow = false;
      const tr = g(trail, trail2); G.add(tr); G.userData.trail = tr;
      G.userData.anim = t => { G.children[0].rotation.set(t * 2, t * 3, 0); tr.scale.set(1, .9 + Math.sin(t * 30) * .1, 1); };
      return G;
    },

    // round grassy island
    ground(r = 7) {
      const G = new T.Group();
      const top = sm(new T.CylinderGeometry(r, r * .96, .5, 48), M("#7CC24E"), [0, -.25, 0]);
      top.receiveShadow = true; top.castShadow = false;
      const dirt = sm(new T.CylinderGeometry(r * .96, r * .6, 1.4, 48), M("#A9824F"), [0, -1.2, 0]);
      dirt.castShadow = false;
      G.add(top, dirt);
      return G;
    }
  };

  // Island with palms, ferns, volcano, rocks and clouds. Returns { root, anim(t) }
  function jungle(scene, o = {}) {
    const root = new T.Group(), anims = [];
    root.add(S.ground(o.r || 7));
    const v = S.volcano(1.3); v.position.set(3.6, 0, -4.4); root.add(v); anims.push(v.userData.anim);
    [[3.6, -2.2, 3, .3], [-4.6, -1.5, 2.6, -.4], [4.8, .6, 2.2, 2.6], [-1.2, -4.8, 2.8, 1]].forEach(([x, z, h, ry]) => {
      const p = S.palm(h); p.position.set(x, 0, z); p.rotation.y = ry; root.add(p);
    });
    [[2.2, 1.8, .8], [-2.6, 2.2, .9, "#5FAE3E"], [1.4, -2.6, .7], [-3.6, .8, .8, "#5FAE3E"], [4, 2.8, .9]].forEach(([x, z, s, c]) => {
      const f = S.fern(s, c); f.position.set(x, 0, z); root.add(f);
    });
    [[3, 0, 3.4, .7], [-2.4, 0, 3.6, .5], [2.6, 0, -.6, .45]].forEach(([x, , z, s]) => { const r = S.rock(s); r.position.set(x, 0, z); root.add(r); });
    const clouds = [[-3, 6.2, -6, 1.3], [3.5, 7, -7, 1], [7, 5.6, -5, .9]].map(([x, y, z, s]) => {
      const c = S.cloud(s); c.position.set(x, y, z); root.add(c); return c;
    });
    anims.push(t => clouds.forEach((c, i) => c.position.x += Math.sin(t * .2 + i) * .002));
    root.traverse(m => { if (m.isMesh && m.castShadow !== false) m.receiveShadow = true; });
    scene.add(root);
    return { root, anim: t => anims.forEach(f => f(t)) };
  }

  D.scenery = S;
  D.jungle = jungle;
})();
