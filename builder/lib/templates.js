// Renders are pure: props in, bytes out. No clock, no environment, no
// ambient reads — see CONTEXT.md "Render". Anything a template needs must
// arrive as an argument, so it is covered by the Build Signature.
import { marked } from "./marked.esm.js";

const CSS = `
  :root { color-scheme: light dark; }
  body {
    max-width: 42rem; margin: 0 auto; padding: 2rem 1rem;
    font: 1rem/1.6 system-ui, sans-serif;
  }
  h1 { line-height: 1.2; }
  time { color: color-mix(in srgb, currentColor 55%, transparent); }
  ul.posts { list-style: none; padding: 0; }
  ul.posts li { margin: 0.75rem 0; }
  pre { overflow-x: auto; padding: 1rem; background: color-mix(in srgb, currentColor 8%, transparent); }
  code { font-family: ui-monospace, monospace; }
  a { color: inherit; }
`;

const page = (title, body) =>
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${CSS}</style>
</head>
<body>
${body}
</body>
</html>
`;

export const renderPost = (post) =>
  page(
    post.title,
    `<nav><a href="../../">← all posts</a></nav>
<article>
<h1>${post.title}</h1>
<time datetime="${post.date}">${post.date}</time>
${marked.parse(post.body)}
</article>`,
  );

export const renderIndex = (posts) =>
  page(
    "Daniel Kantor",
    `<h1>Daniel Kantor</h1>
<ul class="posts">
${posts
  .map(
    (p) =>
      `<li><a href="posts/${p.slug}/">${p.title}</a> <time datetime="${p.date}">${p.date}</time></li>`,
  )
  .join("\n")}
</ul>`,
  );
