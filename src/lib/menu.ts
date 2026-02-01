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
    description: "Connect with special-interest groups and meetups.",
  },
  departments: {
    title: "Departments",
    tagLabel: "def_con_department",
    slug: "departments",
    description: "Explore the various departments and their functions.",
  },
  villages: {
    title: "Villages",
    tagLabel: "village",
    slug: "villages",
    description: "Explore hands-on villages for hacking and collaboration.",
  },
  contests: {
    title: "Contests",
    tagLabel: "contest",
    slug: "contests",
    description: "Test your skills in CTFs, challenges, and competitions.",
  },
  contents: {
    title: "Contents",
    tagLabel: "content",
    slug: "contents",
    description: "Browse content-focused organizations and initiatives.",
  },
  exhibitors: {
    title: "Exhibitors",
    tagLabel: "exhibitor",
    slug: "exhibitors",
    description: "Discover exhibitors showcasing tools and solutions.",
  },
  vendors: {
    title: "Vendors",
    tagLabel: "vendor",
    slug: "vendors",
    description: "Browse vendors offering gear, swag, and services.",
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

type MenuBuilder = (conference: ConferenceManifest) => SiteMenuItem;

const MENU: Record<SiteMenuKey, MenuBuilder> = {
  readme: (c) => ({
    sort_order: 10,
    title: "readme.nfo",
    href: `/${c.slug}/readme.nfo`,
    description: `A collection of information related to ${c.name}.`,
    icon: InformationCircleIcon,
  }),

  announcements: (c) => ({
    sort_order: 20,
    title: "Announcements",
    href: `/${c.slug}/announcements`,
    description:
      "Get real-time updates and important news during the conference.",
    icon: MegaphoneIcon,
  }),

  schedule: (c) => ({
    sort_order: 30,
    title: "Schedule",
    href: `/${c.slug}/schedule`,
    description: `Browse the full schedule for ${c.name}.`,
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
    description: `Browse talks, workshops, and presentations at ${c.name}.`,
    icon: ListBulletIcon,
  }),

  departments: (c) => {
    const directory = getOrganizationDirectoryConfig("departments");
    return {
      sort_order: 55,
      title: directory?.title ?? "Departments",
      href: `/${c.slug}/${directory?.slug ?? "departments"}`,
      description:
        directory?.description ??
        `Explore the various departments and their functions at ${c.name}.`,
      icon: CubeIcon,
    };
  },

  people: (c) => ({
    sort_order: 60,
    title: "Speakers",
    href: `/${c.slug}/people`,
    description: `Explore speakers at ${c.name}.`,
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
    title: "Location Tree",
    href: `/${c.slug}/locations`,
    description: "Browse venues, rooms, and spaces.",
    icon: GlobeAltIcon,
  }),

  merch: (c) => ({
    sort_order: 90,
    title: "Merch",
    href: `/${c.slug}/merch`,
    description: "Browse official merch and products.",
    icon: ShoppingBagIcon,
  }),

  search: (c) => ({
    sort_order: 100,
    title: "Global Search",
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
      description:
        directory?.description ??
        "Explore hands-on villages for hacking, learning, and collaboration.",
      icon: ArchiveBoxIcon,
    };
  },

  communities: (c) => {
    const directory = getOrganizationDirectoryConfig("communities");
    return {
      sort_order: 120,
      title: directory?.title ?? "Communities",
      href: `/${c.slug}/${directory?.slug ?? "communities"}`,
      description:
        directory?.description ??
        `Connect with special-interest groups and meetups at ${c.name}.`,
      icon: UsersIcon,
    };
  },

  contests: (c) => {
    const directory = getOrganizationDirectoryConfig("contests");
    return {
      sort_order: 130,
      title: directory?.title ?? "Contests",
      href: `/${c.slug}/${directory?.slug ?? "contests"}`,
      description:
        directory?.description ??
        "Test your skills in CTFs, challenges, and competitions.",
      icon: BoltIcon,
    };
  },

  exhibitors: (c) => {
    const directory = getOrganizationDirectoryConfig("exhibitors");
    return {
      sort_order: 140,
      title: directory?.title ?? "Exhibitors",
      href: `/${c.slug}/${directory?.slug ?? "exhibitors"}`,
      description:
        directory?.description ??
        "Discover exhibitors showcasing tools and solutions.",
      icon: CubeIcon,
    };
  },

  vendors: (c) => {
    const directory = getOrganizationDirectoryConfig("vendors");
    return {
      sort_order: 150,
      title: directory?.title ?? "Vendors",
      href: `/${c.slug}/${directory?.slug ?? "vendors"}`,
      description:
        directory?.description ??
        "Browse vendors offering gear, swag, and services.",
      icon: CubeIcon,
    };
  },
};

export function getSiteMenu(conference: ConferenceManifest): SiteMenuItem[] {
  // Build exactly what the conference manifest asks for.
  const items = conference.siteMenu.map((key) => MENU[key](conference));

  // Sort just in case keys are rearranged or you want stable ordering.
  return items.sort((a, b) => a.sort_order - b.sort_order);
}
