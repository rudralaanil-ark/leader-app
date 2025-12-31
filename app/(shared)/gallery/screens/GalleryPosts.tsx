// // this is updated code

// // Updated GalleryPosts.tsx without likes, DoubleTapImage, LikeListModal, likesService
// import { postsService } from "@/app/services/postsService";
// import { db } from "@/configs/FirebaseConfig";
// import Colors from "@/data/Colors";
// import { Entypo, Feather, FontAwesome6 } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
// import React, { useEffect, useRef, useState } from "react";

// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import CommentsPopup from "../components/CommentsPopup";
// import PostOptionsModal from "./PostOptionsModal";

// // ⭐ ADDED
// import { useAuth } from "@/contexts/AuthContext";
// import LikedUsersModal from "../components/LikedUsersModal";

// const { width } = Dimensions.get("window");

// export default function GalleryPosts() {
//   const router = useRouter();
//   const { user } = useAuth(); // ⭐ ADDED

//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [commentsFor, setCommentsFor] = useState<string | null>(null);
//   const [optionsFor, setOptionsFor] = useState<any | null>(null);

//   const [visibleIndex, setVisibleIndex] = useState<Record<string, number>>({});

//   // ⭐ ADDED — LIKE STATE
//   const [likedByMe, setLikedByMe] = useState<Record<string, boolean>>({});
//   const [likesModalPostId, setLikesModalPostId] = useState<string | null>(null);

//   const doubleTapRef = useRef<Record<string, number>>({}); // ⭐ ADDED

//   const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 });

//   const onViewableItemsChanged = useRef(({ viewableItems, postId }: any) => {
//     if (viewableItems?.length > 0) {
//       setVisibleIndex((prev) => ({
//         ...prev,
//         [postId]: viewableItems[0].index ?? 0,
//       }));
//     }
//   });

//   // Realtime sync
//   useEffect(() => {
//     const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
//     const unsubscribe = onSnapshot(q, async (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setPosts(list);
//       setLoading(false);

//       // ⭐ ADDED — load liked status for each post once
//       if (user?.uid) {
//         for (const p of list) {
//           if (likedByMe[p.id] === undefined) {
//             const isLiked = await postsService.isPostLikedByUser(
//               p.id,
//               user.uid
//             );
//             setLikedByMe((prev) => ({ ...prev, [p.id]: isLiked }));
//           }
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, [user?.uid]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     setTimeout(() => setRefreshing(false), 600);
//   };

//   const openComments = (post: any) => {
//     setCommentsFor(post.id);
//   };

//   const openOptions = (post: any) => {
//     setOptionsFor(post);
//   };

//   const handleEdit = (post: any) => {
//     setOptionsFor(null);
//     router.push({
//       pathname: "/(shared)/gallery/screens/CreateGalleryReview",
//       params: { postId: post.id },
//     });
//   };

//   const handleDelete = async (post: any) => {
//     setOptionsFor(null);

//     Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: async () => {
//           try {
//             await postsService.deletePost(post.id);
//           } catch (e) {
//             Alert.alert("Failed to delete post");
//           }
//         },
//       },
//     ]);
//   };

//   // ⭐ ADDED — LIKE HANDLER
//   const toggleLike = async (post: any) => {
//     if (!user) {
//       Alert.alert("Login required", "Please login to like posts.");
//       return;
//     }

//     const postId = post.id;
//     const isCurrentlyLiked = likedByMe[postId];

//     // Optimistic Update
//     setLikedByMe((prev) => ({ ...prev, [postId]: !isCurrentlyLiked }));
//     setPosts((prev) =>
//       prev.map((p) =>
//         p.id === postId
//           ? {
//               ...p,
//               likeCount: (p.likeCount || 0) + (isCurrentlyLiked ? -1 : 1),
//             }
//           : p
//       )
//     );

