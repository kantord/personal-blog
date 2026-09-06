// Renders are pure: props in, bytes out. No clock, no environment, no
// ambient reads — see CONTEXT.md "Render". Anything a template needs must
// arrive as an argument, so it is covered by the Build Signature.
//
// The visual system is a port of the "Blog v2" design canvas (see
// builder/lib/design.js): named grid, surfaces, baseline rhythm, ducking
// chrome. Section headings are lifted out of the running markdown into the
// left margin, and each margin item gets its own scroll timeline — the
// timeline CSS is generated per page from the real section count.
import { marked } from "./marked.esm.js";
import { BASE_CSS, duckingCss, markSvg, OVERLAY_HTML, RUNTIME_JS } from "./design.js";

const SITE_TITLE = "Daniel Kantor";

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const page = ({ title, duck, body, root }) =>
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@300..700&family=Young+Serif&display=swap" rel="stylesheet">
<style>
${BASE_CSS}
${duck}
</style>
</head>
<body class="rustic">
<div class="fadeband fade-top-core"></div>
<div class="fadeband fade-top"></div>
<div class="fadeband fade-bot-core"></div>
<div class="fadeband fade-bot"></div>
${OVERLAY_HTML}
<div class="page">
<header class="chrome">
  <a class="mark" href="${root}" aria-label="Home">${markSvg()}</a>
  <nav>
    <a href="${root}">Posts</a>
    <a href="#" class="dim" id="theme-toggle">Theme</a>
    <a href="#" class="dim" id="effects-toggle">Effects on</a>
    <a href="#" class="dim" id="grid-toggle" style="display: var(--grid-link);">Grid</a>
  </nav>
</header>
${body}
<footer class="chrome">
  <div class="links">
    <a href="https://github.com/kantord">GitHub</a>
  </div>
  <a class="mark" href="${root}" aria-label="Home">${markSvg()}</a>
</footer>
</div>
<script>${RUNTIME_JS}</script>
</body>
</html>
`;

const tl = (name) => `view-timeline-name: --${name}; view-timeline-axis: block;`;

// Split rendered markdown at its h2 boundaries: the lead runs under the
// title; each later section carries its heading into the left margin.
const splitSections = (html) => {
  const parts = html.split(/(?=<h2)/);
  const lead = parts[0] || "";
  const sections = parts.slice(1).map((chunk) => {
    const m = chunk.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/);
    return {
      heading: m ? m[1] : "",
      body: m ? chunk.slice(m[0].length) : chunk,
    };
  });
  return { lead, sections };
};

export const renderPost = (post) => {
  const { lead, sections } = splitSections(marked.parse(post.body));
  const hasNote = Boolean(post.note);
  let left = 0;

  const aside = hasNote
    ? `<aside class="mL aside" style="${tl(`l${++left}`)}">${esc(post.note)}</aside>`
    : "";

  const main = `<main class="g">
  ${aside}
  <div class="col-C prose">
    <h1>${esc(post.title)}</h1>
    ${lead}
  </div>
  <div class="mR" style="${tl("r1")}"><time datetime="${esc(post.date)}">${esc(post.date)}</time></div>
</main>`;

  const rest = sections
    .map(
      (s) => `<section class="g sec">
  <h2 class="mL" style="${tl(`l${++left}`)}">${s.heading}</h2>
  <div class="col-C prose">${s.body}</div>
</section>`,
    )
    .join("\n");

  return page({
    title: `${post.title} · ${SITE_TITLE}`,
    duck: duckingCss(left, 1, 0),
    root: "../../",
    body: `${main}\n${rest}`,
  });
};

export const renderIndex = (posts) => {
  const rows = posts
    .map(
      (p) => `<div class="row">
  <time datetime="${esc(p.date)}">${esc(p.date)}</time>
  <a href="posts/${esc(p.slug)}/">${esc(p.title)}</a>
</div>`,
    )
    .join("\n");

  const body = `<main class="g">
  <aside class="mL aside" style="${tl("l1")}">A blog built by a reconciler: every page is a desired item, and only what changed gets re-rendered.</aside>
  <div class="col-C prose">
    <div class="prose">
      <h1>${esc(SITE_TITLE)}</h1>
      <p>Notes on software — reconcilers, build systems, and the small behaviours that make a page feel deliberate.</p>
    </div>
    <div>
      <h3 class="listlabel">Posts</h3>
      <div class="postlist">
${rows}
      </div>
    </div>
  </div>
</main>
<figure class="g sec">
  <div class="col-LmRm art" style="${tl("b1")}">
    <canvas data-art></canvas>
    <figcaption>A flow field, sampled on a grid, one continuous stroke per seed point.</figcaption>
  </div>
</figure>`;

  return page({
    title: SITE_TITLE,
    duck: duckingCss(1, 0, 1),
    root: "./",
    body,
  });
};
