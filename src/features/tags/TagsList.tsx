import { useMemo } from "react";
import { Link } from "react-router";

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
      className={`ui-focus-ring ui-tag-chip ui-tone-${getToneFromColor(tag.colorBackground)} inline-flex px-3 py-1 text-sm transition hover:border-(--dc34-accent-primary)/70 focus-visible:outline-none`}
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
    <section className="ui-container ui-page-content text-slate-100">
      <header className="mb-6">
        <h1 className="ui-heading-1">Tags</h1>
      </header>

      {sortedTagTypes.length === 0 ? (
        <p>No tags available.</p>
      ) : (
        sortedTagTypes.map((tagType) => {
          const sortedTags = tagType.tags.toSorted((a, b) => a.sortOrder - b.sortOrder);

          return (
            <section key={tagType.id} className="mb-10">
              <h2 className="ui-heading-2 mb-4 text-(--dc34-accent-secondary)">
                {formatCategory(tagType.category)}
              </h2>

              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
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
