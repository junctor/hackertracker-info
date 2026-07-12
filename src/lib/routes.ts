import type { PageId } from "@/lib/types/page-meta";

import type { ConferenceManifest, ConferenceSlug } from "./conferences";

export type ConferenceRouteKey =
  | "announcements"
  | "bookmarks"
  | "communities"
  | "contests"
  | "content"
  | "departments"
  | "document"
  | "exhibitors"
  | "locations"
  | "maps"
  | "menu"
  | "merch"
  | "organization"
  | "people"
  | "readme"
  | "schedule"
  | "search"
  | "speakers"
  | "tag"
  | "tags"
  | "vendors"
  | "villages";

export type ConferenceRouteDefinition = {
  key: ConferenceRouteKey;
  path: string;
  activePageId: PageId;
  staticSegment: string;
};

type ConferencePathInput = ConferenceManifest | ConferenceSlug | string;

function conferenceSlug(input: ConferencePathInput) {
  return typeof input === "string" ? input : input.slug;
}

export function conferenceMenuPath(conference: ConferencePathInput) {
  return `/${conferenceSlug(conference)}/menu/`;
}

export const CONFERENCE_ROUTE_DEFINITIONS = [
  { key: "menu", path: "menu", activePageId: "menu", staticSegment: "menu" },
  {
    key: "announcements",
    path: "announcements",
    activePageId: "announcements",
    staticSegment: "announcements",
  },
  { key: "bookmarks", path: "bookmarks", activePageId: "bookmarks", staticSegment: "bookmarks" },
  {
    key: "communities",
    path: "communities",
    activePageId: "communities",
    staticSegment: "communities",
  },
  { key: "contests", path: "contests", activePageId: "contests", staticSegment: "contests" },
  { key: "content", path: "content", activePageId: "content", staticSegment: "content" },
  {
    key: "departments",
    path: "departments",
    activePageId: "departments",
    staticSegment: "departments",
  },
  { key: "document", path: "document", activePageId: "document", staticSegment: "document" },
  {
    key: "exhibitors",
    path: "exhibitors",
    activePageId: "exhibitors",
    staticSegment: "exhibitors",
  },
  { key: "locations", path: "locations", activePageId: "locations", staticSegment: "locations" },
  { key: "maps", path: "maps", activePageId: "maps", staticSegment: "maps" },
  { key: "merch", path: "merch", activePageId: "merch", staticSegment: "merch" },
  {
    key: "organization",
    path: "organization",
    activePageId: "organization",
    staticSegment: "organization",
  },
  { key: "people", path: "people", activePageId: "people", staticSegment: "people" },
  { key: "readme", path: "readme.nfo", activePageId: "readme", staticSegment: "readme.nfo" },
  { key: "schedule", path: "schedule", activePageId: "schedule", staticSegment: "schedule" },
  { key: "search", path: "search", activePageId: "search", staticSegment: "search" },
  { key: "speakers", path: "speakers", activePageId: "people", staticSegment: "speakers" },
  { key: "tag", path: "tag", activePageId: "tag", staticSegment: "tag" },
  { key: "tags", path: "tags", activePageId: "tags", staticSegment: "tags" },
  { key: "vendors", path: "vendors", activePageId: "vendors", staticSegment: "vendors" },
  { key: "villages", path: "villages", activePageId: "villages", staticSegment: "villages" },
] as const satisfies ReadonlyArray<ConferenceRouteDefinition>;
