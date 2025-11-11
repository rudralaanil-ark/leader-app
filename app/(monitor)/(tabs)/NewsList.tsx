import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BACKEND_URL = "http://10.141.73.170:8080"; // ✅ Update this to correct IP

export default function NewsList() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch News
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/news/all`);
      const data = await res.json();
      setNews(Array.isArray(data) ? data : data.news || []);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNews();
    }, [])
  );

  // 🗑️ Delete News
  const handleDelete = (id: number) => {
    Alert.alert("Delete News", "Are you sure you want to delete this news?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${BACKEND_URL}/news/delete/${id}`, {
              method: "DELETE",
            });
            if (res.ok) {
              Alert.alert("Deleted ✅", "News deleted successfully!");
              fetchNews();
            } else {
              Alert.alert("Error", "Failed to delete news.");
            }
          } catch (err) {
            console.error("Delete failed:", err);
            Alert.alert("Error", "Something went wrong.");
          }
        },
      },
    ]);
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, color: "#555" }}>Loading news...</Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          padding: 16,
          paddingTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 10,
            // paddingTop: 10,
          }}
        >
          Manage News 📰
        </Text>

        {news.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 100,
            }}
          >
            <Ionicons name="newspaper-outline" size={64} color="#ccc" />
            <Text style={{ color: "#888", marginTop: 8 }}>
              No news available. Please add some news.
            </Text>
          </View>
        ) : (
          <FlatList
            data={news}
            refreshing={loading}
            onRefresh={fetchNews}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#f9f9f9",
                  marginBottom: 16,
                  borderRadius: 12,
                  padding: 12,
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                }}
              >
                {/* Image */}
                {item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{
                      width: "100%",
                      height: 160,
                      borderRadius: 10,
                      marginBottom: 8,
                    }}
                    resizeMode="cover"
                  />
                )}

                {/* Title */}
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    color: "#222",
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </Text>

                {/* Description Preview */}
                <Text
                  style={{ color: "#555", lineHeight: 20 }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.description}
                </Text>

                {/* Date */}
                <Text
                  style={{
                    fontSize: 12,
                    color: "#999",
                    marginTop: 6,
                    alignSelf: "flex-end",
                  }}
                >
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>

                {/* Action Buttons */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 10,
                    gap: 10,
                  }}
                >
                  {/* View */}
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(monitor)/(tabs)/NewsDetails",
                        params: {
                          id: item.id,
                          title: item.title,
                          description: item.description,
                          imageUrl: item.imageUrl,
                          createdAt: item.createdAt,
                        },
                      })
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      backgroundColor: "#E3F2FD",
                    }}
                  >
                    <Ionicons name="eye-outline" size={18} color="#007bff" />
                    <Text style={{ color: "#007bff", marginLeft: 4 }}>
                      View
                    </Text>
                  </TouchableOpacity>

                  {/* Edit */}
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(monitor)/(tabs)/EditNews",
                        params: {
                          id: item.id,
                          title: item.title,
                          description: item.description,
                          imageUrl: item.imageUrl,
                        },
                      })
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      backgroundColor: "#FFF3E0",
                    }}
                  >
                    <Ionicons name="create-outline" size={18} color="#FB8C00" />
                    <Text style={{ color: "#FB8C00", marginLeft: 4 }}>
                      Edit
                    </Text>
                  </TouchableOpacity>

                  {/* Delete */}
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      backgroundColor: "#FFEBEE",
                    }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#D32F2F" />
                    <Text style={{ color: "#D32F2F", marginLeft: 4 }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {/* Floating Add Button */}
        <TouchableOpacity
          onPress={() => router.push("/(monitor)/(tabs)/AddNews")}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "#007bff",
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
          }}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
