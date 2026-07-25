import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import {
  buildLegacyEntityRedirectPath,
  parseNumericRouteId,
  type NumericRouteIdState,
} from "./routeIds";

export type NumericRouteParamState = NumericRouteIdState & {
  isReady: boolean;
  isRedirectingLegacyUrl: boolean;
};

export default function useNumericRouteParam(
  key: string,
  {
    legacyCanonicalBasePath,
  }: {
    legacyCanonicalBasePath?: string;
  } = {},
): NumericRouteParamState {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const routeValue = params[key];

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const legacyRedirectPath = useMemo(() => {
    if (routeValue !== undefined || !legacyCanonicalBasePath || !searchParams.has("id")) {
      return null;
    }

    return buildLegacyEntityRedirectPath({
      canonicalBasePath: legacyCanonicalBasePath,
      search: location.search,
      hash: location.hash,
    });
  }, [legacyCanonicalBasePath, location.hash, location.search, routeValue, searchParams]);

  useEffect(() => {
    if (!legacyRedirectPath) return;

    navigate(legacyRedirectPath, { replace: true });
  }, [legacyRedirectPath, navigate]);

  const rawValue =
    routeValue === undefined && searchParams.has("id") ? searchParams.get("id") : routeValue;

  const parsed = parseNumericRouteId(rawValue);

  return {
    ...parsed,
    isReady: true,
    isRedirectingLegacyUrl: legacyRedirectPath !== null,
  };
}
