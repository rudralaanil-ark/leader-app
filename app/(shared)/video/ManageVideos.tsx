import { postsService } from "@/app/services/postsService";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ManageVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const { user } = useAuth();
  const role = user?.role ?? "user";

  useEffect(() => {
    const unsub = postsService.subscribeToPostType("video", (list) => {
      if (role === "admin") {
        setVideos(list);
      } else {
        setVideos(list.filter((i) => i.ownerId === user?.uid));
      }
    });

    return unsub;
  }, [role]);

  const handleDelete = async (id: string, ownerId: string) => {
    if (role === "monitor" && ownerId !== user?.uid) {
      return alert("Cannot delete admin's videos");
    }
    await postsService.deletePost(id);
  };

  if (role !== "admin" && role !== "monitor") {
    return (
      <View style={styles.deniedContainer}>
        <Text style={styles.deniedText}>
          You are not allowed to manage videos
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title ?? "Untitled Video"}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id, item.ownerId)}
          >
            <Text style={{ color: "#fff" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e8e8e8",
    padding: 16,
    margin: 12,
    borderRadius: 12,
  },
  title: { fontWeight: "700", marginBottom: 10 },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deniedContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  deniedText: { color: "red", fontSize: 16, fontWeight: "600" },
});
