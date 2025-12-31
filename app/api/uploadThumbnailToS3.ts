// app/api/uploadThumbnailToS3.ts
import * as FileSystem from "expo-file-system/legacy";

const BASE_SERVER_URL = process.env.EXPO_PUBLIC_BACKEND_URL!;

export async function uploadThumbnailToS3(params: {
  localUri: string;
  userId: string;
  postId: string;
}) {
  const { localUri, userId, postId } = params;

  const key = `thumbnails/${userId}/${postId}.jpg`;

  // 1️⃣ Get presigned URL
  const presignRes = await fetch(
    `${BASE_SERVER_URL}/api/media/presign?fileName=${encodeURIComponent(key)}`,
    { method: "POST" }
  );

  if (!presignRes.ok) {
    throw new Error("Failed to get thumbnail presigned URL");
  }

  const { uploadUrl, fileUrl } = await presignRes.json();

  // 2️⃣ Upload thumbnail
  const uploadRes = await FileSystem.uploadAsync(uploadUrl, localUri, {
    httpMethod: "PUT",
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
  });

  if (uploadRes.status !== 200) {
    throw new Error("Thumbnail upload failed");
  }

  return {
    thumbnailUrl: fileUrl,
    s3Key: key,
  };
}
