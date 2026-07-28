import { CalendarDaysIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMemo, type CSSProperties } from "react";
import { Link } from "react-router";

import PageHeader from "@/components/ui/PageHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { TagTypesBrowseView } from "@/lib/types/ht-types";

type TagPillProps = {
  tag: {
    colorBackground: string;
    colorForeground: string;
    id: number;
    label: string;
    sortOrder: number;
  };
};

type TagsListProps = {
  tagTypes: TagTypesBrowseView;
  conference: ConferenceManifest;
  selectedIds: Set<number>;
  unavailableTagIds: Set<number>;
  matchingSessionCount: number | null;
  isPreviewLoading: boolean;
  isPreviewUnavailable: boolean;
  scheduleHref: string;
  onClear: () => void;
  onToggleTag: (tagId: number) => void;
};

function TagPill({
  tag,
  isSelected,
  isUnavailable,
  onToggleTag,
}: TagPillProps & {
  isSelected: boolean;
  isUnavailable: boolean;
  onToggleTag: (tagId: number) => void;
}) {
  const style = {
    "--filter-tag-bg": tag.colorBackground,
    "--filter-tag-fg": tag.colorForeground,
  } as CSSProperties;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={
        isUnavailable
          ? `${tag.label}. No sessions match if added to the current filters.`
          : undefined
      }
      disabled={isUnavailable}
      onClick={() => onToggleTag(tag.id)}
      className="ui-focus-ring ui-tag-chip ui-tag-chip-strong ui-tag-link ui-filter-tag-button"
      style={style}
    >
      {tag.label}
    </button>
  );
}

export default function TagsList({
  tagTypes,
  conference,
  selectedIds,
  unavailableTagIds,
  matchingSessionCount,
  isPreviewLoading,
  isPreviewUnavailable,
  scheduleHref,
  onClear,
  onToggleTag,
}: TagsListProps) {
  const visibleTagTypes = useMemo(
    () =>
      tagTypes
        .filter((tagType) => tagType.tags.length > 0)
        .map((tagType) => ({ ...tagType, tags: tagType.tags.filter(Boolean) })),
    [tagTypes],
  );
  const selectedCount = selectedIds.size;
  const hasSelections = selectedCount > 0;
  const hasNoMatchingSelection =
    hasSelections &&
    !isPreviewLoading &&
    !isPreviewUnavailable &&
    matchingSessionCount !== null &&
    matchingSessionCount === 0;
  const isScheduleDisabled =
    !isPreviewLoading &&
    !isPreviewUnavailable &&
    matchingSessionCount !== null &&
    matchingSessionCount === 0;
  const previewLabel = isPreviewLoading ? (
    "Counting sessions..."
  ) : isPreviewUnavailable || matchingSessionCount === null ? (
    "Matching count unavailable"
  ) : hasNoMatchingSelection ? (
    <span className="ui-filter-preview-count-empty">No matching sessions</span>
  ) : (
    `${matchingSessionCount} ${matchingSessionCount === 1 ? "session" : "sessions"} match`
  );

  return (
    <section className="ui-container ui-page-content">
      <PageHeader
        title="Filters"
        description={`Filter ${conference.name} schedule sessions by tag.`}
        resultLabel={previewLabel}
      >
        <div className="ui-filter-controls">
          <p
            id="filter-preview-status"
            className={[
              "ui-filter-preview-status",
              hasNoMatchingSelection ? "ui-filter-preview-status-empty" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-live="polite"
          >
            {hasNoMatchingSelection
              ? `${selectedCount} ${selectedCount === 1 ? "filter" : "filters"} selected, but no sessions match this combination.`
              : selectedCount === 0
                ? "No filters selected."
                : `${selectedCount} ${selectedCount === 1 ? "filter" : "filters"} selected.`}
          </p>
          <div className="ui-filter-actions" aria-label="Filter actions">
            <button
              type="button"
              onClick={onClear}
              disabled={!hasSelections}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-filter-action-button"
            >
              <XMarkIcon className="ui-icon-xs" aria-hidden="true" />
              <span>Clear</span>
            </button>
            {isScheduleDisabled ? (
              <button
                type="button"
                disabled
                className="ui-btn-base ui-focus-ring ui-filter-action-button ui-filter-action-primary"
                aria-describedby="filter-preview-status"
              >
                <CalendarDaysIcon className="ui-icon-xs" aria-hidden="true" />
                <span>View Schedule</span>
              </button>
            ) : (
              <Link
                to={scheduleHref}
                className="ui-btn-base ui-focus-ring ui-filter-action-button ui-filter-action-primary"
              >
                <CalendarDaysIcon className="ui-icon-xs" aria-hidden="true" />
                <span>View Schedule</span>
              </Link>
            )}
          </div>
        </div>
      </PageHeader>

      {visibleTagTypes.length === 0 ? (
        <div className="ui-empty-state" role="status">
          <p>No tags available.</p>
        </div>
      ) : (
        visibleTagTypes.map((tagType) => (
          <section key={tagType.id} className="ui-tags-section">
            <h2 className="ui-heading-2 ui-tags-heading">{tagType.label}</h2>

            <ul className="ui-chip-list-tight">
              {tagType.tags.map((tag) => (
                <li key={tag.id}>
                  <TagPill
                    tag={tag}
                    isSelected={selectedIds.has(tag.id)}
                    isUnavailable={unavailableTagIds.has(tag.id)}
                    onToggleTag={onToggleTag}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </section>
  );
}
