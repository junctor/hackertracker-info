/**
 * Conference data cache layer.
 *
 * Responsibilities:
 *  1. Fetch a fresh manifest (with cache-busting) and compare it to the stored
 *     manifest in IndexedDB.  If buildTimestamp or schemaVersion differs,
 *     delete all cached JSON for that conference and store the new manifest.
 *  2. Serve conference JSON from IndexedDB when available and trusted, populate
 *     it on cache miss, and always verify manifest freshness before the first
 *     read in a browser session.
 *  3. Keep IndexedDB entries until a manifest change or manual reset removes
 *     them; there is no time-based expiration.
 *
 * Concurrency guarantees:
 *  - Only ONE manifest check runs per conference per session.  Concurrent
 *    callers receive the same in-flight Promise.
 *  - Only ONE JSON fetch runs per (conference + path) at a time.  Parallel
 *    hooks on the same page share a single in-flight fetch.
 *  - New JSON reads wait while a manual reset is deleting data for the same
 *    conference.
 */

import { type ConferenceManifest } from "@/lib/conferences";
import {
  DETAIL_SHARD_SPECS,
  HT_SCHEMA_VERSION,
  SCHEDULE_BROWSE_PATH,
  type ConferenceDetailGroup,
} from "@/lib/dataContract";
import { type Manifest } from "@/lib/types/ht-types";

import {
  deleteAllJsonForConf,
  deleteStoredManifest,
  getStoredJson,
  getStoredManifest,
  putStoredJson,
  putStoredManifest,
} from "./indexeddb";

type ManifestCheckResult = "confirmed" | "unconfirmed" | "untrusted-cache";

export type { ConferenceDetailGroup } from "@/lib/dataContract";

// ---------------------------------------------------------------------------
// Session-level manifest freshness tracking
// ---------------------------------------------------------------------------
// Once the manifest has been verified for a conference in this browser session
// (i.e. since the last full page load), further manifest checks are skipped.
// The Set is cleared automatically on page reload because it lives in module
// scope without persistence.
const manifestConfirmedFresh = new Set<string>();

// The confirmed manifest also acts as the resource contract for this session.
// Keeping it here avoids fetching or parsing a second copy when resolving
// schema-versioned resources such as compact schedule and per-entity details.
const confirmedManifests = new Map<string, Manifest>();

// Deduplication: at most one in-flight manifest check per conference.
const manifestCheckInFlight = new Map<string, Promise<ManifestCheckResult>>();

// Deduplication: at most one in-flight JSON fetch per "confKey::path".
const jsonFetchInFlight = new Map<string, Promise<unknown>>();

// Deduplication and coordination for manual cache resets.
const cacheResetInFlight = new Map<string, Promise<void>>();

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function isManifestChanged(stored: Manifest, fresh: Manifest): boolean {
  // Primary invalidation triggers: build timestamp and schema version.
  return (
    stored.buildTimestamp !== fresh.buildTimestamp || stored.schemaVersion !== fresh.schemaVersion
  );
}

async function fetchFreshManifest(conf: ConferenceManifest): Promise<Manifest> {
  // Cache-busting timestamp prevents the browser from serving a stale manifest.
  const url = `${conf.dataRoot}/manifest.json?t=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Manifest fetch failed with status ${res.status}: ${url}`);
  return res.json() as Promise<Manifest>;
}

