import { useMemo, useState } from "react";

import SearchHeader from "@/components/ui/SearchHeader";
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
      <SearchHeader
        title="Locations"
        searchLabel="Search locations"
        searchPlaceholder="Search locations..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      {showResultCount ? (
        <p role="status" aria-live="polite" className="mt-3 text-sm text-slate-300">
          {filteredLocations.length} found
        </p>
      ) : null}

      {filteredLocations.length === 0 ? (
        <div role="status" className="ui-empty-state mt-10">
          <p className="text-slate-200">
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
                  <h2 className="text-base leading-6 font-semibold text-slate-100">{name}</h2>
                  {shortName ? (
                    <p className="mt-1 text-sm leading-5 text-slate-400">{shortName}</p>
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
