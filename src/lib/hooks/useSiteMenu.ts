import { useMemo } from "react";

import { type ConferenceManifest } from "@/lib/conferences";
import { getSiteMenu } from "@/lib/menu";

export function useSiteMenu(conference: ConferenceManifest) {
  return useMemo(() => getSiteMenu(conference), [conference]);
}
