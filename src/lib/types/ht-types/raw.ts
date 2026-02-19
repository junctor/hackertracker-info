export type RawArticle = {
  conference: string;
  conference_id: number;
  id: number;
  name: string;
  text: string;
  updated_at: {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
  updated_tsz: string;
};
export type RawArticles = Array<RawArticle>;

export type RawConference = {
  begin_tsz: string;
  code: string;
  codeofconduct: string;
  conference_id: number;
  description: string;
  emergency_document_id: null;
  enable_merch: boolean;
  enable_merch_cart: boolean;
  end_date: string;
  end_timestamp: {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
  end_timestamp_str: string;
  end_tsz: string;
  feedbackform_ratelimit_seconds: number;
  hidden: boolean;
  home_menu_id: number;
  id: number;
  kickoff_timestamp: {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
  kickoff_timestamp_str: string;
  kickoff_tsz: string;
  link: string;
  maps: Array<{
    description: string;
    file: string;
    filename: string;
    id: number;
    name: string;
    name_text: string;
    sort_order: number;
    svg_filename: string;
    svg_url: string;
    url: string;
  }>;
  merch_mandatory_acknowledgement: string;
  merch_tax_statement: string;
  name: string;
  start_date: string;
  start_timestamp: {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
  start_timestamp_str: string;
  supportdoc: string;
  tagline_text: string;
  timezone: string;
  updated_at: {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
};

export type RawContentItem = {
  description: string;
  feedback_disable_timestamp: null | {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
  feedback_disable_tsz: null | string;
  feedback_enable_timestamp: null | {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
  feedback_enable_tsz: null | string;
  feedback_form_id: null | number;
  id: number;
  links: Array<{
    label: string;
    type: string;
    url: string;
  }>;
  logo: {
    asset_uuid?: string;
    filesize?: number;
    filetype?: string;
    hash_sha256?: string;
    name?: string;
    url?: string;
  };
  media: Array<{
    asset_id: number;
    filesize: number;
    filetype: string;
    hash_crc32c: string;
    hash_md5: string;
    hash_sha256: string;
    is_logo: string;
    name: string;
    sort_order: number;
    url: string;
  }>;
  people: Array<{
    person_id: number;
    sort_order: number;
    tag_ids: Array<number>;
  }>;
  related_content_ids: null | Array<number>;
  sessions: Array<{
    begin_timestamp: {
      nanoseconds: number;
      seconds: number;
      type: string;
    };
    begin_tsz: string;
    channel_id: null;
    end_timestamp: {
      nanoseconds: number;
      seconds: number;
      type: string;
    };
    end_tsz: string;
    location_id: number;
    recordingpolicy_id: number;
    session_id: number;
    timezone_name: string;
  }>;
  tag_ids: Array<number>;
  title: string;
  updated_timestamp: {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
  updated_tsz: string;
};
export type RawContent = Array<RawContentItem>;

export type RawDocument = {
  body_text: string;
  conference: string;
  conference_id: number;
  id: number;
  title_text: string;
  updated_at: {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
};
export type RawDocuments = Array<RawDocument>;

export type RawEvent = {
  android_description: string;
  begin: string;
  begin_timestamp: {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
  begin_tsz: string;
  conference: string;
  conference_id: number;
  content_id: number;
  description: string;
  end: string;
  end_timestamp: {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
  end_tsz: string;
  id: number;
  includes: string;
  link: string;
  links: Array<{
    label: string;
    type: string;
    url: string;
  }>;
  location: {
    hotel: string;
    id: number;
    name: string;
    parent_id: number;
    short_name: string;
  };
  logo: null | {
    asset_uuid: string;
    filesize: number;
    filetype: string;
    hash_sha256: string;
    name: string;
    url: string;
  };
  media: Array<unknown>;
  people: Array<{
    person_id: number;
    sort_order: number;
    tag_id: number;
  }>;
  spans_timebands: string;
  speakers: Array<{
    affiliations: Array<{
      organization: string;
      title: string;
    }>;
    avatar: null | {
      asset_uuid: string;
      filesize: number;
      filetype: string;
      hash_crc32c: string;
      hash_md5: string;
      hash_sha256: string;
      name: string;
      url: string;
    };
    conference_id: number;
    content_ids: Array<number>;
    event_ids: Array<number>;
    id: number;
    links: Array<{
      description: null | string;
      sort_order: number;
      title: string;
      url: string;
    }>;
    media: Array<{
      asset_id: number;
      filesize: number;
      filetype: string;
      hash_crc32c: string;
      hash_md5: string;
      hash_sha256: string;
      name: string;
      person_id: number;
      sort_order: number;
      url: string;
    }>;
    name: string;
    pronouns: null | string;
    title?: string;
    updated_tsz: string;
  }>;
  tag_ids: Array<number>;
  tags: string;
  timeband_id: number;
  timezone: string;
  title: string;
  type: {
    color: string;
    conference: string;
    conference_id: number;
    id: number;
    name: string;
    updated_at: string;
    updated_tsz: string;
  };
  updated: string;
  updated_timestamp: {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
  updated_tsz: string;
  village_id: null;
};
export type RawEvents = Array<RawEvent>;

export type RawLocation = {
  default_status: string;
  hier_depth: number;
  hier_extent_left: number;
  hier_extent_right: number;
  hotel: string;
  id: number;
  name: string;
  parent_id: number;
  peer_sort_order: number;
  schedule: Array<unknown>;
  short_name: string;
};
export type RawLocations = Array<RawLocation>;

export type RawMenu = {
  conference: string;
  conference_id: number;
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
export type RawMenus = Array<RawMenu>;

export type RawOrganization = {
  conference: string;
  conference_id: number;
  description: string;
  documents: Array<unknown>;
  id: number;
  links: Array<{
    label: string;
    type: string;
    url: string;
  }>;
  locations: Array<{
    location_id: number;
  }>;
  logo: {
    asset_id?: number;
    filesize?: number;
    filetype?: string;
    hash_crc32c?: string;
    hash_md5?: string;
    hash_sha256?: string;
    is_logo?: string;
    name?: string;
    orga_id?: number;
    sort_order?: number;
    url?: string;
  };
  media: Array<{
    asset_id: number;
    filesize: number;
    filetype: string;
    hash_crc32c: string;
    hash_md5: string;
    hash_sha256: string;
    is_logo: string;
    name: string;
    orga_id: number;
    sort_order: number;
    url: string;
  }>;
  name: string;
  people: Array<unknown>;
  tag_id_as_organizer: null | number;
  tag_ids: Array<number>;
  updated_at: string;
  updated_tsz: string;
};
export type RawOrganizations = Array<RawOrganization>;

export type RawSpeaker = {
  affiliations: Array<{
    organization: string;
    title: string;
  }>;
  avatar: null | {
    asset_uuid: string;
    filesize: number;
    filetype: string;
    hash_crc32c: string;
    hash_md5: string;
    hash_sha256: string;
    name: string;
    url: string;
  };
  conference: string;
  conference_id: number;
  content_ids: Array<number>;
  description: string;
  event_ids: Array<number>;
  id: number;
  link: string;
  links: Array<{
    description: null | string;
    sort_order: number;
    title: string;
    url: string;
  }>;
  media: Array<{
    asset_id: number;
    filesize: number;
    filetype: string;
    hash_crc32c: string;
    hash_md5: string;
    hash_sha256: string;
    name: string;
    person_id: number;
    sort_order: number;
    url: string;
  }>;
  name: string;
  pronouns: null | string;
  title: string;
  twitter: string;
  updated_at: string;
  updated_timestamp: {
    nanoseconds: number;
    seconds: number;
    type: string;
  };
  updated_tsz: string;
};
export type RawSpeakers = Array<RawSpeaker>;

export type RawTagtype = {
  category: string;
  conference: string;
  conference_id: number;
  id: number;
  is_browsable: boolean;
  is_single_valued: boolean;
  label: string;
  sort_order: number;
  tags: Array<{
    color_background: string;
    color_foreground: string;
    description: string;
    id: number;
    label: string;
    sort_order: number;
  }>;
  uuid: string;
  well_known_uuid: null | string;
};
export type RawTagtypes = Array<RawTagtype>;
