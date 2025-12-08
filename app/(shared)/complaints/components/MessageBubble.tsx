// app/(shared)/complaints/components/MessageBubble.tsx
import Colors from "@/data/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  text: string;
  isMe?: boolean;
  label?: string; // "User", "Admin", "Monitor"
  timestamp?: Date | null;
};

const MessageBubble: React.FC<Props> = ({
  text,
  isMe = false,
  label,
  timestamp,
}) => {
  const timeLabel = timestamp
    ? timestamp.toLocaleString().slice(0, 16)
    : undefined;

  return (
    <View
      style={[
        styles.container,
        { alignItems: isMe ? "flex-end" : "flex-start" },
      ]}
    >
      {(label || timeLabel) && (
        <View style={styles.metaRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {timeLabel && <Text style={styles.time}>{timeLabel}</Text>}
        </View>
      )}

      <View
        style={[
          styles.bubble,
          isMe ? styles.bubbleMe : styles.bubbleOther,
          isMe && { alignSelf: "flex-end" },
        ]}
      >
        <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  time: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
  },
  bubbleOther: {
    backgroundColor: Colors.surfaceDark,
  },
  text: {
    fontSize: 13,
  },
  textMe: {
    color: Colors.textInverse,
  },
  textOther: {
    color: Colors.textPrimary,
  },
});

export default MessageBubble;
