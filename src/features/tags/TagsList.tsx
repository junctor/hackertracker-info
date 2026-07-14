import { useMemo } from "react";
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
};

function TagPill({ tag, conference }: TagPillProps & { conference: ConferenceManifest }) {
  return (
    <Link
      to={`/${conference.slug}/content/?tag=${tag.id}`}
      aria-label={`Browse content tagged ${tag.label}`}
      className="ui-focus-ring ui-tag-chip ui-tag-chip-strong ui-tag-link"
      style={{ backgroundColor: tag.colorBackground, color: tag.colorForeground }}
    >
      {tag.label}
    </Link>
  );
}

export default function TagsList({ tagTypes, conference }: TagsListProps) {
  const visibleTagTypes = useMemo(
    () =>
      tagTypes
        .filter((tagType) => tagType.tags.length > 0)
        .map((tagType) => ({ ...tagType, tags: tagType.tags.filter(Boolean) })),
    [tagTypes],
  );

  return (
    <section className="ui-container ui-page-content">
      <PageHeader
        title="Tags"
        description="Browse tags that group schedule items across the conference."
      />

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
                  <TagPill tag={tag} conference={conference} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </section>
  );
}
