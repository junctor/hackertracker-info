import Head from "@/components/Head";
import AnnouncementsList from "@/features/announcements/AnnouncementsList";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ConferenceLoadingScreen from "@/features/app-shell/ConferenceLoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { AnnouncementsListView } from "@/lib/types/ht-types/views";
import { PageId } from "@/lib/types/page-meta";

type AnnouncementsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function AnnouncementsPage({ conf, activePageId }: AnnouncementsPageProps) {
  const {
    data: articles,
    error,
    isLoading,
  } = useConferenceJson<AnnouncementsListView>(conf, "views/announcementsList.json");

  if (isLoading) {
    return <ConferenceLoadingScreen conference={conf} activePageId={activePageId} />;
  }
  if (error || !articles) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Announcements | {conf.name}</title>
        <meta name="description" content={`Latest announcements and updates for ${conf.name}.`} />
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <AnnouncementsList announcements={articles} conference={conf} />
      </ConferenceLayout>
    </>
  );
}