async function runManifestCheck(conf: ConferenceManifest): Promise<ManifestCheckResult> {
  const confKey = conf.code;

  let freshManifest: Manifest;
  try {
    freshManifest = await fetchFreshManifest(conf);
  } catch {
    // Cannot reach the server (offline, CORS, etc.) — keep the existing cache
    // intact, but leave freshness unconfirmed so a later data request may retry.
    return "unconfirmed";
  }

  let storedRecord;
  try {
    storedRecord = await getStoredManifest(confKey);
  } catch {
    // IndexedDB read error — proceed as if no manifest is stored.
    storedRecord = null;
  }

  const needsInvalidation =
    !storedRecord || isManifestChanged(storedRecord.manifest as unknown as Manifest, freshManifest);

  if (needsInvalidation) {
    try {
      // Clear stale JSON before writing the new manifest so we never serve
      // data from an old build even if the write partially fails.
      await deleteAllJsonForConf(confKey);
      await putStoredManifest({
        confKey,
        manifest: freshManifest as unknown as Record<string, unknown>,
        updatedAt: Date.now(),
      });
    } catch {
      // The manifest changed, but IndexedDB invalidation failed. Do not trust
      // cached JSON for this request or mark the conference fresh.
      return "untrusted-cache";
    }
  }

  confirmedManifests.set(confKey, freshManifest);
  manifestConfirmedFresh.add(confKey);
  return "confirmed";
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Verify that the IndexedDB cache for `conf` is consistent with the current
 * remote manifest.  The first call per conference per session triggers a
 * network fetch and, when the manifest has changed, invalidates stale data.
 * Once the manifest is confirmed, later calls in the same session return
 * immediately. If the manifest cannot be reached, cached data can still be
 * used and a later call may retry.
 *
 * Multiple concurrent callers share a single in-flight Promise so only one
 * manifest request is ever in-flight per conference.
 */
export function ensureConferenceCacheIsFresh(
  conf: ConferenceManifest,
): Promise<ManifestCheckResult> {
  const confKey = conf.code;

  // Fast path: already confirmed fresh this session.
  if (manifestConfirmedFresh.has(confKey)) return Promise.resolve("confirmed");

  // Deduplicate: reuse an in-flight check if one is already running.
  let pending = manifestCheckInFlight.get(confKey);
  if (!pending) {
    pending = runManifestCheck(conf).finally(() => {
      manifestCheckInFlight.delete(confKey);
    });
    manifestCheckInFlight.set(confKey, pending);
  }

  return pending;
}

/**
 * Remove downloaded data for one conference.  Bookmarks and user preferences
 * live outside this cache and are not touched.  The next data request fetches a
 * fresh manifest and repopulates IndexedDB as cache misses occur.
 */
export function resetConferenceCache(conf: ConferenceManifest): Promise<void> {
  const confKey = conf.code;

  let pending = cacheResetInFlight.get(confKey);
  if (!pending) {
    pending = runResetConferenceCache(conf).finally(() => {
      cacheResetInFlight.delete(confKey);
    });
    cacheResetInFlight.set(confKey, pending);
  }

  return pending;
}

async function runResetConferenceCache(conf: ConferenceManifest): Promise<void> {
  const confKey = conf.code;
  const jsonPrefix = `${confKey}::`;

  manifestConfirmedFresh.delete(confKey);
  confirmedManifests.delete(confKey);

  const manifestPending = manifestCheckInFlight.get(confKey);
  const jsonPending = [...jsonFetchInFlight.entries()]
    .filter(([key]) => key.startsWith(jsonPrefix))
    .map(([, pending]) => pending);

  await Promise.allSettled([manifestPending, ...jsonPending].filter((pending) => pending != null));

  manifestConfirmedFresh.delete(confKey);
  confirmedManifests.delete(confKey);
  manifestCheckInFlight.delete(confKey);
  for (const key of jsonFetchInFlight.keys()) {
    if (key.startsWith(jsonPrefix)) {
      jsonFetchInFlight.delete(key);
    }
  }

  await Promise.all([deleteAllJsonForConf(confKey), deleteStoredManifest(confKey)]);

  manifestConfirmedFresh.delete(confKey);
  confirmedManifests.delete(confKey);
  manifestCheckInFlight.delete(confKey);
  for (const key of jsonFetchInFlight.keys()) {
    if (key.startsWith(jsonPrefix)) {
      jsonFetchInFlight.delete(key);
    }
  }
}

async function getConferenceManifestContract(conf: ConferenceManifest): Promise<Manifest | null> {
  await ensureConferenceCacheIsFresh(conf);

  const confirmed = confirmedManifests.get(conf.code);
  if (confirmed) return confirmed;

  // Offline sessions can still validate against the last successfully stored
  // manifest before resolving the fixed schema-4 resource contract.
  try {
    const stored = await getStoredManifest(conf.code);
    return stored ? (stored.manifest as unknown as Manifest) : null;
  } catch {
    return null;
  }
}

function requireSchemaFourManifest(manifest: Manifest | null): Manifest {
  if (manifest?.schemaVersion !== HT_SCHEMA_VERSION) {
    throw new Error("Conference data must use manifest schema version 4");
  }
  return manifest;
}

/**
 * Resolve a named resource from the fixed schema-4 client contract.
 */
export async function getConferenceResourceJson<T>(
  conf: ConferenceManifest,
  _resource: "scheduleBrowse",
): Promise<T> {
  requireSchemaFourManifest(await getConferenceManifestContract(conf));
  return getConferenceJson<T>(conf, SCHEDULE_BROWSE_PATH);
}

function detailShardPath(
  template: string,
  id: number,
  shardCount: number,
  shardDigits: number,
): string {
  const shardIndex = ((id % shardCount) + shardCount) % shardCount;
  return template.replace("{shard}", String(shardIndex).padStart(shardDigits, "0"));
}

/**
 * Load one focused ID-keyed detail shard and select the requested record.
 */
export async function getConferenceDetailJson<T>(
  conf: ConferenceManifest,
  group: ConferenceDetailGroup,
  id: number,
): Promise<T | undefined> {
  requireSchemaFourManifest(await getConferenceManifestContract(conf));
  const shard = DETAIL_SHARD_SPECS[group];
  const path = detailShardPath(shard.pathTemplate, id, shard.shardCount, shard.shardDigits);
  const records = await getConferenceJson<Record<string, T>>(conf, path);
  return records[String(id)];
}

/**
 * Fetch `relativePath` (e.g. `"views/scheduleBrowse.json"`) from the IndexedDB
 * cache, falling back to the network on a cache miss.  Manifest freshness is
 * checked before the first read.  If the manifest cannot be reached, existing
 * IndexedDB data remains available and freshness is retried on a later request.
 *
 * Multiple concurrent calls for the same conf + path share one in-flight fetch.
 */
export function getConferenceJson<T>(conf: ConferenceManifest, relativePath: string): Promise<T> {
  const resetPending = cacheResetInFlight.get(conf.code);
  if (resetPending) {
    return resetPending.then(() => getConferenceJson<T>(conf, relativePath));
  }

  const key = `${conf.code}::${relativePath}`;

  let pending = jsonFetchInFlight.get(key) as Promise<T> | undefined;
  if (!pending) {
    pending = runGetConferenceJson<T>(conf, relativePath).finally(() => {
      jsonFetchInFlight.delete(key);
    });
    jsonFetchInFlight.set(key, pending);
  }

  return pending;
}

async function runGetConferenceJson<T>(conf: ConferenceManifest, relativePath: string): Promise<T> {
  // Check the manifest before reading from the cache.
  // ensureConferenceCacheIsFresh is itself deduplicated, so many concurrent
  // calls on the same page trigger at most one manifest request per conf.
  const manifestStatus = await ensureConferenceCacheIsFresh(conf);

  const confKey = conf.code;

  // Serve from IndexedDB if available.
  if (manifestStatus !== "untrusted-cache") {
    try {
      const cached = await getStoredJson(confKey, relativePath);
      if (cached) return cached.data as T;
    } catch {
      // IndexedDB read error — fall through to network fetch.
    }
  }

  // Cache miss: fetch from the network.
  const url = `${conf.dataRoot}/${relativePath}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const data = (await res.json()) as T;

  // Persist for future requests.  A write failure is non-fatal.
  try {
    await putStoredJson({ confKey, path: relativePath, data, updatedAt: Date.now() });
  } catch {
    // Cache write failed — data was already returned; no further action needed.
  }

  return data;
}
