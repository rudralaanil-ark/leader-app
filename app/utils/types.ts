// // app/utils/types.ts
// import { Timestamp } from "firebase/firestore";

// // ---------- POST ----------
// export interface PostMedia {
//   url: string;
//   publicId: string;
//   type: "image" | "video";
//   width?: number;
//   height?: number;
// }

// export interface Post {
//   id: string;
//   ownerId: string;
//   ownerName: string;
//   ownerRole: "admin" | "monitor" | "user";
//   type: "post" | "event" | "news";
//   title?: string;
//   description?: string;
//   media: PostMedia[];

//   // Gallery fields
//   postType?: "single" | "multi" | "folder" | null;
//   folderId?: string | null;

//   allowLikes: boolean;
//   allowComments: boolean;
//   allowShares: boolean;

//   likeCount: number;
//   commentCount: number;
//   shareCount: number;

//   createdAt: Timestamp;
//   updatedAt: Timestamp;
// }

// // ---------- FOLDER ----------
// export interface FolderImage {
//   id: string;
//   url: string;
//   publicId: string;
//   caption?: string;
//   order: number;
//   createdAt: Timestamp;
// }

// export interface Folder {
//   id: string;
//   name: string;
//   description: string;
//   createdById: string;
//   createdByName: string;
//   createdByRole: "admin" | "monitor";

//   thumbnailUrl: string | null;
//   numberOfImages: number;

//   createdAt: Timestamp;
//   updatedAt: Timestamp;
// }

import { Timestamp } from "firebase/firestore";

export interface PostMedia {
  url: string;
  publicId: string;
  order: number;
  type: "image";
}

export interface Post {
  id: string;

  ownerId: string;
  ownerName: string;
  ownerRole: "admin" | "monitor" | "user";

  type: "post" | "event" | "news";
  title?: string | null;

  description?: string;
  tags: string[];

  media: PostMedia[];

  postType?: "single" | "multi" | "folder" | null;
  folderId?: string | null;

  allowLikes: boolean;
  allowComments: boolean;
  allowShares: boolean;

  likeCount: number;
  commentCount: number;
  shareCount: number;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FolderImage {
  id: string;
  url: string;
  publicId: string;
  caption?: string;
  order: number;
  createdAt: Timestamp;
}

export interface Folder {
  id: string;
  name: string;
  description: string;

  createdById: string;
  createdByName: string;
  createdByRole: "admin" | "monitor";

  thumbnailUrl: string | null;
  numberOfImages: number;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Like {
  id: string; // userId (doc id)
  userId: string;
  userName: string;
  userRole: "admin" | "monitor" | "user";
  profileImage?: string | null; // optional for future
  createdAt: Timestamp;
}
