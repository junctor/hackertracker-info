export type DerivedSiteMenuItem = {
  id: number;
  title: string;
  sort: number;
  fn: string;
  icon?: string;
  documentId?: number;
  menuId?: number;
  tagIds?: number[];
  prohibitTagFilter?: boolean;
};

export type DerivedSiteMenuSection = {
  id: number;
  title: string;
  items: DerivedSiteMenuItem[];
};

export type DerivedSiteMenu = {
  version: 1;
  primary: DerivedSiteMenuItem[];
  sections?: DerivedSiteMenuSection[];
};

export type DerivedTagIdsByLabel = {
  version: 1;
  byLabel: Record<string, number>;
  collisions?: Record<string, number[]>;
};
