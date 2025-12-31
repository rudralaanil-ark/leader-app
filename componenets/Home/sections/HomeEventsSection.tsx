import { router } from "expo-router";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import EventCard from "@/app/(shared)/events/components/EventCard";
import HomeSection from "@/componenets/Home/HomeSection";
import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";

type HomeEvent = {
  id: string;
  title: string;
  imageUrl?: string;
  dateTime?: any;
};

export default function HomeEventsSection() {
  const [events, setEvents] = useState<HomeEvent[]>([]);

  useEffect(() => {
    const now = new Date();

    const q = query(
      collection(db, "events"),
      where("dateTime", ">=", now),
      orderBy("dateTime", "asc"),
      limit(5)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setEvents(list);
    });

    return () => unsub();
  }, []);

  if (!events.length) return null;

  return (
    <HomeSection
      title="Upcoming Events"
      onViewAll={() => router.push("/(user)/(tabs)/Events")}
    >
      <FlatList
        data={events}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={{ width: 340, marginRight: 16 }}>
            <EventCard
              item={item}
              onPress={() => router.push("/(user)/(tabs)/Events")}
              showActions={false} // 🔥 HOME MODE
            />
          </View>
        )}
      />
    </HomeSection>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  card: {
    width: 320,
    height: 190,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: Colors.surface,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 22,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  textWrap: {
    padding: 14,
  },
  title: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: "700",
  },
  date: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.textInverse,
    opacity: 0.9,
  },
});
