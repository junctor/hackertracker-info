import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

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
    .map((word) => word[0])
    .filter(Boolean)
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

  const filteredOrganizations = useMemo(() => {
    if (!normalizedSearch) return sortedOrganizations;

    return sortedOrganizations.filter((organization) =>
      organization.name.toLowerCase().includes(normalizedSearch),
    );
  }, [sortedOrganizations, normalizedSearch]);

  const resultLabel =
    normalizedSearch.length > 0
      ? `${filteredOrganizations.length} found`
      : `${sortedOrganizations.length} total`;

  return (
    <section className="mx-auto my-10 max-w-7xl px-5">
      <SearchHeader
        title={title}
        searchLabel={`Search ${title}`}
        searchPlaceholder={`Search ${title}...`}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="mt-3 text-sm text-slate-400">{resultLabel}</div>

      {filteredOrganizations.length === 0 ? (
        <p role="status" className="mt-10 text-center text-slate-400">
          {normalizedSearch
            ? `No ${title.toLowerCase()} match “${search.trim()}”.`
            : `No ${title.toLowerCase()} found.`}
        </p>
      ) : (
        <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredOrganizations.map((organization) => (
            <li key={organization.id} className="h-full">
              <Link
                href={`${detailsBasePath}?id=${organization.id}`}
                className="group block h-full rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none"
              >
                <article className="flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition group-hover:border-white/20 group-hover:bg-slate-800/70">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-800 sm:h-20 sm:w-20">
                    {organization.logoUrl ? (
                      <Image
                        src={organization.logoUrl}
                        alt={`${organization.name} logo`}
                        fill
                        className="object-contain p-2"
                        sizes="(min-width: 640px) 5rem, 4rem"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-sm font-semibold tracking-[0.12em] text-white">
                        {getInitials(organization.name)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-base leading-6 font-medium text-slate-100 transition group-hover:text-white">
                      {organization.name}
                    </h2>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
