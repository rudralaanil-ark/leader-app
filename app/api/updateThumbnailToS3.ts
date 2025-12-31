// app/api/updateThumbnailToS3.ts
import * as FileSystem from "expo-file-system/legacy";

const BASE_SERVER_URL = process.env.EXPO_PUBLIC_BACKEND_URL!;

export async function updateThumbnailToS3(params: {
  localUri: string;
  userId: string;
  postId: string;
}) {
  const { localUri, userId, postId } = params;

  // 🔁 SAME KEY → overwrite thumbnail
  const key = `thumbnails/${userId}/${postId}.jpg`;

  const presignRes = await fetch(
    `${BASE_SERVER_URL}/api/media/presign?fileName=${encodeURIComponent(key)}`,
    { method: "POST" }
  );

  if (!presignRes.ok) {
    throw new Error("Failed to get thumbnail presigned URL");
  }

  const { uploadUrl, fileUrl } = await presignRes.json();

  const uploadRes = await FileSystem.uploadAsync(uploadUrl, localUri, {
    httpMethod: "PUT",
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
  });

  if (uploadRes.status !== 200) {
    throw new Error("Thumbnail upload failed");
  }

  return {
    thumbnailUrl: fileUrl,
  };
}
