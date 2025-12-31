import { router } from "expo-router";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import HomeSection from "@/componenets/Home/HomeSection";
import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";

type NewsItem = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt?: any;
};

export default function HomeNewsFeedSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "news"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setNews(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading)
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );

  if (!news.length) return null;

  return (
    <HomeSection
      title="Latest News"
      onViewAll={() => router.push("/(tabs)/News")}
    >
      <View style={{ paddingHorizontal: 5 }}>
        {news.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/(user)/NewsDetails",
                params: {
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  imageUrl: item.imageUrl,
                },
              })
            }
          >
            {/* TITLE */}
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            {/* DATE */}
            {item.createdAt && (
              <Text style={styles.date}>
                {new Date(
                  item.createdAt?.toDate
                    ? item.createdAt.toDate()
                    : item.createdAt
                ).toLocaleDateString("te-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            )}

            {/* IMAGE */}
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : null}

            {/* DESCRIPTION */}
            <Text style={styles.desc} numberOfLines={4}>
              {item.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </HomeSection>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    lineHeight: 24,
  },

  date: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 10,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: Colors.surface,
  },

  desc: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
});
