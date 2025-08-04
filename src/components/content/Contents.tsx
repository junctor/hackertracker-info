import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import type { ProcessedContents, TagTypes } from "@/types/info";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  content: ProcessedContents;
  tags: TagTypes;
}

export default function Contents({ content, tags }: Props) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      content
        .filter((c) =>
          search ? c.title.toLowerCase().includes(search.toLowerCase()) : true
        )
        .filter((c) => {
          if (!selectedTag) return true;
          return c.tags.some((tag) => tag.id === selectedTag);
        }),
    [content, search, selectedTag]
  );

  return (
    <section className="my-10 mx-5">
      <h2 className="mb-4 text-2xl font-semibold text-gray-100">Content</h2>

      {/* Search Input */}
      <div className="mb-8 flex justify-center">
        <Input
          placeholder="Search Content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl"
        />
        {/* Tag Filter */}
        <div className="ml-4">
          <Select
            onValueChange={(value) => {
              setSelectedTag(Number(value));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tags" />
            </SelectTrigger>
            <SelectContent>
              {tags
                .filter(
                  (tag) =>
                    tag.is_browsable &&
                    tag.tags.length > 0 &&
                    tag.category == "content"
                )
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((tag) => (
                  <SelectGroup key={tag.id}>
                    <SelectLabel>{tag.label}</SelectLabel>
                    {tag.tags
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.label}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                ))}
            </SelectContent>
          </Select>
        </div>
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
