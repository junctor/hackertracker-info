import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { getSearchResultHref } from "@/features/search/searchData";
import { conferencePath } from "@/lib/aiMetadata";
import { CONFERENCES, getConference } from "@/lib/conferences";
import { getSiteMenu } from "@/lib/menu";
import { CONFERENCE_ROUTE_DEFINITIONS, conferenceMenuPath } from "@/lib/routes";

const CONFERENCE_CHILD_PATHS = [
  "announcements",
  "bookmarks",
  "communities",
  "contests",
  "content",
  "departments",
  "document",
  "exhibitors",
  "locations",
  "maps",
  "merch",
  "organization",
  "people",
  "readme.nfo",
  "schedule",
  "search",
  "speakers",
  "tag",
  "tags",
  "vendors",
  "villages",
] as const;

describe("conference routes", () => {
  it("has an explicit menu route for every supported conference", () => {
    const menuRoutes = CONFERENCE_ROUTE_DEFINITIONS.filter(({ key }) => key === "menu");

    expect(menuRoutes).toHaveLength(1);
    expect(menuRoutes[0]).toMatchObject({
      path: "menu",
      activePageId: "menu",
      staticSegment: "menu",
    });

    for (const conference of Object.values(CONFERENCES)) {
      expect(conferenceMenuPath(conference)).toBe(`/${conference.slug}/menu/`);
      expect(conferencePath(conference)).toBe(`/${conference.slug}/menu/`);
    }
  });

  it("keeps existing conference child route segments", () => {
    const routePaths = new Set(CONFERENCE_ROUTE_DEFINITIONS.map(({ path }) => path));

    for (const path of CONFERENCE_CHILD_PATHS) {
      expect(routePaths.has(path)).toBe(true);
    }
  });

  it("does not treat non-conference application routes as conference slugs", () => {
    expect(getConference("apps")).toBeNull();
    expect(getConference("conferences")).toBeNull();
    expect(getConference("tv")).toBeNull();
  });

  it("keeps conference navigation away from broken conference roots", () => {
    for (const conference of Object.values(CONFERENCES)) {
      const rootPath = `/${conference.slug}/`;
      const menuPath = conferenceMenuPath(conference);

      expect(menuPath).not.toBe(rootPath);
      expect(getSiteMenu(conference).map(({ href }) => href)).not.toContain(rootPath);
      expect(
        getSearchResultHref(conference.slug, { id: 1, norm: "", text: "", type: "other" }),
      ).toBe(menuPath);
    }
  });

  it("uses menu URLs in generated public discovery metadata", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    const llms = readFileSync("public/llms.txt", "utf8");

    for (const conference of Object.values(CONFERENCES)) {
      expect(sitemap).toContain(`https://info.defcon.org/${conference.slug}/menu/`);
      expect(llms).toContain(`https://info.defcon.org/${conference.slug}/menu/`);
      expect(sitemap).not.toContain(`<loc>https://info.defcon.org/${conference.slug}/</loc>`);
      expect(llms).not.toContain(`](https://info.defcon.org/${conference.slug}/)`);
    }
  });
});
