import { useMemo } from "react";
import { useRouter } from "next/router";

export type NumericQueryParamState = {
  value: number | null;
  isMissing: boolean;
  isInvalid: boolean;
};

export default function useNumericQueryParam(
  key: string,
): NumericQueryParamState {
  const router = useRouter();

  return useMemo(() => {
    if (!router.isReady) {
      return { value: null, isMissing: false, isInvalid: false };
    }

    const rawValue = router.query[key];
    if (rawValue === undefined) {
      return { value: null, isMissing: true, isInvalid: false };
    }

    const value = Array.isArray(rawValue) ? (rawValue[0] ?? "") : rawValue;
    if (typeof value !== "string" || value.trim() === "") {
      return { value: null, isMissing: true, isInvalid: false };
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return { value: null, isMissing: false, isInvalid: true };
    }

    return { value: parsed, isMissing: false, isInvalid: false };
  }, [router.isReady, router.query, key]);
}
