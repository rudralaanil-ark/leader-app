import { db } from "@/configs/FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";

// ✅ Fetch monitors created by this admin
export const fetchMonitorsByAdmin = async (adminUid: string) => {
  const q = query(
    collection(db, "users"),
    where("role", "==", "monitor"),
    where("createdBy", "==", adminUid),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ✅ Update monitor email or status
export const updateMonitorDetails = async (
  uid: string,
  updates: Partial<{ email: string; status: string }>
) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates);
};

// ✅ Reset password (admin controlled)
export const resetMonitorPassword = async (auth: any, email: string) => {
  await auth.sendPasswordResetEmail(email);
};
