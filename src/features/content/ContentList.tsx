import Link from "next/link";
import { useState, useMemo, type CSSProperties } from "react";

import type { ContentCardsView, TagTypesBrowseView } from "@/lib/types/ht-types/views";

import SearchHeader from "@/components/ui/SearchHeader";
import { ConferenceManifest } from "@/lib/conferences";

interface Props {
  conference: ConferenceManifest;
  content: ContentCardsView;
  tags: TagTypesBrowseView;
}

export default function ContentList({ content, tags, conference }: Props) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    const result: ContentCardsView = [];
    for (const item of content) {
      if (normalizedSearch && !item.title.toLowerCase().includes(normalizedSearch)) {
        continue;
      }
      if (selectedTag && !item.tags.some((tag) => tag.id === selectedTag)) {
        continue;
      }
      result.push(item);
    }
    return result;
  }, [content, normalizedSearch, selectedTag]);

  const tagOptions = useMemo(
    () =>
      tags
        .filter((tag) => tag.tags.length > 0 && tag.category === "content")
        .toSorted((a, b) => a.sortOrder - b.sortOrder)
        .map((tag) => ({
          id: tag.id,
          label: tag.label,
          tags: tag.tags.toSorted((a, b) => a.sortOrder - b.sortOrder),
        })),
    [tags],
  );
  const hasActiveFilters = Boolean(normalizedSearch || selectedTag);

  return (
    <section className="ui-container ui-section">
      <SearchHeader
        title="Content"
        searchLabel="Search content"
        searchPlaceholder="Search content..."
        searchValue={search}
        onSearchChange={setSearch}
      >
        <label className="w-full">
          <span className="sr-only">Filter by tag</span>
          <select
            value={selectedTag ?? ""}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSelectedTag(nextValue ? Number(nextValue) : null);
            }}
            className="ui-input-base ui-focus-ring focus-visible:outline-none"
          >
            <option value="">All tags</option>
            {tagOptions.map((tag) => (
              <optgroup key={tag.id} label={tag.label}>
                {tag.tags.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
      </SearchHeader>
      {hasActiveFilters ? (
        <p role="status" aria-live="polite" className="mb-4 text-sm text-slate-300">
          {filtered.length} found
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <div className="ui-empty-state">
          <p className="text-slate-200">
            {hasActiveFilters
              ? "No content matches the current filters."
              : "No content is listed yet."}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedTag(null);
              }}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action focus-visible:outline-none"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="space-y-3 leading-relaxed sm:space-y-4">
          {filtered.map((item) => (
            <li
              key={item.id}
              style={
                {
                  "--event-color": item.tags[0]?.colorBackground ?? "#9ca3af",
                } as CSSProperties
              }
              className="ui-card ui-card-interactive group relative overflow-hidden"
            >
              <span aria-hidden="true" className="ui-accent-rail" />
              <span aria-hidden="true" className="ui-accent-rail-overlay" />
              <Link
                href={`/${conference.slug}/content/?id=${item.id}`}
                className="ui-focus-ring relative z-10 block rounded-lg py-3 pr-3 pl-4 focus-visible:outline-none sm:py-4 sm:pr-4 sm:pl-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 text-base font-semibold text-slate-100 transition-colors group-hover:text-white sm:text-lg">
                    {item.title}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-lg transition-colors group-hover:text-slate-300 sm:text-xl"
                    style={{
                      color: item.tags[0]?.colorBackground ?? "#fff",
                    }}
                  >
                    &rarr;
                  </span>
                </div>
                <ul className="m-0 mt-2.5 flex list-none flex-wrap gap-1.5 p-0 sm:mt-3 sm:gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag.id}
                      className="ui-tag-chip sm:text-xs"
                      style={{
                        backgroundColor: tag.colorBackground,
                        color: tag.colorForeground ?? "#fff",
                      }}
                    >
                      {tag.label}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
