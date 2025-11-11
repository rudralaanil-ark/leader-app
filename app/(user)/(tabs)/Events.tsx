// user/(tabs)/Events.tsx
import {
  listenToEvents,
  markInterested,
} from "@/app/(monitor)/(tabs)/api/events";
import { db } from "@/configs/FirebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Events() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interestedMap, setInterestedMap] = useState<Record<string, boolean>>(
    {}
  );
  const [now, setNow] = useState(new Date()); // ✅ For countdown updates

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsub = listenToEvents((data) => {
      setEvents(data);
      setLoading(false);
      setRefreshing(false);
    });
    return unsub;
  }, []);

  // 🔄 Update countdown every 1 minute
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // update every 60 sec
    return () => clearInterval(timer);
  }, []);

  // ✅ Listen to user’s interest per event
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribers = events.map((ev) =>
      onSnapshot(
        doc(db, "events", ev.id, "interested", currentUser.uid),
        (docSnap) => {
          setInterestedMap((prev) => ({
            ...prev,
            [ev.id]: docSnap.exists(),
          }));
        }
      )
    );

    return () => unsubscribers.forEach((u) => u && u());
  }, [events, currentUser]);

  const onRefresh = async () => {
    setRefreshing(true);
    const unsub = listenToEvents((data) => {
      setEvents(data);
      setRefreshing(false);
    });
    setTimeout(() => unsub(), 1000);
  };

  const toggleInterest = async (eventId: string) => {
    try {
      if (!currentUser) {
        ToastAndroid.show("Please sign in first", ToastAndroid.SHORT);
        return;
      }

      // Optimistic local update (instant)
      setInterestedMap((prev) => ({
        ...prev,
        [eventId]: !prev[eventId],
      }));

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      const result = await markInterested(eventId, {
        id: currentUser.uid,
        name: userData.name || currentUser.displayName || "User",
        email: currentUser.email,
        phone: userData.phone || "",
      });

      if (result?.status === "added") {
        ToastAndroid.show("Marked as Interested!", ToastAndroid.SHORT);
      } else if (result?.status === "removed") {
        ToastAndroid.show("Interest removed", ToastAndroid.SHORT);
      }
    } catch (err) {
      console.error("toggleInterest error:", err);
      ToastAndroid.show("Error updating interest", ToastAndroid.SHORT);
    }
  };

  // ⏳ Helper to calculate countdown text
  const calculateCountdown = (eventDate: any) => {
    if (!eventDate) return "";
    const eventTime = eventDate.toDate
      ? eventDate.toDate()
      : new Date(eventDate);
    const diffMs = eventTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs <= 0 && diffMs > -3600000) return "Ongoing"; // within 1 hour after start
    if (diffMs <= -3600000) return "Event Ended"; // after 1 hour
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} to go`;
    if (diffHours > 0)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} to go`;
    if (diffMins > 0) return `${diffMins} min${diffMins > 1 ? "s" : ""} to go`;
    return "Starting soon";
  };

  const renderItem = ({ item }: { item: any }) => {
    const interested = interestedMap[item.id] || false;
    const countdown = calculateCountdown(item.dateTime);
    const eventDate = item.dateTime?.toDate ? item.dateTime.toDate() : null;

    // ✅ Event ended more than 1 hour ago?
    const ended = eventDate && now.getTime() - eventDate.getTime() > 3600000;

    return (
      <TouchableOpacity
        style={[styles.card, ended && { opacity: 0.6 }]} // ✅ fade effect
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "./EventDetailsUser",
            params: { id: item.id },
          })
        }
      >
        <View style={styles.cardInner}>
          <ImageBackground
            source={
              item.imageUrl
                ? { uri: item.imageUrl }
                : require("@/assets/images/react-logo.png")
            }
            style={styles.image}
            imageStyle={[
              styles.imageStyle,
              ended && { tintColor: "gray", overlayColor: "gray" }, // ✅ grayscale effect
            ]}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.overlay}
            />

            {/* ⏱️ Countdown Badge */}
            <View
              style={[
                styles.countdownBadge,
                countdown === "Event Ended" && styles.badgeEnded,
              ]}
            >
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={14} color="#fff" />
                <Text style={styles.meta}>
                  {item.dateTime?.toDate?.().toLocaleDateString?.()}
                </Text>
              </View>

              {item.venue ? (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={14} color="#fff" />
                  <Text style={styles.meta}>{item.venue}</Text>
                </View>
              ) : null}

              {/* ✅ Interested Button */}
              <TouchableOpacity
                style={[
                  styles.interestedButton,
                  interested && styles.interestedActive,
                ]}
                onPress={() => toggleInterest(item.id)}
                disabled={ended} // ❌ disable if event over
              >
                <Ionicons
                  name={interested ? "heart" : "heart-outline"}
                  size={18}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {interested ? "Interested ✓" : "Interested"}
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9", paddingTop: 12 }}>
      <Text style={styles.heading}>Upcoming Events</Text>

      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: "#888" }}>No events available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: "#fff",
  },
  cardInner: { borderRadius: 16, overflow: "hidden" },
  image: {
    width: "100%",
    height: width * 0.55,
    justifyContent: "flex-end",
  },
  imageStyle: { borderRadius: 16 },
  overlay: { ...StyleSheet.absoluteFillObject, borderRadius: 16 },
  countdownBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,122,255,0.95)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    elevation: 3, // ✅ subtle shadow for depth
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  badgeEnded: {
    backgroundColor: "rgba(90,90,90,0.9)",
  },
  countdownText: {
    color: "#fff",
    fontSize: 14, // ✅ larger text
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  textContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  meta: { color: "#fff", fontSize: 13, marginLeft: 6 },
  interestedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,122,255,0.8)",
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  interestedActive: {
    backgroundColor: "rgba(52,199,89,0.9)",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
