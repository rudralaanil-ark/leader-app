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

export const createEvent = async (data: any) => {
  const docRef = await addDoc(eventRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateEvent = async (id: string, data: any) => {
  const docRef = doc(db, "events", id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteEvent = async (id: string) => {
  const docRef = doc(db, "events", id);
  await deleteDoc(docRef);
};

export const getEvent = async (id: string) => {
  const docRef = doc(db, "events", id);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

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

// Mark user as interested

export const markInterested = async (eventId: string, user: any) => {
  try {
    const userRef = doc(db, "events", eventId, "interested", user.id);
    const existing = await getDoc(userRef);

    if (existing.exists()) {
      await deleteDoc(userRef);
      return { status: "removed" }; // ✅ consistent return
    } else {
      await setDoc(userRef, {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        timestamp: serverTimestamp(),
      });
      return { status: "added" }; // ✅ consistent return
    }
  } catch (err) {
    console.error("markInterested error:", err);
    throw err;
  }
};

// Get list of interested users for a specific event
export const getInterestedUsers = async (eventId: string) => {
  const subColRef = collection(db, "events", eventId, "interested");
  const snap = await getDocs(subColRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Listen for changes in interested users count
export const listenInterestedCount = (
  eventId: string,
  callback: (count: number) => void
) => {
  const subColRef = collection(db, "events", eventId, "interested");
  return onSnapshot(subColRef, (snap) => callback(snap.size));
};
