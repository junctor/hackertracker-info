import LocationCell from "./LocationCell";
import React from "react";

function Locations({ locations }: { locations: HTLocation[] }) {
  const sortedLocations = locations.sort(
    (a, b) => a.hier_extent_left - b.hier_extent_left
  );

  const childrenLocations = sortedLocations.reduce((dict, loc) => {
    dict.set(
      loc.id,
      sortedLocations.filter((l) => l.parent_id === loc.id)
    );
    return dict;
  }, new Map<number, HTLocation[]>());

  return (
    <div className="mx-5">
      <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
        Locations
      </h1>
      <div className="ml-1">
        {sortedLocations
          .filter((l) => l.hier_depth === 1)
          .map((l) => (
            <div key={l.id} className="m-5">
              <LocationCell
                location={l}
                childrenLocations={childrenLocations}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Locations;
