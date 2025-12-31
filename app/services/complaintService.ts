// // app/services/complaintService.ts
// import { db } from "@/configs/FirebaseConfig";
// import {
//   addDoc,
//   collection,
//   doc,
//   getDocs,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
//   updateDoc,
//   where,
// } from "firebase/firestore";

// export type ComplaintStatus =
//   | "pending"
//   | "in_progress"
//   | "need_info"
//   | "resolved";

// export type ComplaintMedia = {
//   type: "image" | "video";
//   url: string;
// };

// export type ComplaintReply = {
//   id: string;
//   message: string;
//   repliedBy: string;
//   repliedByName: string;
//   role: "admin" | "monitor";
//   createdAt: any;
// };

// export type Complaint = {
//   userId: string;
//   userName: string;
//   phone: string;
//   place: string;

//   title: string;
//   description: string;

//   media: ComplaintMedia[];

//   status: ComplaintStatus;

//   isReadByAdmin?: boolean;
//   isReadByUser?: boolean;
//   archived?: boolean;

//   replies?: ComplaintReply[];

//   createdAt?: any;
//   updatedAt?: any;
// };

// export type ComplaintDoc = Complaint & { id: string };

// const COMPLAINTS = "complaints";

// // Ensure safe media format
// function normalizeMedia(media: any[]): ComplaintMedia[] {
//   if (!Array.isArray(media)) return [];
//   return media
//     .filter((m) => m && typeof m.url === "string")
//     .map((m) => ({
//       type: m.type === "video" ? "video" : "image",
//       url: m.url,
//     }));
// }

// export const complaintService = {
//   /** USER creates a complaint */
//   async createComplaint(data: {
//     userId: string;
//     userName: string;
//     phone: string;
//     place: string;
//     title: string;
//     description: string;
//     media: ComplaintMedia[];
//   }) {
//     const ref = await addDoc(collection(db, COMPLAINTS), {
//       ...data,
//       status: "pending",
//       isReadByAdmin: false,
//       isReadByUser: true,
//       archived: false,
//       replies: [], // chat will start empty
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
//     return ref.id;
//   },

//   /** USER complaint list */
//   subscribeToUserComplaints(
//     userId: string,
//     cb: (list: ComplaintDoc[]) => void
//   ) {
//     const q = query(
//       collection(db, COMPLAINTS),
//       where("userId", "==", userId),
//       where("archived", "==", false),
//       orderBy("createdAt", "desc")
//     );

//     return onSnapshot(q, (snap) => {
//       cb(
//         snap.docs.map((d) => {
//           const data = d.data() as Complaint;
//           return { id: d.id, ...data, media: normalizeMedia(data.media) };
//         })
//       );
//     });
//   },

//   /** ADMIN/MONITOR complaint list */
//   subscribeToAllComplaints(cb: (list: ComplaintDoc[]) => void) {
//     const q = query(
//       collection(db, COMPLAINTS),
//       where("archived", "==", false),
//       orderBy("createdAt", "desc")
//     );

//     return onSnapshot(q, (snap) => {
//       cb(
//         snap.docs.map((d) => {
//           const data = d.data() as Complaint;
//           return { id: d.id, ...data, media: normalizeMedia(data.media) };
//         })
//       );
//     });
//   },

//   /** Complaint Details Chat */
//   subscribeToComplaint(id: string, cb: (doc: ComplaintDoc | null) => void) {
//     const ref = doc(db, COMPLAINTS, id);
//     return onSnapshot(ref, (snap) => {
//       if (!snap.exists()) return cb(null);
//       const data = snap.data() as Complaint;
//       cb({
//         id: snap.id,
//         ...data,
//         media: normalizeMedia(data.media),
//       });
//     });
//   },

//   /** STATUS update */
//   async updateStatus(id: string, status: ComplaintStatus) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       status,
//       updatedAt: serverTimestamp(),
//       isReadByUser: false, // notify user
//     });
//   },

