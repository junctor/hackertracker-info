export const HT_SCHEMA_VERSION = 4 as const;

export const SCHEDULE_BROWSE_PATH = "views/scheduleBrowse.json";
export const SCHEDULE_FILTER_INDEX_PATH = "views/scheduleFilterIndex.json";
export const CONTENT_FILTER_INDEX_PATH = "views/contentFilterIndex.json";
export const ORGANIZATIONS_BROWSE_PATH = "views/organizationsBrowse.json";

export const DETAIL_SHARD_SPECS = {
  content: { pathTemplate: "details/content/{shard}.json", shardCount: 8, shardDigits: 2 },
  documents: { pathTemplate: "details/documents/{shard}.json", shardCount: 1, shardDigits: 2 },
  organizations: {
    pathTemplate: "details/organizations/{shard}.json",
    shardCount: 4,
    shardDigits: 2,
  },
  people: { pathTemplate: "details/people/{shard}.json", shardCount: 8, shardDigits: 2 },
} as const;

export type ConferenceDetailGroup = keyof typeof DETAIL_SHARD_SPECS;
