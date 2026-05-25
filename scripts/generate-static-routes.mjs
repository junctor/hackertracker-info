import { access, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { CONFERENCES } from "../src/lib/conferences.ts";
import {
  CONFERENCE_ROUTE_DEFINITIONS,
  TOP_LEVEL_STATIC_ROUTE_SEGMENTS,
} from "../src/lib/routes.ts";

const outDir = "dist";
const entry = path.join(outDir, "index.html");
const appsEntry = path.join(outDir, "apps", "index.html");

const conferenceRouteSegments = CONFERENCE_ROUTE_DEFINITIONS.map((route) => route.staticSegment);

function joinRoute(...segments) {
  return segments.filter(Boolean).join("/");
}

async function copyEntryToRoute(routePath) {
  const directory = path.join(outDir, ...routePath.split("/"));

  await mkdir(directory, { recursive: true });
  await copyFile(entry, path.join(directory, "index.html"));
}

await access(entry);
await access(appsEntry);

const generated = ["index.html", "apps/index.html"];

await copyFile(entry, path.join(outDir, "404.html"));
generated.push("404.html");

for (const segment of TOP_LEVEL_STATIC_ROUTE_SEGMENTS) {
  await copyEntryToRoute(segment);
  generated.push(`${segment}/index.html`);
}

for (const conference of Object.values(CONFERENCES)) {
  for (const segment of conferenceRouteSegments) {
    const routePath = joinRoute(conference.slug, segment);

    await copyEntryToRoute(routePath);
    generated.push(`${routePath}/index.html`);
  }
}

console.log("Generated static route entries:");
for (const file of generated) {
  console.log(`- dist/${file}`);
}
