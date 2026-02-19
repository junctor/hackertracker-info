# info.defcon.org

[![version](https://img.shields.io/badge/version-34.x-blue.svg)](https://github.com/junctor/hackertracker-info) [![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE) [![Next.js](https://img.shields.io/badge/platform-Next.js-black.svg?logo=next.js)](https://nextjs.org)

> **Official schedule and event guide for DEF CON.** Explore talks, villages, workshops, and more.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Static Data Export](#static-data-export)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

- **Framework:** Next.js (Pages Router, static export)
- **Language:** React 19 & TypeScript 5
- **Styling:** Tailwind CSS 4
- **Icons:** Heroicons
- **Data Fetching:** SWR
- **Virtualization:** react-virtuoso
- **Markdown Rendering:** react-markdown & remark-gfm
- **Animations:** GSAP

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.9.0
- **npm**

### Installation

```bash
git clone https://github.com/junctor/hackertracker-info.git
cd hackertracker-info
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Generate a static site:

```bash
npm run build
```

The output will be in the `out` directory.

### Linting & Formatting

```bash
npm run lint
npm run lint:fix
npm run format
```

## Static Data Export

This project relies on pre-generated JSON from the companion exporter:

[https://github.com/junctor/info-export](https://github.com/junctor/info-export)

### Export workflow

1. Clone and install:

```bash
git clone https://github.com/junctor/info-export.git
cd info-export
npm install
```

2. Run export:

```bash
npm run export -- DEFCON33
```

3. Copy output into this project:

```bash
cp -r out/ht ../hackertracker-info/public
```

### Data expectations

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

This app depends on precomputed indexes such as:

- `indexes/eventsByDay.json`
- `indexes/eventsByTag.json`
- `derived/tagIdsByLabel.json`

Exports must match the expected schema used by the app.

## Project Structure

```
src/
  pages/        # Next.js routes
  features/     # Domain modules (home, schedule, app-shell, etc)
  components/   # Shared UI components
  lib/          # Utilities, types, config
  styles/       # Global styles
public/
  ht/           # Exported conference data
```

## Contributing

Contributions, issues, and feature requests are welcome. Open an issue or submit a pull request.

## License

MIT
