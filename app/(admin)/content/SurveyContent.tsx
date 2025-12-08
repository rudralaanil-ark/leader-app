import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import { router } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function SurveyContent({ monitorId }) {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    let q;

    if (monitorId === "all") {
      q = query(collection(db, "surveys"), orderBy("createdAt", "desc"));
    } else {
      q = query(
        collection(db, "surveys"),
        where("createdBy", "==", monitorId),
        orderBy("createdAt", "desc")
      );
    }

    const unsub = onSnapshot(q, (snap) => {
      setSurveys(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });

    return unsub;
  }, [monitorId]);

  return (
    <FlatList
      data={surveys}
      keyExtractor={(i) => i.id}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/survey-details/${item.id}`)}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.monitor}>Created by: {item.createdByName}</Text>
          <Text style={styles.desc} numberOfLines={3}>
            {item.description}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    padding: 12,
    margin: 10,
    borderRadius: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  monitor: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  desc: { fontSize: 13, color: Colors.textMuted },
});
