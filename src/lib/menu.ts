import type { ComponentType } from "react";

import {
  ArchiveBoxIcon,
  BoltIcon,
  BookmarkIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  CubeIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  MapIcon,
  MegaphoneIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import type { ConferenceManifest, SiteMenuKey } from "./conferences";
import type { DerivedSiteMenu, DerivedSiteMenuItem } from "./types/ht-types";
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
  sourceId?: number;
  fn?: string;
  tagIds?: number[];
};

const HT_ICON_COMPONENTS: Readonly<Record<string, ComponentType<{ className?: string }>>> =
  Object.freeze({
    calendar_month: CalendarDaysIcon,
    description: DocumentTextIcon,
    groups: UserGroupIcon,
    map: MapIcon,
    point_of_sale: CreditCardIcon,
    search: MagnifyingGlassIcon,
    shopping_bag: ShoppingBagIcon,
  });

const ORGANIZATION_TITLE_TO_PAGE_ID: Readonly<Record<string, PageId>> = Object.freeze({
  communities: "communities",
  community: "communities",
  contests: "contests",
  contest: "contests",
  departments: "departments",
  department: "departments",
  exhibitors: "exhibitors",
  exhibitor: "exhibitors",
  vendors: "vendors",
  vendor: "vendors",
  villages: "villages",
  village: "villages",
});

function warnUnsupportedDerivedMenuItem(item: DerivedSiteMenuItem, reason: string) {
  if (!import.meta.env.DEV) return;
  console.warn(
    `[siteMenu] Omitting unsupported derived menu item "${item.title}": ${reason}`,
    item,
  );
}

function normalizeTitleKey(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getHtMenuIcon(iconName: string | undefined) {
  if (!iconName) return InformationCircleIcon;
  return HT_ICON_COMPONENTS[iconName] ?? InformationCircleIcon;
}

function toDerivedSiteMenuItem(
  conference: ConferenceManifest,
  item: DerivedSiteMenuItem,
): SiteMenuItem | null {
  const title = item.title?.trim();
  if (!title) {
    warnUnsupportedDerivedMenuItem(item, "missing title");
    return null;
  }

  const baseItem = {
    sort_order: item.sort,
    title,
    icon: getHtMenuIcon(item.icon),
    sourceId: item.id,
    fn: item.fn,
    tagIds: item.tagIds,
  } satisfies Omit<SiteMenuItem, "href">;

  switch (item.fn) {
    case "content":
      return { ...baseItem, href: `/${conference.slug}/content` };
    case "schedule":
      return { ...baseItem, href: `/${conference.slug}/schedule` };
    case "people":
      return { ...baseItem, href: `/${conference.slug}/people` };
    case "maps":
      return { ...baseItem, href: `/${conference.slug}/maps` };
    case "products":
      return { ...baseItem, href: `/${conference.slug}/merch` };
    case "document":
      if (!item.documentId) {
        warnUnsupportedDerivedMenuItem(item, "document item is missing documentId");
        return null;
      }
      return { ...baseItem, href: `/${conference.slug}/document/?id=${item.documentId}` };
    case "organizations": {
      const pageId = ORGANIZATION_TITLE_TO_PAGE_ID[normalizeTitleKey(title)];
      const directory = pageId ? getOrganizationDirectoryConfig(pageId) : null;
      if (!directory) {
        warnUnsupportedDerivedMenuItem(item, "organization title does not map to a known route");
        return null;
      }
      return {
        ...baseItem,
        href: `/${conference.slug}/${directory.slug}`,
        description: directory.description,
      };
    }
    default:
      warnUnsupportedDerivedMenuItem(item, `unsupported fn "${item.fn}"`);
      return null;
  }
}

function normalizeDerivedSiteMenu(
  conference: ConferenceManifest,
  derivedMenu: DerivedSiteMenu | null | undefined,
) {
  if (!derivedMenu || derivedMenu.version !== 1 || !Array.isArray(derivedMenu.primary)) return null;

  const items = derivedMenu.primary
    .map((item, index) => ({ item: toDerivedSiteMenuItem(conference, item), index }))
    .filter((entry): entry is { item: SiteMenuItem; index: number } => entry.item !== null)
    .toSorted((a, b) => a.item.sort_order - b.item.sort_order || a.index - b.index)
    .map(({ item }) => item);

  return items.length > 0 ? items : null;
}

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

function getFallbackSiteMenu(conference: ConferenceManifest): SiteMenuItem[] {
  const items = conference.siteMenu.map((key) => MENU[key](conference));

  return items.toSorted((a, b) => a.sort_order - b.sort_order);
}

export function getSiteMenu(
  conference: ConferenceManifest,
  derivedMenu?: DerivedSiteMenu | null,
): SiteMenuItem[] {
  return normalizeDerivedSiteMenu(conference, derivedMenu) ?? getFallbackSiteMenu(conference);
}
