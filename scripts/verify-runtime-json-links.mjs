import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { CONFERENCES } from "../src/lib/conferences.ts";
import {
  DETAIL_SHARD_SPECS,
  CONTENT_FILTER_INDEX_PATH,
  HT_SCHEMA_VERSION,
  ORGANIZATIONS_BROWSE_PATH,
  SCHEDULE_BROWSE_PATH,
  SCHEDULE_FILTER_INDEX_PATH,
} from "../src/lib/dataContract.ts";

const publicDir = process.argv[2] ?? "public";
const htDir = path.join(publicDir, "ht");
const jsonLinkPattern = /(?:https:\/\/info\.defcon\.org)?(\/ht\/[^"'`\s<>)]+?\.json)/g;
const requiredRuntimeFiles = [
  "conference.json",
  "manifest.json",
  "views/announcementsList.json",
  "views/contentCards.json",
  CONTENT_FILTER_INDEX_PATH,
  "views/documentsList.json",
  "views/locationCards.json",
  ORGANIZATIONS_BROWSE_PATH,
  "views/peopleCards.json",
  SCHEDULE_BROWSE_PATH,
  SCHEDULE_FILTER_INDEX_PATH,
  "views/searchData.json",
  "views/tagTypesBrowse.json",
];
const counters = {
  detailRecords: 0,
  generatedFiles: 0,
  jsonLinks: 0,
  requiredFiles: 0,
};

function walkFiles(root) {
  if (!existsSync(root)) return [];
  const out = [];

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(fullPath));
    if (entry.isFile()) out.push(fullPath);
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

function isForbiddenRuntimePath(relativePath) {
  return (
    /^(?:raw|entities|indexes)\//.test(relativePath) ||
    relativePath === "derived/tagIdsByLabel.json" ||
    /^details\/(?:sessions|locations|tags)\//.test(relativePath) ||
    /^details\/(?:content|documents|organizations|people|tags)\.json$/.test(relativePath) ||
    /^views\/(?:scheduleDays|bookmarkSessionsById|organizationsCards)\.json$/.test(relativePath)
  );
}

function linkedConferenceRelativePath(href) {
  return href.split("/").slice(3).join("/");
}

function organizationIds(value) {
  return Array.isArray(value?.all) ? value.all.map((item) => item?.id) : [];
}

function expectedShardPath(spec, id) {
  const index = ((id % spec.shardCount) + spec.shardCount) % spec.shardCount;
  return spec.pathTemplate.replace("{shard}", String(index).padStart(spec.shardDigits, "0"));
}

function assertDetailRecords(conference, group, ids, failures) {
  const spec = DETAIL_SHARD_SPECS[group];

  const shards = new Map();
  for (let index = 0; index < spec.shardCount; index += 1) {
    const relativePath = spec.pathTemplate.replace(
      "{shard}",
      String(index).padStart(spec.shardDigits, "0"),
    );
    const file = path.join(htDir, conference.slug, relativePath);
    assertFileExists(file, failures);
    shards.set(relativePath, readJson(file, failures));
  }

  for (const id of new Set(ids.filter((value) => value != null).map(Number))) {
    counters.detailRecords += 1;
    const relativePath = expectedShardPath(spec, id);
    const records = shards.get(relativePath);
    if (!records || !Object.hasOwn(records, String(id))) {
      fail(`Missing ${group} detail id ${id} in ${conference.slug}/${relativePath}`, failures);
    }
  }
}

function assertScheduleBrowse(conference, value, failures) {
  if (
    !value ||
    !Array.isArray(value.days) ||
    !value.sessionPositionsById ||
    typeof value.sessionPositionsById !== "object" ||
    Array.isArray(value.sessionPositionsById)
  ) {
    fail(`Invalid schedule browse view for ${conference.slug}`, failures);
    return;
  }

  let sessionCount = 0;
  value.days.forEach((day, dayIndex) => {
    if (!Array.isArray(day?.sessions)) {
      fail(`Invalid schedule day ${dayIndex} for ${conference.slug}`, failures);
      return;
    }
    day.sessions.forEach((session, sessionIndex) => {
      sessionCount += 1;
      const position = value.sessionPositionsById[String(session?.id)];
      if (position?.dayIndex !== dayIndex || position?.sessionIndex !== sessionIndex) {
        fail(
          `Invalid schedule position for session ${session?.id} in ${conference.slug}`,
          failures,
        );
      }
    });
  });

  if (Object.keys(value.sessionPositionsById).length !== sessionCount) {
    fail(`Schedule position count mismatch for ${conference.slug}`, failures);
  }
}

const failures = [];

for (const file of walkFiles(publicDir)) {
  const normalized = path.relative(publicDir, file).split(path.sep).join("/");

  if (normalized.startsWith("ht/")) {
    if (normalized.endsWith(".json")) {
      const conferenceRelativePath = normalized.split("/").slice(2).join("/");
      if (isForbiddenRuntimePath(conferenceRelativePath)) {
        fail(`Forbidden schema-3 runtime JSON file exists: ${file}`, failures);
      }
    }
    continue;
  }

  if (!/\.(?:html|json|txt|xml)$/.test(normalized)) continue;

  counters.generatedFiles += 1;
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(jsonLinkPattern)) {
    const href = match[1];
    counters.jsonLinks += 1;
    if (isForbiddenRuntimePath(linkedConferenceRelativePath(href))) {
      fail(`Schema-3 JSON path linked from ${file}: ${href}`, failures);
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

  const manifest = readJson(path.join(root, "manifest.json"), failures);
  if (manifest?.schemaVersion !== HT_SCHEMA_VERSION) {
    fail(`Manifest must use schema version 4: ${conference.slug}`, failures);
  }
  if (
    Object.keys(manifest ?? {}).some((key) => !["buildTimestamp", "schemaVersion"].includes(key))
  ) {
    fail(`Manifest contains non-cache metadata: ${conference.slug}`, failures);
  }

  const contentCards = readJson(path.join(root, "views", "contentCards.json"), failures);
  const peopleCards = readJson(path.join(root, "views", "peopleCards.json"), failures);
  const organizationsBrowse = readJson(path.join(root, ORGANIZATIONS_BROWSE_PATH), failures);
  const documentsList = readJson(path.join(root, "views", "documentsList.json"), failures);
  const scheduleBrowse = readJson(path.join(root, "views", "scheduleBrowse.json"), failures);

  assertScheduleBrowse(conference, scheduleBrowse, failures);
  assertDetailRecords(
    conference,
    "content",
    Array.isArray(contentCards) ? contentCards.map((item) => item?.id) : [],
    failures,
  );
  assertDetailRecords(
    conference,
    "people",
    Array.isArray(peopleCards) ? peopleCards.map((item) => item?.id) : [],
    failures,
  );
  assertDetailRecords(conference, "organizations", organizationIds(organizationsBrowse), failures);
  assertDetailRecords(
    conference,
    "documents",
    Array.isArray(documentsList) ? documentsList.map((item) => item?.id) : [],
    failures,
  );
}

if (failures.length > 0) {
  console.error("Runtime JSON verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Runtime JSON links verified: ${counters.jsonLinks} generated JSON links, ` +
    `${counters.generatedFiles} generated metadata files, ` +
    `${counters.requiredFiles} required runtime files, ` +
    `${counters.detailRecords} route-derived sharded detail records.`,
);
