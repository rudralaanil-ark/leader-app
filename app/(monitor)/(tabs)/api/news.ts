import { db } from "@/configs/FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const newsRef = collection(db, "news");

export const createNews = async (data: any) => {
  const docRef = await addDoc(newsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateNews = async (id: string, data: any) => {
  const docRef = doc(db, "news", id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteNews = async (id: string) => {
  const docRef = doc(db, "news", id);
  await deleteDoc(docRef);
};

export const getNews = async (id: string) => {
  const docRef = doc(db, "news", id);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// Live listener
export const listenToNews = (callback: (news: any[]) => void) => {
  const q = query(newsRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};
