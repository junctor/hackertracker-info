interface ConfInfo {
  villages: Village[];
}

interface Village {
  name: string;
  home: string;
  forum: string;
  twitter: string;
  discord: string;
  youtube: string;
}

interface Timer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

interface HTMaps {
  description: string;
  file: string;
  filename: string;
  id: number;
  name_text: string;
  name: string;
  sort_order: number;
  url: string;
}

interface HTEventLink {
  label: string;
  type: string;
  url: string;
}

interface HTLocation {
  conference_id: number;
  conference: string;
  hotel: string;
  id: number;
  name: string;
  parent_id: number;
  short_name: string;
  updated_at: string;
}

interface HTEventType {
  color: string;
  conference_id: number;
  conference: string;
  id: number;
  name: string;
  updated_at: string;
}

interface HTConference {
  code: string;
  codeofconduct?: string;
  conference_id: number;
  description: string;
  enable_merch: boolean;
  end_date: string;
  end_timestamp_str: string;
  end_timestamp: Timestamp;
  hidden: boolean;
  hidden: false;
  id: number;
  kickoff_timestamp_str: string;
  kickoff_timestamp: Timestamp;
  link: string;
  maps: HTMaps[];
  name: string;
  start_date: string;
  start_timestamp_str: string;
  start_timestamp: Timestamp;
  supportdoc: string | null;
  tagline_text: string;
  timezone: string;
  updated_at: Timestamp;
  enable_merch_cart: boolean;
  kickoff_timestamp_str: string;
  updated_at: Timestamp;
}

interface HTTag {
  conference_id: number;
  is_single_valued: boolean;
  conference: string;
  is_browsable: boolean;
  label: string;
  id: number;
  category: string;
  sort_order: number;
  tags: HTTags[];
}

interface HTTags {
  color_foreground: string;
  color_background: string;
  description: string;
  label: string;
  id: number;
  sort_order: number;
}

interface HTEvent {
  andrsoid_description: string;
  begin_timestamp: Timestamp;
  begin: string;
  conference_id: number;
  conference: string;
  description: string;
  end_timestamp: Timestamp;
  end: string;
  id: number;
  includes: string;
  link: string;
  links?: HTEventLink[];
  location: HTLocation;
  people: HTPeople[];
  spans_timebands: string;
  speakers: HTSpeaker[];
  tag_ids: number[];
  tags: string;
  title: string;
  type: HTEventType;
  updated_timestamp: Timestamp;
  village_id: number | null;
  media?: [HTMedia] | null;
}

interface HTPeople {
  tag_id: number;
  sort_order: number;
  person_id: number;
}

interface HTSpeakerLink {
  description: string;
  title: string;
  sort_order: number;
  url: string;
}

interface HTSpeaker {
  affiliations: [HTSpeakerAffiliations];
  conference_id: number;
  description: string;
  event_ids: [number];
  id: number;
  link: string;
  links: HTSpeakerLink[];
  name: string;
  pronouns: string | null;
  title?: string;
  twitter: string;
  media: [HTMedia];
}

interface HTSpeakerLink {
  description: string;
  title: string;
  sort_order: number;
  url: string;
}

interface HTSpeakerAffiliations {
  organization: string;
  title: string;
}

interface HTFAQ {
  id: number;
  question: string;
  answer: string;
  updated_at: string;
}

interface HTLocationSchedule {
  end: string;
  begin: string;
  notes: string | null;
  status: string;
}

interface HTLocation {
  hier_extent_left: number;
  schedule: HTLocationSchedule[];
  parent_id: number;
  updated_at: string;
  id: number;
  conference_id: number;
  conference: string;
  peer_sort_order: number;
  default_status: string;
  name: string;
  hier_depth: number;
  conference_id: number;
  hotel: string;
  hier_extent_right: number;
  short_name: string;
}

interface HTNews {
  conference_id: number;
  conference: string;
  updated_at: Timestamp;
  name: string;
  text: strng;
  id: number;
}

interface HTProduct {
  code: string;
  description: string;
  media: [HTMedia];
  title: string;
  price_min: number;
  eligibility_restriction_text: null;
  tags: [number];
  product_id: number;
  id: number;
  sort_order: number;
  price_max: number;
  is_eligibility_restricted: string;
  variants: [
    {
      stock_status: string;
      variant_id: number;
      code: string;
      price: number;
      product_id: number;
      title: string;
      sort_order: number;
      tags: [number, number];
    },
  ];
}

interface HTMedia {
  hash_sha256: string;
  filetype: string;
  hash_md5: string;
  orga_id: number;
  name: string;
  is_logo: string;
  hash_crc32c: string;
  filesize: number;
  asset_id: number;
  sort_order: number;
  url: string;
}

interface HTOrganization {
  tag_ids: [number];
  conference: string;
  documents: [];
  description: string;
  media: [HTMedia];
  people: [];
  conference_id: number;
  updated_at: string;
  name: string;
  logo: {
    hash_sha256: string;
    filetype: string;
    hash_md5: string;
    name: string;
    orga_id: number;
    hash_crc32c: string;
    is_logo: string;
    asset_id: number;
    filesize: number;
    sort_order: number;
    url: string;
  };
  links: [
    {
      label: string;
      type: string;
      url: string;
    },
  ];
  locations: [{ location_id: number }];
  id: number;
  tag_id_as_organizer: number | null;
}
