// import { postsService } from "@/app/services/postsService";
// import Colors from "@/data/Colors";
// import { Feather } from "@expo/vector-icons";
// import React, { useEffect, useState } from "react";
// import {
//   FlatList,
//   Image,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { getProfileImageUrl } from "@/app/utils/profileImage";

// export default function LikedUsersModal({
//   visible,
//   onClose,
//   postId,
// }: {
//   visible: boolean;
//   onClose: () => void;
//   postId: string;
// }) {
//   const [likedUsers, setLikedUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!visible) return;

//     setLoading(true);

//     (async () => {
//       const data = await postsService.getPostLikes(postId);
//       setLikedUsers(data);
//       setLoading(false);
//     })();
//   }, [visible]);

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={false}
//       onRequestClose={onClose} // ⭐ REQUIRED FOR ANDROID BACK BUTTON
//     >
//       <SafeAreaView style={styles.container}>
//         {/* HEADER */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={onClose}>
//             <Feather name="chevron-left" size={30} color={Colors.textPrimary} />
//           </TouchableOpacity>

//           <Text style={styles.title}>Liked by</Text>

//           <View style={{ width: 40 }} />
//         </View>

//         {/* LIST */}
//         {loading ? (
//           <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
//         ) : (
//           <FlatList
//             data={likedUsers}
//             keyExtractor={(item) => item.userId}
//             renderItem={({ item }) => (
//               <View style={styles.row}>
//                 <Image
//                   source={{
//                     uri:
//                       item.photoURL ||
//                       "https://cdn-icons-png.flaticon.com/512/149/149071.png",
//                   }}
//                   style={styles.avatar}
//                 />

//                 <Text style={styles.name}>{item.name}</Text>
//               </View>
//             )}
//             ItemSeparatorComponent={() => (
//               <View style={{ height: 1, backgroundColor: Colors.border }} />
//             )}
//           />
//         )}
//       </SafeAreaView>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 14,
//     borderBottomWidth: 1,
//     borderColor: Colors.border,
//   },
//   back: {
//     fontSize: 22,
//     color: Colors.textPrimary,
//     width: 40,
//   },
//   title: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     color: Colors.textPrimary,
//     fontWeight: "700",
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 14,
//   },
//   avatar: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     marginRight: 12,
//     backgroundColor: Colors.surface,
//   },
//   name: {
//     color: Colors.textPrimary,
//     fontSize: 15,
//   },
// });

import { postsService } from "@/app/services/postsService";
import { getProfileImageUrl } from "@/app/utils/profileImage";
import Colors from "@/data/Colors";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LikedUsersModal({
  visible,
  onClose,
  postId,
}: {
  visible: boolean;
  onClose: () => void;
  postId: string;
}) {
  const [likedUsers, setLikedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;

    setLoading(true);

    (async () => {
      const data = await postsService.getPostLikes(postId);
      setLikedUsers(data);
      setLoading(false);
    })();
  }, [visible, postId]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose} // ✅ Android back button
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Feather name="chevron-left" size={30} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.title}>Liked by</Text>

          <View style={{ width: 40 }} />
        </View>

        {/* LIST */}
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
        ) : (
          <FlatList
            data={likedUsers}
            keyExtractor={(item) => item.userId}
            renderItem={({ item }) => {
              const avatarUrl = getProfileImageUrl(item.photoURL);

              return (
                <View style={styles.row}>
                  {avatarUrl ? (
                    <Image
                      source={{ uri: avatarUrl }}
                      style={styles.avatar}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarLetter}>
                        {(item.name || "U").charAt(0)}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.name}>{item.name}</Text>
                </View>
              );
            }}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: Colors.border }} />
            )}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    backgroundColor: Colors.surface,
  },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    backgroundColor: Colors.surfaceDark,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textInverse,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 15,
  },
});
