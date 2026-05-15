import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useState, useMemo } from "react";
import { Link } from "react-router";

import type { ContentCardsView, TagTypesBrowseView } from "@/lib/types/ht-types/views";

import PageHeader from "@/components/ui/PageHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { getToneFromColor } from "@/lib/tone";

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
  const resultCountLabel = `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`;

  return (
    <section className="ui-container ui-section">
      <PageHeader
        title="Content"
        description="Search talks, sessions, and reference material without changing result order."
        resultLabel={hasActiveFilters ? `${resultCountLabel} found` : undefined}
        search={{
          label: "Search content",
          placeholder: "Search content...",
          value: search,
          onChange: setSearch,
        }}
      >
        <label className="ui-control-label">
          <span className="ui-visually-hidden">Filter by tag</span>
          <select
            value={selectedTag ?? ""}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSelectedTag(nextValue ? Number(nextValue) : null);
            }}
            className="ui-input-base ui-select-control ui-focus-ring"
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
      </PageHeader>

      {filtered.length === 0 ? (
        <div className="ui-empty-state">
          <p>
            {hasActiveFilters
              ? "No content matches the current search and tag filters."
              : "No content is listed yet."}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedTag(null);
              }}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="ui-list-stack-sm">
          {filtered.map((item) => {
            const visibleTags = item.tags.slice(0, 4);
            const hiddenTagCount = item.tags.length - visibleTags.length;
            const itemTone = getToneFromColor(item.tags[0]?.colorBackground);

            return (
              <li
                key={item.id}
                className={`ui-card ui-card-interactive ui-accent-card ui-tone-${itemTone}`}
              >
                <span aria-hidden="true" className="ui-accent-rail" />
                <span aria-hidden="true" className="ui-accent-rail-overlay" />
                <Link
                  to={`/${conference.slug}/content/?id=${item.id}`}
                  className="ui-focus-ring ui-accent-card-link"
                >
                  <div className="ui-content-list-row">
                    <div className="ui-item-main ui-item-copy">
                      <div className="ui-content-card-title-row">
                        <h2 className="ui-card-title ui-accent-card-title-md ui-clamp-two">
                          {item.title}
                        </h2>
                        <ArrowRightIcon aria-hidden="true" className="ui-icon-sm ui-card-arrow" />
                      </div>

                      {visibleTags.length > 0 && (
                        <ul className="ui-chip-list-tight">
                          {visibleTags.map((tag) => (
                            <li
                              key={tag.id}
                              className={`ui-tag-chip ui-tone-${getToneFromColor(tag.colorBackground)}`}
                            >
                              {tag.label}
                            </li>
                          ))}
                          {hiddenTagCount > 0 && (
                            <li className="ui-tag-chip ui-tone-muted">+{hiddenTagCount} more</li>
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
