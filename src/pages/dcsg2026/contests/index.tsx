import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { alphaSort, fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import { Organizations as OrgsType } from "@/lib/types/info";
import OrganizationsList from "@/features/organizations/OrganizationsList";

export default function ContestsPage() {
  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<OrgsType>("/ht/dcsg2026/organizations.json", fetcher);

  if (isLoading) return <LoadingScreen />;
  if (error || !organizations) return <ErrorScreen />;

  const contests = organizations
    .filter((org) => org.tag_ids.includes(49234))
    .sort((a, b) => {
      return alphaSort(a.name, b.name);
    });

  return (
    <>
      <Head>
        <title>Contests | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content="Explore all DEF CON Singapore 2026 Contests"
        />
      </Head>
      <main>
        <SiteHeader />
        <OrganizationsList orgs={contests} title="Contests" confSlug="dcsg2026" />
      </main>
    </>
  );
}
