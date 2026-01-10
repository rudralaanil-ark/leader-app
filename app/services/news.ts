// // app/(monitor)/(tabs)/api/news.ts
// import { db } from "@/configs/FirebaseConfig";
// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";

// const newsRef = collection(db, "news");

// export const createNews = async (data: any, uid: string) => {
//   console.log("🔵 createNews ENTERED");
//   console.log("🔵 createNews uid:", uid);
//   console.log("🔵 createNews data:", data);
//   if (!uid) throw new Error("User ID missing!");

//   console.log("🔵 BEFORE addDoc");

//   const docRef = await addDoc(newsRef, {
//     ...data,
//     createdBy: uid,
//     createdAt: serverTimestamp(),
//     updatedAt: serverTimestamp(),
//   });

//   return docRef.id;
// };

// export const updateNews = async (id: string, data: any) => {
//   const docRef = doc(db, "news", id);
//   await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
// };

// export const deleteNews = async (id: string) => {
//   const docRef = doc(db, "news", id);
//   await deleteDoc(docRef);
// };

// export const getNews = async (id: string) => {
//   const docRef = doc(db, "news", id);
//   const snap = await getDoc(docRef);
//   return snap.exists() ? { id: snap.id, ...snap.data() } : null;
// };

// // Live listener
// export const listenToNews = (callback: (news: any[]) => void) => {
//   const q = query(newsRef, orderBy("createdAt", "desc"));
//   return onSnapshot(q, (snap) => {
//     const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//     callback(items);
//   });
// };

// app/(monitor)/(tabs)/api/news.ts
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

const normalizeImageUrl = (imageUrl: any): string | null => {
  if (!imageUrl) return null;
  if (typeof imageUrl === "string") return imageUrl;
  if (typeof imageUrl === "object" && typeof imageUrl.url === "string")
    return imageUrl.url;
  return null;
};

export const createNews = async (
  data: any,
  createdBy: {
    uid: string;
    fullName: string;
    role?: string;
  }
) => {
  if (!createdBy?.uid) throw new Error("User ID missing!");

  const payload = {
    ...data,
    imageUrl: normalizeImageUrl(data.imageUrl),
    createdBy: createdBy.uid,
    createdByName: createdBy.fullName || null, // ✅ NAME
    createdByRole: createdBy.role || null, // ✅ ROLE
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(newsRef, payload);
  return docRef.id;
};

export const updateNews = async (id: string, data: any) => {
  const docRef = doc(db, "news", id);
  await updateDoc(docRef, {
    ...data,
    imageUrl: normalizeImageUrl(data.imageUrl),
    updatedAt: serverTimestamp(),
  });
};

export const deleteNews = async (id: string) => {
  await deleteDoc(doc(db, "news", id));
};

export const getNews = async (id: string) => {
  const snap = await getDoc(doc(db, "news", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const listenToNews = (callback: (news: any[]) => void) => {
  const q = query(newsRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};
