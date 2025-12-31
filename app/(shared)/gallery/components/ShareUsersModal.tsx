// (shared)/gallery/components/ShareUsersModal.tsx
import { shareService } from "@/app/services/shareService";
import Colors from "@/data/Colors";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ShareUsersModal({
  visible,
  postId,
  onClose,
}: {
  visible: boolean;
  postId: string;
  onClose: () => void;
}) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!visible || !postId) return;
    return shareService.subscribeToShares(postId, setUsers);
  }, [visible, postId]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Shares</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>

          {users.length === 0 ? (
            <Text style={styles.empty}>No shares yet</Text>
          ) : (
            <FlatList
              data={users}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Image
                    source={
                      item.profileImage ? { uri: item.profileImage } : undefined
                    }
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.meta}>
                      {item.role} · {item.platform}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: Colors.lightCard,
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  close: {
    color: Colors.primary,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    marginRight: 12,
  },
  name: {
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  meta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
