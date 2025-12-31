// import LogoutScreen from "@/app/Screens/LogoutScreen";

// export default function AdminLogout() {
//   return <LogoutScreen />;
// }

// // app/(admin)/(tabs)/Admin.tsx
// import { uploadImageToCloudinary } from "@/app/api/uploadImage";
// // import uploadImageToCloudinary from "@/app/api/uploadImage";
// import { db } from "@/configs/FirebaseConfig";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   ToastAndroid,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// export default function Admin() {
//   const { logout } = useAuth();
//   const router = useRouter();

//   const [displayName, setDisplayName] = useState("LeaderApp Member");
//   const [profileImage, setProfileImage] = useState(DEFAULT_IMAGE);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const scaleAnim = useRef(new Animated.Value(1)).current;

//   // 🟣 Fetch identity from Firestore
//   useEffect(() => {
//     const loadSettings = async () => {
//       try {
//         const snap = await getDoc(doc(db, "settings", "postIdentity"));
//         if (snap.exists()) {
//           const data = snap.data();
//           if (data.displayName) setDisplayName(data.displayName);
//           if (typeof data.profileImage === "string")
//             setProfileImage(data.profileImage);
//         }
//       } catch (e) {
//         console.log("Settings fetch error", e);
//       }
//       setLoading(false);
//     };
//     loadSettings();
//   }, []);

//   // ✨ Animation
//   const runSuccessAnimation = () => {
//     Animated.sequence([
//       Animated.timing(scaleAnim, {
//         toValue: 1.15,
//         duration: 150,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 150,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   // 🟣 Choose image source popup
//   const pickImage = () => {
//     Alert.alert("Select Image", "Choose source", [
//       { text: "Camera", onPress: () => openPicker("camera") },
//       { text: "Gallery", onPress: () => openPicker("gallery") },
//       { text: "Cancel", style: "cancel" },
//     ]);
//   };

//   // 🔵 Open Image Picker → Upload → Save local
//   const openPicker = async (source: "camera" | "gallery") => {
//     try {
//       let result;
//       if (source === "camera") {
//         result = await ImagePicker.launchCameraAsync({
//           allowsEditing: true,
//           aspect: [1, 1],
//           quality: 0.8,
//         });
//       } else {
//         result = await ImagePicker.launchImageLibraryAsync({
//           allowsEditing: true,
//           aspect: [1, 1],
//           quality: 0.8,
//         });
//       }

//       if (!result || result.canceled) return;

//       const uri = result.assets?.[0]?.uri;
//       if (!uri) return;

//       setUploading(true);

//       const uploaded = await uploadImageToCloudinary(uri);
//       console.log("Uploaded: ", uploaded);

//       if (uploaded && typeof uploaded.url === "string") {
//         setProfileImage(uploaded.url);
//         ToastAndroid.show("Image updated!", ToastAndroid.BOTTOM);
//       } else {
//         ToastAndroid.show("Upload failed!", ToastAndroid.BOTTOM);
//       }
//     } catch (err) {
//       console.log("Image upload error:", err);
//       Alert.alert("Error", "Failed to upload image");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // 🔥 Save settings to Firestore
//   const handleSave = async () => {
//     try {
//       await setDoc(doc(db, "settings", "postIdentity"), {
//         displayName,
//         profileImage, // STRING only — prevents crash ✔
//       });

//       runSuccessAnimation();
//       ToastAndroid.show("Settings saved 🎉", ToastAndroid.BOTTOM);
//     } catch (e) {
//       Alert.alert("Error", "Failed to update settings");
//       console.log(e);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center" }}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={{ flex: 1, backgroundColor: Colors.background }}
//       contentContainerStyle={{ padding: 20 }}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* LOGOUT BUTTON */}
//       <TouchableOpacity
//         style={styles.logoutButton}
//         onPress={async () => {
//           await logout();
//           ToastAndroid.show("Logged out 👋", ToastAndroid.BOTTOM);
//         }}
//       >
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>

//       {/* LOCATION MANAGEMENT */}
//       <TouchableOpacity
//         style={styles.locationButton}
//         onPress={() => router.push("/(admin)/locations")}
//       >
//         <Text style={styles.locationTitle}>📍 Manage Locations</Text>
//         <Text style={styles.locationSub}>
//           Districts • Constituencies • Cities • Villages
//         </Text>
//       </TouchableOpacity>

//       <Text style={styles.heading}>Default Post Identity</Text>
//       <Text style={styles.subtext}>
//         Users will see this identity instead of real profile
//       </Text>

//       <View style={styles.card}>
//         {/* Avatar */}
//         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//           <Image
//             source={{ uri: profileImage || DEFAULT_IMAGE }}
//             style={styles.avatar}
//           />
//         </Animated.View>

