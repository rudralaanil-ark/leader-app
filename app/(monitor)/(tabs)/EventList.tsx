// monitor/(tabs)/EventList.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  deleteEvent,
  listenInterestedCount,
  listenToEvents,
} from "./api/events";

type EventItem = any;

export default function EventList() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = listenToEvents((data) => {
      setEvents(data);
      setLoading(false);
      setRefreshing(false);
    });
    return unsub;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // re-run listener briefly - the listener updates state in real-time
    const unsub = listenToEvents((data) => {
      setEvents(data);
      setRefreshing(false);
    });
    setTimeout(() => unsub(), 1000);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteEvent(id);
          } catch (err) {
            Alert.alert("Error", "Failed to delete event");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <View style={{ padding: 16 }}>
        <Text style={styles.heading}>All Events</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() =>
              router.push({
                pathname: "./EventDetails",
                params: { id: item.id },
              })
            }
            onEdit={() =>
              router.push({ pathname: "./AddEvent", params: { id: item.id } })
            }
            onDelete={() => handleDelete(item.id)}
          />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 80 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: "#666" }}>No events available</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: "./AddEvent",
            params: {}, // ensure empty/new
          })
        }
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/** EventCard: subscribes to interested count for each event */
function EventCard({
  event,
  onPress,
  onEdit,
  onDelete,
}: {
  event: EventItem;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!event?.id) return;
    const unsub = listenInterestedCount(event.id, (n) => setCount(n));
    return unsub;
  }, [event?.id]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* optional image */}
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.image} />
      ) : null}

      <View style={styles.content}>
        <View style={styles.rowTop}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <TouchableOpacity onPress={onEdit} style={{ marginRight: 8 }}>
              <Ionicons name="create-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text numberOfLines={2} style={styles.desc}>
          {event.description}
        </Text>

        {event.venue ? (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={14} color="#777" />
            <Text style={styles.meta}>{event.venue}</Text>
          </View>
        ) : null}

        <View style={styles.rowBottom}>
          <Text style={styles.meta}>
            {event.dateTime?.toDate
              ? event.dateTime.toDate().toLocaleString()
              : ""}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* interested badge */}
            {count > 0 && (
              <View style={styles.badge}>
                <Ionicons name="heart" size={12} color="#fff" />
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            )}

            <TouchableOpacity onPress={onDelete} style={{ marginLeft: 12 }}>
              <Ionicons name="trash-outline" size={20} color="#d11" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 6,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    overflow: "hidden",
  },
  image: { width: 90, height: 90, borderRadius: 8, marginRight: 10 },
  content: { flex: 1 },
  title: { fontWeight: "bold", fontSize: 16, flex: 1 },
  desc: { color: "#555", marginVertical: 4 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  meta: { color: "#777", fontSize: 12, marginLeft: 4 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  badge: {
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
});
