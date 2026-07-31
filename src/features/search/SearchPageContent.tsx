import React, { useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { Virtuoso, type Components } from "react-virtuoso";

import type { ConferenceManifest } from "@/lib/conferences";

import PageHeader from "@/components/ui/PageHeader";

import {
  buildSearchContentLookup,
  filterSearchResults,
  tagContentHref,
  type SearchDataItem,
  type TagSearchResult,
  type UniversalSearchResult,
} from "./searchData";
import SearchResultItem from "./SearchResultItem";

type Props = {
  conf: ConferenceManifest;
  searchData: SearchDataItem[];
};

type VirtuosoContext = unknown;

type SearchDisplayItem =
  | {
      kind: "tag";
      tag: TagSearchResult;
    }
  | {
      kind: "result";
      result: UniversalSearchResult;
    };

type VirtuosoListProps = React.ComponentPropsWithoutRef<"div"> & {
  context?: VirtuosoContext;
};

type VirtuosoItemProps = React.ComponentPropsWithoutRef<"div"> & {
  context?: VirtuosoContext;
  item?: SearchDisplayItem;
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

const SEARCH_VIRTUOSO_COMPONENTS: Components<SearchDisplayItem, VirtuosoContext> = {
  List: SearchVirtuosoList,
  Item: SearchVirtuosoItem,
};

function MatchingTagResult({ conf, tag }: { conf: ConferenceManifest; tag: TagSearchResult }) {
  const countLabel = `${tag.contentCount} associated ${tag.contentCount === 1 ? "item" : "items"}`;

  return (
    <article className="ui-card ui-search-tag-card">
      <div className="ui-item-main ui-item-copy">
        <span className="ui-tag-chip ui-tag-chip-strong ui-tone-teal">Tag</span>
        <h2 className="ui-card-title ui-search-result-title">{tag.text}</h2>
        <p className="ui-search-result-context">{countLabel}</p>
      </div>
      {tag.contentCount > 0 ? (
        <Link
          to={tagContentHref(conf.slug, tag.id)}
          className="ui-link ui-focus-ring ui-search-tag-action"
        >
          View all content
        </Link>
      ) : null}
    </article>
  );
}

export default function SearchPageContent({ conf, searchData }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const trimmedQuery = query.trim();
  const contentById = useMemo(() => buildSearchContentLookup(searchData), [searchData]);
  const results = useMemo(
    () => filterSearchResults(searchData, query, contentById),
    [contentById, searchData, query],
  );
  const displayResults = useMemo(
    () => [
      ...results.tagMatches.map((tag) => ({ kind: "tag", tag }) as const),
      ...results.directMatches.map((result) => ({ kind: "result", result }) as const),
      ...results.tagAssociatedContentMatches.map((result) => ({ kind: "result", result }) as const),
    ],
    [results.directMatches, results.tagAssociatedContentMatches, results.tagMatches],
  );
  const hasQuery = trimmedQuery.length > 0;
  const resultCountLabel = `${results.totalCount} ${
    results.totalCount === 1 ? "result" : "results"
  }`;
  const shouldVirtualize = displayResults.length > VIRTUALIZE_SEARCH_THRESHOLD;

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

  const renderDisplayResult = useCallback(
    (item: SearchDisplayItem) =>
      item.kind === "tag" ? (
        <MatchingTagResult conf={conf} tag={item.tag} />
      ) : (
        <SearchResultItem conf={conf} result={item.result} />
      ),
    [conf],
  );

  const renderVirtualizedResult = useCallback(
    (_: number, item: SearchDisplayItem) => renderDisplayResult(item),
    [renderDisplayResult],
  );

  const displayResultKey = useCallback(
    (item: SearchDisplayItem) =>
      item.kind === "tag"
        ? `tag:${item.tag.id}`
        : `${item.result.matchedTag ? `tag:${item.result.matchedTag.id}:` : ""}${
            item.result.type
          }:${item.result.id}`,
    [],
  );

  return (
    <section>
      <div className="ui-container ui-section">
        <PageHeader
          title="Search"
          description="Search sessions, people, organizations, and tags."
          resultLabel={hasQuery ? resultCountLabel : undefined}
          search={{
            label: `Search ${conf.name}`,
            placeholder: "Search sessions, people, organizations, tags...",
            value: query,
            debounceMs: SEARCH_DEBOUNCE_MS,
            onDebouncedSubmit: submitSearch,
            onSubmit: submitSearch,
          }}
        />

        {!hasQuery ? (
          <div className="ui-empty-state ui-search-empty-start">
            <p>Enter a search term to search sessions, people, organizations, and tags.</p>
          </div>
        ) : results.totalCount === 0 ? (
          <div className="ui-empty-state" role="status">
            <p>No sessions, people, organizations, or tags match "{trimmedQuery}".</p>
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
          <div className="ui-search-results">
            {shouldVirtualize ? (
              <Virtuoso
                useWindowScroll
                data={displayResults}
                computeItemKey={(_, item) => displayResultKey(item)}
                components={SEARCH_VIRTUOSO_COMPONENTS}
                initialItemCount={Math.min(12, displayResults.length)}
                itemContent={renderVirtualizedResult}
                increaseViewportBy={{ top: 200, bottom: 500 }}
              />
            ) : (
              <ul className="ui-list-stack-sm">
                {displayResults.map((item) => (
                  <li key={displayResultKey(item)}>{renderDisplayResult(item)}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
