---
title: Hello, world
date: 2026-08-29
slug: hello-world
---

This blog is its own experiment: the site you are reading is built by a
[reconciler](https://github.com/kantord/optative), not a build tool.

Every page is a *desired item* — its key is the output path, its value is a
hash of everything that influenced it. The builder diffs that desired set
against what is already on disk and only renders what actually changed.

```text
edit one post   → one page rebuilds
edit a template → everything rebuilds
edit nothing    → nothing happens at all
```

More on how that works in future posts.
