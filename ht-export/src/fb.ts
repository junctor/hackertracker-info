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

export async function firebaseInit(apiKey: string) {
  const firebaseConfig = {
    apiKey,
    authDomain: "junctor-hackertracker.firebaseapp.com",
    projectId: "junctor-hackertracker",
    storageBucket: "junctor-hackertracker.appspot.com",
    messagingSenderId: "552364409858",
    appId: "1:552364409858:web:ceb163b5ca77ebe00d131b",
    measurementId: "G-JSP9RM82KG",
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
  const firebaseData = docSnap.docs.map((newsDoc: { data: () => any }) =>
    newsDoc.data()
  );

  return firebaseData;
}

export async function getFbStorage(
  db: Firestore,
  conference: string,
  file: string
) {
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
  const firebaseData = docSnap.docs.map((productDoc: { data: () => any }) =>
    productDoc.data()
  );

  return firebaseData;
}

export async function getOrganizations(db: Firestore, conference: string) {
  const docRef = collection(db, "conferences", conference, "organizations");
  const q = query(docRef, orderBy("id", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((orgDoc: { data: () => any }) =>
    orgDoc.data()
  );

  return firebaseData;
}
