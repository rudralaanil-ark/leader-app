// // (shared)/video/ManageVideos.tsx

// import { postsService } from "@/app/services/postsService";
// import { useAuth } from "@/contexts/AuthContext";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   FlatList,
//   Modal,
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Video from "react-native-video";

// export default function ManageVideos() {
//   const [videos, setVideos] = useState<any[]>([]);
//   const [editPost, setEditPost] = useState<any | null>(null);
//   const [caption, setCaption] = useState("");
//   const [statsPost, setStatsPost] = useState<any | null>(null);

//   const { user } = useAuth();
//   const router = useRouter();
//   const role = user?.role ?? "user";

//   useEffect(() => {
//     const unsub = postsService.subscribeToPostType("video", (list) => {
//       if (role === "admin") {
//         setVideos(list);
//       } else {
//         setVideos(list.filter((v) => v.ownerId === user?.uid));
//       }
//     });

//     return unsub;
//   }, [role, user?.uid]);

//   const handleDelete = async (postId: string, ownerId: string) => {
//     if (role === "monitor" && ownerId !== user?.uid) {
//       alert("You cannot delete admin videos");
//       return;
//     }
//     await postsService.deletePost(postId);
//   };

//   const saveCaption = async () => {
//     if (!editPost) return;
//     await postsService.updatePost(editPost.id, { title: caption });
//     setEditPost(null);
//   };

//   if (role !== "admin" && role !== "monitor") {
//     return (
//       <View style={styles.denied}>
//         <Text style={styles.deniedText}>Not allowed</Text>
//       </View>
//     );
//   }

//   const renderItem = ({ item }: any) => (
//     <View style={styles.card}>
//       {/* VIDEO PREVIEW */}
//       <Video
//         source={{ uri: item.media?.[0]?.url }}
//         style={styles.video}
//         resizeMode="cover"
//         paused
//         controls
//       />

//       {/* CAPTION */}
//       <Text style={styles.title}>{item.title ?? "Untitled Video"}</Text>

//       {/* STATS */}
//       <View style={styles.statsRow}>
//         <Stat
//           label="Likes"
//           value={item.likeCount ?? 0}
//           onPress={() => setStatsPost({ type: "likes", post: item })}
//         />
//         <Stat
//           label="Comments"
//           value={item.commentCount ?? 0}
//           onPress={() => setStatsPost({ type: "comments", post: item })}
//         />
//         <Stat
//           label="Shares"
//           value={item.shareCount ?? 0}
//           onPress={() => setStatsPost({ type: "shares", post: item })}
//         />
//       </View>

//       {/* ACTIONS */}
//       <View style={styles.actionsRow}>
//         <TouchableOpacity
//           onPress={() => {
//             setEditPost(item);
//             setCaption(item.title ?? "");
//           }}
//         >
//           <Ionicons name="create-outline" size={22} />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => handleDelete(item.id, item.ownerId)}>
//           <Ionicons name="trash-outline" size={22} color="#FF3B30" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       <FlatList
//         data={videos}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 140 }}
//       />

//       {/* FAB */}
//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => router.push("/(shared)/video/AddVideo")}
//       >
//         <Ionicons name="add" size={30} color="#fff" />
//       </TouchableOpacity>

//       {/* EDIT CAPTION MODAL */}
//       <Modal visible={!!editPost} transparent animationType="fade">
//         <View style={styles.modalWrap}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>Edit Caption</Text>

//             <TextInput
//               value={caption}
//               onChangeText={setCaption}
//               style={styles.input}
//               multiline
//             />

//             <TouchableOpacity style={styles.saveBtn} onPress={saveCaption}>
//               <Text style={{ color: "#fff", fontWeight: "700" }}>Save</Text>
//             </TouchableOpacity>

//             <Pressable onPress={() => setEditPost(null)}>
//               <Text style={styles.cancelText}>Cancel</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>

//       {/* STATS MODAL (placeholder for next step) */}
//       <Modal visible={!!statsPost} transparent animationType="fade">
//         <View style={styles.modalWrap}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>
//               {statsPost?.type?.toUpperCase()}
//             </Text>

//             <Text style={{ textAlign: "center", color: "#666" }}>
//               (Details screen can be plugged here)
//             </Text>

//             <Pressable onPress={() => setStatsPost(null)}>
//               <Text style={styles.cancelText}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// /* ---------- SMALL COMPONENT ---------- */

// const Stat = ({
//   label,
//   value,
//   onPress,
// }: {
//   label: string;
//   value: number;
//   onPress: () => void;
// }) => (
//   <TouchableOpacity onPress={onPress} style={styles.stat}>
//     <Text style={styles.statValue}>{value}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </TouchableOpacity>
// );

// /* ---------- STYLES ---------- */

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     margin: 12,
//     borderRadius: 16,
//     padding: 12,
//     elevation: 3,
//   },
//   video: {
//     width: "100%",
//     height: 220,
//     borderRadius: 14,
//     backgroundColor: "#000",
//   },
//   title: {
//     marginTop: 8,
//     fontWeight: "700",
//     fontSize: 15,
//   },
//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 10,
//   },
//   stat: { alignItems: "center" },
//   statValue: { fontWeight: "700", fontSize: 15 },
//   statLabel: { fontSize: 12, color: "#666" },
//   actionsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 12,
//   },
//   fab: {
//     position: "absolute",
//     right: 20,
//     bottom: 30,
//     width: 58,
//     height: 58,
//     borderRadius: 29,
//     backgroundColor: "#007AFF",
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 6,
//   },
//   denied: { flex: 1, justifyContent: "center", alignItems: "center" },
//   deniedText: { color: "red", fontWeight: "600" },

//   /* MODAL */
//   modalWrap: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalCard: {
//     backgroundColor: "#fff",
//     width: "90%",
//     borderRadius: 16,
//     padding: 18,
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     marginBottom: 12,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 10,
//     minHeight: 80,
//   },
//   saveBtn: {
//     backgroundColor: "#007AFF",
//     padding: 12,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 12,
//   },
//   cancelText: {
//     textAlign: "center",
//     marginTop: 12,
//     color: "#666",
//   },
// });

// // (shared)/video/ManageVideos.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { useIsFocused } from "@react-navigation/native";
// import { useRouter } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Alert,
//   FlatList,
//   Image,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import Video from "react-native-video";

// import { postsService } from "@/app/services/postsService";
// import SafeScreen from "@/componenets/SafeScreen";
// import { useAuth } from "@/contexts/AuthContext";

// import CommentsPopup from "../gallery/components/CommentsPopup";
// import LikedUsersModal from "../gallery/components/LikedUsersModal";
// import ShareUsersModal from "../gallery/components/ShareUsersModal";

