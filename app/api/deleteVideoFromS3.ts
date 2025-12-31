// app/api/deleteVideoFromS3.ts
const BASE_SERVER_URL = "https://leader-app-backend-production.up.railway.app";

export async function deleteVideoFromS3(key: string) {
  const res = await fetch(`${BASE_SERVER_URL}/api/media/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });

  const json = await res.json();
  if (!json.ok) {
    throw new Error(json.error || "Failed to delete video from S3");
  }
}
