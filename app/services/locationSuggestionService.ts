import { db } from "@/configs/FirebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

/* ===================== TYPES ===================== */

export type LocationSuggestionType =
  | "district"
  | "constituency"
  | "mandal"
  | "village";

export type LocationSuggestionContext = {
  districtCode?: string;
  constituency?: string;
  mandal?: string;
};

export type LocationSuggestion = {
  id?: string;
  type: LocationSuggestionType;
  districtCode?: string;
  constituency?: string;
  mandal?: string;
  value: string;
  normalized: string;
  usageCount: number;
  verified: boolean;
  createdAt: any;
};

/* ===================== HELPERS ===================== */

export function normalize(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

/* ===================== SEARCH ===================== */

export async function searchSuggestions(
  type: LocationSuggestionType,
  ctx: LocationSuggestionContext,
  searchText?: string
): Promise<LocationSuggestion[]> {
  let q = query(
    collection(db, "location_suggestions"),
    where("type", "==", type)
  );

  if (type !== "district") {
    if (!ctx.districtCode) return [];
    q = query(q, where("districtCode", "==", ctx.districtCode));
  }

  if (type === "mandal" || type === "village") {
    if (!ctx.constituency) return [];
    q = query(q, where("constituency", "==", ctx.constituency));
  }

  if (type === "village") {
    if (!ctx.mandal) return [];
    q = query(q, where("mandal", "==", ctx.mandal));
  }

  const snap = await getDocs(q);
  const normSearch = searchText ? normalize(searchText) : "";

  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as LocationSuggestion) }))
    .filter((i) => (normSearch ? i.normalized.includes(normSearch) : true))
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 10); // 🔥 LIMIT FOR SPEED
}

/* ===================== ADD / INCREMENT ===================== */

export async function addOrIncrementSuggestion(
  type: LocationSuggestionType,
  ctx: LocationSuggestionContext,
  value: string
) {
  const normalizedValue = normalize(value);

  let q = query(
    collection(db, "location_suggestions"),
    where("type", "==", type),
    where("normalized", "==", normalizedValue)
  );

  if (type !== "district") {
    q = query(q, where("districtCode", "==", ctx.districtCode));
  }

  if (type === "mandal" || type === "village") {
    q = query(q, where("constituency", "==", ctx.constituency));
  }

  if (type === "village") {
    q = query(q, where("mandal", "==", ctx.mandal));
  }

  const snap = await getDocs(q);

  if (!snap.empty) {
    await updateDoc(snap.docs[0].ref, {
      usageCount: increment(1),
    });
    return;
  }

  await addDoc(collection(db, "location_suggestions"), {
    type,
    districtCode: ctx.districtCode || null,
    constituency: ctx.constituency || null,
    mandal: ctx.mandal || null,
    value: value.trim(),
    normalized: normalizedValue,
    usageCount: 1,
    verified: false,
    createdAt: serverTimestamp(),
  });
}

export const locationSuggestionService = {
  searchSuggestions,
  addOrIncrementSuggestion,
};
