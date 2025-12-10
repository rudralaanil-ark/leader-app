import { CLOUDINARY } from "@/configs/CloudinaryConfig";

export const uploadVideoToCloudinary = async (uri: string): Promise<string> => {
  const form = new FormData();
  form.append("file", {
    uri,
    type: "video/mp4",
    name: `video-${Date.now()}.mp4`,
  } as any);

  form.append("upload_preset", CLOUDINARY.GALLERY_PRESET);

  const res = await fetch(
    `${CLOUDINARY.API_URL}/${CLOUDINARY.CLOUD_NAME}/video/upload`,
    { method: "POST", body: form }
  );

  const json = await res.json();
  return json.secure_url;
};
