import {
  DocumentTextIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useState, useEffect, useMemo, useCallback } from "react";

import type { SearchIndex, SearchItem, SearchType } from "@/lib/types/info";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchData, setSearchData] = useState<SearchIndex>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const loadSearchData = useCallback(() => {
    if (loading || searchData.length > 0) return;
    setLoading(true);
    fetch("/ht/search.json")
      .then((res) => res.json())
      .then((data) => setSearchData(data))
      .finally(() => setLoading(false));
  }, [loading, searchData.length]);

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
    return searchData.filter((item) => item.text.toLowerCase().includes(normalizedQuery));
  }, [query, searchData]);

  return (
    <>
      <button
        type="button"
        className="ui-focus-ring ui-icon-btn h-10 w-10 border-transparent bg-transparent text-slate-300 hover:text-white focus-visible:outline-none"
        onClick={() => {
          setIsOpen(true);
          loadSearchData();
        }}
        aria-label="Open search"
      >
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-overlay)"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="ui-card relative mx-4 w-full max-w-lg p-4 shadow-xl"
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
              className="ui-focus-ring absolute top-3 right-3 rounded-md text-slate-400 transition hover:text-white focus-visible:outline-none"
              onClick={() => setIsOpen(false)}
              aria-label="Close search"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="relative">
              <label htmlFor="global-search-input" className="sr-only">
                Search
              </label>
              <MagnifyingGlassIcon
                className="pointer-events-none absolute top-3 left-3 h-5 w-5 text-slate-500"
                aria-hidden="true"
              />
              <input
                id="global-search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="ui-input-base ui-input-focus pr-4 pl-10 text-white placeholder:text-slate-500 focus-visible:outline-none"
                placeholder={loading ? "Loading..." : "Search..."}
                autoFocus
              />
            </div>

            <div className="mt-3 max-h-60 overflow-auto rounded-md border border-white/10 bg-slate-900/90">
              {loading ? (
                <p className="px-4 py-2 text-slate-400">Loading...</p>
              ) : searchData.length === 0 ? (
                <p className="px-4 py-2 text-slate-400">No results found.</p>
              ) : filtered.length === 0 ? (
                <p className="px-4 py-2 text-slate-400">No matching results.</p>
              ) : (
                <ul className="divide-y divide-slate-800/80">
                  {filtered.map((item: SearchItem) => {
                    const Icon = icons[item.type] || (() => null);
                    return (
                      <li key={`${item.type}-${item.id}`}>
                        <Link
                          href={`/${item.type}?id=${item.id}`}
                          className="ui-focus-ring flex items-center gap-3 px-4 py-2 text-slate-200 transition-colors hover:bg-slate-800/80 focus-visible:outline-none"
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
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
