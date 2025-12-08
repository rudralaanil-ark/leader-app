import { db } from "@/configs/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function getMonitorMap() {
  const snap = await getDocs(collection(db, "users"));

  const map: any = {};

  snap.forEach((doc) => {
    const data: any = doc.data();
    if (data.role === "monitor") {
      map[doc.id] = {
        fullName: data.fullName || "Unknown",
        profileImage: data.profileImage || null,
      };
    }
  });

  return map;
}
