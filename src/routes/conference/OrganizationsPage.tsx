import { useMemo } from "react";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import OrganizationsList from "@/features/organizations/OrganizationsList";
import { aiMetadata, conferenceDataFeeds, conferencePath } from "@/lib/aiMetadata";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { conferenceCollectionPath } from "@/lib/routes";
import { OrganizationCard, OrganizationsCardsView } from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";
import useNumericRouteParam from "@/lib/utils/useNumericRouteParam";

type OrganizationsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

function flattenOrganizations(organizationsByTag: OrganizationsCardsView) {
  const byId = new Map<number, OrganizationCard>();

  for (const organizations of Object.values(organizationsByTag)) {
    for (const organization of organizations) {
      byId.set(organization.id, organization);
    }
  }

  return Array.from(byId.values());
}

export default function OrganizationsPage({ conf, activePageId }: OrganizationsPageProps) {
  const organizationsHref = conferenceCollectionPath(conf, "organizations");
  const { isInvalid: legacyIdIsInvalid, isRedirectingLegacyUrl } = useNumericRouteParam("id", {
    legacyCanonicalBasePath: organizationsHref,
  });
  const {
    data: organizationsByTag,
    error,
    isLoading,
  } = useConferenceJson<OrganizationsCardsView>(
    conf,
    isRedirectingLegacyUrl ? null : "views/organizationsCards.json",
  );
  const organizations = useMemo(
    () => (organizationsByTag ? flattenOrganizations(organizationsByTag) : []),
    [organizationsByTag],
  );
  const pageTitle = `Organizations | ${conf.name}`;

  if (isRedirectingLegacyUrl || isLoading) return <LoadingScreen />;
  if (legacyIdIsInvalid) {
    return (
      <ErrorScreen
        title="Organization not found"
        copy="Use a numeric organization ID, or browse all organizations."
        kicker="Not found"
        primaryActionHref={organizationsHref}
        primaryActionLabel="Browse Organizations"
      />
    );
  }
  if (error || !organizationsByTag) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {aiMetadata({
          title: pageTitle,
          description: `Browse organizations for ${conf.name}.`,
          path: conferencePath(conf, "organizations"),
          jsonFeeds: conferenceDataFeeds(conf),
        })}
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <OrganizationsList
          organizations={organizations}
          title="Organizations"
          detailsBasePath={organizationsHref}
        />
      </ConferenceLayout>
    </>
  );
}
