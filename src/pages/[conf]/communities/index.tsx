import React from "react";
import DirectoryPage from "@/features/organizations/DirectoryPage";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";

type CommunitiesPageProps = {
  conf: ConferenceManifest;
};

export default function CommunitiesPage({ conf }: CommunitiesPageProps) {
  return <DirectoryPage conf={conf} title="Communities" tagLabel="community" />;
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<CommunitiesPageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf } };
};
