// app/services/videoCacheService.ts
import * as FileSystem from "expo-file-system/legacy";

const VIDEO_DIR = FileSystem.documentDirectory + "video-cache/";
const META_FILE = VIDEO_DIR + "meta.json";

/** 🔒 HARD LIMIT (safe for low-end devices) */
const MAX_CACHE_MB = 150;

/* ================= HELPERS ================= */

async function ensureDir() {
  const dir = await FileSystem.getInfoAsync(VIDEO_DIR);
  if (!dir.exists) {
    await FileSystem.makeDirectoryAsync(VIDEO_DIR, {
      intermediates: true,
    });
  }
}

async function loadMeta(): Promise<Record<string, number>> {
  const info = await FileSystem.getInfoAsync(META_FILE);
  if (!info.exists) return {};
  const raw = await FileSystem.readAsStringAsync(META_FILE);
  return JSON.parse(raw);
}

async function saveMeta(meta: Record<string, number>) {
  await FileSystem.writeAsStringAsync(META_FILE, JSON.stringify(meta));
}

async function getCacheSizeMB() {
  const files = await FileSystem.readDirectoryAsync(VIDEO_DIR);
  let total = 0;

  for (const f of files) {
    if (!f.endsWith(".mp4")) continue;
    const info = await FileSystem.getInfoAsync(VIDEO_DIR + f, { size: true });
    total += info.size ?? 0;
  }

  return total / (1024 * 1024);
}

async function cleanupLRU(meta: Record<string, number>) {
  let sizeMB = await getCacheSizeMB();
  if (sizeMB <= MAX_CACHE_MB) return;

  // Oldest first
  const entries = Object.entries(meta).sort((a, b) => a[1] - b[1]);

  for (const [postId] of entries) {
    const path = `${VIDEO_DIR}${postId}.mp4`;
    await FileSystem.deleteAsync(path, { idempotent: true });
    delete meta[postId];

    sizeMB = await getCacheSizeMB();
    if (sizeMB <= MAX_CACHE_MB) break;
  }

  await saveMeta(meta);
}

/* ================= PUBLIC API ================= */

export const videoCacheService = {
  async getCachedVideo(postId: string, remoteUrl: string) {
    await ensureDir();

    const localPath = `${VIDEO_DIR}${postId}.mp4`;
    const tempPath = `${localPath}.tmp`;

    const meta = await loadMeta();
    const file = await FileSystem.getInfoAsync(localPath);

    // 🟢 CACHE HIT
    if (file.exists) {
      console.log("🟢 CACHE HIT:", postId);
      meta[postId] = Date.now();
      await saveMeta(meta);
      return localPath;
    }

    console.log("🔴 CACHE MISS → downloading:", postId);

    // ⬇️ ATOMIC DOWNLOAD (prevents corruption)
    await FileSystem.downloadAsync(remoteUrl, tempPath);
    await FileSystem.moveAsync({ from: tempPath, to: localPath });

    meta[postId] = Date.now();
    await cleanupLRU(meta);

    return localPath;
  },

  /** OPTIONAL: manual cleanup */
  async clearAll() {
    await FileSystem.deleteAsync(VIDEO_DIR, { idempotent: true });
  },
};
