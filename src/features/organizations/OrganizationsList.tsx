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
  const showResultCount = normalizedSearch.length > 0;

  return (
    <section className="ui-container ui-section">
      <SearchHeader
        title={title}
        searchLabel={`Search ${title}`}
        searchPlaceholder={`Search ${title}...`}
        searchValue={search}
        onSearchChange={setSearch}
      />

      {showResultCount ? (
        <p role="status" aria-live="polite" className="mt-3 text-sm text-slate-300">
          {filteredOrganizations.length} found
        </p>
      ) : null}

      {filteredOrganizations.length === 0 ? (
        <div role="status" className="mt-10 rounded-2xl border border-white/10 bg-slate-900/40 p-6 text-center">
          <p className="text-slate-200">
            {normalizedSearch
              ? `No ${title.toLowerCase()} match "${search.trim()}".`
              : `No ${title.toLowerCase()} are listed yet.`}
          </p>
          {normalizedSearch ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="ui-btn-base ui-btn-secondary ui-focus-ring mt-4 focus-visible:outline-none"
            >
              Clear Search
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredOrganizations.map((organization) => (
            <li key={organization.id} className="h-full">
              <Link
                href={`${detailsBasePath}?id=${organization.id}`}
                className="ui-focus-ring group block h-full rounded-2xl focus-visible:outline-none"
              >
                <article className="ui-card ui-card-interactive flex h-full items-center gap-4 rounded-2xl p-4">
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
