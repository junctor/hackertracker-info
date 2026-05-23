import { access, copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { CONFERENCES } from "../src/lib/conferences.ts";

const outDir = "dist";
const entry = path.join(outDir, "index.html");
const appsEntry = path.join(outDir, "apps", "index.html");

const topLevelRouteSegments = ["tv"];
const legacyAppRoutePaths = ["app", "dc33/apps", "dc34/apps", "defcon33/apps"];

const conferenceRouteSegments = [
  "",
  "announcements",
  "bookmarks",
  "communities",
  "contests",
  "content",
  "departments",
  "document",
  "exhibitors",
  "locations",
  "maps",
  "menu",
  "merch",
  "organization",
  "people",
  "readme.nfo",
  "schedule",
  "search",
  "speakers",
  "tag",
  "tags",
  "vendors",
  "villages",
];

function joinRoute(...segments) {
  return segments.filter(Boolean).join("/");
}

async function copyEntryToRoute(routePath) {
  const directory = path.join(outDir, ...routePath.split("/"));

  await mkdir(directory, { recursive: true });
  await copyFile(entry, path.join(directory, "index.html"));
}

async function writeRedirectRoute(routePath, destination) {
  const directory = path.join(outDir, ...routePath.split("/"));
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=${destination}">
    <link rel="canonical" href="${destination}">
    <title>Hacker Tracker Apps</title>
  </head>
  <body>
    <main>
      <p>Hacker Tracker Apps moved to <a href="${destination}">${destination}</a>.</p>
    </main>
  </body>
</html>
`;

  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html, "utf8");
}

await access(entry);
await access(appsEntry);

const generated = ["index.html", "apps/index.html"];

await copyFile(entry, path.join(outDir, "404.html"));
generated.push("404.html");

for (const segment of topLevelRouteSegments) {
  await copyEntryToRoute(segment);
  generated.push(`${segment}/index.html`);
}

for (const routePath of legacyAppRoutePaths) {
  await writeRedirectRoute(routePath, "/apps");
  generated.push(`${routePath}/index.html`);
}

for (const conference of Object.values(CONFERENCES)) {
  for (const segment of conferenceRouteSegments) {
    const routePath = joinRoute(conference.slug, segment);

    await copyEntryToRoute(routePath);
    generated.push(`${routePath}/index.html`);
  }

  const appsRoutePath = joinRoute(conference.slug, "apps");

  await writeRedirectRoute(appsRoutePath, "/apps");
  generated.push(`${appsRoutePath}/index.html`);
}

console.log("Generated static route entries:");
for (const file of generated) {
  console.log(`- dist/${file}`);
}
