// // app/services/commentsService.ts
// import { db } from "@/configs/FirebaseConfig";
// import {
//   collection,
//   doc,
//   getDocs,
//   increment,
//   onSnapshot,
//   orderBy,
//   query,
//   runTransaction,
//   serverTimestamp,
//   where,
// } from "firebase/firestore";

// /**
//  * Comments model (per document):
//  * {
//  *   userId,
//  *   name,
//  *   role,
//  *   profileImage,
//  *   text,
//  *   parentId: string | null,
//  *   createdAt: Timestamp
//  * }
//  *
//  * Path:
//  * posts/{postId}/comments/{commentId}
//  */

// export const commentsService = {
//   commentsCol(postId: string) {
//     return collection(db, "posts", postId, "comments");
//   },

//   /**
//    * Subscribe to comments in real-time.
//    * The callback receives the full flat comment array (ordered by createdAt ASC).
//    * Returns unsubscribe function.
//    */
//   // inside app/services/commentsService.ts (replace subscribeToComments)
//   // inside app/services/commentsService.ts — replace subscribeToComments(...) with this

//   subscribeToComments(postId: string, cb: (comments: any[]) => void) {
//     if (!postId) return () => {};

//     // helper to normalize doc -> comment obj
//     const normalize = (d: any, source: string) => {
//       const data = d.data ? d.data() : d;
//       return { id: d.id ?? data.id, ...data, __source: source };
//     };

//     // current snapshots from both sources
//     let nestedSnap: any[] | null = null;
//     let legacySnap: any[] | null = null;

//     // merge function: de-dup by id and sort by createdAt asc
//     const emitMerged = () => {
//       const mergedById = new Map<string, any>();
//       const pushArray = (arr: any[] | null) => {
//         if (!arr || !Array.isArray(arr)) return;
//         for (const c of arr) mergedById.set(c.id, c);
//       };
//       pushArray(nestedSnap);
//       pushArray(legacySnap);
//       const merged = Array.from(mergedById.values()).sort((a: any, b: any) => {
//         const ta = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
//         const tb = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
//         return tb - ta;
//       });
//       cb(merged);
//     };

//     // Query nested: posts/{postId}/comments
//     const q1 = query(this.commentsCol(postId), orderBy("createdAt", "asc"));
//     const unsub1 = onSnapshot(
//       q1,
//       (snap) => {
//         nestedSnap = snap.docs.map((d) => ({
//           id: d.id,
//           ...d.data(),
//           __source: "nested",
//         }));
//         emitMerged();
//       },
//       (err) => {
//         console.warn("commentsService.subscribeToComments nested error", err);
//         nestedSnap = [];
//         emitMerged();
//       }
//     );

//     // Query legacy top-level comments collection where postId == postId
//     const topLevelCol = collection(db, "comments");
//     const q2 = query(
//       topLevelCol,
//       where("postId", "==", postId),
//       orderBy("createdAt", "asc")
//     );
//     const unsub2 = onSnapshot(
//       q2,
//       (snap) => {
//         legacySnap = snap.docs.map((d) => ({
//           id: d.id,
//           ...d.data(),
//           __source: "legacy",
//         }));
//         emitMerged();
//       },
//       (err) => {
//         console.warn(
//           "commentsService.subscribeToComments top-level error",
//           err
//         );
//         legacySnap = [];
//         emitMerged();
//       }
//     );

//     // return combined unsubscribe
//     return () => {
//       try {
//         unsub1 && unsub1();
//       } catch {}
//       try {
//         unsub2 && unsub2();
//       } catch {}
//     };
//   },

//   /** Add a comment or reply */
//   async addComment({
//     postId,
//     userId,
//     name,
//     role,
//     profileImage,
//     text,
//     parentId = null,
//   }: {
//     postId: string;
//     userId: string;
//     name: string;
//     role?: string;
//     profileImage?: string | null;
//     text: string;
//     parentId?: string | null;
//   }) {
//     const postRef = doc(db, "posts", postId);
//     const commentsCol = this.commentsCol(postId);

