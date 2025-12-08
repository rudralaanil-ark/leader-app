// app/components/gallery/FolderCard.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "@/data/Colors";

interface Props {
  name: string;
  thumbnailUrl: string | null;
  createdAt: string;
  createdByName: string;
  createdByRole: string;
  isAdminOrMonitor: boolean;
  onPress: () => void;
}

export default function FolderCard({
  name,
  thumbnailUrl,
  createdAt,
  createdByName,
  createdByRole,
  isAdminOrMonitor,
  onPress,
}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{
          uri:
            thumbnailUrl ?? "https://via.placeholder.com/300x200?text=No+Image",
        }}
        style={styles.thumbnail}
      />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        <Text style={styles.date}>Created: {createdAt}</Text>

        {isAdminOrMonitor && (
          <Text style={styles.creator}>
            By: {createdByName} ({createdByRole})
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.card,
    marginBottom: 16,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  thumbnail: {
    width: "100%",
    height: 170,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  date: {
    fontSize: 12,
    marginTop: 4,
    color: Colors.textMuted,
  },
  creator: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
