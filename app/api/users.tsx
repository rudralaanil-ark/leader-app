// // app/api/users.tsx
// import { db } from "@/configs/FirebaseConfig";
// import { UserType } from "@/contexts/AuthContext";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { ToastAndroid } from "react-native";

// /**
//  * Create a new user document in Firestore
//  * 🟢 Updated to include role and createdBy fields
//  */
// export const createUserInFirestore = async (
//   uid: string,
//   fullName: string,
//   email: string,
//   profileImage?: string | null,
//   role: "user" | "monitor" | "admin" = "user", // 🟢 Added role param
//   createdBy: string | null = null // 🟢 Added createdBy param
// ) => {
//   await setDoc(doc(db, "users", uid), {
//     uid,
//     fullName,
//     email,
//     profileImage: profileImage || "",
//     role, // 🟢 Added
//     createdBy, // 🟢 Added
//     createdAt: new Date(),
//   });
// };

// /**
//  * Fetch user data from Firestore using user UID
//  * 🟢 Updated to return role and createdBy
//  */
// export const fetchUserData = async (uid: string): Promise<UserType | null> => {
//   try {
//     const docRef = doc(db, "users", uid);
//     const userDoc = await getDoc(docRef);

//     if (userDoc.exists()) {
//       const data = userDoc.data();
//       const userData: UserType = {
//         uid,
//         fullName: data.fullName,
//         email: data.email,
//         // profileImage: data.profileImage || undefined,
//         profileImage:
//           typeof data.profileImage === "string" &&
//           data.profileImage.trim().length > 0
//             ? data.profileImage
//             : undefined,

//         role: data.role || "user",
//         createdAt: data.createdAt || null,
//         createdBy: data.createdBy || null,
//       };

//       console.log("✅ User data:", userData);
//       return userData;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("❌ Error fetching user data:", error);
//     ToastAndroid.show("Failed to fetch user data", ToastAndroid.BOTTOM);
//     return null;
//   }
// };

// // app/api/users.tsx
// import { db } from "@/configs/FirebaseConfig";
// import { UserType } from "@/contexts/AuthContext";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { ToastAndroid } from "react-native";

// /**
//  * Create a new user document in Firestore
//  * 🟢 Updated to include role and createdBy fields
//  */
// export const createUserInFirestore = async (
//   uid: string,
//   fullName: string,
//   email: string,
//   profileImage?: string | null,
//   role: "user" | "monitor" | "admin" = "user", // 🟢 Added role param
//   createdBy: string | null = null // 🟢 Added createdBy param
// ) => {
//   await setDoc(doc(db, "users", uid), {
//     uid,
//     fullName,
//     email,
//     profileImage: profileImage || null,
//     role, // 🟢 Added
//     createdBy, // 🟢 Added
//     createdAt: new Date(),
//   });
// };

// /**
//  * Fetch user data from Firestore using user UID
//  * 🟢 Updated to return role and createdBy
//  */
// export const fetchUserData = async (uid: string): Promise<UserType | null> => {
//   try {
//     const docRef = doc(db, "users", uid);
//     const userDoc = await getDoc(docRef);

//     if (userDoc.exists()) {
//       const data = userDoc.data();
//       const userData: UserType = {
//         uid,
//         fullName: data.fullName,
//         email: data.email,
//         profileImage: data.profileImage || undefined,
//         role: data.role || "user",
//         createdAt: data.createdAt || null,
//         createdBy: data.createdBy || null,
//       };

//       console.log("✅ User data:", userData);
//       return userData;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("❌ Error fetching user data:", error);
//     ToastAndroid.show("Failed to fetch user data", ToastAndroid.BOTTOM);
//     return null;
//   }
// };

// app/api/users.tsx
import { db } from "@/configs/FirebaseConfig";
import { UserType } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ToastAndroid } from "react-native";

/**
 * Create a new user document in Firestore
 * - profileImage is stored AS-IS (string | object | null)
 * - Firestore structure remains unchanged
 */
export const createUserInFirestore = async (
  uid: string,
  fullName: string,
  email: string,
  profileImage?: string | null,
  role: "user" | "monitor" | "admin" = "user",
  createdBy: string | null = null
) => {
  try {
    await setDoc(doc(db, "users", uid), {
      uid,
      fullName,
      email,
      profileImage: profileImage ?? null, // ✅ keep null / object / string
      role,
      createdBy,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    ToastAndroid.show("Failed to create user profile", ToastAndroid.BOTTOM);
    throw error;
  }
};

/**
 * Fetch user data from Firestore using UID
 * - Returns raw profileImage (string | object | null)
 * - UI layer will normalize it safely
 */
export const fetchUserData = async (uid: string): Promise<UserType | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const userDoc = await getDoc(docRef);

    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();

    const userData: UserType = {
      uid,
      fullName: data.fullName,
      email: data.email,

      // ✅ DO NOT normalize here
      // Can be string | object | null
      profileImage: data.profileImage ?? undefined,

      role: data.role || "user",
      createdAt: data.createdAt || null,
      createdBy: data.createdBy || null,
    };

    console.log("✅ User data:", userData);
    return userData;
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    ToastAndroid.show("Failed to fetch user data", ToastAndroid.BOTTOM);
    return null;
  }
};
