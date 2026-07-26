import { useCallback, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

import Image from "@/components/Image";
import PageHeader from "@/components/ui/PageHeader";
import { getDirectoryInitials } from "@/lib/directoryText";
import { alphaSort } from "@/lib/misc";
import { OrganizationCard } from "@/lib/types/ht-types";
import { getSafeImageHref } from "@/lib/url";

type Props = {
  organizations: Array<OrganizationCard>;
  title: string;
  detailsBasePath: string;
};

const ORGANIZATION_SEARCH_DEBOUNCE_MS = 300;

export default function OrganizationsList({ organizations, title, detailsBasePath }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const [brokenLogoIds, setBrokenLogoIds] = useState<Record<number, true>>({});
  const normalizedSearch = search.trim().toLowerCase();
  const submitSearch = useCallback(
    (nextQuery: string) => {
      const value = nextQuery.trim();
      if (search === value) return;

      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(currentParams);
          const currentValue = currentParams.get("q") ?? "";

          if (currentValue === value) return currentParams;

          if (value) {
            nextParams.set("q", value);
          } else {
            nextParams.delete("q");
          }

          return nextParams;
        },
        { replace: true },
      );
    },
    [search, setSearchParams],
  );

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
      <PageHeader
        title={title}
        description="Browse conference groups and related links."
        resultLabel={showResultCount ? `${filteredOrganizations.length} found` : undefined}
        search={{
          label: `Search ${title}`,
          placeholder: `Search ${title}...`,
          value: search,
          debounceMs: ORGANIZATION_SEARCH_DEBOUNCE_MS,
          onDebouncedSubmit: submitSearch,
          onSubmit: submitSearch,
        }}
      />

      {filteredOrganizations.length === 0 ? (
        <div role="status" className="ui-empty-state ui-page-empty-offset">
          <p>
            {normalizedSearch
              ? `No ${title.toLowerCase()} match "${search.trim()}".`
              : `No ${title.toLowerCase()} are listed yet.`}
          </p>
          {normalizedSearch ? (
            <button
              type="button"
              onClick={() => submitSearch("")}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action"
            >
              Clear search
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="ui-organization-grid">
          {filteredOrganizations.map((organization) => {
            const logoUrl = getSafeImageHref(organization.logoUrl);
            const showLogo = Boolean(logoUrl) && !brokenLogoIds[organization.id];

            return (
              <li key={organization.id} className="ui-grid-card-item">
                <Link
                  to={`${detailsBasePath}${encodeURIComponent(String(organization.id))}`}
                  className="ui-focus-ring ui-organization-card-link"
                >
                  <article className="ui-card ui-card-interactive ui-organization-card">
                    <div className="ui-logo-media ui-logo-media-sm">
                      {showLogo && logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt={`${organization.name} logo`}
                          className="ui-image-contain ui-logo-image"
                          sizes="2.75rem"
                          onError={() =>
                            setBrokenLogoIds((current) =>
                              current[organization.id]
                                ? current
                                : { ...current, [organization.id]: true },
                            )
                          }
                        />
                      ) : (
                        <div className="ui-logo-initials" aria-hidden="true">
                          {getDirectoryInitials(organization.name)}
                        </div>
                      )}
                    </div>

                    <div className="ui-organization-name">
                      <h2 className="ui-card-title">{organization.name}</h2>
                    </div>
                  </article>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
