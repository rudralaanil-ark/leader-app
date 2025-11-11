// user/(tabs)/EventDetailsUser.tsx
import { getEvent, markInterested } from "@/app/(monitor)/(tabs)/api/events";
import { db } from "@/configs/FirebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

export default function EventDetailsUser() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [interested, setInterested] = useState(false);
  const [saving, setSaving] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  // ❤️ Animation value
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (id) loadEvent(id);
  }, [id]);

  const loadEvent = async (eventId: string) => {
    const data = await getEvent(eventId);
    if (data) setEvent(data);
    setLoading(false);
  };

  // 🔙 Handle Android back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.push("/(user)/(tabs)/Events");
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [])
  );

  // 🔄 Real-time Firestore sync for interest status
  useEffect(() => {
    if (!id || !currentUser) return;
    const unsub = onSnapshot(
      doc(db, "events", id, "interested", currentUser.uid),
      (docSnap) => {
        setInterested(docSnap.exists());
      }
    );
    return unsub;
  }, [id, currentUser]);

  // ✅ Toggle Interest
  const handleInterested = async () => {
    try {
      setSaving(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      const result = await markInterested(id as string, {
        id: currentUser.uid,
        name: userData.name || currentUser.displayName || "User",
        email: currentUser.email,
        phone: userData.phone || "",
      });

      // Immediate visual feedback
      if (result?.status === "added") {
        setInterested(true);
        ToastAndroid.show("Marked as Interested!", ToastAndroid.SHORT);
      } else if (result?.status === "removed") {
        setInterested(false);
        ToastAndroid.show("Interest removed", ToastAndroid.SHORT);
      }

      // ❤️ Trigger bounce animation
      animateHeart();
    } catch (err) {
      console.error(err);
      ToastAndroid.show("Error updating interest", ToastAndroid.SHORT);
    } finally {
      setSaving(false);
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
        <Text>No event found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ImageBackground
        source={
          event.imageUrl
            ? { uri: event.imageUrl }
            : require("@/assets/images/react-logo.png")
        }
        style={styles.image}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.overlay}
        />

        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Title Info */}
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
              {event.dateTime?.toDate
                ? event.dateTime.toDate().toLocaleString()
                : ""}
            </Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>About the Event</Text>
        <Text style={styles.description}>{event.description}</Text>

        {/* ❤️ Animated Interested Button */}
        <View style={styles.interestedContainer}>
          <TouchableOpacity
            style={[
              styles.interestedButton,
              interested && styles.interestedActive,
            ]}
            disabled={saving}
            onPress={handleInterested}
            activeOpacity={0.8}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons
                name={interested ? "heart" : "heart-outline"}
                size={22}
                color="#fff"
                style={{ marginRight: 6 }}
              />
            </Animated.View>
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              {interested ? "Interested ✓" : "Mark as Interested"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: { width: "100%", height: 280, justifyContent: "flex-end" },
  overlay: { ...StyleSheet.absoluteFillObject },
  bannerText: { paddingHorizontal: 20, paddingBottom: 40 },
  title: { color: "#fff", fontSize: 24, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  meta: { color: "#fff", fontSize: 14, marginLeft: 6 },
  detailsContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 10,
  },
  description: { fontSize: 15, color: "#444", lineHeight: 22 },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },
  interestedContainer: { alignItems: "center", marginVertical: 30 },
  interestedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 3,
  },
  interestedActive: { backgroundColor: "#34C759" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
