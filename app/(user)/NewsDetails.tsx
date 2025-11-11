import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageZoom from "react-native-image-pan-zoom";

const { width, height } = Dimensions.get("window");

export default function NewsDetails() {
  const router = useRouter();
  const { title, description, imageUrl, createdAt } = useLocalSearchParams();
  const [popupVisible, setPopupVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // 🧠 Handle global hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (popupVisible) {
          setPopupVisible(false);
          return true; // ✅ stop navigation
        } else {
          router.back();
          return true;
        }
      }
    );

    return () => backHandler.remove();
  }, [popupVisible, router]);

  // 🧠 Additional handler INSIDE modal (ensures modal gets focus)
  useEffect(() => {
    if (popupVisible) {
      const handler = BackHandler.addEventListener("hardwareBackPress", () => {
        setPopupVisible(false);
        return true;
      });
      return () => handler.remove();
    }
  }, [popupVisible]);

  // 🧠 Smooth fade animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: popupVisible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [popupVisible, fadeAnim]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* 🖼 Popup Modal */}
      <Modal
        visible={popupVisible}
        transparent
        animationType="none"
        onRequestClose={() => setPopupVisible(false)} // ✅ for Android modal back
      >
        <Animated.View style={[styles.popupOverlay, { opacity: fadeAnim }]}>
          {/* Tap outside to close */}
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={() => setPopupVisible(false)}
          />

          <View style={styles.popupContent}>
            {/* 🖼 Pinch-to-Zoom image */}
            <ImageZoom
              cropWidth={width * 0.9}
              cropHeight={height * 0.6}
              imageWidth={width * 0.9}
              imageHeight={height * 0.6}
              minScale={1}
              maxScale={3}
            >
              <Image
                source={{ uri: imageUrl as string }}
                style={styles.popupImage}
                resizeMode="contain"
              />
            </ImageZoom>

            {/* ❌ Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPopupVisible(false)}
            >
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* 🖼 Main Image */}
      <TouchableOpacity onPress={() => imageUrl && setPopupVisible(true)}>
        {imageUrl ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: imageUrl as string }} style={styles.image} />
            <LinearGradient
              colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.85)"]}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={60} color="#999" />
          </View>
        )}
      </TouchableOpacity>

      {/* 📰 News Content */}
      <ScrollView
        style={styles.contentWrapper}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color="#777" />
          <Text style={styles.metaText}>
            {createdAt || "Date not available"}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.description}>{description}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  imageWrapper: {
    width: "100%",
    height: width * 0.6,
    backgroundColor: "#ddd",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    height: width * 0.6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },

  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 40 : 60,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30,
    padding: 8,
  },

  contentWrapper: {
    marginTop: -30,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  metaText: {
    color: "#777",
    fontSize: 13,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#333",
    textAlign: "justify",
  },

  // 🖼 Popup styles
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  popupContent: {
    backgroundColor: "#000",
    borderRadius: 16,
    overflow: "hidden",
    width: width * 0.9,
    height: height * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  popupImage: {
    width: width * 0.9,
    height: height * 0.6,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 6,
  },
});
