import * as THREE from "three";

export type SceneTarget = {
  state: number; // 0 estate · 1 entangled · 2 layers · 3 loop
  x: number;
  tilt: number;
  scale: number;
  opacity: number;
  scan: number;
};

/* Brand palette */
const PAPER_300 = "#CFC8BA";
const GRAPHITE_300 = "#9AA8BD";
const SIGNAL = "#38BDF8";
const TRACE = "#00E8FF";

/* Deterministic RNG so the estate looks the same on every visit */
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Shared GLSL: blend a particle through the four states with a per-particle lag */
const MORPH = /* glsl */ `
  uniform float uState;
  uniform float uTime;
  float ease(float t) { return t * t * (3.0 - 2.0 * t); }
  vec3 morph(vec3 a, vec3 b, vec3 c, vec3 d, float seed) {
    float lag = seed * 0.35;
    float t0 = ease(clamp((uState - 0.0 - lag) / 0.65, 0.0, 1.0));
    float t1 = ease(clamp((uState - 1.0 - lag) / 0.65, 0.0, 1.0));
    float t2 = ease(clamp((uState - 2.0 - lag) / 0.65, 0.0, 1.0));
    vec3 p = mix(a, b, t0);
    p = mix(p, c, t1);
    p = mix(p, d, t2);
    float chaos = 1.0 - clamp(abs(uState - 1.0), 0.0, 1.0);
    float amp = 0.022 + chaos * 0.2;
    p += amp * vec3(
      sin(uTime * 0.6 + seed * 61.0),
      cos(uTime * 0.5 + seed * 37.0),
      sin(uTime * 0.45 + seed * 23.0)
    );
    return p;
  }
`;

const POINTS_VS = /* glsl */ `
  ${MORPH}
  attribute vec3 p0; attribute vec3 p1; attribute vec3 p2; attribute vec3 p3;
  attribute float aSeed; attribute float aSize; attribute float aSignal;
  uniform float uPR; uniform float uSize; uniform float uOpacity;
  uniform float uScanX; uniform float uScan;
  uniform vec3 uBase; uniform vec3 uSignal;
  varying vec3 vColor; varying float vAlpha;
  void main() {
    vec3 pos = morph(p0, p1, p2, p3, aSeed);
    vec4 world = modelMatrix * vec4(pos, 1.0);
    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    float hit = (1.0 - smoothstep(0.0, 0.55, abs(world.x - uScanX))) * uScan;
    float twinkle = 0.78 + 0.22 * sin(uTime * 1.6 + aSeed * 90.0);
    gl_PointSize = uSize * aSize * uPR * (7.0 / depth) * (1.0 + hit * 0.9);
    vColor = mix(uBase, uSignal, clamp(aSignal + hit, 0.0, 1.0));
    float fog = smoothstep(15.0, 6.0, depth);
    vAlpha = uOpacity * fog * twinkle * (0.66 + 0.34 * aSignal + hit * 0.9);
  }
`;

const POINTS_FS = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(1.0 - d * 2.0, 1.7);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

const LINES_VS = /* glsl */ `
  ${MORPH}
  attribute vec3 p0; attribute vec3 p1; attribute vec3 p2; attribute vec3 p3;
  attribute vec3 q0; attribute vec3 q1; attribute vec3 q2; attribute vec3 q3;
  attribute float aSeed; attribute float aSeedB; attribute float aLong;
  uniform float uOpacity; uniform float uEdge; uniform float uLongAlpha;
  varying float vAlpha; varying float vLong;
  void main() {
    vec3 a = morph(p0, p1, p2, p3, aSeed);
    vec3 b = morph(q0, q1, q2, q3, aSeedB);
    float len = distance(a, b);
    float near = 1.0 - smoothstep(0.32, 0.85, len);
    vec4 mv = modelViewMatrix * vec4(a, 1.0);
    vAlpha = uOpacity * mix(uEdge * near, uLongAlpha, aLong) * smoothstep(15.0, 6.0, -mv.z);
    vLong = aLong;
    gl_Position = projectionMatrix * mv;
  }
`;

const LINES_FS = /* glsl */ `
  uniform vec3 uLine; uniform vec3 uSignal;
  varying float vAlpha; varying float vLong;
  void main() { gl_FragColor = vec4(mix(uLine, uSignal, vLong * 0.7), vAlpha); }
`;

