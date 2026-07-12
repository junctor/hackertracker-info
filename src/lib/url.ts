const SAFE_EXTERNAL_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);
const SAFE_IMAGE_PROTOCOLS = new Set(["https:"]);

type AppUrlSearchValue = string | number | boolean | null | undefined;

export function buildAppPath(
  segments: ReadonlyArray<string | number>,
  search?: Record<string, AppUrlSearchValue>,
): string {
  const path = `/${segments
    .map((segment) =>
      String(segment)
        .trim()
        .replace(/^\/+|\/+$/g, ""),
    )
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/")}/`;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search ?? {})) {
    if (value === null || value === undefined) continue;
    params.set(key, String(value));
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function buildAbsoluteAppUrl(
  segments: ReadonlyArray<string | number>,
  search?: Record<string, AppUrlSearchValue>,
): string {
  const path = buildAppPath(segments, search);

  if (typeof window === "undefined") return path;

  return new URL(path, window.location.origin).toString();
}

export function getSafeExternalHref(value?: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const candidate = /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed;

  try {
    const url = new URL(candidate);
    return SAFE_EXTERNAL_PROTOCOLS.has(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function getSafeImageHref(value?: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    return SAFE_IMAGE_PROTOCOLS.has(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
