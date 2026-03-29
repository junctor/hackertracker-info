import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";

import { getConferenceJson } from "@/lib/cache/conference-cache";
import { type ConferenceManifest } from "@/lib/conferences";

/**
 * SWR-backed hook that fetches conference JSON through the IndexedDB cache
 * layer.  On first use per session the cache is validated against a fresh
 * manifest; subsequent calls within the same session are served from IndexedDB
 * with no extra network round-trips.
 *
 * Mirrors the `useSWR<T>(url | null, fetcher, options)` contract used
 * throughout the [conf] pages:
 *   - Pass `null` as `relativePath` to skip fetching (conditional patterns).
 *   - The SWR key is the full URL so different hooks requesting the same file
 *     on the same page share one SWR cache entry and one in-flight request.
 *
 * @param conf         Conference manifest from `getStaticProps`.
 * @param relativePath Path relative to `conf.dataRoot`, e.g. `"entities/events.json"`.
 *                     Pass `null` to suspend fetching.
 * @param options      Optional SWR configuration overrides.
 */
export function useConferenceJson<T>(
  conf: ConferenceManifest,
  relativePath: string | null,
  options?: SWRConfiguration,
): SWRResponse<T> {
  // Build a stable SWR key from the full URL (consistent with existing patterns).
  const swrKey = relativePath != null ? `${conf.dataRoot}/${relativePath}` : null;

  return useSWR<T>(
    swrKey,
    // The fetcher ignores the key and delegates to the cache layer, which
    // handles IndexedDB reads/writes and manifest-based invalidation.
    () => getConferenceJson<T>(conf, relativePath!),
    options,
  );
}
