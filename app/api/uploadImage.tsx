import { CLOUDINARY } from "@/configs/CloudinaryConfig";
import { ToastAndroid } from "react-native";

/**
 * Upload an image to Cloudinary
 * @param uri - Local image URI (from expo-image-picker)
 * @returns The secure URL string or null on failure
 */
export const uploadImageToCloudinary = async (
  uri: string
): Promise<string | null> => {
  try {
    console.log("CLOUDINARY CONFIG:", CLOUDINARY);

    const data = new FormData();
    data.append("file", {
      uri,
      type: "image/jpeg",
      name: "profile.jpg",
    } as any);
    data.append("upload_preset", CLOUDINARY.UPLOAD_PRESET!);

    const res = await fetch(
      `${CLOUDINARY.API_URL}/${CLOUDINARY.CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

    const result = await res.json();
    console.log("Cloudinary upload result:", result);

    if (result.secure_url) {
      return result.secure_url;
    }

    ToastAndroid.show("Image upload failed.", ToastAndroid.BOTTOM);
    return null;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    ToastAndroid.show("Image upload failed.", ToastAndroid.BOTTOM);
    return null;
  }
};

export default uploadImageToCloudinary;