//     try {
//       if (!isCurrentlyLiked) {
//         await postsService.likePost(postId, {
//           userId: user.uid,
//           name: user.fullName,
//           photoURL: user.profileImage,
//         });
//       } else {
//         await postsService.unlikePost(postId, user.uid);
//       }
//     } catch (err) {
//       Alert.alert("Failed to update like");

//       // revert
//       setLikedByMe((prev) => ({ ...prev, [postId]: isCurrentlyLiked }));
//       setPosts((prev) =>
//         prev.map((p) =>
//           p.id === postId
//             ? {
//                 ...p,
//                 likeCount: (p.likeCount || 0) + (isCurrentlyLiked ? 0 : -1),
//               }
//             : p
//         )
//       );
//     }
//   };

//   // ⭐ ADDED — DOUBLE TAP LIKE
//   const handleDoubleTap = (post: any) => {
//     const now = Date.now();
//     const lastTap = doubleTapRef.current[post.id] || 0;

//     if (now - lastTap < 300) {
//       toggleLike(post);
//     }
//     doubleTapRef.current[post.id] = now;
//   };

//   const renderItem = ({ item: post }: { item: any }) => {
//     const isMulti = (post.media?.length ?? 0) > 1;

//     return (
//       <View style={styles.card}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View>
//             <Text style={styles.owner}>{post.ownerName ?? "User"}</Text>
//             <Text style={styles.role}>{post.ownerRole ?? ""}</Text>
//           </View>

//           {/* ONLY admin/monitor can edit or delete posts */}
//           {(user?.role === "admin" || user?.role === "monitor") && (
//             <TouchableOpacity onPress={() => openOptions(post)}>
//               <Entypo
//                 name="dots-three-vertical"
//                 size={20}
//                 color={Colors.textPrimary}
//               />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Media */}
//         {isMulti ? (
//           <View>
//             <FlatList
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               data={post.media}
//               keyExtractor={(m: any) => m.publicId}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   activeOpacity={1}
//                   onPress={() => handleDoubleTap(post)} // ⭐ ADDED
//                 >
//                   <View style={{ width }}>
//                     <Image
//                       source={{ uri: item.url }}
//                       style={{
//                         width: "100%",
//                         height: 480,
//                         backgroundColor: "#2b2a2aff",
//                       }}
//                       resizeMode="contain"
//                     />
//                   </View>
//                 </TouchableOpacity>
//               )}
//               snapToInterval={width}
//               snapToAlignment="center"
//               decelerationRate="fast"
//               viewabilityConfig={viewabilityConfig.current}
//               onViewableItemsChanged={(info) =>
//                 onViewableItemsChanged.current({ ...info, postId: post.id })
//               }
//             />

//             <View style={styles.imageCountBadge}>
//               <Text style={styles.imageCountText}>
//                 {(visibleIndex[post.id] ?? 0) + 1}/{post.media.length}
//               </Text>
//             </View>
//           </View>
//         ) : (
//           <TouchableOpacity
//             activeOpacity={1}
//             onPress={() => handleDoubleTap(post)} // ⭐ ADDED
//           >
//             <Image
//               source={{ uri: post.media?.[0]?.url }}
//               style={{
//                 width: "100%",
//                 height: 480,
//                 backgroundColor: "#2b2a2aff",
//               }}
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//         )}

//         {/* INSTAGRAM STYLE ACTION ROW */}
//         <View style={styles.actionRow}>
//           {/* LIKE BUTTON */}
//           <View style={{ alignItems: "center", marginRight: 20 }}>
//             <TouchableOpacity onPress={() => toggleLike(post)}>
//               {likedByMe[post.id] ? (
//                 <FontAwesome6
//                   name="heart"
//                   size={25}
//                   color="#FF3B30" // Insta red
//                   solid // makes it filled
//                 />
//               ) : (
//                 <FontAwesome6
//                   name="heart"
//                   size={25}
//                   color={Colors.textPrimary}
//                 />
//               )}
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setLikesModalPostId(post.id)}>
//               <Text style={styles.countText}>{post.likeCount ?? 0} likes </Text>
//             </TouchableOpacity>
//           </View>