//   /** Mark complaint opened by admin */
//   async markReadByAdmin(id: string) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       isReadByAdmin: true,
//     });
//   },

//   /** Mark replies as read by user */
//   async markRepliesAsReadByUser(id: string) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       isReadByUser: true,
//     });
//   },

//   /** Mark replies as read by admin */
//   async markRepliesAsReadByAdmin(id: string) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       isReadByAdmin: true,
//     });
//   },

//   /** Add a reply — Admin/Monitor */
//   async addReply(id: string, reply: Omit<ComplaintReply, "id">) {
//     const ref = doc(db, COMPLAINTS, id);

//     const snap = await getDocs(
//       query(collection(db, COMPLAINTS), where("__name__", "==", id))
//     );
//     if (snap.empty) return;

//     const data = snap.docs[0].data() as Complaint;
//     const replies = Array.isArray(data.replies) ? data.replies : [];

//     const newReply: ComplaintReply = {
//       id: Date.now().toString(),
//       ...reply,
//     };

//     await updateDoc(ref, {
//       replies: [...replies, newReply],
//       updatedAt: serverTimestamp(),
//       isReadByUser: false,
//     });
//   },

//   /** Archive */
//   async archiveComplaint(id: string) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       archived: true,
//       updatedAt: serverTimestamp(),
//     });
//   },
// };

// // app/services/complaintService.ts
// import { db } from "@/configs/FirebaseConfig";
// import {
//   addDoc,
//   collection,
//   doc,
//   getDocs,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
//   updateDoc,
//   where,
// } from "firebase/firestore";

// export type ComplaintStatus =
//   | "pending" // User sees: Pending | Admin sees: New
//   | "accepted" // Admin action only (after review)
//   | "in_progress" // Work started
//   | "need_info" // Asking user for more info
//   | "resolved"; // Completed

// export type ComplaintMedia = {
//   type: "image" | "video";
//   url: string;
// };

// export type ComplaintReply = {
//   id: string;
//   message: string;
//   repliedBy: string;
//   repliedByName: string;
//   role: "admin" | "monitor";
//   createdAt: any;
// };

// export type Complaint = {
//   userId: string;
//   userName: string;
//   phone: string;
//   place: string;

//   title: string;
//   description: string;

//   media: ComplaintMedia[];

//   status: ComplaintStatus;

//   isReadByAdmin?: boolean;
//   isReadByUser?: boolean;
//   archived?: boolean;

//   replies?: ComplaintReply[];

//   createdAt?: any;
//   updatedAt?: any;
// };

// export type ComplaintDoc = Complaint & { id: string };

// const COMPLAINTS = "complaints";

// // 🛡 Ensure consistent media object
// function normalizeMedia(media: any[]): ComplaintMedia[] {
//   if (!Array.isArray(media)) return [];
//   return media
//     .filter((m) => m && typeof m.url === "string")
//     .map((m) => ({
//       type: m.type === "video" ? "video" : "image",
//       url: m.url,
//     }));
// }

// export const complaintService = {
//   /** USER creates a complaint */
//   async createComplaint(data: {
//     userId: string;
//     userName: string;
//     phone: string;
//     place: string;
//     title: string;
//     description: string;
//     media: ComplaintMedia[];
//   }) {
//     const ref = await addDoc(collection(db, COMPLAINTS), {
//       ...data,
//       status: "pending",
//       isReadByAdmin: false,
//       isReadByUser: true,
//       archived: false,
//       replies: [],
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
//     return ref.id;
//   },

//   /** USER Complaint list */
//   subscribeToUserComplaints(
//     userId: string,
//     cb: (list: ComplaintDoc[]) => void
//   ) {
//     const q = query(
//       collection(db, COMPLAINTS),
//       where("userId", "==", userId),
//       where("archived", "==", false),
//       orderBy("createdAt", "desc")
//     );

