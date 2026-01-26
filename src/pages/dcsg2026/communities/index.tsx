import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import OrganizationsList from "@/features/organizations/OrganizationsList";
import { getConference } from "@/lib/conferences";
import { OrganizationsCardsView } from "@/lib/types/ht-types";

export default function CommunitiesPage() {
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

  const communities = organizations["48953"];

  return (
    <>
      <Head>
        <title>Communities | {conference.name}</title>
        <meta
          name="description"
          content={`Explore all ${conference.name} Communities`}
        />
      </Head>
      <main>
        <SiteHeader conference={conference} />
        <OrganizationsList
          organizations={communities}
          title="Communities"
          conference={conference}
        />
      </main>
    </>
  );
}
