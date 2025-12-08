import GlossyBackground from "@/componenets/Shared/GlossyBackground";
import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const unsubEvents = onSnapshot(
      query(collection(db, "events"), orderBy("createdAt", "desc")),
      (snap) => {
        setEvents(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
        setLoading(false);
      }
    );

    const unsubNews = onSnapshot(
      query(collection(db, "news"), orderBy("createdAt", "desc")),
      (snap) => {
        setNews(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      }
    );

    return () => {
      unsubEvents();
      unsubNews();
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const menuItems = [
    {
      icon: "people-outline",
      label: "Manage Users",
      route: "/(admin)/(tabs)/ManageUsers",
    },
    {
      icon: "newspaper-outline",
      label: "Manage News",
      route: "/(admin)/(tabs)/ManageNews",
    },
    {
      icon: "calendar-outline",
      label: "Events",
      route: "/(admin)/(tabs)/ManageEvents",
    },
    {
      icon: "alert-circle-outline",
      label: "Complaints",
      route: "/(admin)/(tabs)/Complaints",
    },
    {
      icon: "notifications-outline",
      label: "Notifications",
      route: "/(admin)/(tabs)/Notifications",
    },
    {
      icon: "settings-outline",
      label: "Settings",
      route: "/(admin)/(tabs)/Settings",
    },
  ];

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <GlossyBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.leaderInfo}>
            <Image
              source={{ uri: "https://via.placeholder.com/80x80" }}
              style={styles.leaderAvatar}
            />
            <View>
              <Text style={styles.leaderName}>Welcome Back, Admin</Text>
              <Text style={styles.subText}>System Overview</Text>
            </View>
          </View>
          <Ionicons
            name="person-circle-outline"
            size={32}
            color={Colors.icons}
          />
        </View>

        {/* SECTION: Highlights */}
        <View style={styles.sectionContainer}>
          <SectionHeader
            title="Highlights"
            showViewAll
            onViewAll={() => router.push("/(admin)/(tabs)/ManageNews")}
          />
          <FlatList
            data={news.slice(0, 5)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(shared)/NewsDetails",
                    params: { id: item.id },
                  })
                }
              >
                <ImageBackground
                  source={{
                    uri: item.imageUrl || "https://via.placeholder.com/400x200",
                  }}
                  style={styles.banner}
                  imageStyle={styles.bannerImage}
                >
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.65)"]}
                    style={styles.bannerOverlay}
                  >
                    <Text style={styles.bannerTitle} numberOfLines={2}>
                      {item.title || "Untitled News"}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>
            )}
          />
        </View>

        <Divider />

        {/* SECTION: Recent Events */}
        <View style={styles.sectionContainer}>
          <SectionHeader
            title="Recent Events"
            showViewAll
            onViewAll={() => router.push("/(admin)/(tabs)/ManageEvents")}
          />
          <FlatList
            data={events.slice(0, 4)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsList}
            renderItem={({ item }) => (
              <Pressable
                style={styles.eventCard}
                onPress={() =>
                  router.push({
                    pathname: "/(shared)/EventDetails",
                    params: { id: item.id },
                  })
                }
              >
                <ImageBackground
                  source={{
                    uri: item.imageUrl || "https://via.placeholder.com/200x150",
                  }}
                  style={styles.eventImage}
                  imageStyle={{ borderRadius: 14 }}
                >
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.6)"]}
                    style={styles.eventOverlay}
                  >
                    <Text style={styles.eventTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>
            )}
          />
        </View>

        <Divider />

        {/* SECTION: Quick Access */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="Quick Access" />
          <View style={styles.grid}>
            {menuItems.map((m) => (
              <Pressable
                key={m.label}
                style={({ pressed }) => [
                  styles.gridItem,
                  pressed && { transform: [{ scale: 0.97 }], opacity: 0.85 },
                ]}
                onPress={() => router.push(m.route)}
              >
                <LinearGradient
                  colors={Colors.gradientAccent ?? ["#007AFF", "#00C6FF"]}
                  style={styles.iconBox}
                >
                  <Ionicons
                    name={m.icon as any}
                    size={22}
                    color={Colors.textInverse}
                  />
                </LinearGradient>
                <Text style={styles.gridLabel}>{m.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </GlossyBackground>
  );
}

/* --- Small Components --- */
const SectionHeader = ({
  title,
  showViewAll = false,
  onViewAll,
}: {
  title: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}) => (
  <View style={styles.sectionHeaderRow}>
    <LinearGradient
      colors={Colors.gradientAccent}
      style={styles.sectionAccent}
    />
    <Text style={styles.sectionHeading}>{title}</Text>
    {showViewAll && (
      <Pressable onPress={onViewAll} style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>View All</Text>
      </Pressable>
    )}
  </View>
);

const Divider = () => (
  <LinearGradient
    colors={[Colors.border, "transparent"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.divider}
  />
);

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  leaderInfo: { flexDirection: "row", alignItems: "center" },
  leaderAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: Colors.surfaceDark,
  },
  leaderName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  subText: { fontSize: 13, color: Colors.textMuted },

  sectionContainer: {
    marginTop: 24,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionAccent: {
    width: 4,
    height: 22,
    borderRadius: 4,
    marginRight: 10,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
    color: Colors.textPrimary,
    flex: 1,
  },
  viewAllButton: { paddingHorizontal: 10 },
  viewAllText: { color: Colors.info, fontWeight: "600", fontSize: 13 },

  divider: {
    height: 1.5,
    marginHorizontal: 20,
    opacity: 0.4,
    marginTop: 20,
  },

  /* carousel */
  carousel: { paddingLeft: 20 },
  banner: {
    width: width * 0.78,
    height: 160,
    marginRight: 14,
    borderRadius: 16,
    overflow: "hidden",
  },
  bannerImage: { borderRadius: 16 },
  bannerOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 14,
  },
  bannerTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },

  /* events */
  eventsList: { paddingLeft: 20 },
  eventCard: {
    width: 150,
    height: 120,
    borderRadius: 14,
    marginRight: 12,
    overflow: "hidden",
    backgroundColor: Colors.card,
  },
  eventImage: { width: "100%", height: "100%" },
  eventOverlay: { flex: 1, justifyContent: "flex-end", padding: 10 },
  eventTitle: { color: "#fff", fontWeight: "600", fontSize: 13 },

  /* grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  gridItem: {
    width: "28%",
    aspectRatio: 1,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: Colors.transparent,
    shadowColor: Colors.shadow,
    borderColor: Colors.border2,
    borderWidth: 2,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  gridLabel: { fontSize: 12, fontWeight: "600", color: Colors.textWhite },
});
