import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Easing,
  FlatList,
  ImageBackground,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getEvent,
  getInterestedUsers,
  listenInterestedCount,
} from "./api/events";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function EventDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [interestedUsers, setInterestedUsers] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [expanded, setExpanded] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  // ✅ Android hardware back button behavior
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/(monitor)/(tabs)/EventList");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [router])
  );

  useEffect(() => {
    if (id) loadEvent(id);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const unsub = listenInterestedCount(id, (n) => setCount(n));
    return unsub;
  }, [id]);

  const loadEvent = async (eventId: string) => {
    const data = await getEvent(eventId);
    if (data) setEvent(data);
    const users = await getInterestedUsers(eventId);
    setInterestedUsers(users);
    setLoading(false);
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>No event found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      {/* 🔹 Event Banner */}
      <View>
        <ImageBackground
          source={
            event.imageUrl
              ? { uri: event.imageUrl }
              : require("@/assets/images/react-logo.png")
          }
          style={styles.banner}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* 🔙 Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace("/(monitor)/(tabs)/EventList")}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          {/* 🏷️ Title, Venue, Date */}
          <View style={styles.bannerText}>
            <Text style={styles.title}>{event.title}</Text>

            {event.venue ? (
              <View style={styles.row}>
                <Ionicons name="location-outline" size={16} color="#fff" />
                <Text style={styles.meta}>{event.venue}</Text>
              </View>
            ) : null}

            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={16} color="#fff" />
              <Text style={styles.meta}>
                {event.dateTime?.toDate?.().toLocaleString?.()}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* 🔹 Event Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Event Description</Text>
          <Text style={styles.desc}>{event.description}</Text>

          {/* ❤️ Interested Users Section */}
          <TouchableOpacity style={styles.expandHeader} onPress={toggleExpand}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="heart-outline" size={18} color="#007AFF" />
              <Text style={styles.expandTitle}>
                {" "}
                Interested Users ({count})
              </Text>
            </View>

            <Animated.View
              style={{ transform: [{ rotate: rotateInterpolate }] }}
            >
              <Ionicons name="chevron-down" size={20} color="#007AFF" />
            </Animated.View>
          </TouchableOpacity>

          {expanded && (
            <View style={styles.expandContent}>
              {interestedUsers.length > 0 ? (
                <FlatList
                  data={interestedUsers}
                  keyExtractor={(u) => u.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.userCard}>
                      <Ionicons
                        name="person-circle-outline"
                        size={36}
                        color="#007AFF"
                      />
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontWeight: "700" }}>{item.name}</Text>
                        <Text style={{ color: "#555" }}>{item.email}</Text>
                        {item.phone ? (
                          <Text style={{ color: "#555" }}>{item.phone}</Text>
                        ) : null}
                      </View>
                    </View>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>
                      No interested users yet.
                    </Text>
                  }
                />
              ) : (
                <Text style={styles.emptyText}>No interested users yet.</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 300,
    justifyContent: "flex-end",
  },
  bannerText: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  meta: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 6,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    marginTop: -30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 8,
  },
  desc: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 20,
  },
  expandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  expandTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  expandContent: {
    marginTop: 12,
    backgroundColor: "#f4f7fb",
    borderRadius: 12,
    padding: 8,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    padding: 10,
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
