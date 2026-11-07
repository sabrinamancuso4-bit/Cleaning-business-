/**
 * Generates the local placeholder "photography" used across the demo.
 *
 * External stock-photo URLs are deliberately avoided (fragile, licensing).
 * Instead, this script renders simple one-point-perspective architectural
 * scenes as SVG files in /public/images/placeholders. Each file is named after
 * the photograph it stands in for, so swapping in real images later is a
 * matter of replacing the `src` values in src/config/images.ts.
 *
 * Run with: npm run images
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "placeholders");
mkdirSync(OUT, { recursive: true });

const W = 1600;
const H = 1067;

/* ---------- colour helpers ---------- */
const hex = (c) => {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (r) =>
  "#" + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => {
  const A = hex(a), B = hex(b);
  return toHex(A.map((v, i) => v + (B[i] - v) * t));
};
const shade = (c, amt) => (amt >= 0 ? mix(c, "#ffffff", amt) : mix(c, "#000000", -amt));

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- scene builder ---------- */
function createScene(opts) {
  const o = {
    F: 980, eye: 1.55, camX: 0, horizon: 0.46,
    left: -4.5, right: 4.5, ceil: 3.1, back: 14,
    wall: "#ECEAE4", backWall: "#E4E1DA", floor: "#CFC8BC", ceiling: "#F5F4F0",
    fog: "#EEF0F0", fogAmount: 0.35,
    ...opts,
  };
  const items = []; // { z, svg }
  const base = []; // drawn first in order
  const overlay = [];

  const P = (x, y, z) => {
    const zz = Math.max(z, 0.05);
    return [W / 2 + (o.F * (x - o.camX)) / zz, H * o.horizon - (o.F * (y - o.eye)) / zz];
  };
  const path = (pts) =>
    "M" + pts.map((p) => { const [x, y] = P(...p); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join("L") + "Z";
  const fogged = (c, z) => mix(c, o.fog, Math.min(1, (z / o.back) * o.fogAmount));
  const poly = (pts, fill, extra = "") => `<path d="${path(pts)}" fill="${fill}" ${extra}/>`;

  const scene = {
    o, P, path, poly, fogged,
    addBase: (s) => base.push(s),
    add: (z, s) => items.push({ z, s }),
    addOverlay: (s) => overlay.push(s),

    room() {
      const { left: L, right: R, ceil: C, back: B } = o;
      const z0 = 0.2;
      base.push(poly([[L, 0, B], [R, 0, B], [R, C, B], [L, C, B]], "url(#gBack)"));
      base.push(poly([[L, 0, z0], [R, 0, z0], [R, 0, B], [L, 0, B]], "url(#gFloor)"));
      base.push(poly([[L, C, z0], [R, C, z0], [R, C, B], [L, C, B]], "url(#gCeil)"));
      base.push(poly([[L, 0, z0], [L, 0, B], [L, C, B], [L, C, z0]], "url(#gWallL)"));
      base.push(poly([[R, 0, z0], [R, 0, B], [R, C, B], [R, C, z0]], "url(#gWallR)"));
      // skirting
      base.push(poly([[L, 0, z0], [L, 0, B], [L, 0.08, B], [L, 0.08, z0]], shade(o.wall, -0.12)));
      base.push(poly([[R, 0, z0], [R, 0, B], [R, 0.08, B], [R, 0.08, z0]], shade(o.wall, -0.12)));
      return scene;
    },

    floorLines({ every = 0.9, along = true, across = 1.4, color, opacity = 0.18 } = {}) {
      const c = color ?? shade(o.floor, -0.25);
      let s = `<g stroke="${c}" stroke-width="1.2" opacity="${opacity}" fill="none">`;
      if (along) for (let x = o.left; x <= o.right + 0.001; x += every) {
        const [ax, ay] = P(x, 0, 0.3), [bx, by] = P(x, 0, o.back);
        s += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/>`;
      }
      if (across) for (let z = 1; z <= o.back; z += across) {
        const [ax, ay] = P(o.left, 0, z), [bx, by] = P(o.right, 0, z);
        s += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/>`;
      }
      base.push(s + "</g>");
      return scene;
    },

    lightStrips({ xs = [-1.5, 1.5], from = 2, to = 13, len = 1.6, gap = 1.1, w = 0.12 } = {}) {
      for (const x of xs) for (let z = from; z + len <= to; z += len + gap) {
        base.push(poly([[x - w, o.ceil - 0.005, z], [x + w, o.ceil - 0.005, z], [x + w, o.ceil - 0.005, z + len], [x - w, o.ceil - 0.005, z + len]], "#FFFFFF", 'filter="url(#glow)"'));
      }
      return scene;
    },

    ceilingGrid({ every = 1.2, opacity = 0.18 } = {}) {
      let s = `<g stroke="${shade(o.ceiling, -0.2)}" stroke-width="1" opacity="${opacity}">`;
      for (let x = o.left; x <= o.right; x += every) {
        const [ax, ay] = P(x, o.ceil, 0.3), [bx, by] = P(x, o.ceil, o.back);
        s += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/>`;
      }
      for (let z = 1; z <= o.back; z += every) {
        const [ax, ay] = P(o.left, o.ceil, z), [bx, by] = P(o.right, o.ceil, z);
        s += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/>`;
      }
      base.push(s + "</g>");
      return scene;
    },

    /** Window across the back wall with an abstract skyline beyond. */
    backWindow({ x0 = o.left + 0.4, x1 = o.right - 0.4, y0 = 0.35, y1 = o.ceil - 0.25, cols = 6, seed = 1, skyline = true, frame = "#2A3238" } = {}) {
      const z = o.back - 0.01;
      base.push(poly([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], "url(#gSky)"));
      if (skyline) {
        const r = rng(seed);
        let x = x0;
        while (x < x1) {
          const bw = 0.35 + r() * 0.9;
          const bh = 0.4 + r() * 1.6;
          const xe = Math.min(x + bw, x1);
          base.push(poly([[x, y0, z], [xe, y0, z], [xe, y0 + bh, z], [x, y0 + bh, z]], mix("#B9C5CC", "#DCE3E6", r()), 'opacity="0.85"'));
          x = xe + r() * 0.12;
        }
      }
      base.push(poly([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], "url(#gGlass)"));
      const step = (x1 - x0) / cols;
      const t = 0.035;
      for (let i = 0; i <= cols; i++) {
        const x = x0 + i * step;
        base.push(poly([[x - t, y0, z], [x + t, y0, z], [x + t, y1, z], [x - t, y1, z]], frame));
      }
      base.push(poly([[x0, y1 - t, z], [x1, y1 - t, z], [x1, y1 + t, z], [x0, y1 + t, z]], frame));
      base.push(poly([[x0, y0 - t, z], [x1, y0 - t, z], [x1, y0 + t, z], [x0, y0 + t, z]], frame));
      base.push(poly([[x0, y1 - 0.55, z], [x1, y1 - 0.55, z], [x1, y1 - 0.52, z], [x0, y1 - 0.52, z]], frame, 'opacity="0.8"'));
      return scene;
    },

    /** Glazing along a side wall (x = const) between z0 and z1. */
    sideWindow({ side = "left", z0 = 2, z1 = 12, y0 = 0.6, y1 = o.ceil - 0.25, panes = 5, frame = "#2A3238" } = {}) {
      const x = side === "left" ? o.left + 0.01 : o.right - 0.01;
      base.push(poly([[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0]], "url(#gSkySide)"));
      const step = (z1 - z0) / panes;
      for (let i = 0; i <= panes; i++) {
        const z = z0 + i * step;
        base.push(poly([[x, y0, z - 0.04], [x, y0, z + 0.04], [x, y1, z + 0.04], [x, y1, z - 0.04]], frame));
      }
      base.push(poly([[x, y0 - 0.04, z0], [x, y0 - 0.04, z1], [x, y0 + 0.02, z1], [x, y0 + 0.02, z0]], frame));
      base.push(poly([[x, y1 - 0.02, z0], [x, y1 - 0.02, z1], [x, y1 + 0.04, z1], [x, y1 + 0.04, z0]], frame));
      return scene;
    },

    /** A rectangle painted onto a wall. */
    wallRect({ side, a0, a1, y0, y1, fill, extra = "" }) {
      // side: "back" (a = x), "left"/"right" (a = z)
      let pts;
      if (side === "back") { const z = o.back - 0.02; pts = [[a0, y0, z], [a1, y0, z], [a1, y1, z], [a0, y1, z]]; }
      else { const x = side === "left" ? o.left + 0.02 : o.right - 0.02; pts = [[x, y0, a0], [x, y0, a1], [x, y1, a1], [x, y1, a0]]; }
      base.push(poly(pts, fill, extra));
      return scene;
    },

    wallCircle({ side, a, y, r, fill, extra = "", seg = 40 }) {
      const pts = [];
      for (let i = 0; i < seg; i++) {
        const t = (i / seg) * Math.PI * 2;
        if (side === "back") pts.push([a + Math.cos(t) * r, y + Math.sin(t) * r, o.back - 0.02]);
        else pts.push([side === "left" ? o.left + 0.03 : o.right - 0.03, y + Math.sin(t) * r, a + Math.cos(t) * r]);
      }
      base.push(poly(pts, fill, extra));
      return scene;
    },

    box(x0, x1, y0, y1, z0, z1, color, { shadow = true, opacity = 1, stroke } = {}) {
      const c = fogged(color, z0);
      let s = "";
      const op = opacity < 1 ? `opacity="${opacity}"` : "";
      const st = stroke ? `stroke="${stroke}" stroke-width="1"` : "";
      if (shadow && y0 < 0.02) {
        const e = 0.12;
        s += poly([[x0 - e, 0.002, z0 - e], [x1 + e, 0.002, z0 - e], [x1 + e, 0.002, z1 + e * 2], [x0 - e, 0.002, z1 + e * 2]], "#1b2328", 'opacity="0.16" filter="url(#soft)"');
      }
      if (y1 < o.eye) s += poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], shade(c, 0.1), `${op} ${st}`);
      if (y0 > o.eye) s += poly([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], shade(c, -0.12), `${op} ${st}`);
      if (x0 > o.camX) s += poly([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], shade(c, -0.14), `${op} ${st}`);
      if (x1 < o.camX) s += poly([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], shade(c, -0.1), `${op} ${st}`);
      s += poly([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], c, `${op} ${st}`);
      items.push({ z: z1, s });
      return scene;
    },

    plant(x, z, { h = 1.1, potW = 0.36, seed = 3, pot = "#2B3337" } = {}) {
      const r = rng(seed);
      scene.box(x - potW / 2, x + potW / 2, 0, 0.42, z - potW / 2, z + potW / 2, pot);
      let s = "";
      const greens = ["#3F817D", "#2F6662", "#4E8F7A", "#5D9A86", "#376F5E"];
      for (let i = 0; i < 26; i++) {
        const lx = x + (r() - 0.5) * 0.7, ly = 0.5 + r() * (h - 0.3), lz = z + (r() - 0.5) * 0.3;
        const [px, py] = P(lx, ly, lz);
        const rad = (o.F * (0.09 + r() * 0.1)) / lz;
        s += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(rad * 0.7).toFixed(1)}" ry="${rad.toFixed(1)}" fill="${fogged(greens[i % greens.length], z)}" opacity="0.92" transform="rotate(${(r() * 80 - 40).toFixed(0)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
      }
      items.push({ z: z - 0.4, s });
      return scene;
    },

    pendant(x, z, { drop = 0.9, r = 0.22, color = "#20272B", glow = true } = {}) {
      const [ax, ay] = P(x, o.ceil, z), [bx, by] = P(x, o.ceil - drop, z);
      const rad = (o.F * r) / z;
      let s = `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${color}" stroke-width="${Math.max(1, 12 / z)}"/>`;
      if (glow) s += `<ellipse cx="${bx}" cy="${by + rad * 0.55}" rx="${rad * 1.8}" ry="${rad * 1.1}" fill="#FFF6E0" opacity="0.5" filter="url(#glow)"/>`;
      s += `<path d="M${bx - rad},${by + rad * 0.6} Q${bx},${by - rad * 0.9} ${bx + rad},${by + rad * 0.6} Z" fill="${fogged(color, z)}"/>`;
      items.push({ z: z - 2, s });
      return scene;
    },

    chair(x, z, { color = "#20272B", facing = "away", seat = 0.46, w = 0.5 } = {}) {
      const d = w;
      scene.box(x - 0.03, x + 0.03, 0, seat, z - 0.03, z + 0.03, "#3A4247", { shadow: true });
      scene.box(x - w / 2, x + w / 2, seat, seat + 0.07, z - d / 2, z + d / 2, color, { shadow: false });
      if (facing === "away") scene.box(x - w / 2, x + w / 2, seat + 0.07, seat + 0.55, z - d / 2, z - d / 2 + 0.06, shade(color, 0.05), { shadow: false });
      else scene.box(x - w / 2, x + w / 2, seat + 0.07, seat + 0.55, z + d / 2 - 0.06, z + d / 2, shade(color, 0.05), { shadow: false });
      return scene;
    },

    desk(x0, x1, z0, z1, { top = "#D9D4CB", legs = "#2B3337", h = 0.74, monitors = 0 } = {}) {
      const t = 0.04;
      scene.box(x0 + 0.04, x0 + 0.08, 0, h - t, z0 + 0.05, z1 - 0.05, legs, { shadow: false });
      scene.box(x1 - 0.08, x1 - 0.04, 0, h - t, z0 + 0.05, z1 - 0.05, legs, { shadow: false });
      scene.box(x0, x1, h - t, h, z0, z1, top, { shadow: true });
      const n = monitors;
      for (let i = 0; i < n; i++) {
        const cx = x0 + ((i + 0.5) * (x1 - x0)) / n;
        const mz = (z0 + z1) / 2 + 0.05;
        scene.box(cx - 0.02, cx + 0.02, h, h + 0.18, mz, mz + 0.03, "#2B3337", { shadow: false });
        scene.box(cx - 0.3, cx + 0.3, h + 0.15, h + 0.52, mz - 0.02, mz, "#1E2428", { shadow: false });
      }
      return scene;
    },

    render({ vignette = 0.32, warm = 0.1, light = { x: 0.5, y: 0.35 } } = {}) {
      items.sort((a, b) => b.z - a.z);
      const g = (id, a, b, x2 = 0, y2 = 1) =>
        `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
      const defs = `
<defs>
  ${g("gBack", shade(o.backWall, 0.04), shade(o.backWall, -0.04))}
  ${g("gFloor", shade(o.floor, -0.06), shade(o.floor, 0.12))}
  ${g("gCeil", shade(o.ceiling, -0.06), o.ceiling)}
  ${g("gWallL", shade(o.wall, -0.08), shade(o.wall, 0.04), 1, 0)}
  ${g("gWallR", shade(o.wall, 0.04), shade(o.wall, -0.1), 1, 0)}
  ${g("gSky", "#E9EEF0", "#C9D6DC")}
  ${g("gSkySide", "#F1F4F4", "#D4DFE3", 1, 0)}
  <linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
    <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.05"/>
    <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.18"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="gLight" cx="${light.x}" cy="${light.y}" r="0.75">
    <stop offset="0" stop-color="#FFF9EC" stop-opacity="${warm + 0.12}"/>
    <stop offset="1" stop-color="#FFF9EC" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="gVig" cx="0.5" cy="0.5" r="0.75">
    <stop offset="0.55" stop-color="#0E1A26" stop-opacity="0"/>
    <stop offset="1" stop-color="#0E1A26" stop-opacity="${vignette}"/>
  </radialGradient>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
</defs>`;
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">
${defs}
<rect width="${W}" height="${H}" fill="${o.backWall}"/>
${base.join("\n")}
${items.map((i) => i.s).join("\n")}
${overlay.join("\n")}
<rect width="${W}" height="${H}" fill="url(#gLight)"/>
<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.07"/>
<rect width="${W}" height="${H}" fill="url(#gVig)"/>
</svg>`;
    },
  };
  return scene;
}

/* ---------- scenes ---------- */
const scenes = {};

scenes["hero-modern-office"] = () => {
  const s = createScene({ camX: 0.6, back: 15, left: -5.5, right: 5, floor: "#C9C6BF", fogAmount: 0.4 });
  s.room().floorLines({ every: 1.1, across: false, opacity: 0.1 }).ceilingGrid({ every: 1.25, opacity: 0.12 })
    .lightStrips({ xs: [-2.6, 0, 2.6], from: 1.5, to: 14.5 })
    .backWindow({ cols: 8, seed: 11 })
    .sideWindow({ side: "left", z0: 1, z1: 14.5, panes: 7 });
  s.wallRect({ side: "right", a0: 3, a1: 9, y0: 0.9, y1: 2.2, fill: "#142638", extra: 'opacity="0.9"' });
  s.wallRect({ side: "right", a0: 9.6, a1: 12.5, y0: 0, y1: 2.4, fill: "#B89F80" });
  for (const z of [4.2, 7.4, 10.6]) {
    for (const [x0, x1] of [[-4.2, -1.6], [-0.4, 2.2]]) {
      s.desk(x0, x1, z, z + 1.4, { monitors: 2, top: "#E2DDD4" });
      for (const cx of [x0 + (x1 - x0) * 0.25, x0 + (x1 - x0) * 0.75]) s.chair(cx, z - 0.35, { color: "#20272B" });
    }
  }
  s.plant(3.8, 4, { h: 1.5, seed: 7 }).plant(-4.9, 13, { h: 1.3, seed: 9 }).plant(3.9, 13.5, { seed: 4 });
  s.box(3.1, 4.7, 0, 0.45, 6.5, 8.6, "#3F817D");
  s.box(3.1, 4.7, 0.45, 0.85, 8.4, 8.6, "#3F817D", { shadow: false });
  return s.render({ light: { x: 0.45, y: 0.4 } });
};

scenes["service-office"] = () => {
  const s = createScene({ camX: -0.8, back: 11, left: -4, right: 4.5, floor: "#BFB5A6", fogAmount: 0.3 });
  s.room().floorLines({ every: 0.25, across: false, opacity: 0.12 }).lightStrips({ xs: [-1, 1.8], from: 1.5, to: 10.5 })
    .backWindow({ cols: 5, seed: 3 });
  s.wallRect({ side: "left", a0: 2, a1: 9, y0: 0, y1: 3.1, fill: "#DCD8D0" });
  for (let z = 2.5; z < 9; z += 1.2) s.wallRect({ side: "left", a0: z, a1: z + 0.02, y0: 0, y1: 3.1, fill: "#C8C2B8" });
  for (const z of [3.2, 6.6]) {
    s.desk(-2.6, 2.6, z, z + 1.6, { monitors: 4, top: "#EAE6DF" });
    for (const cx of [-1.95, -0.65, 0.65, 1.95]) { s.chair(cx, z - 0.4); s.chair(cx, z + 2.0, { facing: "toward", color: "#3B4A57" }); }
  }
  s.plant(3.7, 9.5, { h: 1.6, seed: 12 }).plant(-3.4, 2.4, { h: 1.2, seed: 2 });
  return s.render();
};

scenes["meeting-room"] = () => {
  const s = createScene({ camX: 0, back: 9, left: -3.2, right: 3.2, ceil: 2.9, floor: "#5A5F62", wall: "#E9E6E0", fogAmount: 0.2, eye: 1.45 });
  s.room().floorLines({ every: 0.6, across: 0.6, opacity: 0.12, color: "#3A3F42" }).lightStrips({ xs: [0], from: 2, to: 8.5, len: 6.5, w: 0.1 })
    .sideWindow({ side: "right", z0: 1, z1: 8.9, panes: 6, y0: 0.05, y1: 2.85 });
  s.wallRect({ side: "back", a0: -3.2, a1: 3.2, y0: 0, y1: 2.9, fill: "#B89F80" });
  for (let x = -3; x < 3.2; x += 0.18) s.wallRect({ side: "back", a0: x, a1: x + 0.02, y0: 0, y1: 2.9, fill: "#A58C6E" });
  s.wallRect({ side: "back", a0: -1.1, a1: 1.1, y0: 1.05, y1: 2.25, fill: "#1B2227" });
  s.box(-0.9, 0.9, 0, 0.72, 3.2, 7.8, "#2B3337");
  s.box(-1.05, 1.05, 0.72, 0.76, 2.8, 8, "#E8E4DC");
  for (let z = 3.4; z < 8; z += 1.1) { s.chair(-1.45, z, { color: "#142638", facing: "toward" }); s.chair(1.45, z, { color: "#142638", facing: "toward" }); }
  s.plant(-2.6, 8.2, { h: 1.3, seed: 21 });
  return s.render({ vignette: 0.38, light: { x: 0.8, y: 0.4 } });
};

scenes["service-retail"] = () => {
  const s = createScene({ camX: 0.2, back: 12, left: -4, right: 4, ceil: 3.4, floor: "#D8D3CA", wall: "#F0EEE9", fogAmount: 0.25 });
  s.room().floorLines({ every: 0.8, across: 0.8, opacity: 0.09 });
  for (const z of [2.5, 5, 7.5, 10]) s.pendant(-1.2, z, { drop: 1.1, color: "#20272B" }).pendant(1.2, z, { drop: 1.1, color: "#20272B" });
  s.wallRect({ side: "back", a0: -1.3, a1: 1.3, y0: 0, y1: 2.6, fill: "#142638" });
  s.wallRect({ side: "back", a0: -1.1, a1: 1.1, y0: 0, y1: 2.4, fill: "#E8ECEE", extra: 'opacity="0.9"' });
  for (const side of ["left", "right"]) {
    for (let z = 2; z < 11.5; z += 1.9) {
      for (const y of [0.6, 1.25, 1.9]) s.wallRect({ side, a0: z, a1: z + 1.6, y0: y, y1: y + 0.04, fill: "#B89F80" });
      const items = rng(Math.round(z * 10) + (side === "left" ? 1 : 2));
      for (const y of [0.64, 1.29, 1.94]) for (let a = z + 0.1; a < z + 1.5; a += 0.28) {
        const hh = 0.18 + items() * 0.22;
        s.wallRect({ side, a0: a, a1: a + 0.18, y0: y, y1: y + hh, fill: mix("#C9C3B8", "#3F817D", items() * 0.5) });
      }
    }
  }
  // rail with garments
  for (const x of [-1.8, 1.8]) {
    s.box(x - 0.6, x + 0.6, 1.5, 1.53, 4, 4.03, "#20272B", { shadow: false });
    for (let i = 0; i < 6; i++) s.box(x - 0.55 + i * 0.2, x - 0.42 + i * 0.2, 0.7, 1.48, 3.9, 4.1, mix("#E5DFD3", "#142638", (i % 3) * 0.3), { shadow: i === 0 });
  }
  s.box(-0.7, 0.7, 0, 0.85, 6.5, 7.6, "#EDE9E2");
  s.box(-0.4, -0.1, 0.85, 1.05, 6.8, 7.1, "#3F817D", { shadow: false });
  s.box(0.15, 0.45, 0.85, 1.15, 6.9, 7.2, "#20272B", { shadow: false });
  return s.render({ warm: 0.16 });
};

scenes["service-salon"] = () => {
  const s = createScene({ camX: 0.8, back: 11, left: -3.6, right: 3.4, ceil: 3, floor: "#E3DED6", wall: "#EDE7E0", backWall: "#D8CFC4", fogAmount: 0.2 });
  s.room().floorLines({ every: 0.6, across: 0.6, opacity: 0.08 });
  for (let z = 2.2; z < 10; z += 1.9) {
    s.wallCircle({ side: "left", a: z + 0.6, y: 1.55, r: 0.62, fill: "#C9B79F" });
    s.wallCircle({ side: "left", a: z + 0.6, y: 1.55, r: 0.56, fill: "url(#gSkySide)" });
    s.wallRect({ side: "left", a0: z, a1: z + 1.2, y0: 0.78, y1: 0.82, fill: "#B89F80" });
    s.box(-3.6, -3.25, 0, 0.8, z, z + 1.2, "#EEE9E2");
    s.chair(-2.4, z + 0.6, { color: "#3F817D", seat: 0.55, w: 0.62, facing: "toward" });
    s.pendant(-2.9, z + 0.6, { drop: 0.6, r: 0.14, color: "#B89F80" });
  }
  s.wallRect({ side: "back", a0: -1, a1: 1.6, y0: 0, y1: 2.5, fill: "#20272B" });
  s.wallRect({ side: "back", a0: -0.9, a1: 1.5, y0: 0, y1: 2.4, fill: "#E8ECEE", extra: 'opacity="0.85"' });
  s.box(1.6, 3.4, 0, 1.0, 4.5, 5.2, "#142638");
  s.box(1.5, 3.4, 1.0, 1.05, 4.4, 5.3, "#E8E4DC", { shadow: false });
  s.plant(2.9, 8.8, { h: 1.6, seed: 31, pot: "#B89F80" });
  return s.render({ warm: 0.18, light: { x: 0.4, y: 0.35 } });
};

scenes["service-communal"] = () => {
  const s = createScene({ camX: -0.3, back: 13, left: -3.4, right: 3.4, ceil: 3.6, floor: "#BDB8AF", wall: "#E8E5DF", fogAmount: 0.3, eye: 1.6 });
  s.room().floorLines({ every: 0.85, across: 0.85, opacity: 0.14 }).ceilingGrid({ every: 1.7, opacity: 0.08 });
  for (const z of [3, 6.5, 10]) s.pendant(0, z, { drop: 0.4, r: 0.3, color: "#F5F2EC" });
  s.wallRect({ side: "back", a0: -0.8, a1: 0.8, y0: 0, y1: 2.5, fill: "#142638" });
  s.wallRect({ side: "back", a0: -0.7, a1: 0.7, y0: 0, y1: 2.4, fill: "url(#gSky)" });
  s.wallRect({ side: "back", a0: -0.02, a1: 0.02, y0: 0, y1: 2.4, fill: "#142638" });
  // letterboxes
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++)
    s.wallRect({ side: "left", a0: 3 + i * 0.55, a1: 3.48 + i * 0.55, y0: 0.9 + j * 0.34, y1: 1.18 + j * 0.34, fill: j % 2 ? "#3A4247" : "#2E363B" });
  s.wallRect({ side: "left", a0: 6.5, a1: 11, y0: 0, y1: 3.6, fill: "#B89F80" });
  // stairs on right
  for (let i = 0; i < 9; i++) s.box(1.8, 3.4, 0, 0.18 * (i + 1), 5 + i * 0.3, 5.3 + i * 0.3, "#D9D5CE", { shadow: i === 0 });
  s.box(1.75, 1.8, 0.18, 2.6, 5, 7.7, "#20272B", { shadow: false, opacity: 0.85 });
  s.box(-1.8, -0.4, 0, 0.45, 7.5, 8, "#3F817D");
  s.plant(-2.8, 12, { h: 1.7, seed: 41 });
  return s.render({ light: { x: 0.5, y: 0.5 } });
};

scenes["service-clinic"] = () => {
  const s = createScene({ camX: 0.4, back: 11, left: -3.8, right: 3.8, ceil: 2.9, floor: "#E4E6E5", wall: "#F1F2F0", backWall: "#E8EBEA", fog: "#F4F6F6", fogAmount: 0.25 });
  s.room().floorLines({ every: 0.6, across: 0.6, opacity: 0.08 }).lightStrips({ xs: [-1.5, 1.5], from: 1.5, to: 10.5, len: 0.6, gap: 0.6, w: 0.3 });
  s.wallRect({ side: "back", a0: -3.8, a1: 3.8, y0: 0.9, y1: 1.02, fill: "#3F817D", extra: 'opacity="0.85"' });
  s.wallRect({ side: "back", a0: -0.5, a1: 0.9, y0: 0, y1: 2.2, fill: "#D8DEDE" });
  s.wallRect({ side: "back", a0: 1.6, a1: 3, y0: 0, y1: 2.2, fill: "#D8DEDE" });
  s.box(-2.8, 0.2, 0, 1.05, 4.8, 5.6, "#FFFFFF");
  s.box(-2.9, 0.3, 1.05, 1.1, 4.7, 5.7, "#B9C9C7", { shadow: false });
  s.box(-2.8, 0.2, 0.05, 0.15, 4.75, 4.8, "#3F817D", { shadow: false });
  s.box(-1.8, -1.2, 1.1, 1.45, 5.3, 5.35, "#20272B", { shadow: false });
  for (let z = 2.5; z < 9.5; z += 0.75) s.chair(2.9, z, { color: "#142638", facing: "toward", w: 0.55 });
  s.plant(-3.2, 9.5, { h: 1.4, seed: 51, pot: "#FFFFFF" });
  return s.render({ vignette: 0.25, warm: 0.05 });
};

scenes["service-deep-cleaning"] = () => {
  const s = createScene({ camX: 0.3, back: 16, left: -2.2, right: 2.2, ceil: 2.8, floor: "#A9A9A4", wall: "#E6E4DF", fogAmount: 0.45, eye: 1.3 });
  s.room().floorLines({ every: 0.55, across: 0.55, opacity: 0.12, color: "#6F716E" }).lightStrips({ xs: [0], from: 1.2, to: 15.5, len: 0.9, gap: 1.4, w: 0.2 });
  for (let z = 2; z < 15; z += 3) { s.wallRect({ side: "left", a0: z, a1: z + 1, y0: 0, y1: 2.2, fill: "#B89F80" }); s.wallRect({ side: "right", a0: z + 1.4, a1: z + 2.4, y0: 0, y1: 2.2, fill: "#D4D0C8" }); }
  s.wallRect({ side: "back", a0: -1, a1: 1, y0: 0, y1: 2.4, fill: "url(#gSky)" });
  // floor sheen (freshly cleaned)
  s.addBase(`<path d="${s.path([[-1.4, 0.001, 1], [1.6, 0.001, 1], [1.2, 0.001, 9], [-1, 0.001, 9]])}" fill="#ffffff" opacity="0.22" filter="url(#soft)"/>`);
  // cleaning trolley
  s.box(0.6, 1.5, 0.1, 0.9, 3.2, 3.8, "#142638");
  s.box(0.65, 1.45, 0.9, 0.94, 3.25, 3.75, "#3F817D", { shadow: false });
  s.box(0.75, 1.0, 0.94, 1.18, 3.4, 3.6, "#E8E4DC", { shadow: false });
  s.box(1.1, 1.35, 0.94, 1.12, 3.35, 3.6, "#C7D3D2", { shadow: false });
  s.box(0.68, 0.72, 0.9, 1.65, 3.7, 3.74, "#3A4247", { shadow: false });
  // floor machine
  s.box(-1.2, -0.5, 0, 0.32, 5.4, 6.0, "#20272B");
  s.box(-0.9, -0.82, 0.3, 1.15, 5.9, 5.98, "#3A4247", { shadow: false });
  return s.render({ vignette: 0.4, light: { x: 0.5, y: 0.45 } });
};

scenes["out-of-hours-cleaning"] = () => {
  const s = createScene({ camX: -0.5, back: 12, left: -4.5, right: 4, floor: "#8E8C86", wall: "#7E8487", backWall: "#59626A", ceiling: "#8A9093", fog: "#4C5862", fogAmount: 0.35 });
  s.room().floorLines({ every: 1, across: false, opacity: 0.12, color: "#3A3F42" }).lightStrips({ xs: [-1.2], from: 1.5, to: 11.5 });
  s.backWindow({ cols: 6, seed: 5 });
  s.addBase(`<rect x="0" y="0" width="${W}" height="${H}" fill="#142638" opacity="0.35"/>`);
  for (const z of [3.5, 7]) { s.desk(-3.4, 0.2, z, z + 1.4, { monitors: 3, top: "#C9C5BE" }); s.desk(1, 3.4, z, z + 1.4, { monitors: 2, top: "#C9C5BE" }); }
  s.box(0.35, 0.95, 0.1, 0.85, 5.6, 6.1, "#3F817D");
  s.box(0.4, 0.9, 0.85, 0.89, 5.65, 6.05, "#E8E4DC", { shadow: false });
  s.addOverlay(`<rect width="${W}" height="${H}" fill="#FFE7B8" opacity="0.06"/>`);
  return s.render({ vignette: 0.5, warm: 0.2, light: { x: 0.35, y: 0.35 } });
};

scenes["about-workspace"] = () => {
  const s = createScene({ camX: 1, back: 13, left: -5, right: 4.2, ceil: 3.4, floor: "#C4BBAE", fogAmount: 0.35 });
  s.room().floorLines({ every: 0.3, across: false, opacity: 0.1 })
    .sideWindow({ side: "left", z0: 0.8, z1: 12.8, panes: 8, y0: 0.05, y1: 3.3 });
  for (const z of [3, 6.5, 10]) s.pendant(-1.5, z, { drop: 1.3, r: 0.32, color: "#142638" });
  s.wallRect({ side: "back", a0: -5, a1: 4.2, y0: 0, y1: 3.4, fill: "#E4E0D8" });
  s.wallRect({ side: "back", a0: 0.5, a1: 3.4, y0: 0.9, y1: 2.4, fill: "#3F817D", extra: 'opacity="0.9"' });
  s.box(-2.8, -0.2, 0, 0.42, 4.6, 5.5, "#20272B");
  s.box(-2.8, -0.2, 0.42, 0.78, 5.35, 5.5, "#20272B", { shadow: false });
  s.box(-2, -1, 0, 0.4, 3.2, 3.9, "#B89F80");
  s.box(-2.4, -0.4, 0, 0.74, 8.2, 9.4, "#E9E5DD");
  s.chair(-1.9, 7.8, { color: "#142638" }).chair(-0.9, 7.8, { color: "#142638" });
  s.plant(2.8, 3.5, { h: 1.8, seed: 61 }).plant(3.2, 11.5, { h: 1.4, seed: 62 });
  return s.render({ light: { x: 0.2, y: 0.4 }, warm: 0.14 });
};

for (const [name, build] of Object.entries(scenes)) {
  const svg = build();
  writeFileSync(join(OUT, `${name}.svg`), svg);
  console.log(`✓ ${name}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
}
