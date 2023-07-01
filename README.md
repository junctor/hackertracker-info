# info.defcon.org

## Next.js Application (./info)

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

### Static Export

```bash
    npm run export
```

_Command [exports](https://nextjs.org/docs/advanced-features/static-html-export) static html to a generated `out` directory_

### Other

### Safe List for Dynamic Event Colors

place in `app/tailwind.config.js`

```bash
jq '.[].type.color' events.json | sort -u | awk '{print "'"'"'bg-["$1"]'"'"',\n'"'"'hover:bg-["$1"]'"'"',"}' | tr -d \"
```

## Export Static HackerTracker Data (./ht-export)

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
