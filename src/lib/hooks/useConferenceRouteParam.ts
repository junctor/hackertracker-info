import { useParams } from "react-router";

import { ConferenceManifest, getConference } from "@/lib/conferences";

export function useConferenceRouteParam(): ConferenceManifest | null {
  const { conf } = useParams<"conf">();
  return conf ? getConference(conf) : null;
}
