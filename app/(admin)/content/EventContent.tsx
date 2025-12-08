import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { getMonitorMap } from "@/app/utils/getMonitorMap";

const { width } = Dimensions.get("window");

export default function AdminEventContent({
  monitorId,
}: {
  monitorId: string;
}) {
  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [monitorMap, setMonitorMap] = useState<any>({});

  /** Load monitor names */
  useEffect(() => {
    (async () => {
      const map = await getMonitorMap();
      setMonitorMap(map);
    })();
  }, []);

  /** Load events */
  const loadEvents = useCallback(() => {
    setLoading(true);

    let q: any = query(collection(db, "events"), orderBy("createdAt", "desc"));

    if (monitorId !== "all") {
      q = query(
        collection(db, "events"),
        where("createdBy", "==", monitorId),
        orderBy("createdAt", "desc")
      );
    }

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));

      setEvents(arr);
      setLoading(false);
      setRefreshing(false);
    });

    return unsub;
  }, [monitorId]);

  useEffect(() => {
    const unsub = loadEvents();
    return unsub;
  }, [loadEvents]);

  /** Pull to Refresh */
  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  /** Delete Event */
  const handleDelete = (id: string) =>
    Alert.alert("Delete Event", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteDoc(doc(db, "events", id)),
      },
    ]);

  /** Edit Event */
  const handleEdit = (id: string) => {
    router.push({
      pathname: "/(admin)/events/EditEvent",
      params: { id },
    });
  };

  /** View Details */
  const handleDetails = (id: string) => {
    router.push({
      pathname: "/(shared)/EventDetails",
      params: { id },
    });
  };

  /** Formatters */
  const formatDate = (ts: any) => {
    try {
      const d = ts?.toDate?.() ?? new Date(ts);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatTime = (ts: any) => {
    try {
      const d = ts?.toDate?.() ?? new Date(ts);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "—";
    }
  };

  /** Render Each Card */
  const renderItem = ({ item }: { item: any }) => {
    const monitor = {
      fullName:
        item.createdByName ||
        monitorMap[item.createdBy]?.fullName ||
        "Unknown",

      profileImage:
        item.createdByImage ||
        monitorMap[item.createdBy]?.profileImage ||
        null,
    };

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => handleDetails(item.id)}
      >
        {/* Image */}
        <Image
          source={{
            uri:
              item.imageUrl ||
              "https://via.placeholder.com/300x200.png?text=No+Image",
          }}
          style={styles.image}
        />

        {/* Bottom white content box */}
        <View style={styles.bottomBox}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>

          {/* VENUE */}
          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.venueText}>{item.venue || "—"}</Text>
          </View>

          {/* DATE + TIME */}
          <View style={styles.row}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.meta}>
              {formatDate(item.dateTime || item.createdAt)}
            </Text>

            <Text style={styles.dot}>•</Text>

            <Ionicons name="time-outline" size={18} color={Colors.primary} />
            <Text style={styles.meta}>{formatTime(item.dateTime)}</Text>
          </View>

          {/* CREATED BY + ACTIONS */}
          <View style={styles.footerRow}>
            {/* Created BY */}
            <View style={styles.createdByRow}>
              {monitor.profileImage ? (
                <Image
                  source={{ uri: monitor.profileImage }}
                  style={styles.monitorAvatarSmall}
                />
              ) : (
                <View style={styles.monitorAvatarSmallPlaceholder}>
                  <Text style={styles.monitorInitial}>
                    {monitor.fullName.charAt(0)}
                  </Text>
                </View>
              )}

              <Text style={styles.createdByName}>{monitor.fullName}</Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleEdit(item.id)}
                style={styles.iconButton}
              >
                <Ionicons name="create-outline" size={24} color={Colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={[styles.iconButton, { marginLeft: 10 }]}
              >
                <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 180 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => router.push("/(admin)/events/AddEvent")}
      >
        <Ionicons name="add" size={34} color="#fff" />
      </TouchableOpacity>
    </>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 5,
  },
  image: {
    width: "100%",
    height: width * 0.48,
    resizeMode: "cover",
  },

  bottomBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginTop: -20,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  desc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  venueText: {
    marginLeft: 6,
    color: Colors.textPrimary,
    fontWeight: "600",
  },

  meta: {
    marginLeft: 6,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  dot: {
    marginHorizontal: 6,
    color: Colors.textSecondary,
    fontSize: 14,
  },

  footerRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  createdByRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  monitorAvatarSmall: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
  },
  monitorAvatarSmallPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.surfaceDark,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  monitorInitial: {
    color: "#fff",
    fontWeight: "700",
  },
  createdByName: {
    color: Colors.textPrimary,
    fontWeight: "700",
    fontSize: 12,
  },

  actions: {
    flexDirection: "row",
  },

  iconButton: {
    padding: 6,
    backgroundColor: Colors.card,
    borderRadius: 20,
    elevation: 2,
  },

  fab: {
    position: "absolute",
    right: 22,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
