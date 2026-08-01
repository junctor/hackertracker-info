export * from "@/features/filters/tagFilters";

import { buildFilterPath } from "@/features/filters/filterRoutes";

export function buildScheduleFilterPath(confSlug: string, searchParams: URLSearchParams): string {
  return buildFilterPath(confSlug, "schedule", searchParams);
}
