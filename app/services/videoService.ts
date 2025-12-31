// app/services/videoService.ts
import { db } from "@/configs/FirebaseConfig";
import {
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Post } from "../utils/types";

const POSTS = "posts";

export const videoService = {
  /** Realtime subscription to video posts */
  subscribeToVideos(callback: (videos: Post[]) => void) {
    const q = query(
      collection(db, POSTS),
      where("type", "==", "video"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      const list = snap.docs.map(
        (d) => ({ id: d.id, ...(d.data() as any) } as Post)
      );
      callback(list);
    });
  },

  /** One-time fetch */
  async getVideosOnce(): Promise<Post[]> {
    const q = query(
      collection(db, POSTS),
      where("type", "==", "video"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Post));
  },

  /** Count view */
  async incrementViewCount(postId: string) {
    const ref = doc(db, POSTS, postId);
    await updateDoc(ref, {
      viewCount: increment(1),
      lastViewedAt: serverTimestamp(),
    });
  },
};
