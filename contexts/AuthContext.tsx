// ✅ /contexts/AuthContext.tsx

import { uploadImageToCloudinary } from "@/app/api/uploadImage";

import { createUserInFirestore, fetchUserData } from "@/app/api/users";

import { auth } from "@/configs/FirebaseConfig";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Timestamp } from "firebase/firestore";

import React, { createContext, useContext, useEffect, useState } from "react";

import { ToastAndroid } from "react-native";

SplashScreen.preventAutoHideAsync().catch(() => {});

export type UserType = {
  uid: string;

  fullName: string;

  email: string;

  profileImage?: string;

  role?: "user" | "monitor" | "admin";

  createdAt?: Timestamp | Date | null;

  createdBy?: string | null;
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

      if (stored) {
        const parsedUser = JSON.parse(stored);

        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
    }
  };

  useEffect(() => {
    let unsubscribe: any;

    const initAuth = async () => {
      await loadUserFromStorage();

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        // if (firebaseUser) {
        //   const userData = await fetchUserData(firebaseUser.uid);

        //   if (userData) {
        //     setUser(userData);

        //     await AsyncStorage.setItem("userData", JSON.stringify(userData));

        //     if (router && !router.canGoBack()) {
        //       if (userData.role === "admin")
        //         router.replace("/(admin)/(tabs)/Dashboard");
        //       else if (userData.role === "monitor")
        //         router.replace("/(monitor)/(tabs)/Dashboard" as any);
        //       else router.replace("/(user)/(tabs)/Home" as any);
        //     }
        //   }
        // }

        if (firebaseUser) {
          const userData = await fetchUserData(firebaseUser.uid);

          // 🚫 USER NOT FOUND
          if (!userData) {
            await signOut(auth);
            router.replace("/(auth)/SignIn");
            return;
          }

          // 🚫 USER IS BANNED
          if (userData.banned === true) {
            await signOut(auth);
            await AsyncStorage.removeItem("userData");

            ToastAndroid.show(
              "Your account has been banned. Contact admin.",
              ToastAndroid.LONG
            );

            router.replace("/(auth)/SignIn");
            return;
          }

          // ✅ USER IS ALLOWED
          setUser(userData);
          await AsyncStorage.setItem("userData", JSON.stringify(userData));

          if (router && !router.canGoBack()) {
            if (userData.role === "admin")
              router.replace("/(admin)/(tabs)/Dashboard");
            else if (userData.role === "monitor")
              router.replace("/(monitor)/(tabs)/Dashboard" as any);
            else router.replace("/(user)/(tabs)/Home" as any);
          }
        } else {
          setUser(null);

          await AsyncStorage.removeItem("userData");

          router.replace("/(auth)/SignIn");
        }

        setLoading(false);

        // ✅ Hide splash after auth check completes

        await SplashScreen.hideAsync().catch(() => {});
      });
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

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

        router.replace("/(user)/(tabs)/Home" as any);
      }
    } catch (error: any) {
      const message =
        error.code === "auth/email-already-in-use"
          ? "This email is already registered. Please sign in."
          : "Failed to create account. Try again.";

      ToastAndroid.show(message, ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

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

// // ✅ /contexts/AuthContext.tsx

// import { uploadImageToCloudinary } from "@/app/api/uploadImage";
// import { createUserInFirestore, fetchUserData } from "@/app/api/users";
// import { auth } from "@/configs/FirebaseConfig";

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";

// import {
//   createUserWithEmailAndPassword,
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithCredential,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { Timestamp } from "firebase/firestore";

// import React, { createContext, useContext, useEffect, useState } from "react";
// import { ToastAndroid } from "react-native";

// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";

// WebBrowser.maybeCompleteAuthSession();
// SplashScreen.preventAutoHideAsync().catch(() => {});

// /* -------------------------------------------------------------------------- */
// /*                                   TYPES                                    */
// /* -------------------------------------------------------------------------- */

// export type UserType = {
//   uid: string;
//   fullName: string;
//   email: string;
//   profileImage?: string;
//   phoneNumber?: string;
//   role?: "user" | "monitor" | "admin";
//   banned?: boolean;
//   createdAt?: Timestamp | Date | null;
//   createdBy?: string | null;
//   provider?: "email" | "google" | "apple";
// };

// export type PendingProfileType = {
//   uid: string;
//   email: string;
//   fullName: string;
//   profileImage?: string;
//   provider: "google";
// };

// type AuthContextType = {
//   user: UserType | null;
//   loading?: boolean;

//   signUp: (
//     fullName: string,
//     email: string,
//     password: string,
//     profileImage?: string
//   ) => Promise<void>;

//   signIn: (email: string, password: string) => Promise<void>;
//   signInWithGoogle: () => Promise<void>;

//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;

//   pendingProfile: PendingProfileType | null;
//   clearPendingProfile: () => void;
// };

// const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// /* -------------------------------------------------------------------------- */
// /*                                AUTH PROVIDER                               */
// /* -------------------------------------------------------------------------- */

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<UserType | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [pendingProfile, setPendingProfile] =
//     useState<PendingProfileType | null>(null);

//   const clearPendingProfile = () => setPendingProfile(null);

//   const router = useRouter();

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_ID,
//     iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_ID,
//   });

//   /* -------------------------------------------------------------------------- */
//   /*                          LOAD USER FROM STORAGE                            */
//   /* -------------------------------------------------------------------------- */

//   const loadUserFromStorage = async () => {
//     try {
//       const stored = await AsyncStorage.getItem("userData");
//       if (stored) {
//         setUser(JSON.parse(stored));
//       }
//     } catch (error) {
//       console.error("Error loading user from storage:", error);
//     }
//   };

//   /* -------------------------------------------------------------------------- */
//   /*                           AUTH STATE LISTENER                              */
//   /* -------------------------------------------------------------------------- */

//   useEffect(() => {
//     let unsubscribe: any;

//     const initAuth = async () => {
//       await loadUserFromStorage();

//       unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//         if (firebaseUser) {
//           const userData = await fetchUserData(firebaseUser.uid);

//           if (!userData) {
//             await signOut(auth);
//             router.replace("/(auth)/SignIn");
//             return;
//           }

//           if (userData.banned === true) {
//             await signOut(auth);
//             await AsyncStorage.removeItem("userData");

//             ToastAndroid.show(
//               "Your account has been banned. Contact admin.",
//               ToastAndroid.LONG
//             );

//             router.replace("/(auth)/SignIn");
//             return;
//           }

//           setUser(userData);
//           await AsyncStorage.setItem("userData", JSON.stringify(userData));

//           if (!router.canGoBack()) {
//             if (userData.role === "admin")
//               router.replace("/(admin)/(tabs)/Dashboard");
//             else if (userData.role === "monitor")
//               router.replace("/(monitor)/(tabs)/Dashboard" as any);
//             else router.replace("/(user)/(tabs)/Home" as any);
//           }
//         } else {
//           setUser(null);
//           await AsyncStorage.removeItem("userData");
//           router.replace("/(auth)/SignIn");
//         }

//         setLoading(false);
//         await SplashScreen.hideAsync().catch(() => {});
//       });
//     };

//     initAuth();
//     return () => unsubscribe && unsubscribe();
//   }, []);

//   /* -------------------------------------------------------------------------- */
//   /*                               EMAIL SIGN UP                                */
//   /* -------------------------------------------------------------------------- */

//   const signUp = async (
//     fullName: string,
//     email: string,
//     password: string,
//     profileImage?: string
//   ) => {
//     try {
//       setLoading(true);

//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       let imageUrl: string | null = null;
//       if (profileImage) {
//         imageUrl = await uploadImageToCloudinary(profileImage);
//       }

//       await createUserInFirestore(
//         userCredential.user.uid,
//         fullName,
//         email,
//         imageUrl,
//         "user"
//       );

//       const userData = await fetchUserData(userCredential.user.uid);

//       if (userData) {
//         setUser(userData);
//         await AsyncStorage.setItem("userData", JSON.stringify(userData));

//         ToastAndroid.show(
//           `Welcome, ${userData.fullName}! Account created successfully.`,
//           ToastAndroid.BOTTOM
//         );

//         router.replace("/(user)/(tabs)/Home" as any);
//       }
//     } catch (error: any) {
//       ToastAndroid.show(
//         error.code === "auth/email-already-in-use"
//           ? "This email is already registered. Please sign in."
//           : "Failed to create account. Try again.",
//         ToastAndroid.BOTTOM
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -------------------------------------------------------------------------- */
//   /*                               EMAIL SIGN IN                                */
//   /* -------------------------------------------------------------------------- */

//   const signIn = async (email: string, password: string) => {
//     try {
//       setLoading(true);

//       const res = await signInWithEmailAndPassword(auth, email, password);
//       const userData = await fetchUserData(res.user.uid);

//       if (userData) {
//         setUser(userData);
//         await AsyncStorage.setItem("userData", JSON.stringify(userData));

//         ToastAndroid.show(
//           `Welcome back, ${userData.fullName}! 👋`,
//           ToastAndroid.BOTTOM
//         );

//         if (userData.role === "admin")
//           router.replace("/(admin)/(tabs)/Dashboard");
//         else if (userData.role === "monitor")
//           router.replace("/(monitor)/(tabs)/Dashboard" as any);
//         else router.replace("/(user)/(tabs)/Home" as any);
//       }
//     } catch {
//       ToastAndroid.show("Incorrect email or password.", ToastAndroid.BOTTOM);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -------------------------------------------------------------------------- */
//   /*                              GOOGLE SIGN IN                                */
//   /* -------------------------------------------------------------------------- */

//   const signInWithGoogle = async () => {
//     try {
//       setLoading(true);

//       const result = await promptAsync();

//       if (result.type !== "success") return;

//       const { id_token } = result.params;

//       const credential = GoogleAuthProvider.credential(id_token);
//       const userCredential = await signInWithCredential(auth, credential);

//       const firebaseUser = userCredential.user;
//       const userData = await fetchUserData(firebaseUser.uid);

//       if (!userData) {
//         setPendingProfile({
//           uid: firebaseUser.uid,
//           email: firebaseUser.email ?? "",
//           fullName: firebaseUser.displayName ?? "",
//           profileImage: firebaseUser.photoURL ?? undefined,
//           provider: "google",
//         });

//         router.replace("/(auth)/CompleteProfile");
//         return;
//       }

//       setUser(userData);
//       await AsyncStorage.setItem("userData", JSON.stringify(userData));
//     } catch (error) {
//       console.error("Google Sign-In error:", error);
//       ToastAndroid.show("Google sign-in failed", ToastAndroid.BOTTOM);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -------------------------------------------------------------------------- */
//   /*                                   LOGOUT                                   */
//   /* -------------------------------------------------------------------------- */

//   const logout = async () => {
//     await signOut(auth);
//     await AsyncStorage.removeItem("userData");
//     setUser(null);
//     ToastAndroid.show("Logged out successfully", ToastAndroid.BOTTOM);
//     router.replace("/(auth)/SignIn");
//   };

//   /* -------------------------------------------------------------------------- */
//   /*                                REFRESH USER                                */
//   /* -------------------------------------------------------------------------- */

//   const refreshUser = async () => {
//     if (!user?.uid) return;
//     const updated = await fetchUserData(user.uid);
//     if (updated) {
//       setUser(updated);
//       await AsyncStorage.setItem("userData", JSON.stringify(updated));
//     }
//   };

//   /* -------------------------------------------------------------------------- */

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         signUp,
//         signIn,
//         signInWithGoogle,
//         logout,
//         refreshUser,
//         pendingProfile,
//         clearPendingProfile,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => useContext(AuthContext);

// // ✅ /contexts/AuthContext.tsx
// import { uploadImageToCloudinary } from "@/app/api/uploadImage";
// import { createUserInFirestore, fetchUserData } from "@/app/api/users";
// import { auth, db } from "@/configs/FirebaseConfig"; // ⭐ db ADDED
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import {
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { doc, onSnapshot, setDoc } from "firebase/firestore"; // ⭐ ADDED
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { ToastAndroid } from "react-native";

// SplashScreen.preventAutoHideAsync().catch(() => {});

// export type UserType = {
//   uid: string;
//   fullName: string;
//   email: string;
//   profileImage?: string;
//   role?: "user" | "monitor" | "admin";
//   createdAt?: Timestamp | Date | null;
//   createdBy?: string | null;
// };

// type AuthContextType = {
//   user: UserType | null;
//   loading?: boolean;
//   signUp: (
//     fullName: string,
//     email: string,
//     password: string,
//     profileImage?: string
//   ) => Promise<void>;
//   signIn: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;

//   // ⭐ NEW GLOBAL IDENTITY FEATURE
//   globalIdentity: {
//     name: string;
//     profileImage?: string;
//   } | null;
//   updateGlobalIdentity: (name: string, image?: string) => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<UserType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // ⭐ NEW GLOBAL IDENTITY STATE
//   const [globalIdentity, setGlobalIdentity] = useState<{
//     name: string;
//     profileImage?: string;
//   } | null>(null);

//   const loadUserFromStorage = async () => {
//     try {
//       const stored = await AsyncStorage.getItem("userData");
//       if (stored) {
//         const parsedUser = JSON.parse(stored);
//         setUser(parsedUser);
//       }
//     } catch (error) {
//       console.error("Error loading user from storage:", error);
//     }
//   };

//   useEffect(() => {
//     let unsubscribe: any;
//     const initAuth = async () => {
//       await loadUserFromStorage();

//       unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//         if (firebaseUser) {
//           const userData = await fetchUserData(firebaseUser.uid);
//           if (userData) {
//             setUser(userData);
//             await AsyncStorage.setItem("userData", JSON.stringify(userData));

//             if (router && !router.canGoBack()) {
//               if (userData.role === "admin")
//                 router.replace("/(admin)/(tabs)/Dashboard");
//               else if (userData.role === "monitor")
//                 router.replace("/(monitor)/(tabs)/Dashboard" as any);
//               else router.replace("/(user)/(tabs)/Home" as any);
//             }
//           }
//         } else {
//           setUser(null);
//           await AsyncStorage.removeItem("userData");
//           router.replace("/(auth)/SignIn");
//         }

//         setLoading(false);
//         await SplashScreen.hideAsync().catch(() => {});
//       });
//     };

//     initAuth();

//     return () => {
//       if (unsubscribe) unsubscribe();
//     };
//   }, []);

//   // 🔥 Subscribe to Global Name & Image
//   useEffect(() => {
//     const ref = doc(db, "app_settings", "global_identity");
//     const unsub = onSnapshot(ref, (snap) => {
//       if (snap.exists()) setGlobalIdentity(snap.data() as any);
//       else setGlobalIdentity(null);
//     });
//     return () => unsub();
//   }, []);

//   // 🔥 Admin can update Global Name + Photo
//   const updateGlobalIdentity = async (name: string, image?: string) => {
//     try {
//       let imageUrl = image;

//       if (image && image.startsWith("file://")) {
//         imageUrl = await uploadImageToCloudinary(image);
//       }

//       await setDoc(doc(db, "app_settings", "global_identity"), {
//         name,
//         profileImage: imageUrl || null,
//       });

//       ToastAndroid.show("Global identity updated", ToastAndroid.SHORT);
//     } catch (err) {
//       console.error("updateGlobalIdentity", err);
//       ToastAndroid.show("Failed to update identity", ToastAndroid.SHORT);
//     }
//   };

//   const signUp = async (
//     fullName: string,
//     email: string,
//     password: string,
//     profileImage?: string
//   ) => {
//     try {
//       setLoading(true);
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const firebaseUser = userCredential.user;

//       let imageUrl: string | null = null;
//       if (profileImage) {
//         imageUrl = await uploadImageToCloudinary(profileImage);
//       }

//       await createUserInFirestore(
//         firebaseUser.uid,
//         fullName,
//         email,
//         imageUrl,
//         "user"
//       );

//       const userData = await fetchUserData(firebaseUser.uid);
//       if (userData) {
//         await AsyncStorage.setItem("userData", JSON.stringify(userData));
//         setUser(userData);
//         ToastAndroid.show(
//           `Welcome, ${userData.fullName}! Account created successfully.`,
//           ToastAndroid.BOTTOM
//         );
//         router.replace("/(user)/(tabs)/Home" as any);
//       }
//     } catch (error: any) {
//       const message =
//         error.code === "auth/email-already-in-use"
//           ? "This email is already registered. Please sign in."
//           : "Failed to create account. Try again.";
//       ToastAndroid.show(message, ToastAndroid.BOTTOM);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signIn = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const firebaseUser = userCredential.user;

//       const userData = await fetchUserData(firebaseUser.uid);
//       if (userData) {
//         await AsyncStorage.setItem("userData", JSON.stringify(userData));
//         setUser(userData);
//         ToastAndroid.show(
//           `Welcome back, ${userData.fullName}! 👋`,
//           ToastAndroid.BOTTOM
//         );

//         if (userData.role === "admin")
//           router.replace("/(admin)/(tabs)/Dashboard");
//         else if (userData.role === "monitor")
//           router.replace("/(monitor)/(tabs)/Dashboard" as any);
//         else router.replace("/(user)/(tabs)/Home" as any);
//       }
//     } catch (error: any) {
//       ToastAndroid.show(
//         error.code === "auth/invalid-credential"
//           ? "Incorrect email or password."
//           : "Failed to sign in. Try again.",
//         ToastAndroid.BOTTOM
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       await AsyncStorage.removeItem("userData");
//       setUser(null);
//       ToastAndroid.show("Logged out successfully", ToastAndroid.BOTTOM);
//       router.replace("/(auth)/SignIn");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   const refreshUser = async () => {
//     if (user?.uid) {
//       const updatedData = await fetchUserData(user.uid);
//       if (updatedData) {
//         setUser(updatedData);
//         await AsyncStorage.setItem("userData", JSON.stringify(updatedData));
//       }
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         signUp,
//         signIn,
//         logout,
//         refreshUser,
//         globalIdentity, // ⭐ ADDED
//         updateGlobalIdentity, // ⭐ ADDED
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => useContext(AuthContext);
