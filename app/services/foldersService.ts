// // // app/services/foldersService.ts
// // import {
// //   collection,
// //   addDoc,
// //   doc,
// //   getDoc,
// //   getDocs,
// //   updateDoc,
// //   deleteDoc,
// //   serverTimestamp,
// //   orderBy,
// //   query,
// // } from "firebase/firestore";
// // import { db } from "@/configs/FirebaseConfig";
// // import { Folder, FolderImage } from "../utils/types";

// // const FOLDER_COLLECTION = "folders";

// // export const foldersService = {
// //   /** Create a folder */
// //   async createFolder(data: {
// //     name: string;
// //     description: string;
// //     createdById: string;
// //     createdByName: string;
// //     createdByRole: "admin" | "monitor";
// //   }) {
// //     const ref = await addDoc(collection(db, FOLDER_COLLECTION), {
// //       ...data,
// //       thumbnailUrl: null,
// //       numberOfImages: 0,
// //       createdAt: serverTimestamp(),
// //       updatedAt: serverTimestamp(),
// //     });

// //     return ref.id;
// //   },

// //   /** Upload image metadata inside folder */
// //   async addImageToFolder(folderId: string, img: Omit<FolderImage, "id">) {
// //     const ref = await addDoc(
// //       collection(db, `${FOLDER_COLLECTION}/${folderId}/images`),
// //       img
// //     );
// //     return ref.id;
// //   },

// //   /** Update folder thumbnail */
// //   async updateFolderThumbnail(folderId: string, url: string) {
// //     await updateDoc(doc(db, FOLDER_COLLECTION, folderId), {
// //       thumbnailUrl: url,
// //       updatedAt: serverTimestamp(),
// //     });
// //   },

// //   /** Generic folder update: update any folder fields */
// //   async updateFolder(folderId: string, data: Partial<Folder>) {
// //     await updateDoc(doc(db, FOLDER_COLLECTION, folderId), {
// //       ...data,
// //       updatedAt: serverTimestamp(),
// //     });
// //   },

// //   /** Increment numberOfImages */
// //   async incrementImageCount(folderId: string) {
// //     const folderRef = doc(db, FOLDER_COLLECTION, folderId);
// //     const snap = await getDoc(folderRef);
// //     const current = snap.data()?.numberOfImages ?? 0;
// //     await updateDoc(folderRef, {
// //       numberOfImages: current + 1,
// //       updatedAt: serverTimestamp(),
// //     });
// //   },

// //   /** Get all folders (admin/monitor/user all same) */
// //   async getAllFolders() {
// //     const q = query(
// //       collection(db, FOLDER_COLLECTION),
// //       orderBy("createdAt", "desc")
// //     );

// //     const snap = await getDocs(q);
// //     return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Folder[];
// //   },

// //   /** Get folder by ID */
// //   async getFolder(folderId: string) {
// //     const ref = doc(db, FOLDER_COLLECTION, folderId);
// //     const snap = await getDoc(ref);
// //     if (!snap.exists()) return null;
// //     return { id: snap.id, ...snap.data() } as Folder;
// //   },

// //   /** Get all images in a folder */
// //   async getFolderImages(folderId: string) {
// //     const q = query(
// //       collection(db, `${FOLDER_COLLECTION}/${folderId}/images`),
// //       orderBy("order")
// //     );

// //     const snap = await getDocs(q);
// //     return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FolderImage[];
// //   },

// //   /** Delete folder */
// //   async deleteFolder(folderId: string) {
// //     await deleteDoc(doc(db, FOLDER_COLLECTION, folderId));
// //   },
// // };

// // app/services/foldersService.ts
// import { db } from "@/configs/FirebaseConfig";
// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   getDocs,
//   orderBy,
//   query,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";
// import { Folder, FolderImage } from "../utils/types";

// const FOLDER_COLLECTION = "folders";

// export const foldersService = {
//   /** Create a folder */
//   async createFolder(data: {
//     name: string;
//     description: string;
//     createdById: string;
//     createdByName: string;
//     createdByRole: "admin" | "monitor";
//   }) {
//     const ref = await addDoc(collection(db, FOLDER_COLLECTION), {
//       ...data,
//       thumbnailUrl: null,
//       numberOfImages: 0,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });

//     return ref.id;
//   },

//   /** Upload image metadata inside folder */
//   async addImageToFolder(folderId: string, img: Omit<FolderImage, "id">) {
//     const ref = await addDoc(
//       collection(db, `${FOLDER_COLLECTION}/${folderId}/images`),
//       img
//     );
//     return ref.id;
//   },

//   /** Update folder thumbnail */
//   async updateFolderThumbnail(folderId: string, url: string) {
//     await updateDoc(doc(db, FOLDER_COLLECTION, folderId), {
//       thumbnailUrl: url,
//       updatedAt: serverTimestamp(),
//     });
//   },

//   /** Generic folder update: update any folder fields */
//   async updateFolder(folderId: string, data: Partial<Folder>) {
//     await updateDoc(doc(db, FOLDER_COLLECTION, folderId), {
//       ...data,
//       updatedAt: serverTimestamp(),
//     });
//   },

