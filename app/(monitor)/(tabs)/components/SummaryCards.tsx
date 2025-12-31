import Colors from "@/data/Colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SummaryCards({
  events,
  news,
  videos,
  polls,
  onEvents,
  onNews,
  onVideos,
  onPolls,
}: {
  events: number;
  news: number;
  videos: number;
  polls: number;
  onEvents: () => void;
  onNews: () => void;
  onVideos: () => void;
  onPolls: () => void;
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Work Summary</Text>

      <View style={styles.grid}>
        <Item label="Events" value={events} onPress={onEvents} />
        <Item label="News" value={news} onPress={onNews} />
        <Item label="Videos" value={videos} onPress={onVideos} />
        <Item label="Active Polls" value={polls} onPress={onPolls} />
      </View>
    </View>
  );
}

function Item({
  label,
  value,
  onPress,
}: {
  label: string;
  value: number;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Text style={styles.value}>{value}</Text>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  item: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
  },
  label: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
});
