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

//these imports for notifications
import { registerForPushNotifications } from "@/app/utils/notifications";
import * as Notifications from "expo-notifications";

import messaging from "@react-native-firebase/messaging";
import { initFCM } from "@/app/utils/fcm";

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

  // // this useEffect is for handling notification clicks
  // useEffect(() => {
  //   const subscription = Notifications.addNotificationResponseReceivedListener(
  //     (response) => {
  //       const data = response.notification.request.content.data as any;

  //       if (data?.type === "news" && data?.id) {
  //         router.push({
  //           pathname: "/(user)/NewsDetails",
  //           params: { id: data.id },
  //         });
  //       }
  //     }
  //   );

  //   return () => subscription.remove();
  // }, []);

  // this useEffect is for handling when app is opened from background or quit state
  useEffect(() => {
    // App opened from quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage?.data?.type === "news") {
          router.push({
            pathname: "/(user)/NewsDetails",
            params: { id: remoteMessage.data.id },
          });
        }
      });

    // App opened from background
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage?.data?.type === "news") {
        router.push({
          pathname: "/(user)/NewsDetails",
          params: { id: remoteMessage.data.id },
        });
      }
    });

    return unsubscribe;
  }, []);

  // this useEffect is for handling foreground messages
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("🔔 Foreground FCM:", remoteMessage);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribe: any;
    const initAuth = async () => {
      await loadUserFromStorage();

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userData = await fetchUserData(firebaseUser.uid);
          if (userData) {
            setUser(userData);
            await AsyncStorage.setItem("userData", JSON.stringify(userData));

            // 🔔 Register push notifications
            // registerForPushNotifications().then((token) => {
            //   if (token) {
            //     console.log("🔔 Push notifications enabled");
            //   }
            // });
            initFCM();

            if (router && !router.canGoBack()) {
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