//         <TouchableOpacity style={styles.changeImgButton} onPress={pickImage}>
//           <Text style={styles.changeImgText}>
//             {uploading ? "Uploading..." : "Change Image"}
//           </Text>
//         </TouchableOpacity>

//         {/* Name */}
//         <Text style={styles.label}>Display Name</Text>
//         <TextInput
//           style={styles.input}
//           value={displayName}
//           onChangeText={setDisplayName}
//           placeholder="Enter custom name"
//           placeholderTextColor={Colors.textMuted}
//         />

//         <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//           <Text style={styles.saveText}>Save Changes</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={{ height: 60 }} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   heading: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//     marginTop: 20,
//   },
//   subtext: {
//     marginTop: 6,
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   card: {
//     backgroundColor: Colors.lightCard,
//     padding: 18,
//     marginTop: 20,
//     borderRadius: 16,
//     borderColor: Colors.border,
//     borderWidth: 1,
//   },
//   avatar: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     alignSelf: "center",
//     marginBottom: 12,
//     backgroundColor: "#ccc",
//   },
//   changeImgButton: {
//     alignSelf: "center",
//     marginBottom: 18,
//   },
//   changeImgText: {
//     color: Colors.primary,
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   label: {
//     color: Colors.textPrimary,
//     marginTop: 10,
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     backgroundColor: Colors.surface,
//     borderRadius: 10,
//     padding: 10,
//     marginTop: 8,
//     fontSize: 15,
//     color: Colors.textPrimary,
//   },
//   saveButton: {
//     backgroundColor: Colors.primary,
//     marginTop: 24,
//     paddingVertical: 13,
//     alignItems: "center",
//     borderRadius: 10,
//   },
//   saveText: {
//     color: Colors.textInverse,
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   logoutButton: {
//     backgroundColor: Colors.error,
//     paddingVertical: 12,
//     alignItems: "center",
//     borderRadius: 10,
//     marginTop: 10,
//     marginBottom: 12,
//   },
//   logoutText: {
//     color: Colors.textInverse,
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   locationButton: {
//     backgroundColor: Colors.surface,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: 14,
//     padding: 16,
//     marginTop: 10,
//   },
//   locationTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//   },
//   locationSub: {
//     marginTop: 4,
//     fontSize: 13,
//     color: Colors.textSecondary,
//   },
// });

// app/(admin)/(tabs)/Admin.tsx
import { uploadImageToCloudinary } from "@/app/api/uploadImage";
import { db } from "@/configs/FirebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function Admin() {
  const { logout } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("LeaderApp Member");
  const [profileImage, setProfileImage] = useState(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showIdentityEditor, setShowIdentityEditor] = useState(false);

  // 🔹 Home Screen Header Settings (NEW)
  const [homeName, setHomeName] = useState("Leader Name");
  const [homeTitle, setHomeTitle] = useState("Leader Title");
  const [homeImage, setHomeImage] = useState(DEFAULT_IMAGE);
  const [homeUploading, setHomeUploading] = useState(false);
  const [showHomeHeaderEditor, setShowHomeHeaderEditor] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  /* LOAD DEFAULT POST IDENTITY */
  useEffect(() => {
    const loadSettings = async () => {
      // 🔹 Load Home Header settings (NEW)
      const homeSnap = await getDoc(doc(db, "settings", "homeHeader"));
      if (homeSnap.exists()) {
        const d = homeSnap.data();
        if (d.name) setHomeName(d.name);
        if (d.title) setHomeTitle(d.title);
        if (d.image) setHomeImage(d.image);
      }

      const snap = await getDoc(doc(db, "settings", "postIdentity"));
      if (snap.exists()) {
        const d = snap.data();
        if (d.displayName) setDisplayName(d.displayName);
        if (d.profileImage) setProfileImage(d.profileImage);
      }
      setLoading(false);
    };

    loadSettings();
  }, []);

  const runSuccessAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.08,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pickImage = () => {
    Alert.alert("Change Image", "Select source", [
      { text: "Camera", onPress: () => openPicker("camera") },
      { text: "Gallery", onPress: () => openPicker("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // 🔹 Pick image for Home Header (NEW)
  const pickHomeImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9], // portrait image for home
    });

    if (result.canceled) return;

    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    setHomeUploading(true);
    const uploaded = await uploadImageToCloudinary(uri);
    if (uploaded?.url) setHomeImage(uploaded.url);
    setHomeUploading(false);
  };

  const openPicker = async (source: "camera" | "gallery") => {
    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({ allowsEditing: true })
        : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true });

    if (result.canceled) return;

    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    setUploading(true);
    const uploaded = await uploadImageToCloudinary(uri);
    if (uploaded?.url) setProfileImage(uploaded.url);
    setUploading(false);
  };

  const handleSave = async () => {
    await setDoc(doc(db, "settings", "postIdentity"), {
      displayName,
      profileImage,
    });
    runSuccessAnimation();
    ToastAndroid.show("Saved", ToastAndroid.BOTTOM);
    setShowIdentityEditor(false);
  };
  // 🔹 Save Home Header settings (NEW)
  const saveHomeHeader = async () => {
    await setDoc(doc(db, "settings", "homeHeader"), {
      name: homeName,
      title: homeTitle,
      image: homeImage,
    });

    ToastAndroid.show("Home Header Updated", ToastAndroid.BOTTOM);
    setShowHomeHeaderEditor(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* ADMIN ACTIONS */}
      <Text style={styles.sectionTitle}>Admin Actions</Text>

      <View style={styles.grid}>
        <AdminAction
          icon="people-outline"
          label="Monitors"
          onPress={() => router.push("/(admin)/(tabs)/ManageMonitors")}
        />
        <AdminAction
          icon="person-outline"
          label="Users"
          onPress={() => router.push("/(admin)/(tabs)/ManageUsers")}
        />
        <AdminAction
          icon="clipboard-outline"
          label="Surveys"
          onPress={() => router.push("/(admin)/(tabs)/AdminSurveyManager")}
        />
        <AdminAction
          icon="stats-chart-outline"
          label="Polls"
          onPress={() => router.push("/(admin)/(tabs)/Polls")}
        />

        <AdminAction
          icon="chatbubbles-outline"
          label="Complaints"
          onPress={() => router.push("/(admin)/(tabs)/Complaints")}
        />
      </View>

      {/* SETTINGS */}
      <Text style={styles.sectionTitle}>Settings</Text>

      <TouchableOpacity
        style={styles.settingRow}
        onPress={() => setShowIdentityEditor((p) => !p)}
        activeOpacity={0.8}
      >
        <View>
          <Text style={styles.settingTitle}>Default Post Identity</Text>
          <Text style={styles.settingSub}>Identity shown on posts</Text>
        </View>
        <Ionicons
          name={showIdentityEditor ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.textMuted}
        />
      </TouchableOpacity>

      {/* INLINE EXPANDABLE EDITOR */}
      {showIdentityEditor && (
        <View style={styles.identityBox}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          </Animated.View>

          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.linkText}>
              {uploading ? "Uploading..." : "Change Image"}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Display Name"
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowIdentityEditor(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 🔹 HOME SCREEN HEADER SETTINGS */}
      <TouchableOpacity
        style={styles.settingRow}
        onPress={() => setShowHomeHeaderEditor((p) => !p)}
        activeOpacity={0.8}
      >
        <View>
          <Text style={styles.settingTitle}>Home Screen Header</Text>
          <Text style={styles.settingSub}>
            Image, name & title shown on users home screen (16:9 ratio)
          </Text>
        </View>
        <Ionicons
          name={showHomeHeaderEditor ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.textMuted}
        />
      </TouchableOpacity>

      {showHomeHeaderEditor && (
        <View style={styles.identityBox}>
          <Image source={{ uri: homeImage }} style={styles.avatar} />

          <TouchableOpacity onPress={pickHomeImage}>
            <Text style={styles.linkText}>
              {homeUploading ? "Uploading..." : "Change Home Image"}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={homeName}
            onChangeText={setHomeName}
            placeholder="Leader Name"
          />

          <TextInput
            style={styles.input}
            value={homeTitle}
            onChangeText={setHomeTitle}
            placeholder="Leader Title"
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowHomeHeaderEditor(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={saveHomeHeader}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await logout();
          ToastAndroid.show("Logged out", ToastAndroid.BOTTOM);
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function AdminAction({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <Ionicons name={icon} size={26} color={Colors.primary} />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 12,
  },

  actionText: { marginTop: 8, fontWeight: "600" },

  settingRow: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  settingTitle: { fontSize: 16, fontWeight: "600" },
  settingSub: { marginTop: 4, fontSize: 13, color: Colors.textSecondary },

  identityBox: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    marginBottom: 16,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: 10,
  },

  linkText: {
    textAlign: "center",
    color: Colors.primary,
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  cancelBtn: { padding: 12, marginRight: 12 },
  cancelText: { color: Colors.textSecondary, fontWeight: "700" },

  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },

  saveText: { color: Colors.textInverse, fontWeight: "700" },

  logoutButton: {
    backgroundColor: Colors.error,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  logoutText: { color: Colors.textInverse, fontWeight: "700" },
});
