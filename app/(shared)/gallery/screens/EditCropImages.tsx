// app/(monitor)/(tabs)/EditCropImages.tsx

import Colors from "@/data/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function EditCropImages() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{ images?: string }>();

  const incoming = params.images ? JSON.parse(String(params.images)) : [];

  /** Normalize incoming image list */
  const normalized: { localPath: string }[] = incoming.map((it: any) => ({
    localPath: it.localPath ?? it.path ?? it,
  }));

  /** Only need read-only images → no setter */
  const [images] = useState(normalized);
  const [index, setIndex] = useState(0);
  const [cropped, setCropped] = useState<string[]>([]);

  /** BACK HANDLER → Return to GalleryList */
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      router.replace("/(shared)/gallery/screens/GalleryList");
      return true;
    });
    return () => sub.remove();
  }, []);

  /** If no images → exit */

  useEffect(() => {
    if (!images || images.length === 0) {
      router.back();
    }
  }, [images]);

  /** Cropper */
  const cropCurrent = async () => {
    const uri = images[index]?.localPath;
    if (!uri) return;

    try {
      const result = await ImagePicker.openCropper({
        path: uri,
        cropping: true,
        freeStyleCropEnabled: true,
        mediaType: "photo",
        compressImageQuality: 0.9,
        showCropGuidelines: true,
        hideBottomControls: false,
        cropperToolbarTitle: "Crop Image",
      });

      const newPath = result.path;

      setCropped((prev) => {
        const copy = [...prev];
        copy[index] = newPath;
        return copy;
      });

      if (index < images.length - 1) setIndex(index + 1);
    } catch (e) {
      // user cancelled crop → ignore
    }
  };

  /** Done → go to review screen */
  const onDone = () => {
    const final = images.map((img, i) => ({
      localPath: cropped[i] ?? img.localPath,
      key: `img-${i}`,
    }));

    router.replace({
      pathname: "/(shared)/gallery/screens/CreateGalleryReview",
      params: { images: JSON.stringify(final) },
    });
  };

  const currentPath = cropped[index] ?? images[index]?.localPath;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={cropCurrent} style={styles.btnWhite}>
          <Text style={styles.btnWhiteText}>Crop</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDone} style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Main Image */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: currentPath }} style={styles.image} />
      </View>

      {/* Thumbnails */}
      <View style={styles.thumbBar}>
        <FlatList
          horizontal
          data={images}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => "t-" + i}
          renderItem={({ item, index: i }) => {
            const uri = cropped[i] ?? item.localPath;
            return (
              <TouchableOpacity onPress={() => setIndex(i)}>
                <Image
                  source={{ uri }}
                  style={[
                    styles.thumb,
                    index === i && {
                      borderColor: Colors.primary,
                      borderWidth: 2,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

/** STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  btnWhite: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: Colors.lightCard,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnWhiteText: {
    fontWeight: "600",
    color: Colors.textPrimary,
  },

  btnPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: Colors.primary,
    borderRadius: 18,
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "700",
  },

  imageWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: width * 0.95,
    height: height * 0.55,
    resizeMode: "contain",
    borderRadius: 12,
  },

  thumbBar: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#fafafa",
  },

  thumb: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
});
