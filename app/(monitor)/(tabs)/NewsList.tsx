import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteNews, listenToNews } from "./api/news";

const { width } = Dimensions.get("window");

export default function NewsList() {
  const router = useRouter();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = useCallback(() => {
    setLoading(true);
    const unsub = listenToNews((data) => {
      setNews(data);
      setLoading(false);
      setRefreshing(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = loadNews();
    return unsub;
  }, [loadNews]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNews();
  }, [loadNews]);

  const handleDelete = (id: string) => {
    Alert.alert("Delete News", "Are you sure you want to delete this news?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteNews(id) },
    ]);
  };

  const handleEdit = (id: string) => {
    router.push({
      pathname: "/(monitor)/(tabs)/AddNews",
      params: { id },
    });
  };

  const handleViewDetails = (id: string) => {
    router.push({
      pathname: "/(monitor)/(tabs)/NewsDetails",
      params: { id },
    });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "—";
    try {
      const date =
        typeof timestamp.toDate === "function"
          ? timestamp.toDate()
          : new Date(timestamp);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => handleViewDetails(item.id)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={42} color="#999" />
        </View>
      )}

      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.meta}>{formatDate(item.createdAt)}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => handleEdit(item.id)}
              style={styles.iconButton}
            >
              <Ionicons name="create-outline" size={26} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={[styles.iconButton, { marginLeft: 14 }]}
            >
              <Ionicons name="trash-outline" size={26} color="#ff5a5a" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f7fb" }}>
      <Text style={styles.header}>📰 Trending News</Text>

      <FlatList
        data={news}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
            colors={["#007AFF"]}
          />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => router.push("/(monitor)/(tabs)/AddNews")}
      >
        <Ionicons name="add" size={34} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginTop: 30,
    marginLeft: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 5,
  },
  image: {
    width: "100%",
    height: width * 0.48,
    resizeMode: "cover",
  },
  placeholder: {
    width: "100%",
    height: width * 0.48,
    backgroundColor: "#e8e8e8",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  content: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  title: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 6,
  },
  desc: {
    color: "#f2f2f2",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    color: "#ddd",
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 5,
    borderRadius: 20,
  },
  fab: {
    position: "absolute",
    right: 22,
    bottom: 30,
    backgroundColor: "#007AFF",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 9,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
