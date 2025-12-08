// app/components/gallery/GalleryGrid.tsx
import Colors from "@/data/Colors";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_SIZE = (SCREEN_WIDTH - 8 * 4) / 3;

interface Props {
  images: { id: string; url: string }[];
  onPressImage: (index: number) => void;
}

export default function GalleryGrid({ images, onPressImage }: Props) {
  return (
    <View style={styles.container}>
      {images.map((img, index) => (
        <TouchableOpacity
          key={img.id}
          onPress={() => onPressImage(index)}
          style={styles.imageWrapper}
        >
          <Image source={{ uri: img.url }} style={styles.image} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 4,
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 4,
    // borderRadius: 8,
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: Colors.surface,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
