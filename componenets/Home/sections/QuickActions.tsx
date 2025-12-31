import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/data/Colors";

export default function QuickActions() {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const actions = [
    {
      label: "Survey",
      icon: "clipboard-outline",
      route: "/(tabs)/Survey",
    },
    {
      label: "Poll",
      icon: "stats-chart-outline",
      route: "/(tabs)/Poll",
    },
    {
      label: "Complaint Box",
      icon: "alert-circle-outline",
      route: "/(tabs)/ComplaintBox",
    },
  ];

  return (
    <>
      {/* FLOATING BUTTON */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="flash" size={28} color={Colors.buttonText} />
      </TouchableOpacity>

      {/* BOTTOM SHEET */}
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.handle} />

          <Text style={styles.title}>Quick Actions</Text>

          {actions.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.row}
              activeOpacity={0.8}
              onPress={() => {
                setOpen(false);
                router.push(item.route as any);
              }}
            >
              <View style={styles.iconWrap}>
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={Colors.primary}
                />
              </View>

              <Text style={styles.label}>{item.label}</Text>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },

  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.border,
    alignSelf: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.highlight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});
