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
  event_ids: number[];
  media: PersonMedia[];
  events: PersonEvent[];
}

interface PersonEvent {
  id: number;
  title: string;
  begin: string;
  end: string;
  location: { name: string };
  type: { color: string };
}

export type People = Person[];

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
  title: string;
  description: string;
  begin: string;
  end: string;
  beginTimestampSeconds: number | null;
  endTimestampSeconds: number | null;
  location: string | null;
  color: string | null;
  category: string | null;
  tags: ScheduleTag[];
  speakers: string | null;
  speaker_details: ScheduleSpeaker[];
  links: ScheduleLink[];
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

export type SearchType = "person" | "event" | "content" | "organization";

export interface SearchItem {
  id: number;
  text: string;
  type: SearchType;
}

export type SearchIndex = SearchItem[];