//           {/* COMMENT BUTTON */}
//           <View style={{ alignItems: "center", marginRight: 20 }}>
//             <TouchableOpacity onPress={() => openComments(post)}>
//               <Feather
//                 name="message-circle"
//                 size={25}
//                 color={Colors.textPrimary}
//               />
//             </TouchableOpacity>

//             {/* Comment Count */}
//             <Text style={styles.countText}>{post.commentCount ?? 0}</Text>
//           </View>

//           {/* SHARE BUTTON */}
//           <View style={{ alignItems: "center", marginRight: 20 }}>
//             <TouchableOpacity>
//               <Feather name="send" size={25} color={Colors.textPrimary} />
//             </TouchableOpacity>

//             {/* Share Count */}
//             <Text style={styles.countText}>{post.shareCount ?? 0} </Text>
//           </View>
//         </View>

//         {/* Description */}
//         <Text style={styles.description}>{post.description ?? ""}</Text>
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: Colors.background }}>
//       <FlatList
//         data={posts}
//         keyExtractor={(p) => p.id}
//         renderItem={renderItem}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={Colors.primary}
//           />
//         }
//         contentContainerStyle={{ padding: 12, paddingBottom: 140 }}
//       />

//       <PostOptionsModal
//         visible={!!optionsFor}
//         onClose={() => setOptionsFor(null)}
//         onEdit={() => optionsFor && handleEdit(optionsFor)}
//         onDelete={() => optionsFor && handleDelete(optionsFor)}
//         userRole={user?.role ?? "user"}
//       />

//       {commentsFor && (
//         <CommentsPopup
//           postId={commentsFor}
//           onClose={() => setCommentsFor(null)}
//         />
//       )}

//       {/* ⭐ LIKED USERS MODAL */}
//       {likesModalPostId && (
//         <LikedUsersModal
//           visible={!!likesModalPostId}
//           postId={likesModalPostId}
//           onClose={() => setLikesModalPostId(null)}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     backgroundColor: Colors.lightCard,
//     borderRadius: 14,
//     marginBottom: 16,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 12,
//     alignItems: "center",
//   },
//   owner: { fontWeight: "700", color: Colors.textPrimary },
//   role: { fontSize: 12, color: Colors.textSecondary },
//   actionRow: { flexDirection: "row", alignItems: "center", padding: 12 },
//   description: {
//     paddingHorizontal: 12,
//     paddingBottom: 12,
//     color: Colors.textPrimary,
//   },
//   imageCountBadge: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "rgba(0,0,0,0.8)",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   countText: {
//     marginTop: 4,
//     fontSize: 14,
//     color: Colors.textPrimary,
//     textAlign: "center",
//   },
//   imageCountText: { color: "#fff", fontSize: 12, fontWeight: "600" },
// });

// Updated GalleryPosts.tsx with relative date and tap-to-show-full-date
// // GalleryPosts.tsx
// import { postsService } from "@/app/services/postsService";
// import { db } from "@/configs/FirebaseConfig";
// import Colors from "@/data/Colors";
// import { Entypo, Feather, FontAwesome6 } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
// import React, { useEffect, useRef, useState } from "react";

// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   Platform,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   ToastAndroid,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import CommentsPopup from "../components/CommentsPopup";
// import PostOptionsModal from "./PostOptionsModal";

// // ⭐ ADDED
// import { useAuth } from "@/contexts/AuthContext";
// import LikedUsersModal from "../components/LikedUsersModal";

// const { width } = Dimensions.get("window");

// export default function GalleryPosts() {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [commentsFor, setCommentsFor] = useState<string | null>(null);
//   const [optionsFor, setOptionsFor] = useState<any | null>(null);

//   const [visibleIndex, setVisibleIndex] = useState<Record<string, number>>({});
//   const [likedByMe, setLikedByMe] = useState<Record<string, boolean>>({});
//   const [likesModalPostId, setLikesModalPostId] = useState<string | null>(null);

