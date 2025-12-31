import { db } from "@/configs/FirebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

export type SurveyInput = {
  forSelf: boolean;
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
};

const surveysCol = collection(db, "surveys");

async function submitSurvey(userId: string, data: SurveyInput) {
  await addDoc(surveysCol, {
    submittedBy: userId,
    ...data,
    createdAt: serverTimestamp(),
  });
}

async function getUserSurveys(userId: string) {
  const q = query(
    surveysCol,
    where("submittedBy", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export const surveyService = {
  submitSurvey,
  getUserSurveys,
};
