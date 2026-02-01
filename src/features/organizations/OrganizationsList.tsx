import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { alphaSort } from "@/lib/misc";
import { OrganizationCard } from "@/lib/types/ht-types";

type Props = {
  organizations: Array<OrganizationCard>;
  title: string;
  detailsBasePath: string;
};

export default function OrganizationsList({
  organizations,
  title,
  detailsBasePath,
}: Props) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const sortedOrganizations = useMemo(
    () => [...organizations].sort((a, b) => alphaSort(a.name, b.name)),
    [organizations],
  );
  const filtered = useMemo(
    () =>
      normalizedSearch.length > 0
        ? sortedOrganizations.filter((o) =>
            o.name.toLowerCase().includes(normalizedSearch),
          )
        : sortedOrganizations,
    [sortedOrganizations, normalizedSearch],
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <section className="my-10 mx-auto px-5 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-100">
          {title}
        </h1>
        <label className="w-full md:w-auto max-w-sm">
          <span className="sr-only">Search {title}</span>
          <input
            type="search"
            placeholder={`Search ${title}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p role="status" className="text-center text-gray-400">
          No {title.toLowerCase()} found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.map((o) => (
            <Link
              key={o.id}
              href={`${detailsBasePath}/?id=${o.id}`}
              className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-2xl"
            >
              <div className="bg-linear-to-br from-gray-800 to-gray-700 border border-gray-700 shadow-lg rounded-2xl hover:from-gray-700 hover:to-gray-600 transition-all transform hover:scale-[1.02] overflow-hidden ring-offset-4 ring-indigo-600 hover:ring-4">
                <div className="flex flex-col items-center justify-center p-6 space-y-4">
                  {o.logoUrl ? (
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-800 ring-2 ring-gray-600 flex items-center justify-center">
                      {o.logoUrl && (
                        <Image
                          className="object-contain p-2 transition-transform hover:scale-105"
                          src={o.logoUrl}
                          alt={`${o.name} logo`}
                          fill
                          sizes="(min-width: 768px) 8rem, 6rem"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-gray-800 ring-2 ring-gray-600 text-white text-2xl font-bold">
                      {getInitials(o.name)}
                    </div>
                  )}
                  <h2 className="text-lg font-medium text-gray-100 text-center">
                    {o.name}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
