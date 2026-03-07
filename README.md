# info.defcon.org

[![version](https://img.shields.io/badge/version-34.x-blue.svg)](https://github.com/junctor/hackertracker-info)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/platform-Next.js-black.svg?logo=next.js)](https://nextjs.org)

> **Official schedule and event guide for DEF CON.**
> Browse talks, villages, workshops, people, organizations, and more across DEF CON conferences.

`info.defcon.org` is a fully static Next.js site that renders DEF CON conference data from pre-generated JSON exports. The site requires no runtime backend and can be deployed to any static hosting platform.

---

# Table of Contents

- [Why this exists](#why-this-exists)
- [Verified capabilities](#verified-capabilities)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Static Data Export](#static-data-export)
- [Project Structure](#project-structure)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

# Why this exists

DEF CON conference data originates from the HackerTracker ecosystem and related internal sources. This project provides a **fast, static, easily browsable interface** for that data without requiring a runtime API or database.

All data is generated ahead of time and served as static JSON files.

---

# Verified capabilities

The site currently supports:

- Conference-specific routes under `/<conference>/`
  - Example: `/defcon34/`, `/dcsg2026/`
- Schedule browsing and filtering
- Tags, people, organizations, and announcements
- Conference documents (`readme.nfo`)
- Bookmarks stored in browser localStorage
- Companion apps pages
- Client-side loading of conference data
- Static export builds for deployment to CDN/static hosts

Conference data is loaded client-side from:

```

/public/ht/<conference-slug>/

```

---

# Tech Stack

- **Framework:** Next.js (Pages Router, static export)
- **Language:** React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4
- **Icons:** Heroicons
- **Data Fetching:** SWR
- **Virtualization:** react-virtuoso
- **Markdown Rendering:** react-markdown + remark-gfm
- **Animations:** GSAP
- **Linting:** oxlint
- **Formatting:** oxfmt

---

# Getting Started

## Prerequisites

- Node.js ≥ 20.9.0
- npm

---

## Installation

```bash
git clone https://github.com/junctor/hackertracker-info.git
cd hackertracker-info
npm install
```

---

## Local Development

Start the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

Notes:

- Conference slugs are defined in `src/lib/conferences.ts`
- Data is loaded from `public/ht/<conference-slug>/`

---

## Production Build

Generate a static site:

```bash
npm run build
```

Output will be generated in:

```
out/
```

Deploy the contents of this directory to any static host (Cloudflare Pages, Netlify, S3, Apache, etc).

---

## Linting and Formatting

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

---

# Static Data Export

This project depends on **pre-generated JSON exports** produced by a companion repository:

[https://github.com/junctor/info-export](https://github.com/junctor/info-export)

The exporter transforms raw conference data into structured JSON used by this site.

---

## Export workflow

Clone and install the exporter:

```bash
git clone https://github.com/junctor/info-export.git
cd info-export
npm install
```

Run the export:

```bash
npm run export -- DEFCON33
```

Copy the output into this project:

```bash
cp -r out/ht ../hackertracker-info/public
```

---

## Data expectations

Each conference is served from:

```
/public/ht/<conference-slug>/
```

Typical structure:

```
entities/
indexes/
views/
derived/
manifest.json
```

Important precomputed indexes include:

- `indexes/eventsByDay.json`
- `indexes/eventsByTag.json`
- `derived/tagIdsByLabel.json`

Exports **must match the schema expected by the application**.

---

# Project Structure

```
src/
  pages/        Next.js routes
  features/     Domain modules (schedule, home, organizations, etc)
  components/   Shared UI components
  lib/          Conference config, utilities, types
  styles/       Global styles

public/
  ht/           Exported conference JSON data
  images/       Site and conference images
  fonts/        Local web fonts
```

---

# Deployment Notes

This project is configured for **static export**, not server rendering.

Key configuration lives in:

```
next.config.ts
```

Important settings:

- `output: "export"`
- `trailingSlash: true`
- `images.unoptimized: true`

Implications:

- All routes generate static directories (`/path/`)
- No Node server is required
- No Next.js image optimization service is required

---

# Troubleshooting

### "Loading Conference Data" never resolves

Verify:

```
public/ht/<conference-slug>/
```

exists and includes:

```
entities/
indexes/
views/
derived/
manifest.json
```

---

### 404 on conference routes

Confirm the slug exists in:

```
src/lib/conferences.ts
```

---

### Bookmarks page empty

Bookmarks are stored in browser localStorage under:

```
bookmarks
```

Clear or re-add them if needed.

---

# Contributing

Contributions, issues, and improvements are welcome.

Before submitting a PR:

```bash
npm run lint
npm run format:check
```

---

# License

MIT
