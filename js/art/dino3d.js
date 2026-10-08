/*
 * The player's dino in 3D: the 5 species and every Dino Shop item, built from smooth shapes.
 *
 *   RR.d3.dino(look, opts) → THREE.Group facing +x, feet on y = 0
 *        opts.fossil = true → bone-colored, no clothes (Hangman KABOOM)
 *        group.userData.anim(t) → tail swish, breathing, cape flutter, rocket flames
 *        group.userData.head   → THREE.Box3 around the head (for avatars)
 *   RR.d3.dinoPicture(look, "head"|"body", size) → data: URL picture (cached)
 *
 * Positions use the old SVG drawings / 50 (x → right, y → up), so proportions match the 2D art.
 */
(function () {
  if (!RR.d3 || !window.THREE) return;
  const T = THREE, D = RR.d3;
  const OL = "#241C10", BONE = "#E2D6B8", AMBER = "#D89A2B";

  const skinGeo = () => new T.SphereGeometry(1, 22, 16);
  const starShape = (r, inner) => {
    const s = new T.Shape();
    for (let i = 0; i < 10; i++) {
      const a = Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * (inner || .45) : r;
      i ? s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    return s;
  };
  const extrude = (shape, depth) => new T.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: depth * .3, bevelThickness: depth * .3, bevelSegments: 2 });

  /* ---------- builder kit for one dino ---------- */
  function kit(group, o) {
    const skin = D.skin();
    const add = m => { group.add(m); return m; };
    const S = m => { m.userData.skin = true; return add(m); };
    const k = {
      group,
      body: (pts, radii, opt) => S(D.mesh(D.tube(pts, radii, opt), skin)),
      ell: (p, s, r) => S(D.mesh(skinGeo(), skin, p, r, s)),
      limb: (a, b, r1, r2) => S(D.limb(skin, a, b, r1, r2)),
      // tail on its own pivot so it can swish
      tail: (pivot, pts, radii, opt) => {
        const g = new T.Group(); g.position.set(pivot[0], pivot[1], 0);
        const m = D.mesh(D.tube(pts, radii, Object.assign({ sz: .85 }, opt)), skin); m.userData.skin = true;
        g.add(m); add(g); group.userData.tail = g; return g;
      },
      both: fn => { fn(1); fn(-1); },
      bone: (geo, p, r, s) => add(D.mesh(geo, D.mat(o.fossil ? "#CDBB92" : BONE), p, r, s)),
      dark: (geo, p, r, s, c) => add(D.mesh(geo, D.mat(c || OL), p, r, s)),
      eye: (p, w, r) => k.both(z => {
        if (o.fossil) { k.dark(skinGeo(), [p[0], p[1], z * w * .96], 0, [r * 1.1, r * 1.1, r * .5], "#5A4A36"); return; }
        add(D.ball(D.mat(AMBER, { roughness: .35 }), [p[0], p[1], z * w], [r, r, r * .7]));
        add(D.ball(D.mat("#120E08", { roughness: .2 }), [p[0] + r * .2, p[1], z * (w + r * .45)], [r * .5, r * .55, r * .35]));
        add(D.ball(D.mat("#ffffff", { emissive: new T.Color("#ffffff"), emissiveIntensity: .6 }), [p[0] + r * .4, p[1] + r * .32, z * (w + r * .62)], r * .16));
      }),
      // smiling mouth line, given for the near (+z) side; mirrored to the far side
      smile: (pts, w) => k.both(z => add(D.mesh(D.tube(pts.map(p => [p[0], p[1], p[2] * z]), pts.map(() => w || .018), { seg: 16, rad: 6 }),
        D.mat(o.fossil ? "#8A7650" : "#3A2A18")))),
      claws: (p, n, len) => { for (let i = 0; i < n; i++) k.bone(new T.ConeGeometry(len * .3, len, 8), [p[0], p[1], p[2] + (i - (n - 1) / 2) * len * .7], [0, 0, -Math.PI / 2]); },
      nails: (x, z, r) => { for (let i = -1; i <= 1; i++) k.bone(skinGeo(), [x + r * .9, .05, z + i * r * .55], 0, [r * .28, r * .25, r * .22]); }
    };
    return k;
  }

  /* ---------- the five dinos ----------
   * anchors (where shop items go): hat [x,y,tilt,scale], eyes [x,y,halfWidth,scale],
   * neck [x,y,radius,dirX,dirY,scale], back [x,y,tilt,scale]. head: [x,y,size] box for avatars */
  const SPECIES = {
    trex: {
      stripes: 9,
      anchors: { hat: [1.38, 2.99, -.1, 1], eyes: [1.42, 2.86, .2, 1], neck: [1.0, 2.15, .3, .45, .6, 1], back: [.25, 2.3, -.05, 1] },
      head: [1.5, 2.72, 1.25],
      build(k) {
        k.tail([-.3, 1.82], [[0, 0], [-.7, .06], [-1.4, .05], [-2.1, -.06]], [.4, .25, .12, .025]);
        k.body([[-.45, 1.8], [.15, 1.78], [.75, 1.9], [1.05, 2.22], [1.2, 2.52]], [.42, .56, .46, .3, .27], { sz: .82 });
        k.body([[1.05, 2.66], [1.38, 2.78], [1.75, 2.71], [2.02, 2.63]], [.3, .3, .24, .17], { sn: .85, sz: .78 });
        k.body([[1.12, 2.47], [1.55, 2.42], [1.98, 2.47]], [.22, .15, .1], { sn: .8, sz: .7 });
        k.both(z => k.ell([1.42, 2.94, z * .16], [.13, .04, .07], [0, 0, -.15]));
        k.eye([1.42, 2.86], .2, .062);
        k.smile([[2.05, 2.55, .06], [1.8, 2.52, .14], [1.5, 2.56, .19], [1.36, 2.66, .2]]);
        k.both(z => { [1.62, 1.75, 1.88].forEach((x, i) => k.bone(new T.ConeGeometry(.022, .07, 6), [x, 2.52, z * (.15 - i * .025)], [Math.PI, 0, 0])); });
        k.both(z => k.dark(new T.SphereGeometry(1, 8, 6), [2.06, 2.72, z * .07], 0, .024));
        k.both(z => {
          k.limb([1.0, 1.72, z * .3], [1.14, 1.55, z * .34], .07, .055);
          k.limb([1.14, 1.55, z * .34], [1.3, 1.6, z * .33], .05, .035);
          k.ell([.3, 1.45, z * .3], [.36, .48, .22], [0, 0, -.25]);
          k.limb([.38, 1.15, z * .32], [.18, .6, z * .32], .17, .11);
          k.limb([.18, .6, z * .32], [.42, .13, z * .32], .1, .08);
          k.ell([.62, .07, z * .32], [.27, .08, .13]);
          k.claws([.9, .06, z * .32], 3, .1);
        });
      }
    },

    raptor: {
      stripes: 0,
      anchors: { hat: [1.0, 2.75, -.05, .72], eyes: [1.03, 2.64, .145, .7], neck: [.6, 2.08, .19, .3, 1, .62], back: [-.05, 1.98, -.05, .72] },
      head: [1.2, 2.55, .95],
      build(k, o, dark) {
        k.tail([-.45, 1.63], [[0, 0], [-.7, .1], [-1.4, .18], [-2.0, .22]], [.28, .16, .08, .03]);
        k.body([[-.55, 1.6], [-.05, 1.62], [.4, 1.75], [.62, 2.1], [.75, 2.42]], [.3, .38, .3, .17, .15], { sz: .78 });
        k.body([[.7, 2.52], [1.0, 2.6], [1.45, 2.5], [1.82, 2.43]], [.21, .21, .13, .07], { sn: .8, sz: .74 });
        k.body([[.82, 2.42], [1.4, 2.37], [1.76, 2.4]], [.13, .08, .04], { sn: .7, sz: .7 });
        k.eye([1.03, 2.64], .145, .05);
        k.smile([[1.8, 2.42, .03], [1.5, 2.41, .08], [1.2, 2.45, .12], [1.1, 2.52, .13]], .014);
        // head feathers
        [[.78, 2.66, .9], [.7, 2.62, 1.2], [.66, 2.54, 1.5]].forEach(([x, y, a]) =>
          k.dark(new T.ConeGeometry(.05, .32, 8), [x - Math.sin(a) * .14, y + Math.cos(a) * .14 * .3, 0], [0, 0, a], 1, dark));
        k.both(z => {
          k.limb([.45, 1.75, z * .25], [.62, 1.48, z * .27], .06, .05);
          k.limb([.62, 1.48, z * .27], [.86, 1.46, z * .25], .05, .035);
          k.dark(skinGeo(), [.68, 1.42, z * .29], [0, 0, .1], [.2, .05, .02], dark);
          k.ell([0, 1.35, z * .2], [.26, .36, .15], [0, 0, -.2]);
          k.limb([.05, 1.1, z * .21], [-.12, .58, z * .21], .11, .07);
          k.limb([-.12, .58, z * .21], [.12, .1, z * .21], .07, .05);
          k.ell([.3, .05, z * .21], [.18, .05, .075]);
          k.bone(new T.ConeGeometry(.03, .16, 6), [.14, .17, z * .21], [0, 0, -.35]);
          k.claws([.48, .05, z * .21], 2, .07);
        });
      }
    },

    trike: {
      stripes: 0,
      anchors: { hat: [.95, 3.0, -.45, .9], eyes: [1.52, 2.0, .27, .85], neck: [1.0, 1.6, .5, 1, .25, .95], back: [-.1, 2.3, 0, 1] },
      head: [1.45, 2.2, 1.7],
      build(k, o, dark) {
        k.tail([-1.0, 1.4], [[0, 0], [-.6, -.15], [-1.2, -.45], [-1.7, -.72]], [.32, .18, .08, .02]);
        k.body([[-1.1, 1.45], [-.6, 1.62], [.1, 1.7], [.7, 1.6], [1.05, 1.5]], [.36, .6, .68, .58, .42], { sz: .92 });
        k.both(z => {
          [[.72, .2], [-.62, .23]].forEach(([x, r]) => {
            k.limb([x, 1.35, z * .45], [x + .04, .12, z * .45], r, r * .85);
            k.ell([x + .06, .07, z * .45], [r * 1.05, .08, r * .95]);
            k.nails(x + .06, z * .45, r);
          });
        });
        // frill with bony knobs
        const frill = new T.Group(); frill.position.set(1.12, 2.25, 0); frill.rotation.z = .5;
        const fm = D.mesh(new T.CylinderGeometry(.72, .72, .07, 40, 1, false, 0, Math.PI), k.group.userData.frillMat, [0, 0, 0], [0, 0, Math.PI / 2]);
        fm.material = D.mat(o.fossil ? "#CDBB92" : RR.art.shade(o.base, -.15), { side: T.DoubleSide });
        frill.add(fm);
        for (let i = 0; i <= 8; i++) {
          const a = i / 8 * Math.PI, kn = D.mesh(skinGeo(), D.mat(o.fossil ? "#CDBB92" : BONE), [0, .72 * Math.sin(a) * 1, .72 * Math.cos(a)], 0, .07);
          frill.add(kn);
        }
        k.group.add(frill);
        k.body([[1.18, 1.98], [1.5, 1.8], [1.9, 1.58]], [.38, .3, .15], { sn: .95, sz: .8 });
        k.dark(new T.ConeGeometry(.12, .25, 12), [2.02, 1.52, 0], [0, 0, -2.1], [1, 1, .7], "#5A4A36");
        k.both(z => {
          const h = D.mesh(new T.ConeGeometry(.075, .7, 12), D.mat(o.fossil ? "#CDBB92" : BONE), [1.62, 2.38, z * .16], [z * -.15, 0, -.6]);
          k.group.add(h);
        });
        k.bone(new T.ConeGeometry(.06, .22, 10), [1.86, 1.86, 0], [0, 0, -.35]);
        k.eye([1.52, 2.0], .27, .058);
        k.smile([[1.95, 1.48, .05], [1.75, 1.5, .14], [1.55, 1.56, .2], [1.48, 1.64, .21]], .016);
      }
    },

    stego: {
      stripes: 0,
      anchors: { hat: [1.62, 1.71, -.1, .55], eyes: [1.68, 1.59, .15, .55], neck: [1.18, 1.42, .23, 1, .3, .58], back: [.72, 2.12, -.35, .8] },
      head: [1.62, 1.55, .85],
      build(k, o, dark) {
        k.tail([-1.1, 1.3], [[0, 0], [-.6, .1], [-1.2, .3], [-1.7, .62]], [.3, .17, .09, .03]);
        const spikes = new T.Group(); k.group.userData.tail.add(spikes);
        k.both(z => [[-1.45, .5], [-1.62, .62]].forEach(([x, y]) => {
          const s = D.mesh(new T.ConeGeometry(.05, .38, 8), D.mat(o.fossil ? "#CDBB92" : BONE), [x, y + .12, z * .14], [z * .9, 0, .4]);
          spikes.add(s);
        }));
        k.body([[-1.2, 1.3], [-.6, 1.68], [0, 1.82], [.6, 1.62], [1.0, 1.35]], [.3, .6, .72, .55, .3], { sz: .85 });
        k.body([[.95, 1.38], [1.3, 1.46], [1.62, 1.52], [1.92, 1.45]], [.24, .2, .2, .12], { sn: .9, sz: .78 });
        k.eye([1.68, 1.59], .15, .042);
        k.smile([[1.94, 1.42, .04], [1.78, 1.42, .1], [1.66, 1.46, .13], [1.62, 1.51, .14]], .012);
        // back plates in two rows
        const plateMat = D.mat(o.fossil ? "#CDBB92" : RR.art.mix(o.base, "#9C5A3A", .6), { roughness: .7 });
        const spine = new T.CatmullRomCurve3([[-1.25, 1.55], [-.6, 2.25], [0, 2.52], [.6, 2.15], [.95, 1.68]].map(p => new T.Vector3(p[0], p[1], 0)));
        for (let i = 0; i < 9; i++) {
          const t = .06 + i / 8 * .86, p = spine.getPoint(t), tan = spine.getTangent(t);
          const size = .22 + Math.sin(t * Math.PI) * .26, z = (i % 2 ? 1 : -1) * .07;
          const pl = D.mesh(new T.ConeGeometry(1, 1, 4), plateMat, [p.x, p.y + size * .35, z], [0, 0, Math.atan2(tan.y, tan.x)], [size * .55, size, .05]);
          pl.rotation.z = Math.atan2(tan.y, tan.x) * .6;
          k.group.add(pl);
        }
        k.both(z => {
          [[.68, .17, 1.32], [-.6, .24, 1.45]].forEach(([x, r, top]) => {
            k.limb([x, top, z * .42], [x + .03, .12, z * .42], r, r * .85);
            k.ell([x + .05, .07, z * .42], [r * 1.05, .08, r * .95]);
            k.nails(x + .05, z * .42, r);
          });
        });
      }
    },

    brachio: {
      stripes: 0,
      anchors: { hat: [1.42, 3.62, -.08, .72], eyes: [1.42, 3.48, .15, .7], neck: [.86, 2.25, .24, .45, 1, .72], back: [-.1, 2.05, -.05, .95] },
      head: [1.45, 3.35, 1.0],
      build(k) {
        k.tail([-1.1, 1.3], [[0, 0], [-.6, -.1], [-1.2, -.4], [-1.75, -.82]], [.32, .18, .08, .02]);
        k.body([[-1.2, 1.25], [-.6, 1.4], [.1, 1.48], [.6, 1.55]], [.36, .56, .62, .5], { sz: .9 });
        k.body([[.45, 1.65], [.85, 2.2], [1.1, 2.8], [1.22, 3.32]], [.42, .26, .18, .15], { sz: .92 });
        k.body([[1.12, 3.38], [1.45, 3.43], [1.82, 3.36]], [.21, .19, .12], { sn: .85, sz: .8 });
        k.ell([1.38, 3.58, 0], [.15, .1, .12]);
        k.eye([1.42, 3.48], .15, .046);
        k.smile([[1.85, 3.33, .04], [1.68, 3.31, .1], [1.55, 3.34, .13], [1.5, 3.4, .14]], .013);
        k.both(z => {
          [[.6, .2, 1.4], [-.7, .22, 1.25]].forEach(([x, r, top]) => {
            k.limb([x, top, z * .4], [x + .02, .12, z * .4], r, r * .9);
            k.ell([x + .05, .07, z * .4], [r * 1.05, .08, r * .95]);
            k.nails(x + .05, z * .4, r);
          });
        });
      }
    }
  };

  /* ---------- shop items in 3D (origin = the anchor; x forward, y up) ----------
   * Each builder gets (m, d, l) = main, darker, lighter color and returns a Group. */
  const g = (...kids) => { const G = new T.Group(); kids.forEach(c => G.add(c)); return G; };
  const M = (hex, o) => D.mat(hex, o);
  const metal = hex => D.mat(hex, { metalness: .65, roughness: .3 });
  const sm = (geo, mat, p, r, s) => D.mesh(geo, mat, p, r, s);

  const HATS = {
    cap: (m, d) => g(
      sm(new T.SphereGeometry(.25, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M(m), [0, -.02, 0], 0, [1, .8, 1]),
      sm(new T.CylinderGeometry(.2, .2, .025, 24, 1, false, -Math.PI / 2, Math.PI), M(d), [.2, -.01, 0], [0, 0, .08], [1.3, 1, 1.2]),
      sm(new T.SphereGeometry(.03, 10, 8), M(d), [0, .18, 0])),
    party: m => g(
      sm(new T.ConeGeometry(.17, .5, 24), M(m), [0, .24, 0]),
      sm(new T.TorusGeometry(.135, .018, 8, 24), M("#FFD23F"), [0, .1, 0], [Math.PI / 2, 0, 0]),
      sm(new T.TorusGeometry(.08, .016, 8, 24), M("#FFD23F"), [0, .26, 0], [Math.PI / 2, 0, 0]),
      sm(new T.SphereGeometry(.065, 14, 10), M("#FF5DA2"), [0, .5, 0])),
    cowboy: (m, d, l) => g(
      sm(new T.CylinderGeometry(.15, .19, .24, 24), M(m), [0, .12, 0], 0, [1.15, 1, 1]),
      sm(new T.SphereGeometry(.15, 20, 8, 0, Math.PI * 2, 0, Math.PI / 2), M(m), [0, .22, 0], 0, [1.15, .35, 1]),
      sm(new T.TorusGeometry(.19, .022, 8, 28), M(d), [0, .04, 0], [Math.PI / 2, 0, 0], [1.15, 1, 1]),
      sm(new T.CylinderGeometry(.42, .42, .025, 36), M(l), [0, .01, 0], 0, [1.1, 1, 1]),
      sm(new T.TorusGeometry(.42, .03, 8, 36), M(l), [0, .03, 0], [Math.PI / 2, 0, 0], [1.1, 1, 1])),
    pirate: m => g(
      sm(new T.SphereGeometry(.4, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), M(m), [0, 0, 0], 0, [.42, .62, 1]),
      sm(new T.TorusGeometry(.4, .016, 6, 40, Math.PI), metal("#D9B44A"), [0, .0, 0], [0, Math.PI / 2, 0], [1, .62, .42]),
      sm(new T.SphereGeometry(.055, 12, 10), M("#ffffff"), [.17, .13, 0]),
      sm(new T.BoxGeometry(.012, .1, .016), M("#ffffff"), [.175, .06, 0], [.8, 0, 0]),
      sm(new T.BoxGeometry(.012, .1, .016), M("#ffffff"), [.175, .06, 0], [-.8, 0, 0])),
    tophat: m => g(
      sm(new T.CylinderGeometry(.3, .3, .025, 32), M(m), [0, .012, 0]),
      sm(new T.CylinderGeometry(.18, .17, .42, 28), M(m), [0, .23, 0]),
      sm(new T.CylinderGeometry(.176, .176, .07, 28), M("#B02E2E"), [0, .08, 0])),
    wizard: m => {
      const cone = sm(new T.ConeGeometry(.2, .72, 28), M(m), [-.04, .36, 0], [0, 0, .12]);
      const star = sm(extrude(starShape(.07), .015), M("#FFD23F", { emissive: new T.Color("#FFB000"), emissiveIntensity: .3 }), [.13, .26, 0], [0, Math.PI / 2, 0]);
      return g(cone, star,
        sm(new T.CylinderGeometry(.33, .33, .025, 32), M(m), [0, .012, 0]),
        sm(new T.OctahedronGeometry(.03), M("#FFD23F"), [.06, .5, .07]),
        sm(new T.OctahedronGeometry(.025), M("#FFD23F"), [.1, .14, -.12]));
    },
    crown: m => {
      const C = g(sm(new T.CylinderGeometry(.17, .16, .13, 28, 1, true), metal(m), [0, .065, 0]));
      C.children[0].material = D.mat(m, { metalness: .65, roughness: .3, side: T.DoubleSide });
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * Math.PI * 2;
        C.add(sm(new T.ConeGeometry(.04, .13, 8), metal(m), [Math.cos(a) * .165, .19, Math.sin(a) * .165]));
        C.add(sm(new T.SphereGeometry(.02, 8, 6), M("#ffffff"), [Math.cos(a) * .165, .26, Math.sin(a) * .165]));
      }
      C.add(sm(new T.SphereGeometry(.035, 12, 10), M("#D63B3B", { roughness: .2 }), [.17, .065, 0]));
      C.add(sm(new T.SphereGeometry(.025, 10, 8), M("#3C9CE0", { roughness: .2 }), [0, .065, .17]));
      C.add(sm(new T.SphereGeometry(.025, 10, 8), M("#3CB371", { roughness: .2 }), [0, .065, -.17]));
      return C;
    }
  };

  // Glasses: origin halfway between the eyes; eyes sit at z = ±w
  const band = (w, mat) => sm(new T.TorusGeometry(w + .05, .014, 6, 24, Math.PI), mat, [.02, 0, 0], [0, Math.PI / 2, 0]);
  const GLASSES = {
    shades: (m, d, l) => (w) => {
      const G = g(band(w, M(m)));
      [1, -1].forEach(z => {
        G.add(sm(new T.BoxGeometry(.2, .12, .025), M(m, { roughness: .25, metalness: .2 }), [.03, 0, z * (w + .045)]));
        G.add(sm(new T.BoxGeometry(.14, .025, .006), M(l, { roughness: .1 }), [.04, .025, z * (w + .06)]));
      });
      return G;
    },
    nerd: m => (w) => {
      const G = g(band(w, M(m)));
      [1, -1].forEach(z => {
        G.add(sm(new T.TorusGeometry(.085, .016, 8, 24), M(m), [.02, 0, z * (w + .04)]));
        G.add(sm(new T.CircleGeometry(.08, 20), M("#CFE9FF", { transparent: true, opacity: .35, side: T.DoubleSide }), [.02, 0, z * (w + .04)]));
      });
      return G;
    },
    starglasses: m => (w) => {
      const G = g(band(w, M(m)));
      [1, -1].forEach(z => G.add(sm(extrude(starShape(.12), .015), M(m, { roughness: .4 }), [.02, 0, z * (w + .03) - (z < 0 ? .03 : 0)])));
      return G;
    }
  };

  // Neckwear: origin = middle of the neck, local y runs up the neck, local x points to the throat
  const NECK = {
    bowtie: (m, d) => r => g(
      sm(new T.ConeGeometry(.08, .14, 4), M(m), [r + .03, 0, .07], [-Math.PI / 2, 0, 0]),
      sm(new T.ConeGeometry(.08, .14, 4), M(m), [r + .03, 0, -.07], [Math.PI / 2, 0, 0]),
      sm(new T.SphereGeometry(.04, 12, 10), M(d), [r + .04, 0, 0])),
    scarf: m => r => {
      const G = g(sm(new T.TorusGeometry(r + .02, .065, 10, 28), M(m, { roughness: .95 }), [0, 0, 0], [Math.PI / 2, 0, 0]));
      G.add(sm(new T.BoxGeometry(.06, .34, .13), M(m, { roughness: .95 }), [r + .05, -.15, .08], [0, 0, .15]));
      [-.06, .06].forEach(y => G.add(sm(new T.TorusGeometry(r + .03, .02, 6, 28), M("#ffffff"), [0, y, 0], [Math.PI / 2, 0, 0])));
      return G;
    },
    chain: m => r => g(
      sm(new T.TorusGeometry(r + .03, .02, 8, 32), metal(m), [0, 0, 0], [Math.PI / 2, 0, 0]),
      sm(new T.CylinderGeometry(.08, .08, .025, 24), metal(m), [r + .08, -.08, 0], [0, 0, -Math.PI / 2 + .3]),
      sm(new T.TorusGeometry(.055, .01, 6, 20), metal(RR.art.shade(m, -.3)), [r + .095, -.08, 0], [0, Math.PI / 2 - .3, 0]))
  };

  // Back items: origin on top of the shoulders
  const BACK = {
    cape: (m, d) => () => {
      const geo = new T.PlaneGeometry(1, 1, 10, 16), P = geo.attributes.position;
      const base = [];
      for (let i = 0; i < P.count; i++) {
        const u = P.getX(i), v = .5 - P.getY(i);         // u: side to side, v: 0 at the shoulders, 1 at the bottom
        base.push([u, v]);
      }
      geo.userData.base = base;
      const cape = new T.Mesh(geo, D.mat(m, { side: T.DoubleSide, roughness: .9 }));
      cape.castShadow = true;
      const shape = (t) => {
        for (let i = 0; i < P.count; i++) {
          const [u, v] = base[i], wave = Math.sin(v * 5 - t * 4 + u * 2) * .05 * v;
          P.setXYZ(i, -v * 1.1 - .05 + wave * .4, -v * .2 - (2 * u) * (2 * u) * (.42 + .3 * v) + wave, u * (.85 + v * .3));
        }
        P.needsUpdate = true; geo.computeVertexNormals();
      };
      shape(0);
      const G = g(cape, sm(new T.SphereGeometry(.05, 12, 10), metal("#F2C230"), [.05, 0, .32]), sm(new T.SphereGeometry(.05, 12, 10), metal("#F2C230"), [.05, 0, -.32]));
      G.userData.anim = shape;
      return G;
    },
    rocket: (m, d, l) => () => {
      const G = new T.Group(), flames = [];
      [1, -1].forEach(z => {
        G.add(sm(new T.CylinderGeometry(.1, .1, .48, 20), metal(z > 0 ? m : l), [-.22, -.05, z * .13]));
        G.add(sm(new T.ConeGeometry(.1, .16, 20), M("#D63B3B"), [-.22, .27, z * .13]));
        G.add(sm(new T.CylinderGeometry(.06, .08, .06, 16), metal(d), [-.22, -.32, z * .13]));
        const f = sm(new T.ConeGeometry(.07, .3, 14), M("#FF7A1A", { emissive: new T.Color("#FF7A1A"), emissiveIntensity: 1.2 }), [-.22, -.5, z * .13], [Math.PI, 0, 0]);
        const f2 = sm(new T.ConeGeometry(.035, .18, 10), M("#FFD23F", { emissive: new T.Color("#FFD23F"), emissiveIntensity: 1.5 }), [-.22, -.43, z * .13], [Math.PI, 0, 0]);
        f.castShadow = f2.castShadow = false;
        G.add(f, f2); flames.push(f, f2);
      });
      G.userData.anim = t => flames.forEach((f, i) => f.scale.set(1, .75 + .35 * Math.abs(Math.sin(t * 23 + i * 1.7)), 1));
      return G;
    }
  };

  function paintOf(id, paint) {
    const paints = (RR.data.shop && RR.data.shop.paints) || [];
    const p = paints.find(x => x.id === (paint || {})[id]);
    return p ? p.hex : (RR.art.accessories[id] || { color: "#888888" }).color;
  }
  const colors = (id, paint) => { const m = paintOf(id, paint); return [m, RR.art.shade(m, -.28), RR.art.shade(m, .25)]; };

  const DEFAULT = { species: "trex", color: "natural", hat: null, eyes: null, neck: null, back: null, paint: {} };

  D.dino = function (look, o = {}) {
    const L = Object.assign({}, DEFAULT, look);
    const sp = SPECIES[L.species] || SPECIES.trex;
    const shopColors = (RR.data.shop && RR.data.shop.colors) || [];
    const base = o.fossil ? "#D9CBA6" : (shopColors.find(c => c.id === L.color) || { hex: "#6E7A3C" }).hex;
    const root = new T.Group(), body = new T.Group();
    root.add(body);
    const k = kit(body, { fossil: o.fossil });
    sp.build(k, { base, fossil: o.fossil }, RR.art.shade(base, -.4));
    const anims = [];
    const A = sp.anchors;

    if (!o.fossil) {
      if (L.hat && HATS[L.hat]) {
        const [x, y, tilt, s] = A.hat, h = HATS[L.hat](...colors(L.hat, L.paint));
        h.position.set(x, y - .03 * s, 0); h.rotation.z = tilt; h.scale.setScalar(s);
        body.add(h);
      }
      if (L.eyes && GLASSES[L.eyes]) {
        const [x, y, w, s] = A.eyes, gl = GLASSES[L.eyes](...colors(L.eyes, L.paint))(w / s);
        gl.position.set(x, y, 0); gl.scale.setScalar(s);
        body.add(gl);
      }
      if (L.neck && NECK[L.neck]) {
        const [x, y, r, dx, dy, s] = A.neck, n = NECK[L.neck](...colors(L.neck, L.paint))(r / s);
        n.position.set(x, y, 0); n.scale.setScalar(s);
        D.pointY(n, [dx, dy, 0]);
        body.add(n);
      }
      if (L.back && BACK[L.back]) {
        const [x, y, tilt, s] = A.back, b = BACK[L.back](...colors(L.back, L.paint))();
        b.position.set(x, y, 0); b.rotation.z = tilt; b.scale.setScalar(s);
        body.add(b);
        if (b.userData.anim) anims.push(b.userData.anim);
      }
    }
    body.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = !o.fossil; } });
    D.paintSkin(root, base, { stripes: o.fossil ? 0 : sp.stripes });

    const [hx, hy, hs] = sp.head;
    const extra = L.hat && !o.fossil ? .35 * hs : 0;
    root.userData.head = new T.Box3(new T.Vector3(hx - hs / 2, hy - hs / 2, -hs / 2), new T.Vector3(hx + hs / 2, hy + hs / 2 + extra, hs / 2));
    root.userData.body = body;
    const tail = body.userData.tail;
    root.userData.anim = t => {
      if (tail) { tail.rotation.y = Math.sin(t * 1.8) * .16; tail.rotation.z = Math.sin(t * 1.8 + 1) * .03; }
      body.scale.y = 1 + Math.sin(t * 2.2) * .008;
      anims.forEach(f => f(t));
    };
    return root;
  };

  // A still picture of a dino (top-bar badge, shop cards). Cached per look.
  D.dinoPicture = function (look, part, size) {
    const key = "dino:" + part + ":" + (size || 160) + ":" + JSON.stringify(Object.assign({}, DEFAULT, look));
    return D.snapshot(key, scene => {
      const d = D.dino(look);
      d.userData.anim(0);
      scene.add(d);
      if (part === "head") return d.userData.head;
      d.updateMatrixWorld(true);
      return new T.Box3().setFromObject(d);
    }, part === "head" ? { size, dir: [.7, .12, 1], pad: .95 } : { size, dir: [.5, .2, 1], pad: 1.0 });
  };
})();
