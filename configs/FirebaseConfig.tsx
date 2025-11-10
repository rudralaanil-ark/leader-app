// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
//@ts-ignore
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9p_6rhwYFYQQMmZc0gK411-lhPRKMIBQ",
  authDomain: "leaderapp-cdd09.firebaseapp.com",
  projectId: "leaderapp-cdd09",
  storageBucket: "leaderapp-cdd09.firebasestorage.app",
  messagingSenderId: "992469957299",
  appId: "1:992469957299:web:b73e489851177ad160cec6",
  measurementId: "G-RDFCZCP84G",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);

// const analytics = getAnalytics(app);

export const getSecondaryAuth = () => {
  // Check if a secondary app already exists
  let secondaryApp = getApps().find((app) => app.name === "Secondary");
  if (!secondaryApp) {
    secondaryApp = initializeApp(firebaseConfig, "Secondary");
  }
  return getAuth(secondaryApp);
};
