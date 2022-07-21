/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import firebase from "firebase/app";
import { Firestore } from "firebase/firestore";

type Timestamp = firebase.firestore.Timestamp;

interface HTMaps {
  file: string;
  name: string;
}

interface HTLinks {
  label: string;
  url: string;
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
  updated_at: Timestamp;
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
  links?: HTLinks[];
  title: string;
  location: HTLocationModel;
  speakers: HTSpeaker[];
  type: HTEventType;
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

interface HTFAQ {
  id: number;
  question: string;
  answer: string;
  updated_at: string;
}
