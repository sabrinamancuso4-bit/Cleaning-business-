/**
 * Generates original placeholder artwork for The Cleaning Specialist website.
 *
 * External stock-photo URLs are deliberately avoided (fragile, licensing).
 * Instead, this script renders simple one-point-perspective architectural
 * scenes as SVG files in /public/images/placeholders. Each file is named after
 * the photograph it stands in for, so swapping in real images later is a
 * matter of replacing the `src` values in the <img> tags in public/index.html.
 *
 * Run with: node tools/generate-images.mjs  (from the-cleaning-specialist/)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "assets", "img");
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
  ${g("gSky", o.sky?.[0] ?? "#E9EEF0", o.sky?.[1] ?? "#C9D6DC")}
  ${g("gSkySide", o.skySide?.[0] ?? "#F1F4F4", o.skySide?.[1] ?? "#D4DFE3", 1, 0)}
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

/* ---------- helpers for the oak-and-greenery look ---------- */
const OAK = "#C8A273";
const OAK_DARK = "#8E6A43";
const GREENS = ["#2F5E3A", "#3E7A45", "#4F8C4E", "#5E9A55", "#2B5134", "#6BA35E"];

/** Vertical timber slats on a side wall (a = z) or the back wall (a = x). */
function slats(s, { side, a0, a1, y0 = 0, y1, pitch = 0.09, w = 0.04 }) {
  s.wallRect({ side, a0, a1, y0, y1, fill: OAK });
  for (let a = a0; a < a1; a += pitch) s.wallRect({ side, a0: a, a1: a + w, y0, y1, fill: OAK_DARK, extra: 'opacity="0.55"' });
}

/** Timber slat ceiling raft running front to back. */
function ceilingSlats(s, { x0, x1, z0, z1, pitch = 0.11, w = 0.05 }) {
  const y = s.o.ceil - 0.01;
  s.addBase(s.poly([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], OAK));
  for (let x = x0; x < x1; x += pitch) s.addBase(s.poly([[x, y, z0], [x + w, y, z0], [x + w, y, z1], [x, y, z1]], OAK_DARK, 'opacity="0.5"'));
}

/** Leafy clusters (trees beyond the glazing, or planting inside). */
function foliage(s, { x0, x1, z0, z1, y0, y1, n = 60, seed = 1, size = 0.18, behind = false }) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0), z = z0 + r() * (z1 - z0), y = y0 + r() * (y1 - y0);
    const [px, py] = s.P(x, y, z);
    const rad = (s.o.F * size * (0.6 + r() * 0.8)) / z;
    const c = GREENS[Math.floor(r() * GREENS.length)];
    out += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(rad * 1.25).toFixed(1)}" ry="${(rad * 0.6).toFixed(1)}" fill="${behind ? mix(c, "#DDE7DC", 0.45) : c}" opacity="0.93" transform="rotate(${(r() * 140 - 70).toFixed(0)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
  }
  if (behind) s.addBase(out);
  else s.add(z0 - 0.3, out);
}

/* ---------- scenes ---------- */
const scenes = {};

