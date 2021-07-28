// eslint-disable-next-line import/no-extraneous-dependencies
import firebase from "firebase/app";
// eslint-disable-next-line import/no-extraneous-dependencies
import "firebase/firestore";
import { HTConference, HTEvent, HTSpeaker } from "./ht";

export async function firebaseInit() {
  const firebaseConfig = {
    apiKey: "AIzaSyAsAP88rl0Qk0v4g_vYFpybKohS_hiyq-w",
    authDomain: "hackertest-5a202.firebaseapp.com",
    databaseURL: "https://hackertest-5a202.firebaseio.com",
    projectId: "hackertest-5a202",
    messagingSenderId: "611899979455",
    appId: "1:611899979455:web:e52aa3314edcf7a2",
    measurementId: "G-RBXLKX75MN",
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

export async function speakerData(conference: string): Promise<HTSpeaker[]> {
  const conf = await firebase
    .firestore()
    .collection("conferences")
    .doc(conference)
    .collection("speakers")
    .get();

  const firebaseData: HTSpeaker[] = conf.docs.map((doc: { data: () => any }) =>
    doc.data()
  );

  return firebaseData;
}

export async function updatedDate(): Promise<string> {
  const conf = await firebase
    .firestore()
    .collection("conferences")
    .where("code", "==", "DEFCON29")
    .get();

  const firebaseData: HTConference[] = conf.docs.map(
    (doc: { data: () => any }) => doc.data()
  );

  return firebaseData[0].updated_at;
}

export async function eventData(conference: string): Promise<HTEvent[]> {
  const querySnapshot = await firebase
    .firestore()
    .collection("conferences")
    .doc(conference)
    .collection("events")
    .orderBy("begin_timestamp", "asc")
    .get();

  const firebaseData: HTEvent[] = querySnapshot.docs.map(
    (doc: { data: () => any }) => doc.data()
  );

  return firebaseData;
}
