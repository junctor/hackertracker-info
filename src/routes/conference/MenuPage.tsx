import type { ConferenceManifest } from "@/lib/conferences";
import type { PageId } from "@/lib/types/page-meta";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import Menu from "@/features/home/Menu";
import { aiMetadata, conferenceDataFeeds, conferencePath } from "@/lib/aiMetadata";

type MenuPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function MenuPage({ conf, activePageId }: MenuPageProps) {
  const pageTitle = `${conf.name} | info.defcon.org`;
  const pageDescription = `${conf.name} schedule, announcements, maps, people, and key conference resources.`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {aiMetadata({
          title: pageTitle,
          description: pageDescription,
          path: conferencePath(conf),
          jsonFeeds: conferenceDataFeeds(conf),
        })}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <Menu conference={conf} />
      </ConferenceLayout>
    </>
  );
}
