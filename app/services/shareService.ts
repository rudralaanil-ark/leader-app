// // app/services/ShareService.ts
// import { db } from "@/configs/FirebaseConfig";
// import {
//   addDoc,
//   collection,
//   doc,
//   increment,
//   runTransaction,
//   serverTimestamp,
// } from "firebase/firestore";
// import { Platform, Share } from "react-native";

// type SharePostParams = {
//   postId: string;
//   type: "image" | "video";
//   text?: string;
//   user: {
//     uid: string;
//     fullName: string;
//     profileImage?: string | null;
//     role?: string;
//   };
// };

// export const shareService = {
//   async sharePost({ postId, type, text, user }: SharePostParams) {
//     try {
//       // ✅ Correct HTTPS link
//       const webLink =
//         type === "video"
//           ? `https://leaderapp.link/video/${postId}`
//           : `https://leaderapp.link/post/${postId}`;

//       const defaultText =
//         type === "video" ? "Watch this video" : "Check out this post";

//       const result = await Share.share({
//         message: `${text ?? defaultText}\n\n${webLink}`,
//       });

//       if (result.action === Share.sharedAction) {
//         const postRef = doc(db, "posts", postId);
//         const sharesCol = collection(db, "posts", postId, "shares");

//         await runTransaction(db, async (tx) => {
//           // 1️⃣ increment count
//           tx.update(postRef, {
//             shareCount: increment(1),
//             updatedAt: serverTimestamp(),
//           });
//         });

//         // 2️⃣ store shared user info
//         await addDoc(sharesCol, {
//           userId: user.uid,
//           name: user.fullName,
//           profileImage: user.profileImage ?? null,
//           role: user.role ?? "user",
//           platform: Platform.OS,
//           createdAt: serverTimestamp(),
//         });
//       }
//     } catch (e) {
//       console.warn("Share failed", e);
//     }
//   },
// };

// app/services/shareService.ts
import { db } from "@/configs/FirebaseConfig";
import {
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { Platform, Share } from "react-native";

const POSTS = "posts";

export const shareService = {
  sharesCol(postId: string) {
    return collection(db, POSTS, postId, "shares");
  },

  /** Share a post and store user details (one share per user) */
  async addShare({
    postId,
    type,
    text,
    user,
  }: {
    postId: string;
    type: "image" | "video";
    text?: string;
    user: {
      uid: string;
      fullName: string;
      profileImage?: string | null;
      role?: string;
    };
  }) {
    const link =
      type === "video"
        ? `https://leaderapp.link/video/${postId}`
        : `https://leaderapp.link/post/${postId}`;

    const message = `${text ?? "Check this out"}\n\n${link}`;

    const result = await Share.share({ message });
    if (result.action !== Share.sharedAction) return;

    const postRef = doc(db, POSTS, postId);
    const shareRef = doc(db, POSTS, postId, "shares", user.uid);

    await runTransaction(db, async (tx) => {
      const postSnap = await tx.get(postRef);
      if (!postSnap.exists()) throw new Error("Post does not exist");

      const shareSnap = await tx.get(shareRef);
      if (shareSnap.exists()) return; // ✅ already shared

      tx.set(shareRef, {
        userId: user.uid,
        name: user.fullName,
        profileImage: user.profileImage ?? null,
        role: user.role ?? "user",
        platform: Platform.OS,
        createdAt: serverTimestamp(),
      });

      tx.update(postRef, {
        shareCount: increment(1),
        updatedAt: serverTimestamp(),
      });
    });
  },

  /** Realtime shares list */
  subscribeToShares(postId: string, cb: (list: any[]) => void) {
    if (!postId) return () => {};

    const q = query(this.sharesCol(postId), orderBy("createdAt", "desc"));

    return onSnapshot(q, (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  },
};