//   const doubleTapRef = useRef<Record<string, number>>({});
//   const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 });

//   const onViewableItemsChanged = useRef(({ viewableItems, postId }: any) => {
//     if (viewableItems?.length > 0) {
//       setVisibleIndex((prev) => ({
//         ...prev,
//         [postId]: viewableItems[0].index ?? 0,
//       }));
//     }
//   });

//   /** NEW FORMATTER: Relative Time */
//   const formatRelativeTime = (ts: any) => {
//     const ms = ts?.seconds ? ts.seconds * 1000 : Date.now();
//     const diff = Date.now() - ms;

//     const seconds = diff / 1000;
//     if (seconds < 60) return "Just now";

//     const minutes = seconds / 60;
//     if (minutes < 60) return `${Math.floor(minutes)}m ago`;

//     const hours = minutes / 60;
//     if (hours < 24) return `${Math.floor(hours)}h ago`;

//     const days = hours / 24;
//     if (days < 7) return `${Math.floor(days)}d ago`;

//     const weeks = days / 7;
//     if (weeks < 4) return `${Math.floor(weeks)}w ago`;

//     const months = days / 30;
//     if (months < 12) return `${Math.floor(months)}mo ago`;

//     const years = days / 365;
//     return `${Math.floor(years)}y ago`;
//   };

//   /** NEW FORMATTER: Full Date Toast Display */
//   const formatFullDate = (ts: any) => {
//     const ms = ts?.seconds ? ts.seconds * 1000 : Date.now();
//     return new Date(ms).toLocaleString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Show full date when tapped
//   const showFullDateToast = (ts: any) => {
//     const full = formatFullDate(ts);
//     if (Platform.OS === "android") {
//       ToastAndroid.show(full, ToastAndroid.SHORT);
//     } else {
//       Alert.alert("Posted On", full);
//     }
//   };

//   // Realtime posts fetch
//   useEffect(() => {
//     const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
//     const unsubscribe = onSnapshot(q, async (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setPosts(list);
//       setLoading(false);

//       if (user?.uid) {
//         for (const p of list) {
//           if (likedByMe[p.id] === undefined) {
//             const liked = await postsService.isPostLikedByUser(p.id, user.uid);
//             setLikedByMe((prev) => ({ ...prev, [p.id]: liked }));
//           }
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, [user?.uid]);

//   // Refresh
//   const onRefresh = () => {
//     setRefreshing(true);
//     setTimeout(() => setRefreshing(false), 600);
//   };

//   const openComments = (post: any) => setCommentsFor(post.id);
//   const openOptions = (post: any) => setOptionsFor(post);

//   const handleEdit = (post: any) => {
//     setOptionsFor(null);
//     router.push({
//       pathname: "/(shared)/gallery/screens/CreateGalleryReview",
//       params: { postId: post.id },
//     });
//   };

//   const handleDelete = async (post: any) => {
//     setOptionsFor(null);
//     Alert.alert("Delete Post", "Are you sure?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: async () => {
//           try {
//             await postsService.deletePost(post.id);
//           } catch {
//             Alert.alert("Failed to delete");
//           }
//         },
//       },
//     ]);
//   };

//   const toggleLike = async (post: any) => {
//     if (!user) return Alert.alert("Login required");

//     const id = post.id;
//     const current = likedByMe[id];

//     setLikedByMe((prev) => ({ ...prev, [id]: !current }));

//     setPosts((prev) =>
//       prev.map((p) =>
//         p.id === id
//           ? { ...p, likeCount: (p.likeCount || 0) + (current ? -1 : 1) }
//           : p
//       )
//     );

//     try {
//       if (!current) {
//         await postsService.likePost(id, {
//           userId: user.uid,
//           name: user.fullName,
//           photoURL: user.profileImage,
//         });
//       } else {
//         await postsService.unlikePost(id, user.uid);
//       }
//     } catch {
//       Alert.alert("Failed");
//     }
//   };

