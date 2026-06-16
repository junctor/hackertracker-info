import type {
  ArticleEntity,
  ContentEntity,
  DocumentEntity,
  EventEntity,
  LocationEntity,
  OrganizationEntity,
  PersonEntity,
  TagEntity,
} from "./entities";

export type ContentCard = {
  id: number;
  tags: Array<{
    colorBackground: string;
    colorForeground: string;
    id: number;
    label: string;
  }>;
  title: string;
};
export type ContentCardsView = Array<ContentCard>;

export type DocumentList = {
  id: number;
  titleText: string;
  updatedAtMs: number;
};
export type DocumentsListView = Array<DocumentList>;

export type EventCard = {
  begin: string;
  color: string;
  contentId: number;
  end: string;
  id: number;
  location: string;
  speakers: null | string;
  tags: Array<{
    colorBackground: string;
    colorForeground: string;
    id: number;
    label: string;
  }>;
  title: string;
};
export type EventCardsByIdStore = Record<string, EventCard>;

export type OrganizationCard = {
  id: number;
  logoUrl?: string;
  name: string;
};

export type OrganizationsCardsView = Record<string, Array<OrganizationCard>>;

export type PersonCard = {
  id: number;
  name: string;
  title?: string;
  avatarUrl?: string;
};
export type PeopleCardsView = Array<PersonCard>;

export type TagTypeBrowse = {
  category: string;
  id: number;
  label: string;
  sortOrder: number;
  tags: Array<{
    colorBackground: string;
    colorForeground: string;
    id: number;
    label: string;
    sortOrder: number;
  }>;
};
export type TagTypesBrowseView = Array<TagTypeBrowse>;

export type SearchDataType = "content" | "organization" | "person";
export type SearchDataItem = {
  id: number;
  norm: string;
  text: string;
  type: SearchDataType;
};
export type SearchDataView = Array<SearchDataItem>;

export type ScheduleEventViewModel = {
  id: number;
  title: string;
  begin: string;
  end: string;
  beginTimestampSeconds: number;
  endTimestampSeconds: number;
  color: string;
  contentId: number;
  contentEntity: ContentEntity | null;
  session: EventEntity;
  locationName: string;
  tags: Array<{
    id: number;
    label: string;
    colorBackground: string;
    colorForeground?: string;
  }>;
  speakers: string | null;
  beginDisplay: string;
  beginIso: string;
  endDisplay: string;
  endIso: string;
};

export type ScheduleDayView = {
  day: string;
  events: ScheduleEventViewModel[];
};
export type ScheduleDaysView = ScheduleDayView[];
export type BookmarkEventsByIdView = Record<string, ScheduleEventViewModel>;

export type LocationCard = {
  id: number;
  name: string;
  parentId: number | null;
  shortName: string | null;
};
export type LocationCardsView = LocationCard[];

export type AnnouncementsListView = ArticleEntity[];

export type ContentDetailView = {
  content: ContentEntity;
  sessions: EventEntity[];
  locations: LocationEntity[];
  people: PersonEntity[];
  tags: TagEntity[];
};

export type PersonDetailView = {
  person: PersonEntity;
  events: EventEntity[];
  locations: LocationEntity[];
};

export type TagDetailView = {
  tag: TagEntity;
  days: ScheduleDaysView;
};

export type LocationDetailView = {
  location: LocationEntity;
  days: ScheduleDaysView;
};

export type DocumentDetailView = DocumentEntity;
export type OrganizationDetailView = OrganizationEntity;
