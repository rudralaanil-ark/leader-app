import Colors from "@/data/Colors";
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  imageUrl: string;
  onPress: () => void;
};

export default function GalleryCard({ imageUrl, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 240,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
