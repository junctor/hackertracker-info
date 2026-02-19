export type ArticleEntity = {
  id: number;
  name: string;
  text: string;
  updatedAtMs: number; // epoch ms
};
export type ArticlesStore = {
  allIds: Array<number>;
  byId: Record<string, ArticleEntity>;
};

export type ContentEntity = {
  description?: string;
  id: number;
  links?: Array<{
    label: string;
    type: string;
    url: string;
  }>;
  people?: Array<{
    personId: number;
    sortOrder: number;
  }>;
  relatedContentIds?: Array<number>;
  sessions?: Array<number>;
  tagIds: Array<number>;
  title: string;
};
export type ContentStore = {
  allIds: Array<number>;
  byId: Record<string, ContentEntity>;
};

export type DocumentEntity = {
  bodyText: string;
  id: number;
  titleText: string;
  updatedAtMs: number;
};
export type DocumentsStore = {
  allIds: Array<number>;
  byId: Record<string, DocumentEntity>;
};

export type EventEntity = {
  begin: string;
  beginDisplay: string;
  beginIso: string;
  color: string;
  contentId: number;
  end: string;
  endDisplay: string;
  endIso: string;
  id: number;
  locationId: number;
  personIds?: Array<number>;
  speakerIds?: Array<number>;
  tagIds: Array<number>;
  title: string;
};
export type EventsStore = {
  allIds: Array<number>;
  byId: Record<string, EventEntity>;
};

export type LocationEntity = {
  id: number;
  name: string;
  parentId: number;
  short_name: string;
};
export type LocationsStore = {
  allIds: Array<number>;
  byId: Record<string, LocationEntity>;
};

export type MenuEntity = {
  id: number;
  items: Array<{
    apple_sfsymbol: string;
    appliedTagIds: Array<number>;
    documentId: null | number;
    function: string;
    google_materialsymbol: string;
    id: number;
    menuId: null | number;
    prohibitTagFilter: string;
    sortOrder: number;
    titleText: string;
  }>;
  titleText: string;
};
export type MenusStore = {
  allIds: Array<number>;
  byId: Record<string, MenuEntity>;
};

export type OrganizationEntity = {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
  tagIdAsOrganizer?: number;
  links: Array<{
    label: string;
    type: string;
    url: string;
  }>;
};
export type OrganizationsStore = {
  allIds: Array<number>;
  byId: Record<string, OrganizationEntity>;
};

export type PersonEntity = {
  affiliations?: {
    organization: string;
    title: string;
  }[];
  links: {
    sortOrder: number;
    title: string;
    description: string | null;
    url: string;
  }[];
  description?: string;
  id: number;
  name: string;
  pronouns?: string;
  contentIds: number[];
  avatarUrl?: string;
};
export type PeopleStore = {
  allIds: Array<number>;
  byId: Record<string, PersonEntity>;
};

export type TagTypeEntity = {
  category: string;
  id: number;
  isBrowsable: boolean;
  label: string;
  sortOrder: number;
};
export type TagTypesStore = {
  allIds: Array<number>;
  byId: Record<string, TagTypeEntity>;
};

export type TagEntity = {
  colorBackground: string;
  colorForeground: string;
  id: number;
  label: string;
  sortOrder: number;
  tagTypeId: number;
};
export type TagsStore = {
  allIds: Array<number>;
  byId: Record<string, TagEntity>;
};