//   const handleDoubleTap = (post: any) => {
//     const now = Date.now();
//     const lastTap = doubleTapRef.current[post.id] || 0;

//     if (now - lastTap < 300) toggleLike(post);
//     doubleTapRef.current[post.id] = now;
//   };

//   const renderItem = ({ item: post }: any) => {
//     const isMulti = (post.media?.length ?? 0) > 1;

//     return (
//       <View style={styles.card}>
//         {/* HEADER */}
//         <View style={styles.header}>
//           <View>
//             <Text style={styles.owner}>{post.ownerName ?? "User"}</Text>

//             {/* New row: role + relative time + tap to show date */}
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Text style={styles.role}>{post.ownerRole ?? ""}</Text>
//               <Text style={styles.dot}> • </Text>

//               <TouchableOpacity
//                 onPress={() => showFullDateToast(post.createdAt)}
//               >
//                 <Text style={styles.dateText}>
//                   {formatRelativeTime(post.createdAt)}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {(user?.role === "admin" || user?.role === "monitor") && (
//             <TouchableOpacity onPress={() => openOptions(post)}>
//               <Entypo
//                 name="dots-three-vertical"
//                 size={20}
//                 color={Colors.textPrimary}
//               />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Images */}
//         {isMulti ? (
//           <View>
//             <FlatList
//               horizontal
//               pagingEnabled
//               data={post.media}
//               keyExtractor={(m: any) => m.publicId}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   activeOpacity={1}
//                   onPress={() => handleDoubleTap(post)}
//                 >
//                   <View style={{ width }}>
//                     <Image
//                       source={{ uri: item.url }}
//                       style={{
//                         width: "100%",
//                         height: 480,
//                         backgroundColor: "#2b2a2aff",
//                       }}
//                       resizeMode="contain"
//                     />
//                   </View>
//                 </TouchableOpacity>
//               )}
//               showsHorizontalScrollIndicator={false}
//               snapToInterval={width}
//               snapToAlignment="center"
//               decelerationRate="fast"
//               viewabilityConfig={viewabilityConfig.current}
//               onViewableItemsChanged={(info) =>
//                 onViewableItemsChanged.current({ ...info, postId: post.id })
//               }
//             />

//             <View style={styles.imageCountBadge}>
//               <Text style={styles.imageCountText}>
//                 {(visibleIndex[post.id] ?? 0) + 1}/{post.media.length}
//               </Text>
//             </View>
//           </View>
//         ) : (
//           <TouchableOpacity
//             activeOpacity={1}
//             onPress={() => handleDoubleTap(post)}
//           >
//             <Image
//               source={{ uri: post.media?.[0]?.url }}
//               style={{
//                 width: "100%",
//                 height: 480,
//                 backgroundColor: "#2b2a2aff",
//               }}
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//         )}

//         {/* ACTION ROW */}
//         <View style={styles.actionRow}>
//           <View style={{ alignItems: "center", marginRight: 20 }}>
//             <TouchableOpacity onPress={() => toggleLike(post)}>
//               {likedByMe[post.id] ? (
//                 <FontAwesome6 name="heart" size={25} color="#FF3B30" solid />
//               ) : (
//                 <FontAwesome6
//                   name="heart"
//                   size={25}
//                   color={Colors.textPrimary}
//                 />
//               )}
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setLikesModalPostId(post.id)}>
//               <Text style={styles.countText}>{post.likeCount ?? 0} likes</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={{ alignItems: "center", marginRight: 20 }}>
//             <TouchableOpacity onPress={() => openComments(post)}>
//               <Feather
//                 name="message-circle"
//                 size={25}
//                 color={Colors.textPrimary}
//               />
//             </TouchableOpacity>
//             <Text style={styles.countText}>{post.commentCount ?? 0}</Text>
//           </View>

//           <View style={{ alignItems: "center", marginRight: 20 }}>
//             <TouchableOpacity>
//               <Feather name="send" size={25} color={Colors.textPrimary} />
//             </TouchableOpacity>
//             <Text style={styles.countText}>{post.shareCount ?? 0}</Text>
//           </View>
//         </View>

