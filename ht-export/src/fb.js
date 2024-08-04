import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore/lite";
import { getBytes, getStorage, ref } from "firebase/storage";
import { CONF as conference } from "./const.js";

export async function firebaseInit() {
  const firebaseConfig = {
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

export async function getLocations(db) {
  const docRef = collection(db, "conferences", conference, "locations");
  const docSnap = await getDocs(docRef);
  const firebaseData = docSnap.docs.map((speakerDoc) => speakerDoc.data());

  return firebaseData;
}

export async function getSpeakers(db) {
  const docRef = collection(db, "conferences", conference, "speakers");
  const docSnap = await getDocs(docRef);
  const firebaseData = docSnap.docs.map((speakerDoc) => speakerDoc.data());

  return firebaseData;
}

export async function getTags(db) {
  const docRef = collection(db, "conferences", conference, "tagtypes");
  const docSnap = await getDocs(docRef);
  const firebaseData = docSnap.docs.flatMap((tagsDoc) => tagsDoc.data()) ?? [];

  return firebaseData;
}

export async function getConference(db) {
  const docRef = collection(db, "conferences");
  const q = query(docRef, where("code", "==", conference));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((eventsDoc) => eventsDoc.data());

  return firebaseData[0];
}

export async function getEvents(db) {
  const docRef = collection(db, "conferences", conference, "events");
  const q = query(docRef, orderBy("begin_timestamp", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((eventsDoc) => eventsDoc.data());

  return firebaseData;
}

export async function getNews(db) {
  const docRef = collection(db, "conferences", conference, "articles");
  const q = query(docRef, orderBy("id", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((newsDoc) => newsDoc.data());

  return firebaseData;
}

export async function getFbStorage(db, file) {
  const storage = getStorage(db.app);
  const pathReference = ref(storage, `${conference}/${file}`);
  const bytes = await getBytes(pathReference);
  return {
    file,
    bytes,
  };
}

export async function getProducts(db) {
  const docRef = collection(db, "conferences", conference, "products");
  const q = query(docRef, orderBy("id", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((productDoc) => productDoc.data());

  return firebaseData;
}

export async function getOrganizations(db) {
  const docRef = collection(db, "conferences", conference, "organizations");
  const q = query(docRef, orderBy("id", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((orgDoc) => orgDoc.data());

  return firebaseData;
}

export async function getDocuments(db) {
  const docRef = collection(db, "conferences", conference, "documents");
  const q = query(docRef, orderBy("id", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((doc) => doc.data());

  return firebaseData;
}

export async function getMenus(db) {
  const docRef = collection(db, "conferences", conference, "menus");
  const q = query(docRef, orderBy("id", "desc"));
  const docSnap = await getDocs(q);
  const firebaseData = docSnap.docs.map((doc) => doc.data());

  return firebaseData;
}
