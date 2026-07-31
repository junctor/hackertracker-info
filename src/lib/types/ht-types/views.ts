import type {
  ArticleEntity,
  ContentEntity,
  DocumentEntity,
  SessionEntity,
  LocationEntity,
  OrganizationEntity,
  PersonEntity,
  TagEntity,
} from "./entities";

export type ContentCard = {
  id: number;
  logoUrl?: string;
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

export type SessionCard = {
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
export type SessionCardsByIdStore = Record<string, SessionCard>;

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

export type SearchDataType = "content" | "organization" | "person" | "tag";
export type SearchDataItem = {
  contentCount?: number;
  contentIds?: number[];
  id: number;
  norm: string;
  text: string;
  type: SearchDataType;
};
export type SearchDataView = Array<SearchDataItem>;

export type ScheduleSessionViewModel = {
  id: number;
  title: string;
  begin: string;
  end: string;
  beginTimestampSeconds: number;
  endTimestampSeconds: number;
  color: string;
  contentId: number;
  contentEntity: ContentEntity | null;
  session: SessionEntity;
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
  sessions: ScheduleSessionViewModel[];
};
export type ScheduleDaysView = ScheduleDayView[];
export type BookmarkSessionsByIdView = Record<string, ScheduleSessionViewModel>;

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
  sessions: SessionEntity[];
  locations: LocationEntity[];
  people: PersonEntity[];
  tags: TagEntity[];
};
export type ContentDetailsById = Record<string, ContentDetailView>;

export type SessionDetailView = {
  content: ContentEntity;
  session: SessionEntity;
  location: LocationEntity;
  people: PersonEntity[];
  tags: TagEntity[];
};

export type PersonDetailView = {
  person: PersonEntity;
  sessions: SessionEntity[];
  locations: LocationEntity[];
};
export type PeopleDetailsById = Record<string, PersonDetailView>;

export type TagDetailView = {
  tag: TagEntity;
  days: ScheduleDaysView;
};
export type TagDetailsById = Record<string, TagDetailView>;

export type LocationDetailView = {
  location: LocationEntity;
  days: ScheduleDaysView;
};

export type DocumentDetailView = DocumentEntity;
export type DocumentDetailsById = Record<string, DocumentDetailView>;
export type OrganizationDetailView = OrganizationEntity;
export type OrganizationDetailsById = Record<string, OrganizationDetailView>;
