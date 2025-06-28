"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import {
  MagnifyingGlassIcon,
  PersonIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import type { SearchIndex, SearchItem, SearchType } from "@/types/info";
import Link from "next/link";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchData, setSearchData] = useState<SearchIndex>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && searchData.length === 0) {
      setLoading(true);
      fetch("/ht/search.json")
        .then((res) => res.json())
        .then((data) => setSearchData(data))
        .finally(() => setLoading(false));
    }
  }, [isOpen, searchData.length]);

  const icons: Record<SearchType, React.ElementType> = {
    person: PersonIcon,
    event: CalendarIcon,
    content: FileTextIcon,
    organization: GlobeIcon,
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Open search"
      >
        <MagnifyingGlassIcon />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative mx-4 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
              onClick={() => setIsOpen(false)}
              aria-label="Close search"
            >
              <Cross1Icon className="w-5 h-5" />
            </button>

            <Command className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-lg text-white">
              <div className="relative">
                <CommandInput
                  onValueChange={() => {}}
                  className="w-full bg-gray-800 text-white placeholder-gray-500 pl-11 pr-4 py-3 focus:ring-0"
                  placeholder={loading ? "Loading…" : "Search…"}
                  autoFocus
                />
              </div>

              <CommandList className="max-h-60 overflow-auto bg-gray-900">
                {loading ? (
                  <CommandEmpty className="px-4 py-2 text-gray-400">
                    Loading…
                  </CommandEmpty>
                ) : searchData.length === 0 ? (
                  <CommandEmpty className="px-4 py-2 text-gray-400">
                    No results found.
                  </CommandEmpty>
                ) : (
                  searchData.map((item: SearchItem) => {
                    const Icon = icons[item.type] || (() => null);
                    return (
                      <CommandItem
                        asChild
                        key={`${item.type}-${item.id}`}
                        value={item.text}
                        className="flex items-center space-x-3 px-4 py-2 rounded-sm data-[highlighted]:bg-gray-700 data-[highlighted]:text-white"
                      >
                        <Link href={`/${item.type}?id=${item.id}`}>
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span className="flex-1">{item.text}</span>
                        </Link>
                      </CommandItem>
                    );
                  })
                )}
              </CommandList>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
