import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";

import {
  getConferenceDetailJson,
  getConferenceJson,
  getConferenceResourceJson,
  type ConferenceDetailGroup,
} from "@/lib/cache/conference-cache";
import { type ConferenceManifest } from "@/lib/conferences";

/**
 * SWR-backed hook that fetches conference JSON through the IndexedDB cache
 * layer.  On first use per session the cache is validated against a fresh
 * manifest; subsequent calls within the same session are served from IndexedDB
 * with no extra network round-trips once that manifest has been confirmed.
 * If the manifest cannot be reached, cached data remains available and a later
 * request can retry the freshness check.
 *
 * Mirrors the `useSWR<T>(url | null, loader, options)` contract used
 * throughout the [conf] pages:
 *   - Pass `null` as `relativePath` to skip fetching (conditional patterns).
 *   - The SWR key is the full URL so different hooks requesting the same file
 *     on the same page share one SWR cache entry and one in-flight request.
 *
 * @param conf         Conference manifest from the active route.
 * @param relativePath Path relative to `conf.dataRoot`, e.g. `"views/scheduleBrowse.json"`.
 *                     Pass `null` to suspend fetching.
 * @param options      Optional SWR configuration overrides.
 */
export function useConferenceJson<T>(
  conf: ConferenceManifest,
  relativePath: string | null,
  options?: SWRConfiguration,
): SWRResponse<T | undefined> {
  // Build a stable SWR key from the full URL (consistent with existing patterns).
  const swrKey = relativePath != null ? `${conf.dataRoot}/${relativePath}` : null;

  return useSWR<T | undefined>(
    swrKey,
    // The loader ignores the key and delegates to the cache layer, which
    // handles IndexedDB reads/writes and manifest-based invalidation.
    () => getConferenceJson<T>(conf, relativePath!),
    options,
  );
}

export function useConferenceResourceJson<T>(
  conf: ConferenceManifest,
  resource: "scheduleBrowse",
  shouldLoad = true,
  options?: SWRConfiguration,
): SWRResponse<T> {
  const swrKey = shouldLoad ? `${conf.dataRoot}/resource/${resource}` : null;

  return useSWR<T>(swrKey, () => getConferenceResourceJson<T>(conf, resource), options);
}

export function useConferenceDetailJson<T>(
  conf: ConferenceManifest,
  group: ConferenceDetailGroup,
  id: number | null,
  options?: SWRConfiguration,
): SWRResponse<T | undefined> {
  const swrKey = id === null ? null : `${conf.dataRoot}/detail/${group}/${id}`;

  return useSWR<T | undefined>(swrKey, () => getConferenceDetailJson<T>(conf, group, id!), options);
}
