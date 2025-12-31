// import * as FileSystem from "expo-file-system";

// const BASE_SERVER_URL = "https://leader-app-backend-production.up.railway.app";

// export type S3UploadResult = {
//   videoUrl: string;
//   key: string;
// };

// export async function uploadVideoToS3(params: {
//   localUri: string;
//   userId: string;
//   postId: string;
//   onProgress?: (p: number) => void;
// }): Promise<S3UploadResult> {
//   const { localUri, userId, postId, onProgress } = params;

//   // 1️⃣ Build S3 key
//   const key = `videos/${userId}/${postId}.mp4`;

//   // 2️⃣ Get presigned URL
//   const presignRes = await fetch(
//     `${BASE_SERVER_URL}/api/media/presign?fileName=${encodeURIComponent(
//       key
//     )}&contentType=video/mp4`,
//     { method: "POST" }
//   );

//   if (!presignRes.ok) {
//     throw new Error("Failed to get presigned URL");
//   }

//   const { uploadUrl, fileUrl } = await presignRes.json();

//   // 3️⃣ Upload to S3 (Expo compatible)
//   const uploadRes = await FileSystem.uploadAsync(uploadUrl, localUri, {
//     httpMethod: "PUT",
//     headers: {
//       "Content-Type": "video/mp4",
//     },
//   });

//   if (uploadRes.status !== 200) {
//     throw new Error("S3 upload failed");
//   }

//   onProgress?.(1);

//   return {
//     videoUrl: fileUrl,
//     key,
//   };
// }

// app/api/uploadVideoToS3.ts
// app/api/uploadVideoToS3.ts

// app/api/uploadVideoToS3.ts

const BASE_SERVER_URL = "https://leader-app-backend-production.up.railway.app";

async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return await response.blob();
}

export async function uploadVideoToS3(params: {
  localUri: string;
  userId: string;
  postId: string;
}) {
  const { localUri, userId, postId } = params;

  const key = `videos/${userId}/${postId}.mp4`;

  // 1️⃣ Get presigned URL
  const presignRes = await fetch(
    `${BASE_SERVER_URL}/api/media/presign?fileName=${encodeURIComponent(key)}`,
    { method: "POST" }
  );

  if (!presignRes.ok) {
    throw new Error("Failed to get presigned URL");
  }

  const { uploadUrl, fileUrl } = await presignRes.json();

  // 2️⃣ Convert file → Blob
  const videoBlob = await uriToBlob(localUri);

  // 3️⃣ Upload using PUT (AWS recommended)
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    body: videoBlob,
  });

  if (!uploadRes.ok) {
    throw new Error("S3 upload failed");
  }

  return {
    videoUrl: fileUrl,
    key,
  };
}
