import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ConferenceLoadingScreen from "@/features/app-shell/ConferenceLoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LocationsList from "@/features/locations/LocationsList";
import { aiMetadata, conferenceDataFeeds, conferencePath } from "@/lib/aiMetadata";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { LocationCardsView } from "@/lib/types/ht-types/views";
import { PageId } from "@/lib/types/page-meta";

type LocationsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
  title?: string;
  description?: string;
};

export default function LocationsPage({
  conf,
  activePageId,
  title = "Locations",
  description = `Rooms and venue locations for ${conf.name}.`,
}: LocationsPageProps) {
  const {
    data: locations,
    error,
    isLoading,
  } = useConferenceJson<LocationCardsView>(conf, "views/locationCards.json");

  if (isLoading) {
    return <ConferenceLoadingScreen conference={conf} activePageId={activePageId} />;
  }
  if (error || !locations) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>
          {title} | {conf.name}
        </title>
        {aiMetadata({
          title: `${title} | ${conf.name}`,
          description,
          path: conferencePath(conf, "locations"),
          jsonFeeds: conferenceDataFeeds(conf),
        })}
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <LocationsList locations={locations} title={title} description={description} />
      </ConferenceLayout>
    </>
  );
}
