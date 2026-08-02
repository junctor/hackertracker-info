import React, { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Virtuoso, type Components } from "react-virtuoso";

import type { ContentCardsView, TagTypesBrowseView } from "@/lib/types/ht-types/views";

import PageHeader from "@/components/ui/PageHeader";
import ClearFilterButton from "@/features/filters/ClearFilterButton";
import FilterButton from "@/features/filters/FilterButton";
import { buildFilterPath } from "@/features/filters/filterRoutes";
import {
  countSelectedTags,
  filterContentByTagGroups,
  filterTagGroupsToKnownIds,
  parseTagGroups,
  parseTagId,
  serializeTagGroups,
  TAG_GROUP_PARAM,
} from "@/features/filters/tagFilters";
import { ConferenceManifest } from "@/lib/conferences";
import { createTagSortOrders } from "@/lib/tags";

import ContentCard from "./ContentCard";

interface Props {
  conference: ConferenceManifest;
  content: ContentCardsView;
  tags: TagTypesBrowseView;
}

type ContentListHeaderProps = {
  currentSearch: string;
  filterHref: string;
  onClearTagFilters: () => void;
  onUpdateSearch: (value: string) => void;
  resultLabel?: string;
  selectedTagCount: number;
};

type VirtuosoContext = unknown;

type VirtuosoListProps = React.ComponentPropsWithoutRef<"div"> & {
  context?: VirtuosoContext;
};

type VirtuosoItemProps = React.ComponentPropsWithoutRef<"div"> & {
  context?: VirtuosoContext;
  item?: ContentCardsView[number];
};

const VIRTUALIZE_CONTENT_THRESHOLD = 250;
const CONTENT_SEARCH_DEBOUNCE_MS = 300;

