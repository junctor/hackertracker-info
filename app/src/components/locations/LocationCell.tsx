function LocationCell({
  location,
  childrenLocations,
}: {
  location: HTLocations;
  childrenLocations: Map<number, HTLocations[]>;
}) {
  const circleStatus = (): string => {
    const timeNow = new Date();

    const { schedule } = location;

    if (schedule.length > 0) {
      if (
        schedule.some(
          (s) =>
            s.status === "open" &&
            timeNow >= new Date(s.begin) &&
            timeNow <= new Date(s.end)
        )
      ) {
        return "bg-dc-yellow";
      }
      if (
        schedule.some(
          (s) =>
            s.status === "closed" &&
            timeNow >= new Date(s.begin) &&
            timeNow <= new Date(s.end)
        )
      ) {
        return "bg-dc-red";
      }
    }

    switch (location.default_status) {
      case "open":
        return "bg-dc-yellow";
      case "closed":
        return "bg-dc-red";
      default:
        return "bg-dc-gray";
    }
  };

  const heirCirle = (): number => {
    switch (location.hier_depth) {
      case 1:
        return 7;
      case 2:
        return 6;
      case 3:
        return 5;
      case 4:
        return 4;
      case 5:
        return 3;
      default:
        return 2;
    }
  };

  const heirMargin = (): number => {
    switch (location.hier_depth) {
      case 1:
        return 0;
      case 2:
        return 4;
      case 3:
        return 8;
      case 4:
        return 12;
      case 5:
        return 16;
      default:
        return 18;
    }
  };

  const locationTitle = (): string => {
    switch (location.hier_depth) {
      case 1:
        return "text-2xl";
      case 2:
        return "text-lg";
      case 3:
        return "text-base";
      case 4:
        return "text-sm";
      case 5:
        return "text-xs";
      default:
        return "text-xs";
    }
  };

  return (
    <div className={`ml-${heirMargin()}`}>
      <div className="flex items-center">
        {location.hier_depth !== 1 && (
          <div
            className={`flex-none rounded-full w-${heirCirle()} h-${heirCirle()} mr-2 ${circleStatus()}`}
          />
        )}
        <h2 className={`${locationTitle()}`}>{location.short_name}</h2>
      </div>
      {childrenLocations.get(location.id)?.map((l) => (
        <LocationCell
          key={l.id}
          location={l}
          childrenLocations={childrenLocations}
        />
      ))}
    </div>
  );
}

export default LocationCell;
