import Link from "next/link";
import { useState } from "react";
import {
  InformationCircleIcon as InformationCircleIconSoild,
  UserIcon as UserIconSoild,
  StarIcon as StarIconSoild,
  CalendarIcon as CalendarIconSoild,
  LocationMarkerIcon as LocationMarkerIconSoild,
  TagIcon as TagIconSoild,
  DeviceMobileIcon as DeviceMobileIconSoild,
  MapIcon as MapIconSoild,
} from "@heroicons/react/solid";
import {
  InformationCircleIcon as InformationCircleIconOutline,
  CalendarIcon as CalendarIconOutline,
  StarIcon as StarIconOutline,
  UserIcon as UserIconOutline,
  LocationMarkerIcon as LocationMarkerIconOutline,
  TagIcon as TagIconOutline,
  DeviceMobileIcon as DeviceMobileIconOutline,
  MapIcon as MapIconOutline,
} from "@heroicons/react/outline";

function Links() {
  const [active, setActive] = useState("");

  const links = [
    {
      url: "/events",
      label: "Schedule",
      icon: CalendarIconOutline,
      active: CalendarIconSoild,
    },
    {
      url: "/info",
      label: "Info",
      icon: InformationCircleIconOutline,
      active: InformationCircleIconSoild,
    },
    {
      url: "/bookmarks",
      label: "Bookmarks",
      icon: StarIconOutline,
      active: StarIconSoild,
    },
    {
      url: "/maps",
      label: "Maps",
      icon: MapIconOutline,
      active: MapIconSoild,
    },
    {
      url: "/locations",
      label: "Locations",
      icon: LocationMarkerIconOutline,
      active: LocationMarkerIconSoild,
    },
    {
      url: "/categories",
      label: "Categories",
      icon: TagIconOutline,
      active: TagIconSoild,
    },
    {
      url: "/speakers",
      label: "Speakers",
      icon: UserIconOutline,
      active: UserIconSoild,
    },
    {
      url: "/apps",
      label: "Apps",
      icon: DeviceMobileIconOutline,
      active: DeviceMobileIconSoild,
    },
  ];

  return (
    <div className='flex items-center justify-center mt-6'>
      <div className='text-center grid grid-cols-2 gap-1 gap-x-12 text-base sm:text-lg md:text-xl lg:text-2xl'>
        {links.map((l) => (
          <Link href={l.url} key={l.label}>
            <button
              type='button'
              className='flex align-middle items-center p-1'
              onMouseEnter={() => setActive(l.label)}
              onMouseLeave={() => setActive("")}>
              <div>
                {active !== l.label ? (
                  <l.icon className='h-7 sm:h-8 md:h-9 lg:h-10 mr-2' />
                ) : (
                  <l.active className='h-7 sm:h-8 md:h-9 lg:h-10 mr-2' />
                )}
              </div>
              {l.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Links;
