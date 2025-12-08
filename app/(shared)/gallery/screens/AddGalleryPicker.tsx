import Colors from "@/data/Colors";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import ImagePicker from "react-native-image-crop-picker";

export default function AddGalleryPicker() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const images = await ImagePicker.openPicker({
          multiple: true,
          mediaType: "photo",
          compressImageQuality: 0.8,
          maxFiles: 50,
        });

        if (!mounted) return;

        const selected = images.map((i: any, idx: number) => ({
          path: i.path,
          width: i.width,
          height: i.height,
          mime: i.mime,
          key: `img-${Date.now()}-${idx}`,
        }));

        if (!selected || selected.length === 0) {
          router.back();
          return;
        }

        router.replace({
          pathname: "/(shared)/gallery/screens/EditCropImages",
          params: { images: JSON.stringify(selected) },
        });
      } catch (err: any) {
        console.log("Picker cancelled/error:", err);
        router.back();
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.background,
      }}
    >
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
