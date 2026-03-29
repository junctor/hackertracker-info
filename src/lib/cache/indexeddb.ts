/**
 * Lightweight typed IndexedDB wrapper for conference data caching.
 *
 * Database: "info-defcon-cache"
 *   Store "manifests" — keyed by confKey (e.g. "DCSG2026")
 *   Store "json"      — keyed by [confKey, path]; indexed on confKey for bulk deletes
 *
 * All async operations reject when IndexedDB is unavailable or encounters an
 * error.  Callers are expected to catch and fall back to network-only mode.
 */

const DB_NAME = "info-defcon-cache";
const DB_VERSION = 1;

export type StoredManifest = {
  confKey: string;
  manifest: Record<string, unknown>;
  updatedAt: number;
};

export type StoredJson = {
  confKey: string;
  path: string;
  data: unknown;
  updatedAt: number;
};

// Module-level singleton so we only ever open the DB once per page session.
let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB unavailable"));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.addEventListener("upgradeneeded", (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("manifests")) {
        db.createObjectStore("manifests", { keyPath: "confKey" });
      }

      if (!db.objectStoreNames.contains("json")) {
        const store = db.createObjectStore("json", { keyPath: ["confKey", "path"] });
        // Index on confKey lets us range-delete all JSON for one conference at once.
        store.createIndex("byConf", "confKey", { unique: false });
      }
    });

    request.addEventListener("success", () => resolve(request.result));

    request.addEventListener("error", () => {
      dbPromise = null; // Allow retry on the next openDb() call
      reject(request.error);
    });

    request.addEventListener("blocked", () => {
      dbPromise = null;
      reject(new Error("IndexedDB open blocked — likely another tab has an older version open"));
    });
  });

  return dbPromise;
}

// ---------------------------------------------------------------------------
// Manifests store
// ---------------------------------------------------------------------------

export async function getStoredManifest(confKey: string): Promise<StoredManifest | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction("manifests", "readonly").objectStore("manifests").get(confKey);
    req.addEventListener("success", () =>
      resolve((req.result as StoredManifest | undefined) ?? null),
    );
    req.addEventListener("error", () => reject(req.error));
  });
}

export async function putStoredManifest(record: StoredManifest): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction("manifests", "readwrite").objectStore("manifests").put(record);
    req.addEventListener("success", () => resolve());
    req.addEventListener("error", () => reject(req.error));
  });
}

// ---------------------------------------------------------------------------
// JSON store
// ---------------------------------------------------------------------------

export async function getStoredJson(confKey: string, path: string): Promise<StoredJson | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction("json", "readonly").objectStore("json").get([confKey, path]);
    req.addEventListener("success", () => resolve((req.result as StoredJson | undefined) ?? null));
    req.addEventListener("error", () => reject(req.error));
  });
}

export async function putStoredJson(record: StoredJson): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction("json", "readwrite").objectStore("json").put(record);
    req.addEventListener("success", () => resolve());
    req.addEventListener("error", () => reject(req.error));
  });
}

/**
 * Delete every cached JSON entry that belongs to `confKey`.
 * Called during manifest invalidation so we never serve data from an old build.
 */
export async function deleteAllJsonForConf(confKey: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("json", "readwrite");
    const index = tx.objectStore("json").index("byConf");
    const req = index.openCursor(IDBKeyRange.only(confKey));

    req.addEventListener("success", () => {
      const cursor = req.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    });

    req.addEventListener("error", () => reject(req.error));
    tx.addEventListener("complete", () => resolve());
    tx.addEventListener("error", () => reject(tx.error));
    tx.addEventListener("abort", () =>
      reject(new Error("Transaction aborted while deleting conference JSON")),
    );
  });
}
