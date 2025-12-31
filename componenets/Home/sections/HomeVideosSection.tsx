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
import {
  Dimensions,
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
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

type HomeVideo = {
  id: string;
  title?: string;
  thumbnail: string;
};

export default function HomeVideosSection() {
  const [videos, setVideos] = useState<HomeVideo[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("type", "==", "video"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: HomeVideo[] = [];

      snap.docs.forEach((doc) => {
        const data: any = doc.data();

        // 🔑 SAFE THUMBNAIL EXTRACTION
        const media = Array.isArray(data.media) ? data.media : [];
        const videoMedia = media.find((m: any) => m.type === "video");

        const thumbnail =
          videoMedia?.thumbnailUrl ||
          videoMedia?.thumbnail ||
          data.thumbnailUrl ||
          data.imageUrl ||
          null;

        if (!thumbnail) return; // ⛔ skip invalid items

        list.push({
          id: doc.id,
          title: data.title || data.description || "",
          thumbnail,
        });
      });

      setVideos(list);
    });

    return () => unsub();
  }, []);

  // 🚫 nothing to show → hide section
  if (!videos.length) return null;

  return (
    <HomeSection
      title="Videos"
      onViewAll={() => router.push("/(user)/(tabs)/Video")}
    >
      {/* 👇 FIX: give the carousel a fixed height */}
      <View style={{ height: CARD_HEIGHT }}>
        <FlatList
          data={videos}
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
                  pathname: "/(user)/(tabs)/Video",
                  params: { postId: item.id },
                })
              }
            >
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
              />

              <View style={styles.overlay} />

              <Ionicons
                name="play"
                size={40}
                color="#fff"
                style={styles.playIcon}
              />

              {item.title ? (
                <View style={styles.titleWrap}>
                  <Text numberOfLines={2} style={styles.title}>
                    {item.title}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        />
      </View>
    </HomeSection>
  );
}

const CARD_WIDTH = width * 0.6;
const CARD_HEIGHT = CARD_WIDTH * 1.75; // portrait / shorts ratio

const styles = StyleSheet.create({
  list: {
    paddingLeft: 16,
    paddingRight: 8,
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: Colors.surfaceDark,
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.surfaceDark,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  playIcon: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
  },

  titleWrap: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
});
