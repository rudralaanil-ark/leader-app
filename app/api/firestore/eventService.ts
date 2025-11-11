// app/api/firestore/eventService.ts
import { db } from "@/configs/FirebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";

// 🔹 Add a new event
export const addEvent = async (eventData: any) => {
  const eventRef = await addDoc(collection(db, "events"), {
    ...eventData,
    createdAt: Timestamp.now(),
  });
  return eventRef.id;
};

// 🔹 Get all events
export const getAllEvents = async () => {
  const snapshot = await getDocs(collection(db, "events"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 🔹 Get single event by ID
export const getEventById = async (id: string) => {
  const eventDoc = await getDoc(doc(db, "events", id));
  if (!eventDoc.exists()) return null;
  return { id: eventDoc.id, ...eventDoc.data() };
};

// 🔹 Update event
export const updateEvent = async (id: string, updatedData: any) => {
  await updateDoc(doc(db, "events", id), updatedData);
};

// 🔹 Delete event
export const deleteEvent = async (id: string) => {
  await deleteDoc(doc(db, "events", id));
};