// const FALLBACK_THUMBNAIL = "https://dummyimage.com/600x400/000/fff&text=Video";

// const FALLBACK_AVATAR = "https://dummyimage.com/100x100/cccccc/000&text=U";

// export default function ManageVideos() {
//   const [videos, setVideos] = useState<any[]>([]);
//   const [editPost, setEditPost] = useState<any | null>(null);

//   const captionRef = useRef("");
//   const inputRef = useRef<TextInput>(null);

//   const [previewFor, setPreviewFor] = useState<string | null>(null);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const [likesFor, setLikesFor] = useState<string | null>(null);
//   const [commentsFor, setCommentsFor] = useState<string | null>(null);
//   const [sharesFor, setSharesFor] = useState<string | null>(null);

//   const { user } = useAuth();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const isFocused = useIsFocused();

//   const role = user?.role ?? "user";

//   /* ---------------- FETCH VIDEOS ---------------- */

//   useEffect(() => {
//     return postsService.subscribeToPostType("video", (list) => {
//       if (role === "admin") {
//         setVideos(list);
//       } else {
//         setVideos(list.filter((v) => v.ownerId === user?.uid));
//       }
//     });
//   }, [role, user?.uid]);

//   /* ---------------- EDIT CAPTION ---------------- */

//   const saveCaption = async () => {
//     if (!editPost) return;
//     await postsService.updatePost(editPost.id, {
//       title: captionRef.current.trim(),
//     });
//     captionRef.current = "";
//     setEditPost(null);
//   };

//   /* ---------------- DELETE VIDEO ---------------- */

//   const deleteVideo = (postId: string) => {
//     Alert.alert("Delete Video", "Are you sure you want to delete this video?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: async () => {
//           await postsService.deletePost(postId);
//         },
//       },
//     ]);
//   };

//   /* ---------------- TIME FORMAT ---------------- */

//   const formatTime = (ts: any) => {
//     if (!ts?.seconds) return "Just now";
//     const diff = Date.now() - ts.seconds * 1000;
//     const m = Math.floor(diff / 60000);
//     if (m < 1) return "Just now";
//     if (m < 60) return `${m}m ago`;
//     const h = Math.floor(m / 60);
//     if (h < 24) return `${h}h ago`;
//     return `${Math.floor(h / 24)}d ago`;
//   };

//   /* ---------------- PERMISSION ---------------- */

//   if (role !== "admin" && role !== "monitor") {
//     return (
//       <SafeScreen backgroundColor="#f8fbff">
//         <StatusBar barStyle="dark-content" />
//         <View style={styles.denied}>
//           <Text style={styles.deniedText}>
//             You are not allowed to manage videos
//           </Text>
//         </View>
//       </SafeScreen>
//     );
//   }

//   /* ---------------- RENDER ITEM ---------------- */

//   const renderItem = ({ item, index }: any) => {
//     const shouldPreload = Math.abs(index - activeIndex) <= 2;
//     const isPlaying = previewFor === item.id && isFocused;

//     const thumbnail = item.media?.[0]?.thumbnailUrl ?? FALLBACK_THUMBNAIL;

//     return (
//       <View style={styles.card}>
//         {/* OWNER INFO */}
//         <View style={styles.ownerRow}>
//           <Image
//             source={{
//               uri: item.ownerProfileImage ?? FALLBACK_AVATAR,
//             }}
//             style={styles.avatar}
//           />
//           <View style={{ flex: 1 }}>
//             <Text style={styles.ownerName}>{item.ownerName}</Text>
//             <Text style={styles.ownerMeta}>
//               {item.ownerRole} · {formatTime(item.createdAt)}
//             </Text>
//           </View>
//         </View>

//         {/* VIDEO */}
//         {shouldPreload ? (
//           <View style={styles.video}>
//             <Image
//               source={{ uri: thumbnail }}
//               style={StyleSheet.absoluteFill}
//               resizeMode="cover"
//             />

//             <Video
//               source={{ uri: item.media?.[0]?.url }}
//               style={StyleSheet.absoluteFill}
//               resizeMode="cover"
//               controls
//               paused={!isPlaying}
//             />

//             {!isPlaying && (
//               <Pressable
//                 style={styles.playOverlay}
//                 onPress={() => setPreviewFor(item.id)}
//               >
//                 <Ionicons name="play-circle" size={60} color="#ffffffcc" />
//               </Pressable>
//             )}
//           </View>
//         ) : (
//           <Image
//             source={{ uri: thumbnail }}
//             style={styles.video}
//             resizeMode="cover"
//           />
//         )}

//         {/* TITLE */}
//         <Text style={styles.title}>{item.title ?? "Untitled Video"}</Text>

//         {/* STATS */}
//         <View style={styles.statsRow}>
//           <Stat
//             label="Likes"
//             value={item.likeCount ?? 0}
//             onPress={() => setLikesFor(item.id)}
//           />
//           <Stat
//             label="Comments"
//             value={item.commentCount ?? 0}
//             onPress={() => setCommentsFor(item.id)}
//           />
//           <Stat
//             label="Shares"
//             value={item.shareCount ?? 0}
//             onPress={() => setSharesFor(item.id)}
//           />
//         </View>

//         {/* ACTIONS */}
//         <View style={styles.actionsRow}>
//           <TouchableOpacity
//             onPress={() => {
//               setEditPost(item);
//               captionRef.current = item.title ?? "";
//               requestAnimationFrame(() => inputRef.current?.focus());
//             }}
//             style={{ marginRight: 16 }}
//           >
//             <Ionicons name="create-outline" size={22} color="#111827" />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => deleteVideo(item.id)}>
//             <Ionicons name="trash-outline" size={22} color="#DC2626" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   /* ---------------- UI ---------------- */

//   return (
//     <SafeScreen backgroundColor="#f8fbff">
//       <StatusBar barStyle="dark-content" />

//       {/* TAB TITLE */}
//       <Text style={styles.screenTitle}>Manage Videos</Text>

//       <FlatList
//         data={videos}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{
//           paddingBottom: 120 + insets.bottom,
//         }}
//         showsVerticalScrollIndicator={false}
//         removeClippedSubviews
//         windowSize={5}
//         initialNumToRender={4}
//         maxToRenderPerBatch={4}
//         onViewableItemsChanged={({ viewableItems }) => {
//           if (viewableItems?.length) {
//             setActiveIndex(viewableItems[0].index ?? 0);
//           }
//         }}
//       />

//       {/* FAB */}
//       <TouchableOpacity
//         style={[styles.fab, { bottom: 20 + insets.bottom }]}
//         onPress={() => router.push("/(shared)/video/AddVideo")}
//       >
//         <Ionicons name="add" size={30} color="#fff" />
//       </TouchableOpacity>

