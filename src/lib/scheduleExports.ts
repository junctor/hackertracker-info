import type { ConferenceManifest } from "@/lib/conferences";

export type ScheduleExportLinks = {
  csv: string;
  json: string;
};

function removeTrailingSlash(value: string) {
  return value.replace(/\/+$/u, "");
}

export function getScheduleExportBasePath(conf: Pick<ConferenceManifest, "dataRoot" | "slug">) {
  const dataRoot = removeTrailingSlash(conf.dataRoot.trim());

  return `${dataRoot || `/ht/${conf.slug}`}/exports`;
}

export function getScheduleExportLinks(
  conf: Pick<ConferenceManifest, "dataRoot" | "slug">,
): ScheduleExportLinks {
  const basePath = getScheduleExportBasePath(conf);

  return {
    csv: `${basePath}/schedule.csv`,
    json: `${basePath}/schedule.json`,
  };
}

export function getScheduleExportDownloadName(
  conf: Pick<ConferenceManifest, "slug">,
  format: keyof ScheduleExportLinks,
) {
  return `${conf.slug}-schedule.${format}`;
}
