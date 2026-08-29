# Personal Blog (esto site builder)

A personal blog whose static site builder is an experiment on the optative/esto reconciler ecosystem: pages are reconciled items, the output directory is the tracked state, and builds are incremental by construction.

## Language

**Build Signature**:
The hash of the full props that reached an output file's render — and props are the *only* input a render is allowed to have (same signature ⇒ byte-identical output, by construction). Code identity is not exempt: the hash of the rendering code itself flows in as a prop like any other data.
_Avoid_: input configuration, cache key, input hash

**Page**:
The blog's own reconciled unit (userland, defined in this repo — not `esto/fs`'s `File`). Its key is the output path, its value is the Build Signature, and its enter/update perform the render — so rendering only happens for pages whose signature moved.
_Avoid_: File (that's the eager esto/fs builtin), route, document

**Output Directory**:
The directory the Page unit owns completely (v1: local `dist/`). Every file in it is either a claimed, verified output or gets pruned; it is fully derived and disposable — deleting it entirely just costs one full rebuild.
_Avoid_: build folder, public, site

**Render**:
A pure function from props to output bytes, in the tauler sense — no ambient reads, no clock, no environment. Skipping a render is sound only because renders are pure.
_Avoid_: build step, template expansion

**Minimal Props**:
Pages receive only the data their render actually uses (the index gets post metadata, never post bodies). Signature granularity equals prop granularity, so narrow props are what make skipping effective.
_Avoid_: passing everything down, global context

**Signature Sidecar**:
A small metadata file stored next to each output file, recording the Build Signature that produced it and the hash of the output itself. Sidecars are published with the site; they are per-file (not a central manifest) so concurrent builds only conflict where the same page actually changed.
_Avoid_: metadata file, manifest, meta file

**Up-to-date**:
A page is up-to-date iff its Signature Sidecar's Build Signature matches the current inputs AND its recorded output hash matches the file on disk. Anything else — missing file, missing sidecar, tampered output, tampered sidecar — is rebuilt or pruned on the next pass; hand edits are never trusted.
_Avoid_: cached, fresh, clean
