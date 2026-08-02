import type { DerivedTagIdsByLabel } from "./derived";
import type { ArticleEntity, DocumentEntity, OrganizationEntity } from "./entities";

export type CompactTag = {
  colorBackground: string;
  colorForeground: string;
  id: number;
  label: string;
};

export type ContentCard = {
  id: number;
  logoUrl?: string;
  tagCount: number;
  tags: CompactTag[];
  title: string;
};
export type ContentCardsView = Array<ContentCard>;

export type DocumentList = {
  id: number;
  titleText: string;
  updatedAtMs: number;
};
export type DocumentsListView = Array<DocumentList>;

export type OrganizationCard = {
  id: number;
  logoUrl?: string;
  name: string;
};

export type OrganizationsBrowseView = {
  all: OrganizationCard[];
  byTag: Record<string, OrganizationCard[]>;
  tagIdsByLabel: DerivedTagIdsByLabel;
};

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
  beginTimestampSeconds: number;
  endTimestampSeconds: number;
  color: string;
  contentId: number;
  locationName: string;
  tagCount: number;
  tags: CompactTag[];
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
export type ScheduleSessionPosition = {
  dayIndex: number;
  sessionIndex: number;
};

export type ScheduleBrowseView = {
  days: ScheduleDaysView;
  sessionPositionsById: Record<string, ScheduleSessionPosition>;
};

export type FilterIndexView = {
  itemCount: number;
  itemIdsByTag: Record<string, number[]>;
};

export type LocationCard = {
  id: number;
  name: string;
  parentId: number | null;
  shortName: string | null;
};
export type LocationCardsView = LocationCard[];

export type AnnouncementsListView = ArticleEntity[];

export type DetailSessionView = {
  begin: string;
  color?: string;
  contentId: number;
  end: string;
  id: number;
  locationName?: string;
  title: string;
};

export type ContentDetailView = {
  accentColor?: string;
  content: {
    color?: string;
    description?: string;
    id: number;
    links?: Array<{ label?: string; type?: string; url?: string }>;
    logoUrl?: string;
    title: string;
  };
  sessions: DetailSessionView[];
  people: Array<{ id: number; name: string }>;
  tags: CompactTag[];
  relatedContent: ContentCardsView;
};

export type PersonDetailView = {
  person: {
    affiliations?: string[];
    avatarUrl?: string;
    description?: string;
    id: number;
    links?: Array<{ label?: string; type?: string; url?: string }>;
    name: string;
    pronouns?: string;
  };
  sessions: DetailSessionView[];
};

export type DocumentDetailView = DocumentEntity;
export type OrganizationDetailView = OrganizationEntity;
