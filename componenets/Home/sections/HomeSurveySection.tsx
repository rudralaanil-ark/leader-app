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
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeSurveySection() {
  const { user } = useAuth();
  const [hasSurvey, setHasSurvey] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "surveys"),
      where("submittedBy", "==", user.uid),
      limit(1)
    );

    const unsub = onSnapshot(q, (snap) => {
      setHasSurvey(!snap.empty);
    });

    return () => unsub();
  }, [user?.uid]);

  // ⛔ still checking or already submitted → hide
  if (hasSurvey !== false) return null;

  return (
    <HomeSection title="Survey">
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={() => router.push("/(tabs)/Survey")}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="clipboard-outline" size={26} color={Colors.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Help us know you better</Text>
          <Text style={styles.subtitle}>
            Share basic details like name & location
          </Text>
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

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  subtitle: {
    fontSize: 13,
    marginTop: 4,
    color: Colors.textSecondary,
  },
});
