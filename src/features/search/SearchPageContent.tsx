import { useEffect, useMemo, useState } from "react";
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
  const [draftQuery, setDraftQuery] = useState(query);
  const trimmedQuery = query.trim();
  const results = useMemo(() => filterSearchResults(searchData, query), [searchData, query]);
  const hasQuery = trimmedQuery.length > 0;
  const resultCountLabel = `${results.length} ${results.length === 1 ? "result" : "results"}`;

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  const submitSearch = () => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      const value = draftQuery.trim();

      if (value) {
        nextParams.set("q", value);
      } else {
        nextParams.delete("q");
      }

      return nextParams;
    });
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
            value: draftQuery,
            onChange: setDraftQuery,
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
