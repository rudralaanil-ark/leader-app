// // app/api/uploadImage.ts
// import { CLOUDINARY } from "@/configs/CloudinaryConfig";
// import { ToastAndroid } from "react-native";

// /**
//  * Upload an image to Cloudinary inside folder: gallery/<userId>/<folderId>
//  * @param uri local file uri (file:// or content://)
//  * @param opts.folderPath optional folder path tail (ex: "<userId>/<folderId>" or "<userId>/uncategorized")
//  * @param onProgress optional callback(progressFraction 0..1)
//  * @returns { url: string, publicId: string } | null
//  */
// export type CloudinaryUploadResult = {
//   url: string;
//   publicId: string;
// };

// export const uploadImageToCloudinary = async (
//   uri: string,
//   opts?: { folderPath?: string; onProgress?: (p: number) => void }
// ): Promise<CloudinaryUploadResult | null> => {
//   try {
//     // Cloudinary (unsigned) upload via upload_preset still works and allows `folder` param.
//     // Note: progress in fetch() is not natively supported in RN; for progress use XMLHttpRequest.
//     const form = new FormData();
//     form.append("file", {
//       uri,
//       type: "image/jpeg",
//       name: `img-${Date.now()}.jpg`,
//     } as any);

//     form.append("upload_preset", CLOUDINARY.GALLERY_PRESET);

//     if (opts?.folderPath) {
//       // Cloudinary 'folder' param
//       form.append("folder", `gallery/${opts.folderPath}`);
//     } else {
//       form.append("folder", `gallery/uncategorized`);
//     }

//     // Use XMLHttpRequest to get progress events (better UX)
//     return await new Promise<CloudinaryUploadResult | null>(
//       (resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         const url = `${CLOUDINARY.API_URL}/${CLOUDINARY.CLOUD_NAME}/image/upload`;

//         xhr.open("POST", url);

//         xhr.upload.onprogress = (event) => {
//           if (event.lengthComputable && opts?.onProgress) {
//             const p = event.loaded / event.total;
//             try {
//               opts.onProgress(p);
//             } catch {}
//           }
//         };

//         xhr.onerror = () => {
//           ToastAndroid.show(
//             "Image upload failed (network).",
//             ToastAndroid.BOTTOM
//           );
//           reject(new Error("Upload network error"));
//         };

//         xhr.onload = () => {
//           try {
//             const res = JSON.parse(xhr.responseText);
//             if (res && res.secure_url && res.public_id) {
//               resolve({ url: res.secure_url, publicId: res.public_id });
//               return;
//             }
//             ToastAndroid.show("Image upload failed.", ToastAndroid.BOTTOM);
//             resolve(null);
//           } catch (err) {
//             ToastAndroid.show(
//               "Image upload failed (parse).",
//               ToastAndroid.BOTTOM
//             );
//             resolve(null);
//           }
//         };

//         xhr.send(form);
//       }
//     );
//   } catch (error) {
//     console.error("uploadImageToCloudinary error:", error);
//     ToastAndroid.show("Image upload failed.", ToastAndroid.BOTTOM);
//     return null;
//   }
// };

// /**
//  * Request server to delete a Cloudinary resource by publicId or delete by prefix
//  * The server endpoints must be implemented with your Cloudinary API secret and should be protected.
//  *
//  * - To delete single image: POST /api/cloudinary/delete  { publicId: string }
//  * - To delete prefix (folder):  POST /api/cloudinary/deletePrefix { prefix: "gallery/<userId>/<folderId>" }
//  *
//  * This function will call your backend. Replace BASE_SERVER_URL with your server.
//  */
// const BASE_SERVER_URL = "http://10.65.61.170:8080"; // e.g. https://api.yourdomain.com

// export async function requestCloudinaryDeletion(payload: {
//   publicId?: string;
//   prefix?: string;
// }) {
//   try {
//     if (!BASE_SERVER_URL) {
//       console.warn(
//         "BASE_SERVER_URL not configured. Cloudinary deletion skipped."
//       );
//       return { ok: false, error: "no-server" };
//     }

//     const res = await fetch(`${BASE_SERVER_URL}/api/cloudinary/delete`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ publicId: payload.publicId }),
//     });

