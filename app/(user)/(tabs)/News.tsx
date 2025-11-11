import { listenToNews } from "@/app/(monitor)/(tabs)/api/news";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function News() {
  const router = useRouter();
  const [news, setNews] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch news from Firestore
  useEffect(() => {
    const unsub = listenToNews((data) => {
      setNews(data);
      setLoading(false);
      setRefreshing(false);
    });
    return unsub;
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const unsub = listenToNews((data) => {
      setNews(data);
      setRefreshing(false);
    });
    setTimeout(() => unsub(), 1000);
  }, []);

  const parseDate = (createdAt: any): string => {
    if (!createdAt) return "—";
    try {
      const date =
        typeof createdAt.toDate === "function"
          ? createdAt.toDate()
          : new Date(createdAt);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const isToday = (createdAt: any): boolean => {
    try {
      const date =
        typeof createdAt.toDate === "function"
          ? createdAt.toDate()
          : new Date(createdAt);
      const now = new Date();
      return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    } catch {
      return false;
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const showBadge = isToday(item.createdAt);
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "/(user)/NewsDetails",
            params: {
              id: item.id,
              title: item.title,
              description: item.description,
              imageUrl: item.imageUrl,
              createdAt: parseDate(item.createdAt),
            },
          })
        }
      >
        <View style={styles.card}>
          {/* Image */}
          {item.imageUrl ? (
            <>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <LinearGradient
                colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.75)"]}
                style={styles.overlay}
              />
            </>
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="image-outline" size={42} color="#aaa" />
            </View>
          )}

          {/* Text Content */}
          <View style={styles.textContainer}>
            {showBadge && (
              <View style={styles.badge}>
                <Ionicons name="flame-outline" size={14} color="#fff" />
                <Text style={styles.badgeText}>New Today</Text>
              </View>
            )}

            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.footer}>
              <Ionicons name="calendar-outline" size={13} color="#eee" />
              <Text style={styles.date}>{parseDate(item.createdAt)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ color: "#777", marginTop: 8 }}>
          Fetching latest news...
        </Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Latest News 🗞️</Text> */}

      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: "#888" }}>No news available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingTop: 10 },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: width * 0.55,
    resizeMode: "cover",
    borderRadius: 16,
  },
  imagePlaceholder: {
    width: "100%",
    height: width * 0.55,
    backgroundColor: "#e8e8e8",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  textContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,69,58,0.9)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  desc: {
    color: "#f2f2f2",
    fontSize: 14,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: { color: "#ddd", fontSize: 12, marginLeft: 6 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
