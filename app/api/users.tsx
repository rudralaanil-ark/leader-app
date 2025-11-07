import { db } from "@/configs/FirebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ToastAndroid } from "react-native";

/**
 * Create a new user document in Firestore
 */
export const createUserInFirestore = async (
  uid: string,
  fullName: string,
  email: string,
  profileImage?: string | null
) => {
  await setDoc(doc(db, "users", uid), {
    fullName,
    email,
    profileImage: profileImage || null,
    createdAt: new Date(),
  });
};

export default createUserInFirestore;

/**
 * Fetch user data from Firestore using user UID
 */
export const fetchUserData = async (uid: string) => {
  try {
    const docRef = doc(db, "users", uid);
    const userDoc = await getDoc(docRef);

    if (userDoc.exists()) {
      console.log("✅ User data:", userDoc.data());
      return userDoc.data();
    } else {
      ToastAndroid.show("User not found in database", ToastAndroid.BOTTOM);
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    ToastAndroid.show("Failed to fetch user data", ToastAndroid.BOTTOM);
    return null;
  }
};