//     if (res.ok) {
//       return { ok: true, result: await res.json() };
//     } else {
//       // If caller wanted prefix deletion, call deletePrefix endpoint
//       if (payload.prefix) {
//         const r2 = await fetch(
//           `${BASE_SERVER_URL}/api/cloudinary/deletePrefix`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ prefix: payload.prefix }),
//           }
//         );
//         if (r2.ok) return { ok: true, result: await r2.json() };
//       }
//       const text = await res.text();
//       return { ok: false, error: text };
//     }
//   } catch (e) {
//     console.error("requestCloudinaryDeletion error:", e);
//     return { ok: false, error: e?.message || String(e) };
//   }
// }

// export default uploadImageToCloudinary;

// app/api/uploadImage.ts
import { CLOUDINARY } from "@/configs/CloudinaryConfig";
import { ToastAndroid } from "react-native";

/**
 * Upload an image to Cloudinary inside folder: gallery/<userId>/<folderId>
 * @param uri local file uri (file:// or content://)
 * @param opts.folderPath optional folder path tail (ex: "<userId>/<folderId>" or "<userId>/uncategorized")
 * @param opts.preset optional upload preset (defaults to CLOUDINARY.GALLERY_PRESET)
 * @param onProgress optional callback(progressFraction 0..1)
 * @returns { url: string, publicId: string } | null
 */
export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

export const uploadImageToCloudinary = async (
  uri: string,
  opts?: {
    folderPath?: string;
    preset?: string;
    onProgress?: (p: number) => void;
  }
): Promise<CloudinaryUploadResult | null> => {
  try {
    if (!uri) {
      console.warn("uploadImageToCloudinary: empty uri");
      return null;
    }

    const preset = opts?.preset ?? CLOUDINARY.GALLERY_PRESET;
    const folderPath = opts?.folderPath
      ? `gallery/${opts.folderPath}`
      : "gallery/uncategorized";

    console.log("uploadImageToCloudinary ->", { uri, preset, folderPath });

    const form = new FormData();
    form.append("file", {
      uri,
      type: "image/jpeg",
      name: `img-${Date.now()}.jpg`,
    } as any);

    form.append("upload_preset", preset);
    form.append("folder", folderPath);

    return await new Promise<CloudinaryUploadResult | null>(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `${CLOUDINARY.API_URL}/${CLOUDINARY.CLOUD_NAME}/image/upload`;

        xhr.open("POST", url);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && opts?.onProgress) {
            const p = event.loaded / event.total;
            try {
              opts.onProgress(p);
            } catch {}
          }
        };

        xhr.onerror = () => {
          console.error("Cloudinary upload network error");
          ToastAndroid.show(
            "Image upload failed (network).",
            ToastAndroid.BOTTOM
          );
          reject(new Error("Upload network error"));
        };

        xhr.onload = () => {
          try {
            const res = JSON.parse(xhr.responseText);
            console.log("uploadImageToCloudinary - cloudinary response:", res);
            if (res && res.secure_url && res.public_id) {
              resolve({ url: res.secure_url, publicId: res.public_id });
              return;
            }
            ToastAndroid.show("Image upload failed.", ToastAndroid.BOTTOM);
            resolve(null);
          } catch (err) {
            console.error("uploadImageToCloudinary parse error:", err);
            ToastAndroid.show(
              "Image upload failed (parse).",
              ToastAndroid.BOTTOM
            );
            resolve(null);
          }
        };

        xhr.send(form);
      }
    );
  } catch (error) {
    console.error("uploadImageToCloudinary error:", error);
    ToastAndroid.show("Image upload failed.", ToastAndroid.BOTTOM);
    return null;
  }
};

const BASE_SERVER_URL = "http://10.54.130.170:8080";
// your backend base URL

export async function requestCloudinaryDeletion(payload: {
  publicId?: string;
  prefix?: string;
}) {
  try {
    if (payload.publicId) {
      // delete single
      const res = await fetch(`${BASE_SERVER_URL}/api/cloudinary/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: payload.publicId }),
      });
      return await res.json();
    }

    if (payload.prefix) {
      // delete folder (prefix)
      const res = await fetch(
        `${BASE_SERVER_URL}/api/cloudinary/delete-prefix`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prefix: payload.prefix }),
        }
      );
      return await res.json();
    }

    return { ok: false, error: "no publicId or prefix" };
  } catch (e) {
    console.error("requestCloudinaryDeletion error:", e);
    return { ok: false, error: e?.message || String(e) };
  }
}

export default uploadImageToCloudinary;
