import { CLOUDINARY } from "@/configs/CloudinaryConfig";

export const uploadVideoToCloudinary = async (
  uri: string,
  trim?: { start: number; end: number }
): Promise<{ videoUrl: string; thumbnailUrl: string }> => {
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

  let videoUrl = json.secure_url;

  // ✅ Cloudinary trimming (optional)
  if (trim) {
    videoUrl = videoUrl.replace(
      "/upload/",
      `/upload/so_${trim.start},eo_${trim.end}/`
    );
  }

  const thumbnailUrl = videoUrl
    .replace("/upload/", "/upload/so_1/")
    .replace(".mp4", ".jpg");

  return { videoUrl, thumbnailUrl };
};
