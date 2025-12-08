// import LogoutScreen from "@/app/Screens/LogoutScreen";

// export default function AdminLogout() {
//   return <LogoutScreen />;
// }

import { uploadImageToCloudinary } from "@/app/api/uploadImage";
// import uploadImageToCloudinary from "@/app/api/uploadImage";
import { db } from "@/configs/FirebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import * as ImagePicker from "expo-image-picker";
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

  const [displayName, setDisplayName] = useState("LeaderApp Member");
  const [profileImage, setProfileImage] = useState(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 🟣 Fetch identity from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "postIdentity"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.displayName) setDisplayName(data.displayName);
          if (typeof data.profileImage === "string")
            setProfileImage(data.profileImage);
        }
      } catch (e) {
        console.log("Settings fetch error", e);
      }
      setLoading(false);
    };
    loadSettings();
  }, []);

  // ✨ Animation
  const runSuccessAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🟣 Choose image source popup
  const pickImage = () => {
    Alert.alert("Select Image", "Choose source", [
      { text: "Camera", onPress: () => openPicker("camera") },
      { text: "Gallery", onPress: () => openPicker("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // 🔵 Open Image Picker → Upload → Save local
  const openPicker = async (source: "camera" | "gallery") => {
    try {
      let result;
      if (source === "camera") {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result || result.canceled) return;

      const uri = result.assets?.[0]?.uri;
      if (!uri) return;

      setUploading(true);

      const uploaded = await uploadImageToCloudinary(uri);
      console.log("Uploaded: ", uploaded);

      if (uploaded && typeof uploaded.url === "string") {
        setProfileImage(uploaded.url);
        ToastAndroid.show("Image updated!", ToastAndroid.BOTTOM);
      } else {
        ToastAndroid.show("Upload failed!", ToastAndroid.BOTTOM);
      }
    } catch (err) {
      console.log("Image upload error:", err);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // 🔥 Save settings to Firestore
  const handleSave = async () => {
    try {
      await setDoc(doc(db, "settings", "postIdentity"), {
        displayName,
        profileImage, // STRING only — prevents crash ✔
      });

      runSuccessAnimation();
      ToastAndroid.show("Settings saved 🎉", ToastAndroid.BOTTOM);
    } catch (e) {
      Alert.alert("Error", "Failed to update settings");
      console.log(e);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* LOGOUT BUTTON */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await logout();
          ToastAndroid.show("Logged out 👋", ToastAndroid.BOTTOM);
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Default Post Identity</Text>
      <Text style={styles.subtext}>
        Users will see this identity instead of real profile
      </Text>

      <View style={styles.card}>
        {/* Avatar */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Image
            source={{ uri: profileImage || DEFAULT_IMAGE }}
            style={styles.avatar}
          />
        </Animated.View>

        <TouchableOpacity style={styles.changeImgButton} onPress={pickImage}>
          <Text style={styles.changeImgText}>
            {uploading ? "Uploading..." : "Change Image"}
          </Text>
        </TouchableOpacity>

        {/* Name */}
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter custom name"
          placeholderTextColor={Colors.textMuted}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 20,
  },
  subtext: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.lightCard,
    padding: 18,
    marginTop: 20,
    borderRadius: 16,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: "center",
    marginBottom: 12,
    backgroundColor: "#ccc",
  },
  changeImgButton: {
    alignSelf: "center",
    marginBottom: 18,
  },
  changeImgText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  label: {
    color: Colors.textPrimary,
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    marginTop: 24,
    paddingVertical: 13,
    alignItems: "center",
    borderRadius: 10,
  },
  saveText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: Colors.error,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 12,
  },
  logoutText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: "700",
  },
});
