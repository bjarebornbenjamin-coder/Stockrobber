// Stockrobber hero: the one WebGL scene on the page.
// A landscape of candlestick charts receding into the night. The camera
// drifts along the uptrend, dollies in with scroll and leans toward the
// pointer. Paused whenever the hero is off screen.
import * as THREE from 'three';

(function init() {
  const canvas = document.querySelector('.hero__gl');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 860px)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { return; } // the CSS poster stays
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const CANVAS = 0x0b110c, GREEN = 0x93c14d, RED = 0xc2414b;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(CANVAS, 9, small ? 34 : 44);
  const camera = new THREE.PerspectiveCamera(small ? 48 : 36, 1, 0.1, 140);

  scene.add(new THREE.HemisphereLight(0xdff5c8, 0x0b110c, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-6, 10, 8); scene.add(key);
  const rim = new THREE.PointLight(GREEN, 40, 30, 1.6); rim.position.set(4, 6, -4); scene.add(rim);

  // ---------------------------------------------------------------- data
  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const ROWS = small ? 2 : 3, N = small ? 56 : 90, STEP = 0.6;
  const rows = [];
  for (let r = 0; r < ROWS; r++) {
    let p = 1.2 + r * 0.8;
    const row = [];
    for (let i = 0; i < N; i++) {
      const trend = 0.075 + Math.sin(i / 9 + r) * 0.05;
      const o = p;
      const c = o + trend + (rnd() - 0.5) * 0.55;
      const h = Math.max(o, c) + rnd() * 0.28;
      const l = Math.min(o, c) - rnd() * 0.28;
      row.push({ o, c, h, l });
      p = c;
    }
    rows.push(row);
  }

  // ------------------------------------------------------------ candles
  const total = ROWS * N;
  const bodyGeo = new THREE.BoxGeometry(0.34, 1, 0.34);
  const wickGeo = new THREE.BoxGeometry(0.045, 1, 0.045);
  const bodyMat = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.15 });
  const wickMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const bodies = new THREE.InstancedMesh(bodyGeo, bodyMat, total);
  const wicks = new THREE.InstancedMesh(wickGeo, wickMat, total);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), pos = new THREE.Vector3(), scl = new THREE.Vector3();
  const cGreen = new THREE.Color(GREEN), cRed = new THREE.Color(RED), tmp = new THREE.Color();
  const X0 = -N * STEP * 0.5;
  let idx = 0;
  rows.forEach((row, r) => {
    const z = -r * 6.5;
    const dim = r === 0 ? 1 : r === 1 ? 0.62 : 0.42;
    row.forEach((d, i) => {
      const x = X0 + i * STEP + r * 1.7;
      const up = d.c >= d.o;
      pos.set(x, (d.o + d.c) / 2, z); scl.set(1, Math.max(Math.abs(d.c - d.o), 0.06), 1);
      m.compose(pos, q, scl); bodies.setMatrixAt(idx, m);
      pos.set(x, (d.h + d.l) / 2, z); scl.set(1, d.h - d.l, 1);
      m.compose(pos, q, scl); wicks.setMatrixAt(idx, m);
      tmp.copy(up ? cGreen : cRed).multiplyScalar(dim);
      bodies.setColorAt(idx, tmp); wicks.setColorAt(idx, tmp);
      idx++;
    });
  });
  bodies.instanceMatrix.needsUpdate = wicks.instanceMatrix.needsUpdate = true;
  scene.add(bodies, wicks);

  // ----------------------------------------------------- moving average
  const front = rows[0];
  const pts = front.map((d, i) => {
    let s = 0, n = 0;
    for (let k = Math.max(0, i - 5); k <= i; k++) { s += front[k].c; n++; }
    return new THREE.Vector3(X0 + i * STEP, s / n + 0.35, 0.3);
  });
  const curve = new THREE.CatmullRomCurve3(pts);
  const segs = N * 4;
  const lineGeo = new THREE.TubeGeometry(curve, segs, 0.022, 6, false);
  const glowGeo = new THREE.TubeGeometry(curve, segs, 0.1, 8, false);
  const line = new THREE.Mesh(lineGeo, new THREE.MeshBasicMaterial({ color: 0xe9f7d2, fog: true }));
  const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(line, glow);
  const lineCount = lineGeo.index.count, glowCount = glowGeo.index.count;

  // ---------------------------------------------------------- the floor
  const floorY = Math.min(...rows.flat().map(d => d.l)) - 0.6;
  const grid = new THREE.GridHelper(160, 120, 0x2c3f27, 0x17221a);
  grid.position.y = floorY; grid.material.transparent = true; grid.material.opacity = 0.55;
  scene.add(grid);

  // ------------------------------------------------------------- dust
  const DUST = small ? 260 : 600;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (rnd() - 0.5) * 60;
    dustPos[i * 3 + 1] = floorY + rnd() * 16;
    dustPos[i * 3 + 2] = -rnd() * 26 + 6;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xcfe9a8, size: 0.05, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(dust);

  // ----------------------------------------------------------- camera
  // The visible chart sits in the right two thirds of the frame, leaving
  // the left for the portrait.
  const midY = (front[0].c + front[N - 1].c) / 2;
  const look = new THREE.Vector3();
  let ptrX = 0, ptrY = 0, curX = 0, curY = 0;
  if (fine && !reduce) {
    addEventListener('pointermove', (e) => {
      ptrX = e.clientX / innerWidth - 0.5;
      ptrY = e.clientY / innerHeight - 0.5;
    }, { passive: true });
  }

  function heroProgress() {
    const inst = window.ScrollCraft && ScrollCraft.instances[0];
    if (!inst) return 0;
    for (const a of inst.acts) if (a.el === hero) return a.p;
    return 0;
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  const t0 = performance.now();
  function render(now) {
    const t = (now - t0) / 1000;
    const p = reduce ? 0 : heroProgress();
    // the trend line draws itself once, on arrival
    const draw = reduce ? 1 : Math.min(1, Math.max(0, (t - 0.3) / 2.4));
    const e = 1 - Math.pow(1 - draw, 3);
    lineGeo.setDrawRange(0, Math.floor(lineCount * e / 3) * 3);
    glowGeo.setDrawRange(0, Math.floor(glowCount * e / 3) * 3);

    curX += (ptrX - curX) * 0.05; curY += (ptrY - curY) * 0.05;
    const travel = reduce ? 0 : (t * 0.22) % (N * STEP * 0.5);
    const baseX = X0 + N * STEP * 0.32 + travel;
    const camX = baseX - (small ? 3 : 7.5) + curX * 1.2;
    const camY = midY + 2.4 + p * 1.6 - curY * 0.6;
    const camZ = 11.5 - p * 6;
    camera.position.set(camX, camY, camZ);
    look.set(baseX + 3, midY + 0.6 + travel * 0.11 + p * 0.8, -6);
    camera.lookAt(look);
    rim.position.set(baseX + 4, midY + 5, -3);
    dust.rotation.y = t * 0.01;

    renderer.render(scene, camera);
    if (!canvas.classList.contains('is-live')) canvas.classList.add('is-live');
  }

  if (reduce) { render(performance.now() + 4000); return; }

  let running = false, raf = 0;
  const loop = (now) => { render(now); raf = requestAnimationFrame(loop); };
  const start = () => { if (!running) { running = true; raf = requestAnimationFrame(loop); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  new IntersectionObserver((entries) => {
    entries.forEach((en) => (en.isIntersecting && !document.hidden ? start() : stop()));
  }, { threshold: 0 }).observe(hero.querySelector('[data-sc-stage]') || hero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (hero.getBoundingClientRect().bottom > 0) start();
  });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); canvas.classList.remove('is-live'); });
})();