//       {likesFor && (
//         <LikedUsersModal
//           visible
//           postId={likesFor}
//           onClose={() => setLikesFor(null)}
//         />
//       )}

//       {commentsFor && (
//         <CommentsPopup
//           postId={commentsFor}
//           onClose={() => setCommentsFor(null)}
//         />
//       )}

//       {sharesFor && (
//         <ShareUsersModal
//           visible
//           postId={sharesFor}
//           onClose={() => setSharesFor(null)}
//         />
//       )}
//     </SafeScreen>
//   );
// }

// /* ---------------- SMALL COMPONENT ---------------- */

// const Stat = ({ label, value, onPress }: any) => (
//   <TouchableOpacity onPress={onPress} style={styles.stat}>
//     <Text style={styles.statValue}>{value}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </TouchableOpacity>
// );

// /* ---------------- STYLES ---------------- */

// const styles = StyleSheet.create({
//   screenTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },

//   card: {
//     backgroundColor: "#fff",
//     marginHorizontal: 12,
//     marginTop: 12,
//     borderRadius: 18,
//     padding: 12,
//     elevation: 3,
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

//   ownerName: {
//     fontWeight: "700",
//     color: "#111827",
//   },

//   ownerMeta: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 2,
//   },

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
//     fontSize: 15,
//     color: "#111827",
//   },

//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 14,
//   },

//   stat: { alignItems: "center" },

//   statValue: {
//     fontWeight: "700",
//     fontSize: 15,
//     color: "#111827",
//   },

//   statLabel: {
//     fontSize: 12,
//     color: "#6B7280",
//   },

//   actionsRow: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     marginTop: 12,
//   },

//   fab: {
//     position: "absolute",
//     right: 20,
//     width: 58,
//     height: 58,
//     borderRadius: 29,
//     backgroundColor: "#007AFF",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   denied: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   deniedText: {
//     color: "red",
//     fontWeight: "600",
//     fontSize: 16,
//   },
// });

// // app/(shared)/video/ManageVideos.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { useIsFocused } from "@react-navigation/native";
// import { useRouter } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Alert,
//   FlatList,
//   Image,
//   Platform,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
// import Video from "react-native-video";

// import { deleteVideoFromS3 } from "@/app/api/deleteVideoFromS3";
// import { postsService } from "@/app/services/postsService";
// import { useAuth } from "@/contexts/AuthContext";

// import CommentsPopup from "../gallery/components/CommentsPopup";
// import LikedUsersModal from "../gallery/components/LikedUsersModal";
// import ShareUsersModal from "../gallery/components/ShareUsersModal";

// const FALLBACK_THUMBNAIL = "https://dummyimage.com/600x400/000/fff&text=Video";
// const FALLBACK_AVATAR = "https://dummyimage.com/100x100/cccccc/000&text=U";

// export default function ManageVideos() {
//   const { user } = useAuth();
//   const role = user?.role ?? "user";

//   const [videos, setVideos] = useState<any[]>([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [previewFor, setPreviewFor] = useState<string | null>(null);

//   const [likesFor, setLikesFor] = useState<string | null>(null);
//   const [commentsFor, setCommentsFor] = useState<string | null>(null);
//   const [sharesFor, setSharesFor] = useState<string | null>(null);

//   const insets = useSafeAreaInsets();
//   const isFocused = useIsFocused();
//   const router = useRouter();

//   const captionRef = useRef("");
//   const inputRef = useRef<TextInput>(null);
//   const [editPost, setEditPost] = useState<any | null>(null);

//   /* ================= FETCH VIDEOS ================= */

//   useEffect(() => {
//     return postsService.subscribeToPostType("video", (list) => {
//       if (role === "admin") {
//         setVideos(list);
//       } else {
//         setVideos(list.filter((v) => v.ownerId === user?.uid));
//       }
//     });
//   }, [role, user?.uid]);

//   /* ================= DELETE VIDEO ================= */

//   const deleteVideo = (post: any) => {
//     Alert.alert(
//       "Delete Video",
//       "This will permanently delete the video. Continue?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               // 1️⃣ Delete from S3 (if key exists)
//               const s3Key = post.media?.[0]?.s3Key;
//               if (s3Key) {
//                 await deleteVideoFromS3(s3Key);
//               }

//               // 2️⃣ Delete Firestore post
//               await postsService.deletePost(post.id);
//             } catch (e: any) {
//               Alert.alert(
//                 "Delete failed",
//                 e?.message ?? "Unable to delete video"
//               );
//             }
//           },
//         },
//       ]
//     );
//   };

//   /* ================= TIME FORMAT ================= */

//   const formatTime = (ts: any) => {
//     if (!ts?.seconds) return "Just now";
//     const diff = Date.now() - ts.seconds * 1000;
//     const m = Math.floor(diff / 60000);
//     if (m < 1) return "Just now";
//     if (m < 60) return `${m}m ago`;
//     const h = Math.floor(m / 60);
//     if (h < 24) return `${h}h ago`;
//     return `${Math.floor(h / 24)}d ago`;
//   };

//   /* ================= PERMISSION ================= */

//   if (role !== "admin" && role !== "monitor") {
//     return (
//       <SafeAreaView style={styles.denied}>
//         <StatusBar barStyle="dark-content" />
//         <Text style={styles.deniedText}>
//           You are not allowed to manage videos
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   /* ================= RENDER ITEM ================= */

//   const renderItem = ({ item, index }: any) => {
//     const shouldPreload = Math.abs(index - activeIndex) <= 1;
//     const isPlaying = previewFor === item.id && isFocused;

//     const thumbnail = item.media?.[0]?.thumbnailUrl ?? FALLBACK_THUMBNAIL;

//     return (
//       <View style={styles.card}>
//         {/* OWNER */}
//         <View style={styles.ownerRow}>
//           <Image
//             source={{
//               uri: item.ownerProfileImage ?? FALLBACK_AVATAR,
//             }}
//             style={styles.avatar}
//           />
//           <View style={{ flex: 1 }}>
//             <Text style={styles.ownerName}>{item.ownerName}</Text>
//             <Text style={styles.ownerMeta}>
//               {item.ownerRole} · {formatTime(item.createdAt)}
//             </Text>
//           </View>
//         </View>

//         {/* VIDEO */}
//         <View style={styles.video}>
//           <Image
//             source={{ uri: thumbnail }}
//             style={StyleSheet.absoluteFill}
//             resizeMode="cover"
//           />

