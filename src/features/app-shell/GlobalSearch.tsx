"use client";

import React, { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { SearchIndex, SearchItem, SearchType } from "@/lib/types/info";
import Link from "next/link";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchData, setSearchData] = useState<SearchIndex>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

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
    person: UserIcon,
    content: DocumentTextIcon,
    organization: GlobeAltIcon,
  };

  const filtered = searchData.filter((item) =>
    query ? item.text.toLowerCase().includes(query.trim().toLowerCase()) : true,
  );

  return (
    <>
      <button
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-300 transition hover:text-white"
        onClick={() => setIsOpen(true)}
        aria-label="Open search"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative mx-4 w-full max-w-lg rounded-lg border border-gray-800 bg-gray-950 p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
              onClick={() => setIsOpen(false)}
              aria-label="Close search"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* TODO: Design polish for this search modal and results list. */}
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-gray-900 py-2 pl-10 pr-4 text-white placeholder:text-gray-500"
                placeholder={loading ? "Loading..." : "Search..."}
                autoFocus
              />
            </div>

            <div className="mt-3 max-h-60 overflow-auto rounded-md border border-gray-900 bg-gray-900">
              {loading ? (
                <p className="px-4 py-2 text-gray-400">Loading...</p>
              ) : searchData.length === 0 ? (
                <p className="px-4 py-2 text-gray-400">No results found.</p>
              ) : filtered.length === 0 ? (
                <p className="px-4 py-2 text-gray-400">No matching results.</p>
              ) : (
                <ul className="divide-y divide-gray-800">
                  {filtered.map((item: SearchItem) => {
                    const Icon = icons[item.type] || (() => null);
                    return (
                      <li key={`${item.type}-${item.id}`}>
                        <Link
                          href={`/${item.type}?id=${item.id}`}
                          className="flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-gray-800"
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className="h-5 w-5 shrink-0 text-gray-400" />
                          <span className="flex-1">{item.text}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