// Hero: oak-slatted reception, glazing with planting on the right (echoes the approved concept).
scenes["hero-reception"] = () => {
  const s = createScene({ camX: -0.3, back: 13, left: -3.4, right: 3.6, ceil: 3.3, eye: 1.5, F: 900,
    floor: "#DAD6CD", wall: "#E7E3DB", backWall: "#E2DDD3", ceiling: "#C9C9C6", fog: "#EEF0EA", fogAmount: 0.25,
    sky: ["#EEF3EC", "#D6E2D3"], skySide: ["#F4F7F1", "#DDE8D8"] });
  s.room().floorLines({ every: 0.9, across: 0.9, opacity: 0.08 });
  ceilingSlats(s, { x0: -3.4, x1: 1.6, z0: 0.3, z1: 9.5 });
  slats(s, { side: "left", a0: 0.3, a1: 13, y1: 3.3 });
  slats(s, { side: "back", a0: -3.4, a1: 3.6, y1: 3.3, pitch: 0.08 });
  s.wallRect({ side: "back", a0: -0.6, a1: 1.4, y0: 1.35, y1: 1.95, fill: "#3B3F3F" });
  s.wallRect({ side: "back", a0: -0.7, a1: 1.5, y0: 1.28, y1: 1.32, fill: "#F6F2E6", extra: 'filter="url(#glow)"' });
  // glazing + trees outside
  s.sideWindow({ side: "right", z0: 0.3, z1: 12.9, panes: 8, y0: 0.02, y1: 3.25, frame: "#3A4141" });
  foliage(s, { x0: 3.62, x1: 3.62, z0: 2, z1: 12.8, y0: 0.6, y1: 3.2, n: 140, seed: 5, size: 0.35, behind: true });
  // lights in ceiling
  s.lightStrips({ xs: [-2.2, -0.6], from: 1.5, to: 9, len: 0.5, gap: 1.6, w: 0.05 });
  // reception desk (oak), workstation beyond
  s.box(-2.2, 0.2, 0, 1.05, 4.2, 5.0, "#CFA978");
  s.box(-2.25, 0.25, 1.05, 1.1, 4.15, 5.05, "#D8B788", { shadow: false });
  s.box(-1.2, -0.7, 1.1, 1.5, 4.7, 4.74, "#E9E9E6", { shadow: false });
  s.desk(-1, 1.6, 8.5, 9.3, { top: "#B9B6B0", legs: "#3A4141" });
  s.chair(0.4, 8.1, { color: "#2E3333" });
  s.chair(-1.3, 5.6, { color: "#2E3333", facing: "toward" });
  // planter along the glazing
  s.box(2.3, 3.5, 0, 0.55, 3.5, 12.5, "#8C857A");
  foliage(s, { x0: 2.3, x1: 3.5, z0: 3.4, z1: 12.4, y0: 0.5, y1: 1.6, n: 120, seed: 9, size: 0.17 });
  foliage(s, { x0: 2.4, x1: 3.4, z0: 2.4, z1: 3.4, y0: 0.2, y1: 1.3, n: 50, seed: 3, size: 0.2 });
  s.plant(-2.9, 2.2, { h: 1.8, seed: 14, pot: "#ECEAE4", potW: 0.5 });
  s.plant(1.2, 10.5, { h: 1.4, seed: 15, pot: "#ECEAE4" });
  return s.render({ vignette: 0.22, warm: 0.12, light: { x: 0.75, y: 0.45 } });
};

scenes["service-office"] = () => {
  const s = createScene({ camX: 0.6, back: 12, left: -4, right: 4, ceil: 3, floor: "#CFC7BA", wall: "#E9E5DD", fogAmount: 0.28,
    sky: ["#EEF3EC", "#D3DFD0"] });
  s.room().floorLines({ every: 0.25, across: false, opacity: 0.1 }).lightStrips({ xs: [-1.2, 1.4], from: 1.5, to: 11 });
  s.backWindow({ cols: 6, seed: 2, skyline: false, frame: "#2E3535" });
  foliage(s, { x0: -3.6, x1: 3.6, z0: 11.98, z1: 11.99, y0: 0.4, y1: 2.6, n: 120, seed: 21, size: 0.3, behind: true });
  slats(s, { side: "left", a0: 1, a1: 11.5, y1: 3 });
  for (const z of [3.3, 6.8]) {
    s.desk(-2.6, 2.6, z, z + 1.5, { monitors: 4, top: "#EDE9E1", legs: "#2E3333" });
    for (const cx of [-1.95, -0.65, 0.65, 1.95]) { s.chair(cx, z - 0.4, { color: "#173B32" }); s.chair(cx, z + 1.9, { facing: "toward", color: "#2E3333" }); }
  }
  s.plant(3.4, 10.3, { h: 1.6, seed: 31 }).plant(-3.3, 2.3, { h: 1.3, seed: 32 });
  return s.render({ warm: 0.12 });
};

scenes["service-contract"] = () => {
  const s = createScene({ camX: 0, back: 9, left: -3.2, right: 3.2, ceil: 2.9, eye: 1.45, floor: "#4C5450", wall: "#E9E5DD", fogAmount: 0.2,
    skySide: ["#F1F5EF", "#D5E1D1"] });
  s.room().floorLines({ every: 0.6, across: 0.6, opacity: 0.1, color: "#2E3333" }).lightStrips({ xs: [0], from: 2, to: 8.5, len: 6.5, w: 0.08 })
    .sideWindow({ side: "right", z0: 1, z1: 8.9, panes: 6, y0: 0.05, y1: 2.85, frame: "#2E3535" });
  foliage(s, { x0: 3.22, x1: 3.22, z0: 1.5, z1: 8.8, y0: 0.5, y1: 2.8, n: 90, seed: 41, size: 0.3, behind: true });
  slats(s, { side: "back", a0: -3.2, a1: 3.2, y1: 2.9, pitch: 0.16, w: 0.03 });
  s.wallRect({ side: "back", a0: -1.1, a1: 1.1, y0: 1.05, y1: 2.2, fill: "#1E2424" });
  s.box(-0.9, 0.9, 0, 0.72, 3.2, 7.8, "#2E3333");
  s.box(-1.05, 1.05, 0.72, 0.77, 2.8, 8, "#CFA978");
  for (let z = 3.4; z < 8; z += 1.1) { s.chair(-1.45, z, { color: "#173B32", facing: "toward" }); s.chair(1.45, z, { color: "#173B32", facing: "toward" }); }
  s.plant(-2.6, 8.2, { h: 1.3, seed: 42 });
  return s.render({ vignette: 0.3, light: { x: 0.8, y: 0.4 } });
};

