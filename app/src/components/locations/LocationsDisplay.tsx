import LocationCell from "./LocationCell";

function LocationsDisplay({ locations }: LocationsProps) {
  const sortedLocations = locations.sort(
    (a, b) => a.hier_extent_left - b.hier_extent_left
  );

  const childrenLocations = sortedLocations.reduce((dict, loc) => {
    dict.set(
      loc.id,
      sortedLocations.filter((l) => l.parent_id === loc.id)
    );
    return dict;
  }, new Map<number, HTLocations[]>());

  return (
    <div className='ml-10'>
      {sortedLocations
        .filter((l) => l.hier_depth === 1)
        .map((l) => (
          <div key={l.id} className='m-5'>
            <LocationCell location={l} childrenLocations={childrenLocations} />
          </div>
        ))}
    </div>
  );
}

export default LocationsDisplay;
