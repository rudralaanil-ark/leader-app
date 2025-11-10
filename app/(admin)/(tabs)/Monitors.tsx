import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface MonitorData {
  uid: string;
  fullName: string;
  email: string;
  status: boolean;
  createdAt?: any;
  profileImage?: string | null;
  role?: string;
  createdBy?: string;
}

const BACKEND_URL = "http://10.141.73.170:8080"; // Replace with your IP

export default function MonitorsScreen() {
  const [monitors, setMonitors] = useState<MonitorData[]>([]);
  const [loading, setLoading] = useState(false);

  // Editing state
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  // Fetch monitors
  const fetchMonitors = async (): Promise<void> => {
    try {
      console.log("Fetching monitors...");
      setLoading(true);
      const user = getAuth().currentUser;
      if (!user) {
        Alert.alert("Session Expired", "Please log in again.");
        setLoading(false);
        return;
      }
      const token = await user?.getIdToken();
      console.log("Token retrieved:", token ? "Yes" : "No");

      const response = await fetch(`${BACKEND_URL}/admin/monitors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Backend error:", errText);
        Alert.alert("Error", `Failed to fetch monitors (${response.status})`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Monitors fetched:", data);
      setMonitors(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load monitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  // Update email
  const handleUpdateEmail = async (uid: string) => {
    if (!editedEmail) return Alert.alert("Error", "Enter new email first");
    try {
      const user = getAuth().currentUser;
      const token = await user?.getIdToken();
      const res = await fetch(`${BACKEND_URL}/admin/update-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, newEmail: editedEmail }),
      });
      const data = await res.json();
      Alert.alert("Success", data.message || "Email updated");
      handleCancel(); // reset
      fetchMonitors();
    } catch (err) {
      Alert.alert("Error", "Failed to update email");
    }
  };

  // Update password
  const handleUpdatePassword = async (uid: string) => {
    if (!editedPassword)
      return Alert.alert("Error", "Enter new password first");
    try {
      const user = getAuth().currentUser;
      const token = await user?.getIdToken();
      const res = await fetch(`${BACKEND_URL}/admin/update-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, newPassword: editedPassword }),
      });
      const data = await res.json();
      Alert.alert("Success", data.message || "Password updated");
      handleCancel(); // reset
    } catch (err) {
      Alert.alert("Error", "Failed to update password");
    }
  };

  // Toggle status
  const handleToggleStatus = async (uid: string, currentStatus: boolean) => {
    try {
      const user = getAuth().currentUser;
      const token = await user?.getIdToken();
      const res = await fetch(`${BACKEND_URL}/admin/set-status`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, status: !currentStatus }),
      });
      const data = await res.json();
      Alert.alert("Success", data.message || "Status changed");
      fetchMonitors();
    } catch (err) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingUid(null);
    setEditedEmail("");
    setEditedPassword("");
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const handleDeleteMonitor = async (uid: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this monitor?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = getAuth().currentUser;
              const token = await user?.getIdToken();
              const res = await fetch(
                `${BACKEND_URL}/admin/delete-monitor/${uid}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              const data = await res.json();
              Alert.alert("Success", data.message || "Monitor deleted");
              fetchMonitors(); // refresh list
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete monitor");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Monitors List
      </Text>
      <FlatList
        data={monitors as MonitorData[]}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              padding: 12,
              marginBottom: 10,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {item.fullName}
            </Text>
            <Text>Email: {item.email}</Text>
            <Text>Status: {item.status ? "Active ✅" : "Inactive ❌"}</Text>

            {editingUid === item.uid ? (
              <View style={{ marginTop: 10 }}>
                {/* Email input */}
                <TextInput
                  placeholder="New Email"
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#ccc",
                    marginVertical: 8,
                    padding: 6,
                  }}
                />
                <TouchableOpacity
                  onPress={() => handleUpdateEmail(item.uid)}
                  style={{
                    backgroundColor: "#007bff",
                    padding: 8,
                    borderRadius: 5,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Save Email
                  </Text>
                </TouchableOpacity>

                {/* Password input */}
                <TextInput
                  placeholder="New Password"
                  value={editedPassword}
                  onChangeText={setEditedPassword}
                  secureTextEntry
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#ccc",
                    marginVertical: 8,
                    padding: 6,
                  }}
                />
                <TouchableOpacity
                  onPress={() => handleUpdatePassword(item.uid)}
                  style={{
                    backgroundColor: "green",
                    padding: 8,
                    borderRadius: 5,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Save Password
                  </Text>
                </TouchableOpacity>

                {/* Cancel button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "gray",
                    padding: 8,
                    borderRadius: 8,
                  }}
                  onPress={handleCancel}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setEditingUid(item.uid)}
                style={{
                  backgroundColor: "#f0ad4e",
                  padding: 8,
                  borderRadius: 5,
                  marginTop: 8,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>Edit</Text>
              </TouchableOpacity>
            )}

            {/* Status toggle */}
            <TouchableOpacity
              onPress={() => handleToggleStatus(item.uid, item.status)}
              style={{
                backgroundColor: item.status ? "#dc3545" : "#28a745",
                padding: 8,
                borderRadius: 5,
                marginTop: 8,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                {item.status ? "Deactivate" : "Activate"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteMonitor(item.uid)}
              style={{
                backgroundColor: "#d9534f",
                padding: 8,
                borderRadius: 5,
                marginTop: 8,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        refreshing={loading}
        onRefresh={fetchMonitors}
      />
    </View>
  );
}
