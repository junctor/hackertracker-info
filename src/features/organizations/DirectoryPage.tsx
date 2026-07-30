import { JSX } from "react";

import type { ConferenceManifest } from "@/lib/conferences";
import type { PageId } from "@/lib/types/page-meta";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ConferenceLoadingScreen from "@/features/app-shell/ConferenceLoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import OrganizationDetails from "@/features/organizations/OrganizationDetails";
import OrganizationsList from "@/features/organizations/OrganizationsList";
import { aiMetadata, conferenceDataFeeds, conferencePath } from "@/lib/aiMetadata";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { getOrganizationDirectoryConfig } from "@/lib/menu";
import { conferenceCollectionPath, conferenceEntityPath, conferenceMenuPath } from "@/lib/routes";
import {
  DerivedTagIdsByLabel,
  OrganizationDetailsById,
  OrganizationsCardsView,
} from "@/lib/types/ht-types";
import useNumericRouteParam from "@/lib/utils/useNumericRouteParam";

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
  const directoryHref = conferenceCollectionPath(conf, routeSlug);
  const conferenceHomeHref = conferenceMenuPath(conf);
  const {
    value: orgId,
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
    isRedirectingLegacyUrl,
  } = useNumericRouteParam("id", { legacyCanonicalBasePath: directoryHref });
  const isDetailsRoute = isReady && !isIdMissing && !isIdInvalid && orgId !== null;
  const shouldLoadList = isReady && isIdMissing;

  const {
    data: organizations,
    error: organizationsError,
    isLoading: organizationsIsLoading,
  } = useConferenceJson<OrganizationsCardsView>(
    conf,
    shouldLoadList ? "views/organizationsCards.json" : null,
  );

  const {
    data: derivedTagIdsByLabel,
    error: tagError,
    isLoading: tagIsLoading,
  } = useConferenceJson<DerivedTagIdsByLabel>(
    conf,
    shouldLoadList ? "derived/tagIdsByLabel.json" : null,
  );

  const {
    data: organizationsById,
    error: organizationsStoreError,
    isLoading: organizationsStoreLoading,
  } = useConferenceJson<OrganizationDetailsById>(
    conf,
    isDetailsRoute ? "details/organizations.json" : null,
  );

  const selectedOrganization = isDetailsRoute ? organizationsById?.[String(orgId)] : undefined;

  const isLoading = organizationsIsLoading || tagIsLoading;
  const error = organizationsError || tagError;
  if (!isReady || isRedirectingLegacyUrl) {
    return (
      <ConferenceLoadingScreen
        conference={conf}
        activePageId={activePageId}
        label="organizations"
      />
    );
  }
  if (isIdInvalid) {
    return (
      <ErrorScreen
        title="Organization not found"
        copy={`Use a numeric organization ID, or browse ${title.toLowerCase()}.`}
        kicker="Not found"
        primaryActionHref={directoryHref}
        primaryActionLabel={`Browse ${title}`}
        secondaryActionHref={conferenceHomeHref}
        secondaryActionLabel="Conference Home"
      />
    );
  }

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
    if (organizationsStoreLoading) {
      return (
        <ConferenceLoadingScreen
          conference={conf}
          activePageId={activePageId}
          label="organization"
        />
      );
    }
    if (organizationsStoreError) {
      return (
        <ErrorScreen
          title="Couldn't load organization"
          copy={`The organization details could not be loaded. Try again, or browse ${title.toLowerCase()}.`}
          retryActionLabel="Retry"
          primaryActionHref={directoryHref}
          primaryActionLabel={`Browse ${title}`}
          secondaryActionHref={conferenceHomeHref}
          secondaryActionLabel="Conference Home"
        />
      );
    }
    if (!selectedOrganization) {
      return (
        <ErrorScreen
          title="Organization not found"
          copy={`No organization exists for ID ${orgId}.`}
          kicker="Not found"
          primaryActionHref={directoryHref}
          primaryActionLabel={`Browse ${title}`}
          secondaryActionHref={conferenceHomeHref}
          secondaryActionLabel="Conference Home"
        />
      );
    }

    pageContent = (
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <OrganizationDetails
          key={selectedOrganization.id}
          org={selectedOrganization}
          conference={conf}
        />
      </ConferenceLayout>
    );
  } else if (isIdMissing) {
    if (isLoading) {
      return (
        <ConferenceLoadingScreen
          conference={conf}
          activePageId={activePageId}
          label={title.toLowerCase()}
        />
      );
    }
    if (error || !organizations) {
      return (
        <ErrorScreen
          title={`Couldn't load ${title.toLowerCase()}`}
          copy={`The ${title.toLowerCase()} list could not be loaded. Try again, or return to the conference home page.`}
          retryActionLabel="Retry"
          primaryActionHref={conferenceHomeHref}
          primaryActionLabel="Conference Home"
        />
      );
    }

    const tagId = derivedTagIdsByLabel?.byLabel[tagLabel];
    if (!tagId) {
      return <ErrorScreen msg={`No '${tagLabel}' tag found for this conference.`} />;
    }

    const matchingOrganizations = organizations[tagId] ?? [];
    pageContent = (
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <OrganizationsList
          organizations={matchingOrganizations}
          title={title}
          detailsBasePath={directoryHref}
        />
      </ConferenceLayout>
    );
  } else {
    return (
      <ErrorScreen
        title="Organization ID required"
        copy="This page needs an organization ID."
        primaryActionHref={directoryHref}
        primaryActionLabel={`Browse ${title}`}
        secondaryActionHref={conferenceHomeHref}
        secondaryActionLabel="Conference Home"
      />
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {aiMetadata({
          title: pageTitle,
          description: metaDescription,
          path:
            selectedOrganization && orgId !== null
              ? conferenceEntityPath(conf, routeSlug, orgId)
              : conferencePath(conf, routeSlug),
          jsonFeeds: conferenceDataFeeds(conf),
        })}
      </Head>
      {pageContent}
    </>
  );
}
