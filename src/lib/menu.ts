import type { ComponentType } from "react";

import {
  ArchiveBoxIcon,
  BoltIcon,
  BookmarkIcon,
  CubeIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  MapIcon,
  MegaphoneIcon,
  ShoppingBagIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import type { ConferenceManifest, SiteMenuKey } from "./conferences";
import type { PageId } from "./types/page-meta";

export type OrganizationDirectoryConfig = {
  title: string;
  tagLabel: string;
  slug: string;
  description?: string;
};

export const ORGANIZATION_DIRECTORY_CONFIG: Readonly<
  Partial<Record<PageId, OrganizationDirectoryConfig>>
> = Object.freeze({
  communities: {
    title: "Communities",
    tagLabel: "community",
    slug: "communities",
    description: "Special-interest groups and meetups.",
  },
  departments: {
    title: "Departments",
    tagLabel: "def_con_department",
    slug: "departments",
    description: "Departments and responsibilities.",
  },
  villages: {
    title: "Villages",
    tagLabel: "village",
    slug: "villages",
    description: "Hands-on villages and activities.",
  },
  contests: {
    title: "Contests",
    tagLabel: "contest",
    slug: "contests",
    description: "CTFs, challenges, and competitions.",
  },
  contents: {
    title: "Contents",
    tagLabel: "content",
    slug: "contents",
    description: "Content-focused organizations and initiatives.",
  },
  exhibitors: {
    title: "Exhibitors",
    tagLabel: "exhibitor",
    slug: "exhibitors",
    description: "Exhibitor booths and products.",
  },
  vendors: {
    title: "Vendors",
    tagLabel: "vendor",
    slug: "vendors",
    description: "Vendor booths and offerings.",
  },
});

export function getOrganizationDirectoryConfig(pageId: PageId) {
  return ORGANIZATION_DIRECTORY_CONFIG[pageId];
}

export type SiteMenuItem = {
  sort_order: number;
  title: string;
  href: string;
  description?: string;
  icon: ComponentType<{ className?: string }>;
};

// eslint-disable-next-line no-unused-vars
type MenuBuilder = (conference: ConferenceManifest) => SiteMenuItem;

const MENU: Record<SiteMenuKey, MenuBuilder> = {
  readme: (c) => ({
    sort_order: 10,
    title: "readme.nfo",
    href: `/${c.slug}/readme.nfo`,
    description: "Reference docs, FAQs, and updates.",
    icon: InformationCircleIcon,
  }),

  announcements: (c) => ({
    sort_order: 20,
    title: "Announcements",
    href: `/${c.slug}/announcements`,
    description: "Conference announcements and urgent updates.",
    icon: MegaphoneIcon,
  }),

  schedule: (c) => ({
    sort_order: 30,
    title: "Schedule",
    href: `/${c.slug}/schedule`,
    description: "Session times, rooms, and live status.",
    icon: ListBulletIcon,
  }),

  bookmarks: (c) => ({
    sort_order: 40,
    title: "Bookmarks",
    href: `/${c.slug}/bookmarks`,
    description: "Save your favorite talks, workshops, and events.",
    icon: BookmarkIcon,
  }),

  content: (c) => ({
    sort_order: 50,
    title: "Content",
    href: `/${c.slug}/content`,
    description: "Talks, workshops, and presentation details.",
    icon: ListBulletIcon,
  }),

  departments: (c) => {
    const directory = getOrganizationDirectoryConfig("departments");
    return {
      sort_order: 55,
      title: directory?.title ?? "Departments",
      href: `/${c.slug}/${directory?.slug ?? "departments"}`,
      description: directory?.description ?? "Departments and responsibilities.",
      icon: CubeIcon,
    };
  },

  people: (c) => ({
    sort_order: 60,
    title: "People",
    href: `/${c.slug}/people`,
    description: "People and their sessions.",
    icon: UserIcon,
  }),

  maps: (c) => ({
    sort_order: 70,
    title: "Maps",
    href: `/${c.slug}/maps`,
    description: "View venue layouts and floor plans.",
    icon: MapIcon,
  }),

  locations: (c) => ({
    sort_order: 80,
    title: "Locations",
    href: `/${c.slug}/locations`,
    description: "Rooms and venue locations.",
    icon: GlobeAltIcon,
  }),

  merch: (c) => ({
    sort_order: 90,
    title: "Merch",
    href: `/${c.slug}/merch`,
    description: "Official merch and purchasing info.",
    icon: ShoppingBagIcon,
  }),

  search: (c) => ({
    sort_order: 100,
    title: "Search Everything",
    href: `/${c.slug}/search`,
    description: "Search talks, people, orgs, and more.",
    icon: MagnifyingGlassIcon,
  }),

  villages: (c) => {
    const directory = getOrganizationDirectoryConfig("villages");
    return {
      sort_order: 110,
      title: directory?.title ?? "Villages",
      href: `/${c.slug}/${directory?.slug ?? "villages"}`,
      description: directory?.description ?? "Hands-on villages and activities.",
      icon: ArchiveBoxIcon,
    };
  },

  communities: (c) => {
    const directory = getOrganizationDirectoryConfig("communities");
    return {
      sort_order: 120,
      title: directory?.title ?? "Communities",
      href: `/${c.slug}/${directory?.slug ?? "communities"}`,
      description: directory?.description ?? "Special-interest groups and meetups.",
      icon: UsersIcon,
    };
  },

  contests: (c) => {
    const directory = getOrganizationDirectoryConfig("contests");
    return {
      sort_order: 130,
      title: directory?.title ?? "Contests",
      href: `/${c.slug}/${directory?.slug ?? "contests"}`,
      description: directory?.description ?? "CTFs, challenges, and competitions.",
      icon: BoltIcon,
    };
  },

  exhibitors: (c) => {
    const directory = getOrganizationDirectoryConfig("exhibitors");
    return {
      sort_order: 140,
      title: directory?.title ?? "Exhibitors",
      href: `/${c.slug}/${directory?.slug ?? "exhibitors"}`,
      description: directory?.description ?? "Exhibitor booths and products.",
      icon: CubeIcon,
    };
  },

  vendors: (c) => {
    const directory = getOrganizationDirectoryConfig("vendors");
    return {
      sort_order: 150,
      title: directory?.title ?? "Vendors",
      href: `/${c.slug}/${directory?.slug ?? "vendors"}`,
      description: directory?.description ?? "Vendor booths and offerings.",
      icon: CubeIcon,
    };
  },
};

export function getSiteMenu(conference: ConferenceManifest): SiteMenuItem[] {
  // Build exactly what the conference manifest asks for.
  const items = conference.siteMenu.map((key) => MENU[key](conference));

  // Sort just in case keys are rearranged or you want stable ordering.
  return items.toSorted((a, b) => a.sort_order - b.sort_order);
}
