import Head from "@/components/Head";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
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
        <meta name="theme-color" content="#020617" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="ui-page-shell bg-slate-950 text-slate-100">
        <SiteHeader conference={conf} activePageId="home" />
        <main id="main-content" className="ui-page-main">
          <Menu conference={conf} />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
