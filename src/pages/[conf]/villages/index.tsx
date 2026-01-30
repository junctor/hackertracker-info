import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import OrganizationsList from "@/features/organizations/OrganizationsList";
import { OrganizationsCardsView } from "@/lib/types/ht-types";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";

type VillagesPageProps = {
  conf: ConferenceManifest;
};

export default function VillagesPage({ conf }: VillagesPageProps) {
  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<OrganizationsCardsView>(
    `${conf.dataRoot}/views/organizationsCards.json`,
    fetcher,
    { revalidateOnFocus: false },
  );

  if (isLoading) return <LoadingScreen />;
  if (error || !organizations) return <ErrorScreen />;

  const villages = organizations["48955"] ?? [];

  return (
    <>
      <Head>
        <title>Villages | {conf.name}</title>
        <meta
          name="description"
          content={`Explore all ${conf.name} villages`}
        />
      </Head>
      <main>
        <SiteHeader conference={conf} />
        <OrganizationsList
          organizations={villages}
          title="Villages"
          conference={conf}
        />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<VillagesPageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf } };
};