const PULSE_VS = /* glsl */ `
  ${MORPH}
  attribute vec3 p0; attribute vec3 p1; attribute vec3 p2; attribute vec3 p3;
  attribute vec3 q0; attribute vec3 q1; attribute vec3 q2; attribute vec3 q3;
  attribute float aSeed; attribute float aSeedB; attribute float aLong;
  attribute float aOffset; attribute float aSpeed;
  uniform float uPR; uniform float uSize; uniform float uOpacity; uniform float uPulse;
  varying float vAlpha;
  void main() {
    vec3 a = morph(p0, p1, p2, p3, aSeed);
    vec3 b = morph(q0, q1, q2, q3, aSeedB);
    float ph = fract(uTime * aSpeed + aOffset);
    vec3 pos = mix(a, b, ph);
    float near = mix(1.0 - smoothstep(0.32, 0.85, distance(a, b)), 1.0, aLong);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = uSize * uPR * (7.0 / depth);
    vAlpha = uOpacity * uPulse * near * sin(ph * 3.14159) * smoothstep(15.0, 6.0, depth);
  }
`;

const PULSE_FS = /* glsl */ `
  uniform vec3 uTrace;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(1.0 - d * 2.0, 2.2);
    gl_FragColor = vec4(uTrace, a * vAlpha);
  }
`;

type Vec3Arr = [number, number, number];

