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
import { getBytes, getStorage, ref } from "firebase/storage";

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

export async function getLocations(db: Firestore, conference: string) {
  const docRef = collection(db, "conferences", conference, "locations");
  const docSnap = await getDocs(docRef);
  const firebaseData = docSnap.docs.map(
    (speakerDoc) => speakerDoc.data() as any
  );

  return firebaseData;
}

export async function getSpeakers(db: Firestore, conference: string) {
  const docRef = collection(db, "conferences", conference, "speakers");
  const docSnap = await getDocs(docRef);
  const firebaseData = docSnap.docs.map(
    (speakerDoc) => speakerDoc.data() as any
  );

  return firebaseData;
}

export async function getTags(db: Firestore, conference: string) {
  const docRef = collection(db, "conferences", conference, "tagtypes");
  const docSnap = await getDocs(docRef);
  const firebaseData =
    docSnap.docs.flatMap((tagsDoc) => tagsDoc.data() as any) ?? [];

  return firebaseData;
}

export async function getConference(db: Firestore, conference: string) {
  const docRef = collection(db, "conferences");
  const q = query(docRef, where("code", "==", conference));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((eventsDoc: { data: () => any }) =>
    eventsDoc.data()
  );

  return firebaseData[0];
}

export async function getEvents(db: Firestore, conference: string) {
  const docRef = collection(db, "conferences", conference, "events");
  const q = query(docRef, orderBy("begin_timestamp", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((eventsDoc: { data: () => any }) =>
    eventsDoc.data()
  );

  return firebaseData;
}

export async function getFAQ(db: Firestore, conference: string) {
  const docRef = collection(db, "conferences", conference, "faqs");
  const q = query(docRef, orderBy("id", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((faqDoc: { data: () => any }) =>
    faqDoc.data()
  );

  return firebaseData;
}

export async function getNews(db: Firestore, conference: string) {
  const docRef = collection(db, "conferences", conference, "articles");
  const q = query(docRef, orderBy("id", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((faqDoc: { data: () => any }) =>
    faqDoc.data()
  );

  return firebaseData;
}

export async function getMaps(db: Firestore, conference: string, file: string) {
  const storage = getStorage(db.app);
  const pathReference = ref(storage, `${conference}/${file}`);
  const bytes = await getBytes(pathReference);
  return {
    file,
    bytes,
  };
}

export async function getProducts(db: Firestore, conference: string) {
  const docRef = collection(db, "conferences", conference, "products");
  const q = query(docRef, orderBy("id", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((faqDoc: { data: () => any }) =>
    faqDoc.data()
  );

  return firebaseData;
}

export async function getOrganizations(db: Firestore, conference: string) {
  const docRef = collection(db, "conferences", conference, "organizations");
  const q = query(docRef, orderBy("id", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((faqDoc: { data: () => any }) =>
    faqDoc.data()
  );

  return firebaseData;
}
