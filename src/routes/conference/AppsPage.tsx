import Head from "@/components/Head";
import AppsLanding from "@/features/apps/AppsLanding";
import { type ConferenceManifest } from "@/lib/conferences";
import { type PageId } from "@/lib/types/page-meta";

type AppsPageProps = {
  conf?: ConferenceManifest;
  activePageId?: PageId;
};

export default function AppsPage({ conf }: AppsPageProps) {
  const title = conf ? `Hacker Tracker Apps | ${conf.name}` : "Hacker Tracker Apps";
  const description = conf
    ? `Official ${conf.name} schedule companion. Choose iOS, Android, or Web.`
    : "Official DEF CON schedule companion. Choose iOS, Android, or Web.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <div className="ui-page-shell ui-apps-page-shell">
        <main id="main-content" className="ui-page-main">
          <AppsLanding conference={conf} />
        </main>
      </div>
    </>
  );
}
