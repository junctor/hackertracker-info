import Head from "next/head";
import { useRouter } from "next/router";
import { JSX, useMemo } from "react";

import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import OrganizationDetails from "@/features/organizations/OrganizationDetails";
import OrganizationsList from "@/features/organizations/OrganizationsList";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import {
  DerivedTagIdsByLabel,
  OrganizationsCardsView,
  OrganizationsStore,
} from "@/lib/types/ht-types";
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
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
  } = useNumericQueryParam(router, "id");

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
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          <OrganizationDetails org={selectedOrganization} conference={conf} />
        </main>
        <SiteFooter />
      </div>
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
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          <OrganizationsList
            organizations={matchingOrganizations}
            title={title}
            detailsBasePath={detailsBasePath}
          />
        </main>
        <SiteFooter />
      </div>
    );
  } else {
    return <ErrorScreen msg="Missing organization id." />;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
      </Head>
      {pageContent}
    </>
  );
}