//     return onSnapshot(q, (snap) => {
//       cb(
//         snap.docs.map((d) => {
//           const data = d.data() as Complaint;
//           return { id: d.id, ...data, media: normalizeMedia(data.media) };
//         })
//       );
//     });
//   },

//   /** ADMIN/MONITOR Complaint list */
//   subscribeToAllComplaints(cb: (list: ComplaintDoc[]) => void) {
//     const q = query(
//       collection(db, COMPLAINTS),
//       where("archived", "==", false),
//       orderBy("createdAt", "desc")
//     );

//     return onSnapshot(q, (snap) => {
//       cb(
//         snap.docs.map((d) => {
//           const data = d.data() as Complaint;
//           return { id: d.id, ...data, media: normalizeMedia(data.media) };
//         })
//       );
//     });
//   },

//   /** Complaint Details Viewer */
//   subscribeToComplaint(id: string, cb: (doc: ComplaintDoc | null) => void) {
//     const ref = doc(db, COMPLAINTS, id);
//     return onSnapshot(ref, (snap) => {
//       if (!snap.exists()) return cb(null);
//       const data = snap.data() as Complaint;
//       cb({
//         id: snap.id,
//         ...data,
//         media: normalizeMedia(data.media),
//       });
//     });
//   },

//   /** STATUS update */
//   async updateStatus(id: string, status: ComplaintStatus) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       status,
//       updatedAt: serverTimestamp(),
//       isReadByUser: false, // notify user about change
//     });
//   },

//   /** Mark admin viewed complaint */
//   async markReadByAdmin(id: string) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       isReadByAdmin: true,
//     });
//   },

//   /** Mark user has read updates */
//   async markRepliesAsReadByUser(id: string) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       isReadByUser: true,
//     });
//   },

//   /** Admin reply system */
//   async addReply(id: string, reply: Omit<ComplaintReply, "id">) {
//     const ref = doc(db, COMPLAINTS, id);

//     const snap = await getDocs(
//       query(collection(db, COMPLAINTS), where("__name__", "==", id))
//     );
//     if (snap.empty) return;

//     const data = snap.docs[0].data() as Complaint;
//     const replies = Array.isArray(data.replies) ? data.replies : [];

//     const newReply: ComplaintReply = {
//       id: Date.now().toString(),
//       ...reply,
//     };

//     await updateDoc(ref, {
//       replies: [...replies, newReply],
//       updatedAt: serverTimestamp(),
//       isReadByUser: false,
//     });
//   },

//   /** Archive complaint */
//   async archiveComplaint(id: string) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       archived: true,
//       updatedAt: serverTimestamp(),
//     });
//   },
// };

// import { db } from "@/configs/FirebaseConfig";
// import {
//   addDoc,
//   collection,
//   doc,
//   getDoc,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
//   updateDoc,
//   where,
// } from "firebase/firestore";

// export type ComplaintStatus =
//   | "pending"
//   | "accepted"
//   | "in_progress"
//   | "need_info"
//   | "resolved";

// export type ComplaintMedia = {
//   type: "image" | "video";
//   url: string;
// };

// export type ComplaintReply = {
//   id: string;
//   message: string;
//   repliedBy: string;
//   repliedByName: string;
//   role: "admin" | "monitor" | "user";
//   createdAt: any;
// };

// export type Complaint = {
//   userId: string;
//   userName: string;
//   phone: string;
//   place: string;

//   title: string;
//   description: string;

//   media: ComplaintMedia[];

//   status: ComplaintStatus;

//   isReadByAdmin: boolean;
//   isReadByUser: boolean;
//   archived: boolean;

//   replies: ComplaintReply[];

//   createdAt?: any;
//   updatedAt?: any;
// };

// export type ComplaintDoc = Complaint & { id: string };

// const COMPLAINTS = "complaints";

