// import { db } from "@/configs/FirebaseConfig";
// import {
//   collection,
//   doc,
//   getDocs,
//   orderBy,
//   query,
//   updateDoc,
// } from "firebase/firestore";

// const surveysCol = collection(db, "surveys");

// async function getAllSurveys() {
//   const q = query(surveysCol, orderBy("createdAt", "desc"));
//   const snap = await getDocs(q);
//   return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
// }

// async function updateSurvey(
//   surveyId: string,
//   data: Partial<{
//     person: {
//       name: string;
//       phone: string;
//     };
//     location: {
//       districtCode: string;
//       constituency: string;
//       mandal?: string;
//       village?: string;
//     };
//   }>
// ) {
//   const ref = doc(db, "surveys", surveyId);
//   await updateDoc(ref, data as any);
// }

// export const adminSurveyService = {
//   getAllSurveys,
//   updateSurvey,
// };

import { db } from "@/configs/FirebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

const surveysCol = collection(db, "surveys");

/* ================= GET ================= */

async function getAllSurveys() {
  const q = query(surveysCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ================= UPDATE ================= */

async function updateSurvey(
  surveyId: string,
  data: Partial<{
    person: {
      name: string;
      phone: string;
    };
    location: {
      districtCode: string;
      constituency: string;
      mandal?: string;
      village?: string;
    };
  }>
) {
  const ref = doc(db, "surveys", surveyId);
  await updateDoc(ref, data as any);
}

/* ================= DELETE (✅ ADD THIS) ================= */

async function deleteSurvey(surveyId: string) {
  if (!surveyId) {
    throw new Error("Survey ID is required");
  }

  const ref = doc(db, "surveys", surveyId);
  await deleteDoc(ref);
}

/* ================= EXPORT ================= */

export const adminSurveyService = {
  getAllSurveys,
  updateSurvey,
  deleteSurvey, // ✅ EXPORT THIS
};
