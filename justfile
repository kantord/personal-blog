port := "8000"

# list recipes
default:
    @just --list

# incremental build into dist/
build:
    esto run builder/build.op.tsx

# build, then serve dist/ locally
dev: build serve

# serve dist/ at http://localhost:{{port}}
serve:
    python3 -m http.server {{port}} -d dist

# delete dist/ (it is fully derived) and build from scratch
rebuild: clean build

# delete dist/
clean:
    rm -rf dist

# typecheck the build script (regenerates esto.d.ts / tsconfig.esto.json)
check:
    esto type-check

# show what a build would change, without doing it
diff:
    esto run --dry-run builder/build.op.tsx || true
