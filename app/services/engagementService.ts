// app/services/engagementService.ts
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/configs/FirebaseConfig";

export const engagementService = {
  /** Like content */
  async like(contentId: string, userId: string) {
    await setDoc(doc(db, `engagement/${contentId}/likes`, userId), {
      userId,
      likedAt: serverTimestamp(),
    });
  },

  /** Unlike content */
  async unlike(contentId: string, userId: string) {
    await deleteDoc(doc(db, `engagement/${contentId}/likes`, userId));
  },

  /** Add comment */
  async addComment(contentId: string, userId: string, text: string) {
    await addDoc(collection(db, `engagement/${contentId}/comments`), {
      userId,
      text,
      createdAt: serverTimestamp(),
    });
  },

  /** Delete a specific comment */
  async deleteComment(contentId: string, commentId: string) {
    await deleteDoc(doc(db, `engagement/${contentId}/comments/${commentId}`));
  },

  /** Get comments */
  async getComments(contentId: string) {
    const snap = await getDocs(
      collection(db, `engagement/${contentId}/comments`)
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
};
