export type ProfileImageValue =
  | string
  | null
  | undefined
  | {
      url?: string;
      publicId?: string;
    };

export const getProfileImageUrl = (
  value: ProfileImageValue
): string | undefined => {
  // string URL
  if (typeof value === "string") {
    return value.trim().startsWith("http") ? value : undefined;
  }

  // object (Cloudinary)
  if (typeof value === "object" && value?.url) {
    return value.url.startsWith("http") ? value.url : undefined;
  }

  return undefined;
};
