/*
 * 3D toolkit (three.js, self-hosted in js/lib/three.min.js, MIT license).
 *
 *   RR.d3.ok()                      → true if this device can draw 3D (WebGL). If not, screens use the old SVG art.
 *   RR.d3.stage(container, opts)    → a live 3D view inside container (one at a time; the drawing canvas is shared)
 *   RR.d3.snapshot(key, build, opts)→ a still picture (data: URL) of a 3D model, cached by key
 *   RR.d3.tube(points, radii, opts) → smooth tapered tube geometry (dino bodies, tails, necks)
 *   RR.d3.mat(color, opts) / skin()  → materials
 *
 * World units: 1 unit = 50 px of the old 200x200 SVG drawings. Ground is y = 0, dinos face +x.
 */
(function () {
  const T = window.THREE;
  let can = null, shared = null, still = null;

  function ok() {
    if (can !== null) return can;
    try {
      const c = document.createElement("canvas");
      can = !!(T && window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) { can = false; }
    return can;
  }

  function makeRenderer(opts) {
    const r = new T.WebGLRenderer(Object.assign({ antialias: true, alpha: true }, opts));
    r.setClearColor(0x000000, 0);
    r.shadowMap.enabled = true;
    r.shadowMap.type = T.PCFSoftShadowMap;
    return r;
  }

  /* ---------- colors and materials ---------- */

  const color = hex => new T.Color(hex);
  const cache = {};
  function mat(hex, o = {}) {
    const key = hex + JSON.stringify(o);
    if (!cache[key]) cache[key] = new T.MeshStandardMaterial(Object.assign({ color: color(hex), roughness: .78, metalness: 0 }, o));
    return cache[key];
  }
  const skinMat = new (T ? T.MeshStandardMaterial : Object)(T ? { vertexColors: true, roughness: .8, metalness: 0 } : {});

  /* ---------- geometry helpers ---------- */

  // A smooth tube through points [[x,y,z?],...]; radii = one radius per point (smoothly blended).
  // opts: seg (lengthwise steps), rad (steps around), sn (in-plane squash), sz (width squash), cap (end roundness)
  function tube(pts, radii, o = {}) {
    const V = p => new T.Vector3(p[0], p[1], p[2] || 0);
    const spine = new T.CatmullRomCurve3(pts.map(V));
    const rad = new T.CatmullRomCurve3(radii.map(r => new T.Vector3(r, 0, 0)));
    const seg = o.seg || 24, around = o.rad || 16, sn = o.sn || 1, sz = o.sz || 1, capK = o.cap == null ? 1 : o.cap;
    const Z = new T.Vector3(0, 0, 1);
    const rings = [];
    for (let i = 0; i <= seg; i++) {
      const t = i / seg, P = spine.getPoint(t), Tn = spine.getTangent(t).normalize();
      rings.push({ P, Tn, r: Math.max(rad.getPoint(t).x, .002) });
    }
    const capRings = (ring, dir) => [1, 2, 3].map(k => {
      const th = k / 4 * Math.PI / 2;
      return { P: ring.P.clone().addScaledVector(ring.Tn, dir * ring.r * Math.sin(th) * capK), Tn: ring.Tn, r: ring.r * Math.cos(th) };
    });
    const first = rings[0], last = rings[rings.length - 1];
    const all = capRings(first, -1).reverse().concat(rings, capRings(last, 1));

    const pos = [], idx = [];
    for (const g of all) {
      let N = new T.Vector3().crossVectors(Z, g.Tn);
      if (N.lengthSq() < 1e-6) N.set(1, 0, 0);
      N.normalize();
      const B = new T.Vector3().crossVectors(g.Tn, N).normalize();
      for (let j = 0; j < around; j++) {
        const a = j / around * Math.PI * 2;
        const p = g.P.clone().addScaledVector(N, g.r * sn * Math.cos(a)).addScaledVector(B, g.r * sz * Math.sin(a));
        pos.push(p.x, p.y, p.z);
      }
    }
    const n = all.length;
    for (let i = 0; i < n - 1; i++) for (let j = 0; j < around; j++) {
      const a = i * around + j, b = i * around + (j + 1) % around, c = a + around, d = b + around;
      idx.push(a, b, c, b, d, c);
    }
    const s = pos.length / 3, sp = first.P.clone().addScaledVector(first.Tn, -first.r * capK);
    const e = s + 1, ep = last.P.clone().addScaledVector(last.Tn, last.r * capK);
    pos.push(sp.x, sp.y, sp.z, ep.x, ep.y, ep.z);
    const L = (n - 1) * around;
    for (let j = 0; j < around; j++) {
      idx.push(s, (j + 1) % around, j);
      idx.push(L + j, L + (j + 1) % around, e);
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }

  // Mesh helper: m(geometry, material, [x,y,z], [rx,ry,rz], [sx,sy,sz])
  function mesh(geo, material, p, r, s) {
    const m = new T.Mesh(geo, material);
    if (p) m.position.set(p[0], p[1], p[2] || 0);
    if (r) m.rotation.set(r[0] || 0, r[1] || 0, r[2] || 0);
    if (s) typeof s === "number" ? m.scale.setScalar(s) : m.scale.set(s[0], s[1], s[2]);
    m.castShadow = true;
    return m;
  }

  // Ball / ellipsoid
  const ballGeo = T ? new T.SphereGeometry(1, 24, 16) : null;
  const ball = (material, p, s, r) => mesh(ballGeo, material, p, r, s);

  // A tube between two points
  const limb = (material, a, b, r1, r2, o) => mesh(tube([a, b], [r1, r2 == null ? r1 : r2], Object.assign({ seg: 3, rad: 12 }, o)), material);

  // Rotate an object so its +y axis points along dir
  function pointY(obj, dir) {
    obj.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(dir[0], dir[1], dir[2] || 0).normalize());
    return obj;
  }

  // Skin color on every "skin" mesh: dark on top, pale underneath, small speckles, optional stripes
  function paintSkin(root, base, o = {}) {
    root.updateMatrixWorld(true);
    const B = color(base), dark = color(RR.art.shade(base, -.45)), pale = color(RR.art.mix(base, "#E4D7AC", .62));
    const stripe = color(RR.art.shade(base, -.3));
    const nm = new T.Matrix3(), n = new T.Vector3(), w = new T.Vector3(), c = new T.Color();
    root.traverse(obj => {
      if (!obj.isMesh || !obj.userData.skin) return;
      const g = obj.geometry, N = g.attributes.normal, P = g.attributes.position, cols = [];
      nm.getNormalMatrix(obj.matrixWorld);
      for (let i = 0; i < N.count; i++) {
        n.fromBufferAttribute(N, i).applyMatrix3(nm).normalize();
        w.fromBufferAttribute(P, i).applyMatrix4(obj.matrixWorld);
        const up = n.y;
        if (up > 0) c.copy(B).lerp(dark, Math.pow(up, 1.3) * .75); else c.copy(B).lerp(pale, Math.min(1, -up * 1.2));
        if (o.stripes && up > .35 && Math.sin(w.x * o.stripes) > .55) c.lerp(stripe, .55);
        const h = Math.sin(w.x * 91.7 + w.y * 47.3 + w.z * 63.1) * 43758.5;
        c.multiplyScalar(.95 + (h - Math.floor(h)) * .1);
        cols.push(c.r, c.g, c.b);
      }
      g.setAttribute("color", new T.Float32BufferAttribute(cols, 3));
    });
  }

  /* ---------- lights ---------- */

  function addLights(scene, o = {}) {
    scene.add(new T.HemisphereLight(0xdff4ff, 0x6b5a3a, o.hemi || 2.1));
    const sun = new T.DirectionalLight(0xfff1d6, o.sun || 2.6);
    sun.position.set(4, 9, 6);
    if (o.shadow !== false) {
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      const s = o.shadowSize || 6;
      Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: .5, far: 40 });
      sun.shadow.bias = -.0015;
      sun.shadow.normalBias = .02;
    }
    scene.add(sun, sun.target);
    return sun;
  }

  // Free GPU memory for everything in a scene (shared cached materials are kept)
  function disposeTree(root) {
    const shared = new Set(Object.values(cache).concat(skinMat));
    root.traverse(o => {
      if (o.geometry && o.geometry !== ballGeo && !o.geometry.userData.keep) o.geometry.dispose();
      const ms = [].concat(o.material || []);
      ms.forEach(m => { if (!shared.has(m)) { if (m.map) m.map.dispose(); m.dispose(); } });
    });
  }

  // Fit a camera so a box of the given size is fully in view
  function frame(camera, box, o = {}) {
    const size = box.getSize(new T.Vector3()), center = box.getCenter(new T.Vector3());
    const dir = new T.Vector3(...(o.dir || [.55, .28, 1])).normalize();
    const fitH = size.y / 2 / Math.tan(camera.fov * Math.PI / 360);
    const fitW = Math.max(size.x, size.z) / 2 / Math.tan(camera.fov * Math.PI / 360) / camera.aspect;
    const d = Math.max(fitH, fitW) * (o.pad || 1.15) + Math.max(size.x, size.z) * .35;
    camera.position.copy(center).addScaledVector(dir, d);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
  }

  /* ---------- live stage ---------- */

  // One live 3D view at a time (phones only allow a few WebGL canvases).
  // opts: height(widthPx) → css height; fov; drag (spin `spin` object by dragging); onFrame(dt, t); reduced (no autoplay)
  function stage(container, o = {}) {
    if (!shared) shared = makeRenderer();
    const renderer = shared, canvas = renderer.domElement;
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(o.fov || 35, 1, .1, 400);
    const st = { scene, camera, renderer, canvas, t: 0, spin: null, yaw: 0, vel: 0, running: false, dragging: false };
    const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    st.reduced = reduced;
    canvas.className = "d3-canvas " + (o.className || "");
    canvas.style.touchAction = o.drag ? "pan-y" : "none";
    let raf = 0, last = 0, host = null;

    function resize() {
      if (!host) return;
      const w = host.clientWidth || 300, h = o.height ? o.height(w) : host.clientHeight || 200;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      canvas.style.height = h + "px";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (o.onResize) o.onResize(w, h);
      if (!st.running) st.render();
    }

    // drag to spin
    let px = 0, lastMoveX = 0;
    const down = e => { if (!st.spin) return; st.dragging = true; px = lastMoveX = e.clientX; st.vel = 0; };
    const move = e => {
      if (!st.dragging) return;
      const dx = e.clientX - px; px = e.clientX;
      st.yaw += dx * .012; st.vel = dx * .012 * 60;
      if (Math.abs(e.clientX - lastMoveX) > 6 && o.onDrag) o.onDrag();
    };
    const up = () => { st.dragging = false; };

    st.mount = function (el) {
      host = el;
      el.appendChild(canvas);
      resize();
    };
    st.render = () => renderer.render(scene, camera);
    function loop(now) {
      if (!st.running) return;
      const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
      st.t += dt;
      if (st.spin) {
        if (!st.dragging) {
          st.vel *= Math.pow(.04, dt);
          st.yaw += st.vel * dt;
          if (o.autoSpin && !reduced && Math.abs(st.vel) < .3) st.yaw += o.autoSpin * dt;
        }
        st.spin.rotation.y = st.yaw;
      }
      if (o.onFrame) o.onFrame(dt, st.t);
      st.render();
      raf = requestAnimationFrame(loop);
    }
    st.start = () => { if (st.running) return; st.running = true; last = performance.now(); raf = requestAnimationFrame(loop); };
    st.stop = () => { st.running = false; cancelAnimationFrame(raf); };
    st.resize = resize;
    st.dispose = () => {
      st.stop();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      disposeTree(scene);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      renderer.setAnimationLoop(null);
      host = null;
    };
    window.addEventListener("resize", resize);
    if (o.drag) {
      canvas.addEventListener("pointerdown", down);
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    }
    st.sun = addLights(scene, o.lights);
    if (container) st.mount(container);
    return st;
  }

  /* ---------- still pictures ---------- */

  const shots = {};
  // build(scene) adds a model and returns the Box3 to frame. opts: size, dir, pad
  function snapshot(key, build, o = {}) {
    if (shots[key]) return shots[key];
    if (!still) { still = makeRenderer({ preserveDrawingBuffer: true }); still.shadowMap.enabled = false; }
    const size = o.size || 160;
    still.setPixelRatio(1);
    still.setSize(size, size);
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(o.fov || 30, 1, .05, 200);
    addLights(scene, { shadow: false });
    const box = build(scene);
    frame(camera, box, o);
    still.render(scene, camera);
    const url = still.domElement.toDataURL("image/png");
    disposeTree(scene);
    return (shots[key] = url);
  }

  RR.d3 = {
    ok, stage, snapshot, tube, mesh, ball, limb, pointY, paintSkin, mat, frame, addLights, disposeTree,
    skin: () => skinMat,
    get T() { return T; }
  };
})();
