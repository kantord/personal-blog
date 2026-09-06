// Port of the "Blog v2" design canvas to static output.
//
// The design's contract: a mono body and serif headings on a strict baseline
// grid; a named column grid (L / LGC / C / CGR / R with b/m/e lines) that
// margin notes and section headings address by token; "surfaces" (ink+ground
// pairings) instead of palettes; chrome that ducks out of the way via CSS
// scroll timelines; grain, edge fades and plotter-style art as progressive
// enhancement. Everything content-independent lives in BASE_CSS; the
// timeline wiring is generated per page from its actual section count.

// ── Surfaces ────────────────────────────────────────────────────────────────
// Light = paper, dark = cyanotype (the design's defaults). Each surface is a
// physical ink+ground pairing; grain/speckle parameters feed the runtime JS.
export const SURFACES = {
  paper: {
    bg: "#fbfaf7",
    fg: "#16171a",
    inkRgb: "24,26,30",
    rule: "rgba(0,0,0,0.16)",
    codeBg: "rgba(0,0,0,0.025)",
    grain: 0.035,
    grainTint: "90,80,60",
  },
  cyanotype: {
    bg: "#0d1b2e",
    fg: "#dce7f2",
    inkRgb: "198,224,248",
    rule: "rgba(190,220,250,0.18)",
    codeBg: "rgba(140,190,240,0.05)",
    grain: 0.04,
    grainTint: "170,205,245",
    glow: "rgba(120,180,255,0.55)",
  },
};

const surfaceVars = (s) =>
  [
    `--bg: ${s.bg};`,
    `--fg: ${s.fg};`,
    `--ink-rgb: ${s.inkRgb};`,
    `--rule: ${s.rule};`,
    `--code-bg: ${s.codeBg};`,
    `--grain-amount: ${s.grain};`,
    `--grain-tint: ${s.grainTint};`,
    `--glow: ${s.glow || "none"};`,
  ].join(" ");

// Rustic ink tile from the design: a static SVG alpha mask (grain × weave)
// applied to running text. Rasterised once by the browser; no live filter.
const INK_TILE = `url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22%3E%3Cfilter id=%22f%22 filterUnits=%22userSpaceOnUse%22 x=%220%22 y=%220%22 width=%22256%22 height=%22256%22 color-interpolation-filters=%22sRGB%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.5 0.3704%22 numOctaves=%221%22 seed=%2221%22 stitchTiles=%22stitch%22 result=%22grain%22/%3E%3CfeColorMatrix in=%22grain%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 2.2 0 0 0 -0.1%22 result=%22m1%22/%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.2632%22 numOctaves=%221%22 seed=%2244%22 stitchTiles=%22stitch%22 result=%22weave%22/%3E%3CfeColorMatrix in=%22weave%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 2.3 0 0 0 -0.15%22 result=%22m2%22/%3E%3CfeComposite in=%22m1%22 in2=%22m2%22 operator=%22arithmetic%22 k1=%221%22 k2=%220%22 k3=%220%22 k4=%220%22/%3E%3C/filter%3E%3Crect width=%22256%22 height=%22256%22 filter=%22url(%23f)%22/%3E%3C/svg%3E')`;

