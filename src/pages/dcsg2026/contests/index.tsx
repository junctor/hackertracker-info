import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { alphaSort, fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import OrganizationsList from "@/features/organizations/OrganizationsList";
import { OrganizationsCardsView } from "@/lib/types/ht-types";
import { getConference } from "@/lib/conferences";

export default function ContestsPage() {
  const conference = getConference("dcsg2026");

  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<OrganizationsCardsView>(
    `${conference.dataRoot}/views/organizationsCards.json`,
    fetcher,
  );

  if (isLoading) return <LoadingScreen />;
  if (error || !organizations) return <ErrorScreen />;

  const contests = organizations["49234"];

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
        <SiteHeader conference={conference} />
        <OrganizationsList
          organizations={contests}
          title="Contests"
          conference={conference}
        />
      </main>
    </>
  );
}
