import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router";
import { Virtuoso, type Components, type VirtuosoHandle } from "react-virtuoso";

import type { ConferenceManifest } from "@/lib/conferences";

import PageHeader from "@/components/ui/PageHeader";

import { filterSearchResults, type UniversalSearchResult } from "./searchData";
import SearchResultItem from "./SearchResultItem";

type Props = {
  conf: ConferenceManifest;
  searchData: UniversalSearchResult[];
};

type VirtuosoContext = unknown;

type VirtuosoListProps = React.ComponentPropsWithoutRef<"div"> & {
  context?: VirtuosoContext;
};

type VirtuosoItemProps = React.ComponentPropsWithoutRef<"div"> & {
  context?: VirtuosoContext;
  item?: UniversalSearchResult;
};

const VIRTUALIZE_SEARCH_THRESHOLD = 250;
const SEARCH_DEBOUNCE_MS = 300;

const SearchVirtuosoList = React.forwardRef<HTMLDivElement, VirtuosoListProps>(
  function SearchVirtuosoList({ children, className, context, style, ...listProps }, ref) {
    void context;

    return (
      <div
        {...listProps}
        ref={ref}
        role="list"
        style={style}
        className={["ui-list-stack-sm", className].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    );
  },
);
SearchVirtuosoList.displayName = "SearchVirtuosoList";

function SearchVirtuosoItem({
  children,
  className,
  context,
  item,
  style,
  ...itemProps
}: VirtuosoItemProps) {
  void context;
  void item;

  return (
    <div {...itemProps} role="listitem" style={style} className={className}>
      {children}
    </div>
  );
}
SearchVirtuosoItem.displayName = "SearchVirtuosoItem";

const SEARCH_VIRTUOSO_COMPONENTS: Components<UniversalSearchResult, VirtuosoContext> = {
  List: SearchVirtuosoList,
  Item: SearchVirtuosoItem,
};

export default function SearchPageContent({ conf, searchData }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const resultsStartRef = useRef<HTMLDivElement | null>(null);
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const previousQueryRef = useRef(query);
  const trimmedQuery = query.trim();
  const results = useMemo(() => filterSearchResults(searchData, query), [searchData, query]);
  const hasQuery = trimmedQuery.length > 0;
  const resultCountLabel = `${results.length} ${results.length === 1 ? "result" : "results"}`;
  const shouldVirtualize = results.length > VIRTUALIZE_SEARCH_THRESHOLD;

  const submitSearch = useCallback(
    (nextQuery: string) => {
      const value = nextQuery.trim();
      if (query === value) return;

      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(currentParams);
          const currentValue = currentParams.get("q") ?? "";

          if (currentValue === value) return currentParams;

          if (value) {
            nextParams.set("q", value);
          } else {
            nextParams.delete("q");
          }

          return nextParams;
        },
        { replace: true },
      );
    },
    [query, setSearchParams],
  );

  const renderVirtualizedResult = useCallback(
    (_: number, result: UniversalSearchResult) => <SearchResultItem conf={conf} result={result} />,
    [conf],
  );

  useEffect(() => {
    if (previousQueryRef.current === query) return;

    previousQueryRef.current = query;
    virtuosoRef.current?.scrollToIndex({ index: 0, align: "start", behavior: "auto" });

    if (window.scrollY > (resultsStartRef.current?.offsetTop ?? 0)) {
      resultsStartRef.current?.scrollIntoView({ block: "start", inline: "nearest" });
    }
  }, [query]);

  return (
    <section>
      <div className="ui-container ui-section">
        <PageHeader
          title="Search"
          description="Search sessions, people, and organizations."
          resultLabel={hasQuery ? resultCountLabel : undefined}
          search={{
            label: `Search ${conf.name}`,
            placeholder: "Search sessions, people, organizations...",
            value: query,
            debounceMs: SEARCH_DEBOUNCE_MS,
            onDebouncedSubmit: submitSearch,
            onSubmit: submitSearch,
          }}
        />

        <div ref={resultsStartRef} />

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
        ) : shouldVirtualize ? (
          <Virtuoso
            ref={virtuosoRef}
            useWindowScroll
            data={results}
            computeItemKey={(_, result) => `${result.type}:${result.id}`}
            components={SEARCH_VIRTUOSO_COMPONENTS}
            initialItemCount={Math.min(12, results.length)}
            itemContent={renderVirtualizedResult}
            increaseViewportBy={{ top: 200, bottom: 500 }}
          />
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
