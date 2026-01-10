import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export const toggleLike = async (newsId: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "userLikes", user.uid, "likes", newsId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await deleteDoc(ref);
    return false; // unliked
  } else {
    await setDoc(ref, { liked: true });
    return true; // liked
  }
};

export const toggleBookmark = async (newsId: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "userBookmarks", user.uid, "bookmarks", newsId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await deleteDoc(ref);
    return false; // unbookmarked
  } else {
    await setDoc(ref, { bookmarked: true });
    return true; // bookmarked
  }
};

export const isNewsLiked = async (newsId: string) => {
  const user = auth.currentUser;
  if (!user) return false;

  const ref = doc(db, "userLikes", user.uid, "likes", newsId);
  const snap = await getDoc(ref);
  return snap.exists();
};

export const isNewsBookmarked = async (newsId: string) => {
  const user = auth.currentUser;
  if (!user) return false;

  const ref = doc(db, "userBookmarks", user.uid, "bookmarks", newsId);
  const snap = await getDoc(ref);
  return snap.exists();
};
