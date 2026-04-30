import { useMemo } from "react";
import { useSearchParams } from "react-router";

export type NumericQueryParamState = {
  value: number | null;
  isReady: boolean;
  isMissing: boolean;
  isInvalid: boolean;
};

export default function useNumericQueryParam(key: string): NumericQueryParamState {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const rawValue = searchParams.get(key);
    if (rawValue === null) {
      return { value: null, isReady: true, isMissing: true, isInvalid: false };
    }

    const value = rawValue.trim();
    if (value === "") {
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
  }, [key, searchParams]);
}
