//app\(shared)\gallery\components\ShareSheet.tsx

import { shareService } from "@/app/services/shareService";
import Colors from "@/data/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ShareSheet({
  visible,
  onClose,
  postId,
  title,
  url,
}: {
  visible: boolean;
  onClose: () => void;
  postId: string;
  title?: string;
  url?: string;
}) {
  const onShare = async () => {
    await shareService.sharePost({
      postId,
      text: title,
      url,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Share</Text>

          <TouchableOpacity style={styles.row} onPress={onShare}>
            <Ionicons name="share-social" size={22} color={Colors.primary} />
            <Text style={styles.text}>Share via apps</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  sheet: {
    width: "80%",
    backgroundColor: Colors.lightCard,
    borderRadius: 16,
    padding: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  cancel: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelText: {
    color: Colors.textSecondary,
    fontWeight: "600",
  },
});
