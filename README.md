# info.defcon.org

[![version](https://img.shields.io/badge/version-33.1.0-blue.svg)](https://www.npmjs.com/package/ht-info) [![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE) [![Next.js](https://img.shields.io/badge/platform-Next.js-black.svg?logo=next.js)](https://nextjs.org)

> **Official schedule and event guide for DEF CON Bahrain 2025.** Explore talks, villages, workshops, and more at your fingertips.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Static Data Export](#static-data-export)
- [Team](#team)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

- **Framework:** Next.js 15.3.2
- **Language:** React 19 & TypeScript 5
- **Styling:** Tailwind CSS 4 & shadcn/ui
- **UI Components:** Radix UI & Lucide icons
- **Data Fetching:** SWR
- **Search:** cmdk
- **Markdown Rendering:** react-markdown & remark-gfm
- **Animations:** GSAP
- **Utilities:** tailwind-merge, clsx

## Getting Started

### Prerequisites

- **Node.js** ≥ v18
- **npm** ≥ v8

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

Generate a production-ready static site:

```bash
npm run build
```

The output will be in the `out` directory.

### Linting & Formatting

Check code quality and style:

```bash
npm run lint
```

## Static Data Export

This project relies on pre-generated JSON from the [info-export](https://github.com/junctor/info-export) tool, which pulls schedule data from Firebase.

1. Clone and install `info-export`:

   ```bash
   git clone https://github.com/junctor/info-export.git
   cd info-export
   npm install
   ```

2. Export the Firebase data:

   ```bash
   npm run export
   ```

3. Copy the generated JSON into this project’s public assets:

   ```bash
   cp -r out/ht ../hackertracker-info/public
   ```

## Team

- [Advice-Dog](https://github.com/Advice-Dog)
- [aNullValue](https://github.com/aNullValue)
- [cak](https://github.com/cak)
- [sethlaw](https://github.com/sethlaw)

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
