import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

import SearchHeader from "@/components/ui/SearchHeader";
import { alphaSort } from "@/lib/misc";
import { OrganizationCard } from "@/lib/types/ht-types";

type Props = {
  organizations: Array<OrganizationCard>;
  title: string;
  detailsBasePath: string;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function OrganizationsList({ organizations, title, detailsBasePath }: Props) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const sortedOrganizations = useMemo(
    () => organizations.toSorted((a, b) => alphaSort(a.name, b.name)),
    [organizations],
  );
  const filtered = useMemo(
    () =>
      normalizedSearch.length > 0
        ? sortedOrganizations.filter((o) => o.name.toLowerCase().includes(normalizedSearch))
        : sortedOrganizations,
    [sortedOrganizations, normalizedSearch],
  );

  return (
    <section className="mx-auto my-10 max-w-7xl px-5">
      <SearchHeader
        title={title}
        searchLabel={`Search ${title}`}
        searchPlaceholder={`Search ${title}...`}
        searchValue={search}
        onSearchChange={setSearch}
      />

      {filtered.length === 0 ? (
        <p role="status" className="text-center text-slate-400">
          No {title.toLowerCase()} found.
        </p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((o) => (
            <li key={o.id} className="h-full">
              <Link
                href={`${detailsBasePath}/?id=${o.id}`}
                className="block rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none"
              >
                <div className="transform overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-slate-900 to-slate-800 shadow-lg ring-indigo-600 ring-offset-4 transition-all hover:scale-[1.02] hover:from-slate-800 hover:to-slate-700 hover:ring-4">
                  <div className="flex flex-col items-center justify-center space-y-4 p-6">
                    {o.logoUrl ? (
                      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-slate-800 ring-2 ring-slate-600 md:h-32 md:w-32">
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
                      <div className="flex h-24 w-24 items-center justify-center bg-slate-800 text-2xl font-bold text-white ring-2 ring-slate-600 md:h-32 md:w-32">
                        {getInitials(o.name)}
                      </div>
                    )}
                    <h2 className="text-center text-lg font-medium text-slate-100">{o.name}</h2>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
