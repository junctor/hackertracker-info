import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ConferenceLoadingScreen from "@/features/app-shell/ConferenceLoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import ConferenceMapsList from "@/features/maps/ConferenceMapsList";
import { aiMetadata, conferenceDataFeeds, conferencePath } from "@/lib/aiMetadata";
import { type ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { type ConferenceEntity } from "@/lib/types/ht-types";
import { type PageId } from "@/lib/types/page-meta";

type MapsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function MapsPage({ conf, activePageId }: MapsPageProps) {
  const {
    data: conference,
    error,
    isLoading,
  } = useConferenceJson<ConferenceEntity>(conf, "conference.json");

  if (isLoading) {
    return <ConferenceLoadingScreen conference={conf} activePageId={activePageId} />;
  }
  if (error || !conference) return <ErrorScreen />;

  const title = `Maps | ${conference.name}`;
  const description = `Venue maps for ${conference.name}.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        {aiMetadata({
          title,
          description,
          path: conferencePath(conf, "maps"),
          jsonFeeds: [
            ...conferenceDataFeeds(conf),
            { title: `${conf.name} conference details`, href: `${conf.dataRoot}/conference.json` },
          ],
        })}
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <ConferenceMapsList conference={conference} />
      </ConferenceLayout>
    </>
  );
}