//         {/* DESCRIPTION */}
//         <Text style={styles.description}>{post.description ?? ""}</Text>
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: Colors.background }}>
//       <FlatList
//         data={posts}
//         keyExtractor={(p) => p.id}
//         renderItem={renderItem}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={Colors.primary}
//           />
//         }
//         contentContainerStyle={{ padding: 12, paddingBottom: 140 }}
//       />

//       <PostOptionsModal
//         visible={!!optionsFor}
//         onClose={() => setOptionsFor(null)}
//         onEdit={() => optionsFor && handleEdit(optionsFor)}
//         onDelete={() => optionsFor && handleDelete(optionsFor)}
//         userRole={user?.role ?? "user"}
//       />

//       {commentsFor && (
//         <CommentsPopup
//           postId={commentsFor}
//           onClose={() => setCommentsFor(null)}
//         />
//       )}

//       {likesModalPostId && (
//         <LikedUsersModal
//           visible={!!likesModalPostId}
//           postId={likesModalPostId}
//           onClose={() => setLikesModalPostId(null)}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     backgroundColor: Colors.lightCard,
//     borderRadius: 14,
//     marginBottom: 16,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 12,
//     alignItems: "center",
//   },
//   owner: { fontWeight: "700", color: Colors.textPrimary },
//   role: { fontSize: 12, color: Colors.textSecondary },
//   dot: { fontSize: 12, color: Colors.textSecondary, marginHorizontal: 4 },
//   dateText: { fontSize: 12, color: Colors.textSecondary },
//   actionRow: { flexDirection: "row", alignItems: "center", padding: 12 },
//   description: {
//     paddingHorizontal: 12,
//     paddingBottom: 12,
//     color: Colors.textPrimary,
//   },
//   imageCountBadge: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "rgba(0,0,0,0.8)",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   countText: {
//     marginTop: 4,
//     fontSize: 14,
//     color: Colors.textPrimary,
//     textAlign: "center",
//   },
//   imageCountText: { color: "#fff", fontSize: 12, fontWeight: "600" },
// });

// (shared)/gallery/components/GalleryPosts.tsx
import { postsService } from "@/app/services/postsService";
import { shareService } from "@/app/services/shareService";
import { db } from "@/configs/FirebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import { Entypo, Feather, FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import CommentsPopup from "../components/CommentsPopup";
import LikedUsersModal from "../components/LikedUsersModal";
import PostOptionsModal from "./PostOptionsModal";

