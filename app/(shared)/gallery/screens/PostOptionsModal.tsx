// updating code according to the roles :

import Colors from "@/data/Colors";
import React from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PostOptionsModal({
  visible,
  onClose,
  onEdit,
  onDelete,
  userRole, // ⭐ NEW (admin | monitor | user)
}: {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  userRole: "admin" | "monitor" | "user"; // ⭐ NEW
}) {
  const canModify = userRole === "admin" || userRole === "monitor";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Post Options</Text>

          <View style={{ marginTop: 18 }}>
            {/* ONLY admin/monitor see Edit/Delete */}
            {canModify && (
              <>
                <TouchableOpacity style={styles.row} onPress={onEdit}>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.row} onPress={onDelete}>
                  <Text style={[styles.actionText, { color: Colors.error }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.row} onPress={onClose}>
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
    padding: 24,
  },
  sheet: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: Colors.lightCard,
    borderRadius: 12,
    padding: 18,
  },
  title: { fontSize: 18, fontWeight: "700", color: Colors.textPrimary },
  row: {
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  actionText: { fontSize: 16, color: Colors.textPrimary, fontWeight: "600" },
});
