import React, { useState, useMemo } from "react";
import Link from "next/link";
import type {
  ContentCardsView,
  TagTypesBrowseView,
} from "@/lib/types/ht-types/views";
import { ConferenceManifest } from "@/lib/conferences";
import SearchHeader from "@/components/ui/SearchHeader";

interface Props {
  conference: ConferenceManifest;
  content: ContentCardsView;
  tags: TagTypesBrowseView;
}

export default function ContentList({ content, tags, conference }: Props) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const normalizedSearch = useMemo(() => search.trim().toLowerCase(), [search]);

  const filtered = useMemo(
    () =>
      content
        .filter((c) =>
          normalizedSearch
            ? c.title.toLowerCase().includes(normalizedSearch)
            : true,
        )
        .filter((c) => {
          if (!selectedTag) return true;
          return c.tags.some((tag) => tag.id === selectedTag);
        }),
    [content, normalizedSearch, selectedTag],
  );

  const tagOptions = useMemo(
    () =>
      tags
        .filter((tag) => tag.tags.length > 0 && tag.category === "content")
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((tag) => ({
          id: tag.id,
          label: tag.label,
          tags: [...tag.tags].sort((a, b) => a.sortOrder - b.sortOrder),
        })),
    [tags],
  );

  return (
    <section className="my-10 mx-5">
      <SearchHeader
        title="Content"
        searchLabel="Search content"
        searchPlaceholder="Search content..."
        searchValue={search}
        onSearchChange={setSearch}
      >
        <label className="w-full max-w-xs">
          <span className="sr-only">Filter by tag</span>
          <select
            value={selectedTag ?? ""}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSelectedTag(nextValue ? Number(nextValue) : null);
            }}
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100"
          >
            <option value="">All tags</option>
            {tagOptions.map((tag) => (
              <optgroup key={tag.id} label={tag.label}>
                {tag.tags.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
      </SearchHeader>

      <ul className="divide-y divide-gray-700 leading-relaxed">
        {filtered.map((item) => (
          <li
            key={item.id}
            className="odd:bg-gray-950 even:bg-gray-900 transition-colors"
          >
            <Link
              href={`/${conference.slug}/content/?id=${item.id}`}
              className="block group px-4 py-6 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-100 group-hover:text-gray-200 transition-colors">
                  {item.title}
                </h3>
                <span
                  className={`text-xl group-hover:text-gray-300 transition-colors`}
                  style={{
                    color: item.tags[0]?.colorBackground ?? "#fff",
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
                      backgroundColor: tag.colorBackground,
                      color: tag.colorForeground ?? "#fff",
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
