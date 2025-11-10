import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  BackHandler,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewsDetails() {
  const router = useRouter();
  const { title, description, imageUrl, createdAt } = useLocalSearchParams();

  // ✅ Universal Date-Time Formatter (Firestore-safe)
  const formatDateTime = (value: any) => {
    if (!value) return "";

    try {
      let dateObj;

      // Case 1: Firestore Timestamp object { seconds, nanoseconds }
      if (typeof value === "object" && (value._seconds || value.seconds)) {
        dateObj = new Date((value._seconds || value.seconds) * 1000);
      }
      // Case 2: Milliseconds (number)
      else if (typeof value === "number") {
        dateObj = new Date(value);
      }
      // Case 3: Stringified number (e.g., "1731205190000")
      else if (typeof value === "string" && /^\d+$/.test(value)) {
        dateObj = new Date(parseInt(value));
      }
      // Case 4: ISO string
      else if (typeof value === "string") {
        dateObj = new Date(value);
      }

      if (!dateObj || isNaN(dateObj.getTime())) return "";

      return dateObj.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "";
    }
  };

  // 🔙 Handle hardware back button → go to News tab
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.push("/(user)/(tabs)/News");
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* 🔙 Back Button */}
      <TouchableOpacity
        onPress={() => router.push("/(user)/(tabs)/News")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#007bff" />
        <Text style={{ marginLeft: 6, color: "#007bff", fontSize: 16 }}>
          Back
        </Text>
      </TouchableOpacity>

      {/* 🖼️ News Image */}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl as string }}
          style={{
            width: "100%",
            height: 230,
            borderRadius: 12,
            marginBottom: 14,
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            height: 230,
            borderRadius: 12,
            backgroundColor: "#e0e0e0",
            marginBottom: 14,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="image-outline" size={60} color="#999" />
        </View>
      )}

      {/* 🧾 Title */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 6,
          color: "#222",
        }}
      >
        {title}
      </Text>

      {/* 📅 Date + Time (fixed) */}
      <Text
        style={{
          color: "#888",
          fontSize: 13,
          marginBottom: 14,
        }}
      >
        {formatDateTime(createdAt) || "Date not available"}
      </Text>

      {/* 📝 Description */}
      <Text
        style={{
          fontSize: 16,
          lineHeight: 24,
          color: "#333",
          textAlign: "justify",
        }}
      >
        {description}
      </Text>
    </ScrollView>
  );
}
