import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/data/Colors";

export default function PostFooter({ postId }: any) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.iconRow}>
        <Ionicons name="heart-outline" size={22} color={Colors.textPrimary} />
        <Text style={styles.footerText}>Like</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconRow}>
        <Ionicons
          name="chatbubble-outline"
          size={20}
          color={Colors.textPrimary}
        />
        <Text style={styles.footerText}>Comment</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconRow}>
        <Ionicons name="share-outline" size={22} color={Colors.textPrimary} />
        <Text style={styles.footerText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    marginTop: 12,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    marginLeft: 6,
    color: Colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
});
