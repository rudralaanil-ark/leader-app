import GlossyBackground from "@/componenets/Shared/GlossyBackground";
import Colors from "@/data/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BACKEND_URL = "http://10.149.125.170:8080"; // change this to your backend IP

export default function EditMonitorsScreen() {
  const [monitors, setMonitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const router = useRouter();

  const fetchMonitors = async () => {
    try {
      setLoading(true);
      const user = getAuth().currentUser;
      if (!user) {
        Alert.alert("Session Expired", "Please log in again.");
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch(`${BACKEND_URL}/admin/monitors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMonitors(data);
    } catch (e) {
      Alert.alert("Error", "Unable to load monitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  const handleSaveChanges = async (uid: string) => {
    try {
      const user = getAuth().currentUser;
      const token = await user?.getIdToken();
      if (!token) return Alert.alert("Session expired, please login again.");

      // ✅ Detect which fields changed
      const requests: Promise<any>[] = [];

      if (editedEmail.trim()) {
        requests.push(
          fetch(`${BACKEND_URL}/admin/update-email`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid, newEmail: editedEmail }),
          })
        );
      }

      if (editedPassword.trim()) {
        requests.push(
          fetch(`${BACKEND_URL}/admin/update-password`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid, newPassword: editedPassword }),
          })
        );
      }

      if (requests.length === 0) {
        Alert.alert("No changes detected", "Please modify email or password.");
        return;
      }

      await Promise.all(requests);
      Alert.alert("Success", "Changes saved successfully 🎉");

      setEditingUid(null);
      setEditedEmail("");
      setEditedPassword("");
      fetchMonitors();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save changes");
    }
  };

  const handleDelete = async (uid: string) => {
    Alert.alert("Delete Monitor", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const user = getAuth().currentUser;
          const token = await user?.getIdToken();
          await fetch(`${BACKEND_URL}/admin/delete-monitor/${uid}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchMonitors();
        },
      },
    ]);
  };

  const handleToggleStatus = async (uid: string, currentStatus: boolean) => {
    const user = getAuth().currentUser;
    const token = await user?.getIdToken();
    await fetch(`${BACKEND_URL}/admin/set-status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, status: !currentStatus }),
    });
    fetchMonitors();
  };

  const renderMonitorCard = ({ item }: { item: any }) => {
    const isEditing = editingUid === item.uid;
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={
              item.profileImage
                ? { uri: item.profileImage }
                : require("@/assets/images/profile.png")
            }
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text
              style={[
                styles.status,
                { color: item.status ? Colors.success : Colors.error },
              ]}
            >
              {item.status ? "Active" : "Inactive"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
              );
              setEditingUid(isEditing ? null : item.uid);
            }}
          >
            <Ionicons
              name={isEditing ? "close-circle-outline" : "create-outline"}
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>

        {isEditing && (
          <View style={styles.editContainer}>
            <TextInput
              placeholder="New Email"
              placeholderTextColor={Colors.textMuted}
              value={editedEmail}
              onChangeText={setEditedEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="New Password"
              placeholderTextColor={Colors.textMuted}
              value={editedPassword}
              onChangeText={setEditedPassword}
              secureTextEntry
              style={styles.input}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: Colors.success },
                ]}
                onPress={() => handleSaveChanges(item.uid)}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: Colors.warning },
                ]}
                onPress={() => handleToggleStatus(item.uid, item.status)}
              >
                <Ionicons name="swap-horizontal" size={20} color="#fff" />
                <Text style={styles.actionText}>
                  {item.status ? "Deactivate" : "Activate"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: Colors.error }]}
                onPress={() => handleDelete(item.uid)}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <GlossyBackground>
      <View style={styles.container}>
        <Text style={styles.header}>👥 Manage Monitors</Text>

        <FlatList
          data={monitors}
          renderItem={renderMonitorCard}
          keyExtractor={(i) => i.uid}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchMonitors}
        />

        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/(admin)/(tabs)/ManageMonitors")}
        >
          <Ionicons name="add" size={32} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </GlossyBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 12,
  },
  name: { fontSize: 17, fontWeight: "700", color: Colors.textPrimary },
  email: { color: Colors.textSecondary, fontSize: 14 },
  status: { marginTop: 4, fontWeight: "600", fontSize: 13 },
  editContainer: { marginTop: 12, paddingTop: 8 },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 4,
  },
  actionText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
