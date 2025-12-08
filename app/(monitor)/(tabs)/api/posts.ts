import { db } from "@/configs/FirebaseConfig";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

/**
 * CREATE A NEW POST (single/multi images OR folder)
 */
export async function createPost({
  createdById,
  createdByName,
  createdByImage,
  description,
  images,
  folderId = null,
}) {
  const ref = collection(db, "posts");
  const docRef = await addDoc(ref, {
    createdById,
    createdByName,
    createdByImage,
    description: description || "",
    folderId: folderId || null,
    images: images || [], // [{url,publicId}]
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * SUBSCRIBE TO ALL POSTS BY USER
 */
export function subscribeToUserPosts(userId, cb) {
  const q = query(
    collection(db, "posts"),
    where("createdById", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    const arr = [];
    snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
    cb(arr);
  });
}

/**
 * GET ALL POSTS (for feed)
 */
export function subscribeToAllPosts(cb) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snap) => {
    const arr = [];
    snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
    cb(arr);
  });
}
