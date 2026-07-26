import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import OrganizationDetails from "@/features/organizations/OrganizationDetails";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { conferenceCollectionPath, conferenceMenuPath } from "@/lib/routes";
import { OrganizationDetailsById } from "@/lib/types/ht-types/views";
import { PageId } from "@/lib/types/page-meta";
import useNumericRouteParam from "@/lib/utils/useNumericRouteParam";

type OrganizationPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function OrganizationPage({ conf, activePageId }: OrganizationPageProps) {
  const {
    value: organizationId,
    isReady,
    isMissing,
    isInvalid,
    isRedirectingLegacyUrl,
  } = useNumericRouteParam("id", {
    legacyCanonicalBasePath: conferenceCollectionPath(conf, "organizations"),
  });

  const shouldLoadDetails = isReady && !isMissing && !isInvalid && organizationId !== null;

  const {
    data: organizationsById,
    error,
    isLoading,
  } = useConferenceJson<OrganizationDetailsById>(
    conf,
    shouldLoadDetails ? "details/organizations.json" : null,
  );

  const organization = shouldLoadDetails ? organizationsById?.[String(organizationId)] : undefined;
  const organizationsHref = `/${conf.slug}/communities/`;
  const conferenceHomeHref = conferenceMenuPath(conf);

  if (!isReady || isRedirectingLegacyUrl) return <LoadingScreen />;
  if (isInvalid) {
    return (
      <ErrorScreen
        title="Organization not found"
        copy="Use a numeric organization ID, or browse conference communities."
        kicker="Not found"
        primaryActionHref={organizationsHref}
        primaryActionLabel="Browse Communities"
        secondaryActionHref={conferenceHomeHref}
        secondaryActionLabel="Conference Home"
      />
    );
  }
  if (isMissing || organizationId === null) {
    return (
      <ErrorScreen
        title="Organization ID required"
        copy="This page needs an organization ID."
        primaryActionHref={organizationsHref}
        primaryActionLabel="Browse Communities"
        secondaryActionHref={conferenceHomeHref}
        secondaryActionLabel="Conference Home"
      />
    );
  }
  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (!organization) {
    return (
      <ErrorScreen
        title="Organization not found"
        copy={`No organization exists for ID ${organizationId}.`}
        kicker="Not found"
        primaryActionHref={organizationsHref}
        primaryActionLabel="Browse Communities"
        secondaryActionHref={conferenceHomeHref}
        secondaryActionLabel="Conference Home"
      />
    );
  }

  const description =
    organization.description.trim() || `Learn more about ${organization.name} at ${conf.name}.`;

  return (
    <>
      <Head>
        <title>
          {organization.name} | {conf.name}
        </title>
        <meta name="description" content={description} />
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <OrganizationDetails key={organization.id} org={organization} conference={conf} />
      </ConferenceLayout>
    </>
  );
}
