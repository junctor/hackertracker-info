import React, { useMemo } from "react";
import Link from "next/link";
import { TagType, Tag } from "@/types/info";

const formatCategory = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function TagPill({ tag }: { tag: Tag }) {
  return (
    <Link
      href={`/tag?id=${tag.id}`}
      aria-label={`Show schedule for ${tag.label}`}
      className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
      style={{
        backgroundColor: tag.color_background,
        color: tag.color_foreground,
      }}
    >
      {tag.label}
    </Link>
  );
}

export default function Tags({ tagTypes }: { tagTypes: TagType[] }) {
  const grouped = useMemo(() => {
    return tagTypes
      .filter(
        (tt) =>
          tt.is_browsable && tt.tags.length > 0 && tt.category == "content"
      )
      .reduce<Record<string, TagType[]>>((acc, tt) => {
        acc[tt.category] = acc[tt.category] || [];
        acc[tt.category].push(tt);
        return acc;
      }, {});
  }, [tagTypes]);

  const categories = Object.entries(grouped);

  return (
    <main className="p-6 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Tags</h1>

      {categories.length === 0 ? (
        <p>No tags available.</p>
      ) : (
        categories.map(([category, groups]) => (
          <section key={category} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              {formatCategory(category)}
            </h2>

            {groups
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((group) => (
                <div key={group.id} className="mb-6">
                  <h3 className="text-xl font-medium mb-2">{group.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.tags
                      .sort((a, b) => a.sort_order - b.sort_order)
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