//     await runTransaction(db, async (tx) => {
//       const postSnap = await tx.get(postRef);
//       if (!postSnap.exists()) {
//         throw new Error("Post does not exist");
//       }

//       // create comment
//       const commentRef = doc(commentsCol);
//       tx.set(commentRef, {
//         userId,
//         name,
//         role: role ?? "user",
//         profileImage: profileImage ?? null,
//         text,
//         parentId: parentId || null,
//         createdAt: serverTimestamp(),
//       });

//       // increment counter
//       tx.update(postRef, {
//         commentCount: increment(1),
//         updatedAt: serverTimestamp(),
//       });
//     });
//   },

//   /** Delete comment (also works for replies) */
//   async deleteComment(postId: string, commentId: string) {
//     const postRef = doc(db, "posts", postId);
//     const commentRef = doc(db, "posts", postId, "comments", commentId);

//     await runTransaction(db, async (tx) => {
//       const postSnap = await tx.get(postRef);
//       if (!postSnap.exists()) return;

//       tx.delete(commentRef);

//       tx.update(postRef, {
//         commentCount: increment(-1),
//         updatedAt: serverTimestamp(),
//       });
//     });
//   },
//   /** Utility: get flat list (one-time) */
//   async getCommentsOnce(postId: string) {
//     const q = query(this.commentsCol(postId), orderBy("createdAt", "desc"));
//     const snap = await getDocs(q);
//     return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
//   },
// };

// app/services/commentsService.ts
import { db } from "@/configs/FirebaseConfig";
import {
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Comments model (per document):
 * {
 *   userId,
 *   name,
 *   role,
 *   profileImage,
 *   text,
 *   parentId: string | null,
 *   createdAt: Timestamp
 * }
 *
 * Path:
 * posts/{postId}/comments/{commentId}
 */

export const commentsService = {
  commentsCol(postId: string) {
    return collection(db, "posts", postId, "comments");
  },

  /**
   * Subscribe to comments in real-time.
   * Nested comments ONLY (safe + rules-compliant)
   */
  subscribeToComments(postId: string, cb: (comments: any[]) => void) {
    if (!postId) return () => {};

    const q = query(this.commentsCol(postId), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // latest comment first (matches your UI)
        cb(list.reverse());
      },
      (err) => {
        console.warn("commentsService.subscribeToComments error", err);
        cb([]);
      }
    );

    return unsubscribe;
  },

  /** Add a comment or reply */
  async addComment({
    postId,
    userId,
    name,
    role,
    profileImage,
    text,
    parentId = null,
  }: {
    postId: string;
    userId: string;
    name: string;
    role?: string;
    profileImage?: string | null;
    text: string;
    parentId?: string | null;
  }) {
    const postRef = doc(db, "posts", postId);
    const commentsCol = this.commentsCol(postId);

    await runTransaction(db, async (tx) => {
      const postSnap = await tx.get(postRef);
      if (!postSnap.exists()) {
        throw new Error("Post does not exist");
      }

      const commentRef = doc(commentsCol);
      tx.set(commentRef, {
        userId,
        name,
        role: role ?? "user",
        profileImage: profileImage ?? null,
        text,
        parentId,
        createdAt: serverTimestamp(),
      });

      tx.update(postRef, {
        commentCount: increment(1),
        updatedAt: serverTimestamp(),
      });
    });
  },

  /** Delete comment */
  async deleteComment(postId: string, commentId: string) {
    const postRef = doc(db, "posts", postId);
    const commentRef = doc(db, "posts", postId, "comments", commentId);

    await runTransaction(db, async (tx) => {
      const postSnap = await tx.get(postRef);
      if (!postSnap.exists()) return;

      tx.delete(commentRef);
      tx.update(postRef, {
        commentCount: increment(-1),
        updatedAt: serverTimestamp(),
      });
    });
  },

  /** One-time fetch (optional utility) */
  async getCommentsOnce(postId: string) {
    const q = query(this.commentsCol(postId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  },
};
