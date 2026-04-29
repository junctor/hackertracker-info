# info.defcon.org

[![version](https://img.shields.io/badge/version-34.x-blue.svg)](https://github.com/junctor/hackertracker-info)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Official static schedule and event guide for DEF CON. The site browses talks, villages, workshops, people, organizations, announcements, documents, and related conference data from pre-generated JSON exports.

## Overview

`info.defcon.org` is a fully static Vite+ React app. Conference data is generated ahead of time and served from `public/ht/<conference-slug>/`; the app loads that data client-side and stores bookmarks in browser `localStorage`.

## Stack

- Vite+
- React 19
- React Router
- TypeScript
- Tailwind CSS 4
- SWR
- react-virtuoso
- react-markdown with remark-gfm
- GSAP
- Heroicons

## Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite+.

Conference slugs are defined in `src/lib/conferences.ts`. Static conference data is expected under `public/ht/<conference-slug>/`.

## Build

```bash
npm run build
npm run preview
```

Production output is generated in `dist/`.

## Hosting

The app is static-hosting compatible and does not require a Node server. Deploy the contents of `dist/`.

The build runs a post-build route generation step that creates route-based `index.html` files, including conference route entries, so direct navigation and refreshes work on static hosts without rewrite rules.

## CSP

Strict CSP compatibility is required. Keep production output compatible with:

- no inline scripts
- no inline styles or `style=""` attributes
- no inline event handlers
- no service workers, workers, frames, manifests, or object embeds
- no external resources except explicitly allowed data endpoints such as `https://firestore.googleapis.com/`

## Static Data Export

Conference JSON is produced by the companion exporter:

https://github.com/junctor/info-export

Typical data layout:

```text
public/ht/<conference-slug>/
  entities/
  indexes/
  views/
  derived/
  manifest.json
```

Common export copy workflow:

```bash
cp -r out/ht ../hackertracker-info/public
```

Exports must match the schemas expected by the app.

## Project Structure

```text
src/
  routes/       React Router route components
  features/     Domain modules
  components/   Shared UI components
  lib/          Conference config, utilities, types
  styles/       Global styles

public/
  ht/           Exported conference JSON data
  images/       Site and conference images
  fonts/        Local web fonts
```

## Validation

```bash
npm run build
npm run lint
npm run format:check
```

## License

MIT
