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
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import HomeSection from "@/componenets/Home/HomeSection";
import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";

type HomeNews = {
  id: string;
  title: string;
  imageUrl?: string;
  createdAt?: any;
  description?: string;
};

export default function HomeNewsSection() {
  const [news, setNews] = useState<HomeNews[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "news"),
      orderBy("createdAt", "desc"),
      limit(6)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setNews(list);
    });

    return () => unsub();
  }, []);

  if (!news.length) return null;

  const formatDate = (createdAt: any) => {
    try {
      const d = createdAt?.toDate?.() ?? new Date(createdAt);
      return d.toLocaleDateString("te-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <HomeSection title="News" onViewAll={() => router.push("/(tabs)/News")}>
      <FlatList
        data={news}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
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
                  createdAt: formatDate(item.createdAt),
                },
              })
            }
          >
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.placeholder]} />
            )}

            <View style={styles.textWrap}>
              <Text numberOfLines={2} style={styles.title}>
                {item.title}
              </Text>
              <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
            </View>
          </TouchableOpacity>
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
    width: 300,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: Colors.card,
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: Colors.surface,
  },
  placeholder: {
    backgroundColor: Colors.surfaceDark,
  },
  textWrap: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  date: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
