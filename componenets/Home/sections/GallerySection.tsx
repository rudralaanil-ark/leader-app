import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import HomeSection from "@/componenets/Home/HomeSection";
import GalleryCard from "@/componenets/Home/cards/GalleryCard";

type Post = {
  id: string;
  imageUrl: string;
};

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156",
  },
];

export default function GallerySection() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(MOCK_POSTS);
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
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <GalleryCard
            imageUrl={item.imageUrl}
            onPress={() => router.push("/(user)/(tabs)/Gallery")}
          />
        )}
      />
    </HomeSection>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingLeft: 16,
    paddingRight: 8,
  },
});
