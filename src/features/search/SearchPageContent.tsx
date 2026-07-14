import { useMemo } from "react";
import { useSearchParams } from "react-router";

import type { ConferenceManifest } from "@/lib/conferences";

import PageHeader from "@/components/ui/PageHeader";

import { filterSearchResults, type UniversalSearchResult } from "./searchData";
import SearchResultItem from "./SearchResultItem";

type Props = {
  conf: ConferenceManifest;
  searchData: UniversalSearchResult[];
};

export default function SearchPageContent({ conf, searchData }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const trimmedQuery = query.trim();
  const results = useMemo(() => filterSearchResults(searchData, query), [searchData, query]);
  const hasQuery = trimmedQuery.length > 0;
  const resultCountLabel = `${results.length} ${results.length === 1 ? "result" : "results"}`;

  const submitSearch = (nextQuery: string) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        const value = nextQuery.trim();

        if (value) {
          nextParams.set("q", value);
        } else {
          nextParams.delete("q");
        }

        return nextParams;
      },
      { replace: true },
    );
  };

  return (
    <section>
      <div className="ui-container ui-section">
        <PageHeader
          title="Search"
          description="Search sessions, people, and organizations."
          resultLabel={hasQuery ? resultCountLabel : undefined}
          search={{
            label: `Search ${conf.name}`,
            placeholder: "Search everything...",
            value: query,
            onSubmit: submitSearch,
          }}
        />

        {!hasQuery ? (
          <div className="ui-empty-state ui-search-empty-start">
            <p>Enter a search term to search sessions, people, and organizations.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="ui-empty-state" role="status">
            <p>No results found for "{trimmedQuery}".</p>
            <button
              type="button"
              onClick={() => {
                submitSearch("");
              }}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action"
            >
              Clear search
            </button>
          </div>
        ) : (
          <ul className="ui-list-stack-sm">
            {results.map((result) => (
              <li key={`${result.type}:${result.id}`}>
                <SearchResultItem conf={conf} result={result} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
