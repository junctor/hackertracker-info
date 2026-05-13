import type { UniversalSearchResult } from "@/features/search/searchData";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
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
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <SearchPageContent conf={conf} searchData={searchData} />
      </ConferenceLayout>
    </>
  );
}
