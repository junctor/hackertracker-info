import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { alphaSort, fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import { Organizations as OrgsType } from "@/lib/types/info";
import OrganizationsList from "@/features/organizations/OrganizationsList";

export default function DepartmentsPage() {
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
        <SiteHeader />
        <OrganizationsList orgs={departments} title="Departments" confSlug="" />
      </main>
    </>
  );
}
