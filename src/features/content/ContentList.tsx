import Link from "next/link";
import { useState, useMemo, type CSSProperties } from "react";

import type { ContentCardsView, TagTypesBrowseView } from "@/lib/types/ht-types/views";

import SearchHeader from "@/components/ui/SearchHeader";
import { ConferenceManifest } from "@/lib/conferences";

interface Props {
  conference: ConferenceManifest;
  content: ContentCardsView;
  tags: TagTypesBrowseView;
}

export default function ContentList({ content, tags, conference }: Props) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    const result: ContentCardsView = [];
    for (const item of content) {
      if (normalizedSearch && !item.title.toLowerCase().includes(normalizedSearch)) {
        continue;
      }
      if (selectedTag && !item.tags.some((tag) => tag.id === selectedTag)) {
        continue;
      }
      result.push(item);
    }
    return result;
  }, [content, normalizedSearch, selectedTag]);

  const tagOptions = useMemo(
    () =>
      tags
        .filter((tag) => tag.tags.length > 0 && tag.category === "content")
        .toSorted((a, b) => a.sortOrder - b.sortOrder)
        .map((tag) => ({
          id: tag.id,
          label: tag.label,
          tags: tag.tags.toSorted((a, b) => a.sortOrder - b.sortOrder),
        })),
    [tags],
  );

  return (
    <section className="ui-container ui-section">
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
            className="ui-input-base ui-focus-ring focus-visible:outline-none"
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

      <ul className="space-y-3 leading-relaxed">
        {filtered.map((item) => (
          <li
            key={item.id}
            style={
              {
                "--event-color": item.tags[0]?.colorBackground ?? "#9ca3af",
              } as CSSProperties
            }
            className="ui-card ui-card-interactive group relative overflow-hidden focus-within:border-[#017FA4]/70"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 left-0 w-[clamp(0.3rem,2vw,0.9rem)] bg-(--event-color) transition-[width] duration-200 group-hover:w-[clamp(0.4rem,3vw,1.1rem)]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 left-0 w-[clamp(0.3rem,2vw,0.9rem)] bg-linear-to-b from-white/0 to-[#017FA4]/18 opacity-60 mix-blend-multiply transition-[width] duration-200 group-hover:w-[clamp(0.4rem,3vw,1.1rem)]"
            />
            <Link
              href={`/${conference.slug}/content/?id=${item.id}`}
              className="ui-focus-ring relative z-10 block rounded-md px-4 py-5 pl-5 focus-visible:outline-none"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-100 transition-colors group-hover:text-slate-200">
                  {item.title}
                </h3>
                <span
                  aria-hidden="true"
                  className="text-xl transition-colors group-hover:text-slate-300"
                  style={{
                    color: item.tags[0]?.colorBackground ?? "#fff",
                  }}
                >
                  &rarr;
                </span>
              </div>
              <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                {item.tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: tag.colorBackground,
                      color: tag.colorForeground ?? "#fff",
                    }}
                  >
                    {tag.label}
                  </li>
                ))}
              </ul>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
