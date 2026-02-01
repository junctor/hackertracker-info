import React from "react";
import DirectoryPage from "@/features/organizations/DirectoryPage";
import { OrganizationDirectoryPageProps } from "@/lib/types/orgs";
import { getOrganizationDirectoryConfig } from "@/lib/menu";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";

const DIRECTORY_CONFIG = getOrganizationDirectoryConfig("contests")!;

export default function ContestsPage({
  conf,
  activePageId,
}: OrganizationDirectoryPageProps) {
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

export const getStaticProps: GetStaticProps<
  OrganizationDirectoryPageProps
> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "contests" } };
};
