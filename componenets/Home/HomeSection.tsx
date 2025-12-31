import Colors from "@/data/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  children: React.ReactNode;
  onViewAll?: () => void;
  hide?: boolean;
};

export default function HomeSection({
  title,
  children,
  onViewAll,
  hide = false,
}: Props) {
  if (hide) return null;

  return (
    <View style={styles.wrapper}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        {onViewAll && (
          <TouchableOpacity activeOpacity={0.7} onPress={onViewAll}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Section Content */}
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 22,
  },

  header: {
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textWhite,
  },

  viewAll: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.lightCard,
  },
});