//           {shouldPreload && (
//             <Video
//               source={{ uri: item.media?.[0]?.url }}
//               style={StyleSheet.absoluteFill}
//               resizeMode="cover"
//               paused={!isPlaying}
//               controls={false}
//               bufferConfig={{
//                 minBufferMs: 15000,
//                 maxBufferMs: 30000,
//                 bufferForPlaybackMs: 2500,
//                 bufferForPlaybackAfterRebufferMs: 5000,
//               }}
//             />
//           )}

//           {!isPlaying && (
//             <Pressable
//               style={styles.playOverlay}
//               onPress={() => setPreviewFor(item.id)}
//             >
//               <Ionicons name="play-circle" size={64} color="#ffffffcc" />
//             </Pressable>
//           )}
//         </View>

//         {/* TITLE */}
//         <Text style={styles.title}>{item.title ?? "Untitled Video"}</Text>

//         {/* STATS */}
//         <View style={styles.statsRow}>
//           <Stat
//             label="Likes"
//             value={item.likeCount ?? 0}
//             onPress={() => setLikesFor(item.id)}
//           />
//           <Stat
//             label="Comments"
//             value={item.commentCount ?? 0}
//             onPress={() => setCommentsFor(item.id)}
//           />
//           <Stat
//             label="Shares"
//             value={item.shareCount ?? 0}
//             onPress={() => setSharesFor(item.id)}
//           />
//         </View>

//         {/* ACTIONS */}
//         <View style={styles.actionsRow}>
//           <TouchableOpacity
//             onPress={() => deleteVideo(item)}
//             style={{ marginLeft: 16 }}
//           >
//             <Ionicons name="trash-outline" size={22} color="#DC2626" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   /* ================= UI ================= */

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F8FBFF" />

//       <Text style={styles.screenTitle}>Manage Videos</Text>

//       <FlatList
//         data={videos}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{
//           paddingBottom: 120 + insets.bottom,
//         }}
//         showsVerticalScrollIndicator={false}
//         removeClippedSubviews
//         windowSize={5}
//         initialNumToRender={4}
//         maxToRenderPerBatch={4}
//         onViewableItemsChanged={({ viewableItems }) => {
//           if (viewableItems?.length) {
//             setActiveIndex(viewableItems[0].index ?? 0);
//           }
//         }}
//       />

//       {/* FAB */}
//       <TouchableOpacity
//         style={[styles.fab, { bottom: 20 + insets.bottom }]}
//         onPress={() => router.push("/(shared)/video/AddVideo")}
//       >
//         <Ionicons name="add" size={30} color="#fff" />
//       </TouchableOpacity>

//       {likesFor && (
//         <LikedUsersModal
//           visible
//           postId={likesFor}
//           onClose={() => setLikesFor(null)}
//         />
//       )}

//       {commentsFor && (
//         <CommentsPopup
//           postId={commentsFor}
//           onClose={() => setCommentsFor(null)}
//         />
//       )}

//       {sharesFor && (
//         <ShareUsersModal
//           visible
//           postId={sharesFor}
//           onClose={() => setSharesFor(null)}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// /* ================= SMALL COMPONENT ================= */

// const Stat = ({ label, value, onPress }: any) => (
//   <TouchableOpacity onPress={onPress} style={styles.stat}>
//     <Text style={styles.statValue}>{value}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </TouchableOpacity>
// );

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#F8FBFF",
//   },

//   screenTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#111827",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },

//   card: {
//     backgroundColor: "#fff",
//     marginHorizontal: 12,
//     marginTop: 12,
//     borderRadius: 18,
//     padding: 12,
//     elevation: Platform.OS === "android" ? 3 : 0,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
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

//   ownerName: {
//     fontWeight: "700",
//     color: "#111827",
//   },

//   ownerMeta: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 2,
//   },

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
//     fontSize: 15,
//     color: "#111827",
//   },

//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 14,
//   },

//   stat: { alignItems: "center" },

//   statValue: {
//     fontWeight: "700",
//     fontSize: 15,
//     color: "#111827",
//   },

//   statLabel: {
//     fontSize: 12,
//     color: "#6B7280",
//   },

//   actionsRow: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     marginTop: 12,
//   },

//   fab: {
//     position: "absolute",
//     right: 20,
//     width: 58,
//     height: 58,
//     borderRadius: 29,
//     backgroundColor: "#007AFF",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   denied: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   deniedText: {
//     color: "#DC2626",
//     fontWeight: "700",
//     fontSize: 16,
//   },
// });

// // app/(shared)/video/ManageVideos.tsx
// import { useIsFocused } from "@react-navigation/native";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";

// import {
//   Alert,
//   FlatList,
//   Modal,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";

// import { deleteVideoFromS3 } from "@/app/api/deleteVideoFromS3";
// import { postsService } from "@/app/services/postsService";
// import { useAuth } from "@/contexts/AuthContext";

// import CommentsPopup from "../gallery/components/CommentsPopup";
// import LikedUsersModal from "../gallery/components/LikedUsersModal";
// import ShareUsersModal from "../gallery/components/ShareUsersModal";
// import { ManageVideoCard } from "./components/ManageVideoCard";

// const FALLBACK_THUMBNAIL = "https://dummyimage.com/600x400/000/fff&text=Video";
// const FALLBACK_AVATAR = "https://dummyimage.com/100x100/cccccc/000&text=U";

// export default function ManageVideos() {
//   const { user } = useAuth();
//   const role = user?.role ?? "user";

//   const [videos, setVideos] = useState<any[]>([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [previewFor, setPreviewFor] = useState<string | null>(null);

//   const [likesFor, setLikesFor] = useState<string | null>(null);
//   const [commentsFor, setCommentsFor] = useState<string | null>(null);
//   const [sharesFor, setSharesFor] = useState<string | null>(null);

//   const [editPost, setEditPost] = useState<any | null>(null);
//   const [editText, setEditText] = useState("");

//   const insets = useSafeAreaInsets();
//   const isFocused = useIsFocused();
//   const router = useRouter();

//   /* ================= FETCH VIDEOS ================= */

//   useEffect(() => {
//     return postsService.subscribeToPostType("video", (list) => {
//       if (role === "admin") {
//         setVideos(list);
//       } else {
//         setVideos(list.filter((v) => v.ownerId === user?.uid));
//       }
//     });
//   }, [role, user?.uid]);

//   /* ================= DELETE VIDEO ================= */

//   // const deleteVideo = (post: any) => {
//   //   Alert.alert(
//   //     "Delete Video",
//   //     "This will permanently delete the video. Continue?",
//   //     [
//   //       { text: "Cancel", style: "cancel" },
//   //       {
//   //         text: "Delete",
//   //         style: "destructive",
//   //         onPress: async () => {
//   //           try {
//   //             // 1️⃣ Delete from S3
//   //             const s3Key = post.media?.[0]?.s3Key;
//   //             if (s3Key) {
//   //               await deleteVideoFromS3(s3Key);
//   //             }

