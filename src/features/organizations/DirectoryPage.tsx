import React from "react";
import Head from "next/head";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import OrganizationsList from "@/features/organizations/OrganizationsList";
import {
  DerivedTagIdsByLabel,
  OrganizationsCardsView,
} from "@/lib/types/ht-types";
import { ConferenceManifest } from "@/lib/conferences";

type Props = {
  conf: ConferenceManifest;
  title: string;
  tagLabel: string;
  description?: string;
};

export default function DirectoryPage({
  conf,
  title,
  tagLabel,
  description,
}: Props) {
  const {
    data: organizations,
    error: organizationsError,
    isLoading: organizationsIsLoading,
  } = useSWR<OrganizationsCardsView>(
    `${conf.dataRoot}/views/organizationsCards.json`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const {
    data: derivedTagIdsByLabel,
    error: tagError,
    isLoading: tagIsLoading,
  } = useSWR<DerivedTagIdsByLabel>(
    `${conf.dataRoot}/derived/TagIdsByLabel.json`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const isLoading = organizationsIsLoading || tagIsLoading;
  const error = organizationsError || tagError;

  if (isLoading) return <LoadingScreen />;
  if (error || !organizations) return <ErrorScreen />;

  const tagId = derivedTagIdsByLabel?.byLabel[tagLabel];
  if (!tagId) {
    return (
      <ErrorScreen msg={`No '${tagLabel}' tag found for this conference.`} />
    );
  }

  const matchingOrganizations = organizations[tagId] ?? [];
  const metaDescription =
    description ?? `Explore all ${conf.name} ${title.toLowerCase()}`;

  return (
    <>
      <Head>
        <title>
          {title} | {conf.name}
        </title>
        <meta name="description" content={metaDescription} />
      </Head>
      <main>
        <SiteHeader conference={conf} />
        <OrganizationsList
          organizations={matchingOrganizations}
          title={title}
          conference={conf}
        />
      </main>
    </>
  );
}
