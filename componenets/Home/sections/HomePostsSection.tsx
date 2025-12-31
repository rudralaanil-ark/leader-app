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
import { FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";

import HomeSection from "@/componenets/Home/HomeSection";
import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";

type HomePost = {
  id: string;
  imageUrl: string;
};

export default function HomePostsSection() {
  const [posts, setPosts] = useState<HomePost[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("type", "==", "image"),
      orderBy("createdAt", "desc"),
      limit(6)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: HomePost[] = snap.docs
        .map((d) => {
          const data: any = d.data();
          const firstMedia = data.media?.[0]?.url;
          if (!firstMedia) return null;

          return {
            id: d.id,
            imageUrl: firstMedia,
          };
        })
        .filter(Boolean) as HomePost[];

      setPosts(list);
    });

    return () => unsub();
  }, []);

  if (!posts.length) return null;

  return (
    <HomeSection
      title="Posts"
      onViewAll={() => router.push("/(user)/(tabs)/Gallery")}
    >
      <FlatList
        data={posts}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/(user)/(tabs)/Gallery",
                params: { postId: item.id },
              })
            }
            style={styles.card}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
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
    width: 200, // ⬅️ increased
    height: 210, // ⬅️ increased
    borderRadius: 22, // ⬅️ more premium
    overflow: "hidden",
    backgroundColor: Colors.surface,
    marginRight: 16, // ⬅️ better spacing
  },

  image: {
    width: "100%",
    height: "100%",
  },
});