//   //             // 2️⃣ 🔥 DELETE LOCAL VIDEO CACHE (IMPORTANT)
//   //             await FileSystem.deleteAsync(
//   //               FileSystem.documentDirectory +
//   //                 "video-cache/" +
//   //                 post.id +
//   //                 ".mp4",
//   //               { idempotent: true }
//   //             );

//   //             // 3️⃣ Delete Firestore post
//   //             await postsService.deletePost(post.id);
//   //           } catch (e: any) {
//   //             Alert.alert(
//   //               "Delete failed",
//   //               e?.message ?? "Unable to delete video"
//   //             );
//   //           }
//   //         },
//   //       },
//   //     ]
//   //   );
//   // };

//   const deleteVideo = (post: any) => {
//     Alert.alert(
//       "Delete Video",
//       "This will permanently delete the video. Continue?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               console.log("🟡 DELETE START");
//               console.log("Post ID:", post.id);
//               console.log("Owner ID:", post.ownerId);
//               console.log("Current user:", user?.uid);
//               console.log("Role:", user?.role);

//               // 1️⃣ Firestore delete
//               console.log("🟡 Deleting Firestore post...");
//               await postsService.deletePost(post.id);
//               console.log("🟢 Firestore delete DONE");

//               // 2️⃣ S3 delete
//               const s3Key = post.media?.[0]?.s3Key;
//               console.log("🟡 Deleting S3:", s3Key);
//               if (s3Key) {
//                 await deleteVideoFromS3(s3Key);
//               }
//               console.log("🟢 S3 delete DONE");
//             } catch (e: any) {
//               console.error("🔴 DELETE FAILED:", e);
//               Alert.alert(
//                 "Delete failed",
//                 e?.message ?? "Unable to delete video"
//               );
//             }
//           },
//         },
//       ]
//     );
//   };

//   /* ================= EDIT ================= */

//   const saveEdit = async () => {
//     if (!editPost) return;
//     await postsService.updatePost(editPost.id, { title: editText });
//     setEditPost(null);
//   };

//   /* ================= TIME ================= */

//   const formatTime = (ts: any) => {
//     if (!ts?.seconds) return "Just now";
//     const diff = Date.now() - ts.seconds * 1000;
//     const m = Math.floor(diff / 60000);
//     if (m < 60) return `${m}m ago`;
//     const h = Math.floor(m / 60);
//     if (h < 24) return `${h}h ago`;
//     return `${Math.floor(h / 24)}d ago`;
//   };

//   /* ================= PERMISSION ================= */

//   if (role !== "admin" && role !== "monitor") {
//     return (
//       <SafeAreaView style={styles.denied}>
//         <Text style={styles.deniedText}>
//           You are not allowed to manage videos
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   /* ================= RENDER ITEM ================= */

//   // const renderItem = ({ item, index }: any) => {
//   //   const shouldPreload = Math.abs(index - activeIndex) <= 1;
//   //   const isPlaying = previewFor === item.id && isFocused;
//   //   const thumbnail = item.media?.[0]?.thumbnailUrl ?? FALLBACK_THUMBNAIL;

//   //   const [localUri, setLocalUri] = useState<string | null>(null);

//   //   useEffect(() => {
//   //     let alive = true;
//   //     if (!isPlaying || !item.id || !item.media?.[0]?.url) return;

//   //     videoCacheService
//   //       .getCachedVideo(item.id, item.media[0].url)
//   //       .then((path) => alive && setLocalUri(path))
//   //       .catch(() => {});

//   //     return () => {
//   //       alive = false;
//   //     };
//   //   }, [isPlaying]);

//   //   return (
//   //     <View style={styles.card}>
//   //       {/* OWNER */}
//   //       <View style={styles.ownerRow}>
//   //         <Image
//   //           source={{ uri: item.ownerProfileImage ?? FALLBACK_AVATAR }}
//   //           style={styles.avatar}
//   //         />
//   //         <View style={{ flex: 1 }}>
//   //           <Text style={styles.ownerName}>{item.ownerName}</Text>
//   //           <Text style={styles.ownerMeta}>
//   //             {item.ownerRole} · {formatTime(item.createdAt)}
//   //           </Text>
//   //         </View>

//   //         <TouchableOpacity
//   //           onPress={() => {
//   //             setEditPost(item);
//   //             setEditText(item.title ?? "");
//   //           }}
//   //         >
//   //           <Ionicons name="pencil" size={20} color="#2563EB" />
//   //         </TouchableOpacity>
//   //       </View>

//   //       {/* VIDEO */}
//   //       <View style={styles.video}>
//   //         <Image
//   //           source={{ uri: thumbnail }}
//   //           style={StyleSheet.absoluteFill}
//   //           resizeMode="cover"
//   //         />

//   //         {shouldPreload && (
//   //           <Video
//   //             source={{
//   //               uri: localUri || item.media?.[0]?.url,
//   //             }}
//   //             style={StyleSheet.absoluteFill}
//   //             resizeMode="cover"
//   //             paused={!isPlaying}
//   //           />
//   //         )}

//   //         {!isPlaying && (
//   //           <Pressable
//   //             style={styles.playOverlay}
//   //             onPress={() => setPreviewFor(item.id)}
//   //           >
//   //             <Ionicons name="play-circle" size={64} color="#ffffffcc" />
//   //           </Pressable>
//   //         )}
//   //       </View>

//   //       <Text style={styles.title}>{item.title ?? "Untitled Video"}</Text>

//   //       {/* STATS */}
//   //       <View style={styles.statsRow}>
//   //         <Stat
//   //           label="Likes"
//   //           value={item.likeCount ?? 0}
//   //           onPress={() => setLikesFor(item.id)}
//   //         />
//   //         <Stat
//   //           label="Comments"
//   //           value={item.commentCount ?? 0}
//   //           onPress={() => setCommentsFor(item.id)}
//   //         />
//   //         <Stat
//   //           label="Shares"
//   //           value={item.shareCount ?? 0}
//   //           onPress={() => setSharesFor(item.id)}
//   //         />
//   //       </View>

//   //       {/* ACTIONS */}
//   //       <View style={styles.actionsRow}>
//   //         <TouchableOpacity onPress={() => deleteVideo(item)}>
//   //           <Ionicons name="trash-outline" size={22} color="#DC2626" />
//   //         </TouchableOpacity>
//   //       </View>
//   //     </View>
//   //   );
//   // };

