export type ScheduleTag = {
  id: number;
  label: string;
  color_background: string;
  color_foreground: string;
};

export type ScheduleEvent = {
  id: number;
  title: string;
  begin: string;
  end: string;
  color?: string;
  content_id: number;
  location?: string | null;
  tags: Array<ScheduleTag>;
  speakers?: string | null;
  beginDisplay: string;
  beginIso: string;
  endDisplay: string;
  endIso: string;
};

export type GroupedSchedule = Record<string, Array<ScheduleEvent>>;

export type GroupedTag = {
  id: number;
  label: string;
  schedule: GroupedSchedule;
};

export type GroupedTags = Record<string, GroupedTag>;

export type SearchType = "person" | "content" | "organization";

export type SearchItem = {
  id: number;
  type: SearchType;
  text: string;
};

export type SearchIndex = Array<SearchItem>;
