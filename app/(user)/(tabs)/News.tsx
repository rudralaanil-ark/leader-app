// app/(user)/(tabs)/News.tsx
import { listenToNews } from "@/app/services/news";
import GlossyBackground from "@/componenets/Shared/GlossyBackground";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
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

  const parseDate = (createdAt: any) => {
    if (!createdAt) return "—";
    try {
      const date =
        typeof createdAt.toDate === "function"
          ? createdAt.toDate()
          : new Date(createdAt);
      return date.toLocaleDateString("te-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.92}
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
          {/* Title */}
          <Text style={styles.title}>{item.title}</Text>

          {/* Telugu Date */}
          <Text style={styles.dateText}>{parseDate(item.createdAt)}</Text>

          {/* Image */}
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="image-outline" size={40} color="#aaa" />
            </View>
          )}

          {/* Description - limited lines */}
          <Text style={styles.description} numberOfLines={4}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading)
    return (
      <GlossyBackground>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </GlossyBackground>
    );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
      }}
    >
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 12,
          paddingBottom: 40,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    lineHeight: 24,
    marginBottom: 6,
  },

  dateText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },

  image: {
    width: "100%",
    height: width * 0.55,
    borderRadius: 14,
    marginBottom: 12,
  },

  imagePlaceholder: {
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    marginTop: 4,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
