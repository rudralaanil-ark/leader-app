// // app/(admin)/(tabs)/AddMonitor.tsx
// import { createUserInFirestore } from "@/app/api/users";
// import { getSecondaryAuth } from "@/configs/FirebaseConfig";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import * as Haptics from "expo-haptics";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   BackHandler,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function ManageMonitors() {
//   const [email, setEmail] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const { user } = useAuth();
//   const router = useRouter();

//   // ✅ Android back button handler
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       () => {
//         router.replace("/(admin)/(tabs)/ManageMonitors");
//         return true;
//       }
//     );
//     return () => backHandler.remove();
//   }, []);

//   const handleCreateMonitor = async () => {
//     if (!email || !password || !fullName) {
//       Alert.alert("Missing Info", "Please fill all fields before continuing.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const secondaryAuth = getSecondaryAuth();
//       const userCredential = await createUserWithEmailAndPassword(
//         secondaryAuth,
//         email.trim(),
//         password
//       );
//       const newUser = userCredential.user;

//       await createUserInFirestore(
//         newUser.uid,
//         fullName.trim(),
//         email.trim(),
//         null,
//         "monitor",
//         user?.uid || null
//       );

//       await signOut(secondaryAuth);

//       // ✅ Haptic + animation
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//       Animated.sequence([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 400,
//           useNativeDriver: true,
//         }),
//         Animated.delay(800),
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//       ]).start(() => router.replace("/(admin)/(tabs)/Monitors"));

//       // reset form
//       setEmail("");
//       setFullName("");
//       setPassword("");
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "Failed to create monitor. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LinearGradient
//       colors={Colors.gradientBackground}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.container}
//     >
//       <KeyboardAvoidingView
//         style={{ flex: 1, justifyContent: "center" }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <View style={styles.card}>
//           <Text style={styles.title}>Create New Monitor</Text>

//           <TextInput
//             placeholder="Full Name"
//             placeholderTextColor={Colors.textMuted}
//             value={fullName}
//             onChangeText={setFullName}
//             style={styles.input}
//           />

//           <TextInput
//             placeholder="Email"
//             placeholderTextColor={Colors.textMuted}
//             keyboardType="email-address"
//             value={email}
//             onChangeText={setEmail}
//             style={styles.input}
//           />

//           <TextInput
//             placeholder="Password"
//             placeholderTextColor={Colors.textMuted}
//             secureTextEntry
//             value={password}
//             onChangeText={setPassword}
//             style={styles.input}
//           />

//           <TouchableOpacity
//             style={[styles.button, loading && { opacity: 0.7 }]}
//             disabled={loading}
//             onPress={handleCreateMonitor}
//             activeOpacity={0.8}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>Create Monitor</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* ✅ Success animation */}
//         <Animated.View
//           style={[
//             styles.successPopup,
//             {
//               opacity: fadeAnim,
//               transform: [
//                 {
//                   scale: fadeAnim.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: [0.7, 1],
//                   }),
//                 },
//               ],
//             },
//           ]}
//         >
//           <Text style={styles.successIcon}>✅</Text>
//         </Animated.View>
//       </KeyboardAvoidingView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   card: {
//     marginHorizontal: 24,
//     backgroundColor: Colors.card,
//     borderRadius: 20,
//     padding: 22,
//     shadowColor: Colors.shadow,
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 8,
//     borderWidth: 0.5,
//     borderColor: Colors.border,
//     backdropFilter: "blur(10px)",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: Colors.primary,
//     textAlign: "center",
//     marginBottom: 22,
//   },
//   input: {
//     backgroundColor: Colors.surface,
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     color: Colors.textPrimary,
//     fontSize: 15,
//     marginBottom: 12,
//     shadowColor: Colors.shadow,
//     shadowOpacity: 0.05,
//     elevation: 2,
//   },
//   button: {
//     backgroundColor: Colors.primary,
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: Colors.strongShadow,
//     shadowOpacity: 0.3,
//     elevation: 4,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: Colors.textInverse,
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   successPopup: {
//     position: "absolute",
//     bottom: "45%",
//     alignSelf: "center",
//     backgroundColor: Colors.success,
//     borderRadius: 50,
//     width: 90,
//     height: 90,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: Colors.shadow,
//     shadowOpacity: 0.3,
//     elevation: 8,
//   },
//   successIcon: {
//     fontSize: 40,
//     color: Colors.textInverse,
//   },
// });

// app/(admin)/(tabs)/AddMonitor.tsx
import { createUserInFirestore } from "@/app/api/users";
import { getSecondaryAuth } from "@/configs/FirebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ManageMonitors() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const { user } = useAuth();
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();

  /* ================= BACK HANDLER ================= */

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/(admin)/(tabs)/ManageMonitors");
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  /* ================= CREATE MONITOR ================= */

  const handleCreateMonitor = async () => {
    if (!email || !password || !fullName) {
      Alert.alert("Missing details", "Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const secondaryAuth = getSecondaryAuth();

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email.trim(),
        password
      );

      const newUser = userCredential.user;

      await createUserInFirestore(
        newUser.uid,
        fullName.trim(),
        email.trim(),
        null,
        "monitor",
        user?.uid || null
      );

      await signOut(secondaryAuth);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(700),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (from === "dashboard") {
          router.replace("/(admin)/(tabs)/Dashboard");
        } else {
          router.replace("/(admin)/(tabs)/ManageMonitors");
        }
      });

      setEmail("");
      setFullName("");
      setPassword("");
      setShowPassword(false);
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      if (error?.code === "auth/email-already-in-use") {
        message = "This email is already registered as a monitor.";
      } else if (error?.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error?.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      }

      Alert.alert("Unable to create monitor", message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <LinearGradient
      colors={Colors.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Create New Monitor</Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor={Colors.textMuted}
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          {/* 🔐 PASSWORD WITH SHOW / HIDE */}
          <View style={styles.passwordRow}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            disabled={loading}
            onPress={handleCreateMonitor}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Monitor</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ✅ SUCCESS CHECK */}
        <Animated.View
          style={[
            styles.successPopup,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.successIcon}>✅</Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },

  card: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 22,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 22,
  },

  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    fontSize: 15,
    marginBottom: 12,
  },

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  eyeButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.surfaceDark,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  eyeText: {
    fontWeight: "700",
    color: Colors.primary,
    fontSize: 13,
  },

  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: "700",
  },

  successPopup: {
    position: "absolute",
    bottom: "45%",
    alignSelf: "center",
    backgroundColor: Colors.success,
    borderRadius: 50,
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },

  successIcon: {
    fontSize: 40,
    color: Colors.textInverse,
  },
});
