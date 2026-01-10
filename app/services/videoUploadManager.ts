// app/services/videoUploadManager.ts

/* ================= TYPES ================= */

export type UploadStatus =
  | "compressing"
  | "uploading"
  | "saving"
  | "done"
  | "error"
  | "cancelled";

export type UploadItem = {
  postId: string;
  progress: number; // 0 → 100
  status: UploadStatus;
  uploadTask?: any; // UploadTask from expo-file-system
  error?: string;
};

type Listener = (items: UploadItem[]) => void;

/* ================= MANAGER ================= */

class VideoUploadManager {
  private uploads = new Map<string, UploadItem>();
  private listeners = new Set<Listener>();

  /* ---------- SUBSCRIBE ---------- */

  subscribe(listener: Listener) {
    this.listeners.add(listener);

    // send current state immediately
    listener(Array.from(this.uploads.values()));

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const list = Array.from(this.uploads.values());
    this.listeners.forEach((l) => l(list));
  }

  /* ---------- START ---------- */

  start(postId: string) {
    this.uploads.set(postId, {
      postId,
      progress: 0,
      status: "compressing",
    });
    this.notify();
  }

  /* ---------- PROGRESS ---------- */

  setProgress(postId: string, progress: number) {
    const item = this.uploads.get(postId);
    if (!item) return;

    item.progress = Math.min(Math.max(progress, 0), 100);
    this.notify();
  }

  /* ---------- STATUS ---------- */

  setStatus(postId: string, status: UploadStatus) {
    const item = this.uploads.get(postId);
    if (!item) return;

    item.status = status;
    this.notify();
  }

  /* ---------- STORE UPLOAD TASK (FOR CANCEL) ---------- */

  setUploadTask(postId: string, uploadTask: any) {
    const item = this.uploads.get(postId);
    if (!item) return;

    item.uploadTask = uploadTask;
    this.notify();
  }

  /* ---------- ERROR ---------- */

  fail(postId: string, error: string) {
    const item = this.uploads.get(postId);
    if (!item) return;

    item.status = "error";
    item.error = error;
    this.notify();
  }

  /* ---------- COMPLETE ---------- */

  complete(postId: string) {
    const item = this.uploads.get(postId);
    if (!item) return;

    item.progress = 100;
    item.status = "done";
    this.notify();

    // auto cleanup after 5 seconds
    setTimeout(() => {
      this.uploads.delete(postId);
      this.notify();
    }, 5000);
  }

  /* ---------- CANCEL ---------- */

  async cancel(postId: string) {
    const item = this.uploads.get(postId);
    if (!item?.uploadTask) return;

    try {
      await item.uploadTask.cancelAsync();
    } catch (e) {
      console.warn("Upload cancel failed:", e);
    }

    item.status = "cancelled";
    this.notify();
  }
}

/* ================= EXPORT SINGLETON ================= */

export const videoUploadManager = new VideoUploadManager();
