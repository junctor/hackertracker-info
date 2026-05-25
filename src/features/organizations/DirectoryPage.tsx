import { JSX, useMemo } from "react";

import type { ConferenceManifest } from "@/lib/conferences";
import type { PageId } from "@/lib/types/page-meta";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import OrganizationDetails from "@/features/organizations/OrganizationDetails";
import OrganizationsList from "@/features/organizations/OrganizationsList";
import { aiMetadata, conferenceDataFeeds, conferencePath } from "@/lib/aiMetadata";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { getOrganizationDirectoryConfig } from "@/lib/menu";
import {
  DerivedTagIdsByLabel,
  OrganizationsCardsView,
  OrganizationsStore,
} from "@/lib/types/ht-types";
import useNumericQueryParam from "@/lib/utils/useNumericQueryParam";

type Props = {
  conf: ConferenceManifest;
  activePageId: PageId;
  title: string;
  tagLabel: string;
  description?: string;
  routeSlug: string;
};

type OrganizationDirectoryPageProps = Pick<Props, "conf" | "activePageId">;

export function createOrganizationDirectoryRoute(directoryPageId: PageId) {
  const directoryConfig = getOrganizationDirectoryConfig(directoryPageId)!;

  return function OrganizationDirectoryRoute({
    conf,
    activePageId,
  }: OrganizationDirectoryPageProps) {
    return (
      <DirectoryPage
        conf={conf}
        activePageId={activePageId}
        title={directoryConfig.title}
        tagLabel={directoryConfig.tagLabel}
        description={directoryConfig.description}
        routeSlug={directoryConfig.slug}
      />
    );
  };
}

export default function DirectoryPage({
  conf,
  activePageId,
  title,
  tagLabel,
  description,
  routeSlug,
}: Props) {
  const {
    value: orgId,
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
  } = useNumericQueryParam("id");

  const {
    data: organizations,
    error: organizationsError,
    isLoading: organizationsIsLoading,
  } = useConferenceJson<OrganizationsCardsView>(conf, "views/organizationsCards.json");

  const {
    data: derivedTagIdsByLabel,
    error: tagError,
    isLoading: tagIsLoading,
  } = useConferenceJson<DerivedTagIdsByLabel>(conf, "derived/tagIdsByLabel.json");

  const isDetailsRoute = orgId !== null;
  const {
    data: organizationsStore,
    error: organizationsStoreError,
    isLoading: organizationsStoreLoading,
  } = useConferenceJson<OrganizationsStore>(
    conf,
    isDetailsRoute ? "entities/organizations.json" : null,
  );

  const selectedOrganization = useMemo(() => {
    if (!organizationsStore || orgId === null) return null;
    return organizationsStore.byId[orgId] ?? null;
  }, [organizationsStore, orgId]);

  const isLoading = organizationsIsLoading || tagIsLoading;
  const error = organizationsError || tagError;

  if (!isReady) return <LoadingScreen />;
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

  let pageContent: JSX.Element;
  if (isDetailsRoute) {
    if (organizationsStoreLoading) return <LoadingScreen />;
    if (organizationsStoreError || !organizationsStore) return <ErrorScreen />;
    if (!selectedOrganization) return <ErrorScreen msg="Organization not found" />;

    pageContent = (
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <OrganizationDetails org={selectedOrganization} conference={conf} />
      </ConferenceLayout>
    );
  } else if (isIdMissing) {
    if (isLoading) return <LoadingScreen />;
    if (error || !organizations) return <ErrorScreen />;

    const tagId = derivedTagIdsByLabel?.byLabel[tagLabel];
    if (!tagId) {
      return <ErrorScreen msg={`No '${tagLabel}' tag found for this conference.`} />;
    }

    const matchingOrganizations = organizations[tagId] ?? [];
    const detailsBasePath = `/${conf.slug}/${routeSlug}`;

    pageContent = (
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <OrganizationsList
          organizations={matchingOrganizations}
          title={title}
          detailsBasePath={detailsBasePath}
        />
      </ConferenceLayout>
    );
  } else {
    return <ErrorScreen msg="Missing organization id." />;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {aiMetadata({
          title: pageTitle,
          description: metaDescription,
          path: conferencePath(
            conf,
            selectedOrganization && orgId !== null ? `${routeSlug}?id=${orgId}` : routeSlug,
          ),
          jsonFeeds: conferenceDataFeeds(conf),
        })}
      </Head>
      {pageContent}
    </>
  );
}