// ── Base stylesheet ─────────────────────────────────────────────────────────
export const BASE_CSS = `
  :root { font-size: 17px; line-height: 28px; --step: calc(1rlh / 2); }
  :root { ${surfaceVars(SURFACES.paper)} }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { ${surfaceVars(SURFACES.cyanotype)} }
  }
  :root[data-theme="dark"] { ${surfaceVars(SURFACES.cyanotype)} }

  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh;
    background-color: var(--bg); color: var(--fg);
    font-family: 'Noto Sans Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 1rem; line-height: 1rlh; letter-spacing: -0.005em;
    -webkit-font-smoothing: antialiased;
  }
  ::selection { background: rgba(var(--ink-rgb), 0.88); color: var(--bg); text-shadow: none; }

  h1, h2, h3 {
    margin: 0; font-family: 'Young Serif', Georgia, serif; font-weight: 400;
    letter-spacing: -0.01em; position: relative;
  }
  h1 { font-size: 40px; line-height: 2rlh; top: var(--title-shift, 0px); }
  h2 { font-size: 26px; line-height: 2rlh; top: var(--head-shift, 0px); }
  h3 { font-size: 20px; line-height: 1rlh; top: var(--sub-shift, 0px); }
  p, ul, ol, blockquote { margin: 0; line-height: 1rlh; }
  ul, ol { padding-left: 2ch; }
  blockquote { padding-left: 2ch; border-left: 1px solid var(--rule); opacity: 0.85; }
  :not(pre) > code, kbd { line-height: 1; }
  sup, sub { font-size: 0.6em; line-height: 1; vertical-align: baseline; position: relative; }
  sup { top: calc(-1 * var(--step)); }
  sub { top: var(--step); }
  a { color: inherit; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
  a:hover { text-decoration-thickness: 2px; }
  pre, code, kbd { font-family: inherit; }
  pre, pre code { line-height: 1rlh; }
  pre {
    margin: 0; font-size: 1rem; padding: calc(1rlh - 1px) 18px;
    border: 1px solid var(--rule); background: var(--code-bg); overflow-x: auto;
  }
  img { max-width: 100%; display: block; filter: var(--img-filter, none); }
  canvas { display: block; width: 100%; height: auto; }
  hr { border: 0; border-top: 1px solid var(--rule); margin: 0; height: 1rlh; }

  /* Rustic ink mask over running text (design's Effects; static tile). */
  .rustic p, .rustic h1, .rustic h2, .rustic h3, .rustic li, .rustic blockquote, .rustic pre {
    -webkit-mask-image: ${INK_TILE}; mask-image: ${INK_TILE};
    -webkit-mask-size: 256px 256px; mask-size: 256px 256px;
    -webkit-mask-repeat: repeat; mask-repeat: repeat;
  }
  @media print {
    .rustic p, .rustic h1, .rustic h2, .rustic h3, .rustic li, .rustic blockquote, .rustic pre { mask-image: none; -webkit-mask-image: none; }
  }

  /* GRID ADDRESSES — see the design's own prose: L · C · R areas, LGC/CGR
     gutters; lowercase b/e/m makes a line (begin/end/midpoint). */
  :root {
    --grid: [Lb] minmax(40px, 1fr) 20px [Lm] 20px minmax(40px, 1fr) [Le LGCb] 20px [LGCm] 20px [LGCe Cb] minmax(0, 350px) [Cm] minmax(0, 350px) [Ce CGRb] 20px [CGRm] 20px [CGRe Rb] minmax(40px, 1fr) 20px [Rm] 20px minmax(40px, 1fr) [Re];
    --grid-header: var(--grid);
    --L: Lb / Le; --C: Cb / Ce; --R: Rb / Re; --LmRm: Lm / Rm;
    --hdr-mark: Lb / Le; --hdr-nav: Rb / Re;
    --row-flow: 1;
    --align-head: center; --align-aside: right;
    --self-mark: center; --self-nav: center;
    --page-row-gap: 0; --section-gap: 3rlh;
    --sticky-top: 2rlh; --margin-item-pos: sticky;
    --chrome-pos: sticky; --chrome-clear: 2rlh; --header-pull: -2rlh;
    --fade: 3rlh; --fade-core: 1rlh;
    --dither: linear-gradient(#000, #000);
  }
  @media (max-width: 1079px) {
    :root {
      --grid: minmax(0, 700px);
      --grid-header: minmax(0, 1fr) auto;
      --L: 1 / -1; --C: 1 / -1; --R: 1 / -1; --LmRm: 1 / -1;
      --hdr-mark: 1; --hdr-nav: 2;
      --row-flow: auto;
      --align-head: left; --align-aside: left;
      --self-mark: start; --self-nav: end;
      --page-row-gap: 1rlh; --section-gap: 2rlh;
      --margin-item-pos: static;
      --chrome-pos: static; --chrome-clear: 0px; --header-pull: 0px;
      --fade: 2rlh; --fade-core: 1rlh;
    }
  }

  .page { max-width: 1440px; margin: 0 auto; padding: 0 40px; }
  .g {
    display: grid; grid-template-columns: var(--grid); justify-content: center;
    gap: var(--page-row-gap) 0; align-items: start;
  }
  .sec { margin-top: var(--section-gap); }
  .col-C { grid-column: var(--C); grid-row: var(--row-flow); }
  .col-LmRm { grid-column: var(--LmRm); }
  .prose { display: flex; flex-direction: column; gap: 1rlh; }
  .mL, .mR {
    position: var(--margin-item-pos); top: var(--sticky-top); z-index: 5;
    grid-row: var(--row-flow); padding-top: var(--chrome-clear);
    font-size: 1rem; line-height: 1rlh;
  }
  .mL { grid-column: var(--L); }
  .mR { grid-column: var(--R); text-align: var(--align-head); opacity: 0.85; }
  .mL.aside { text-align: var(--align-aside); opacity: 0.85; }
  h2.mL { text-align: var(--align-head); padding-top: 0; }

  header.chrome {
    pointer-events: none; display: grid; grid-template-columns: var(--grid-header);
    justify-content: center; gap: var(--page-row-gap) 0;
    position: var(--chrome-pos); top: 0; z-index: 6;
    padding: 1rlh 0 0; margin-bottom: var(--header-pull);
  }
  header.chrome .mark {
    pointer-events: auto; grid-column: var(--hdr-mark); grid-row: 1;
    text-decoration: none; justify-self: var(--self-mark);
  }
  header.chrome nav {
    pointer-events: auto; grid-column: var(--hdr-nav); grid-row: 1;
    display: flex; flex-wrap: wrap; gap: 0 18px; justify-content: center;
    justify-self: var(--self-nav); align-items: baseline; font-size: 1rem;
  }
  header.chrome nav a.dim { text-decoration: none; opacity: 0.45; }
  footer.chrome {
    pointer-events: none; display: grid; grid-template-columns: var(--grid);
    justify-content: center; gap: var(--page-row-gap) 0;
    position: var(--chrome-pos); bottom: 0; z-index: 6;
    margin-top: 5rlh; padding: 1rlh 0; align-items: center;
  }
  footer.chrome .links {
    pointer-events: auto; grid-column: var(--L); grid-row: var(--row-flow);
    display: flex; flex-wrap: wrap; justify-content: center; align-items: baseline;
    gap: 0 20px; line-height: 1rlh;
  }
  footer.chrome .mark {
    pointer-events: auto; grid-column: var(--R); grid-row: var(--row-flow);
    justify-self: var(--self-nav); text-decoration: none;
  }

  /* Edge fades: surface-coloured bands driven by the document scroll timeline,
     dissolved grain-by-grain by the runtime's dither mask. */
  @keyframes fadeUp { from { opacity: 0 } to { opacity: 1 } }
  @keyframes fadeDown { from { opacity: 1 } to { opacity: 0 } }
  .fadeband { position: fixed; left: 0; right: 0; z-index: 4; pointer-events: none; opacity: 0; }
  .fade-top-core, .fade-top { top: 0; animation: fadeUp linear both; animation-timeline: scroll(root block); animation-range: 0 84px; }
  .fade-bot-core, .fade-bot { bottom: 0; animation: fadeDown linear both; animation-timeline: scroll(root block); animation-range: calc(100% - 84px) 100%; }
  .fade-top-core { height: var(--fade-core); background: linear-gradient(to bottom, var(--bg) 0%, var(--bg) 45%, transparent 100%); }
  .fade-bot-core { height: var(--fade-core); background: linear-gradient(to top, var(--bg) 0%, var(--bg) 45%, transparent 100%); }
  .fade-top {
    height: var(--fade); background: var(--bg);
    -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 30%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.35) 85%, transparent 100%), var(--dither);
    -webkit-mask-size: 100% 100%, 96px 96px; -webkit-mask-repeat: no-repeat, repeat; -webkit-mask-composite: source-in;
    mask-image: linear-gradient(to bottom, #000 0%, #000 30%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.35) 85%, transparent 100%), var(--dither);
    mask-size: 100% 100%, 96px 96px; mask-repeat: no-repeat, repeat; mask-composite: intersect;
  }
  .fade-bot {
    height: var(--fade); background: var(--bg);
    -webkit-mask-image: linear-gradient(to top, #000 0%, #000 30%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.35) 85%, transparent 100%), var(--dither);
    -webkit-mask-size: 100% 100%, 96px 96px; -webkit-mask-repeat: no-repeat, repeat; -webkit-mask-composite: source-in;
    mask-image: linear-gradient(to top, #000 0%, #000 30%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.35) 85%, transparent 100%), var(--dither);
    mask-size: 100% 100%, 96px 96px; mask-repeat: no-repeat, repeat; mask-composite: intersect;
  }

  .postlist { display: flex; flex-direction: column; }
  .postlist .row { display: flex; gap: 16px; align-items: baseline; }
  .postlist .row time { flex: none; width: 130px; font-size: 1rem; opacity: 0.45; font-variant-numeric: tabular-nums; }
  .listlabel { font-size: 1rem; font-family: inherit; opacity: 0.45; }
  figure.g { margin: var(--section-gap) 0 0; }
  figure .art { display: flex; flex-direction: column; gap: 0; }
  figcaption { font-size: 1rem; line-height: 1rlh; opacity: 0.45; }
`;

