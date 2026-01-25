export type ContentCard = {
  id: number;
  tags: Array<{
    color_background: string;
    color_foreground: string;
    id: number;
    label: string;
  }>;
  title: string;
};
export type ContentCardsView = Array<ContentCard>;

export type DocumentList = {
  id: number;
  title_text: string;
  updatedAtMs: number;
};
export type DocumentsListView = Array<DocumentList>;

export type EventCard = {
  begin: string;
  color: string;
  content_id: number;
  end: string;
  id: number;
  location: string;
  speakers: null | string;
  tags: Array<{
    color_background: string;
    color_foreground: string;
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
export type OrganizationsCardsView = Array<OrganizationCard>;

export type PersonCard = {
  affiliations: Array<string>;
  id: number;
  name: string;
};
export type PeopleCardsView = Array<PersonCard>;

export type TagTypeBrowse = {
  category: string;
  id: number;
  label: string;
  sort_order: number;
  tags: Array<{
    color_background: string;
    color_foreground: string;
    id: number;
    label: string;
    sort_order: number;
  }>;
};
export type TagTypesBrowseView = Array<TagTypeBrowse>;