// // Ensure media format always valid
// function normalizeMedia(media: any[]): ComplaintMedia[] {
//   if (!Array.isArray(media)) return [];
//   return media.map((m) => ({
//     type: m.type === "video" ? "video" : "image",
//     url: m.url,
//   }));
// }

// export const complaintService = {
//   /** CREATE complaint */
//   async createComplaint(data: {
//     userId: string;
//     userName: string;
//     phone: string;
//     place: string;
//     title: string;
//     description: string;
//     media: ComplaintMedia[];
//   }) {
//     const ref = await addDoc(collection(db, COMPLAINTS), {
//       ...data,
//       status: "pending",
//       isReadByAdmin: false,
//       isReadByUser: true,
//       archived: false,
//       replies: [],
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
//     return ref.id;
//   },

//   /** USER complaint subscription */
//   subscribeToUserComplaints(uid: string, cb: (list: ComplaintDoc[]) => void) {
//     const q = query(
//       collection(db, COMPLAINTS),
//       where("userId", "==", uid),
//       where("archived", "==", false),
//       orderBy("createdAt", "desc")
//     );
//     return onSnapshot(q, (snap) =>
//       cb(
//         snap.docs.map((d) => {
//           const doc = d.data() as Complaint;
//           return { id: d.id, ...doc, media: normalizeMedia(doc.media) };
//         })
//       )
//     );
//   },

//   /** ADMIN/MONITOR list */
//   subscribeToAllComplaints(cb: (list: ComplaintDoc[]) => void) {
//     const q = query(
//       collection(db, COMPLAINTS),
//       where("archived", "==", false),
//       orderBy("createdAt", "desc")
//     );
//     return onSnapshot(q, (snap) =>
//       cb(
//         snap.docs.map((d) => {
//           const doc = d.data() as Complaint;
//           return { id: d.id, ...doc, media: normalizeMedia(doc.media) };
//         })
//       )
//     );
//   },

//   /** Single complaint */
//   subscribeToComplaint(
//     id: string,
//     cb: (complaint: ComplaintDoc | null) => void
//   ) {
//     return onSnapshot(doc(db, COMPLAINTS, id), (snap) => {
//       if (!snap.exists()) return cb(null);
//       const docData = snap.data() as Complaint;
//       cb({
//         id: snap.id,
//         ...docData,
//         media: normalizeMedia(docData.media),
//       });
//     });
//   },

//   /** Update status */
//   async updateStatus(id: string, status: ComplaintStatus) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       status,
//       updatedAt: serverTimestamp(),
//       isReadByUser: false,
//     });
//   },

//   /** Mark view state */
//   async markReadByAdmin(id: string) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       isReadByAdmin: true,
//     });
//   },

//   async markReadByUser(id: string) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       isReadByUser: true,
//     });
//   },

//   /** Replies */
//   async addReply(id: string, reply: Omit<ComplaintReply, "id">) {
//     const ref = doc(db, COMPLAINTS, id);
//     const snap = await getDoc(ref);
//     if (!snap.exists()) return;

//     const data = snap.data() as Complaint;
//     const replies = Array.isArray(data.replies) ? data.replies : [];

//     const newReply: ComplaintReply = {
//       id: Date.now().toString(),
//       ...reply,
//     };

//     await updateDoc(ref, {
//       replies: [...replies, newReply],
//       updatedAt: serverTimestamp(),
//       isReadByAdmin: false,
//       isReadByUser: false,
//     });
//   },

//   /** Archive */
//   async archiveComplaint(id: string) {
//     await updateDoc(doc(db, COMPLAINTS, id), {
//       archived: true,
//       updatedAt: serverTimestamp(),
//     });
//   },
// };

// app/services/complaintService.ts
import { db } from "@/configs/FirebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export type ComplaintStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "need_info"
  | "resolved";

export type ComplaintMedia = {
  type: "image" | "video";
  url: string;
};

