import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { LogOut } from "lucide-react-native";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

export default function LogoutScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    ToastAndroid.show("Logged out successfully 👋", ToastAndroid.BOTTOM);
  };

  return (
    <LinearGradient
      colors={["#E3F2FD", "#E1F5FE", "#F3E5F5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.card}>
        {/* 🧑 Profile Avatar */}
        <Image
          source={{
            uri:
              user?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />

        {/* User Info */}
        <Text style={styles.name}>{user?.fullName || "User"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>{user?.role?.toUpperCase() || "USER"}</Text>

        {/* Account Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📅 Joined:{" "}
            {user?.createdAt
              ? format(user.createdAt.toDate(), "dd MMM yyyy")
              : "Not available"}
          </Text>
          <Text style={styles.infoText}>
            ⏱️ Last Login: {format(new Date(), "dd MMM yyyy, hh:mm a")}
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={["#007AFF", "#34C759"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <LogOut color="white" size={22} />
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  email: {
    fontSize: 15,
    color: "#555",
    marginTop: 2,
  },
  role: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    marginTop: 6,
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoBox: {
    backgroundColor: "#F8F9FA",
    width: "100%",
    padding: 14,
    borderRadius: 12,
    marginVertical: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  logoutButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
