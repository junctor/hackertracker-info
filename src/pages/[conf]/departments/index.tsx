import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { alphaSort, fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import { Organizations as OrgsType } from "@/lib/types/info";
import OrganizationsList from "@/features/organizations/OrganizationsList";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";
import { PageId } from "@/lib/types/page-meta";

type DepartmentsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function DepartmentsPage({
  conf,
  activePageId,
}: DepartmentsPageProps) {
  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<OrgsType>("/ht/organizations.json", fetcher);

  if (isLoading) return <LoadingScreen />;
  if (error || !organizations) return <ErrorScreen />;

  const departments = organizations
    .filter((org) => org.tag_ids.includes(48795))
    .sort((a, b) => {
      return alphaSort(a.name, b.name);
    });

  return (
    <>
      <Head>
        <title>Villages | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content="Explore all DEF CON Singapore 2026 Departments"
        />
      </Head>
      <main>
        <SiteHeader conference={conf} activePageId={activePageId} />
        <OrganizationsList orgs={departments} title="Departments" confSlug="" />
      </main>
    </>
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
