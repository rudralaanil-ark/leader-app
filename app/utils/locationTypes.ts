// app/utils/locationTypes.ts

export type LocationRow = {
  // Only for district
  code?: string;

  // Common for all levels
  name: string;

  // File validation helpers
  duplicate?: boolean;
  exists?: boolean;

  // Admin decision
  action?: "skip" | "overwrite";

  // Where this row came from
  source: "manual" | "file";
};
