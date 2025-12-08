import {
  listenToEvents,
  markInterested,
} from "@/app/(monitor)/(tabs)/api/events";
import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Events() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interestedMap, setInterestedMap] = useState<Record<string, boolean>>(
    {}
  );

  const [tabIndex, setTabIndex] = useState(0);
  const scrollX = new Animated.Value(0);

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

  const now = new Date();

  const upcomingEvents = events
    .filter((ev) => {
      const dt = ev.dateTime?.toDate ? ev.dateTime.toDate() : null;
      return dt && dt >= now;
    })
    .sort((a, b) => {
      const da = a.dateTime?.toDate();
      const db = b.dateTime?.toDate();
      return da - db;
    });

  const pastEvents = events
    .filter((ev) => {
      const dt = ev.dateTime?.toDate ? ev.dateTime.toDate() : null;
      return dt && dt < now;
    })
    .sort((a, b) => {
      const da = a.dateTime?.toDate();
      const db = b.dateTime?.toDate();
      return db - da;
    });

  const DATA = [upcomingEvents, pastEvents];

  const shareEvent = async (item: any) => {
    try {
      const d = item.dateTime?.toDate ? item.dateTime.toDate() : null;
      const dateStr = d
        ? `${d.toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })} • ${d
            .toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .toLowerCase()}`
        : "TBA";
      const lines = [
        item.title || "Event",
        `Date: ${dateStr}`,
        `Venue: ${item.venue || "TBA"}`,
      ];
      await Share.share({ message: lines.join("\n") });
    } catch (e) {
      ToastAndroid.show("Unable to share", ToastAndroid.SHORT);
    }
  };

  const formatBadgeParts = (eventDate: any) => {
    if (!eventDate) return { top: "", bottom: "" };
    const d = eventDate.toDate ? eventDate.toDate() : new Date(eventDate);
    if (!(d instanceof Date) || isNaN(d.getTime()))
      return { top: "", bottom: "" };
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString(undefined, { month: "short" });
    const time = d
      .toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase()
      .replace(":", " : ");
    return { top: `${day} ${month}`, bottom: time };
  };

  const toggleInterest = async (eventId: string) => {
    try {
      if (!currentUser) {
        ToastAndroid.show("Please sign in first", ToastAndroid.SHORT);
        return;
      }

      setInterestedMap((prev) => ({
        ...prev,
        [eventId]: !prev[eventId],
      }));

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      const result = await markInterested(eventId, {
        id: currentUser.uid,
        name: userData.fullName || currentUser.displayName || "User",
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

  const renderEventCard = ({ item }: { item: any }) => {
    const interested = interestedMap[item.id] || false;
    const { top, bottom } = formatBadgeParts(item.dateTime);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "./EventDetailsUser",
            params: { id: item.id },
          })
        }
      >
        <ImageBackground
          source={
            item.imageUrl
              ? { uri: item.imageUrl }
              : require("@/assets/images/react-logo.png")
          }
          style={styles.image}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.dateBadge}>
            <Text style={styles.dateTop}>{top}</Text>
            <Text style={styles.dateBottom}>{bottom}</Text>
          </View>
        </ImageBackground>

        <View style={styles.body}>
          <View style={styles.row}>
            <Text style={styles.label}>Event :</Text>
            <Text style={styles.event} numberOfLines={2}>
              {item.title || "-"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Venue :</Text>
            <Text style={styles.venue} numberOfLines={1}>
              {item.venue || "—"}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.comingBtn, interested && styles.comingBtnActive]}
              onPress={(e) => {
                e.stopPropagation();
                toggleInterest(item.id);
              }}
            >
              <Ionicons
                name={interested ? "checkmark" : "checkmark-outline"}
                size={16}
                color={interested ? Colors.textInverse : Colors.text}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.comingText,
                  interested && styles.comingTextActive,
                ]}
              >
                I am coming
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={(e) => {
                e.stopPropagation();
                shareEvent(item);
              }}
            >
              <Ionicons name="share-outline" size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          paddingTop: insets.top,
        }}
      >
        <StatusBar backgroundColor={Colors.headerBackground} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ color: Colors.textMuted, marginTop: 8 }}>
            Loading events...
          </Text>
        </View>
      </View>
    );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.headerBackground,
        paddingTop: insets.top,
        // paddingBottom: insets.bottom + 20,
      }}
    >
      <StatusBar backgroundColor={Colors.headerBackground} />

      <View
        // edges={["bottom"]}
        style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
      >
        {/* NEW CLEAN TAB BAR */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => tabRef.scrollToIndex({ index: 0 })}
          >
            <Text
              style={[styles.tabText, tabIndex === 0 && styles.tabTextActive]}
            >
              Upcoming
            </Text>
            {tabIndex === 0 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => tabRef.scrollToIndex({ index: 1 })}
          >
            <Text
              style={[styles.tabText, tabIndex === 1 && styles.tabTextActive]}
            >
              Past Events
            </Text>
            {tabIndex === 1 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        <View style={styles.tabsDivider} />

        {/* SWIPE PAGES */}
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={DATA}
          onScroll={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            setTabIndex(Math.round(x / width));
          }}
          ref={(ref) => (tabRef = ref)}
          renderItem={({ item }) => (
            <FlatList
              data={item}
              keyExtractor={(i) => i.id}
              renderItem={renderEventCard}
              showsVerticalScrollIndicator={false}
              style={{ width }}
              contentContainerStyle={{
                paddingHorizontal: 12,
                paddingBottom: 100,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.primary]}
                  tintColor={Colors.primary}
                />
              }
              ListEmptyComponent={
                <View style={styles.center}>
                  <Text style={{ color: Colors.textMuted }}>
                    No events found
                  </Text>
                </View>
              }
            />
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </View>
  );
}

let tabRef: any = null;

const styles = StyleSheet.create({
  /* ---------------- TAB BAR UPDATED ---------------- */

  tabs: {
    backgroundColor: Colors.headerBackground,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 5,
  },

  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },

  tabText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "500",
  },

  tabTextActive: {
    color: Colors.textActive,
    fontWeight: "700",
  },

  tabUnderline: {
    marginTop: 6,
    height: 3,
    width: "100%",
    backgroundColor: Colors.textSecondary,
    borderRadius: 20,
  },

  tabsDivider: {
    height: 1,
    backgroundColor: Colors.border,
    width: "100%",
    marginBottom: 4,
  },

  /* -------- REMAINING STYLES UNTOUCHED -------- */

  card: {
    marginBottom: 8,
    marginTop: 10,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.elevatedCard,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: width * 0.7,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  dateBadge: {
    position: "absolute",
    left: 20,
    bottom: -20,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 90,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  dateTop: {
    color: Colors.textInverse,
    fontSize: 20,
    fontWeight: "800",
  },
  dateBottom: {
    color: Colors.textInverse,
    fontSize: 18,
    marginTop: 2,
    fontWeight: "600",
  },
  body: {
    zIndex: -1,
    paddingHorizontal: 14,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: Colors.elevatedCard,
  },
  row: {
    flexDirection: "row",
    marginTop: 6,
  },
  label: {
    color: Colors.textPrimary,
    width: 64,
    fontSize: 16,
    fontWeight: "400",
  },
  event: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  venue: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginRight: 15,
    alignSelf: "flex-end",
  },
  comingBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.2,
    backgroundColor: "#F1F1F3",
  },
  comingBtnActive: {
    backgroundColor: Colors.primary,
  },
  comingText: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 14,
  },
  comingTextActive: {
    color: Colors.textInverse,
  },
  iconBtn: {
    marginLeft: 18,
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: Colors.accent,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
