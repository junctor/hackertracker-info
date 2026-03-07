import type { GetStaticProps } from "next";

import React from "react";

import DirectoryPage from "@/features/organizations/DirectoryPage";
import { getOrganizationDirectoryConfig } from "@/lib/menu";
import { buildConferenceStaticPaths, getConferenceFromParams } from "@/lib/next-static";
import { OrganizationDirectoryPageProps } from "@/lib/types/orgs";

const DIRECTORY_CONFIG = getOrganizationDirectoryConfig("communities")!;

export default function CommunitiesPage({ conf, activePageId }: OrganizationDirectoryPageProps) {
  return (
    <DirectoryPage
      conf={conf}
      activePageId={activePageId}
      title={DIRECTORY_CONFIG.title}
      tagLabel={DIRECTORY_CONFIG.tagLabel}
      description={DIRECTORY_CONFIG.description}
      routeSlug={DIRECTORY_CONFIG.slug}
    />
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<OrganizationDirectoryPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "communities" } };
};
