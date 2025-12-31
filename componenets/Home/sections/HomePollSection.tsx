import { router } from "expo-router";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import HomeSection from "@/componenets/Home/HomeSection";
import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

type PollDoc = {
  id: string;
  question: string;
};

export default function HomePollSection() {
  const [poll, setPoll] = useState<PollDoc | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "polls"),
      where("status", "==", "active"), // 👈 change ONLY if your schema differs
      limit(1)
    );

    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) {
        setPoll(null);
        return;
      }

      const d = snap.docs[0];
      const data: any = d.data();

      setPoll({
        id: d.id,
        question: data.question ?? "Participate in today’s poll",
      });
    });

    return () => unsub();
  }, []);

  // ⛔ No active poll → hide
  if (!poll) return null;

  return (
    <HomeSection title="Poll">
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={() => router.push("/(tabs)/Poll")}
      >
        <View style={styles.iconWrap}>
          <Ionicons
            name="stats-chart-outline"
            size={26}
            color={Colors.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.question} numberOfLines={2}>
            {poll.question}
          </Text>
          <Text style={styles.subText}>Tap to vote now</Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color={Colors.textMuted} />
      </TouchableOpacity>
    </HomeSection>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.highlight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  question: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  subText: {
    fontSize: 13,
    marginTop: 4,
    color: Colors.textSecondary,
  },
});