export type ComplaintReply = {
  id: string;
  message: string;
  repliedBy: string;
  repliedByName: string;
  role: "admin" | "monitor" | "user";
  createdAt: any;
};

export type Complaint = {
  userId: string;
  userName: string;
  phone: string;
  place: string;

  title: string;
  description: string;

  media: ComplaintMedia[];

  status: ComplaintStatus;

  isReadByAdmin: boolean;
  isReadByUser: boolean;
  archived: boolean;

  replies: ComplaintReply[];

  createdAt?: any;
  updatedAt?: any;
};

export type ComplaintDoc = Complaint & { id: string };

const COMPLAINTS = "complaints";

function normalizeMedia(media: any[]): ComplaintMedia[] {
  if (!Array.isArray(media)) return [];
  return media
    .filter((m) => m && typeof m.url === "string" && m.url.trim().length > 0)
    .map((m) => ({
      type: m.type === "video" ? "video" : "image",
      url: m.url,
    }));
}

export const complaintService = {
  async createComplaint(data: {
    userId: string;
    userName: string;
    phone: string;
    place: string;
    title: string;
    description: string;
    media: ComplaintMedia[];
  }) {
    const ref = await addDoc(collection(db, COMPLAINTS), {
      ...data,
      status: "pending",
      isReadByAdmin: false,
      isReadByUser: true,
      archived: false,
      replies: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  subscribeToUserComplaints(uid: string, cb: (list: ComplaintDoc[]) => void) {
    const q = query(
      collection(db, COMPLAINTS),
      where("userId", "==", uid),
      where("archived", "==", false),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) =>
      cb(
        snap.docs.map((d) => {
          const doc = d.data() as Complaint;
          return { id: d.id, ...doc, media: normalizeMedia(doc.media) };
        })
      )
    );
  },

  subscribeToAllComplaints(cb: (list: ComplaintDoc[]) => void) {
    const q = query(
      collection(db, COMPLAINTS),
      where("archived", "==", false),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) =>
      cb(
        snap.docs.map((d) => {
          const doc = d.data() as Complaint;
          return { id: d.id, ...doc, media: normalizeMedia(doc.media) };
        })
      )
    );
  },

  subscribeToComplaint(
    id: string,
    cb: (complaint: ComplaintDoc | null) => void
  ) {
    return onSnapshot(doc(db, COMPLAINTS, id), (snap) => {
      if (!snap.exists()) return cb(null);

      const data = snap.data() as Complaint;

      cb({
        id: snap.id,
        ...data,
        media: normalizeMedia(data.media),
      });
    });
  },

  async updateStatus(id: string, status: ComplaintStatus) {
    await updateDoc(doc(db, COMPLAINTS, id), {
      status,
      updatedAt: serverTimestamp(),
      isReadByUser: false,
    });
  },

  async markReadByAdmin(id: string) {
    await updateDoc(doc(db, COMPLAINTS, id), {
      isReadByAdmin: true,
    });
  },

  async markReadByUser(id: string) {
    await updateDoc(doc(db, COMPLAINTS, id), {
      isReadByUser: true,
    });
  },

  /** Replies */
  async addReply(id: string, reply: Omit<ComplaintReply, "id">) {
    const ref = doc(db, COMPLAINTS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data() as Complaint;
    const replies = Array.isArray(data.replies) ? data.replies : [];

    const newReply: ComplaintReply = {
      id: Date.now().toString(),
      ...reply,
    };

    // Role condition logic
    const isUser = reply.role === "user";

    await updateDoc(ref, {
      replies: [...replies, newReply],
      updatedAt: serverTimestamp(),
      isReadByAdmin: isUser ? false : true, // unread for admin if user messages
      isReadByUser: isUser ? true : false, // unread for user if admin/monitor messages
    });
  },

  async archiveComplaint(id: string) {
    await updateDoc(doc(db, COMPLAINTS, id), {
      archived: true,
      updatedAt: serverTimestamp(),
    });
  },
};
