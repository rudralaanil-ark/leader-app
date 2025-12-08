// app/components/gallery/LightboxModal.tsx
import React from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/data/Colors";

interface Props {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function LightboxModal({ visible, imageUrl, onClose }: Props) {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.overlay}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.backdrop || "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: screen.width,
    height: screen.height * 0.7,
    resizeMode: "contain",
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
});
