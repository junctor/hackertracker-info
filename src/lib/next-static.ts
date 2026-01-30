import type { GetStaticPaths, GetStaticPropsContext } from "next";
import { CONFERENCES, getConference } from "@/lib/conferences";

export const buildConferenceStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(CONFERENCES).map((conf) => ({
    params: { conf },
  })),
  fallback: false,
});

export function getConferenceFromParams(
  params: GetStaticPropsContext["params"],
) {
  if (!params || typeof params.conf !== "string") return null;
  const conference = getConference(params.conf);
  return conference ? { conf: conference } : null;
}
