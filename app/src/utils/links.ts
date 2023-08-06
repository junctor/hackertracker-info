import {
  InformationCircleIcon as InformationCircleIconSoild,
  UserIcon as UserIconSoild,
  BookmarkIcon as BookmarkIconSoild,
  CalendarIcon as CalendarIconSoild,
  MapPinIcon as LocationMarkerIconSoild,
  TagIcon as TagIconSoild,
  DevicePhoneMobileIcon as DeviceMobileIconSoild,
  MapIcon as MapIconSoild,
  BuildingOffice2Icon as BuildingOffice2IconSoild,
  ShoppingBagIcon as ShoppingBagIconSoild,
  UserGroupIcon as UserGroupIconSoild,
} from "@heroicons/react/24/solid";
import {
  InformationCircleIcon as InformationCircleIconOutline,
  CalendarIcon as CalendarIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  UserIcon as UserIconOutline,
  MapPinIcon as LocationMarkerIconOutline,
  TagIcon as TagIconOutline,
  DevicePhoneMobileIcon as DeviceMobileIconOutline,
  MapIcon as MapIconOutline,
  BuildingOffice2Icon as BuildingOffice2IconOutline,
  ShoppingBagIcon as ShoppingBagIconOutline,
  UserGroupIcon as UserGroupIconOutline,
} from "@heroicons/react/24/outline";

export const links = [
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
    icon: BookmarkIconOutline,
    active: BookmarkIconSoild,
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
    url: "/tags",
    label: "Tags",
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
    url: "/villages",
    label: "Villages",
    icon: UserGroupIconOutline,
    active: UserGroupIconSoild,
  },
  {
    url: "/exhibitors",
    label: "Exhibitors",
    icon: BuildingOffice2IconOutline,
    active: BuildingOffice2IconSoild,
  },
  {
    url: "/vendors",
    label: "Vendors",
    icon: ShoppingBagIconOutline,
    active: ShoppingBagIconSoild,
  },
  {
    url: "/apps",
    label: "Apps",
    icon: DeviceMobileIconOutline,
    active: DeviceMobileIconSoild,
  },
];