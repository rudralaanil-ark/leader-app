import { db } from "@/configs/FirebaseConfig";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

const surveysCol = collection(db, "surveys");

async function getAllSurveys() {
  const q = query(surveysCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

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

export const adminSurveyService = {
  getAllSurveys,
  updateSurvey,
};
