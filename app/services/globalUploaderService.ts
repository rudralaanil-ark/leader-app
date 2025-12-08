// app/services/globalUploaderService.ts
import { db } from "@/configs/FirebaseConfig";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Unsubscribe,
} from "firebase/firestore";

export type GlobalUploader = {
  name: string;
  profileImage: string | null;
};

const GLOBAL_DOC = doc(db, "app_settings", "globalUploader");

const normalize = (data: any): GlobalUploader => {
  const raw = data?.profileImage;
  const profileImage = typeof raw === "string" && raw.length > 0 ? raw : null;

  return {
    name: data?.name || "Admin",
    profileImage,
  };
};

export const globalUploaderService = {
  /** Get once */
  async get(): Promise<GlobalUploader> {
    const snap = await getDoc(GLOBAL_DOC);
    if (snap.exists()) {
      return normalize(snap.data());
    }
    // create default
    const defaultData: GlobalUploader = { name: "Admin", profileImage: null };
    await setDoc(GLOBAL_DOC, defaultData, { merge: true });
    return defaultData;
  },

  /** Subscribe to live changes */
  subscribe(callback: (val: GlobalUploader) => void): Unsubscribe {
    return onSnapshot(GLOBAL_DOC, (snap) => {
      if (snap.exists()) {
        callback(normalize(snap.data()));
      } else {
        callback({ name: "Admin", profileImage: null });
      }
    });
  },

  /** Admin update */
  async update(data: Partial<GlobalUploader>): Promise<void> {
    await setDoc(GLOBAL_DOC, data, { merge: true });
  },
};
