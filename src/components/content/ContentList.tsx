import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import type { ProcessedContent } from "@/types/info";

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
    <section>
      <div className="mb-6">
        <Input
          placeholder="Search content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <ul className="divide-y divide-gray-700">
        {filtered.map((item) => (
          <li key={item.id}>
            <Link
              href={`/content?id=${item.id}`}
              className="flex justify-between items-center px-4 py-3 hover:bg-gray-700 transition-colors"
            >
              <span className="text-lg font-medium text-gray-100">
                {item.title}
              </span>
              <span className="text-gray-400">&rarr;</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
