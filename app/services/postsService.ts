// // app/services/postsService.ts
// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   getDocs,
//   orderBy,
//   query,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";

// import { db } from "@/configs/FirebaseConfig";
// import { Post } from "../utils/types";

// const POSTS = "posts";

// export const postsService = {
//   /**
//    * Create a post (Gallery OR News/Event)
//    *
//    * For gallery posts:
//    * - type is always "post"
//    * - postType: "single" | "multi" | "folder"
//    * - folderId, tags, media[] supported
//    */
//   async createPost(data: {
//     ownerId: string;
//     ownerName: string;
//     ownerRole: "admin" | "monitor" | "user";

//     // Universal post category
//     type: "post" | "event" | "news";

//     // GALLERY only
//     postType?: "single" | "multi" | "folder";
//     folderId?: string | null;
//     description?: string;
//     tags?: string[];
//     media?: { url: string; publicId: string; order: number }[];

//     // Optional for news/events
//     title?: string;

//     // Toggles
//     allowLikes: boolean;
//     allowComments: boolean;
//     allowShares: boolean;
//   }) {
//     const ref = await addDoc(collection(db, POSTS), {
//       ownerId: data.ownerId,
//       ownerName: data.ownerName,
//       ownerRole: data.ownerRole,

//       // Main type (post/event/news)
//       type: data.type ?? "post",

//       // Gallery post types
//       postType: data.postType ?? null, // single/multi/folder
//       folderId: data.folderId ?? null,
//       description: data.description ?? "",
//       tags: data.tags ?? [],
//       media: data.media ?? [],

//       // News/Events compatibility
//       title: data.title ?? null,

//       // Toggles
//       allowLikes: data.allowLikes,
//       allowComments: data.allowComments,
//       allowShares: data.allowShares,

//       // Counters
//       likeCount: 0,
//       commentCount: 0,
//       shareCount: 0,

//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });

//     return ref.id;
//   },

//   /** Fetch posts for feed (recent first) */
//   async getAllPosts() {
//     const q = query(collection(db, POSTS), orderBy("createdAt", "desc"));
//     const snap = await getDocs(q);
//     return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Post[];
//   },

//   /** Fetch selected post */
//   async getPost(postId: string) {
//     const ref = doc(db, POSTS, postId);
//     const snap = await getDoc(ref);
//     if (!snap.exists()) return null;
//     return { id: snap.id, ...snap.data() } as Post;
//   },

//   /** Update post toggle settings */
//   async updatePostSettings(
//     postId: string,
//     opts: {
//       allowLikes?: boolean;
//       allowComments?: boolean;
//       allowShares?: boolean;
//     }
//   ) {
//     await updateDoc(doc(db, POSTS, postId), {
//       ...opts,
//       updatedAt: serverTimestamp(),
//     });
//   },

//   /** Update only media (for edit screens) */
//   async updatePostMedia(
//     postId: string,
//     media: { url: string; publicId: string; order: number }[]
//   ) {
//     await updateDoc(doc(db, POSTS, postId), {
//       media,
//       updatedAt: serverTimestamp(),
//     });
//   },

//   /** Delete post from Firestore */
//   async deletePost(postId: string) {
//     await deleteDoc(doc(db, POSTS, postId));
//   },

//   async toggleLike(postId: string) {
//     const ref = doc(db, POSTS, postId);
//     const snap = await getDoc(ref);
//     if (!snap.exists()) return;

//     const current = snap.data();
//     const likeCount = current.likeCount ?? 0;

//     await updateDoc(ref, {
//       likeCount: likeCount + 1,
//       updatedAt: serverTimestamp(),
//     });
//   },
// };

// // app/services/postsService.ts
// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   getDocs,
//   orderBy,
//   query,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";

// import { db } from "@/configs/FirebaseConfig";
// import { Post } from "../utils/types";

// const POSTS = "posts";

// export const postsService = {
//   /**
//    * Create a post (Gallery OR News/Event)
//    *
//    * For gallery posts:
//    * - type is always "post"
//    * - postType: "single" | "multi" | "folder"
//    * - folderId, tags, media[] supported
//    */
//   async createPost(data: {
//     ownerId: string;
//     ownerName: string;
//     ownerRole: "admin" | "monitor" | "user";

