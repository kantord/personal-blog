# Per-file Signature Sidecars instead of a central build manifest

Each output file gets a sidecar (`<file>.sig.json`) recording its Build Signature components and the hash of its own bytes; `observe()` re-verifies both every pass. A single manifest file would be touched by *every* build, so any two divergent builds (e.g. two machines pushing to the same gh-pages branch) would conflict on it every time — sidecars only conflict where the same page genuinely changed, in which case the page itself conflicts anyway.

The sidecars are trusted only as far as they verify: a page is up-to-date iff the sidecar's signature matches the desired one AND its recorded output hash matches the file on disk. Tampered outputs, tampered sidecars, orphaned sidecars, and stray files all converge back to desired state on the next pass — hand edits are never preserved. Consequence: sidecars are published alongside the site; that is accepted (they leak nothing — hashes only).
