import { useMemo } from "react";
import Link from "next/link";
import { TagTypesBrowseView } from "@/lib/types/ht-types";
import { ConferenceManifest } from "@/lib/conferences";

const formatCategory = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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

function TagPill({
  tag,
  conference,
}: TagPillProps & { conference: ConferenceManifest }) {
  return (
    <Link
      href={`/${conference.slug}/tag?id=${tag.id}`}
      aria-label={`Show schedule for ${tag.label}`}
      className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
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
    () => [...tagTypes].sort((a, b) => a.sortOrder - b.sortOrder),
    [tagTypes],
  );

  return (
    <section className="p-6 min-h-screen text-gray-100">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Tags</h1>
      </header>

      {sortedTagTypes.length === 0 ? (
        <p>No tags available.</p>
      ) : (
        sortedTagTypes.map((tagType) => {
          const sortedTags = [...tagType.tags].sort(
            (a, b) => a.sortOrder - b.sortOrder,
          );

          return (
            <section key={tagType.id} className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                {formatCategory(tagType.category)}
              </h2>

              <div className="flex flex-wrap gap-2">
                {sortedTags.map((tag) => (
                  <TagPill key={tag.id} tag={tag} conference={conference} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </section>
  );
}