export class EstateScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  private group = new THREE.Group();
  private timer = new THREE.Timer();
  private uniforms: Record<string, THREE.IUniform>;
  private current: SceneTarget;
  private pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  private reduced: boolean;
  private raf = 0;
  private time = 0;
  private spin = 0;
  private halfW = 5;
  private baseScale = 1;
  private disposables: Array<{ dispose(): void }> = [];

  constructor(
    canvas: HTMLCanvasElement,
    private getTarget: () => SceneTarget,
  ) {
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.set(0, 0, 9);
    this.scene.add(this.group);
    this.current = { ...getTarget(), opacity: 0 };

    this.uniforms = {
      uState: { value: this.current.state },
      uTime: { value: 0 },
      uPR: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uSize: { value: 6.2 },
      uOpacity: { value: 0 },
      uScanX: { value: -20 },
      uScan: { value: 0 },
      uBase: { value: new THREE.Color(PAPER_300) },
      uSignal: { value: new THREE.Color(SIGNAL) },
      uTrace: { value: new THREE.Color(TRACE) },
      uLine: { value: new THREE.Color(GRAPHITE_300) },
      uEdge: { value: 0.42 },
      uLongAlpha: { value: 0.13 },
      uPulse: { value: this.reduced ? 0 : 1 },
    };

    this.build(window.innerWidth < 900 ? 950 : 1700);
    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    this.loop();
  }

  /* ---------------- geometry ---------------- */
  private build(N: number) {
    const rng = mulberry32(20261125);
    const C = 14; // application clusters in the estate
    const R_ESTATE = 2.0;

    const centers: THREE.Vector3[] = [];
    for (let c = 0; c < C; c++) {
      const y = 1 - ((c + 0.5) / C) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = c * 2.399963;
      centers.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(R_ESTATE));
    }
    const csize = centers.map(() => 0.32 + rng() * 0.28);
    const layerClusters: number[][] = [[], [], [], []];
    for (let c = 0; c < C; c++) layerClusters[c % 4].push(c);

    const P = [0, 1, 2, 3].map(() => new Float32Array(N * 3));
    const seed = new Float32Array(N);
    const size = new Float32Array(N);
    const signal = new Float32Array(N);
    const members: number[][] = Array.from({ length: C }, () => []);
    const freeStart = Math.floor(N * 0.86);

    const dir = (): Vec3Arr => {
      const u = rng() * 2 - 1;
      const t = rng() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      return [s * Math.cos(t), u, s * Math.sin(t)];
    };
    const torus = (phi: number, psi: number, tr: number, R = 2.5): Vec3Arr => [
      (R + tr * Math.cos(psi)) * Math.cos(phi),
      tr * Math.sin(psi),
      (R + tr * Math.cos(psi)) * Math.sin(phi),
    ];
    const set = (arr: Float32Array, i: number, v: Vec3Arr) => {
      arr[i * 3] = v[0];
      arr[i * 3 + 1] = v[1];
      arr[i * 3 + 2] = v[2];
    };

    for (let i = 0; i < N; i++) {
      seed[i] = rng();
      // State 1 — entangled: everything scattered, nothing where you expect it
      set(P[1], i, [(rng() * 2 - 1) * 7.8, (rng() * 2 - 1) * 4.4, (rng() * 2 - 1) * 4.6]);

      if (i < freeStart) {
        const c = i % C;
        members[c].push(i);
        const cs = csize[c];
        const d = dir();
        const rad = cs * Math.pow(rng(), 0.75);
        const l: Vec3Arr = [d[0] * rad, d[1] * rad, d[2] * rad];
        const ctr = centers[c];

        // State 0 — the estate: clusters of applications on a sphere
        set(P[0], i, [ctr.x + l[0], ctr.y + l[1], ctr.z + l[2]]);

        // State 2 — organised: four layers, each cluster in its own sector, snapped to a grid
        const L = c % 4;
        const list = layerClusters[L];
        const k = list.indexOf(c);
        const th0 = (k / list.length) * Math.PI * 2 + 0.1;
        const th1 = ((k + 1) / list.length) * Math.PI * 2 - 0.1;
        const u = Math.min(1, Math.max(0, (l[0] / cs + 1) / 2));
        const w = Math.min(1, Math.max(0, (l[2] / cs + 1) / 2));
        const rr = 0.6 + (Math.round(u * 6) / 6) * 2.3;
        const ang = th0 + (Math.round(w * 12) / 12) * (th1 - th0);
        set(P[2], i, [
          Math.cos(ang) * rr + (rng() - 0.5) * 0.03,
          (L - 1.5) * 0.95 + l[1] * 0.04,
          Math.sin(ang) * rr + (rng() - 0.5) * 0.03,
        ]);

        // State 3 — continuous loop: clusters become beads on a ring
        const phi = ((c + 0.5) / C + (l[0] / cs) * 0.03) * Math.PI * 2;
        const psi = Math.atan2(l[1], l[2]);
        set(P[3], i, torus(phi, psi, 0.1 + (rad / cs) * 0.42));

        size[i] = 0.55 + rng() * 0.75;
        signal[i] = rng() < 0.05 ? 1 : 0;
      } else {
        // Ambient points around the estate
        const d = dir();
        const rad = 2.4 + rng() * 0.5;
        set(P[0], i, [d[0] * rad, d[1] * rad, d[2] * rad]);
        const L = Math.floor(rng() * 4);
        const ang = rng() * Math.PI * 2;
        set(P[2], i, [Math.cos(ang) * 3.05, (L - 1.5) * 0.95, Math.sin(ang) * 3.05]);
        set(P[3], i, torus(rng() * Math.PI * 2, rng() * Math.PI * 2, 0.45 + rng() * 0.75));
        size[i] = 0.4 + rng() * 0.45;
        signal[i] = rng() < 0.03 ? 1 : 0;
      }
    }

    // One hub per cluster: larger and lit
    const hubs = members.map((m) => m[0]);
    hubs.forEach((h) => {
      size[h] = 2.6;
      signal[h] = 1;
    });

    /* Edges: near neighbours inside a cluster, plus a few long dependencies between hubs */
    const edges: Array<[number, number, number]> = [];
    const seen = new Set<number>();
    const add = (a: number, b: number, long: number) => {
      const key = a < b ? a * N + b : b * N + a;
      if (a === b || seen.has(key)) return;
      seen.add(key);
      edges.push([a, b, long]);
    };
    const p0 = P[0];
    const dist2 = (a: number, b: number) => {
      const dx = p0[a * 3] - p0[b * 3];
      const dy = p0[a * 3 + 1] - p0[b * 3 + 1];
      const dz = p0[a * 3 + 2] - p0[b * 3 + 2];
      return dx * dx + dy * dy + dz * dz;
    };
    for (const m of members) {
      for (const a of m) {
        let b1 = -1, b2 = -1, d1 = Infinity, d2 = Infinity;
        for (const b of m) {
          if (b === a) continue;
          const d = dist2(a, b);
          if (d < d1) { d2 = d1; b2 = b1; d1 = d; b1 = b; }
          else if (d < d2) { d2 = d; b2 = b; }
        }
        if (b1 >= 0) add(a, b1, 0);
        if (b2 >= 0) add(a, b2, 0);
      }
    }
    hubs.forEach((h, c) => {
      for (let k = 0; k < 2; k++) {
        const o = hubs[(c + 1 + Math.floor(rng() * (C - 1))) % C];
        add(h, o, 1);
      }
    });

    const common = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: this.uniforms };

    /* Points */
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(P[0], 3));
    P.forEach((arr, s) => pg.setAttribute(`p${s}`, new THREE.BufferAttribute(arr, 3)));
    pg.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    pg.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    pg.setAttribute("aSignal", new THREE.BufferAttribute(signal, 1));
    const pm = new THREE.ShaderMaterial({ ...common, vertexShader: POINTS_VS, fragmentShader: POINTS_FS });
    const points = new THREE.Points(pg, pm);
    points.frustumCulled = false;

    /* Endpoint-pair attributes shared by lines and pulses */
    const pairAttrs = (pairs: Array<[number, number]>) => {
      const M = pairs.length;
      const A = [0, 1, 2, 3].map(() => new Float32Array(M * 3));
      const B = [0, 1, 2, 3].map(() => new Float32Array(M * 3));
      const sa = new Float32Array(M);
      const sb = new Float32Array(M);
      pairs.forEach(([a, b], v) => {
        for (let s = 0; s < 4; s++) {
          A[s].set(P[s].subarray(a * 3, a * 3 + 3), v * 3);
          B[s].set(P[s].subarray(b * 3, b * 3 + 3), v * 3);
        }
        sa[v] = seed[a];
        sb[v] = seed[b];
      });
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(A[0], 3));
      for (let s = 0; s < 4; s++) {
        g.setAttribute(`p${s}`, new THREE.BufferAttribute(A[s], 3));
        g.setAttribute(`q${s}`, new THREE.BufferAttribute(B[s], 3));
      }
      g.setAttribute("aSeed", new THREE.BufferAttribute(sa, 1));
      g.setAttribute("aSeedB", new THREE.BufferAttribute(sb, 1));
      return g;
    };

    /* Lines: two vertices per edge, each knowing the other end */
    const linePairs: Array<[number, number]> = [];
    const lineLong: number[] = [];
    edges.forEach(([a, b, long]) => {
      linePairs.push([a, b], [b, a]);
      lineLong.push(long, long);
    });
    const lg = pairAttrs(linePairs);
    lg.setAttribute("aLong", new THREE.BufferAttribute(new Float32Array(lineLong), 1));
    const lm = new THREE.ShaderMaterial({ ...common, vertexShader: LINES_VS, fragmentShader: LINES_FS });
    const lines = new THREE.LineSegments(lg, lm);
    lines.frustumCulled = false;

    /* Pulses: signal travelling along edges — data arriving, decisions leaving */
    const longEdges = edges.filter((e) => e[2] === 1);
    const shortEdges = edges.filter((e) => e[2] === 0);
    const M = window.innerWidth < 900 ? 90 : 180;
    const pulsePairs: Array<[number, number]> = [];
    const pLong = new Float32Array(M);
    const pOff = new Float32Array(M);
    const pSpeed = new Float32Array(M);
    for (let k = 0; k < M; k++) {
      const useLong = rng() < 0.4 && longEdges.length > 0;
      const pool = useLong ? longEdges : shortEdges;
      const [a, b] = pool[Math.floor(rng() * pool.length)];
      pulsePairs.push(rng() < 0.5 ? [a, b] : [b, a]);
      pLong[k] = useLong ? 1 : 0;
      pOff[k] = rng();
      pSpeed[k] = useLong ? 0.07 + rng() * 0.08 : 0.25 + rng() * 0.35;
    }
    const qg = pairAttrs(pulsePairs);
    qg.setAttribute("aLong", new THREE.BufferAttribute(pLong, 1));
    qg.setAttribute("aOffset", new THREE.BufferAttribute(pOff, 1));
    qg.setAttribute("aSpeed", new THREE.BufferAttribute(pSpeed, 1));
    const qm = new THREE.ShaderMaterial({
      ...common,
      uniforms: { ...this.uniforms, uSize: { value: 11 } },
      vertexShader: PULSE_VS,
      fragmentShader: PULSE_FS,
    });
    const pulses = new THREE.Points(qg, qm);
    pulses.frustumCulled = false;

    this.group.add(lines, points, pulses);
    this.disposables.push(pg, pm, lg, lm, qg, qm);
  }

  /* ---------------- runtime ---------------- */
  private onPointer = (e: PointerEvent) => {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  private resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.halfW = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.position.z * this.camera.aspect;
    this.baseScale = Math.min(1, Math.max(0.5, this.camera.aspect / 1.45));
  };

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    this.timer.update();
    const dt = Math.min(this.timer.getDelta(), 0.05);
    const speed = this.reduced ? 0.15 : 1;
    this.time += dt * speed;

    const t = this.getTarget();
    const c = this.current;
    const kState = 1 - Math.exp(-dt * 1.7);
    const k = 1 - Math.exp(-dt * 2.6);
    c.state += (t.state - c.state) * kState;
    c.x += (t.x - c.x) * k;
    c.tilt += (t.tilt - c.tilt) * k;
    c.scale += (t.scale - c.scale) * k;
    c.opacity += (t.opacity - c.opacity) * (1 - Math.exp(-dt * 1.8));
    c.scan += (t.scan - c.scan) * k;

    const pk = 1 - Math.exp(-dt * 2.2);
    this.pointer.sx += (this.pointer.x - this.pointer.sx) * pk;
    this.pointer.sy += (this.pointer.y - this.pointer.sy) * pk;

    this.spin += dt * 0.065 * speed;
    const s = c.scale * this.baseScale;
    this.group.rotation.set(c.tilt + this.pointer.sy * 0.12, this.spin + this.pointer.sx * 0.32, 0);
    this.group.position.x = c.x * this.halfW;
    this.group.scale.setScalar(s);

    const period = 7.5;
    const ph = (this.time % period) / period;
    const u = this.uniforms;
    u.uTime.value = this.time;
    u.uState.value = c.state;
    u.uOpacity.value = c.opacity;
    u.uScan.value = c.scan;
    u.uScanX.value = this.group.position.x + (ph * 2.4 - 1.2) * 3.6 * s;

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onPointer);
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
  }
}
