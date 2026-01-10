// // app/services/leaderProfileService.ts
// import { db } from "@/configs/FirebaseConfig";
// import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

// /* ================= TYPES ================= */

// export type LeaderProfile = {
//   name: string;
//   title: string;
//   imageUrl: {
//     url: string;
//     publicId: string;
//   };
//   about: string;
//   achievements: string[];
//   contact: {
//     email: string;
//     phone: string;
//     address: string;
//   };
// };

// /* ================= CONST ================= */

// const COLLECTION = "leader_profile";
// const DOC_ID = "main";

// /* ================= SERVICE ================= */

// export const leaderProfileService = {
//   async getOnce(): Promise<LeaderProfile | null> {
//     const ref = doc(db, COLLECTION, DOC_ID);
//     const snap = await getDoc(ref);

//     if (!snap.exists()) {
//       console.warn("❗ leader_profile/main does not exist");
//       return null;
//     }

//     return snap.data() as LeaderProfile;
//   },

//   async save(data: LeaderProfile) {
//     const ref = doc(db, COLLECTION, DOC_ID);

//     await setDoc(
//       ref,
//       {
//         ...data,
//         updatedAt: serverTimestamp(),
//       },
//       { merge: true }
//     );
//   },
// };

// app/services/leaderProfileService.ts

import { db } from "@/configs/FirebaseConfig";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

/* ================= TYPES ================= */

export type LeaderProfile = {
  name: string;
  title: string;
  imageUrl: {
    url: string;
    publicId: string;
  };
  about: string;
  achievements: string[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
};

/* ================= CONST ================= */

const COLLECTION = "leader_profile";
const DOC_ID = "main";

/* ================= NORMALIZER ================= */
/**
 * 🔐 CRITICAL
 * Prevents crashes if Firestore data shape changes
 */
function normalize(data: any): LeaderProfile {
  return {
    name: data?.name ?? "",
    title: data?.title ?? "",

    imageUrl: {
      url: data?.imageUrl?.url ?? "",
      publicId: data?.imageUrl?.publicId ?? "",
    },

    about: data?.about ?? "",

    achievements: Array.isArray(data?.achievements)
      ? data.achievements.filter((a: any) => typeof a === "string")
      : [],

    contact: {
      email: data?.contact?.email ?? "",
      phone: data?.contact?.phone ?? "",
      address: data?.contact?.address ?? "",
    },
  };
}

/* ================= SERVICE ================= */

export const leaderProfileService = {
  /**
   * 🔹 Fetch profile once
   * Used by USER & ADMIN screens
   */
  async getOnce(): Promise<LeaderProfile | null> {
    const ref = doc(db, COLLECTION, DOC_ID);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.warn("❗ leader_profile/main does not exist");
      return null;
    }

    return normalize(snap.data());
  },

  /**
   * 🔹 Save / Update profile
   * Used by ADMIN only
   */
  async save(data: LeaderProfile) {
    const ref = doc(db, COLLECTION, DOC_ID);

    await setDoc(
      ref,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },
};