//   const renderItem = ({ item, index }: any) => (
//     <ManageVideoCard
//       item={item}
//       index={index}
//       activeIndex={activeIndex}
//       isFocused={isFocused}
//       onDelete={deleteVideo}
//       onEdit={(post: any) => {
//         setEditPost(post);
//         setEditText(post.title ?? "");
//       }}
//       onLikes={() => setLikesFor(item.id)}
//       onComments={() => setCommentsFor(item.id)}
//       onShares={() => setSharesFor(item.id)}
//     />
//   );

//   /* ================= UI ================= */

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="dark-content" />
//       <Text style={styles.screenTitle}>Manage Videos</Text>

//       <FlatList
//         data={videos}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         showsVerticalScrollIndicator={false}
//         onViewableItemsChanged={({ viewableItems }) => {
//           if (viewableItems?.length) {
//             setActiveIndex(viewableItems[0].index ?? 0);
//           }
//         }}
//       />

//       {/* EDIT MODAL */}
//       <Modal visible={!!editPost} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modal}>
//             <Text style={styles.modalTitle}>Edit Description</Text>
//             <TextInput
//               value={editText}
//               onChangeText={setEditText}
//               style={styles.input}
//               multiline
//             />
//             <View style={styles.modalActions}>
//               <TouchableOpacity onPress={() => setEditPost(null)}>
//                 <Text style={styles.cancel}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={saveEdit}>
//                 <Text style={styles.save}>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {likesFor && (
//         <LikedUsersModal
//           visible
//           postId={likesFor}
//           onClose={() => setLikesFor(null)}
//         />
//       )}
//       {commentsFor && (
//         <CommentsPopup
//           postId={commentsFor}
//           onClose={() => setCommentsFor(null)}
//         />
//       )}
//       {sharesFor && (
//         <ShareUsersModal
//           visible
//           postId={sharesFor}
//           onClose={() => setSharesFor(null)}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// /* ================= SMALL ================= */

// const Stat = ({ label, value, onPress }: any) => (
//   <TouchableOpacity onPress={onPress} style={styles.stat}>
//     <Text style={styles.statValue}>{value}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </TouchableOpacity>
// );

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#F8FBFF" },
//   screenTitle: { fontSize: 18, fontWeight: "800", padding: 16 },
//   card: { backgroundColor: "#fff", margin: 12, borderRadius: 18, padding: 12 },
//   ownerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
//   avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
//   ownerName: { fontWeight: "700" },
//   ownerMeta: { fontSize: 12, color: "#6B7280" },
//   video: { width: "100%", height: 220, borderRadius: 14, overflow: "hidden" },
//   playOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: { marginTop: 10, fontWeight: "700" },
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
//   denied: { flex: 1, justifyContent: "center", alignItems: "center" },
//   deniedText: { color: "#DC2626", fontWeight: "700" },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     padding: 24,
//   },
//   modal: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     padding: 16,
//   },
//   modalTitle: { fontWeight: "800", marginBottom: 8 },
//   input: {
//     minHeight: 80,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 12,
//   },
//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 16,
//   },
//   cancel: { color: "#6B7280", fontWeight: "700" },
//   save: { color: "#2563EB", fontWeight: "800" },
// });

// // app/(shared)/video/ManageVideos.tsx
// import { useIsFocused } from "@react-navigation/native";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";

// import {
//   Alert,
//   FlatList,
//   Modal,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";

// import { deleteVideoFromS3 } from "@/app/api/deleteVideoFromS3";
// import { postsService } from "@/app/services/postsService";
// import { useAuth } from "@/contexts/AuthContext";

// import {
//   UploadItem,
//   videoUploadManager,
// } from "@/app/services/videoUploadManager";

// import CommentsPopup from "../gallery/components/CommentsPopup";
// import LikedUsersModal from "../gallery/components/LikedUsersModal";
// import ShareUsersModal from "../gallery/components/ShareUsersModal";
// import { ManageVideoCard } from "./components/ManageVideoCard";

// const FALLBACK_THUMBNAIL = "https://dummyimage.com/600x400/000/fff&text=Video";
// const FALLBACK_AVATAR = "https://dummyimage.com/100x100/cccccc/000&text=U";

// export default function ManageVideos() {
//   const { user } = useAuth();
//   const role = user?.role ?? "user";

//   const [videos, setVideos] = useState<any[]>([]);
//   const [uploading, setUploading] = useState<UploadItem[]>([]);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const [likesFor, setLikesFor] = useState<string | null>(null);
//   const [commentsFor, setCommentsFor] = useState<string | null>(null);
//   const [sharesFor, setSharesFor] = useState<string | null>(null);

//   const [editPost, setEditPost] = useState<any | null>(null);
//   const [editText, setEditText] = useState("");

//   const insets = useSafeAreaInsets();
//   const isFocused = useIsFocused();
//   const router = useRouter();

//   /* ================= FETCH VIDEOS ================= */

//   useEffect(() => {
//     return postsService.subscribeToPostType("video", (list) => {
//       if (role === "admin") {
//         setVideos(list);
//       } else {
//         setVideos(list.filter((v) => v.ownerId === user?.uid));
//       }
//     });
//   }, [role, user?.uid]);

//   /* ================= UPLOAD PROGRESS ================= */

//   useEffect(() => {
//     return videoUploadManager.subscribe(setUploading);
//   }, []);

//   /* ================= DELETE VIDEO ================= */

//   const deleteVideo = (post: any) => {
//     Alert.alert(
//       "Delete Video",
//       "This will permanently delete the video. Continue?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await postsService.deletePost(post.id);
//               const s3Key = post.media?.[0]?.s3Key;
//               if (s3Key) {
//                 await deleteVideoFromS3(s3Key);
//               }
//             } catch (e: any) {
//               Alert.alert(
//                 "Delete failed",
//                 e?.message ?? "Unable to delete video"
//               );
//             }
//           },
//         },
//       ]
//     );
//   };

//   /* ================= EDIT ================= */

//   const saveEdit = async () => {
//     if (!editPost) return;
//     await postsService.updatePost(editPost.id, { title: editText });
//     setEditPost(null);
//   };

//   /* ================= PERMISSION ================= */

//   if (role !== "admin" && role !== "monitor") {
//     return (
//       <SafeAreaView style={styles.denied}>
//         <Text style={styles.deniedText}>
//           You are not allowed to manage videos
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   /* ================= RENDER ITEM ================= */

//   // const renderItem = ({ item }: any) => {
//   //   // 🔥 UPLOADING VIDEO
//   //   if (item.__upload) {
//   //     return (
//   //       <View style={styles.uploadCard}>
//   //         <Text style={styles.uploadTitle}>Uploading video</Text>

