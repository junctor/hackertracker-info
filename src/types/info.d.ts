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
