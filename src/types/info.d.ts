interface Timer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface PersonMedia {
  asset_id: number;
  sort_order: number;
  url: string;
}

interface Person {
  id: number;
  name: string;
  affiliations: { organization: string; title: string }[];
  description: string;
  links: { sort_order: number; title: string; url: string }[];
  media: PersonMedia[];
  events: PersonEvent[];
}

interface PersonEvent {
  id: number;
  content_id: number;
  title: string;
  begin: string;
  end: string;
  location: { name: string };
  type: { color: string };
}

export type People = Person[];

export type GroupedTags = Record<number, GroupedTag>;

export interface GroupedTag {
  id: number;
  label: string;
  color_background: string;
  color_foreground: string;
  sort_order: number;
  schedule: GroupedSchedule;
}

export type GroupedSchedule = Record<string, ScheduleEvent[]>;

export interface ScheduleTag {
  id: number;
  label: string;
  color_background: string;
  color_foreground: string;
  sort_order: number;
}

export interface ScheduleSpeaker {
  id: number;
  name: string;
  title: string | null;
  sort_order: number | null;
}

export interface ScheduleLink {
  label: string;
  url: string;
  type?: string;
}

export interface ScheduleEvent {
  id: number;
  content_id: number;
  title: string;
  begin: string;
  end: string;
  beginTimestampSeconds: number | null;
  endTimestampSeconds: number | null;
  location: string | null;
  color: string | null;
  tags: ScheduleTag[];
  speakers: string | null;
}

export type Articles = Article[];

export interface Article {
  id: string;
  name: string;
  text: string;
  updated_tsz: string;
  updated_at: { seconds: number; nanoseconds: number };
}

export type Documents = Document[];

interface Document {
  conference_id: number;
  conference: string;
  updated_at: { seconds: number; nanoseconds: number };
  body_text: string;
  title_text: string;
  id: number;
}

export type Organizations = Organization[];

export interface OrganizationLink {
  label: string;
  url: string;
  type: string;
}

export interface OrganizationMedia {
  name: string;
  hash_sha256: string;
  filesize: number;
  filetype: string;
  hash_md5: string;
  url: string;
  is_logo: string; // values like "Y"
  sort_order: number;
  orga_id: number;
  hash_crc32c: string;
  asset_id: number;
}

export interface OrganizationLocation {
  location_id: number;
}

export interface Organization {
  conference_id: number;
  tag_ids: number[];
  updated_tsz: string;
  documents: []; // currently always empty
  people: []; // currently always empty
  links: OrganizationLink[];
  conference: string;
  name: string;
  updated_at: string;
  logo: OrganizationMedia;
  tag_id_as_organizer: number;
  media: OrganizationMedia[];
  locations: OrganizationLocation[];
  id: number;
  description: string;
}

export type ProcessedContents = ProcessedContent[];

export interface ProcessedContent {
  id: number;
  title: string;
  tags: ScheduleTag[];
  people: string[];
}

export type ProcessedContentById = Record<number, ProcessedContentId>;

export interface ProcessedContentId {
  id: number;
  title: string;
  description: string;
  sessions: ContentSessionLite[];
  links: ContentLink[];
  tags: ScheduleTag[];
  people: ContentPersonWithName[];
}

export interface ContentSessionLite {
  session_id: number;
  begin_tsz: string;
  end_tsz: string;
  timezone_name: string;
  location_id: number | null;
  location_name: string | null;
}

export interface ContentLink {
  label: string;
  url: string;
  type: string;
}

export interface ContentPersonWithName {
  person_id: number;
  sort_order: number;
  name: string | null;
}

export type SearchType = "person" | "content" | "organization";

export interface SearchItem {
  id: number;
  text: string;
  type: SearchType;
}

export type SearchIndex = SearchItem[];

export type TagTypes = TagType[];

export interface Tag {
  label: string;
  color_background: string;
  id: number;
  sort_order: number;
  description: string;
  color_foreground: string;
}

export interface TagType {
  label: string;
  conference_id: number;
  is_browsable: boolean;
  category: string;
  sort_order: number;
  id: number;
  is_single_valued: boolean;
  tags: Tag[];
  conference: string;
}

export interface FirestoreTimestamp {
  type: "firestore/timestamp/1.0";
  seconds: number;
  nanoseconds: number;
}

// Map object interface
export interface ConferenceMap {
  name: string;
  name_text: string;
  filename: string;
  url: string;
  id: number;
  sort_order: number;
  file: string;
  description: string;
}

// Main Conference interface
export interface Conference {
  conference_id: number;
  id: number;
  name: string;
  code: string;
  tagline_text: string;
  description: string;
  timezone: string;

  start_date: string; // e.g., "2025-08-07"
  end_date: string; // e.g., "2025-08-10"

  start_timestamp_str: string;
  end_timestamp_str: string;
  kickoff_timestamp_str: string;

  begin_tsz: string;
  end_tsz: string;
  kickoff_tsz: string;

  start_timestamp: FirestoreTimestamp;
  end_timestamp: FirestoreTimestamp;
  kickoff_timestamp: FirestoreTimestamp;
  updated_at: FirestoreTimestamp;

  feedbackform_ratelimit_seconds: number;

  home_menu_id: number;
  enable_merch: boolean;
  enable_merch_cart: boolean;
  merch_mandatory_acknowledgement: string;
  merch_tax_statement: string;
  supportdoc: string;
  codeofconduct: string;
  link: string;
  hidden: boolean;

  emergency_document_id: number | null;

  maps?: ConferenceMap[];
}