//     // Universal post category
//     type: "post" | "event" | "news";

//     // GALLERY only
//     postType?: "single" | "multi" | "folder";
//     folderId?: string | null;
//     description?: string;
//     tags?: string[];
//     media?: { url: string; publicId: string; order: number }[];

//     // Optional for news/events
//     title?: string;

//     // Toggles
//     allowLikes: boolean;
//     allowComments: boolean;
//     allowShares: boolean;
//   }) {
//     const ref = await addDoc(collection(db, POSTS), {
//       ownerId: data.ownerId,
//       ownerName: data.ownerName,
//       ownerRole: data.ownerRole,

//       // Main type (post/event/news)
//       type: data.type ?? "post",

//       // Gallery post types
//       postType: data.postType ?? null, // single/multi/folder
//       folderId: data.folderId ?? null,
//       description: data.description ?? "",
//       tags: data.tags ?? [],
//       media: data.media ?? [],

//       // News/Events compatibility
//       title: data.title ?? null,

//       // Toggles
//       allowLikes: data.allowLikes,
//       allowComments: data.allowComments,
//       allowShares: data.allowShares,

//       // Counters
//       likeCount: 0,
//       commentCount: 0,
//       shareCount: 0,

//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });

//     return ref.id;
//   },

//   /** Fetch posts for feed (recent first) */
//   async getAllPosts() {
//     const q = query(collection(db, POSTS), orderBy("createdAt", "desc"));
//     const snap = await getDocs(q);
//     return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Post[];
//   },

//   /** Fetch selected post */
//   async getPost(postId: string) {
//     const ref = doc(db, POSTS, postId);
//     const snap = await getDoc(ref);
//     if (!snap.exists()) return null;
//     return { id: snap.id, ...snap.data() } as Post;
//   },

//   /** Update post toggle settings */
//   async updatePostSettings(
//     postId: string,
//     opts: {
//       allowLikes?: boolean;
//       allowComments?: boolean;
//       allowShares?: boolean;
//     }
//   ) {
//     await updateDoc(doc(db, POSTS, postId), {
//       ...opts,
//       updatedAt: serverTimestamp(),
//     });
//   },

//   /** Update only media (for edit screens) */
//   async updatePostMedia(
//     postId: string,
//     media: { url: string; publicId: string; order: number }[]
//   ) {
//     await updateDoc(doc(db, POSTS, postId), {
//       media,
//       updatedAt: serverTimestamp(),
//     });
//   },

//   /** New: Update arbitrary post fields (used for edit) */
//   async updatePost(postId: string, data: Partial<Post>) {
//     await updateDoc(doc(db, POSTS, postId), {
//       ...data,
//       updatedAt: serverTimestamp(),
//     });
//   },

//   /** Delete post from Firestore */
//   async deletePost(postId: string) {
//     await deleteDoc(doc(db, POSTS, postId));
//   },

//   async toggleLike(postId: string) {
//     const ref = doc(db, POSTS, postId);
//     const snap = await getDoc(ref);
//     if (!snap.exists()) return;

//     const current = snap.data();
//     const likeCount = current.likeCount ?? 0;

//     await updateDoc(ref, {
//       likeCount: likeCount + 1,
//       updatedAt: serverTimestamp(),
//     });
//   },
// };

// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   getDocs,
//   orderBy,
//   query,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";

// import { db } from "@/configs/FirebaseConfig";
// import { Post } from "../utils/types";

// const POSTS = "posts";

// export const postsService = {
//   async createPost(data: Partial<Post>) {
//     const ref = await addDoc(collection(db, POSTS), {
//       ...data,
//       tags: data.tags ?? [],
//       media: data.media ?? [],
//       postType: data.postType ?? null,
//       title: data.title ?? null,

//       likeCount: 0,
//       commentCount: 0,
//       shareCount: 0,

//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });

//     return ref.id;
//   },