//   /** Increment numberOfImages */
//   async incrementImageCount(folderId: string) {
//     const folderRef = doc(db, FOLDER_COLLECTION, folderId);
//     const snap = await getDoc(folderRef);
//     const current = snap.data()?.numberOfImages ?? 0;
//     await updateDoc(folderRef, {
//       numberOfImages: current + 1,
//       updatedAt: serverTimestamp(),
//     });
//   },

//   /** Get all folders (admin/monitor/user all same) */
//   async getAllFolders() {
//     const q = query(
//       collection(db, FOLDER_COLLECTION),
//       orderBy("createdAt", "desc")
//     );

//     const snap = await getDocs(q);
//     return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Folder[];
//   },

//   /** Get folder by ID */
//   async getFolder(folderId: string) {
//     const ref = doc(db, FOLDER_COLLECTION, folderId);
//     const snap = await getDoc(ref);
//     if (!snap.exists()) return null;
//     return { id: snap.id, ...snap.data() } as Folder;
//   },

//   /** Get all images in a folder */
//   async getFolderImages(folderId: string) {
//     const q = query(
//       collection(db, `${FOLDER_COLLECTION}/${folderId}/images`),
//       orderBy("order")
//     );

//     const snap = await getDocs(q);
//     return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FolderImage[];
//   },

//   /** Delete folder */
//   async deleteFolder(folderId: string) {
//     await deleteDoc(doc(db, FOLDER_COLLECTION, folderId));
//   },

//   /** New: delete an image doc inside folder's images subcollection */
//   async deleteImage(folderId: string, imageDocId: string) {
//     await deleteDoc(
//       doc(db, `${FOLDER_COLLECTION}/${folderId}/images`, imageDocId)
//     );
//     // optionally: decrement numberOfImages or update thumbnail on caller side
//   },
// };

// app/services/foldersService.ts
import { db } from "@/configs/FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { Folder, FolderImage } from "../utils/types";
import { postsService } from "./postsService";

const FOLDER_COLLECTION = "folders";

export const foldersService = {
  /** Create a folder */
  async createFolder(data: {
    name: string;
    description: string;
    createdById: string;
    createdByName: string;
    createdByRole: "admin" | "monitor";
  }) {
    const ref = await addDoc(collection(db, FOLDER_COLLECTION), {
      ...data,
      thumbnailUrl: null,
      numberOfImages: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  },

  /** Upload image metadata inside folder */
  async addImageToFolder(folderId: string, img: Omit<FolderImage, "id">) {
    const ref = await addDoc(
      collection(db, `${FOLDER_COLLECTION}/${folderId}/images`),
      img
    );
    return ref.id;
  },

  /** Delete image in folder/images subcollection */
  async deleteImage(folderId: string, imageId: string) {
    await deleteDoc(
      doc(db, `${FOLDER_COLLECTION}/${folderId}/images/${imageId}`)
    );
  },

  /** Update folder thumbnail */
  async updateFolderThumbnail(folderId: string, url: string | null) {
    await updateDoc(doc(db, FOLDER_COLLECTION, folderId), {
      thumbnailUrl: url,
      updatedAt: serverTimestamp(),
    });
  },

  /** Generic folder update */
  async updateFolder(folderId: string, data: Partial<Folder>) {
    await updateDoc(doc(db, FOLDER_COLLECTION, folderId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  /** Increment numberOfImages */
  async incrementImageCount(folderId: string) {
    const folderRef = doc(db, FOLDER_COLLECTION, folderId);
    const snap = await getDoc(folderRef);
    const current = snap.data()?.numberOfImages ?? 0;
    await updateDoc(folderRef, {
      numberOfImages: current + 1,
      updatedAt: serverTimestamp(),
    });
  },

  /** Decrement numberOfImages */
  async decrementImageCount(folderId: string) {
    const folderRef = doc(db, FOLDER_COLLECTION, folderId);
    const snap = await getDoc(folderRef);
    const current = snap.data()?.numberOfImages ?? 0;

    await updateDoc(folderRef, {
      numberOfImages: Math.max(0, current - 1),
      updatedAt: serverTimestamp(),
    });
  },

  async getAllFolders() {
    const q = query(
      collection(db, FOLDER_COLLECTION),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Folder[];
  },

  async getFolder(folderId: string) {
    const ref = doc(db, FOLDER_COLLECTION, folderId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Folder;
  },

  async getFolderImages(folderId: string) {
    const q = query(
      collection(db, `${FOLDER_COLLECTION}/${folderId}/images`),
      orderBy("order")
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FolderImage[];
  },

  // async deleteFolder(folderId: string) {
  //   await deleteDoc(doc(db, FOLDER_COLLECTION, folderId));
  // },

  async deleteFolder(folderId: string) {
    const batch = writeBatch(db);

    // 1️⃣ Get folder images
    const imagesSnap = await getDocs(
      collection(db, `${FOLDER_COLLECTION}/${folderId}/images`)
    );

    imagesSnap.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    // 2️⃣ Find linked post
    const postQuery = query(
      collection(db, "posts"),
      where("folderId", "==", folderId)
    );

    const postSnap = await getDocs(postQuery);

    for (const p of postSnap.docs) {
      // delete post subcollections first (likes/comments/shares)
      await postsService.deletePost(p.id);
    }

    // 3️⃣ Delete folder document LAST
    batch.delete(doc(db, FOLDER_COLLECTION, folderId));

    // 4️⃣ Commit batch
    await batch.commit();
  },
};
