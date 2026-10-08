/*
 * Dino Hangman's 3D scene: your dino on Dino Island, a meteor that comes closer with every miss,
 * a KABOOM, and a fossil left behind. js/games/hangman.js runs the word game; devices without 3D
 * keep the flat SVG scene there.
 *
 *   RR.hangman3d.create(box, look) → { reset(), meteor(t 0..1), explode(), dispose() }
 */
(function () {
  RR.hangman3d = {
    create(box, look) {
      const T = THREE, D = RR.d3;
      const st = D.stage(null, { fov: 34, height: w => Math.round(Math.max(200, Math.min(360, w * .5))), lights: { shadowSize: 8 },
        onFrame: (dt, t) => frame(dt, t) });
      const isle = D.jungle(st.scene, { r: 7 });
      const dino = D.dino(look);
      const bb = new T.Box3().setFromObject(dino), c = bb.getCenter(new T.Vector3());
      dino.children[0].position.x = -c.x;
      dino.rotation.y = .35;
      st.scene.add(dino);

      const fossil = D.dino(look, { fossil: true });
      fossil.children[0].position.x = -c.x;
      fossil.rotation.set(Math.PI / 2 * .92, .2, 0);
      fossil.updateMatrixWorld(true);
      fossil.position.y = -new T.Box3().setFromObject(fossil).min.y - .45;
      const mound = D.mesh(new T.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), D.mat("#A9824F"), [0, -.02, 0], 0, [2.6, .25, 1.4]);
      const fossilBox = new T.Group(); fossilBox.add(mound, fossil); fossilBox.visible = false;
      st.scene.add(fossilBox);

      const meteor = D.scenery.meteor();
      meteor.scale.setScalar(1.5);
      st.scene.add(meteor);
      const FAR = new T.Vector3(5.5, 6.2, -2), NEAR = new T.Vector3(1.9, 3.0, .6), HIT = new T.Vector3(0, 1.4, 0);
      const target = FAR.clone();
      meteor.userData.trail.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), FAR.clone().sub(HIT).normalize());

      // explosion: a fireball and flying rocks
      const ball = D.mesh(new T.SphereGeometry(1, 28, 18), D.mat("#FF7A1A", { transparent: true, emissive: new T.Color("#FF7A1A"), emissiveIntensity: 1.4 }));
      const core = D.mesh(new T.SphereGeometry(.7, 24, 16), D.mat("#FFE27A", { transparent: true, emissive: new T.Color("#FFD23F"), emissiveIntensity: 1.6 }));
      ball.castShadow = core.castShadow = false;
      const blast = new T.Group(); blast.add(ball, core); blast.position.copy(HIT); blast.visible = false;
      const bits = [];
      for (let i = 0; i < 26; i++) {
        const b = D.mesh(new T.DodecahedronGeometry(.12 + Math.random() * .14), D.mat(i % 3 ? "#6B4A2E" : "#FF7A1A", i % 3 ? {} : { emissive: new T.Color("#FF5A00"), emissiveIntensity: 1 }));
        b.userData.v = new T.Vector3(Math.random() - .5, Math.random() * .9 + .4, Math.random() - .5).normalize().multiplyScalar(5 + Math.random() * 5);
        blast.add(b); bits.push(b);
      }
      const flash = new T.PointLight(0xffa040, 0, 30);
      flash.position.copy(HIT).add(new T.Vector3(0, 1, 1));
      st.scene.add(blast, flash);

      st.camera.position.set(1.2, 4.2, 13.5);
      st.camera.lookAt(.8, 2.4, 0);

      let boomT = -1;
      function frame(dt, t) {
        isle.anim(t);
        dino.userData.anim(t);
        meteor.userData.anim(t);
        meteor.position.lerp(target, Math.min(1, dt * (boomT >= 0 ? 7 : 3)));
        if (boomT >= 0) {
          boomT += dt;
          if (boomT > .55 && !blast.visible && boomT < .6) {
            blast.visible = true; meteor.visible = false; dino.visible = false;
            bits.forEach(b => b.position.set(0, 0, 0));
          }
          if (blast.visible) {
            const k = boomT - .55;
            const s = Math.min(1, k / .25) * 2.6;
            ball.scale.setScalar(s); core.scale.setScalar(s * .8);
            ball.material.opacity = core.material.opacity = Math.max(0, 1 - Math.max(0, k - .35) / .6);
            bits.forEach(b => { b.position.addScaledVector(b.userData.v, dt); b.userData.v.y -= 14 * dt; if (b.position.y + HIT.y < .1) { b.position.y = .1 - HIT.y; b.userData.v.multiplyScalar(.3); } });
            flash.intensity = Math.max(0, 60 * (1 - k / .7));
            if (k > .75 && !fossilBox.visible) fossilBox.visible = true;
            if (k > 1.6) blast.visible = false;
          }
        }
      }

      st.mount(box);
      st.start();

      return {
        reset() {
          boomT = -1;
          dino.visible = meteor.visible = true;
          blast.visible = fossilBox.visible = false;
          flash.intensity = 0;
          target.copy(FAR); meteor.position.copy(FAR);
        },
        meteor(t) { target.copy(FAR).lerp(NEAR, t); },
        explode() { target.copy(HIT); boomT = 0; },
        dispose() { st.dispose(); }
      };
    }
  };
})();
