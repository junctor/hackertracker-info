import React from "react";

import DirectoryPage from "@/features/organizations/DirectoryPage";
import { getOrganizationDirectoryConfig } from "@/lib/menu";
import { OrganizationDirectoryPageProps } from "@/lib/types/orgs";

const DIRECTORY_CONFIG = getOrganizationDirectoryConfig("departments")!;

export default function DepartmentsPage({ conf, activePageId }: OrganizationDirectoryPageProps) {
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
