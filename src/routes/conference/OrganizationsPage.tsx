import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ConferenceLoadingScreen from "@/features/app-shell/ConferenceLoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import OrganizationsList from "@/features/organizations/OrganizationsList";
import { aiMetadata, conferenceDataFeeds, conferencePath } from "@/lib/aiMetadata";
import { ConferenceManifest } from "@/lib/conferences";
import { ORGANIZATIONS_BROWSE_PATH } from "@/lib/dataContract";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { conferenceCollectionPath } from "@/lib/routes";
import { OrganizationsBrowseView } from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";
import useNumericRouteParam from "@/lib/utils/useNumericRouteParam";

type OrganizationsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function OrganizationsPage({ conf, activePageId }: OrganizationsPageProps) {
  const organizationsHref = conferenceCollectionPath(conf, "organizations");
  const { isInvalid: legacyIdIsInvalid, isRedirectingLegacyUrl } = useNumericRouteParam("id", {
    legacyCanonicalBasePath: organizationsHref,
  });
  const {
    data: organizationsBrowse,
    error,
    isLoading,
  } = useConferenceJson<OrganizationsBrowseView>(
    conf,
    isRedirectingLegacyUrl ? null : ORGANIZATIONS_BROWSE_PATH,
  );
  const pageTitle = `Organizations | ${conf.name}`;

  if (isRedirectingLegacyUrl || isLoading) {
    return <ConferenceLoadingScreen conference={conf} activePageId={activePageId} />;
  }
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
  if (error || !organizationsBrowse) return <ErrorScreen />;

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
          organizations={organizationsBrowse.all}
          title="Organizations"
          detailsBasePath={organizationsHref}
        />
      </ConferenceLayout>
    </>
  );
}
