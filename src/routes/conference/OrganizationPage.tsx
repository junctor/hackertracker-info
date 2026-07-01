import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import OrganizationDetails from "@/features/organizations/OrganizationDetails";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { OrganizationDetailsById } from "@/lib/types/ht-types/views";
import { PageId } from "@/lib/types/page-meta";
import useNumericQueryParam from "@/lib/utils/useNumericQueryParam";

type OrganizationPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function OrganizationPage({ conf, activePageId }: OrganizationPageProps) {
  const { value: organizationId, isReady, isMissing, isInvalid } = useNumericQueryParam("id");

  const shouldLoadDetails = isReady && !isMissing && !isInvalid && organizationId !== null;

  const {
    data: organizationsById,
    error,
    isLoading,
  } = useConferenceJson<OrganizationDetailsById>(
    conf,
    shouldLoadDetails ? "details/organizations.json" : null,
  );

  const organization =
    organizationId !== null ? organizationsById?.[String(organizationId)] : undefined;

  if (!isReady) return <LoadingScreen />;
  if (isInvalid) return <ErrorScreen msg="Invalid organization id." />;
  if (isMissing || organizationId === null) return <ErrorScreen msg="Missing organization id." />;
  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (!organization) return <ErrorScreen msg="Organization not found." />;

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
