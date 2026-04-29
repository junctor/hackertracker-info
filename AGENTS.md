<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.

<!--VITE PLUS END-->

## Project Architecture

- This is a Vite+ React app using React Router for client-side routes.
- Route components live under `src/routes`; shared UI and domain logic live under `src/components`, `src/features`, and `src/lib`.
- Conference data is loaded client-side from static JSON under `public/ht/<conference-slug>/`.
- Static route entry files are generated after build so direct navigation works on static hosts without rewrite rules.

## Commands

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build production assets: `npm run build`
- Preview production build: `npm run preview`

## Constraints

- Preserve existing URL structure and trailing slash behavior.
- Keep the app compatible with static hosting; do not add server-only assumptions.
- Maintain strict CSP compatibility: no inline scripts, no inline styles, and no external resources beyond allowed data endpoints.
- Do not reintroduce Next.js, Pages Router APIs, or build/export commands.
