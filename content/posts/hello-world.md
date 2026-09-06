---
title: Hello, world
date: 2026-08-29
slug: hello-world
note: The first post on a site that is itself the experiment it describes.
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

## Why a reconciler

A build tool asks "what should I run?"; a reconciler asks "what should
*exist*?" The output directory is the tracked state, so stray files get
pruned, hand edits get healed, and deleting everything just costs one
rebuild.

More on how that works in future posts.
