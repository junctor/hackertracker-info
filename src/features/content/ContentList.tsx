import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { ProcessedContents, TagTypes } from "@/lib/types/info";

interface Props {
  content: ProcessedContents;
  tags: TagTypes;
}

export default function ContentList({ content, tags }: Props) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      content
        .filter((c) =>
          search ? c.title.toLowerCase().includes(search.toLowerCase()) : true,
        )
        .filter((c) => {
          if (!selectedTag) return true;
          return c.tags.some((tag) => tag.id === selectedTag);
        }),
    [content, search, selectedTag],
  );

  return (
    <section className="my-10 mx-5">
      <h2 className="mb-4 text-2xl font-semibold text-gray-100">Content</h2>

      {/* Search Input */}
      <div className="mb-8 flex flex-wrap items-end justify-center gap-4">
        <label className="w-full max-w-xl">
          <span className="sr-only">Search content</span>
          <input
            type="search"
            placeholder="Search Content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder:text-gray-500"
          />
        </label>
        {/* Tag Filter */}
        <label className="w-full max-w-[220px]">
          <span className="sr-only">Filter by tag</span>
          <select
            value={selectedTag ?? ""}
            onChange={(e) =>
              setSelectedTag(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100"
          >
            <option value="">All tags</option>
            {tags
              .filter(
                (tag) =>
                  tag.is_browsable &&
                  tag.tags.length > 0 &&
                  tag.category === "content",
              )
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((tag) => (
                <optgroup key={tag.id} label={tag.label}>
                  {tag.tags
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                </optgroup>
              ))}
          </select>
        </label>
      </div>

      <ul className="divide-y divide-gray-700 leading-relaxed">
        {filtered.map((item) => (
          <li
            key={item.id}
            className="odd:bg-gray-950 even:bg-gray-1000 transition-colors"
          >
            <Link
              href={`/content?id=${item.id}`}
              className="block group px-4 py-6 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-100 group-hover:text-gray-200 transition-colors">
                  {item.title}
                </h3>
                <span
                  className={`text-xl group-hover:text-gray-300 transition-colors`}
                  style={{
                    color: item.tags[0].color_background ?? "#fff",
                  }}
                >
                  &rarr;
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: tag.color_background,
                      color: tag.color_foreground ?? "#fff",
                    }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
