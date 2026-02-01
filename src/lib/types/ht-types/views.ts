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