const ContentVirtuosoList = React.forwardRef<HTMLDivElement, VirtuosoListProps>(
  function ContentVirtuosoList({ children, className, context, style, ...listProps }, ref) {
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
ContentVirtuosoList.displayName = "ContentVirtuosoList";

function ContentVirtuosoItem({
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

const CONTENT_VIRTUOSO_COMPONENTS: Components<ContentCardsView[number], VirtuosoContext> = {
  List: ContentVirtuosoList,
  Item: ContentVirtuosoItem,
};

export function updateContentFilterSearchParams(
  current: URLSearchParams,
  key: "q" | "tag",
  value: string,
) {
  const next = new URLSearchParams(current);
  const normalizedValue = value.trim();
  const currentValue = current.get(key) ?? "";

  if (currentValue === normalizedValue) return current;

  if (normalizedValue) {
    next.set(key, normalizedValue);
  } else {
    next.delete(key);
  }

  return next;
}

function ContentListHeader({
  currentSearch,
  filterHref,
  onClearTagFilters,
  onUpdateSearch,
  resultLabel,
  selectedTagCount,
}: ContentListHeaderProps) {
  return (
    <PageHeader
      title="Content"
      description="Browse talks, workshops, and other content."
      resultLabel={resultLabel}
      search={{
        label: "Search content",
        placeholder: "Search content...",
        value: currentSearch,
        debounceMs: CONTENT_SEARCH_DEBOUNCE_MS,
        onDebouncedSubmit: onUpdateSearch,
        onSubmit: onUpdateSearch,
      }}
    >
      <div className="ui-schedule-tool-list">
        <FilterButton
          destinationLabel="Content"
          href={filterHref}
          selectedCount={selectedTagCount}
        />
        {selectedTagCount > 0 ? (
          <ClearFilterButton destinationLabel="Content" onClear={onClearTagFilters} />
        ) : null}
      </div>
    </PageHeader>
  );
}

export default function ContentList({ content, tags, conference }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const normalizedSearch = search.trim().toLowerCase();
  const tagSortOrders = useMemo(() => createTagSortOrders(tags), [tags]);

  const normalizedTagGroups = useMemo(() => {
    const parsedGroups = parseTagGroups(searchParams);
    if (parsedGroups.length > 0) return filterTagGroupsToKnownIds(parsedGroups, tags);

    const legacyTagId = parseTagId(searchParams.get("tag") ?? "");
    return legacyTagId === null ? [] : filterTagGroupsToKnownIds([[legacyTagId]], tags);
  }, [searchParams, tags]);
  const selectedTagCount = useMemo(
    () => countSelectedTags(normalizedTagGroups),
    [normalizedTagGroups],
  );
  const normalizedParams = useMemo(() => {
    const next = serializeTagGroups(searchParams, normalizedTagGroups);
    next.delete("tag");
    if (search && !search.trim()) next.delete("q");
    return next;
  }, [normalizedTagGroups, search, searchParams]);

  useEffect(() => {
    if (normalizedParams.toString() === searchParams.toString()) return;
    setSearchParams(normalizedParams, { replace: true });
  }, [normalizedParams, searchParams, setSearchParams]);

  const updateSearch = useCallback(
    (value: string) => {
      const normalizedValue = value.trim();
      if ((searchParams.get("q") ?? "") === normalizedValue) return;

      setSearchParams((current) => updateContentFilterSearchParams(current, "q", value), {
        replace: true,
      });
    },
    [searchParams, setSearchParams],
  );

  const clearTagFilters = useCallback(() => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("tag");
      next.delete(TAG_GROUP_PARAM);
      return next;
    });
  }, [setSearchParams]);

  const searchableContent = useMemo(
    () =>
      content.map((item) => ({
        item,
        searchableTitle: item.title.toLowerCase(),
      })),
    [content],
  );

  const filtered = useMemo(() => {
    const result: ContentCardsView = [];

    const tagFilteredIds = new Set(
      filterContentByTagGroups(content, normalizedTagGroups).map((item) => item.id),
    );

    for (const { item, searchableTitle } of searchableContent) {
      if (normalizedSearch && !searchableTitle.includes(normalizedSearch)) {
        continue;
      }
      if (!tagFilteredIds.has(item.id)) continue;
      result.push(item);
    }
    return result;
  }, [content, normalizedSearch, normalizedTagGroups, searchableContent]);

  const hasActiveFilters = Boolean(normalizedSearch || selectedTagCount > 0);
  const contentCountLabel = `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`;
  const resultCountLabel = hasActiveFilters ? `${contentCountLabel} found` : undefined;
  const filterHref = useMemo(
    () => buildFilterPath(conference.slug, "content", normalizedParams),
    [conference.slug, normalizedParams],
  );
  const shouldVirtualize = filtered.length > VIRTUALIZE_CONTENT_THRESHOLD;
  const renderVirtualizedContent = useCallback(
    (_: number, item: ContentCardsView[number]) => (
      <ContentCard conference={conference} item={item} tagSortOrders={tagSortOrders} />
    ),
    [conference, tagSortOrders],
  );

  return (
    <section className="ui-container ui-section">
      <ContentListHeader
        currentSearch={search}
        filterHref={filterHref}
        onClearTagFilters={clearTagFilters}
        onUpdateSearch={updateSearch}
        resultLabel={resultCountLabel}
        selectedTagCount={selectedTagCount}
      />

      {filtered.length === 0 ? (
        <div className="ui-empty-state ui-content-empty-state">
          <p>
            {hasActiveFilters
              ? "No content matches the current search and tag filters."
              : "No content is listed yet."}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setSearchParams(
                  (current) => {
                    const next = new URLSearchParams(current);
                    next.delete("q");
                    next.delete("tag");
                    next.delete(TAG_GROUP_PARAM);
                    return next;
                  },
                  { replace: true },
                );
              }}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <>
          {shouldVirtualize ? (
            <Virtuoso
              useWindowScroll
              data={filtered}
              computeItemKey={(_, item) => item.id}
              components={CONTENT_VIRTUOSO_COMPONENTS}
              initialItemCount={Math.min(12, filtered.length)}
              itemContent={renderVirtualizedContent}
              increaseViewportBy={{ top: 200, bottom: 500 }}
            />
          ) : (
            <ul className="ui-list-stack-sm">
              {filtered.map((item) => (
                <li key={item.id}>
                  <ContentCard conference={conference} item={item} tagSortOrders={tagSortOrders} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
