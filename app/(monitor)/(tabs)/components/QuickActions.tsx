import Colors from "@/data/Colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function QuickActions({
  onAddEvent,
  onAddNews,
  onAddVideo,
  onCreatePoll,
  onAddGallery,
}: {
  onAddEvent: () => void;
  onAddNews: () => void;
  onAddVideo: () => void;
  onCreatePoll: () => void;
  onAddGallery: () => void;
}) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actions}>
        <Action label="Add Event" onPress={onAddEvent} />
        <Action label="Add News" onPress={onAddNews} />
        <Action label="Add Video" onPress={onAddVideo} />
        <Action label="Create Poll" onPress={onCreatePoll} />
        <Action label="Add Gallery" onPress={onAddGallery} />
      </View>
    </View>
  );
}

function Action({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  action: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  actionText: {
    color: Colors.buttonText,
    fontWeight: "700",
    fontSize: 13,
  },
});
