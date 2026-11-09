import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vite-plus/test";

import { CONFERENCES, type ConferenceSlug, type SiteMenuKey } from "./conferences";
import { getConferenceMenuDescription } from "./menu";

function readConferenceJson<T>(slug: ConferenceSlug, path: string): T {
  const jsonPath = fileURLToPath(new URL(`../../public/ht/${slug}/${path}.json`, import.meta.url));
  return JSON.parse(readFileSync(jsonPath, "utf8")) as T;
}

const ARRAY_VIEW_BY_MENU_KEY: Partial<Record<SiteMenuKey, string>> = {
  announcements: "views/announcementsList",
  content: "views/contentCards",
  locations: "views/locationCards",
  people: "views/peopleCards",
  readme: "views/documentsList",
  search: "views/searchData",
};

const ORGANIZATION_LABELS_BY_MENU_KEY: Partial<Record<SiteMenuKey, string[]>> = {
  communities: ["community"],
  contests: ["contest"],
  departments: ["def_con_department", "department"],
  exhibitors: ["exhibitor"],
  vendors: ["vendor"],
  villages: ["village"],
};

function conferenceMenuItemHasData(slug: ConferenceSlug, key: SiteMenuKey) {
  const arrayView = ARRAY_VIEW_BY_MENU_KEY[key];
  if (arrayView) return readConferenceJson<unknown[]>(slug, arrayView).length > 0;

  const organizationLabels = ORGANIZATION_LABELS_BY_MENU_KEY[key];
  if (organizationLabels) {
    const organizations = readConferenceJson<{
      byTag: Record<string, unknown[]>;
      tagIdsByLabel: { byLabel: Record<string, number> };
    }>(slug, "views/organizationsBrowse");

    return organizationLabels.some((label) => {
      const tagId = organizations.tagIdsByLabel.byLabel[label];
      return tagId !== undefined && (organizations.byTag[String(tagId)]?.length ?? 0) > 0;
    });
  }

  if (key === "bookmarks" || key === "schedule") {
    return readConferenceJson<{ days: unknown[] }>(slug, "views/scheduleBrowse").days.length > 0;
  }

  const conference = readConferenceJson<{ enable_merch: boolean; maps: unknown[] | null }>(
    slug,
    "conference",
  );
  if (key === "maps") return (conference.maps?.length ?? 0) > 0;
  if (key === "merch") return conference.enable_merch;

  return false;
}

describe("conference registry", () => {
  it("keeps identity, data paths, dates, and logos internally consistent", () => {
    const codes = new Set<string>();

    for (const [slug, conference] of Object.entries(CONFERENCES)) {
      expect(conference.slug).toBe(slug);
      expect(conference.dataRoot).toBe(`/ht/${slug}`);
      expect(conference.externalTrackerUrl).toBe("/apps/");
      expect(codes.has(conference.code)).toBe(false);
      codes.add(conference.code);

      const begin = Date.parse(conference.begin);
      const kickoff = Date.parse(conference.kickoff);
      const end = Date.parse(conference.end);
      expect(Number.isFinite(begin)).toBe(true);
      expect(begin).toBeLessThanOrEqual(kickoff);
      expect(kickoff).toBeLessThanOrEqual(end);

      const logoPath = fileURLToPath(
        new URL(`../../public/images/${conference.logoFile}`, import.meta.url),
      );
      expect(existsSync(logoPath), `Missing logo for ${slug}: ${conference.logoFile}`).toBe(true);
    }
  });

  it("shows only the current and upcoming conferences on the home page", () => {
    const visibleSlugs = Object.values(CONFERENCES)
      .filter((conference) => conference.showOnHome)
      .map((conference) => conference.slug)
      .toSorted();

    expect(visibleSlugs).toEqual(["dcsg2", "dctme2026", "defcon35"]);
    expect(CONFERENCES.defcon34.showOnHome).toBe(false);
    expect(CONFERENCES.dctsg202610.showOnHome).toBe(false);
  });

  it("contains the replacement conference and no obsolete DCME2026 entry", () => {
    expect(CONFERENCES.dctme2026.code).toBe("DCTME2026");
    expect(Object.values(CONFERENCES).some((conference) => conference.code === "DCME2026")).toBe(
      false,
    );
  });

  it("only includes menu items backed by non-empty conference data", () => {
    for (const conference of Object.values(CONFERENCES)) {
      for (const key of conference.siteMenu) {
        expect(
          conferenceMenuItemHasData(conference.slug, key),
          `${conference.slug}: ${key} has no backing data`,
        ).toBe(true);
      }
    }
  });

  it("keeps upcoming conference menus limited to their populated sections", () => {
    const previewMenu = ["announcements", "readme"];

    expect(CONFERENCES.dcsg2.siteMenu).toEqual(previewMenu);
    expect(CONFERENCES.dcsg2.schedulePath).toBeUndefined();
    expect(CONFERENCES.defcon35.siteMenu).toEqual(previewMenu);
    expect(CONFERENCES.defcon35.schedulePath).toBeUndefined();
  });

  it("describes only menu sections that a conference provides", () => {
    const trainingDescription = getConferenceMenuDescription(CONFERENCES.dctme2026);
    expect(trainingDescription).toContain("announcements");
    expect(trainingDescription).not.toContain("the schedule");
    expect(trainingDescription).not.toContain("maps");

    const defcon35Description = getConferenceMenuDescription(CONFERENCES.defcon35);
    expect(defcon35Description).toContain("announcements");
    expect(defcon35Description).not.toContain("the schedule");
  });
});
