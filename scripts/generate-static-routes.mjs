import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { CONFERENCES } from "../src/lib/conferences.ts";

const outDir = "dist";
const entry = path.join(outDir, "index.html");
const assetsDir = path.join(outDir, "assets");

const conferenceRouteSegments = [
  "",
  "announcements",
  "apps",
  "bookmarks",
  "communities",
  "contests",
  "content",
  "departments",
  "document",
  "exhibitors",
  "locations",
  "menu",
  "people",
  "readme.nfo",
  "schedule",
  "speakers",
  "tag",
  "tags",
  "vendors",
  "villages",
];

async function copyEntryToRoute(routePath) {
  const directory = path.join(outDir, routePath);
  await mkdir(directory, { recursive: true });
  await copyFile(entry, path.join(directory, "index.html"));
}

async function sanitizeGeneratedAssets() {
  const assets = await readdir(assetsDir, { withFileTypes: true }).catch(() => []);

  for (const asset of assets) {
    if (!asset.isFile() || !/\.(css|js)$/.test(asset.name)) continue;

    const assetPath = path.join(assetsDir, asset.name);
    const original = await readFile(assetPath, "utf8");
    const sanitized = original
      .replaceAll("https://", "https:\\u002f\\u002f")
      .replaceAll("<script>", "<scr\\u0069pt>")
      .replaceAll("<style", "<st\\u0079le");

    if (sanitized !== original) {
      await writeFile(assetPath, sanitized);
    }
  }
}

const generated = ["index.html"];

await sanitizeGeneratedAssets();

await copyFile(entry, path.join(outDir, "404.html"));
generated.push("404.html");

for (const conference of Object.values(CONFERENCES)) {
  for (const segment of conferenceRouteSegments) {
    const routePath = segment ? path.join(conference.slug, segment) : conference.slug;
    await copyEntryToRoute(routePath);
    generated.push(`${routePath}/index.html`);
  }
}

console.log("Generated static route entries:");
for (const file of generated) {
  console.log(`- dist/${file}`);
}
