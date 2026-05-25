import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import OrganizationDetails from "@/features/organizations/OrganizationDetails";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { OrganizationsStore } from "@/lib/types/ht-types";
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
    data: organizationsStore,
    error,
    isLoading,
  } = useConferenceJson<OrganizationsStore>(
    conf,
    shouldLoadDetails ? "entities/organizations.json" : null,
  );

  if (!isReady) return <LoadingScreen />;
  if (isInvalid) return <ErrorScreen msg="Invalid organization id." />;
  if (isMissing || organizationId === null) return <ErrorScreen msg="Missing organization id." />;
  if (isLoading) return <LoadingScreen />;
  if (error || !organizationsStore) return <ErrorScreen />;

  const organization = organizationsStore.byId[organizationId] ?? null;
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
        <OrganizationDetails org={organization} conference={conf} />
      </ConferenceLayout>
    </>
  );
}
