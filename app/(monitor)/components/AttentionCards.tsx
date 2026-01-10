import Colors from "@/data/Colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AttentionCards({
  pending,
  needInfo,
  inProgress,
  onPressPending,
  onPressNeedInfo,
  onPressInProgress,
}: {
  pending: number;
  needInfo: number;
  inProgress: number;
  onPressPending: () => void;
  onPressNeedInfo: () => void;
  onPressInProgress: () => void;
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Attention Required</Text>

      <View style={styles.row}>
        <Card
          label="New"
          count={pending}
          color={Colors.error}
          onPress={onPressPending}
        />
        <Card
          label="Need Info"
          count={needInfo}
          color={Colors.warning}
          onPress={onPressNeedInfo}
        />
        <Card
          label="In Progress"
          count={inProgress}
          color={Colors.info}
          onPress={onPressInProgress}
        />
      </View>
    </View>
  );
}

function Card({
  label,
  count,
  color,
  onPress,
}: {
  label: string;
  count: number;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.card, { borderColor: color }]} onPress={onPress}>
      <Text style={[styles.count, { color }]}>{count}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  count: {
    fontSize: 22,
    fontWeight: "800",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
