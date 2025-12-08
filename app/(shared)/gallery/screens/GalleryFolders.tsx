// (shared)/screens/GalleryFolders.tsx
import { auth } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { foldersService } from "../../../services/foldersService";

const { width } = Dimensions.get("window");
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (width - ITEM_MARGIN * 3) / 2;

export default function GalleryFolders() {
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<
    "admin" | "monitor" | "user"
  >("user");

  const router = useRouter();

  // 🔄 Refresh folders when returning to this screen
  useFocusEffect(
    useCallback(() => {
      loadFolders();
    }, [])
  );

  useEffect(() => {
    loadFolders();

    // fetch role
    (async () => {
      try {
        const u = auth.currentUser;
        if (!u) return;

        const snap = await getDoc(
          doc((await import("@/configs/FirebaseConfig")).db, "users", u.uid)
        );

        if (snap.exists()) {
          const d = snap.data();
          const role = d?.role ?? d?.userRole ?? d?.createdByRole ?? "user";
          setCurrentUserRole(
            role === "admin" ? "admin" : role === "monitor" ? "monitor" : "user"
          );
        }
      } catch {}
    })();
  }, []);

  const loadFolders = async () => {
    setLoading(true);
    try {
      const f = await foldersService.getAllFolders();
      setFolders(f);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const openFolder = (item: any) => {
    router.push({
      pathname: "/(shared)/gallery/screens/FolderScreen",
      params: { folderId: item.id },
    });
  };

  const openFolderOptions = (folder: any) => {
    Alert.alert("Folder Options", "", [
      {
        text: "Edit",
        onPress: () =>
          router.push({
            pathname: "/(shared)/gallery/screens/CreateGalleryReview",
            params: { folderId: folder.id },
          }),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDeleteFolder(folder.id),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const confirmDeleteFolder = async (folderId: string) => {
    Alert.alert("Delete Folder", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await foldersService.deleteFolder(folderId);
          loadFolders();
        },
      },
    ]);
  };

  const formatDate = (ts: any) => {
    try {
      const ms = ts?.seconds ? ts.seconds * 1000 : Date.now();
      const d = new Date(ms);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={folders}
      numColumns={2}
      keyExtractor={(it) => it.id}
      contentContainerStyle={{ padding: ITEM_MARGIN }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => openFolder(item)}
          style={[styles.item, { width: ITEM_WIDTH, margin: ITEM_MARGIN / 2 }]}
        >
          {/* Thumbnail */}
          <Image
            source={{ uri: item.thumbnailUrl || undefined }}
            style={styles.thumb}
            resizeMode="cover"
          />

          {/* Options */}
          {(currentUserRole === "admin" || currentUserRole === "monitor") && (
            <TouchableOpacity
              style={styles.menuBtn}
              onPress={() => openFolderOptions(item)}
            >
              <Entypo
                name="dots-three-vertical"
                size={18}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
          )}

          {/* NAME + DATE AREA */}
          <View style={styles.infoBox}>
            {/* Name: max 2 lines */}
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {item.name || "Untitled"}
            </Text>

            {/* Creator (optional) */}
            {(currentUserRole === "admin" || currentUserRole === "monitor") && (
              <Text style={styles.creator}>
                By: {item.createdByName ?? "Unknown"}
              </Text>
            )}

            {/* DATE fixed bottom-right */}
            <Text style={styles.dateLabel}>{formatDate(item.createdAt)}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  item: {
    backgroundColor: Colors.lightCard,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: ITEM_MARGIN,
    borderWidth: 1,
    borderColor: Colors.border,
    position: "relative",
  },

  menuBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 20,
    backgroundColor: Colors.card,
    padding: 4,
    borderRadius: 8,
  },

  thumb: {
    width: "100%",
    height: ITEM_WIDTH,
    backgroundColor: Colors.surface,
  },

  // FIXED HEIGHT BOX — ensures date appears at same place always
  infoBox: {
    height: 80, // FIXED HEIGHT → date stays in same Y position
    paddingHorizontal: 10,
    paddingTop: 10,
    justifyContent: "flex-start",
    position: "relative",
  },

  title: {
    fontWeight: "700",
    color: Colors.textPrimary,
    fontSize: 15,
    textAlign: "left",
    lineHeight: 20,
    paddingHorizontal: 6,
  },

  creator: {
    marginTop: 2,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
  },

  dateLabel: {
    position: "absolute",
    bottom: 6,
    right: 8,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
