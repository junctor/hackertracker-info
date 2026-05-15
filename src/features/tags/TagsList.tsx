import { useMemo } from "react";
import { Link } from "react-router";

import PageHeader from "@/components/ui/PageHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { getToneFromColor } from "@/lib/tone";
import { TagTypesBrowseView } from "@/lib/types/ht-types";

const formatCategory = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
      to={`/${conference.slug}/tag?id=${tag.id}`}
      aria-label={`Show schedule for ${tag.label}`}
      className={`ui-focus-ring ui-tag-chip ui-tag-link ui-tone-${getToneFromColor(tag.colorBackground)}`}
    >
      {tag.label}
    </Link>
  );
}

export default function TagsList({ tagTypes, conference }: TagsListProps) {
  const sortedTagTypes = useMemo(
    () => tagTypes.toSorted((a, b) => a.sortOrder - b.sortOrder),
    [tagTypes],
  );

  return (
    <section className="ui-container ui-page-content">
      <PageHeader
        title="Tags"
        description="Browse tags that group schedule items across the conference."
      />

      {sortedTagTypes.length === 0 ? (
        <div className="ui-empty-state" role="status">
          <p>No tags available.</p>
        </div>
      ) : (
        sortedTagTypes.map((tagType) => {
          const sortedTags = tagType.tags.toSorted((a, b) => a.sortOrder - b.sortOrder);

          return (
            <section key={tagType.id} className="ui-tags-section">
              <h2 className="ui-heading-2 ui-tags-heading">{formatCategory(tagType.category)}</h2>

              <ul className="ui-chip-list-tight">
                {sortedTags.map((tag) => (
                  <li key={tag.id}>
                    <TagPill tag={tag} conference={conference} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </section>
  );
}
