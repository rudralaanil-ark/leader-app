// ✅ /contexts/AuthContext.tsx
import authErrorMessage from "@/app/(auth)/utils/authErrors";
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

export type UserType = {
  uid: string;
  fullName: string;
  email: string;
  profileImage?: string; // optional (may not exist for new users)
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

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   signUp: async () => {},
//   signIn: async () => {},
//   logout: async () => {},
//   refreshUser: async () => {},
// });

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from AsyncStorage (for persistence)
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

  // Firebase listener for login/logout state
  // when the app loads, this checks if user is logged in or not.
  // if the user is logged in, fetch user data from firestore
  // and set it to context and async storage. and it redirects to home screen with user data.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log(user);
        const userData = await fetchUserData(firebaseUser.uid);
        if (userData) {
          setUser(userData);
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
          router.push("/(tabs)/Home");
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem("userData");
        router.replace("/landing");
      }
      setLoading(false);
    });

    loadUserFromStorage();
    return unsubscribe;
  }, []);

  // ✅ Sign Up (create user + Firestore + Cloudinary + AsyncStorage)
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

      await createUserInFirestore(firebaseUser.uid, fullName, email, imageUrl);

      const userData = await fetchUserData(firebaseUser.uid);
      if (userData) {
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);
        ToastAndroid.show(
          `Welcome, ${userData.fullName}! Account created successfully.`,
          ToastAndroid.BOTTOM
        );
      }
      router.push("/(tabs)/Home");
    } catch (error: any) {
      // console.error("Signup error:", error);
      const errorMsg = authErrorMessage(error?.message && email);
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

  // ✅ Sign In (Firebase + AsyncStorage)
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const userData = await fetchUserData(firebaseUser.uid);
      if (userData) {
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);
        ToastAndroid.show(
          `Welcome back!  ${userData.fullName || "User"} 👋`,
          ToastAndroid.BOTTOM
        );
        router.push("/(tabs)/Home");
      }
    } catch (error: any) {
      console.error("Signin error:", error);
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

  // ✅ Logout
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

  // ✅ Refresh user manually (after profile update)
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

// export const useAuth = () => useContext(AuthContext);

export const useAuth = (): AuthContextType => useContext(AuthContext);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used inside an AuthProvider");
//   }
//   return context;
// };
