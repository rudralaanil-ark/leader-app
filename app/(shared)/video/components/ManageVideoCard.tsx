// // app/(shared)/video/components/ManageVideoCard.tsx
// import { videoCacheService } from "@/app/services/videoCacheService";
// import { Ionicons } from "@expo/vector-icons";
// import React, { useEffect, useState } from "react";
// import {
//   Image,
//   Modal,
//   Pressable,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Video from "react-native-video";

// const FALLBACK_THUMBNAIL = "https://dummyimage.com/600x400/000/fff&text=Video";
// const FALLBACK_AVATAR = "https://dummyimage.com/100x100/cccccc/000&text=U";

// type Props = {
//   item: any;
//   index: number;
//   activeIndex: number;
//   isFocused: boolean;
//   onDelete: (post: any) => void;
//   onEdit: (post: any) => void;
//   onLikes: () => void;
//   onComments: () => void;
//   onShares: () => void;
// };

// export const ManageVideoCard: React.FC<Props> = ({
//   item,
//   onDelete,
//   onEdit,
//   onLikes,
//   onComments,
//   onShares,
// }) => {
//   const thumbnail = item.media?.[0]?.thumbnailUrl ?? FALLBACK_THUMBNAIL;

//   const [showPlayer, setShowPlayer] = useState(false);
//   const [localUri, setLocalUri] = useState<string | null>(null);

//   /* ================= LOAD CACHED VIDEO ON DEMAND ================= */

//   useEffect(() => {
//     let alive = true;

//     if (!showPlayer || !item?.id || !item?.media?.[0]?.url) return;

//     videoCacheService
//       .getCachedVideo(item.id, item.media[0].url)
//       .then((path) => {
//         if (alive) setLocalUri(path);
//       })
//       .catch(() => {});

//     return () => {
//       alive = false;
//     };
//   }, [showPlayer, item?.id]);

//   /* ================= UI ================= */

//   return (
//     <View style={styles.card}>
//       {/* OWNER */}
//       <View style={styles.ownerRow}>
//         <Image
//           source={{ uri: item.ownerProfileImage ?? FALLBACK_AVATAR }}
//           style={styles.avatar}
//         />
//         <View style={{ flex: 1 }}>
//           <Text style={styles.ownerName}>{item.ownerName}</Text>
//           <Text style={styles.ownerMeta}>{item.ownerRole}</Text>
//         </View>

//         <TouchableOpacity onPress={() => onEdit(item)}>
//           <Ionicons name="pencil" size={20} color="#2563EB" />
//         </TouchableOpacity>
//       </View>

//       {/* THUMBNAIL ONLY */}
//       <View style={styles.video}>
//         <Image
//           source={{ uri: thumbnail }}
//           style={StyleSheet.absoluteFill}
//           resizeMode="cover"
//         />

//         {/* PLAY BUTTON */}
//         <Pressable
//           style={styles.playOverlay}
//           onPress={() => setShowPlayer(true)}
//         >
//           <Ionicons name="play-circle" size={64} color="#ffffffcc" />
//         </Pressable>
//       </View>

//       {/* TITLE */}
//       <Text style={styles.title}>{item.title ?? "Untitled Video"}</Text>

//       {/* STATS */}
//       <View style={styles.statsRow}>
//         <Stat label="Likes" value={item.likeCount ?? 0} onPress={onLikes} />
//         <Stat
//           label="Comments"
//           value={item.commentCount ?? 0}
//           onPress={onComments}
//         />
//         <Stat label="Shares" value={item.shareCount ?? 0} onPress={onShares} />
//       </View>

//       {/* ACTIONS */}
//       <View style={styles.actionsRow}>
//         <TouchableOpacity onPress={() => onDelete(item)}>
//           <Ionicons name="trash-outline" size={22} color="#DC2626" />
//         </TouchableOpacity>
//       </View>

//       {/* ================= FULLSCREEN PLAYER ================= */}
//       <Modal visible={showPlayer} animationType="slide">
//         <View style={styles.playerContainer}>
//           {/* CLOSE */}
//           <TouchableOpacity
//             style={styles.closeBtn}
//             onPress={() => {
//               setShowPlayer(false);
//               setLocalUri(null);
//             }}
//           >
//             <Ionicons name="close" size={28} color="#fff" />
//           </TouchableOpacity>

//           <Video
//             source={{ uri: localUri || item.media?.[0]?.url }}
//             style={styles.fullVideo}
//             resizeMode="contain"
//             controls // ✅ forward / backward / seek
//             paused={false}
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// /* ================= SMALL ================= */

// const Stat = ({ label, value, onPress }: any) => (
//   <TouchableOpacity onPress={onPress} style={styles.stat}>
//     <Text style={styles.statValue}>{value}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </TouchableOpacity>
// );

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     margin: 12,
//     borderRadius: 18,
//     padding: 12,
//   },
//   ownerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//     backgroundColor: "#E5E7EB",
//   },
//   ownerName: { fontWeight: "700" },
//   ownerMeta: { fontSize: 12, color: "#6B7280" },

//   video: {
//     width: "100%",
//     height: 220,
//     borderRadius: 14,
//     overflow: "hidden",
//     backgroundColor: "#000",
//   },
//   playOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   title: {
//     marginTop: 10,
//     fontWeight: "700",
//   },

//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 12,
//   },
//   stat: { alignItems: "center" },
//   statValue: { fontWeight: "700" },
//   statLabel: { fontSize: 12 },

//   actionsRow: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     marginTop: 12,
//   },

