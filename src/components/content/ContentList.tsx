import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import type { ProcessedContent } from "@/types/info";
import { Badge } from "@/components/ui/badge";

interface Props {
  content: ProcessedContent[];
}

export default function ContentList({ content }: Props) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      content.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      ),
    [content, search]
  );

  return (
    <section className="px-4 md:px-8 lg:px-16 my-10 mx-5">
      {/* Search Input */}
      <div className="mb-8 flex justify-center">
        <Input
          placeholder="Search content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl"
        />
      </div>

      {/* Dark-themed Content List */}
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
                  <Badge
                    key={tag.id}
                    className="font-medium"
                    style={{
                      backgroundColor: tag.color_background,
                      color: tag.color_foreground ?? "#fff",
                    }}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
