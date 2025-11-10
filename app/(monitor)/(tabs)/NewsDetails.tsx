import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  BackHandler,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewsDetails() {
  const router = useRouter();
  const { title, description, imageUrl, createdAt } = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ✅ Universal Date-Time Formatter
  const formatDateTime = (value: any) => {
    if (!value) return "";

    try {
      let dateObj;

      // Case 1: Firestore timestamp object { seconds, nanoseconds }
      if (typeof value === "object" && (value._seconds || value.seconds)) {
        dateObj = new Date((value._seconds || value.seconds) * 1000);
      }
      // Case 2: Milliseconds number (like 1731205190000)
      else if (typeof value === "number") {
        dateObj = new Date(value);
      }
      // Case 3: Stringified timestamp number (like "1731205190000")
      else if (typeof value === "string" && /^\d+$/.test(value)) {
        dateObj = new Date(parseInt(value));
      }
      // Case 4: ISO string (like "2025-11-10T08:32:00Z")
      else if (typeof value === "string") {
        dateObj = new Date(value);
      }

      if (!dateObj || isNaN(dateObj.getTime())) return "";

      // ✅ Format: 10 Nov 2025, 08:32 PM
      return dateObj.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (err) {
      console.error("Date parse error:", err);
      return "";
    }
  };

  // ✨ Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🔙 Handle hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.push("/(monitor)/(tabs)/NewsList");
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  // 📤 Share news
  const handleShare = async () => {
    try {
      await Share.share({
        title: title as string,
        message: `${title}\n\n${description}\n\nShared via Leader App 🗞️`,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 🌈 Gradient Header */}
      <LinearGradient
        colors={["#007bff", "#0056d2"]}
        style={{
          paddingTop: 50,
          paddingBottom: 20,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.push("/(monitor)/(tabs)/NewsList")}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "600",
              marginLeft: 8,
            }}
          >
            Back
          </Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* 📰 Scrollable Content */}
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🖼️ Image */}
        {imageUrl ? (
          <Animated.Image
            source={{ uri: imageUrl as string }}
            style={{
              width: "100%",
              height: 250,
              borderRadius: 12,
              marginBottom: 16,
              opacity: fadeAnim,
            }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              height: 220,
              borderRadius: 12,
              backgroundColor: "#e0e0e0",
              marginBottom: 16,
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
            fontSize: 24,
            fontWeight: "bold",
            color: "#222",
            marginBottom: 6,
          }}
        >
          {title}
        </Text>

        {/* 📅 Date and Time */}
        <Text
          style={{
            color: "#777",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {formatDateTime(createdAt) || "Date not available"}
        </Text>

        {/* 📝 Description */}
        <View
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: 10,
            padding: 14,
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
          }}
        >
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
        </View>
      </ScrollView>
    </View>
  );
}
