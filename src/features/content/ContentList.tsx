import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router";

import type { ContentCardsView, TagTypesBrowseView } from "@/lib/types/ht-types/views";

import PageHeader from "@/components/ui/PageHeader";
import { getAccentStyle } from "@/lib/color";
import { ConferenceManifest } from "@/lib/conferences";
import { buildAppPath } from "@/lib/url";

interface Props {
  conference: ConferenceManifest;
  content: ContentCardsView;
  tags: TagTypesBrowseView;
}

export default function ContentList({ content, tags, conference }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const tagParam = searchParams.get("tag");
  const normalizedSearch = search.trim().toLowerCase();

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

  const validTagIds = useMemo(() => {
    const ids = new Set<number>();
    for (const group of tagOptions) {
      for (const tag of group.tags) {
        ids.add(tag.id);
      }
    }
    return ids;
  }, [tagOptions]);

  const selectedTag = useMemo(() => {
    if (tagParam == null) return null;

    const parsed = Number(tagParam);
    if (!Number.isInteger(parsed) || !validTagIds.has(parsed)) return null;

    return parsed;
  }, [tagParam, validTagIds]);

  useEffect(() => {
    const shouldRemoveTag = tagParam != null && selectedTag === null;
    const shouldRemoveSearch = search.length > 0 && normalizedSearch.length === 0;

    if (!shouldRemoveTag && !shouldRemoveSearch) return;

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (shouldRemoveTag) next.delete("tag");
        if (shouldRemoveSearch) next.delete("q");
        return next;
      },
      { replace: true },
    );
  }, [normalizedSearch.length, search.length, selectedTag, setSearchParams, tagParam]);

  const updateFilterParam = (key: "q" | "tag", value: string) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        const normalizedValue = value.trim();

        if (normalizedValue) {
          next.set(key, value);
        } else {
          next.delete(key);
        }

        return next;
      },
      { replace: true },
    );
  };

  const filtered = useMemo(() => {
    const result: ContentCardsView = [];
    for (const item of content) {
      if (normalizedSearch && !item.title.toLowerCase().includes(normalizedSearch)) {
        continue;
      }
      if (selectedTag !== null && !item.tags.some((tag) => tag.id === selectedTag)) {
        continue;
      }
      result.push(item);
    }
    return result;
  }, [content, normalizedSearch, selectedTag]);

  const hasActiveFilters = Boolean(normalizedSearch || selectedTag !== null);
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
          onChange: (value) => updateFilterParam("q", value),
        }}
      >
        <label className="ui-control-label">
          <span className="ui-visually-hidden">Filter by tag</span>
          <select
            value={selectedTag ?? ""}
            onChange={(e) => {
              const nextValue = e.target.value;
              updateFilterParam("tag", nextValue);
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
                setSearchParams(
                  (current) => {
                    const next = new URLSearchParams(current);
                    next.delete("q");
                    next.delete("tag");
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
        <ul className="ui-list-stack-sm">
          {filtered.map((item) => {
            const visibleTags = item.tags.slice(0, 4);
            const hiddenTagCount = item.tags.length - visibleTags.length;
            const itemColor = item.tags[0]?.colorBackground;
            const accentStyle = getAccentStyle(itemColor);

            return (
              <li
                key={item.id}
                style={accentStyle}
                className={`ui-card ui-card-interactive ui-accent-card`}
              >
                <span aria-hidden="true" className="ui-accent-rail" />
                <span aria-hidden="true" className="ui-accent-rail-overlay" />
                <Link
                  to={buildAppPath([conference.slug, "content"], { id: item.id })}
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
                              className={`ui-tag-chip ui-tag-chip-strong`}
                              style={{
                                backgroundColor: tag.colorBackground,
                                color: tag.colorForeground,
                              }}
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
