export const tagsOrgs = new Map<number, string>([
  [46173, "Exhibitor"],
  [46171, "Vendor"],
  [46172, "Village"],
  [46358, "Community"],
  [46361, "Contest"],
]);

export function getOrg(tagId: string): { id: number; org: string } {
  const id = parseInt(tagId);
  if (isNaN(id)) {
    return { id: 0, org: "Unknown" };
  }

  const org = tagsOrgs.get(id);

  if (org === undefined) {
    return { id: 0, org: "Unknown" };
  }

  return {
    id,
    org,
  };
}
