import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getNews } from "./api/news";

const { width } = Dimensions.get("window");

export default function NewsDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch single news
  const loadNews = async (newsId: string) => {
    try {
      const data = await getNews(newsId);
      if (data) setNews(data);
    } catch (err) {
      console.error("Error loading news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadNews(id);
  }, [id]);

  // 🧭 Reload when revisiting
  useFocusEffect(
    useCallback(() => {
      if (id) loadNews(id);
    }, [id])
  );

  // 🔙 Handle hardware back
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.push("/(monitor)/(tabs)/NewsList");
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [router])
  );

  // 🗓️ Smart universal date formatter
  const formatDate = (createdAt: any) => {
    if (!createdAt) return "Unknown date";
    try {
      if (typeof createdAt === "object") {
        if (createdAt._seconds) return new Date(createdAt._seconds * 1000);
        if (createdAt.seconds) return new Date(createdAt.seconds * 1000);
        if (createdAt.toDate) return createdAt.toDate();
      }
      const date = new Date(createdAt);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      return "Unknown date";
    } catch {
      return "Unknown date";
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: "#555" }}>Loading article...</Text>
      </View>
    );

  if (!news)
    return (
      <View style={styles.center}>
        <Text style={{ color: "#666" }}>News not found.</Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 🖼️ Header Image */}
        <View style={styles.imageWrapper}>
          {news.imageUrl ? (
            <>
              <Image source={{ uri: news.imageUrl }} style={styles.image} />
              <LinearGradient
                colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.6)"]}
                style={StyleSheet.absoluteFillObject}
              />
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={60} color="#aaa" />
            </View>
          )}
        </View>

        {/* 📰 Article Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{news.title}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color="#777" />
            <Text style={styles.metaText}>
              Published on {formatDate(news.createdAt)}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{news.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingBottom: 60,
  },
  imageWrapper: {
    width: "100%",
    height: width * 0.6,
    position: "relative",
    backgroundColor: "#eee",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 22,
    elevation: 2,
  },
  content: {
    padding: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    lineHeight: 28,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  metaText: {
    color: "#777",
    fontSize: 13,
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#333",
    textAlign: "justify",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
