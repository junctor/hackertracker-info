import React from "react";
import DirectoryPage from "@/features/organizations/DirectoryPage";
import { ConferenceManifest } from "@/lib/conferences";
import { PageId } from "@/lib/types/page-meta";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";

type DepartmentsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function DepartmentsPage({
  conf,
  activePageId,
}: DepartmentsPageProps) {
  return (
    <DirectoryPage
      conf={conf}
      activePageId={activePageId}
      title="Departments"
      tagLabel="def_con_department"
    />
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<DepartmentsPageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "departments" } };
};
