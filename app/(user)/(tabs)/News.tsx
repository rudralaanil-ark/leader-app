import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

const BACKEND_URL = "http://10.141.73.170:8080"; // ✅ your backend IP

export default function UserNewsList() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/news/all`);
      const data = await res.json();
      setNews(Array.isArray(data) ? data : data.news || []);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNews();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, color: "#555" }}>Loading news...</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Latest News 🗞️
      </Text>

      <FlatList
        data={news}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/(user)/(tabs)/NewsDetails",
                params: {
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  imageUrl: item.imageUrl,
                  createdAt: item.createdAt,
                },
              })
            }
          >
            <View
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: 12,
                marginBottom: 14,
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                overflow: "hidden",
              }}
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: "100%", height: 180 }}
                  resizeMode="cover"
                />
              ) : null}

              <View style={{ padding: 12 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#222",
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </Text>

                <Text
                  style={{ color: "#555", lineHeight: 20 }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {item.description}
                </Text>

                <Text
                  style={{
                    color: "#999",
                    fontSize: 12,
                    marginTop: 6,
                    alignSelf: "flex-end",
                  }}
                >
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
