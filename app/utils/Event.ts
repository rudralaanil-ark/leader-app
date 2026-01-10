// app/utils/Event.ts
import { Timestamp } from "firebase/firestore";

export type EventType = {
  id?: string;
  title: string;
  description: string;
  venue: string;
  imageUrl?: string | null;
  dateTime: Timestamp;

  createdBy: string;
  createdByName: string;
  role?: "admin" | "monitor";

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
