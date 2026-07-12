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
  color?: string;
  description?: string;
  id: number;
  links?: Array<{
    label: string;
    type: string;
    url: string;
  }>;
  logoUrl?: string;
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

export type SessionEntity = {
  begin: string;
  beginDisplay: string;
  beginIso: string;
  beginTimestampSeconds: number;
  color?: string;
  contentId: number;
  end: string;
  endDisplay: string;
  endIso: string;
  endTimestampSeconds: number;
  id: number;
  locationId: number;
  personIds?: Array<number>;
  recordingPolicyId?: number;
  tagIds: Array<number>;
  timezoneName?: string;
  title: string;
};
export type SessionsStore = {
  allIds: Array<number>;
  byId: Record<string, SessionEntity>;
};

export type LocationEntity = {
  id: number;
  name: string;
  parentId: number;
  shortName: string;
};
export type LocationsStore = {
  allIds: Array<number>;
  byId: Record<string, LocationEntity>;
};

export type MenuEntity = {
  id: number;
  items: Array<{
    appleSfSymbol: string;
    appliedTagIds: Array<number>;
    documentId: null | number;
    function: string;
    googleMaterialSymbol: string;
    id: number;
    menuId: null | number;
    prohibitTagFilter: boolean;
    sortOrder: number;
    titleText: string;
  }>;
  titleText: string;
};
export type MenusStore = {
  allIds: Array<number>;
  byId: Record<string, MenuEntity>;
};

export type ConferenceMapEntity = {
  description?: string;
  file?: string;
  filename?: string;
  id: number;
  name: string;
  name_text?: string;
  sort_order?: number;
  svg_filename?: string;
  svg_url?: string;
  url?: string;
};

export type ConferenceEntity = {
  code: string;
  end_date?: string;
  id: number;
  maps?: ConferenceMapEntity[];
  name: string;
  start_date?: string;
  timezone?: string;
  updated_at?: string;
};

export type OrganizationEntity = {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
  tagIdAsOrganizer: null | number;
  tagIds: Array<number>;
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
  links?: {
    sort_order: number;
    title: string;
    description: string;
    url: string;
  }[];
  description?: string;
  id: number;
  name: string;
  pronouns?: string;
  title?: string;
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
