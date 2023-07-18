interface ConfInfo {
  villages: Village[];
}

interface Village {
  name: string;
  home: string;
  forum: string;
  twitter: string;
  discord: string;
  youtube: string;
}

interface Timer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

interface HTMaps {
  description: string;
  file: string;
  filename: string;
  id: number;
  name_text: string;
  name: string;
  sort_order: number;
  url: string;
}

interface HTLinks {
  label: string;
  type: string;
  url: string;
}

interface HTLocation {
  conference_id: number;
  conference: string;
  hotel: string;
  id: number;
  name: string;
  parent_id: number;
  short_name: string;
  updated_at: string;
}

interface HTEventType {
  color: string;
  conference_id: number;
  conference: string;
  id: number;
  name: string;
  updated_at: string;
}

interface HTConference {
  code: string;
  codeofconduct?: string;
  conference_id: number;
  description: string;
  enable_merch: boolean;
  end_date: string;
  end_timestamp_str: string;
  end_timestamp: Timestamp;
  hidden: boolean;
  hidden: false;
  id: number;
  kickoff_timestamp_str: string;
  kickoff_timestamp: Timestamp;
  link: string;
  maps: HTMaps[];
  name: string;
  start_date: string;
  start_timestamp_str: string;
  start_timestamp: Timestamp;
  supportdoc: string | null;
  tagline_text: string;
  timezone: string;
  updated_at: Timestamp;
  enable_merch_cart: boolean;
  kickoff_timestamp_str: string;
  updated_at: Timestamp;
}

interface HTTag {
  tags: Tag[];
}

interface Tag {
  id: number;
  description: string;
  color_foreground: string;
  color_background: string;
  label: string;
  sort_order: number;
}

interface HTEvent {
  android_description: string;
  begin_timestamp: Timestamp;
  begin: string;
  conference_id: number;
  conference: string;
  description: string;
  end_timestamp: Timestamp;
  end: string;
  id: number;
  includes: string;
  link: string;
  links?: HTLinks[];
  location: HTLocation;
  people: HTPeople[];
  spans_timebands: string;
  speakers: HTSpeaker[];
  tag_ids: number[];
  tags: string;
  title: string;
  type: HTEventType;
  updated_timestamp: Timestamp;
  village_id: number | null;
}

interface HTPeople {
  tag_id: number;
  sort_order: number;
  person_id: number;
}

interface HTSpeaker {
  conference_id: number;
  event_ids: [number];
  description: string;
  events: [HTEvent];
  id: number;
  link: string;
  name: string;
  title?: string;
  twitter: string;
  affiliations: [HTSpeakerAffiliations];
  pronouns: string | null;
}

interface HTSpeakerLinks {
  description: string;
  title: string;
  sort_order: number;
  url: string;
}

interface HTSpeakerAffiliations {
  organization: string;
  title: string;
}

interface HTFAQ {
  id: number;
  question: string;
  answer: string;
  updated_at: string;
}

interface HTLocationSchedule {
  end: string;
  begin: string;
  notes: string | null;
  status: string;
}

interface HTLocations {
  hier_extent_left: number;
  schedule: HTLocationSchedule[];
  parent_id: number;
  updated_at: string;
  id: number;
  conference_id: number;
  conference: string;
  peer_sort_order: number;
  default_status: string;
  name: string;
  hier_depth: number;
  conference_id: number;
  hotel: string;
  hier_extent_right: number;
  short_name: string;
}
