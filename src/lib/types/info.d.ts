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
  related_content_ids: number[] | null;
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

export interface ConferenceMap {
  name: string;
  name_text: string;
  filename: string;
  url: string;
  id: number;
  sort_order: number;
  file: string;
  description: string;
  svg_url: string;
}

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