const { width } = Dimensions.get("window");
const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function GalleryPosts() {
  const router = useRouter();
  const { user } = useAuth();
  const { postId } = useLocalSearchParams<{ postId?: string }>();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentsFor, setCommentsFor] = useState<string | null>(null);
  const [optionsFor, setOptionsFor] = useState<any | null>(null);
  const [likesModalPostId, setLikesModalPostId] = useState<string | null>(null);

  const [defaultIdentity, setDefaultIdentity] = useState<{
    displayName: string;
    profileImage: string;
  } | null>(null);

  const [visibleIndex, setVisibleIndex] = useState<Record<string, number>>({});
  const [likedByMe, setLikedByMe] = useState<Record<string, boolean>>({});

  const doubleTapRef = useRef<Record<string, number>>({});
  const listRef = useRef<FlatList<any>>(null);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 });
  const onViewableItemsChanged = useRef(({ viewableItems, postId }: any) => {
    if (viewableItems?.length > 0) {
      setVisibleIndex((prev) => ({
        ...prev,
        [postId]: viewableItems[0].index ?? 0,
      }));
    }
  });

  // 🟦 DELETE POST FUNCTION
  const handleDeletePost = async (postId: string) => {
    try {
      await postsService.deletePost(postId);

      setPosts((prev) => prev.filter((p) => p.id !== postId)); // update UI immediately
      setOptionsFor(null);

      if (Platform.OS === "android") {
        ToastAndroid.show("Post deleted", ToastAndroid.SHORT);
      } else {
        Alert.alert("Deleted", "Post removed");
      }
    } catch {
      Alert.alert("Delete Failed", "Try again");
    }
  };

  useEffect(() => {
    if (!postId || posts.length === 0) return;

    const index = posts.findIndex((p) => p.id === postId);
    if (index === -1) return;

    // wait until FlatList renders
    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.1,
      });
    }, 300);
  }, [postId, posts]);

  useEffect(() => {
    const loadSettings = async () => {
      const snap = await getDoc(doc(db, "settings", "postIdentity"));
      if (snap.exists()) setDefaultIdentity(snap.data() as any);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("type", "==", "image"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, async (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(list);
      setLoading(false);

      if (user?.uid) {
        for (const p of list) {
          if (likedByMe[p.id] === undefined) {
            const liked = await postsService.isPostLikedByUser(p.id, user.uid);
            setLikedByMe((prev) => ({ ...prev, [p.id]: liked }));
          }
        }
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const formatRelativeTime = (ts: any) => {
    const ms = ts?.seconds ? ts.seconds * 1000 : Date.now();
    const diff = Date.now() - ms;

    const minutes = diff / 60000;
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${Math.floor(minutes)}m ago`;

    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}h ago`;

    return `${Math.floor(hours / 24)}d ago`;
  };

  const showFullDateToast = (ts: any) => {
    const ms = ts?.seconds ? ts.seconds * 1000 : Date.now();
    const formatted = new Date(ms).toLocaleString();

    if (Platform.OS === "android") {
      ToastAndroid.show(formatted, ToastAndroid.SHORT);
    } else {
      Alert.alert("Posted On", formatted);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleDoubleTap = (post: any) => {
    const now = Date.now();
    const lastTap = doubleTapRef.current[post.id] || 0;
    if (now - lastTap < 300) toggleLike(post);
    doubleTapRef.current[post.id] = now;
  };

  const toggleLike = async (post: any) => {
    if (!user) return Alert.alert("Login required");

    const id = post.id;
    const current = likedByMe[id];

    setLikedByMe((prev) => ({ ...prev, [id]: !current }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likeCount: (p.likeCount || 0) + (current ? -1 : 1) }
          : p
      )
    );

    try {
      if (!current) {
        await postsService.likePost(id, {
          userId: user.uid,
          name: user.fullName,
          photoURL: user.profileImage,
        });
      } else {
        await postsService.unlikePost(id, user.uid);
      }
    } catch {}
  };

  const handleSharePost = async (post: any) => {
    if (!user) {
      Alert.alert("Login required", "Please login to share this post");
      return;
    }

    await shareService.addShare({
      postId: post.id,
      type: "image",
      text: post.description,
      user,
    });
  };

  const renderItem = ({ item: post }: any) => {
    const isUserView = user?.role === "user";
    const isAdminOrMonitor = user?.role === "admin" || user?.role === "monitor";

    const displayName = isUserView
      ? defaultIdentity?.displayName ?? "LeaderApp Member"
      : post.ownerName ?? "User";

    const displayAvatar = isUserView
      ? defaultIdentity?.profileImage ?? DEFAULT_IMAGE
      : null;

    return (
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          {displayAvatar && (
            <Image source={{ uri: displayAvatar }} style={styles.avatar} />
          )}

          <View style={{ marginLeft: 4 }}>
            <Text style={styles.owner}>{displayName}</Text>
            {isAdminOrMonitor && post.ownerRole && (
              <Text style={styles.role}>{post.ownerRole}</Text>
            )}

            <TouchableOpacity onPress={() => showFullDateToast(post.createdAt)}>
              <Text style={styles.dateText}>
                {formatRelativeTime(post.createdAt)}
              </Text>
            </TouchableOpacity>
          </View>

          {isAdminOrMonitor && (
            <TouchableOpacity
              style={{ marginLeft: "auto" }}
              onPress={() => setOptionsFor(post)}
            >
              <Entypo
                name="dots-three-vertical"
                size={20}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
          )}
        </View>

        {(post.media?.length ?? 0) > 1 ? (
          <View>
            <FlatList
              horizontal
              pagingEnabled
              data={post.media}
              keyExtractor={(m: any) => m.publicId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => handleDoubleTap(post)}
                >
                  <View style={{ width }}>
                    <Image
                      source={{ uri: item.url }}
                      style={styles.postImage}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              snapToInterval={width}
              decelerationRate="fast"
              viewabilityConfig={viewabilityConfig.current}
              onViewableItemsChanged={(info) =>
                onViewableItemsChanged.current({ ...info, postId: post.id })
              }
            />
            <View style={styles.imageCountBadge}>
              <Text style={styles.imageCountText}>
                {(visibleIndex[post.id] ?? 0) + 1}/{post.media.length}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handleDoubleTap(post)}
          >
            <Image
              source={{ uri: post.media?.[0]?.url }}
              style={styles.postImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        <View style={styles.actionRow}>
          <View style={{ alignItems: "center", marginRight: 20 }}>
            <TouchableOpacity onPress={() => toggleLike(post)}>
              {likedByMe[post.id] ? (
                <FontAwesome6 name="heart" size={25} color="#FF3B30" solid />
              ) : (
                <FontAwesome6
                  name="heart"
                  size={25}
                  color={Colors.textPrimary}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLikesModalPostId(post.id)}>
              <Text style={styles.countText}>{post.likeCount ?? 0} likes</Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "center", marginRight: 20 }}>
            <TouchableOpacity onPress={() => setCommentsFor(post.id)}>
              <Feather
                name="message-circle"
                size={25}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
            <Text style={styles.countText}>{post.commentCount ?? 0}</Text>
          </View>

          <View style={{ alignItems: "center", marginRight: 20 }}>
            <TouchableOpacity onPress={() => handleSharePost(post)}>
              <Feather name="send" size={25} color={Colors.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.countText}>{post.shareCount ?? 0}</Text>
          </View>
        </View>

        <Text style={styles.description}>{post.description ?? ""}</Text>
      </View>
    );
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={{ padding: 12, paddingBottom: 140 }}
      /> */}

      <FlatList
        ref={listRef}
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={{ padding: 12, paddingBottom: 140 }}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          }, 300);
        }}
      />

      {/* MODALS */}
      <PostOptionsModal
        visible={!!optionsFor}
        onClose={() => setOptionsFor(null)}
        onEdit={() =>
          optionsFor &&
          router.push({
            pathname: "/(shared)/gallery/screens/CreateGalleryReview",
            params: { postId: optionsFor.id },
          })
        }
        onDelete={() =>
          optionsFor &&
          Alert.alert(
            "Delete Post?",
            "Are you sure you want to delete this post?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => handleDeletePost(optionsFor.id),
              },
            ]
          )
        }
        userRole={user?.role ?? "user"}
      />

      {commentsFor && (
        <CommentsPopup
          postId={commentsFor}
          onClose={() => setCommentsFor(null)}
        />
      )}

      {likesModalPostId && (
        <LikedUsersModal
          visible={!!likesModalPostId}
          postId={likesModalPostId}
          onClose={() => setLikesModalPostId(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: Colors.lightCard,
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#d1d1d1",
    borderWidth: 1.5,
    borderColor: "#fff",
    elevation: 5,
  },
  owner: { fontWeight: "700", color: Colors.textPrimary },
  role: { fontSize: 12, color: Colors.textSecondary },
  dateText: { fontSize: 12, color: Colors.textSecondary },
  postImage: {
    width: "100%",
    height: 480,
    backgroundColor: "#2b2a2aff",
  },
  imageCountBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCountText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  actionRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  countText: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  description: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    color: Colors.textPrimary,
  },
});
