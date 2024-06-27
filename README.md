# info.defcon.org

## Overview

This project is a Next.js application designed to show events and schedules for DEF CON 32. It will be hosted at [info.defcon.org](https://info.defcon.org).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Next.js Application (./app)](#nextjs-application-app)
  - [Install Dependencies](#install-dependencies)
  - [Start Development Server](#start-development-server)
  - [Production Static Export](#production-static-export)
- [Export Static HackerTracker Data (./ht-export)](#export-static-hackertracker-data-ht-export)
  - [Install Dependencies](#install-dependencies-1)
  - [Export Static Data](#export-static-data)
  - [Firebase API Key](#firebase-api-key)
- [HackerTracker Team](#hackertracker-team)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)

## Next.js Application (./app)

### Install Dependencies

To install the necessary dependencies, run:

```bash
npm install
```

### Start Development Server

To start the development server, run:

```bash
npm run dev
```

### Production Static Export

To build the project for production and export static HTML, run:

```bash
npm run export
```

This command will [build](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) static HTML files into a generated `out` directory.

For more information, refer to the [Next.js documentation on deploying static-only sites](https://nextjs.org/docs/pages/building-your-application/deploying#static-only).

## Export Static HackerTracker Data (./ht-export)

### Install Dependencies

To install the necessary dependencies, run:

```bash
npm install
```

### Export Static Data

To fetch data from Firebase and export static JSON files, run:

```bash
npm run export
```

The static JSON files will be generated in the `out` directory.

### Firebase API Key

The script requires the Firebase API key to be set as the `FIREBASE_API_KEY` environment variable. This stops [@Advice-Dog](https://github.com/Advice-Dog) from getting alerted every time I leak the key, but you are all hackers and undoubtedly you’ll find it anyway.

## HackerTracker Team

- [Advice-Dog](https://github.com/Advice-Dog)
- [aNullValue](https://github.com/aNullValue)
- [cak](https://github.com/cak)
- [sethlaw](https://github.com/sethlaw)

## Technologies Used

- Developed with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or fixes.

## License

This project is licensed under the [MIT License](LICENSE).