//   async getAllPosts() {
//     const q = query(collection(db, POSTS), orderBy("createdAt", "desc"));
//     const snap = await getDocs(q);
//     return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Post[];
//   },

//   async getPost(postId: string) {
//     const ref = doc(db, POSTS, postId);
//     const snap = await getDoc(ref);
//     if (!snap.exists()) return null;
//     return { id: snap.id, ...snap.data() } as Post;
//   },

//   async updatePost(postId: string, data: Partial<Post>) {
//     await updateDoc(doc(db, POSTS, postId), {
//       ...data,
//       updatedAt: serverTimestamp(),
//     });
//   },

//   async deletePost(postId: string) {
//     await deleteDoc(doc(db, POSTS, postId));
//   },
// };

// /app/services/postsService.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/configs/FirebaseConfig";
import { Post } from "../utils/types";

const POSTS = "posts";

export const postsService = {
  // ---------- existing functions (unchanged) ----------
  async createPost(data: Partial<Post>) {
    const ref = await addDoc(collection(db, POSTS), {
      ...data,
      tags: data.tags ?? [],
      media: data.media ?? [],
      postType: data.postType ?? null,
      title: data.title ?? null,

      likeCount: 0,
      commentCount: 0,
      shareCount: 0,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  },

  async getAllPosts() {
    const q = query(collection(db, POSTS), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Post[];
  },

  async getPost(postId: string) {
    const ref = doc(db, POSTS, postId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Post;
  },

  async updatePost(postId: string, data: Partial<Post>) {
    await updateDoc(doc(db, POSTS, postId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deletePost(postId: string) {
    await deleteDoc(doc(db, POSTS, postId));
  },

  // ---------- NEW: Likes API ----------
  /**
   * Like a post (stores a doc at posts/{postId}/likes/{userId} and increments likeCount)
   * user: { userId, name, photoURL } - include minimal user data here
   */
  async likePost(
    postId: string,
    user: { userId: string; name: string; photoURL?: string }
  ) {
    const postRef = doc(db, POSTS, postId);
    const likeRef = doc(db, POSTS, postId, "likes", user.userId);

    await runTransaction(db, async (transaction) => {
      const postSnap = await transaction.get(postRef);
      if (!postSnap.exists()) throw new Error("Post does not exist");

      const likeSnap = await transaction.get(likeRef);
      if (likeSnap.exists()) {
        // already liked
        return;
      }

      // create like doc (store user info for display)
      transaction.set(likeRef, {
        userId: user.userId,
        name: user.name ?? null,
        photoURL: user.photoURL ?? null,
        createdAt: serverTimestamp(),
      });

      // increment like count
      transaction.update(postRef, { likeCount: increment(1) });
    });
  },

  /**
   * Unlike a post (remove subcollection doc and decrement count)
   */
  async unlikePost(postId: string, userId: string) {
    const postRef = doc(db, POSTS, postId);
    const likeRef = doc(db, POSTS, postId, "likes", userId);

    await runTransaction(db, async (transaction) => {
      const postSnap = await transaction.get(postRef);
      if (!postSnap.exists()) throw new Error("Post does not exist");

      const likeSnap = await transaction.get(likeRef);
      if (!likeSnap.exists()) {
        // nothing to do
        return;
      }

      transaction.delete(likeRef);
      transaction.update(postRef, { likeCount: increment(-1) });
    });
  },

  /**
   * Get list of liked users for a post (optionally with limit)
   */
  async getPostLikes(postId: string, limit?: number) {
    const likesCol = collection(db, POSTS, postId, "likes");
    const q = limit
      ? query(likesCol, orderBy("createdAt", "desc")).withConverter(null)
      : query(likesCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  },

  /**
   * Check whether a user has liked a post (fast direct read)
   */
  async isPostLikedByUser(postId: string, userId: string) {
    const likeRef = doc(db, POSTS, postId, "likes", userId);
    const snap = await getDoc(likeRef);
    return snap.exists();
  },

  subscribeToPostType(type: Post["type"], cb: (list: Post[]) => void) {
    const q = query(collection(db, POSTS), where("type", "==", type));
    return onSnapshot(q, (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Post)));
    });
  },
};
