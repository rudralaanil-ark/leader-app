// // app/components/gallery/LightboxModal.tsx
// import React from "react";
// import {
//   Modal,
//   View,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import Colors from "@/data/Colors";

// interface Props {
//   visible: boolean;
//   imageUrl: string;
//   onClose: () => void;
// }

// export default function LightboxModal({ visible, imageUrl, onClose }: Props) {
//   return (
//     <Modal visible={visible} transparent={true}>
//       <View style={styles.overlay}>
//         <Image source={{ uri: imageUrl }} style={styles.image} />

//         <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
//           <Ionicons name="close" size={32} color="white" />
//         </TouchableOpacity>
//       </View>
//     </Modal>
//   );
// }

// const screen = Dimensions.get("window");

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: Colors.backdrop || "rgba(0,0,0,0.9)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   image: {
//     width: screen.width,
//     height: screen.height * 0.7,
//     resizeMode: "contain",
//   },
//   closeBtn: {
//     position: "absolute",
//     top: 40,
//     right: 20,
//     padding: 10,
//   },
// });

// app/components/gallery/LightboxModal.tsx
import { getProfileImageUrl } from "@/app/utils/profileImage";
import Colors from "@/data/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  imageUrl?: any; // string | object | null | undefined
  onClose: () => void;
}

export default function LightboxModal({ visible, imageUrl, onClose }: Props) {
  // ✅ Normalize image safely
  const safeImageUrl = getProfileImageUrl(imageUrl);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Render image ONLY if URL is valid */}
        {safeImageUrl && (
          <Image
            source={{ uri: safeImageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={onClose}
          activeOpacity={0.8}
        >
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
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
});
