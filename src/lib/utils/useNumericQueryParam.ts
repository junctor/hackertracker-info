import { NextRouter } from "next/router";
import { useMemo } from "react";

export type NumericQueryParamState = {
  value: number | null;
  isReady: boolean;
  isMissing: boolean;
  isInvalid: boolean;
};

export default function useNumericQueryParam(
  router: NextRouter,
  key: string,
): NumericQueryParamState {
  return useMemo(() => {
    if (!router.isReady) {
      return {
        value: null,
        isReady: false,
        isMissing: false,
        isInvalid: false,
      };
    }

    const rawValue = router.query[key];
    if (rawValue === undefined) {
      return { value: null, isReady: true, isMissing: true, isInvalid: false };
    }

    const value = Array.isArray(rawValue) ? (rawValue[0] ?? "") : rawValue;
    if (typeof value !== "string" || value.trim() === "") {
      return { value: null, isReady: true, isMissing: true, isInvalid: false };
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
      return { value: null, isReady: true, isMissing: false, isInvalid: true };
    }

    return {
      value: parsed,
      isReady: true,
      isMissing: false,
      isInvalid: false,
    };
  }, [router.isReady, router.query, key]);
}
