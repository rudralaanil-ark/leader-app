import { auth } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // ✅ Load user data from AsyncStorage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          setUser(JSON.parse(storedData));
        } else {
          ToastAndroid.show(
            "No user data found. Please sign in again.",
            ToastAndroid.BOTTOM
          );
          router.replace("/(auth)/SignIn");
        }
      } catch (error) {
        console.error("❌ Error loading user data:", error);
        ToastAndroid.show("Failed to load user data", ToastAndroid.BOTTOM);
      }
    };

    loadUserData();
  });

  // ✅ Handle sign-out
  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userData");
      ToastAndroid.show("Signed out successfully!", ToastAndroid.BOTTOM);
      router.replace("/(auth)/SignIn");
    } catch (error) {
      console.error("❌ Error signing out:", error);
      ToastAndroid.show("Error signing out", ToastAndroid.BOTTOM);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 18 }}>Loading your details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome 👋</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color={Colors.icons} />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={
            user.profileImage
              ? { uri: user.profileImage }
              : require("../../../assets/images/profile.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user.fullName}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* Example of future section */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Account Created On:</Text>
        <Text style={styles.infoValue}>
          {user.createdAt
            ? new Date(user.createdAt.seconds * 1000).toDateString()
            : "Not Available"}
        </Text>
      </View>
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 16,
    color: "gray",
    marginTop: 4,
  },
  infoContainer: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "gray",
  },
  infoValue: {
    fontSize: 16,
    color: "#000",
    marginTop: 4,
  },
});
