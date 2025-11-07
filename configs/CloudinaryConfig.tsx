// import { cloudinary } from "cloudinary";

// Configure once (usually in a config file)

export const CLOUDINARY = {
  CLOUD_NAME: process.env.EXPO_PUBLIC_CLOUD_NAME,
  apiKey: process.env.EXPO_PUBLIC_CLOUD_API_KEY,
  UPLOAD_PRESET: process.env.EXPO_PUBLIC_CLOUD_PRESET, // Replace with your upload preset
  API_URL: "https://api.cloudinary.com/v1_1/",
  // api_secret: "YOUR_API_SECRET",
  url: {
    secure: true, // Use HTTPS
  },
};

export const options = {
  upload_preset: "leader-app", // Replace with your upload preset
  tag: "sample",
  unsigned: true,
};
