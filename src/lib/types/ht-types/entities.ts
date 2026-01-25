export type ArticleEntity = {
  id: number;
  name: string;
  text: string;
  updated_at: number; // epoch ms
};
export type ArticlesStore = {
  allIds: Array<number>;
  byId: Record<string, ArticleEntity>;
};

export type ContentEntity = {
  id: number;
  people?: Array<{
    person_id: number;
    sort_order: number;
  }>;
  tag_ids: Array<number>;
  title: string;
};
export type ContentStore = {
  allIds: Array<number>;
  byId: Record<string, ContentEntity>;
};

export type DocumentEntity = {
  body_text: string;
  id: number;
  title_text: string;
  updatedAtMs: number;
};
export type DocumentsStore = {
  allIds: Array<number>;
  byId: Record<string, DocumentEntity>;
};

export type EventEntity = {
  begin: string;
  beginTimestampSeconds: number;
  color: string;
  content_id: number;
  end: string;
  endTimestampSeconds: number;
  id: number;
  location_id: number;
  personIds?: Array<number>;
  speakerIds?: Array<number>;
  tag_ids: Array<number>;
  title: string;
};
export type EventsStore = {
  allIds: Array<number>;
  byId: Record<string, EventEntity>;
};

export type LocationEntity = {
  id: number;
  name: string;
  parent_id: number;
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
    applied_tag_ids: Array<number>;
    document_id: null | number;
    function: string;
    google_materialsymbol: string;
    id: number;
    menu_id: null | number;
    prohibit_tag_filter: string;
    sort_order: number;
    title_text: string;
  }>;
  title_text: string;
};
export type MenusStore = {
  allIds: Array<number>;
  byId: Record<string, MenuEntity>;
};

export type OrganizationEntity = {
  id: number;
  logo_url?: string;
  name: string;
};
export type OrganizationsStore = {
  allIds: Array<number>;
  byId: Record<string, OrganizationEntity>;
};

export type PersonEntity = {
  affiliations?: Array<string>;
  id: number;
  name: string;
};
export type PeopleStore = {
  allIds: Array<number>;
  byId: Record<string, PersonEntity>;
};

export type TagTypeEntity = {
  category: string;
  id: number;
  is_browsable: boolean;
  label: string;
  sort_order: number;
};
export type TagTypesStore = {
  allIds: Array<number>;
  byId: Record<string, TagTypeEntity>;
};

export type TagEntity = {
  color_background: string;
  color_foreground: string;
  id: number;
  label: string;
  sort_order: number;
  tagtype_id: number;
};
export type TagsStore = {
  allIds: Array<number>;
  byId: Record<string, TagEntity>;
};
