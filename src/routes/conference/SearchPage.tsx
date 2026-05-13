import type { UniversalSearchResult } from "@/features/search/searchData";

import Head from "@/components/Head";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import SearchPageContent from "@/features/search/SearchPageContent";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { PageId } from "@/lib/types/page-meta";

type SearchPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function SearchPage({ conf, activePageId }: SearchPageProps) {
  const {
    data: searchData,
    error,
    isLoading,
  } = useConferenceJson<UniversalSearchResult[]>(conf, "views/searchData.json");

  if (isLoading) return <LoadingScreen />;
  if (error || !searchData) return <ErrorScreen msg="Failed to load search data." />;

  return (
    <>
      <Head>
        <title>Search | {conf.name}</title>
        <meta
          name="description"
          content={`Search sessions, people, and organizations for ${conf.name}.`}
        />
      </Head>
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          <SearchPageContent conf={conf} searchData={searchData} />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
