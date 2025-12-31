// // app/(monitor)/(tabs)/Monitor.tsx
// import LogoutScreen from "@/app/Screens/LogoutScreen";

// export default function MonitorLogout() {
//   return <LogoutScreen />;
// }

// app/(monitor)/(tabs)/Monitor.tsx
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function Monitor() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();

    if (Platform.OS === "android") {
      Alert.alert("Logged out", "You have been logged out successfully");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* STATUS BAR */}
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={{ uri: user?.profileImage || DEFAULT_IMAGE }}
            style={styles.avatar}
          />

          <View>
            <Text style={styles.name}>{user?.fullName || "Monitor"}</Text>
            <Text style={styles.role}>
              {(user?.role || "monitor").toUpperCase()}
            </Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.grid}>
          <ActionCard
            icon="chatbubbles-outline"
            label="Complaints"
            onPress={() => router.push("/(monitor)/(tabs)/Complaints")}
          />
          <ActionCard
            icon="stats-chart-outline"
            label="Polls"
            onPress={() => router.push("/(monitor)/(tabs)/Polls")}
          />
          <ActionCard
            icon="videocam-outline"
            label="Videos"
            onPress={() => router.push("/(monitor)/(tabs)/ManageVideos")}
          />
        </View>

        {/* CONTENT */}
        <Text style={styles.sectionTitle}>Content</Text>

        <View style={styles.grid}>
          <ActionCard
            icon="newspaper-outline"
            label="News"
            onPress={() => router.push("/(monitor)/(tabs)/NewsList")}
          />
          <ActionCard
            icon="calendar-outline"
            label="Events"
            onPress={() => router.push("/(monitor)/(tabs)/EventList")}
          />
        </View>

        {/* LOGOUT */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* BOTTOM SAFE SPACE */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- ACTION CARD ---------- */

function ActionCard({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={28} color={Colors.primary} />
      <Text style={styles.cardText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 14,
    backgroundColor: Colors.surfaceDark,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  role: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 10,
    marginTop: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 22,
    alignItems: "center",
    marginBottom: 12,
    elevation: Platform.OS === "android" ? 2 : 0,
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.08 : 0,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },

  logoutSection: {
    marginTop: 30,
  },

  logoutBtn: {
    backgroundColor: Colors.error,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 8,
  },
});
