export type GroupedSchedule = Record<string, ScheduleEvent[]>;

export interface ScheduleTag {
  id: number;
  label: string;
  color_background: string;
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
  begin: string | number | Date;
  end: string | number | Date;
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
