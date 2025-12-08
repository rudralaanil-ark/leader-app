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

interface MonitorMapType {
  [key: string]: { fullName: string; profileImage?: string | null };
}

export default function AdminNewsContent({ monitorId }: { monitorId: string }) {
  const router = useRouter();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [monitorMap, setMonitorMap] = useState<MonitorMapType>({});

  /* LOAD MONITOR MAP */
  useEffect(() => {
    (async () => {
      const map = await getMonitorMap();
      setMonitorMap(map);
    })();
  }, []);

  /* LOAD NEWS */
  const loadNews = useCallback(() => {
    setLoading(true);

    let q = query(collection(db, "news"), orderBy("createdAt", "desc"));

    if (monitorId !== "all") {
      q = query(
        collection(db, "news"),
        where("createdBy", "==", monitorId),
        orderBy("createdAt", "desc")
      );
    }

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNews(arr);
      setLoading(false);
      setRefreshing(false);
    });

    return unsub;
  }, [monitorId]);

  useEffect(() => {
    const unsub = loadNews();
    return unsub;
  }, [loadNews]);

  const onRefresh = () => {
    setRefreshing(true);
    loadNews();
  };

  /* DELETE */
  const handleDelete = (id: string) =>
    Alert.alert("Delete News", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => await deleteDoc(doc(db, "news", id)),
      },
    ]);

  /* EDIT */
  const handleEdit = (id: string) => {
    router.push({
      pathname: "/(admin)/news/EditNews",
      params: { id },
    });
  };

  /* VIEW DETAILS */
  const handleViewDetails = (id: string) => {
    router.push({
      pathname: "/(shared)/NewsDetails",
      params: { id },
    });
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "—";
    try {
      const d =
        typeof timestamp.toDate === "function"
          ? timestamp.toDate()
          : new Date(timestamp);

      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  /* ------------------ CARD UI ------------------ */
  const renderItem = ({ item }: { item: any }) => {
    const monitor = monitorMap[item.createdBy] || {
      fullName: "Unknown",
      profileImage: null,
    };

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => handleViewDetails(item.id)}
      >
        {/* IMAGE */}
        <Image
          source={{
            uri:
              item.imageUrl ||
              "https://via.placeholder.com/300x200.png?text=No+Image",
          }}
          style={styles.image}
        />

        {/* WHITE BOTTOM CONTENT BOX */}
        <View style={styles.bottomBox}>
          {/* TITLE */}
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          {/* DESCRIPTION */}
          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>

          {/* DATE */}
          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.meta}>{formatDate(item.createdAt)}</Text>
          </View>

          {/* CREATED BY + ACTIONS */}
          <View style={styles.footerRow}>
            {/* CREATED BY */}
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

            {/* ACTION BUTTONS */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleEdit(item.id)}
                style={styles.iconButton}
              >
                <Ionicons
                  name="create-outline"
                  size={22}
                  color={Colors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={[styles.iconButton, { marginLeft: 12 }]}
              >
                <Ionicons name="trash-outline" size={22} color="#ff4d4d" />
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
        data={news}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 180 }}
      />

      {/* ➕ CREATE NEWS FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(admin)/news/AddNews")}
      >
        <Ionicons name="add" size={34} color="#fff" />
      </TouchableOpacity>
    </>
  );
}

/* ------------------ UPDATED CLEAN UI STYLES ------------------ */

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 5,
  },

  image: {
    width: "100%",
    height: width * 0.48,
    resizeMode: "cover",
  },

  /* WHITE CONTENT BOX */
  bottomBox: {
    backgroundColor: "#fff",
    padding: 15,
    paddingBottom: 20,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginTop: -18,
  },

  title: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.textPrimary,
  },

  desc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 6,
    marginBottom: 10,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  meta: {
    marginLeft: 6,
    color: Colors.textSecondary,
    fontSize: 13,
  },

  footerRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  /* CREATED BY */
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
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  /* ACTION BUTTONS */
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
