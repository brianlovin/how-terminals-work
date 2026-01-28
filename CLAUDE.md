# How Terminals Work

Interactive guide teaching how terminals work with hands-on demos.

## Philosophy

- **Educational**: Teach concepts, not just show them
- **Interactive**: Learn by doing—clicking, typing, hovering
- **Progressive**: Concepts build on each other
- **Demystifying**: Show the underlying mechanics

## Development

**The dev server is always running on port 3000.** Do not start it manually.
Changes hot-reload automatically.

## Adding New Sections

1. Create a demo component in `src/components/`
2. Add it to `src/App.tsx` with a `<Section>` wrapper
3. Include an "insight" that summarizes the key concept
4. Make the demo interactive—let readers explore, not just observe

## Verification

After making changes:
- `bun run build` - Production build
