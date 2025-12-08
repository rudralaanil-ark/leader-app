import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function PostHeader({ userName, userImage, createdAt }: any) {
  const dateStr = createdAt
    ? new Date(createdAt.seconds * 1000).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <View style={styles.header}>
      <Image
        source={
          userImage
            ? { uri: userImage }
            : require("@/assets/images/react-logo.png")
        }
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{userName || "User"}</Text>
        <Text style={styles.time}>{dateStr}</Text>
      </View>

      <Ionicons
        name="ellipsis-horizontal"
        size={20}
        color={Colors.textPrimary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    paddingBottom: 8,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
    backgroundColor: Colors.surface,
  },
  name: {
    color: Colors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
  time: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
