import React, { useState, useEffect, useMemo } from "react";
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const icons: Record<SearchType, React.ElementType> = {
    person: UserIcon,
    content: DocumentTextIcon,
    organization: GlobeAltIcon,
  };

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return searchData;
    return searchData.filter((item) =>
      item.text.toLowerCase().includes(normalizedQuery),
    );
  }, [query, searchData]);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        onClick={() => setIsOpen(true)}
        aria-label="Open search"
      >
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
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
            aria-labelledby="global-search-title"
          >
            <h2 id="global-search-title" className="sr-only">
              Global search
            </h2>
            <button
              type="button"
              className="absolute top-3 right-3 rounded-md text-gray-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              onClick={() => setIsOpen(false)}
              aria-label="Close search"
            >
              <XMarkIcon className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* TODO: Design polish for this search modal and results list. */}
            <div className="relative">
              <label htmlFor="global-search-input" className="sr-only">
                Search
              </label>
              <MagnifyingGlassIcon
                className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
              <input
                id="global-search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-gray-900 py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
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
                          className="flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon
                            className="h-5 w-5 shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
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