//   //         <View style={styles.progressBg}>
//   //           <View
//   //             style={[styles.progressFill, { width: `${item.progress}%` }]}
//   //           />
//   //         </View>

//   //         <View style={styles.uploadMeta}>
//   //           <Text style={styles.progressText}>
//   //             {Math.round(item.progress)}% · {item.status}
//   //           </Text>

//   //           {item.status === "uploading" && (
//   //             <TouchableOpacity
//   //               onPress={() => videoUploadManager.cancel(item.postId)}
//   //             >
//   //               <Text style={styles.cancelUpload}>Cancel</Text>
//   //             </TouchableOpacity>
//   //           )}
//   //         </View>
//   //       </View>
//   //     );
//   //   }

//   /* ================= RENDER ITEM ================= */

//   const renderItem = ({ item }: any) => {
//     // 🔥 UPLOADING VIDEO
//     if (item.__upload) {
//       return (
//         <View style={styles.uploadCard}>
//           <Text style={styles.uploadTitle}>Uploading video</Text>

//           <View style={styles.progressBg}>
//             <View
//               style={[styles.progressFill, { width: `${item.progress}%` }]}
//             />
//           </View>

//           <View style={styles.uploadMeta}>
//             <Text style={styles.progressText}>
//               {Math.round(item.progress)}% · {item.status}
//             </Text>

//             {item.status === "uploading" && (
//               <TouchableOpacity
//                 onPress={() => videoUploadManager.cancel(item.postId)}
//               >
//                 <Text style={styles.cancelUpload}>Cancel</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       );
//     }
//     //   // 🔥 NORMAL VIDEO
//     //   return (
//     //     <ManageVideoCard
//     //       item={item}
//     //       onDelete={deleteVideo}
//     //       onEdit={(post: any) => {
//     //         setEditPost(post);
//     //         setEditText(post.title ?? "");
//     //       }}
//     //       onLikes={() => setLikesFor(item.id)}
//     //       onComments={() => setCommentsFor(item.id)}
//     //       onShares={() => setSharesFor(item.id)}
//     //     />
//     //   );
//     // };

//     // 🔥 NORMAL VIDEO
//     return (
//       <View>
//         <ManageVideoCard
//           item={item}
//           onDelete={deleteVideo}
//           onEdit={(post: any) => {
//             setEditPost(post);
//             setEditText(post.title ?? "");
//           }}
//           onLikes={() => setLikesFor(item.id)}
//           onComments={() => setCommentsFor(item.id)}
//           onShares={() => setSharesFor(item.id)}
//         />

//         {/* 👇 SOCIAL INFO BAR (NEW UI) */}
//         <View style={styles.socialBar}>
//           <TouchableOpacity
//             style={styles.socialBtn}
//             onPress={() => setLikesFor(item.id)}
//           >
//             <Text style={styles.socialIcon}>👍</Text>
//             <Text style={styles.socialText}>{item.likesCount ?? 0} Likes</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.socialBtn}
//             onPress={() => setCommentsFor(item.id)}
//           >
//             <Text style={styles.socialIcon}>💬</Text>
//             <Text style={styles.socialText}>
//               {item.commentsCount ?? 0} Comments
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.socialBtn}
//             onPress={() => setSharesFor(item.id)}
//           >
//             <Text style={styles.socialIcon}>🔁</Text>
//             <Text style={styles.socialText}>
//               {item.sharesCount ?? 0} Shares
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   /* ================= COMBINED DATA ================= */

//   const data = [...uploading.map((u) => ({ __upload: true, ...u })), ...videos];

//   /* ================= UI ================= */

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="dark-content" />
//       <Text style={styles.screenTitle}>Manage Videos</Text>

//       <FlatList
//         data={data}
//         keyExtractor={(item: any) => item.postId || item.id}
//         renderItem={renderItem}
//         showsVerticalScrollIndicator={false}
//       />

//       {/* EDIT MODAL */}
//       <Modal visible={!!editPost} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modal}>
//             <Text style={styles.modalTitle}>Edit Description</Text>
//             <TextInput
//               value={editText}
//               onChangeText={setEditText}
//               style={styles.input}
//               multiline
//             />
//             <View style={styles.modalActions}>
//               <TouchableOpacity onPress={() => setEditPost(null)}>
//                 <Text style={styles.cancel}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={saveEdit}>
//                 <Text style={styles.save}>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {likesFor && (
//         <LikedUsersModal
//           visible
//           postId={likesFor}
//           onClose={() => setLikesFor(null)}
//         />
//       )}
//       {commentsFor && (
//         <CommentsPopup
//           postId={commentsFor}
//           onClose={() => setCommentsFor(null)}
//         />
//       )}
//       {sharesFor && (
//         <ShareUsersModal
//           visible
//           postId={sharesFor}
//           onClose={() => setSharesFor(null)}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#F8FBFF" },
//   screenTitle: { fontSize: 18, fontWeight: "800", padding: 16 },

//   uploadCard: {
//     backgroundColor: "#fff",
//     marginHorizontal: 12,
//     marginTop: 8,
//     padding: 12,
//     borderRadius: 14,
//   },
//   uploadTitle: { fontWeight: "700", marginBottom: 8 },
//   progressBg: {
//     height: 6,
//     backgroundColor: "#E5E7EB",
//     borderRadius: 6,
//     overflow: "hidden",
//   },
//   progressFill: {
//     height: "100%",
//     backgroundColor: "#34C759",
//   },
//   uploadMeta: {
//     marginTop: 6,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   progressText: { fontWeight: "600", color: "#374151" },
//   cancelUpload: { color: "#DC2626", fontWeight: "700" },

//   denied: { flex: 1, justifyContent: "center", alignItems: "center" },
//   deniedText: { color: "#DC2626", fontWeight: "700" },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     padding: 24,
//   },
//   modal: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     padding: 16,
//   },
//   modalTitle: { fontWeight: "800", marginBottom: 8 },
//   input: {
//     minHeight: 80,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 12,
//   },
//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 16,
//   },
//   cancel: { color: "#6B7280", fontWeight: "700" },
//   save: { color: "#2563EB", fontWeight: "800" },
//   /* ================= SOCIAL BAR ================= */

//   socialBar: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     paddingVertical: 10,
//     marginHorizontal: 12,
//     marginBottom: 6,
//     backgroundColor: "#FFFFFF",
//     borderBottomLeftRadius: 14,
//     borderBottomRightRadius: 14,
//     borderTopWidth: 1,
//     borderColor: "#E5E7EB",
//   },

//   socialBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },

//   socialIcon: {
//     fontSize: 14,
//   },

