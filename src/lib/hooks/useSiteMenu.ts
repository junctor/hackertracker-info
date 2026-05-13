import { useMemo } from "react";

import { type ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { getSiteMenu } from "@/lib/menu";
import { type DerivedSiteMenu } from "@/lib/types/ht-types";

export function useSiteMenu(conference: ConferenceManifest) {
  const { data, error } = useConferenceJson<DerivedSiteMenu>(conference, "derived/siteMenu.json", {
    shouldRetryOnError: false,
  });

  return useMemo(() => getSiteMenu(conference, error ? null : data), [conference, data, error]);
}
