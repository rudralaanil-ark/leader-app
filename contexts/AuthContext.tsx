// ✅ /contexts/AuthContext.tsx
import { uploadImageToCloudinary } from "@/app/api/uploadImage";
import { createUserInFirestore, fetchUserData } from "@/app/api/users";
import { auth } from "@/configs/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";

/**
 * 🟢 Updated UserType to include role and createdBy
 */
export type UserType = {
  uid: string;
  fullName: string;
  email: string;
  profileImage?: string;
  role?: "user" | "monitor" | "admin"; // 🟢 Added
  createdAt?: Timestamp | Date | null;
  createdBy?: string | null; // 🟢 Added
};

type AuthContextType = {
  user: UserType | null;
  loading?: boolean;
  signUp: (
    fullName: string,
    email: string,
    password: string,
    profileImage?: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUserFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem("userData");
      if (stored) setUser(JSON.parse(stored));
    } catch (error) {
      console.error("Error loading user from storage:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Updated Auth listener to redirect by role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser.uid);
        if (userData) {
          setUser(userData);
          await AsyncStorage.setItem("userData", JSON.stringify(userData));

          // 🟢 Role-based navigation
          if (router && router.canGoBack() === false) {
            if (userData.role === "admin")
              router.replace("/(admin)/(tabs)/Dashboard");
            else if (userData.role === "monitor")
              router.replace("/(monitor)/(tabs)/Dashboard" as any);
            else router.replace("/(user)/(tabs)/Home" as any);
          }
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem("userData");
        router.replace("/(auth)/SignIn");
      }
      setLoading(false);
    });

    loadUserFromStorage();
    return unsubscribe;
  }, []);

  // 🟢 Updated signUp to create normal users by default

  const signUp = async (
    fullName: string,
    email: string,
    password: string,
    profileImage?: string
  ) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      let imageUrl: string | null = null;
      if (profileImage) {
        imageUrl = await uploadImageToCloudinary(profileImage);
      }

      // 🟢 Create Firestore doc with role 'user'
      await createUserInFirestore(
        firebaseUser.uid,
        fullName,
        email,
        imageUrl,
        "user"
      );

      const userData = await fetchUserData(firebaseUser.uid);
      if (userData) {
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);
        ToastAndroid.show(
          `Welcome, ${userData.fullName}! Account created successfully.`,
          ToastAndroid.BOTTOM
        );

        // 🟢 Navigate based on role
        router.replace("/(user)/(tabs)/Home" as any);
      }
    } catch (error: any) {
      // const errorMsg = authErrorMessage(error?.message && email);
      ToastAndroid.show(
        error.code === "auth/email-already-in-use"
          ? "This email is already registered. Please sign in."
          : errorMsg,
        ToastAndroid.BOTTOM
      );
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Updated signIn to route by role

  // const signUp = async (
  //   fullName: string,
  //   email: string,
  //   password: string,
  //   profileImage?: string
  // ) => {
  //   try {
  //     setLoading(true);

  //     // 1️⃣ Create Firebase user
  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     const firebaseUser = userCredential.user;

  //     // 2️⃣ Upload profile image to Cloudinary
  //     let imageUrl: string | null = null;
  //     if (profileImage) {
  //       imageUrl = await uploadImageToCloudinary(profileImage);
  //     }

  //     // 3️⃣ Create Firestore user document
  //     await createUserInFirestore(
  //       firebaseUser.uid,
  //       fullName,
  //       email,
  //       imageUrl,
  //       "user"
  //     );

  //     // 4️⃣ Fetch full user data from Firestore
  //     const userData = await fetchUserData(firebaseUser.uid);

  //     if (userData) {
  //       // 5️⃣ Save in AsyncStorage
  //       await AsyncStorage.setItem("userData", JSON.stringify(userData));
  //       setUser(userData);

  //       ToastAndroid.show(
  //         `Welcome, ${userData.fullName}!`,
  //         ToastAndroid.BOTTOM
  //       );
  //     }

  //     // ✅ 6️⃣ Wait for auth state sync (important!)
  //     setTimeout(() => {
  //       router.replace("/(user)/(tabs)/Home" as any);
  //     }, 1000); // Wait 1 second to allow onAuthStateChanged to sync
  //   } catch (error: any) {
  //     const errorMsg = authErrorMessage(error?.message && email);
  //     ToastAndroid.show(
  //       error.code === "auth/email-already-in-use"
  //         ? "This email is already registered. Please sign in."
  //         : errorMsg,
  //       ToastAndroid.BOTTOM
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      //This give the Firebase Id Token for the logged in user
      const token = await firebaseUser.getIdToken();
      console.log("ADMIN TOKEN:", token);

      const userData = await fetchUserData(firebaseUser.uid);
      if (userData) {
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);
        ToastAndroid.show(
          `Welcome back, ${userData.fullName}! 👋`,
          ToastAndroid.BOTTOM
        );

        if (userData.role === "admin")
          router.replace("/(admin)/(tabs)/Dashboard");
        else if (userData.role === "monitor")
          router.replace("/(monitor)/(tabs)/Dashboard" as any);
        else router.replace("/(user)/(tabs)/Home" as any);
      }
    } catch (error: any) {
      // console.error("Signin error:", error);
      ToastAndroid.show(
        error.code === "auth/invalid-credential"
          ? "Incorrect email or password."
          : "Failed to sign in. Try again.",
        ToastAndroid.BOTTOM
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userData");
      setUser(null);
      ToastAndroid.show("Logged out successfully", ToastAndroid.BOTTOM);
      router.replace("/(auth)/SignIn");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refreshUser = async () => {
    if (user?.uid) {
      const updatedData = await fetchUserData(user.uid);
      if (updatedData) {
        setUser(updatedData);
        await AsyncStorage.setItem("userData", JSON.stringify(updatedData));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
