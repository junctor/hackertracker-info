import { ArrowRightIcon } from "@heroicons/react/24/outline";
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
  const headerAccentStyle = {
    "--event-color": "#64748b",
  } as CSSProperties;

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
        title={
          <div style={headerAccentStyle} className="relative min-w-0 py-1 pl-5 sm:pl-6">
            <span aria-hidden="true" className="ui-accent-rail top-1 bottom-1" />
            <span aria-hidden="true" className="ui-accent-rail-overlay top-1 bottom-1" />
            <h1 className="ui-heading-1">Content</h1>
          </div>
        }
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
          {filtered.map((item) => {
            const visibleTags = item.tags.slice(0, 4);
            const hiddenTagCount = item.tags.length - visibleTags.length;

            return (
              <li
                key={item.id}
                style={
                  {
                    "--event-color": item.tags[0]?.colorBackground ?? "#64748b",
                  } as CSSProperties
                }
                className="ui-card ui-card-interactive group relative overflow-hidden"
              >
                <span aria-hidden="true" className="ui-accent-rail" />
                <span aria-hidden="true" className="ui-accent-rail-overlay" />
                <Link
                  href={`/${conference.slug}/content/?id=${item.id}`}
                  className="ui-focus-ring relative z-10 block rounded-[inherit] px-4 py-4 pl-5 focus-visible:outline-none sm:px-5 sm:py-5 sm:pl-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 text-base leading-6 font-semibold text-slate-100 transition-colors group-hover:text-white sm:text-lg">
                          {item.title}
                        </h3>
                        <ArrowRightIcon
                          aria-hidden="true"
                          className="mt-0.5 h-5 w-5 shrink-0 text-(--event-color) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-200"
                        />
                      </div>

                      {visibleTags.length > 0 && (
                        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                          {visibleTags.map((tag) => (
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
                          {hiddenTagCount > 0 && (
                            <li className="ui-tag-chip bg-white/3 text-slate-300 sm:text-xs">
                              +{hiddenTagCount} more
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
