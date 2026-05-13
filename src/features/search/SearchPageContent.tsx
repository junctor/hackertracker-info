import { useMemo, useState } from "react";

import type { ConferenceManifest } from "@/lib/conferences";

import PageHeader from "@/components/ui/PageHeader";

import { filterSearchResults, type UniversalSearchResult } from "./searchData";
import SearchResultItem from "./SearchResultItem";

type Props = {
  conf: ConferenceManifest;
  searchData: UniversalSearchResult[];
};

export default function SearchPageContent({ conf, searchData }: Props) {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const results = useMemo(() => filterSearchResults(searchData, query), [searchData, query]);
  const hasQuery = trimmedQuery.length > 0;
  const resultCountLabel = `${results.length} ${results.length === 1 ? "result" : "results"}`;

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
            onChange: setQuery,
          }}
        />

        {!hasQuery ? (
          <div className="ui-empty-state text-left sm:text-center">
            <p>Start typing to search sessions, people, and organizations.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="ui-empty-state" role="status">
            <p>No results found for "{trimmedQuery}".</p>
          </div>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0 sm:space-y-4">
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
