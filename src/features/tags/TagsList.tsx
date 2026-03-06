import Link from "next/link";
import { useMemo } from "react";

import { ConferenceManifest } from "@/lib/conferences";
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
      href={`/${conference.slug}/tag?id=${tag.id}`}
      aria-label={`Show schedule for ${tag.label}`}
      className="ui-focus-ring inline-flex rounded-full border border-transparent px-3 py-1 text-sm font-medium transition hover:border-[#017FA4]/70 focus-visible:outline-none"
      style={{
        backgroundColor: tag.colorBackground,
        color: tag.colorForeground,
      }}
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
    <section className="min-h-screen p-6 text-slate-100">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Tags</h1>
      </header>

      {sortedTagTypes.length === 0 ? (
        <p>No tags available.</p>
      ) : (
        sortedTagTypes.map((tagType) => {
          const sortedTags = tagType.tags.toSorted((a, b) => a.sortOrder - b.sortOrder);

          return (
            <section key={tagType.id} className="mb-10">
              <h2 className="mb-4 text-2xl font-semibold text-[#6CCDBB]">
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
