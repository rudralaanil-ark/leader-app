// FolderScreen.tsx
import Colors from "@/data/Colors";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { foldersService } from "../../../services/foldersService";
import { Folder, FolderImage } from "../../../utils/types";
import GalleryGrid from "../components/GalleryGrid";
import LightboxModal from "../components/LightboxModal";

type Params = { folderId?: string };

export default function FolderScreen() {
  const params = useLocalSearchParams() as Params;
  const folderId = params.folderId;

  const [folder, setFolder] = useState<Folder | null>(null);
  const [images, setImages] = useState<FolderImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!folderId) return;

    (async () => {
      try {
        const folderInfo = await foldersService.getFolder(folderId);
        const imgs = await foldersService.getFolderImages(folderId);

        setFolder(folderInfo);
        setImages(imgs);
      } catch (err) {
        console.error("FolderScreen error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [folderId]);

  if (loading || !folder) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // 🔥 SAFE DATE HELPER
  const toJsDate = (ts: any): Date => {
    if (ts?.toDate) return ts.toDate(); // Firestore Timestamp
    if (typeof ts === "number") return new Date(ts);
    if (typeof ts === "string") return new Date(ts);
    return new Date();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🍎 BEAUTIFUL HEADER */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{folder.name}</Text>

        {folder.description ? (
          <Text style={styles.description}>{folder.description}</Text>
        ) : null}

        {/* ⭐ DATE LEFT — IMAGE COUNT RIGHT */}
        <View style={styles.metaRow}>
          <Text style={styles.metaLeft}>
            {toJsDate(folder.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>

          <Text style={styles.metaRight}>
            {images.length} {images.length === 1 ? "image" : "images"}
          </Text>
        </View>
      </View>

      {/* 📸 GRID */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <GalleryGrid
          images={images.map((img) => ({ id: img.id, url: img.url }))}
          onPressImage={(i) => setSelectedImage(images[i].url)}
        />
      </ScrollView>

      {/* 🔍 LIGHTBOX */}
      <LightboxModal
        visible={!!selectedImage}
        imageUrl={selectedImage || ""}
        onClose={() => setSelectedImage(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /* 🍎 HEADER */
  headerContainer: {
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: 0.2,
    textAlign: "center",
  },

  description: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
    lineHeight: 20,
    textAlign: "center",
  },

  /* ⭐ META ROW (DATE LEFT — COUNT RIGHT) */
  metaRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  metaLeft: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },

  metaRight: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
  },

  /* LOADING SCREEN */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
});
