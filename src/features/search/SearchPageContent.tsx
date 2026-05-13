import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useId, useMemo, useState } from "react";

import type { ConferenceManifest } from "@/lib/conferences";

import { filterSearchResults, type UniversalSearchResult } from "./searchData";
import SearchResultItem from "./SearchResultItem";

type Props = {
  conf: ConferenceManifest;
  searchData: UniversalSearchResult[];
};

export default function SearchPageContent({ conf, searchData }: Props) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const results = useMemo(() => filterSearchResults(searchData, query), [searchData, query]);
  const hasQuery = trimmedQuery.length > 0;
  const resultCountLabel = `${results.length} ${results.length === 1 ? "result" : "results"}`;

  return (
    <section className="bg-(--color-bg) text-slate-100">
      <div className="ui-container ui-section">
        <header className="mb-6 space-y-4">
          <div className="flex flex-col gap-2 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="ui-heading-1">Search</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Search sessions, people, and organizations.
              </p>
            </div>

            {hasQuery ? (
              <p
                role="status"
                aria-live="polite"
                className="inline-flex items-center self-start rounded-full border border-white/8 bg-white/3 px-3 py-1 text-sm font-medium text-slate-300 sm:self-auto"
              >
                {resultCountLabel}
              </p>
            ) : null}
          </div>

          <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-3xl">
            <label htmlFor={inputId} className="block">
              <span className="sr-only">Search {conf.name}</span>
              <span className="ui-inset-highlight-soft flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-3.5 transition-colors focus-within:border-(--dc34-accent-primary)/55 focus-within:bg-white/5">
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-(--dc34-accent-secondary)"
                />
                <input
                  id={inputId}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.currentTarget.value)}
                  placeholder="Search everything..."
                  autoComplete="off"
                  className="min-h-11 min-w-0 flex-1 bg-transparent text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
              </span>
            </label>
          </form>
        </header>

        {!hasQuery ? (
          <div className="ui-empty-state text-left sm:text-center">
            <p className="text-slate-200">
              Start typing to search sessions, people, and organizations.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="ui-empty-state" role="status">
            <p className="text-slate-200">No results found for "{trimmedQuery}".</p>
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
