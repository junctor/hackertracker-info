import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vite-plus/test";

import { CONFERENCES } from "./conferences";

describe("conference registry", () => {
  it("keeps identity, data paths, dates, and logos internally consistent", () => {
    const codes = new Set<string>();

    for (const [slug, conference] of Object.entries(CONFERENCES)) {
      expect(conference.slug).toBe(slug);
      expect(conference.dataRoot).toBe(`/ht/${slug}`);
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
});
