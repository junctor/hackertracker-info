import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import OrganizationsList from "@/features/organizations/OrganizationsList";
import { OrganizationsCardsView } from "@/lib/types/ht-types";
import { getConference } from "@/lib/conferences";

export default function VillagesPage() {
  const conference = getConference("dcsg2026");

  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<OrganizationsCardsView>(
    `${conference.dataRoot}/views/organizationsCards.json`,
    fetcher,
    { revalidateOnFocus: false },
  );

  if (isLoading) return <LoadingScreen />;
  if (error || !organizations) return <ErrorScreen />;

  const villages = organizations["48955"] ?? [];

  return (
    <>
      <Head>
        <title>Villages | {conference.name}</title>
        <meta
          name="description"
          content={`Explore all ${conference.name} villages`}
        />
      </Head>
      <main>
        <SiteHeader conference={conference} />
        <OrganizationsList
          organizations={villages}
          title="Villages"
          conference={conference}
        />
      </main>
    </>
  );
}
