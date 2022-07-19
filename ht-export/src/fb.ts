import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore/lite";
import { Firestore } from "firebase/firestore";
import type { HTConference, HTEvent, HTFAQ, HTSpeaker } from "./ht";

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

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  return db;
}

export async function getSpeakerData(
  db: Firestore,
  conference: string
): Promise<HTSpeaker[]> {
  const docRef = collection(db, "conferences", conference, "speakers");
  const docSnap = await getDocs(docRef);
  const firebaseData: HTSpeaker[] = docSnap.docs.map(
    (speakerDoc) => speakerDoc.data() as any
  );

  return firebaseData;
}

export async function getConference(
  db: Firestore,
  conference: string
): Promise<HTConference | undefined> {
  const docRef = collection(db, "conferences");
  const q = query(docRef, where("code", "==", conference));
  const docSnap = await getDocs(q);
  const firebaseData: HTConference[] = docSnap.docs.map(
    (eventsDoc: { data: () => any }) => eventsDoc.data()
  );

  return firebaseData[0];
}

export async function getConfEvents(
  db: Firestore,
  conference: string
): Promise<HTEvent[]> {
  const docRef = collection(db, "conferences", conference, "events");
  const q = query(docRef, orderBy("begin_timestamp", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData: HTEvent[] = docSnap.docs.map(
    (eventsDoc: { data: () => any }) => eventsDoc.data()
  );

  return firebaseData;
}

export async function getConfFAQ(
  db: Firestore,
  conference: string
): Promise<HTFAQ[]> {
  const docRef = collection(db, "conferences", conference, "faqs");
  const q = query(docRef, orderBy("id", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData: HTFAQ[] = docSnap.docs.map(
    (faqDoc: { data: () => any }) => faqDoc.data()
  );

  return firebaseData;
}
