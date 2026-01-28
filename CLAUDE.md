---
description: Use Bun instead of Node.js, npm, pnpm, or vite.
globs: '*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json'
alwaysApply: false
---

# How Terminals Work

An interactive guide that teaches people how terminals work. The site walks readers through terminal concepts with hands-on demos they can interact with directly in the browser.

## Project Philosophy

- **Educational**: Every section teaches a concept, not just shows it
- **Interactive**: Readers learn by doing—clicking, typing, hovering
- **Progressive**: Concepts build on each other (grid → cells → escape sequences → input → round trip → advanced TUIs)
- **Demystifying**: Show the underlying mechanics that make terminals feel magical

## Content Structure

Each section has:

- A number and title
- An "insight" summary that captures the key takeaway
- An interactive demo component

Current sections:

1. **The Grid Model** - Terminals are grids of fixed-size cells
2. **What's in a Cell?** - Character + styling (color, bold, underline)
3. **Escape Sequences** - Special byte sequences that control the terminal
4. **Input Goes Both Ways** - Keyboard and mouse input as byte streams
5. **The Round Trip** - How data flows through the terminal stack
6. **Building Complex TUIs** - Layouts, regions, and resize behavior
7. **Terminal Icons** - Nerd Fonts and the Private Use Area

## Adding New Sections

When adding a new section:

1. Create a demo component in `src/components/`
2. Add it to `src/App.tsx` with a `<Section>` wrapper
3. Include a clear "insight" that summarizes the key concept
4. Make the demo interactive—let readers explore, not just observe

## Development

**The dev server is always running.** Do not try to start it—it's already running on port 3000. Just make changes and they'll hot reload.

To build for production: `bun run build`

## Verification

After making changes:
- `bun run build` - Production build