// ── Per-page scroll-timeline ducking ────────────────────────────────────────
// The chrome's opacity is a product of one registered number per margin
// timeline it can collide with: the mark answers to left-margin items, the
// nav to right-margin items, both to big-picture figures. Generated per page
// from the actual item counts — this is the part a static generator can do
// that a hand-written page cannot.
export const duckingCss = (nLeft, nRight, nBig) => {
  const L = Array.from({ length: nLeft }, (_, i) => `l${i + 1}`);
  const R = Array.from({ length: nRight }, (_, i) => `r${i + 1}`);
  const B = Array.from({ length: nBig }, (_, i) => `b${i + 1}`);
  const all = [...L, ...R, ...B];
  if (all.length === 0) return "";

  let css = `  body { timeline-scope: ${all.map((t) => `--${t}`).join(", ")}; }\n`;
  const roles = [
    ["mk", [...L, ...B], "header.chrome .mark", "exit"],
    ["nv", [...R, ...B], "header.chrome nav", "exit"],
    ["fl", [...L, ...B], "footer.chrome .links", "entry"],
    ["fr", [...R, ...B], "footer.chrome .mark", "entry"],
  ];
  for (const [role, timelines, selector, edge] of roles) {
    if (timelines.length === 0) continue;
    for (const t of timelines) {
      css += `  @property --${role}-${t} { syntax: '<number>'; inherits: false; initial-value: 1; }\n`;
      css += `  @keyframes duck-${role}-${t} { 0% { --${role}-${t}: 1 } 14% { --${role}-${t}: 0 } 86% { --${role}-${t}: 0 } 100% { --${role}-${t}: 1 } }\n`;
    }
    css += `  ${selector} {\n`;
    css += `    opacity: calc(${timelines.map((t) => `var(--${role}-${t})`).join(" * ")});\n`;
    css += `    animation-name: ${timelines.map((t) => `duck-${role}-${t}`).join(", ")};\n`;
    css += `    animation-timeline: ${timelines.map((t) => `--${t}`).join(", ")};\n`;
    css += `    animation-range: ${timelines.map(() => `${edge} 0% ${edge} 100%`).join(", ")};\n`;
    css += `    animation-fill-mode: none; animation-timing-function: linear;\n`;
    css += `  }\n`;
  }
  return css;
};

