import { useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import { type LocationEntity, type LocationsStore } from "@/lib/types/ht-types";

type Props = {
  locations: LocationsStore;
};

function getLocationName(location: LocationEntity) {
  return location.name.trim() || location.shortName?.trim() || "Unnamed location";
}

function getLocationShortName(location: LocationEntity) {
  const shortName = location.shortName?.trim();
  if (!shortName || shortName === getLocationName(location)) return null;
  return shortName;
}

export default function LocationsList({ locations }: Props) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();

  const orderedLocations = useMemo(
    () =>
      locations.allIds
        .map((id) => locations.byId[id])
        .filter((location): location is LocationEntity => Boolean(location)),
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
        title="Locations"
        description="Find rooms, villages, and venue references used across the schedule."
        resultLabel={showResultCount ? `${filteredLocations.length} found` : undefined}
        search={{
          label: "Search locations",
          placeholder: "Search locations...",
          value: search,
          onChange: setSearch,
        }}
      />

      {filteredLocations.length === 0 ? (
        <div role="status" className="ui-empty-state mt-10">
          <p>
            {normalizedSearch
              ? `No locations match "${search.trim()}".`
              : "No locations are listed yet."}
          </p>
          {normalizedSearch ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action focus-visible:outline-none"
            >
              Clear Search
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="mt-6 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((location) => {
            const name = getLocationName(location);
            const shortName = getLocationShortName(location);

            return (
              <li key={location.id}>
                <article className="ui-card h-full px-4 py-3.5 sm:px-5 sm:py-4">
                  <h2 className="ui-card-title text-base">{name}</h2>
                  {shortName ? <p className="ui-card-meta mt-1">{shortName}</p> : null}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
