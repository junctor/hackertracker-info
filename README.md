# info.defcon.org

Official DEF CON schedule and event guide, published as static files.

[![version](https://img.shields.io/badge/version-34.x-blue.svg)](https://github.com/junctor/hackertracker-info)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vite+ / Vite 8](https://img.shields.io/badge/Bundler-Vite%2B%20%2F%20Vite_8-646CFF.svg)](https://viteplus.dev/)
[![React 19](https://img.shields.io/badge/Framework-React_19-61DAFB.svg)](https://react.dev/)
[![TypeScript 6](https://img.shields.io/badge/Language-TypeScript_6-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Styling-Tailwind_4-38BDF8.svg)](https://tailwindcss.com/)

`info.defcon.org` is the static web guide for DEF CON conference information. It browses talks, villages, workshops, contests, people, organizations, announcements, documents, and related event data from pre-generated JSON exports.

The app is a fully static Vite+ React application using React Router. Conference data is generated ahead of time, served from `public/ht/<conference-slug>/`, loaded client-side, and cached by the browser. Bookmarks are stored locally with browser `localStorage`.

## Table of Contents

- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Static Hosting](#static-hosting)
- [Strict CSP](#strict-csp)
- [Static Data Export](#static-data-export)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

## Built With

- Application
  - React 19
  - React Router
  - TypeScript 6
- Build and validation
  - Vite+ on Vite 8 tooling
  - Vite+ scripts through `vp`
  - TypeScript project builds
  - Post-build static route generation
- Styling and content
  - Tailwind CSS 4
  - Local fonts and images from `public/`
  - `react-markdown` with `remark-gfm`
  - Heroicons
  - GSAP
- Data and runtime behavior
  - Static JSON exports under `public/ht/<conference-slug>/`
  - SWR-based data loading
  - `react-virtuoso` for large lists
  - Browser `localStorage` for bookmarks

## Getting Started

### Prerequisites

- Node.js compatible with the Vite+ toolchain.
- npm, as declared by `packageManager` in `package.json`.

### Installation

```bash
git clone https://github.com/junctor/hackertracker-info.git
cd hackertracker-info
vp install
```

### Development

```bash
vp dev
```

Open the local URL printed by Vite. Conference slugs are defined in `src/lib/conferences.ts`, and matching static data is expected under `public/ht/<conference-slug>/`.

### Production Build

```bash
vp run build
```

Production assets are written to `dist/`.

To inspect the built site locally:

```bash
vp preview
```

### Linting, Formatting, and Validation

```bash
vp check
vp lint
vp fmt --check
```

To apply formatter changes:

```bash
vp fmt
```

## Static Hosting

The app is static-hosting compatible and does not require a Node server at runtime. Deploy the contents of `dist/`.

After `vp run build`, the `postbuild` script runs `scripts/generate-static-routes.mjs`. It creates route-based `index.html` files, including conference route entries, so direct navigation and refreshes work on static hosts without rewrite rules.

## Strict CSP

Strict CSP compatibility is required. Keep production output compatible with:

- no inline scripts
- no inline styles or `style=""` attributes
- no inline event handlers
- no service workers, workers, frames, manifests, or object embeds
- no external resources except explicitly allowed data endpoints

## Static Data Export

Conference JSON is produced by the companion exporter: [junctor/info-export](https://github.com/junctor/info-export).

Typical local workflow:

```bash
git clone https://github.com/junctor/info-export.git
cd info-export
npm install
npm run export -- --conf DEFCON34 --out ./out/ht
cp -R out/ht/defcon34 ../hackertracker-info/public/ht/
```

Typical data layout:

```text
public/ht/<conference-slug>/
  manifest.json
  entities/
  indexes/
  views/
  derived/
```

The app expects exported artifacts to match the schemas in `src/lib/types/ht-types/`. Referenced data files include:

- `indexes/eventsByDay.json`
- `indexes/eventsByTag.json`
- `derived/tagIdsByLabel.json`

## Project Structure

```text
src/
  routes/       React Router route components
  features/     Domain feature modules
  components/   Shared UI components
  lib/          Conference config, data loading, utilities, and types
  styles/       Global styles

public/
  ht/           Exported conference JSON data
  images/       Site and conference images
  fonts/        Local web fonts
```

## Contributing

Keep changes scoped and static-hosting friendly. Before opening a PR, run the relevant validation commands, preserve the existing URL and trailing-slash behavior, and avoid changes that weaken strict CSP compatibility.

When updating data contracts, keep `hackertracker-info` and `info-export` aligned so generated JSON continues to match the app's expected schemas.

## Team

Hacker Tracker is maintained by a small group of volunteers:

- [Advice-Dog](https://github.com/Advice-Dog) – Android lead
- [aNullValue](https://github.com/aNullValue) – Project lead & ConfMgr
- [cak](https://github.com/cak) – Web lead
- [sethlaw](https://github.com/sethlaw) – iOS lead

## License

MIT

`info.defcon.org` is part of the Hacker Tracker project family for DEF CON attendees.
