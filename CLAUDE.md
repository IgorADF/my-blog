# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Astro dev server at `localhost:4321`
- `npm run build` — static build to `./dist/`
- `npm run preview` — preview the production build
- `npm run astro -- --help` — Astro CLI (use `npm run astro check` for type checking; there is no separate `lint`/`test` script)

Requires Node >=22.12.0.

## Architecture

Astro 6 site with `output: 'static'` (`astro.config.mjs`), so all pages under `src/pages/` are pre-rendered at build time. Dynamic routes like `src/pages/[slug]/index.astro` must export `getStaticPaths()` listing every slug to generate — no runtime catch-all.

React is wired in via the `@astrojs/react` integration so `.tsx` components can be used inside `.astro` files (ship with a client directive when interactivity is needed). Tailwind v4 is loaded through the `@tailwindcss/vite` plugin rather than a PostCSS config.

### Styling / UI

- Single entry stylesheet: `src/styles/global.css`. It imports `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`, and the Geist variable font, then declares the full shadcn design-token palette (CSS variables in `:root` / `.dark`) and maps them through `@theme inline` so Tailwind utilities like `bg-background` resolve to those tokens. Every layout/page currently re-imports this file at the top of its frontmatter.
- shadcn/ui is configured via `components.json` with style `base-nova`, base color `neutral`, lucide icons, and these aliases: `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`. Primitives come from `@base-ui/react` (not Radix) — see `src/components/ui/button.tsx` for the expected pattern: `cva` for variants, `cn()` from `@/lib/utils` to merge classes, and `data-slot` attributes for styling hooks.
- The `@/*` path alias is defined in `tsconfig.json` (which extends `astro/tsconfigs/strict`, `jsx: react-jsx`).

### Layouts / components

`src/layouts/Layout.astro` is the HTML shell with a single `<slot />`. `Header.astro` is currently a duplicate of `Layout.astro` (placeholder, not yet a real header). Page components live in `src/pages/`, shared pieces in `src/components/`, shadcn primitives in `src/components/ui/`.