// The mark: the grid itself in miniature — two margins, a content block,
// ticks on the midpoint lines.
export const markSvg = () =>
  `<svg width="28" height="28" viewBox="0 0 40 40" fill="none" style="display:block" aria-hidden="true">` +
  `<rect x="2" y="9" width="7" height="22" fill="currentColor" opacity="0.28"/>` +
  `<line x1="5.5" y1="4" x2="5.5" y2="36" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" opacity="0.55"/>` +
  `<rect x="13" y="9" width="14" height="22" fill="currentColor" opacity="0.9"/>` +
  `<rect x="31" y="9" width="7" height="22" fill="currentColor" opacity="0.28"/>` +
  `<line x1="34.5" y1="4" x2="34.5" y2="36" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" opacity="0.55"/>` +
  `</svg>`;

// ── Client runtime (progressive enhancement) ────────────────────────────────
// Grain + dither generation, baseline measurement, rhythm snapping, the
// plotter art, and the theme toggle. Without it the page is a clean static
// sheet: flat ground, default baseline, no art, system theme only.
// Written without template literals so it can live inside one.
export const RUNTIME_JS = `
(function () {
  'use strict';
  var root = document.documentElement;

  // theme toggle, persisted per viewer
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}
  function currentDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }
  var toggle = document.getElementById('theme-toggle');
  function labelTheme() { if (toggle) toggle.textContent = currentDark() ? 'Light' : 'Dark'; }
  if (toggle) toggle.addEventListener('click', function (e) {
    e.preventDefault();
    var next = currentDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (err) {}
    refresh();
  });

  function cssVar(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }

  // grain: a noise tile in the surface's tint, repeated behind everything
  function grainURL() {
    var amount = parseFloat(cssVar('--grain-amount')) || 0.035;
    var tint = cssVar('--grain-tint').split(',').map(Number);
    var n = 160, c = document.createElement('canvas');
    c.width = n; c.height = n;
    var g = c.getContext('2d'), img = g.createImageData(n, n), d = img.data;
    for (var i = 0; i < n * n; i++) {
      var v = Math.random();
      var a = v > 0.5 ? (v - 0.5) * 2 * amount * 255 : 0;
      d[i * 4] = tint[0]; d[i * 4 + 1] = tint[1]; d[i * 4 + 2] = tint[2]; d[i * 4 + 3] = a;
    }
    g.putImageData(img, 0, 0);
    return 'url(' + c.toDataURL() + ')';
  }

  // dither: full-range noise used as a second mask layer on the edge fades
  var ditherCache = null;
  function ditherURL() {
    if (ditherCache) return ditherCache;
    var n = 96, c = document.createElement('canvas');
    c.width = n; c.height = n;
    var g = c.getContext('2d'), img = g.createImageData(n, n), d = img.data;
    for (var i = 0; i < n * n; i++) {
      d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 0;
      d[i * 4 + 3] = Math.round(Math.random() * 255);
    }
    g.putImageData(img, 0, 0);
    ditherCache = 'url(' + c.toDataURL() + ')';
    return ditherCache;
  }

  // headings ride their own line box; measure where the glyph baseline sits
  // and shift each role so it lands on the shared grid line
  function baselineOf(css) {
    var probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;left:-9999px;white-space:nowrap;' + css;
    var strut = document.createElement('span');
    strut.style.cssText = 'display:inline-block;width:0;height:0';
    probe.appendChild(document.createTextNode('Hxg'));
    probe.appendChild(strut);
    document.body.appendChild(probe);
    var off = strut.getBoundingClientRect().bottom - probe.getBoundingClientRect().top;
    probe.remove();
    return off;
  }
  function measureBaseline() {
    var LH = parseFloat(getComputedStyle(root).lineHeight) || 28;
    var base = baselineOf('font:inherit;line-height:' + LH + 'px');
    [['--title-shift', 40, 2], ['--head-shift', 26, 2], ['--sub-shift', 20, 1]].forEach(function (role) {
      var box = LH * role[2];
      var off = baselineOf("font-family:'Young Serif',Georgia,serif;font-weight:400;font-size:" + role[1] + 'px;line-height:' + box + 'px');
      var target = base + LH * (role[2] - 1);
      root.style.setProperty(role[0], (target - off).toFixed(2) + 'px');
    });
  }

  // intrusions (code blocks, figures) rarely land on whole baselines; pad
  // them out so the text after them returns on beat
  function snapRhythm() {
    var LH = parseFloat(getComputedStyle(root).lineHeight) || 28;
    var els = document.querySelectorAll('pre, figure');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.dataset.basePad) el.dataset.basePad = String(parseFloat(getComputedStyle(el).paddingBottom) || 0);
      var base = parseFloat(el.dataset.basePad);
      el.style.paddingBottom = base + 'px';
      var h = el.getBoundingClientRect().height;
      var extra = (LH - (h % LH)) % LH;
      if (extra > 0.01) el.style.paddingBottom = (base + extra) + 'px';
    }
  }

  // plotter art: a flow field sampled on a grid, one continuous stroke per
  // seed point, in the surface's ink
  function paintFlow(el) {
    var W = el.clientWidth || 520;
    var LH = 28;
    var H = Math.round(Math.min(W * 0.55, 420) / LH) * LH;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    el.width = W * dpr; el.height = H * dpr;
    el.style.height = H + 'px';
    var ctx = el.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var ink = 'rgba(' + cssVar('--ink-rgb') + ',';
    var glow = cssVar('--glow');
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (glow && glow !== 'none') { ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = glow; ctx.shadowBlur = 3; }
    function field(x, y) {
      return Math.sin(x * 0.0075) * Math.cos(y * 0.0062) * 2.4 + Math.sin((x + y) * 0.0031) * 1.6;
    }
    var step = 3, len = 220;
    for (var sy = -20; sy < H + 20; sy += 9) {
      for (var sx = -20; sx < W + 20; sx += 26) {
        var x = sx, y = sy;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (var k = 0; k < len; k++) {
          var a = field(x, y) + (Math.random() - 0.5) * 0.02;
          x += Math.cos(a) * step; y += Math.sin(a) * step;
          if (x < -40 || x > W + 40 || y < -40 || y > H + 40) break;
          ctx.lineTo(x, y);
        }
        ctx.lineWidth = 0.38 + Math.random() * 0.22;
        ctx.strokeStyle = ink + (0.14 + 0.14 * Math.sin(sy * 0.02) + Math.random() * 0.05) + ')';
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    var amount = parseFloat(cssVar('--grain-amount')) || 0.035;
    var n = Math.round(W * H * 0.0009 * (amount > 0.045 ? 1.4 : 1));
    for (var i = 0; i < n; i++) {
      var px = Math.random() * W, py = Math.random() * H;
      var r = Math.random() * 0.7 + 0.15;
      ctx.fillStyle = ink + (Math.random() * 0.16 + 0.03) + ')';
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
    }
  }

  function refresh() {
    document.body.style.backgroundImage = grainURL();
    root.style.setProperty('--dither', ditherURL());
    labelTheme();
    var arts = document.querySelectorAll('canvas[data-art]');
    for (var i = 0; i < arts.length; i++) paintFlow(arts[i]);
  }

  measureBaseline();
  refresh();
  snapRhythm();
  window.addEventListener('resize', function () { refresh(); snapRhythm(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measureBaseline(); snapRhythm(); });
  setTimeout(function () { measureBaseline(); snapRhythm(); }, 300);
})();
`;
