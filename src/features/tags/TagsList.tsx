import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMemo, type ComponentType, type CSSProperties, type SVGProps } from "react";
import { Link } from "react-router";

import PageHeader from "@/components/ui/PageHeader";
import { sortTags, sortTagTypes } from "@/lib/tags";
import { TagTypeBrowse, TagTypesBrowseView } from "@/lib/types/ht-types";

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
  selectedIds: Set<number>;
  unavailableTagIds: Set<number>;
  matchingResultCount: number | null;
  resultNouns: {
    singular: string;
    plural: string;
    empty: string;
    combination: string;
    combinationVerb: "match" | "matches";
    counting: string;
  };
  isPreviewLoading: boolean;
  isPreviewUnavailable: boolean;
  destinationHref: string;
  destinationLabel: string;
  destinationIcon: ComponentType<SVGProps<SVGSVGElement>>;
  description: string;
  onClear: () => void;
  onToggleTag: (tagId: number) => void;
};

function isPresent<T>(value: T | null | undefined | false): value is T {
  return Boolean(value);
}

function TagPill({
  tag,
  isSelected,
  isUnavailable,
  unavailableResultLabel,
  unavailableResultVerb,
  onToggleTag,
}: TagPillProps & {
  isSelected: boolean;
  isUnavailable: boolean;
  unavailableResultLabel: string;
  unavailableResultVerb: "match" | "matches";
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
          ? `${tag.label}. No ${unavailableResultLabel} ${unavailableResultVerb} if added to the current filters.`
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
  selectedIds,
  unavailableTagIds,
  matchingResultCount,
  resultNouns,
  isPreviewLoading,
  isPreviewUnavailable,
  destinationHref,
  destinationLabel,
  destinationIcon: DestinationIcon,
  description,
  onClear,
  onToggleTag,
}: TagsListProps) {
  const visibleTagTypes = useMemo(() => {
    const validTagTypes = (
      tagTypes as readonly (TagTypeBrowse | null | undefined | false)[]
    ).filter(isPresent);

    const tagTypesWithSortedTags = validTagTypes
      .map((tagType) => ({
        ...tagType,
        tags: sortTags(
          (
            tagType.tags as readonly (TagTypeBrowse["tags"][number] | null | undefined | false)[]
          ).filter(isPresent),
        ),
      }))
      .filter((tagType) => tagType.tags.length > 0);

    return sortTagTypes(tagTypesWithSortedTags);
  }, [tagTypes]);
  const selectedCount = selectedIds.size;
  const hasSelections = selectedCount > 0;
  const hasNoMatchingSelection =
    hasSelections &&
    !isPreviewLoading &&
    !isPreviewUnavailable &&
    matchingResultCount !== null &&
    matchingResultCount === 0;
  const isDestinationDisabled =
    !isPreviewLoading &&
    !isPreviewUnavailable &&
    matchingResultCount !== null &&
    matchingResultCount === 0;
  const previewLabel = isPreviewLoading ? (
    resultNouns.counting
  ) : isPreviewUnavailable || matchingResultCount === null ? (
    "Matching count unavailable"
  ) : hasNoMatchingSelection ? (
    <span className="ui-filter-preview-count-empty">{resultNouns.empty}</span>
  ) : (
    `${matchingResultCount} ${matchingResultCount === 1 ? resultNouns.singular : resultNouns.plural} ${matchingResultCount === 1 ? "matches" : "match"}`
  );

  return (
    <section className="ui-container ui-page-content">
      <PageHeader title="Filters" description={description} resultLabel={previewLabel}>
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
              ? `${selectedCount} ${selectedCount === 1 ? "filter" : "filters"} selected, but no ${resultNouns.combination} ${resultNouns.combinationVerb} this combination.`
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
            {isDestinationDisabled ? (
              <button
                type="button"
                disabled
                className="ui-btn-base ui-focus-ring ui-filter-action-button ui-filter-action-primary"
                aria-describedby="filter-preview-status"
              >
                <DestinationIcon className="ui-icon-xs" aria-hidden="true" />
                <span>{destinationLabel}</span>
              </button>
            ) : (
              <Link
                to={destinationHref}
                className="ui-btn-base ui-focus-ring ui-filter-action-button ui-filter-action-primary"
              >
                <DestinationIcon className="ui-icon-xs" aria-hidden="true" />
                <span>{destinationLabel}</span>
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
                    unavailableResultLabel={resultNouns.combination}
                    unavailableResultVerb={resultNouns.combinationVerb}
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
