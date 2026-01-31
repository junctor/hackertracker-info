export type PageId =
  | "announcements"
  | "apps"
  | "bookmarks"
  | "communities"
  | "content"
  | "contents"
  | "contests"
  | "departments"
  | "document"
  | "organization"
  | "people"
  | "person"
  | "readme"
  | "schedule"
  | "tag"
  | "tags"
  | "villages"
  | "home";

export const PAGE_META: Record<PageId, { title: string }> = {
  announcements: { title: "Announcements" },
  apps: { title: "Apps" },
  bookmarks: { title: "Bookmarks" },
  communities: { title: "Communities" },
  content: { title: "Content" },
  contents: { title: "Contents" },
  contests: { title: "Contests" },
  departments: { title: "Departments" },
  document: { title: "Document" },
  organization: { title: "Organizations" },
  people: { title: "Speakers" },
  person: { title: "Speaker" },
  readme: { title: "readme.nfo" },
  schedule: { title: "Schedule" },
  tag: { title: "Tag" },
  tags: { title: "Tags" },
  villages: { title: "Villages" },
  home: { title: "Home" },
};

export function getPageTitle(id: PageId): string {
  return PAGE_META[id].title;
}
