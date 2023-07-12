# info.defcon.org

## Next.js Application (./app)

### Install Dependancies

```bash
    npm install
```

### Start Development Server

```bash
    npm run dev
```

### Production Build

```bash
    npm run build
```

_Command [build](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) static html to a generated `out` directory_

[deploying static-only docs](https://nextjs.org/docs/pages/building-your-application/deploying#static-only)

### Other

### Safe List for Dynamic Event Colors [TODO]

place in `app/tailwind.config.js`

```bash
jq '.[].type.color' events.json | sort -u | awk '{print "'"'"'bg-["$1"]'"'"',\n'"'"'hover:bg-["$1"]'"'"',"}' | tr -d \"
```

## Export Static HackerTracker Data (./ht-export) [TODO]

### Install Dependancies

```bash
    npm install
```

### Export Static Data

```bash
    npm run export
```

_Fetches data from Firebase and exports static json files to a generated `out` directory_

### Misc

Developed with [Next.js](https://nextjs.org) and styled with [Tailwind CSS](https://tailwindcss.com) + [daisyUI](https://daisyui.com).
