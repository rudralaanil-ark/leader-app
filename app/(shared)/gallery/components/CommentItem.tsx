// app/components/gallery/CommentItem.tsx
import Colors from "@/data/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CommentItem({
  comment,
  onReply,
  onDelete,
  currentUser,
}: {
  comment: any;
  onReply: (c: any) => void;
  onDelete: (id: string) => void;
  currentUser: { uid: string; role: string } | null;
}) {
  const canDelete =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "monitor");

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>
          {comment.userName}{" "}
          <Text style={styles.role}>· {comment.userRole}</Text>
        </Text>
        <Text style={styles.text}>{comment.text}</Text>

        {/* Replies */}
        {comment.replies?.length
          ? comment.replies.map((r: any) => (
              <View key={r.id} style={styles.reply}>
                <Text style={styles.name}>
                  {r.userName} <Text style={styles.role}>· {r.userRole}</Text>
                </Text>
                <Text style={styles.text}>{r.text}</Text>
              </View>
            ))
          : null}

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onReply(comment)}>
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>

          {canDelete && (
            <TouchableOpacity onPress={() => onDelete(comment.id)}>
              <Text style={[styles.actionText, { color: Colors.error }]}>
                Delete
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    marginBottom: 50,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  name: { fontWeight: "700", color: Colors.textPrimary },
  role: { color: Colors.textSecondary, fontWeight: "600", fontSize: 12 },
  text: { color: Colors.textPrimary, marginTop: 6 },
  actions: { flexDirection: "row", marginTop: 8 },
  actionText: { marginRight: 18, color: Colors.primary, fontWeight: "600" },
  reply: {
    marginLeft: 12,
    marginTop: 8,
    marginBottom: 50,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: Colors.surface,
  },
});
