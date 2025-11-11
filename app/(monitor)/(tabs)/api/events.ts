import { db } from "@/configs/FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const eventRef = collection(db, "events");

/** 🆕 Create a new event */
export const createEvent = async (data: any) => {
  const docRef = await addDoc(eventRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/** ✏️ Update an existing event */
export const updateEvent = async (id: string, data: any) => {
  const docRef = doc(db, "events", id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

/** ❌ Delete event */
export const deleteEvent = async (id: string) => {
  const docRef = doc(db, "events", id);
  await deleteDoc(docRef);
};

/** 🔍 Get single event details */
export const getEvent = async (id: string) => {
  const docRef = doc(db, "events", id);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/** 👂 Listen to all events in real-time */
export const listenToEvents = (callback: (events: any[]) => void) => {
  const q = query(
    eventRef,
    orderBy("createdAt", "desc"),
    orderBy("dateTime", "desc")
  );
  return onSnapshot(q, (snap) => {
    const events = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(events);
  });
};

/** ❤️ Mark or unmark user as Interested */

export const markInterested = async (eventId: string, user: any) => {
  try {
    // Use uid or id to identify the user uniquely
    const userRef = doc(
      db,
      "events",
      eventId,
      "interested",
      user.uid || user.id
    );
    const existing = await getDoc(userRef);

    if (existing.exists()) {
      // ✅ Remove interest if already marked
      await deleteDoc(userRef);
      return { status: "removed" };
    } else {
      // ✅ Fetch user data from Firestore to ensure correct info
      const userDocRef = doc(db, "users", user.uid || user.id);
      const userSnap = await getDoc(userDocRef);
      const userData = userSnap.exists() ? userSnap.data() : {};

      // ✅ Properly pull values from user document
      const finalName =
        userData.fullName ||
        user.fullName ||
        userData.name ||
        user.name ||
        userData.displayName ||
        user.displayName ||
        "User";

      const finalImage = userData.profileImage || user.profileImage || null;

      await setDoc(userRef, {
        name: finalName,
        email: userData.email || user.email || "",
        phone: userData.phone || user.phone || "",
        profileImage: finalImage,
        timestamp: serverTimestamp(),
      });

      return { status: "added" };
    }
  } catch (err) {
    console.error("markInterested error:", err);
    throw err;
  }
};

// export const markInterested = async (eventId: string, user: any) => {
//   try {
//     // Use both uid and id for safety
//     const userRef = doc(
//       db,
//       "events",
//       eventId,
//       "interested",
//       user.uid || user.id
//     );
//     const existing = await getDoc(userRef);

//     if (existing.exists()) {
//       // ✅ User already marked — remove
//       await deleteDoc(userRef);
//       return { status: "removed" };
//     } else {
//       // ✅ Add new interested record with correct name field
//       const finalName =
//         user.fullName || // 🔥 Firestore field
//         user.name || // old schema
//         user.displayName || // Firebase Auth display name
//         "User";

//       await setDoc(userRef, {
//         name: finalName,
//         email: user.email || "",
//         phone: user.phone || "",
//         timestamp: serverTimestamp(),
//       });

//       return { status: "added" };
//     }
//   } catch (err) {
//     console.error("markInterested error:", err);
//     throw err;
//   }
// };

/** 👥 Get list of interested users for a specific event */
export const getInterestedUsers = async (eventId: string) => {
  const subColRef = collection(db, "events", eventId, "interested");
  const snap = await getDocs(subColRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/** 🔢 Listen for changes in interested users count */
export const listenInterestedCount = (
  eventId: string,
  callback: (count: number) => void
) => {
  const subColRef = collection(db, "events", eventId, "interested");
  return onSnapshot(subColRef, (snap) => callback(snap.size));
};
