import React, { useMemo } from "react";
import Head from "next/head";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import OrganizationsList from "@/features/organizations/OrganizationsList";
import OrganizationDetails from "@/features/organizations/OrganizationDetails";
import {
  DerivedTagIdsByLabel,
  OrganizationsCardsView,
  OrganizationsStore,
} from "@/lib/types/ht-types";
import { ConferenceManifest } from "@/lib/conferences";
import { PageId } from "@/lib/types/page-meta";
import useNumericQueryParam from "@/lib/utils/useNumericQueryParam";

type Props = {
  conf: ConferenceManifest;
  activePageId: PageId;
  title: string;
  tagLabel: string;
  description?: string;
  routeSlug: string;
};

export default function DirectoryPage({
  conf,
  activePageId,
  title,
  tagLabel,
  description,
  routeSlug,
}: Props) {
  const router = useRouter();
  const {
    value: orgId,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
  } = useNumericQueryParam("id");

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

  const isDetailsRoute = orgId !== null;
  const {
    data: organizationsStore,
    error: organizationsStoreError,
    isLoading: organizationsStoreLoading,
  } = useSWR<OrganizationsStore>(
    isDetailsRoute ? `${conf.dataRoot}/entities/organizations.json` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const selectedOrganization = useMemo(() => {
    if (!organizationsStore || orgId === null) return null;
    return organizationsStore.byId[orgId] ?? null;
  }, [organizationsStore, orgId]);

  const isLoading = organizationsIsLoading || tagIsLoading;
  const error = organizationsError || tagError;

  if (!router.isReady) return <LoadingScreen />;
  if (isIdInvalid) return <ErrorScreen msg="Invalid organization id." />;

  const listDescription = description?.trim();
  const fallbackDescription =
    listDescription && listDescription.length > 0
      ? listDescription
      : `Explore all ${conf.name} ${title.toLowerCase()}`;
  const selectedDescription = selectedOrganization?.description?.trim();
  const metaDescription =
    selectedDescription && selectedDescription.length > 0
      ? selectedDescription
      : fallbackDescription;
  const pageTitle = selectedOrganization
    ? `${selectedOrganization.name} | ${conf.name}`
    : `${title} | ${conf.name}`;

  if (isDetailsRoute) {
    if (organizationsStoreLoading) return <LoadingScreen />;
    if (organizationsStoreError || !organizationsStore) return <ErrorScreen />;
    if (!selectedOrganization)
      return <ErrorScreen msg="Organization not found" />;

    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={metaDescription} />
        </Head>
        <main>
          <SiteHeader conference={conf} activePageId={activePageId} />
          <OrganizationDetails org={selectedOrganization} />
        </main>
      </>
    );
  }

  if (isIdMissing) {
    if (isLoading) return <LoadingScreen />;
    if (error || !organizations) return <ErrorScreen />;

    const tagId = derivedTagIdsByLabel?.byLabel[tagLabel];
    if (!tagId) {
      return (
        <ErrorScreen msg={`No '${tagLabel}' tag found for this conference.`} />
      );
    }

    const matchingOrganizations = organizations[tagId] ?? [];
    const detailsBasePath = `/${conf.slug}/${routeSlug}`;

    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={metaDescription} />
        </Head>
        <main>
          <SiteHeader conference={conf} activePageId={activePageId} />
          <OrganizationsList
            organizations={matchingOrganizations}
            title={title}
            detailsBasePath={detailsBasePath}
          />
        </main>
      </>
    );
  }

  return <ErrorScreen msg="Missing organization id." />;
}
