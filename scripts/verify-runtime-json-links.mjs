import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { CONFERENCES } from "../src/lib/conferences.ts";

const publicDir = process.argv[2] ?? "public";
const htDir = path.join(publicDir, "ht");

const removedJsonPathPattern =
  /\/ht\/[^/"'\s<>)]+\/(?:raw|entities|indexes|details\/(?:sessions|locations))\/[^"'\s<>)]+\.json/;
const jsonLinkPattern = /(?:https:\/\/info\.defcon\.org)?(\/ht\/[^"'`\s<>)]+?\.json)/g;
const removedRelativePattern = /^(?:raw\/|entities\/|indexes\/|details\/(?:sessions|locations)\/)/;

const requiredRuntimeFiles = [
  "conference.json",
  "manifest.json",
  "derived/tagIdsByLabel.json",
  "views/announcementsList.json",
  "views/bookmarkSessionsById.json",
  "views/contentCards.json",
  "views/documentsList.json",
  "views/locationCards.json",
  "views/organizationsCards.json",
  "views/peopleCards.json",
  "views/scheduleDays.json",
  "views/searchData.json",
  "views/tagTypesBrowse.json",
];

const counters = {
  detailFiles: 0,
  generatedFiles: 0,
  jsonLinks: 0,
  requiredFiles: 0,
};

function walkFiles(root) {
  if (!existsSync(root)) return [];

  const out = [];
  const entries = readdirSync(root, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      out.push(...walkFiles(fullPath));
      continue;
    }

    if (entry.isFile()) {
      out.push(fullPath);
    }
  }

  return out;
}

function publicPath(pathname) {
  return path.join(publicDir, pathname.replace(/^\/+/, ""));
}

function fail(message, failures) {
  failures.push(message);
}

function readJson(file, failures) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    fail(`Failed to read JSON ${file}: ${error.message}`, failures);
    return null;
  }
}

function assertFileExists(file, failures) {
  if (!existsSync(file) || !statSync(file).isFile()) {
    fail(`Missing required file: ${file}`, failures);
  }
}

function assertDetailFiles(conference, group, ids, failures) {
  const uniqueIds = new Set(ids.filter((id) => id != null).map((id) => String(id)));

  for (const id of uniqueIds) {
    counters.detailFiles += 1;
    assertFileExists(path.join(htDir, conference.slug, "details", group, `${id}.json`), failures);
  }
}

function organizationIds(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];

  return Object.values(value)
    .filter(Array.isArray)
    .flatMap((items) => items.map((item) => item?.id));
}

function tagIds(value) {
  if (!Array.isArray(value)) return [];

  return value.flatMap((tagType) =>
    Array.isArray(tagType?.tags) ? tagType.tags.map((tag) => tag?.id) : [],
  );
}

const failures = [];

for (const file of walkFiles(publicDir)) {
  const relative = path.relative(publicDir, file);
  const normalized = relative.split(path.sep).join("/");

  if (normalized.startsWith("ht/")) {
    if (normalized.endsWith(".json")) {
      const conferenceRelativePath = normalized.split("/").slice(2).join("/");
      if (removedRelativePattern.test(conferenceRelativePath)) {
        fail(`Forbidden runtime JSON file exists: ${file}`, failures);
      }
    }
    continue;
  }

  if (!/\.(?:html|json|txt|xml)$/.test(normalized)) {
    continue;
  }

  counters.generatedFiles += 1;
  const text = readFileSync(file, "utf8");
  const removedMatch = text.match(removedJsonPathPattern);
  if (removedMatch) {
    fail(`Removed JSON path linked from ${file}: ${removedMatch[0]}`, failures);
  }

  for (const match of text.matchAll(jsonLinkPattern)) {
    const href = match[1];
    counters.jsonLinks += 1;
    if (removedJsonPathPattern.test(href)) {
      fail(`Removed JSON path linked from ${file}: ${href}`, failures);
      continue;
    }

    const target = publicPath(href);
    if (!existsSync(target) || !statSync(target).isFile()) {
      fail(`Missing public JSON target linked from ${file}: ${href}`, failures);
    }
  }
}

for (const conference of Object.values(CONFERENCES)) {
  const root = path.join(htDir, conference.slug);

  for (const relativePath of requiredRuntimeFiles) {
    counters.requiredFiles += 1;
    assertFileExists(path.join(root, relativePath), failures);
  }

  const contentCards = readJson(path.join(root, "views", "contentCards.json"), failures);
  const peopleCards = readJson(path.join(root, "views", "peopleCards.json"), failures);
  const organizationsCards = readJson(
    path.join(root, "views", "organizationsCards.json"),
    failures,
  );
  const documentsList = readJson(path.join(root, "views", "documentsList.json"), failures);
  const tagTypesBrowse = readJson(path.join(root, "views", "tagTypesBrowse.json"), failures);

  if (Array.isArray(contentCards)) {
    assertDetailFiles(
      conference,
      "content",
      contentCards.map((item) => item?.id),
      failures,
    );
  }

  if (Array.isArray(peopleCards)) {
    assertDetailFiles(
      conference,
      "people",
      peopleCards.map((item) => item?.id),
      failures,
    );
  }

  assertDetailFiles(conference, "organizations", organizationIds(organizationsCards), failures);

  if (Array.isArray(documentsList)) {
    assertDetailFiles(
      conference,
      "documents",
      documentsList.map((item) => item?.id),
      failures,
    );
  }

  assertDetailFiles(conference, "tags", tagIds(tagTypesBrowse), failures);
}

if (failures.length > 0) {
  console.error("Runtime JSON verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Runtime JSON links verified: ${counters.jsonLinks} generated JSON links, ` +
    `${counters.generatedFiles} generated metadata files, ` +
    `${counters.requiredFiles} required runtime files, ` +
    `${counters.detailFiles} route-derived detail files.`,
);
