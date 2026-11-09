import { describe, expect, it } from "vite-plus/test";

import type { OrganizationsBrowseView } from "@/lib/types/ht-types";

import { getOrganizationsByTag } from "./DirectoryPage";

const organization = { id: 42, name: "Example Village" };

function organizationsBrowse(
  byLabel: Record<string, number>,
  byTag: OrganizationsBrowseView["byTag"],
): OrganizationsBrowseView {
  return {
    all: Object.values(byTag).flat(),
    byTag,
    tagIdsByLabel: { version: 1, byLabel },
  };
}

describe("organization directory data", () => {
  it("returns an empty directory while a conference category is not populated", () => {
    const browse = organizationsBrowse({}, {});

    expect(getOrganizationsByTag(browse, "community")).toEqual([]);
  });

  it("returns organizations assigned to the requested category", () => {
    const browse = organizationsBrowse({ village: 7 }, { 7: [organization] });

    expect(getOrganizationsByTag(browse, "village")).toEqual([organization]);
  });
});
