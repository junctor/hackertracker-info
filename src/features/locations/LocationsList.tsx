import { useMemo } from "react";
import { useSearchParams } from "react-router";

import PageHeader from "@/components/ui/PageHeader";
import { type LocationCard, type LocationCardsView } from "@/lib/types/ht-types/views";

type Props = {
  locations: LocationCardsView;
  title?: string;
  description?: string;
};

function getLocationName(location: LocationCard) {
  return location.name.trim() || location.shortName?.trim() || "Unnamed location";
}

function getLocationShortName(location: LocationCard) {
  const shortName = location.shortName?.trim();
  if (!shortName || shortName === getLocationName(location)) return null;
  return shortName;
}

export default function LocationsList({
  locations,
  title = "Locations",
  description = "Find rooms, villages, and venue references used across the schedule.",
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const normalizedSearch = search.trim().toLowerCase();
  const submitSearch = (nextQuery: string) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        const value = nextQuery.trim();

        if (value) {
          nextParams.set("q", value);
        } else {
          nextParams.delete("q");
        }

        return nextParams;
      },
      { replace: true },
    );
  };

  const orderedLocations = useMemo(
    () => locations.filter((location): location is LocationCard => Boolean(location)),
    [locations],
  );

  const filteredLocations = useMemo(() => {
    if (!normalizedSearch) return orderedLocations;

    return orderedLocations.filter((location) => {
      const name = getLocationName(location).toLowerCase();
      const shortName = getLocationShortName(location)?.toLowerCase() ?? "";
      return name.includes(normalizedSearch) || shortName.includes(normalizedSearch);
    });
  }, [orderedLocations, normalizedSearch]);

  const showResultCount = normalizedSearch.length > 0;

  return (
    <section className="ui-container ui-section">
      <PageHeader
        title={title}
        description={description}
        resultLabel={showResultCount ? `${filteredLocations.length} found` : undefined}
        search={{
          label: "Search locations",
          placeholder: "Search locations...",
          value: search,
          onSubmit: submitSearch,
        }}
      />

      {filteredLocations.length === 0 ? (
        <div role="status" className="ui-empty-state ui-page-empty-offset">
          <p>
            {normalizedSearch
              ? `No locations match "${search.trim()}".`
              : "No locations are listed yet."}
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
        <ul className="ui-location-grid">
          {filteredLocations.map((location) => {
            const name = getLocationName(location);
            const shortName = getLocationShortName(location);

            return (
              <li key={location.id}>
                <article className="ui-card ui-location-card">
                  <h2 className="ui-card-title">{name}</h2>
                  {shortName ? (
                    <p className="ui-card-meta ui-location-subtitle">{shortName}</p>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
