import React from "react";
import DirectoryPage from "@/features/organizations/DirectoryPage";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";

type VillagesPageProps = {
  conf: ConferenceManifest;
};

export default function VillagesPage({ conf }: VillagesPageProps) {
  return <DirectoryPage conf={conf} title="Villages" tagLabel="village" />;
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<VillagesPageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf } };
};
