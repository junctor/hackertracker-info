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
  | "organizations"
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
  detailPaths?: readonly string[];
  legacyPaths?: readonly string[];
  activePageId: PageId;
  staticSegment: string;
};

type ConferencePathInput = ConferenceManifest | ConferenceSlug | string;

function conferenceSlug(input: ConferencePathInput) {
  return typeof input === "string" ? input : input.slug;
}

function encodePathSegment(value: string | number) {
  return encodeURIComponent(
    String(value)
      .trim()
      .replace(/^\/+|\/+$/g, ""),
  );
}

function conferenceBasePath(conference: ConferencePathInput) {
  return `/${encodePathSegment(conferenceSlug(conference))}`;
}

export function conferenceMenuPath(conference: ConferencePathInput) {
  return `${conferenceBasePath(conference)}/menu/`;
}

export function conferenceCollectionPath(conference: ConferencePathInput, routeSlug: string) {
  return `${conferenceBasePath(conference)}/${encodePathSegment(routeSlug)}/`;
}

export function conferenceEntityPath(
  conference: ConferencePathInput,
  routeSlug: string,
  id: string | number,
) {
  return `${conferenceBasePath(conference)}/${encodePathSegment(routeSlug)}/${encodePathSegment(id)}`;
}

export function contentPath(conference: ConferencePathInput, id: string | number) {
  return conferenceEntityPath(conference, "content", id);
}

export function personPath(conference: ConferencePathInput, id: string | number) {
  return conferenceEntityPath(conference, "people", id);
}

export function organizationPath(conference: ConferencePathInput, id: string | number) {
  return conferenceEntityPath(conference, "organizations", id);
}

export function documentPath(conference: ConferencePathInput, id: string | number) {
  return conferenceEntityPath(conference, "documents", id);
}

export function tagPath(conference: ConferencePathInput, id: string | number) {
  return conferenceEntityPath(conference, "tags", id);
}

export function conferenceRoutePaths(route: ConferenceRouteDefinition): string[] {
  return [route.path, ...(route.detailPaths ?? []), ...(route.legacyPaths ?? [])];
}

export function conferenceRouteMatchesSegment(route: ConferenceRouteDefinition, segment: string) {
  return conferenceRoutePaths(route).some((path) => path.split("/", 1)[0] === segment);
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
    detailPaths: ["communities/:id"],
    activePageId: "communities",
    staticSegment: "communities",
  },
  {
    key: "contests",
    path: "contests",
    detailPaths: ["contests/:id"],
    activePageId: "contests",
    staticSegment: "contests",
  },
  {
    key: "content",
    path: "content",
    detailPaths: ["content/:id"],
    activePageId: "content",
    staticSegment: "content",
  },
  {
    key: "departments",
    path: "departments",
    detailPaths: ["departments/:id"],
    activePageId: "departments",
    staticSegment: "departments",
  },
  {
    key: "document",
    path: "documents",
    detailPaths: ["documents/:id"],
    legacyPaths: ["document"],
    activePageId: "document",
    staticSegment: "documents",
  },
  {
    key: "exhibitors",
    path: "exhibitors",
    detailPaths: ["exhibitors/:id"],
    activePageId: "exhibitors",
    staticSegment: "exhibitors",
  },
  { key: "locations", path: "locations", activePageId: "locations", staticSegment: "locations" },
  { key: "maps", path: "maps", activePageId: "maps", staticSegment: "maps" },
  { key: "merch", path: "merch", activePageId: "merch", staticSegment: "merch" },
  {
    key: "organization",
    path: "organizations/:id",
    legacyPaths: ["organization"],
    activePageId: "organization",
    staticSegment: "organizations",
  },
  {
    key: "organizations",
    path: "organizations",
    activePageId: "organization",
    staticSegment: "organizations",
  },
  {
    key: "people",
    path: "people",
    detailPaths: ["people/:id"],
    activePageId: "people",
    staticSegment: "people",
  },
  { key: "readme", path: "readme.nfo", activePageId: "readme", staticSegment: "readme.nfo" },
  { key: "schedule", path: "schedule", activePageId: "schedule", staticSegment: "schedule" },
  { key: "search", path: "search", activePageId: "search", staticSegment: "search" },
  { key: "speakers", path: "speakers", activePageId: "people", staticSegment: "speakers" },
  {
    key: "tag",
    path: "tags/:id",
    legacyPaths: ["tag"],
    activePageId: "tag",
    staticSegment: "tags",
  },
  { key: "tags", path: "tags", activePageId: "tags", staticSegment: "tags" },
  {
    key: "vendors",
    path: "vendors",
    detailPaths: ["vendors/:id"],
    activePageId: "vendors",
    staticSegment: "vendors",
  },
  {
    key: "villages",
    path: "villages",
    detailPaths: ["villages/:id"],
    activePageId: "villages",
    staticSegment: "villages",
  },
] as const satisfies ReadonlyArray<ConferenceRouteDefinition>;
