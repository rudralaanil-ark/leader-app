import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
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
      colors={[Colors.primary, Colors.secondary, Colors.background]}
      style={styles.container}
    >
      <View style={styles.card}>
        <Image
          source={{
            uri:
              user?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{user?.fullName || "User"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>
          Role: {user?.role?.toUpperCase() || "USER"}
        </Text>

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

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={[Colors.secondary, Colors.primary]}
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
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
    backdropFilter: "blur(15px)",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "white",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  email: {
    fontSize: 15,
    color: "#f0f0f0",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
  },
  infoText: {
    fontSize: 14,
    color: "white",
    marginBottom: 8,
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
