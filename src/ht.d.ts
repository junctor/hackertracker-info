/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import React from "react";
import type { Timestamp } from "firebase";

interface HTMaps {
  file: string;
  name: string;
}

interface HTLinks {
  label: string;
  url: string;
}
interface HTSpeaker {
  id: number;
  conferenceName: string;
  description: string;
  link: string;
  name: string;
  title: string;
  twitter: string;
  events: [HTEvent];
}

interface HTLocationModel {
  id: number;
  conferenceName: string;
  name: string;
  hotel: string;
}

interface HTEventType {
  id: number;
  color: string;
  conferenceName: string;
  name: string;
  description: string;
  tags: string;
  youtube_url: string;
  discord_url: string;
  subforum_url: string;
}

interface HTConference {
  start_timestamp: Timestamp;
  end_date: string;
  maps?: HTMaps[];
  name: string;
  code: string;
  start_date: string;
  link: string;
  hidden: false;
  codeofconduct?: string;
  updated_at: string;
  id: number;
  timezone: string;
  description: string;
  end_timestamp: Timestamp;
}

interface HTEvent {
  id: number;
  conferenceName: string;
  description: string;
  android_description: string;
  begin: string;
  begin_timestamp: Timestamp;
  end: string;
  end_timestamp: Timestamp;
  includes: string;
  links: HTLinks[];
  title: string;
  location: HTLocationModel;
  speakers: HTSpeaker[];
  type: HTEventType;
}

type MainProps = {
  localTime: boolean;
  category: string;
  setCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  searchQuery: string;
};

type HeaderProps = {
  categories: Set<string>;
  localTime: boolean;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setLocalTime: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

type EventProps = {
  events: Record<string, [HTEvent]>;
  localTime: boolean;
};

type SpeakerProps = {
  localTime: boolean;
};

type SpeakerDetailProps = {
  speaker: HTSpeaker;
  localTime: boolean;
};

type EventDetailProps = {
  event: HTEvent;
  localTime: boolean;
};

type LoadingProps = {
  conf: string;
};

interface HeadingLink {
  href: string;
  text: string;
}

interface SideMenu {
  heading: string;
  links: HeadingLink[];
}
