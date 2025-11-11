import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
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
  Image,
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
  const [sortBy, setSortBy] = useState<"time" | "az" | "oldest">("time");

  const rotateAnim = useRef(new Animated.Value(0)).current;

  // 🔙 Android hardware back button
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

  // 🧠 Fetch event + interested users
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

  // 🔽 Expand / collapse interested list
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

  // 🧩 Sorting logic
  const getSortedUsers = () => {
    const users = [...interestedUsers];
    if (sortBy === "az") {
      return users.sort((a, b) =>
        (a.name || a.fullName || "User").localeCompare(
          b.name || b.fullName || "User"
        )
      );
    } else if (sortBy === "oldest") {
      return users.sort((a, b) => {
        const ta = a.timestamp?.seconds || 0;
        const tb = b.timestamp?.seconds || 0;
        return ta - tb;
      });
    } else {
      // Default: Recent first
      return users.sort((a, b) => {
        const ta = a.timestamp?.seconds || 0;
        const tb = b.timestamp?.seconds || 0;
        return tb - ta;
      });
    }
  };

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
      <FlatList
        data={expanded ? getSortedUsers() : []}
        keyExtractor={(u, index) => u.id || index.toString()}
        ListHeaderComponent={
          <>
            {/* 🖼 Event Banner */}
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
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color="#fff"
                      />
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

            {/* 🧾 Event Info */}
            <View style={styles.infoContainer}>
              <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>Event Description</Text>
                <Text style={styles.desc}>{event.description}</Text>

                {/* ❤️ Interested Users Header */}
                <TouchableOpacity
                  style={styles.expandHeader}
                  onPress={toggleExpand}
                >
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

                {!expanded && count > 0 && (
                  <Text
                    style={{
                      color: "#777",
                      marginTop: 8,
                      fontSize: 13,
                      textAlign: "center",
                    }}
                  >
                    Tap to view interested users ↓
                  </Text>
                )}
              </View>
            </View>

            {/* 🔽 Sort Picker */}
            {expanded && count > 0 && (
              <View style={styles.sortContainer}>
                <Ionicons
                  name="filter-outline"
                  size={18}
                  color="#007AFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.sortLabel}>Sort By:</Text>

                <View style={styles.sortDropdownWrapper}>
                  <Picker
                    selectedValue={sortBy}
                    onValueChange={(value) => setSortBy(value)}
                    style={styles.sortPicker}
                    dropdownIconColor="#007AFF"
                    mode="dropdown"
                  >
                    <Picker.Item label="Recent First" value="time" />
                    <Picker.Item label="Oldest First" value="oldest" />
                    <Picker.Item label="A - Z" value="az" />
                  </Picker>
                </View>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => {
          const userName = item.name || item.fullName || "User";
          const profileImage = item.profileImage || null;

          return (
            <View style={styles.userCard}>
              <LinearGradient
                colors={["#E3F2FD", "#F9FBFF"]}
                style={styles.userCardGradient}
              >
                <View style={styles.userCardInner}>
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.userImage}
                    />
                  ) : (
                    <Ionicons
                      name="person-circle-outline"
                      size={44}
                      color="#007AFF"
                    />
                  )}

                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                    {item.phone ? (
                      <Text style={styles.userPhone}>{item.phone}</Text>
                    ) : null}
                  </View>
                </View>
              </LinearGradient>
            </View>
          );
        }}
        ListEmptyComponent={
          expanded ? (
            <Text style={styles.emptyText}>No interested users yet.</Text>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
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
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sortLabel: {
    fontSize: 14,
    color: "#007AFF",
    marginRight: 8,
    fontWeight: "600",
  },
  sortDropdownWrapper: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: "#f8faff",
    overflow: "hidden",
  },
  sortPicker: {
    color: "#007AFF",
    height: 36,
    width: "100%",
    backgroundColor: "transparent",
  },

  userCard: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  userCardGradient: {
    borderRadius: 16,
    padding: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  userCardInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userName: {
    fontWeight: "700",
    fontSize: 15,
    color: "#111",
  },
  userEmail: {
    color: "#555",
    fontSize: 13,
  },
  userPhone: {
    color: "#777",
    fontSize: 13,
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