//   /* PLAYER */
//   playerContainer: {
//     flex: 1,
//     backgroundColor: "#000",
//     justifyContent: "center",
//   },
//   fullVideo: {
//     width: "100%",
//     height: "100%",
//   },
//   closeBtn: {
//     position: "absolute",
//     top: 40,
//     right: 20,
//     zIndex: 10,
//   },
// });

import { updateThumbnailToS3 } from "@/app/api/updateThumbnailToS3";
import { postsService } from "@/app/services/postsService";
import { videoCacheService } from "@/app/services/videoCacheService";
import { Post } from "@/app/utils/types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Video from "react-native-video";

const FALLBACK_THUMBNAIL = "https://dummyimage.com/600x400/000/fff&text=Video";

type Props = {
  item: Post;
  onDelete: (post: Post) => void;
};

export const ManageVideoCard: React.FC<Props> = ({ item, onDelete }) => {
  const media = item.media?.[0];
  const videoUrl = media?.url;
  const thumbnail = media?.thumbnailUrl ?? FALLBACK_THUMBNAIL;

  const [showPlayer, setShowPlayer] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);

  /* Bottom sheet states */
  const [sheet, setSheet] = useState<
    null | "actions" | "editText" | "editThumb"
  >(null);

  /* Edit description */
  const [text, setText] = useState(item.title ?? "");
  const [savingText, setSavingText] = useState(false);

  /* Edit thumbnail */
  const [savingThumb, setSavingThumb] = useState(false);

  /* Load video on demand */
  useEffect(() => {
    if (!showPlayer || !videoUrl) return;
    videoCacheService
      .getCachedVideo(item.id, videoUrl)
      .then(setLocalUri)
      .catch(() => {});
  }, [showPlayer, videoUrl]);

  /* Save description */
  const saveDescription = async () => {
    setSavingText(true);
    await postsService.updatePost(item.id, { title: text });
    setSavingText(false);
    setSheet(null);
  };

  /* Pick & save thumbnail */
  const changeThumbnail = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.9,
    });

    if (res.canceled) return;

    setSavingThumb(true);

    const { thumbnailUrl } = await updateThumbnailToS3({
      localUri: res.assets[0].uri,
      userId: item.ownerId,
      postId: item.id,
    });

    await postsService.updatePost(item.id, {
      media: [{ ...media!, thumbnailUrl, thumbnailType: "custom" }],
    });

    setSavingThumb(false);
    setSheet(null);
  };

  return (
    <View style={styles.card}>
      {/* THUMBNAIL */}
      <Pressable style={styles.video} onPress={() => setShowPlayer(true)}>
        <Image source={{ uri: thumbnail }} style={StyleSheet.absoluteFill} />
        <View style={styles.playOverlay}>
          <Ionicons name="play-circle" size={64} color="#ffffffcc" />
        </View>
      </Pressable>

      {/* TITLE + ACTION */}
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title || "Untitled Video"}
        </Text>

        <TouchableOpacity onPress={() => setSheet("actions")}>
          <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* ================= ACTION SHEET ================= */}
      <Modal transparent visible={sheet !== null} animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setSheet(null)} />

        <SafeAreaView style={styles.sheet}>
          {sheet === "actions" && (
            <>
              <SheetButton
                icon="pencil"
                label="Edit description"
                onPress={() => setSheet("editText")}
              />
              <SheetButton
                icon="image"
                label="Change thumbnail"
                onPress={() => setSheet("editThumb")}
              />
              <View style={styles.divider} />
              <SheetButton
                icon="trash"
                label="Delete video"
                danger
                onPress={() => {
                  setSheet(null);
                  onDelete(item);
                }}
              />
            </>
          )}

          {sheet === "editText" && (
            <>
              <Text style={styles.sheetTitle}>Edit Description</Text>
              <TextInput
                value={text}
                onChangeText={setText}
                style={styles.input}
                multiline
              />
              <PrimaryButton
                loading={savingText}
                label="Save"
                onPress={saveDescription}
              />
            </>
          )}

          {sheet === "editThumb" && (
            <>
              <Text style={styles.sheetTitle}>Change Thumbnail</Text>
              <PrimaryButton
                loading={savingThumb}
                label="Choose Image"
                onPress={changeThumbnail}
              />
            </>
          )}
        </SafeAreaView>
      </Modal>

      {/* ================= PLAYER ================= */}
      <Modal visible={showPlayer} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => {
              setShowPlayer(false);
              setLocalUri(null);
            }}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <Video
            source={{ uri: localUri || videoUrl }}
            style={{ flex: 1 }}
            resizeMode="contain"
            controls
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

/* ===== Reusable ===== */

const SheetButton = ({ icon, label, danger, onPress }: any) => (
  <TouchableOpacity style={styles.sheetBtn} onPress={onPress}>
    <Ionicons name={icon} size={20} color={danger ? "#DC2626" : "#111827"} />
    <Text style={[styles.sheetLabel, danger && { color: "#DC2626" }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const PrimaryButton = ({ label, loading, onPress }: any) => (
  <TouchableOpacity style={styles.primaryBtn} onPress={onPress}>
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.primaryText}>{label}</Text>
    )}
  </TouchableOpacity>
);

/* ===== Styles ===== */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 18,
    padding: 12,
  },
  video: {
    height: 220,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  title: { fontWeight: "700", flex: 1, marginRight: 8 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  sheetLabel: { fontSize: 16, fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  close: {
    position: "absolute",
    top: Platform.OS === "ios" ? 12 : 16,
    right: 16,
    zIndex: 10,
  },
});
