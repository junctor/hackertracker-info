export type NumericRouteIdState = {
  value: number | null;
  isMissing: boolean;
  isInvalid: boolean;
};

const NUMERIC_ROUTE_ID_PATTERN = /^\d+$/;

export function parseNumericRouteId(rawValue: string | null | undefined): NumericRouteIdState {
  if (rawValue === null || rawValue === undefined) {
    return { value: null, isMissing: true, isInvalid: false };
  }

  const value = rawValue.trim();
  if (value === "") {
    return { value: null, isMissing: true, isInvalid: false };
  }

  if (!NUMERIC_ROUTE_ID_PATTERN.test(value)) {
    return { value: null, isMissing: false, isInvalid: true };
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    return { value: null, isMissing: false, isInvalid: true };
  }

  return {
    value: parsed,
    isMissing: false,
    isInvalid: false,
  };
}

export function buildLegacyEntityRedirectPath({
  canonicalBasePath,
  hash,
  search,
}: {
  canonicalBasePath: string;
  hash: string;
  search: string;
}) {
  const params = new URLSearchParams(search);
  const parsed = parseNumericRouteId(params.get("id"));

  if (parsed.value === null || parsed.isMissing || parsed.isInvalid) {
    return null;
  }

  params.delete("id");

  const query = params.toString();
  const basePath = canonicalBasePath.replace(/\/+$/g, "");

  return `${basePath}/${encodeURIComponent(String(parsed.value))}${query ? `?${query}` : ""}${hash}`;
}
