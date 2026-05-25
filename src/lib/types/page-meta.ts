export type PageId =
  | "announcements"
  | "apps"
  | "bookmarks"
  | "communities"
  | "content"
  | "contests"
  | "departments"
  | "document"
  | "exhibitors"
  | "locations"
  | "maps"
  | "merch"
  | "organization"
  | "people"
  | "readme"
  | "schedule"
  | "search"
  | "tag"
  | "tags"
  | "vendors"
  | "villages"
  | "home";

export const PAGE_META: Record<PageId, { title: string }> = {
  announcements: { title: "Announcements" },
  apps: { title: "Apps" },
  bookmarks: { title: "Bookmarks" },
  communities: { title: "Communities" },
  content: { title: "Content" },
  contests: { title: "Contests" },
  departments: { title: "Departments" },
  document: { title: "Document" },
  exhibitors: { title: "Exhibitors" },
  locations: { title: "Locations" },
  maps: { title: "Map" },
  merch: { title: "Merch" },
  organization: { title: "Organizations" },
  people: { title: "People" },
  readme: { title: "readme.nfo" },
  schedule: { title: "Schedule" },
  search: { title: "Search" },
  tag: { title: "Tag" },
  tags: { title: "Tags" },
  vendors: { title: "Vendors" },
  villages: { title: "Villages" },
  home: { title: "Home" },
};

export function getPageTitle(id: PageId): string {
  return PAGE_META[id].title;
}
