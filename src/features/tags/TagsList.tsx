import { useMemo } from "react";
import Link from "next/link";
import { TagTypeBrowse, TagTypesBrowseView } from "@/lib/types/ht-types";

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
};

function TagPill({ tag }: TagPillProps) {
  return (
    <Link
      href={`/tag?id=${tag.id}`}
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

export default function TagsList({ tagTypes }: TagsListProps) {
  return (
    <main className="p-6 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Tags</h1>

      {tagTypes.length === 0 ? (
        <p>No tags available.</p>
      ) : (
        tagTypes.map((tagType) => (
          <section key={tagType.id} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              {formatCategory(tagType.category)}
            </h2>

            {tagType.tags
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((group) => (
                <div key={group.id} className="mb-6">
                  <h3 className="text-xl font-medium mb-2">{group.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {tagType.tags
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((tag) => (
                        <TagPill key={tag.id} tag={tag} />
                      ))}
                  </div>
                </div>
              ))}
          </section>
        ))
      )}
    </main>
  );
}
