import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import Menu from "@/features/home/Menu";
import { ConferenceManifest } from "@/lib/conferences";

type MenuPageProps = {
  conf: ConferenceManifest;
};

export default function MenuPage({ conf }: MenuPageProps) {
  const pageTitle = `${conf.name} | info.defcon.org`;
  const pageDescription = `Conference sections for schedule, updates, and key resources.`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://info.defcon.org/${conf.slug}/menu`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ConferenceLayout conference={conf} activePageId="home">
        <Menu conference={conf} />
      </ConferenceLayout>
    </>
  );
}
