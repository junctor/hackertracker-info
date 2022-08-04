/* eslint-disable no-use-before-define */
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
  file: string;
  name: string;
}

interface HTLinks {
  label: string;
  url: string;
}

interface HTLocationModel {
  id: number;
  conferenceName: string;
  name: string;
  hotel: string;
}

interface HTEventType {
  id: number;
  color: string;
  conferenceName: string;
  name: string;
  updated_at: string;
}

interface HTConference {
  start_timestamp: Timestamp;
  end_date: string;
  maps?: HTMaps[];
  name: string;
  code: string;
  start_date: string;
  link: string;
  hidden: false;
  codeofconduct?: string;
  updated_at: Timestamp;
  id: number;
  timezone: string;
  description: string;
  end_timestamp: Timestamp;
  supportdoc: string;
  kickoff_timestamp_str: string;
  kickoff_timestamp: Timestamp;
}

interface HTEvent {
  updated_timestamp: Timestamp;
  link: string;
  id: number;
  conferenceName: string;
  conference_id: number;
  description: string;
  android_description: string;
  begin: string;
  begin_timestamp: Timestamp;
  end: string;
  end_timestamp: Timestamp;
  includes: string;
  links?: HTLinks[];
  title: string;
  location: HTLocationModel;
  speakers: HTSpeaker[];
  type: HTEventType;
  tag_ids: string[];
  tags: string;
}

interface HTSpeaker {
  id: number;
  conferenceName: string;
  description: string;
  link: string;
  name: string;
  title: string;
  twitter: string;
  events: [HTEvent];
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