scenes["service-communal"] = () => {
  const s = createScene({ camX: -0.3, back: 13, left: -3.4, right: 3.4, ceil: 3.6, eye: 1.6, floor: "#C9C3B8", wall: "#E8E4DC", fogAmount: 0.3,
    sky: ["#F1F5EF", "#D5E1D1"] });
  s.room().floorLines({ every: 0.85, across: 0.85, opacity: 0.12 });
  for (const z of [3, 6.5, 10]) s.pendant(0, z, { drop: 0.5, r: 0.3, color: "#173B32" });
  s.wallRect({ side: "back", a0: -0.85, a1: 0.85, y0: 0, y1: 2.55, fill: "#2E3535" });
  s.wallRect({ side: "back", a0: -0.75, a1: 0.75, y0: 0, y1: 2.45, fill: "url(#gSky)" });
  foliage(s, { x0: -0.7, x1: 0.7, z0: 12.97, z1: 12.98, y0: 0.3, y1: 2.3, n: 40, seed: 51, size: 0.25, behind: true });
  s.wallRect({ side: "back", a0: -0.02, a1: 0.02, y0: 0, y1: 2.45, fill: "#2E3535" });
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++)
    s.wallRect({ side: "left", a0: 3 + i * 0.55, a1: 3.48 + i * 0.55, y0: 0.9 + j * 0.34, y1: 1.18 + j * 0.34, fill: j % 2 ? "#33403B" : "#2A3632" });
  slats(s, { side: "left", a0: 6.5, a1: 11.5, y1: 3.6 });
  for (let i = 0; i < 9; i++) s.box(1.8, 3.4, 0, 0.18 * (i + 1), 5 + i * 0.3, 5.3 + i * 0.3, "#DDD8CF", { shadow: i === 0 });
  s.box(-1.8, -0.4, 0, 0.45, 7.5, 8, "#CFA978");
  s.plant(-2.8, 12, { h: 1.7, seed: 52 });
  return s.render({ light: { x: 0.5, y: 0.5 } });
};

scenes["service-maintenance"] = () => {
  const s = createScene({ camX: 0.3, back: 15, left: -2.3, right: 2.3, ceil: 2.8, eye: 1.3, floor: "#B9B5AC", wall: "#E6E2DA", fogAmount: 0.4 });
  s.room().floorLines({ every: 0.55, across: 0.55, opacity: 0.12, color: "#6F716E" }).lightStrips({ xs: [0], from: 1.2, to: 14.5, len: 0.9, gap: 1.4, w: 0.18 });
  for (let z = 2; z < 14; z += 3) { slats(s, { side: "left", a0: z, a1: z + 1, y1: 2.2 }); s.wallRect({ side: "right", a0: z + 1.4, a1: z + 2.4, y0: 0, y1: 2.2, fill: "#D6D1C7" }); }
  s.wallRect({ side: "back", a0: -1, a1: 1, y0: 0, y1: 2.4, fill: "url(#gSky)" });
  s.addBase(`<path d="${s.path([[-1.4, 0.001, 1], [1.6, 0.001, 1], [1.2, 0.001, 9], [-1, 0.001, 9]])}" fill="#ffffff" opacity="0.22" filter="url(#soft)"/>`);
  s.box(0.6, 1.5, 0.1, 0.9, 3.2, 3.8, "#173B32");
  s.box(0.65, 1.45, 0.9, 0.94, 3.25, 3.75, "#D8C7A3", { shadow: false });
  s.box(0.75, 1.0, 0.94, 1.18, 3.4, 3.6, "#F8F5ED", { shadow: false });
  s.box(1.1, 1.35, 0.94, 1.12, 3.35, 3.6, "#C9D3CC", { shadow: false });
  s.box(0.68, 0.72, 0.9, 1.65, 3.7, 3.74, "#2E3333", { shadow: false });
  s.box(-1.2, -0.5, 0, 0.32, 5.4, 6.0, "#2E3333");
  s.box(-0.9, -0.82, 0.3, 1.15, 5.9, 5.98, "#3A4141", { shadow: false });
  return s.render({ vignette: 0.35, light: { x: 0.5, y: 0.45 } });
};

for (const [name, build] of Object.entries(scenes)) {
  const svg = build();
  writeFileSync(join(OUT, `${name}.svg`), svg);
  console.log(`✓ ${name}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
}
