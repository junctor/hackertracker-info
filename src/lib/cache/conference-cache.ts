/**
 * Conference data cache layer.
 *
 * Responsibilities:
 *  1. Fetch a fresh manifest (with cache-busting) and compare it to the stored
 *     manifest in IndexedDB.  If buildTimestamp or schemaVersion differs,
 *     delete all cached JSON for that conference and store the new manifest.
 *  2. Serve conference JSON from IndexedDB when available, populate it on cache
 *     miss, and always verify manifest freshness before the first read in a
 *     browser session.
 *
 * Concurrency guarantees:
 *  - Only ONE manifest check runs per conference per session.  Concurrent
 *    callers receive the same in-flight Promise.
 *  - Only ONE JSON fetch runs per (conference + path) at a time.  Parallel
 *    hooks on the same page share a single in-flight fetch.
 */

import { type ConferenceManifest } from "@/lib/conferences";
import { type Manifest } from "@/lib/types/ht-types";

import {
  deleteAllJsonForConf,
  getStoredJson,
  getStoredManifest,
  putStoredJson,
  putStoredManifest,
} from "./indexeddb";

// ---------------------------------------------------------------------------
// Session-level manifest freshness tracking
// ---------------------------------------------------------------------------
// Once the manifest has been verified for a conference in this browser session
// (i.e. since the last full page load), further manifest checks are skipped.
// The Set is cleared automatically on page reload because it lives in module
// scope without persistence.
const manifestConfirmedFresh = new Set<string>();

// Deduplication: at most one in-flight manifest check per conference.
const manifestCheckInFlight = new Map<string, Promise<void>>();

// Deduplication: at most one in-flight JSON fetch per "confKey::path".
const jsonFetchInFlight = new Map<string, Promise<unknown>>();

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

async function runManifestCheck(conf: ConferenceManifest): Promise<void> {
  const confKey = conf.code;

  let freshManifest: Manifest;
  try {
    freshManifest = await fetchFreshManifest(conf);
  } catch {
    // Cannot reach the server (offline, CORS, etc.) — keep the existing cache
    // intact and mark as fresh to avoid retrying on every subsequent request.
    manifestConfirmedFresh.add(confKey);
    return;
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
      // IndexedDB write failed — the app will fall back to network-only mode.
    }
  }

  manifestConfirmedFresh.add(confKey);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Verify that the IndexedDB cache for `conf` is consistent with the current
 * remote manifest.  The first call per conference per session triggers a
 * network fetch and, when the manifest has changed, invalidates stale data.
 * Subsequent calls within the same session return immediately (no network).
 *
 * Multiple concurrent callers share a single in-flight Promise so only one
 * manifest request is ever in-flight per conference.
 */
export function ensureConferenceCacheIsFresh(conf: ConferenceManifest): Promise<void> {
  const confKey = conf.code;

  // Fast path: already confirmed fresh this session.
  if (manifestConfirmedFresh.has(confKey)) return Promise.resolve();

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
 * Fetch `relativePath` (e.g. `"entities/events.json"`) from the IndexedDB
 * cache, falling back to the network on a cache miss.  Manifest freshness is
 * always verified before the first read, ensuring stale data is never returned
 * after a conference rebuild.
 *
 * Multiple concurrent calls for the same conf + path share one in-flight fetch.
 */
export function getConferenceJson<T>(conf: ConferenceManifest, relativePath: string): Promise<T> {
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
  // Ensure the manifest is fresh before reading from the cache.
  // ensureConferenceCacheIsFresh is itself deduplicated, so many concurrent
  // calls on the same page trigger at most one manifest request per conf.
  await ensureConferenceCacheIsFresh(conf);

  const confKey = conf.code;

  // Serve from IndexedDB if available.
  try {
    const cached = await getStoredJson(confKey, relativePath);
    if (cached) return cached.data as T;
  } catch {
    // IndexedDB read error — fall through to network fetch.
  }

  // Cache miss: fetch from the network.
  const url = `${conf.dataRoot}/${relativePath}`;
  const res = await fetch(url);
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