//   socialText: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#374151",
//   },
// });

// app/(shared)/video/ManageVideos.tsx
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { deleteVideoFromS3 } from "@/app/api/deleteVideoFromS3";
import { postsService } from "@/app/services/postsService";
import { useAuth } from "@/contexts/AuthContext";

import {
  UploadItem,
  videoUploadManager,
} from "@/app/services/videoUploadManager";

import Colors from "@/data/Colors";
import { Ionicons } from "@expo/vector-icons";
import CommentsPopup from "../gallery/components/CommentsPopup";
import LikedUsersModal from "../gallery/components/LikedUsersModal";
import ShareUsersModal from "../gallery/components/ShareUsersModal";
import { ManageVideoCard } from "./components/ManageVideoCard";

const FALLBACK_THUMBNAIL = "https://dummyimage.com/600x400/000/fff&text=Video";
const FALLBACK_AVATAR = "https://dummyimage.com/100x100/cccccc/000&text=U";

export default function ManageVideos() {
  const { user } = useAuth();
  const role = user?.role ?? "user";

  const [videos, setVideos] = useState<any[]>([]);
  const [uploading, setUploading] = useState<UploadItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [likesFor, setLikesFor] = useState<string | null>(null);
  const [commentsFor, setCommentsFor] = useState<string | null>(null);
  const [sharesFor, setSharesFor] = useState<string | null>(null);

  const [editPost, setEditPost] = useState<any | null>(null);
  const [editText, setEditText] = useState("");

  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const router = useRouter();

  /* ================= FETCH VIDEOS ================= */

  useEffect(() => {
    return postsService.subscribeToPostType("video", (list) => {
      if (role === "admin") {
        setVideos(list);
      } else {
        setVideos(list.filter((v) => v.ownerId === user?.uid));
      }
    });
  }, [role, user?.uid]);

  /* ================= UPLOAD PROGRESS ================= */

  useEffect(() => {
    return videoUploadManager.subscribe(setUploading);
  }, []);

  /* ================= DELETE VIDEO ================= */

  const deleteVideo = (post: any) => {
    Alert.alert(
      "Delete Video",
      "This will permanently delete the video. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await postsService.deletePost(post.id);
              const s3Key = post.media?.[0]?.s3Key;
              if (s3Key) {
                await deleteVideoFromS3(s3Key);
              }
            } catch (e: any) {
              Alert.alert(
                "Delete failed",
                e?.message ?? "Unable to delete video"
              );
            }
          },
        },
      ]
    );
  };

  /* ================= EDIT ================= */

  const saveEdit = async () => {
    if (!editPost) return;
    await postsService.updatePost(editPost.id, { title: editText });
    setEditPost(null);
  };

  /* ================= PERMISSION ================= */

  if (role !== "admin" && role !== "monitor") {
    return (
      <SafeAreaView style={styles.denied}>
        <Text style={styles.deniedText}>
          You are not allowed to manage videos
        </Text>
      </SafeAreaView>
    );
  }

  /* ================= RENDER ITEM ================= */

  const renderItem = ({ item }: any) => {
    // 🔥 UPLOADING VIDEO
    if (item.__upload) {
      return (
        <View style={styles.uploadCard}>
          <Text style={styles.uploadTitle}>Uploading video</Text>

          <View style={styles.progressBg}>
            <View
              style={[styles.progressFill, { width: `${item.progress}%` }]}
            />
          </View>

          <View style={styles.uploadMeta}>
            <Text style={styles.progressText}>
              {Math.round(item.progress)}% · {item.status}
            </Text>

            {item.status === "uploading" && (
              <TouchableOpacity
                onPress={() => videoUploadManager.cancel(item.postId)}
              >
                <Text style={styles.cancelUpload}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    // 🔥 NORMAL VIDEO
    return (
      <View>
        <ManageVideoCard
          item={item}
          onDelete={deleteVideo}
          onEdit={(post: any) => {
            setEditPost(post);
            setEditText(post.title ?? "");
          }}
          onLikes={() => setLikesFor(item.id)}
          onComments={() => setCommentsFor(item.id)}
          onShares={() => setSharesFor(item.id)}
        />

        {/* 👇 SOCIAL INFO BAR */}
        <View style={styles.socialBar}>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => setLikesFor(item.id)}
          >
            <Text style={styles.socialIcon}>👍</Text>
            <Text style={styles.socialText}>{item.likeCount ?? 0} Likes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => setCommentsFor(item.id)}
          >
            <Text style={styles.socialIcon}>💬</Text>
            <Text style={styles.socialText}>
              {item.commentCount ?? 0} Comments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => setSharesFor(item.id)}
          >
            <Text style={styles.socialIcon}>🔁</Text>
            <Text style={styles.socialText}>{item.shareCount ?? 0} Shares</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ================= COMBINED DATA ================= */

  const data = [...uploading.map((u) => ({ __upload: true, ...u })), ...videos];

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={data}
        keyExtractor={(item: any) => item.postId || item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* EDIT MODAL */}
      <Modal visible={!!editPost} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Edit Description</Text>
            <TextInput
              value={editText}
              onChangeText={setEditText}
              style={styles.input}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditPost(null)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit}>
                <Text style={styles.save}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {likesFor && (
        <LikedUsersModal
          visible
          postId={likesFor}
          onClose={() => setLikesFor(null)}
        />
      )}
      {commentsFor && (
        <CommentsPopup
          postId={commentsFor}
          onClose={() => setCommentsFor(null)}
        />
      )}
      {sharesFor && (
        <ShareUsersModal
          visible
          postId={sharesFor}
          onClose={() => setSharesFor(null)}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(shared)/video/AddVideo")}
      >
        <Ionicons name="add" size={32} color={Colors.textInverse} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FBFF" },

  uploadCard: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 8,
    padding: 12,
    borderRadius: 14,
  },
  uploadTitle: { fontWeight: "700", marginBottom: 8 },
  progressBg: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#34C759",
  },
  uploadMeta: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: { fontWeight: "600", color: "#374151" },
  cancelUpload: { color: "#DC2626", fontWeight: "700" },

  denied: { flex: 1, justifyContent: "center", alignItems: "center" },
  deniedText: { color: "#DC2626", fontWeight: "700" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: { fontWeight: "800", marginBottom: 8 },
  input: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  cancel: { color: "#6B7280", fontWeight: "700" },
  save: { color: "#2563EB", fontWeight: "800" },

  /* ================= SOCIAL BAR ================= */

  socialBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginHorizontal: 12,
    marginBottom: 6,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },

  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  socialIcon: {
    fontSize: 14,
  },

  socialText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
