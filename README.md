# personal-blog

A personal blog, and an experiment: the static site builder is a script on the
[optative/esto](https://github.com/kantord/optative) reconciler ecosystem.
Pages are desired items, `dist/` is the tracked state, and builds are
incremental by construction — the reconciler only renders pages whose
Build Signature moved.

```sh
esto run builder/build.op.tsx   # from the repo root
```

Run it twice: the second run reports `0 enter, 0 update, 0 exit` and touches
nothing. Edit a post body and exactly one page rebuilds; edit a post title and
that page plus the index rebuild; edit anything under `builder/` and the whole
site rebuilds. Stray or hand-edited files in `dist/` are healed or pruned on
the next pass — `dist/` is fully derived and disposable.

- `content/posts/*.md` — posts (markdown + flat `key: value` frontmatter)
- `builder/build.op.tsx` — the build script (the `Page` unit lives here)
- `builder/lib/` — vendored [marked](https://github.com/markedjs/marked),
  frontmatter parser, HTML templates
- `CONTEXT.md` — the vocabulary (Build Signature, Signature Sidecar, Page, …)
- `docs/adr/` — the load-bearing decisions

Type checking: `esto type-check` (regenerates `esto.d.ts` / `tsconfig.esto.json`).
