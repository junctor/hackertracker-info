import React from "react";
import DirectoryPage from "@/features/organizations/DirectoryPage";
import { ConferenceManifest } from "@/lib/conferences";
import { PageId } from "@/lib/types/page-meta";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";

type CommunitiesPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function CommunitiesPage({
  conf,
  activePageId,
}: CommunitiesPageProps) {
  return (
    <DirectoryPage
      conf={conf}
      activePageId={activePageId}
      title="Communities"
      tagLabel="community"
    />
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<CommunitiesPageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "communities" } };
};
