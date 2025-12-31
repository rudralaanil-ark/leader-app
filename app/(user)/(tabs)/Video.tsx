// // app/(user)/(tabs)/Video.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { Video } from "expo-av";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   Dimensions,
//   FlatList,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";

// import VideoCommentsSheet from "@/app/(shared)/video/components/VideoCommentsSheet";
// import {
//   GlobalUploader,
//   globalUploaderService,
// } from "@/app/services/globalUploaderService";
// import { postsService } from "@/app/services/postsService";
// import { videoService } from "@/app/services/videoService";
// import { Post } from "@/app/utils/types";
// import { useAuth } from "@/contexts/AuthContext";

// const { height, width } = Dimensions.get("window");

// const viewabilityConfig = {
//   itemVisiblePercentThreshold: 80,
// };

// export default function VideoScreen() {
//   const [videos, setVideos] = useState<Post[]>([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [uploader, setUploader] = useState<GlobalUploader | null>(null);

//   const [showComments, setShowComments] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

//   const viewedRef = useRef<Set<string>>(new Set());
//   const { user } = useAuth();

//   // Live uploader metadata
//   useEffect(() => {
//     const unsub = globalUploaderService.subscribe((val) => setUploader(val));
//     return unsub;
//   }, []);

//   // Live video posts
//   useEffect(() => {
//     const unsub = videoService.subscribeToVideos((list) => setVideos(list));
//     return unsub;
//   }, []);

//   const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
//     if (!viewableItems || viewableItems.length === 0) return;

//     const first = viewableItems[0];
//     const index = first.index ?? 0;
//     const item = first.item as Post;

//     setActiveIndex(index);

//     if (item?.id && !viewedRef.current.has(item.id)) {
//       viewedRef.current.add(item.id);
//       videoService.incrementViewCount(item.id).catch(() => {});
//     }
//   }).current;

//   const keyExtractor = useCallback((item: any) => item.id, []);

//   const openComments = (postId: string) => {
//     setSelectedPostId(postId);
//     setShowComments(true);
//   };

//   const renderItem = useCallback(
//     ({ item, index }: { item: Post; index: number }) => (
//       <VideoCard
//         post={item}
//         isActive={index === activeIndex}
//         uploaderName={item.ownerName ?? uploader?.name ?? "Admin"}
//         currentUserId={user?.uid ?? null}
//         onPressComments={() => openComments(item.id)}
//       />
//     ),
//     [activeIndex, uploader?.name, user?.uid]
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />

//       {videos.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>No videos yet</Text>
//           <Text style={styles.emptySubText}>
//             Videos uploaded by your leaders will appear here.
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={videos}
//           keyExtractor={keyExtractor}
//           renderItem={renderItem}
//           pagingEnabled
//           showsVerticalScrollIndicator={false}
//           onViewableItemsChanged={onViewableItemsChanged}
//           viewabilityConfig={viewabilityConfig}
//           decelerationRate="fast"
//           snapToAlignment="start"
//           getItemLayout={(_, index) => ({
//             length: height,
//             offset: height * index,
//             index,
//           })}
//         />
//       )}

//       {/* COMMENTS MODAL */}
//       <VideoCommentsSheet
//         visible={showComments}
//         postId={selectedPostId}
//         onClose={() => setShowComments(false)}
//       />
//     </View>
//   );
// }

// // ---------------- Video Card Component ----------------

// type VideoCardProps = {
//   post: Post;
//   isActive: boolean;
//   uploaderName: string;
//   currentUserId: string | null;
//   onPressComments: () => void;
// };

// const VideoCard: React.FC<VideoCardProps> = ({
//   post,
//   isActive,
//   uploaderName,
//   currentUserId,
//   onPressComments,
// }) => {
//   const { user } = useAuth();
//   const videoRef = useRef<Video | null>(null);

//   const [isMuted, setIsMuted] = useState(true);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState((post as any).likeCount ?? 0);
//   const [commentCount] = useState((post as any).commentCount ?? 0);

//   const media = (post as any).media || [];
//   const videoUrl = media.find((m: any) => m.type === "video")?.url;

//   useEffect(() => {
//     if (!user || !post.id) return;

//     postsService
//       .isPostLikedByUser(post.id, user.uid)
//       .then((liked) => setIsLiked(liked))
//       .catch(() => {});
//   }, [post.id, user]);

//   const toggleMute = () => setIsMuted((prev) => !prev);

//   const toggleLike = async () => {
//     if (!user || !post.id) return;

//     try {
//       if (isLiked) {
//         setIsLiked(false);
//         setLikeCount((c) => c - 1);
//         await postsService.unlikePost(post.id, user.uid);
//       } else {
//         setIsLiked(true);
//         setLikeCount((c) => c + 1);
//         await postsService.likePost(post.id, {
//           userId: user.uid,
//           name: user.fullName ?? "User",
//         });
//       }
//     } catch {}
//   };

//   if (!videoUrl) {
//     return (
//       <View style={[styles.cardContainer, styles.centerContent]}>
//         <Text style={styles.emptyText}>Invalid video</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.cardContainer}>
//       <TouchableWithoutFeedback onPress={toggleMute}>
//         <View style={styles.videoWrapper}>
//           <Video
//             ref={(ref) => (videoRef.current = ref)}
//             source={{ uri: videoUrl }}
//             style={styles.video}
//             resizeMode="cover"
//             shouldPlay={isActive}
//             isLooping
//             isMuted={isMuted}
//           />
//         </View>
//       </TouchableWithoutFeedback>

//       {/* ACTIONS */}
//       <View style={styles.actionsContainer}>
//         <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
//           <Ionicons
//             name={isLiked ? "heart" : "heart-outline"}
//             size={28}
//             color={isLiked ? "#ff4b67" : "#ffffff"}
//           />
//           <Text style={styles.actionLabel}>{likeCount}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={onPressComments} style={styles.actionButton}>
//           <Ionicons name="chatbubble-outline" size={28} color="#ffffff" />
//           <Text style={styles.actionLabel}>{commentCount}</Text>
//         </TouchableOpacity>

//         <View style={styles.spacer} />

//         <TouchableOpacity onPress={toggleMute} style={styles.actionButton}>
//           <Ionicons
//             name={isMuted ? "volume-mute" : "volume-high"}
//             size={24}
//             color="#ffffff"
//           />
//         </TouchableOpacity>
//       </View>

//       {/* BOTTOM INFO */}
//       <View style={styles.bottomContainer}>
//         <Text style={styles.uploaderText}>@{uploaderName}</Text>
//         {post.title ? (
//           <Text numberOfLines={2} style={styles.captionText}>
//             {post.title}
//           </Text>
//         ) : null}
//       </View>
//     </View>
//   );
// };

// // ---------------- Styles ----------------

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 24,
//   },
//   emptyText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   emptySubText: { color: "#9ca3af", fontSize: 14, textAlign: "center" },
//   cardContainer: { width, height, backgroundColor: "#000" },
//   centerContent: { justifyContent: "center", alignItems: "center" },
//   videoWrapper: { flex: 1 },
//   video: { width: "100%", height: "100%" },
//   actionsContainer: {
//     position: "absolute",
//     right: 16,
//     bottom: 80,
//     alignItems: "center",
//   },
//   actionButton: { alignItems: "center", marginBottom: 20 },
//   actionLabel: { color: "#fff", fontSize: 12, marginTop: 4 },
//   spacer: { height: 12 },
//   bottomContainer: {
//     position: "absolute",
//     left: 16,
//     right: 120,
//     bottom: 32,
//   },
//   uploaderText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   captionText: {
//     color: "#fff",
//     fontSize: 14,
//     marginTop: 4,
//   },
// });

// // app/(user)/(tabs)/Video.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { VideoView } from "expo-video";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   Dimensions,
//   FlatList,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";

// import VideoCommentsSheet from "@/app/(shared)/video/components/VideoCommentsSheet";
// import {
//   GlobalUploader,
//   globalUploaderService,
// } from "@/app/services/globalUploaderService";
// import { postsService } from "@/app/services/postsService";
// import { videoService } from "@/app/services/videoService";
// import { Post } from "@/app/utils/types";
// import { useAuth } from "@/contexts/AuthContext";

// const { height, width } = Dimensions.get("window");

// const viewabilityConfig = {
//   itemVisiblePercentThreshold: 80,
// };

// export default function VideoScreen() {
//   const [videos, setVideos] = useState<Post[]>([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [uploader, setUploader] = useState<GlobalUploader | null>(null);

//   const [showComments, setShowComments] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

//   const viewedRef = useRef<Set<string>>(new Set());
//   const { user } = useAuth();

//   useEffect(() => {
//     const unsub = globalUploaderService.subscribe((val) => setUploader(val));
//     return unsub;
//   }, []);

//   useEffect(() => {
//     const unsub = videoService.subscribeToVideos((list) => setVideos(list));
//     return unsub;
//   }, []);

//   const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
//     if (!viewableItems?.length) return;

//     const first = viewableItems[0];
//     const index = first.index;
//     const item = first.item as Post;

//     setActiveIndex(index);

//     if (item?.id && !viewedRef.current.has(item.id)) {
//       viewedRef.current.add(item.id);
//       videoService.incrementViewCount(item.id).catch(() => {});
//     }
//   }).current;

//   const keyExtractor = useCallback((item: any) => item.id, []);

//   const openComments = (postId: string) => {
//     setSelectedPostId(postId);
//     setShowComments(true);
//   };

//   const renderItem = useCallback(
//     ({ item, index }: { item: Post; index: number }) => (
//       <VideoCard
//         post={item}
//         isActive={index === activeIndex}
//         uploaderName={
//           item.uploaderName ||
//           item.authorName ||
//           item.ownerName ||
//           uploader?.name ||
//           "Admin"
//         }
//         currentUserId={user?.uid ?? null}
//         onPressComments={() => openComments(item.id)}
//       />
//     ),
//     [activeIndex, uploader?.name, user?.uid]
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />

//       {videos.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>No videos yet</Text>
//           <Text style={styles.emptySubText}>
//             Videos uploaded by your leaders will appear here.
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={videos}
//           keyExtractor={keyExtractor}
//           renderItem={renderItem}
//           pagingEnabled
//           showsVerticalScrollIndicator={false}
//           onViewableItemsChanged={onViewableItemsChanged}
//           viewabilityConfig={viewabilityConfig}
//           snapToAlignment="start"
//           decelerationRate="fast"
//           getItemLayout={(_, index) => ({
//             length: height,
//             offset: height * index,
//             index,
//           })}
//         />
//       )}

//       <VideoCommentsSheet
//         visible={showComments}
//         postId={selectedPostId}
//         onClose={() => setShowComments(false)}
//       />
//     </View>
//   );
// }

// type VideoCardProps = {
//   post: Post;
//   isActive: boolean;
//   uploaderName: string;
//   currentUserId: string | null;
//   onPressComments: () => void;
// };

// const VideoCard: React.FC<VideoCardProps> = ({
//   post,
//   isActive,
//   uploaderName,
//   currentUserId,
//   onPressComments,
// }) => {
//   const { user } = useAuth();
//   const videoRef = useRef<VideoView | null>(null);

//   const [isMuted, setIsMuted] = useState(true);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
//   const [commentCount] = useState(post.commentCount ?? 0);

//   const videoUrl = post.media?.find((m: any) => m.type === "video")?.url;

//   useEffect(() => {
//     if (!user || !post.id) return;

//     postsService
//       .isPostLikedByUser(post.id, user.uid)
//       .then((liked) => setIsLiked(liked))
//       .catch(() => {});
//   }, [post.id, user]);

//   const toggleMute = () => setIsMuted((prev) => !prev);

//   const toggleLike = async () => {
//     if (!user || !post.id) return;
//     try {
//       if (isLiked) {
//         setIsLiked(false);
//         setLikeCount((c) => Math.max(0, c - 1));
//         await postsService.unlikePost(post.id, user.uid);
//       } else {
//         setIsLiked(true);
//         setLikeCount((c) => c + 1);
//         await postsService.likePost(post.id, {
//           userId: user.uid,
//           name: user.fullName ?? "User",
//         });
//       }
//     } catch {}
//   };

//   if (!videoUrl) {
//     return (
//       <View style={[styles.cardContainer, styles.centerContent]}>
//         <Text style={styles.emptyText}>Invalid video</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.cardContainer}>
//       <TouchableWithoutFeedback onPress={toggleMute}>
//         <View style={styles.videoWrapper}>
//           <VideoView
//             ref={videoRef}
//             style={styles.video}
//             source={{ uri: videoUrl }}
//             playing={isActive}
//             isLooping
//             muted={isMuted}
//             nativeControls={false}
//             resizeMode="cover"
//           />
//         </View>
//       </TouchableWithoutFeedback>

//       <View style={styles.actionsContainer}>
//         <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
//           <Ionicons
//             name={isLiked ? "heart" : "heart-outline"}
//             size={28}
//             color={isLiked ? "#ff4b67" : "#ffffff"}
//           />
//           <Text style={styles.actionLabel}>{likeCount}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={onPressComments} style={styles.actionButton}>
//           <Ionicons name="chatbubble-outline" size={28} color="#ffffff" />
//           <Text style={styles.actionLabel}>{commentCount}</Text>
//         </TouchableOpacity>

//         <View style={styles.spacer} />

//         <TouchableOpacity onPress={toggleMute} style={styles.actionButton}>
//           <Ionicons
//             name={isMuted ? "volume-mute" : "volume-high"}
//             size={24}
//             color="#ffffff"
//           />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.bottomContainer}>
//         <Text style={styles.uploaderText}>@{uploaderName}</Text>
//         {post.title && (
//           <Text numberOfLines={2} style={styles.captionText}>
//             {post.title}
//           </Text>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 24,
//   },
//   emptyText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   emptySubText: { color: "#9ca3af", fontSize: 14, textAlign: "center" },
//   cardContainer: { width, height, backgroundColor: "#000" },
//   centerContent: { justifyContent: "center", alignItems: "center" },
//   videoWrapper: { flex: 1 },
//   video: { width: "100%", height: "100%" },
//   actionsContainer: {
//     position: "absolute",
//     right: 16,
//     bottom: 80,
//     alignItems: "center",
//   },
//   actionButton: { alignItems: "center", marginBottom: 20 },
//   actionLabel: { color: "#fff", fontSize: 12, marginTop: 4 },
//   spacer: { height: 12 },
//   bottomContainer: {
//     position: "absolute",
//     left: 16,
//     right: 120,
//     bottom: 32,
//   },
//   uploaderText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   captionText: { color: "#fff", fontSize: 14, marginTop: 4 },
// });

// // app/(user)/(tabs)/Video.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { useIsFocused } from "@react-navigation/native";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   Dimensions,
//   FlatList,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import Video from "react-native-video";

// import CommentsSheet from "@/app/(shared)/gallery/components/CommentsSheet"; // 👈 Correct import now

// import {
//   GlobalUploader,
//   globalUploaderService,
// } from "@/app/services/globalUploaderService";
// import { postsService } from "@/app/services/postsService";
// import { videoService } from "@/app/services/videoService";
// import { Post } from "@/app/utils/types";
// import { useAuth } from "@/contexts/AuthContext";

// const { height, width } = Dimensions.get("window");

// const viewabilityConfig = {
//   itemVisiblePercentThreshold: 80,
// };

// export default function VideoScreen() {
//   const [videos, setVideos] = useState<Post[]>([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [showComments, setShowComments] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
//   const [uploader, setUploader] = useState<GlobalUploader | null>(null);

//   const [globalMute, setGlobalMute] = useState(true);
//   const viewedRef = useRef<Set<string>>(new Set());
//   const isFocused = useIsFocused();
//   const { user } = useAuth();

//   useEffect(() => {
//     const unsub = globalUploaderService.subscribe((val) => setUploader(val));
//     return unsub;
//   }, []);

//   useEffect(() => {
//     const unsub = postsService.subscribeToPostType("video", (list) =>
//       setVideos(list as Post[])
//     );
//     return unsub;
//   }, []);

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (!viewableItems?.length) return;
//     const first = viewableItems[0];
//     const index = first.index ?? 0;
//     const item = first.item as Post;

//     setActiveIndex(index);

//     if (item?.id && !viewedRef.current.has(item.id)) {
//       viewedRef.current.add(item.id);
//       videoService.incrementViewCount(item.id).catch(() => {});
//     }
//   }).current;

//   const openComments = (postId: string) => {
//     setSelectedPostId(postId);
//     setShowComments(true);
//   };

//   const renderItem = useCallback(
//     ({ item, index }: { item: Post; index: number }) => (
//       <VideoCard
//         post={item}
//         isActive={index === activeIndex && isFocused}
//         uploaderName={
//           (item as any).uploaderName ||
//           (item as any).authorName ||
//           item.ownerName ||
//           uploader?.name ||
//           "Admin"
//         }
//         globalMute={globalMute}
//         toggleGlobalMute={() => setGlobalMute((prev) => !prev)}
//         currentUserId={user?.uid ?? null}
//         onPressComments={() => openComments(item.id)}
//       />
//     ),
//     [activeIndex, uploader?.name, user?.uid, globalMute, isFocused]
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />

//       {videos.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>No videos yet</Text>
//           <Text style={styles.emptySubText}>
//             Videos uploaded by your leaders will appear here.
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={videos}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//           pagingEnabled
//           showsVerticalScrollIndicator={false}
//           onViewableItemsChanged={onViewableItemsChanged}
//           viewabilityConfig={viewabilityConfig}
//           snapToAlignment="start"
//           decelerationRate="fast"
//         />
//       )}

//       <CommentsSheet
//         visible={showComments}
//         postId={selectedPostId ?? ""}
//         onClose={() => setShowComments(false)}
//       />
//     </View>
//   );
// }

// // ---------------- Video Card Component ----------------

// const VideoCard: React.FC<any> = ({
//   post,
//   isActive,
//   uploaderName,
//   onPressComments,
//   globalMute,
//   toggleGlobalMute,
// }) => {
//   const { user } = useAuth();
//   const videoRef = useRef<Video | null>(null);
//   const [showFullDesc, setShowFullDesc] = useState(false);

//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState((post as any).likeCount ?? 0);
//   const [commentCount] = useState((post as any).commentCount ?? 0);

//   const videoUrl = post.media?.[0]?.url;

//   useEffect(() => {
//     if (!user || !post.id) return;
//     postsService
//       .isPostLikedByUser(post.id, user.uid)
//       .then(setIsLiked)
//       .catch(() => {});
//   }, [post.id, user]);

//   const toggleLike = async () => {
//     if (!user) return;
//     try {
//       if (isLiked) {
//         setIsLiked(false);
//         setLikeCount((c) => c - 1);
//         await postsService.unlikePost(post.id, user.uid);
//       } else {
//         setIsLiked(true);
//         setLikeCount((c) => c + 1);
//         await postsService.likePost(post.id, {
//           userId: user.uid,
//           name: user.fullName ?? "User",
//         });
//       }
//     } catch {}
//   };

//   return (
//     <View style={styles.cardContainer}>
//       <TouchableWithoutFeedback onPress={toggleGlobalMute}>
//         <View style={styles.videoWrapper}>
//           <Video
//             ref={videoRef}
//             source={{ uri: videoUrl }}
//             style={styles.video}
//             resizeMode="cover"
//             paused={!isActive}
//             repeat
//             muted={globalMute}
//             controls={false}
//           />
//         </View>
//       </TouchableWithoutFeedback>

//       <View style={styles.actionsContainer}>
//         <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
//           <Ionicons
//             name={isLiked ? "heart" : "heart-outline"}
//             size={28}
//             color={isLiked ? "#ff4b67" : "#ffffff"}
//           />
//           <Text style={styles.actionLabel}>{likeCount}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={onPressComments} style={styles.actionButton}>
//           <Ionicons name="chatbubble-outline" size={28} color="#ffffff" />
//           <Text style={styles.actionLabel}>{commentCount}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={toggleGlobalMute}
//           style={styles.actionButton}
//         >
//           <Ionicons
//             name={globalMute ? "volume-mute" : "volume-high"}
//             size={24}
//             color="#ffffff"
//           />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.bottomContainer}>
//         <Text style={styles.uploaderText}>@{uploaderName}</Text>

//         {post.title && (
//           <>
//             <Text
//               numberOfLines={showFullDesc ? undefined : 3}
//               style={styles.captionText}
//             >
//               {post.title}
//             </Text>
//             {post.title.length > 70 && (
//               <Text
//                 onPress={() => setShowFullDesc((s) => !s)}
//                 style={{ color: "#00C6FF", marginTop: 4 }}
//               >
//                 {showFullDesc ? "Less" : "More"}
//               </Text>
//             )}
//           </>
//         )}
//       </View>
//     </View>
//   );
// };

// // ---------------- Styles ----------------

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 24,
//   },
//   emptyText: { color: "#fff", fontSize: 18, fontWeight: "600" },
//   emptySubText: { color: "#9ca3af", fontSize: 14 },

//   cardContainer: {
//     width,
//     height: height - 140,
//     backgroundColor: "#000",
//   },

//   videoWrapper: { width: "100%", height: "100%" },
//   video: { width, height: height - 140 },

//   actionsContainer: {
//     position: "absolute",
//     right: 16,
//     bottom: 150,
//     alignItems: "center",
//   },
//   actionButton: { alignItems: "center", marginBottom: 20 },
//   actionLabel: { color: "#fff", fontSize: 12, marginTop: 4 },

//   bottomContainer: {
//     position: "absolute",
//     left: 16,
//     right: 120,
//     bottom: 90,
//   },
//   uploaderText: { color: "#fff", fontSize: 14, fontWeight: "700" },
//   captionText: { color: "#fff", fontSize: 14, marginTop: 4 },
// });

// // app/(user)/(tabs)/Video.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { useIsFocused } from "@react-navigation/native";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   Dimensions,
//   FlatList,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Video from "react-native-video";

// import CommentsPopup from "@/app/(shared)/gallery/components/CommentsPopup";
// import {
//   GlobalUploader,
//   globalUploaderService,
// } from "@/app/services/globalUploaderService";
// import { postsService } from "@/app/services/postsService";
// import { shareService } from "@/app/services/shareService";
// import { videoService } from "@/app/services/videoService";
// import { Post } from "@/app/utils/types";
// import { useAuth } from "@/contexts/AuthContext";

// const { height, width } = Dimensions.get("window");

// const viewabilityConfig = {
//   itemVisiblePercentThreshold: 80,
// };

// export default function VideoScreen() {
//   const [videos, setVideos] = useState<Post[]>([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [showComments, setShowComments] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
//   const [uploader, setUploader] = useState<GlobalUploader | null>(null);

//   const [globalMute, setGlobalMute] = useState(true);
//   const viewedRef = useRef<Set<string>>(new Set());
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     const unsub = globalUploaderService.subscribe(setUploader);
//     return unsub;
//   }, []);

//   useEffect(() => {
//     const unsub = postsService.subscribeToPostType("video", (list) =>
//       setVideos(list as Post[])
//     );
//     return unsub;
//   }, []);

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (!viewableItems?.length) return;

//     const first = viewableItems[0];
//     const index = first.index ?? 0;
//     const item = first.item as Post;

//     setActiveIndex(index);

//     if (item?.id && !viewedRef.current.has(item.id)) {
//       viewedRef.current.add(item.id);
//       videoService.incrementViewCount(item.id).catch(() => {});
//     }
//   }).current;

//   const openComments = (postId: string) => {
//     setGlobalMute(true);
//     setSelectedPostId(postId);
//     setShowComments(true);
//   };

//   const renderItem = useCallback(
//     ({ item, index }: { item: Post; index: number }) => {
//       const shouldPreload = Math.abs(index - activeIndex) <= 2;

//       return (
//         <VideoCard
//           post={item}
//           shouldPreload={shouldPreload}
//           isActive={index === activeIndex && isFocused && !showComments}
//           uploaderName={
//             (item as any).uploaderName ||
//             item.ownerName ||
//             uploader?.name ||
//             "Admin"
//           }
//           globalMute={globalMute}
//           toggleGlobalMute={() => setGlobalMute((p) => !p)}
//           onPressComments={() => openComments(item.id)}
//         />
//       );
//     },
//     [activeIndex, uploader?.name, globalMute, isFocused, showComments]
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />

//       <FlatList
//         data={videos}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         snapToAlignment="start"
//         decelerationRate="fast"
//         /* MEMORY SAFE */
//         removeClippedSubviews
//         windowSize={5}
//         initialNumToRender={2}
//         maxToRenderPerBatch={2}
//       />

//       {showComments && (
//         <CommentsPopup
//           postId={selectedPostId}
//           onClose={() => {
//             setShowComments(false);
//             setSelectedPostId(null);
//           }}
//         />
//       )}
//     </View>
//   );
// }

// /* ---------------- VIDEO CARD ---------------- */

// const VideoCard: React.FC<any> = ({
//   post,
//   isActive,
//   shouldPreload,
//   uploaderName,
//   onPressComments,
//   globalMute,
//   toggleGlobalMute,
// }) => {
//   const { user } = useAuth();
//   const videoRef = useRef<Video | null>(null);
//   const lastTapRef = useRef<number>(0);

//   const [userPaused, setUserPaused] = useState(false);
//   const [showFullDesc, setShowFullDesc] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
//   const [progress, setProgress] = useState(0);
//   const [duration, setDuration] = useState(1);

//   const videoUrl = post.media?.[0]?.url;

//   useEffect(() => {
//     if (!user || !post.id) return;
//     postsService.isPostLikedByUser(post.id, user.uid).then(setIsLiked);
//   }, [post.id, user]);

//   useEffect(() => {
//     if (!isActive) setUserPaused(false);
//   }, [isActive]);

//   const toggleLike = async () => {
//     if (!user) return;
//     if (isLiked) {
//       setIsLiked(false);
//       setLikeCount((c) => c - 1);
//       await postsService.unlikePost(post.id, user.uid);
//     } else {
//       setIsLiked(true);
//       setLikeCount((c) => c + 1);
//       await postsService.likePost(post.id, {
//         userId: user.uid,
//         name: user.fullName ?? "User",
//       });
//     }
//   };

//   const onVideoPress = () => {
//     const now = Date.now();
//     if (now - lastTapRef.current < 300) {
//       toggleLike();
//     } else {
//       setUserPaused((p) => !p);
//     }
//     lastTapRef.current = now;
//   };

//   const onPressShare = async () => {
//     if (!user) return;
//     await shareService.addShare({
//       postId: post.id,
//       type: "video",
//       text: post.description,
//       user,
//     });
//   };

//   /* 🔑 PRELOAD WINDOW LOGIC */
//   if (!shouldPreload) {
//     return <View style={styles.cardContainer} />;
//   }

//   return (
//     <View style={styles.cardContainer}>
//       <View style={styles.videoWrapper}>
//         <Video
//           ref={videoRef}
//           source={{ uri: videoUrl }}
//           style={styles.video}
//           resizeMode="cover"
//           paused={!isActive || userPaused}
//           repeat
//           muted={globalMute}
//           controls={false}
//           onLoad={({ duration }) => setDuration(duration || 1)}
//           onProgress={({ currentTime }) => setProgress(currentTime / duration)}
//         />

//         <Pressable style={StyleSheet.absoluteFill} onPress={onVideoPress} />

//         {userPaused && (
//           <View style={styles.playOverlay}>
//             <Ionicons name="play" size={64} color="#ffffffcc" />
//           </View>
//         )}

//         <View style={styles.progressBar}>
//           <View
//             style={[styles.progressFill, { width: `${progress * 100}%` }]}
//           />
//         </View>
//       </View>

//       <View style={styles.actionsContainer}>
//         <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
//           <Ionicons
//             name={isLiked ? "heart" : "heart-outline"}
//             size={28}
//             color={isLiked ? "#ff4b67" : "#fff"}
//           />
//           <Text style={styles.actionLabel}>{likeCount}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={onPressComments} style={styles.actionButton}>
//           <Ionicons name="chatbubble-outline" size={28} color="#fff" />
//           <Text style={styles.actionLabel}>{post.commentCount}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={onPressShare} style={styles.actionButton}>
//           <Ionicons name="share-outline" size={28} color="#fff" />
//           <Text style={styles.actionLabel}>{post.shareCount ?? 0}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={toggleGlobalMute}
//           style={styles.actionButton}
//         >
//           <Ionicons
//             name={globalMute ? "volume-mute" : "volume-high"}
//             size={24}
//             color="#fff"
//           />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.bottomContainer}>
//         <Text style={styles.uploaderText}>@{uploaderName}</Text>

//         {post.title && (
//           <>
//             <Text
//               numberOfLines={showFullDesc ? undefined : 3}
//               style={styles.captionText}
//             >
//               {post.title}
//             </Text>
//             {post.title.length > 70 && (
//               <Text
//                 onPress={() => setShowFullDesc((s) => !s)}
//                 style={styles.moreText}
//               >
//                 {showFullDesc ? "Less" : "More"}
//               </Text>
//             )}
//           </>
//         )}
//       </View>
//     </View>
//   );
// };

// /* ---------------- STYLES ---------------- */

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },

//   cardContainer: {
//     width,
//     height: height - 140,
//     backgroundColor: "#000",
//   },

//   videoWrapper: {
//     width: "100%",
//     height: "100%",
//     position: "relative",
//   },

//   video: { width, height: height - 140 },

//   playOverlay: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   progressBar: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 3,
//     backgroundColor: "rgba(255,255,255,0.3)",
//   },
//   progressFill: {
//     height: "100%",
//     backgroundColor: "#00C6FF",
//   },

//   actionsContainer: {
//     position: "absolute",
//     right: 16,
//     bottom: 150,
//     alignItems: "center",
//   },
//   actionButton: { alignItems: "center", marginBottom: 20 },
//   actionLabel: { color: "#fff", fontSize: 12, marginTop: 4 },

//   bottomContainer: {
//     position: "absolute",
//     left: 16,
//     right: 120,
//     bottom: 90,
//   },
//   uploaderText: { color: "#fff", fontSize: 14, fontWeight: "700" },
//   captionText: { color: "#fff", fontSize: 14, marginTop: 4 },
//   moreText: { color: "#00C6FF", marginTop: 4 },
// });

// // app/(user)/(tabs)/Video.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { useIsFocused } from "@react-navigation/native";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   FlatList,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Video from "react-native-video";

// import CommentsPopup from "@/app/(shared)/gallery/components/CommentsPopup";
// import {
//   GlobalUploader,
//   globalUploaderService,
// } from "@/app/services/globalUploaderService";
// import { postsService } from "@/app/services/postsService";
// import { shareService } from "@/app/services/shareService";
// import { videoService } from "@/app/services/videoService";
// import { Post } from "@/app/utils/types";
// import { useAuth } from "@/contexts/AuthContext";

// const viewabilityConfig = {
//   itemVisiblePercentThreshold: 80,
// };

// export default function VideoScreen() {
//   const [videos, setVideos] = useState<Post[]>([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [showComments, setShowComments] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
//   const [uploader, setUploader] = useState<GlobalUploader | null>(null);
//   const [globalMute, setGlobalMute] = useState(true);
//   const [pageHeight, setPageHeight] = useState(0);

//   const viewedRef = useRef<Set<string>>(new Set());
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     const unsub = globalUploaderService.subscribe(setUploader);
//     return unsub;
//   }, []);

//   useEffect(() => {
//     const unsub = postsService.subscribeToPostType("video", (list) =>
//       setVideos(list as Post[])
//     );
//     return unsub;
//   }, []);

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (!viewableItems?.length) return;

//     const first = viewableItems[0];
//     const index = first.index ?? 0;
//     const item = first.item as Post;

//     setActiveIndex(index);

//     if (item?.id && !viewedRef.current.has(item.id)) {
//       viewedRef.current.add(item.id);
//       videoService.incrementViewCount(item.id).catch(() => {});
//     }
//   }).current;

//   const openComments = (postId: string) => {
//     setGlobalMute(true);
//     setSelectedPostId(postId);
//     setShowComments(true);
//   };

//   const renderItem = useCallback(
//     ({ item, index }: { item: Post; index: number }) => {
//       const shouldPreload = index === activeIndex;

//       return (
//         <VideoCard
//           post={item}
//           pageHeight={pageHeight}
//           shouldPreload={shouldPreload}
//           isActive={index === activeIndex && isFocused && !showComments}
//           uploaderName={
//             (item as any).uploaderName ||
//             item.ownerName ||
//             uploader?.name ||
//             "Admin"
//           }
//           globalMute={globalMute}
//           toggleGlobalMute={() => setGlobalMute((p) => !p)}
//           onPressComments={() => openComments(item.id)}
//         />
//       );
//     },
//     [
//       activeIndex,
//       pageHeight,
//       uploader?.name,
//       globalMute,
//       isFocused,
//       showComments,
//     ]
//   );

//   return (
//     <View
//       style={styles.container}
//       onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}
//     >
//       <StatusBar barStyle="light-content" backgroundColor="#000" />

//       <FlatList
//         data={videos}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         snapToAlignment="start"
//         decelerationRate="fast"
//         removeClippedSubviews={false}
//         windowSize={5}
//         initialNumToRender={2}
//         maxToRenderPerBatch={2}
//         getItemLayout={(_, index) => ({
//           length: pageHeight,
//           offset: pageHeight * index,
//           index,
//         })}
//         snapToInterval={pageHeight}
//         disableIntervalMomentum={true}
//       />

//       {showComments && (
//         <CommentsPopup
//           postId={selectedPostId}
//           onClose={() => {
//             setShowComments(false);
//             setSelectedPostId(null);
//           }}
//         />
//       )}
//     </View>
//   );
// }

// /* ---------------- VIDEO CARD ---------------- */

// const VideoCard: React.FC<any> = ({
//   post,
//   pageHeight,
//   isActive,
//   shouldPreload,
//   uploaderName,
//   onPressComments,
//   globalMute,
//   toggleGlobalMute,
// }) => {
//   const { user } = useAuth();
//   const videoRef = useRef<Video | null>(null);
//   const lastTapRef = useRef<number>(0);

//   const [userPaused, setUserPaused] = useState(false);
//   const [showFullDesc, setShowFullDesc] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
//   const [progress, setProgress] = useState(0);
//   const [duration, setDuration] = useState(1);
//   const [resizeMode, setResizeMode] = useState<"cover" | "contain">("cover");
//   const [aspectRatio, setAspectRatio] = useState<number | null>(null);

//   const [isVertical, setIsVertical] = useState(true);

//   const [progressBarWidth, setProgressBarWidth] = useState(0);

//   const onSeek = (evt: any) => {
//     if (!videoRef.current || !duration || progressBarWidth === 0) return;

//     const x = evt.nativeEvent.locationX;
//     const ratio = Math.max(0, Math.min(1, x / progressBarWidth));
//     const seekTime = ratio * duration;

//     videoRef.current.seek(seekTime);
//     setProgress(ratio);
//   };

//   const videoUrl = isActive ? post.media?.[0]?.url : undefined;

//   useEffect(() => {
//     if (!user || !post.id) return;
//     postsService.isPostLikedByUser(post.id, user.uid).then(setIsLiked);
//   }, [post.id, user]);

//   useEffect(() => {
//     if (!isActive) setUserPaused(false);
//   }, [isActive]);

//   const toggleLike = async () => {
//     if (!user) return;
//     if (isLiked) {
//       setIsLiked(false);
//       setLikeCount((c) => c - 1);
//       await postsService.unlikePost(post.id, user.uid);
//     } else {
//       setIsLiked(true);
//       setLikeCount((c) => c + 1);
//       await postsService.likePost(post.id, {
//         userId: user.uid,
//         name: user.fullName ?? "User",
//       });
//     }
//   };

//   const onVideoPress = () => {
//     const now = Date.now();
//     if (now - lastTapRef.current < 300) {
//       toggleLike();
//     } else {
//       setUserPaused((p) => !p);
//     }
//     lastTapRef.current = now;
//   };

//   const onPressShare = async () => {
//     if (!user) return;
//     await shareService.addShare({
//       postId: post.id,
//       type: "video",
//       text: post.description,
//       user,
//     });
//   };

//   if (!shouldPreload) {
//     return <View style={[styles.cardContainer, { height: pageHeight }]} />;
//   }

//   return (
//     <View style={[styles.cardContainer, { height: pageHeight }]}>
//       <View style={styles.videoWrapper}>
//         <Video
//           ref={videoRef}
//           source={{ uri: videoUrl }}
//           resizeMode={resizeMode}
//           paused={!isActive || userPaused}
//           repeat
//           muted={globalMute}
//           controls={false}
//           style={[
//             styles.video,
//             isVertical ? { height: "100%" } : null,
//             aspectRatio ? { aspectRatio } : null,
//           ]}
//           /* 🔥 STREAMING OPTIMIZATION 🔥 */
//           playInBackground={false}
//           playWhenInactive={false}
//           ignoreSilentSwitch="ignore"
//           automaticallyWaitsToMinimizeStalling={false}
//           bufferConfig={{
//             minBufferMs: 500,
//             maxBufferMs: 2000,
//             bufferForPlaybackMs: 250,
//             bufferForPlaybackAfterRebufferMs: 500,
//           }}
//           onLoad={({ duration, naturalSize }) => {
//             setDuration(duration || 1);

//             if (naturalSize?.width && naturalSize?.height) {
//               if (naturalSize.height > naturalSize.width) {
//                 setIsVertical(true);
//                 setResizeMode("cover");
//                 setAspectRatio(null);
//               } else {
//                 setIsVertical(false);
//                 setResizeMode("contain");
//                 setAspectRatio(naturalSize.width / naturalSize.height);
//               }
//             }
//           }}
//           onProgress={({ currentTime }) => setProgress(currentTime / duration)}
//           onBuffer={() => {
//             /* keep silent – avoids re-render */
//           }}
//         />

//         <Pressable style={StyleSheet.absoluteFill} onPress={onVideoPress} />

//         {userPaused && (
//           <View style={styles.playOverlay}>
//             <Ionicons name="play" size={64} color="#ffffffcc" />
//           </View>
//         )}

//         <Pressable
//           style={styles.progressBar}
//           onPress={onSeek}
//           onLayout={(e) => setProgressBarWidth(e.nativeEvent.layout.width)}
//         >
//           <View
//             style={[styles.progressFill, { width: `${progress * 100}%` }]}
//           />
//         </Pressable>
//       </View>

//       <View style={styles.actionsContainer}>
//         <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
//           <Ionicons
//             name={isLiked ? "heart" : "heart-outline"}
//             size={28}
//             color={isLiked ? "#ff4b67" : "#fff"}
//           />
//           <Text style={styles.actionLabel}>{likeCount}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={onPressComments} style={styles.actionButton}>
//           <Ionicons name="chatbubble-outline" size={28} color="#fff" />
//           <Text style={styles.actionLabel}>{post.commentCount}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={onPressShare} style={styles.actionButton}>
//           <Ionicons name="share-outline" size={28} color="#fff" />
//           <Text style={styles.actionLabel}>{post.shareCount ?? 0}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={toggleGlobalMute}
//           style={styles.actionButton}
//         >
//           <Ionicons
//             name={globalMute ? "volume-mute" : "volume-high"}
//             size={24}
//             color="#fff"
//           />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.bottomContainer}>
//         <Text style={styles.uploaderText}>@{uploaderName}</Text>

//         {post.title && (
//           <>
//             <Text
//               numberOfLines={showFullDesc ? undefined : 3}
//               style={styles.captionText}
//             >
//               {post.title}
//             </Text>
//             {post.title.length > 70 && (
//               <Text
//                 onPress={() => setShowFullDesc((s) => !s)}
//                 style={styles.moreText}
//               >
//                 {showFullDesc ? "Less" : "More"}
//               </Text>
//             )}
//           </>
//         )}
//       </View>
//     </View>
//   );
// };

// /* ---------------- STYLES ---------------- */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//   },

//   cardContainer: {
//     width: "100%",
//     backgroundColor: "#000",
//   },

//   videoWrapper: {
//     flex: 1,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   video: {
//     width: "100%",
//     backgroundColor: "#000",
//   },

//   playOverlay: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   progressBar: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 10,
//     backgroundColor: "rgba(255,255,255,0)",
//     justifyContent: "center",
//   },

//   progressFill: {
//     height: 3,
//     backgroundColor: "#00C6FF",
//   },

//   actionsContainer: {
//     position: "absolute",
//     right: 16,
//     bottom: 75,
//     alignItems: "center",
//   },

//   actionButton: { alignItems: "center", marginBottom: 20 },
//   actionLabel: { color: "#fff", fontSize: 12, marginTop: 4 },

//   bottomContainer: {
//     position: "absolute",
//     left: 16,
//     right: 120,
//     bottom: 32,
//   },

//   uploaderText: { color: "#fff", fontSize: 14, fontWeight: "700" },
//   captionText: { color: "#fff", fontSize: 14, marginTop: 4 },
//   moreText: { color: "#00C6FF", marginTop: 4, fontWeight: "800" },
// });

// // app/(user)/(tabs)/Video.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { useIsFocused } from "@react-navigation/native";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   FlatList,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Video from "react-native-video";

// import CommentsPopup from "@/app/(shared)/gallery/components/CommentsPopup";
// import {
//   GlobalUploader,
//   globalUploaderService,
// } from "@/app/services/globalUploaderService";
// import { postsService } from "@/app/services/postsService";
// import { shareService } from "@/app/services/shareService";
// import { videoService } from "@/app/services/videoService";
// import { Post } from "@/app/utils/types";
// import { useAuth } from "@/contexts/AuthContext";
// import { videoCacheService } from "@/app/services/videoCacheService";

// const PAGE_SIZE = 8; // 🔥 NEW
// const PRELOAD_COUNT = 2; // 🔥 NEW

// const viewabilityConfig = {
//   itemVisiblePercentThreshold: 80,
// };

// export default function VideoScreen() {
//   const [allVideos, setAllVideos] = useState<Post[]>([]);

//   const [videos, setVideos] = useState<Post[]>([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [showComments, setShowComments] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
//   const [uploader, setUploader] = useState<GlobalUploader | null>(null);
//   const [globalMute, setGlobalMute] = useState(true);
//   const [pageHeight, setPageHeight] = useState(0);

//   const viewedRef = useRef<Set<string>>(new Set());
//   const pageRef = useRef(0);
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     const unsub = globalUploaderService.subscribe(setUploader);
//     return unsub;
//   }, []);

//   useEffect(() => {
//     const unsub = postsService.subscribeToPostType("video", (list) =>
//       setVideos(list as Post[])
//     );
//     return unsub;
//   }, []);

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (!viewableItems?.length) return;

//     const first = viewableItems[0];
//     const index = first.index ?? 0;
//     const item = first.item as Post;

//     setActiveIndex(index);

//     if (item?.id && !viewedRef.current.has(item.id)) {
//       viewedRef.current.add(item.id);
//       videoService.incrementViewCount(item.id).catch(() => {});
//     }
//   }).current;

//   const openComments = (postId: string) => {
//     setGlobalMute(true);
//     setSelectedPostId(postId);
//     setShowComments(true);
//   };

//   const renderItem = useCallback(
//     ({ item, index }: { item: Post; index: number }) => {
//       const shouldPreload =
//         index === activeIndex ||
//         index === activeIndex + 1 ||
//         index === activeIndex - 1;

//       return (
//         <VideoCard
//           post={item}
//           pageHeight={pageHeight}
//           shouldPreload={shouldPreload}
//           isActive={index === activeIndex && isFocused && !showComments}
//           isNext={index === activeIndex + 1}
//           isPrev={index === activeIndex - 1}
//           uploaderName={
//             (item as any).uploaderName ||
//             item.ownerName ||
//             uploader?.name ||
//             "Admin"
//           }
//           globalMute={globalMute}
//           toggleGlobalMute={() => setGlobalMute((p) => !p)}
//           onPressComments={() => openComments(item.id)}
//         />
//       );
//     },
//     [
//       activeIndex,
//       pageHeight,
//       uploader?.name,
//       globalMute,
//       isFocused,
//       showComments,
//     ]
//   );

//   return (
//     <View
//       style={styles.container}
//       onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}
//     >
//       <StatusBar barStyle="light-content" backgroundColor="#000" />

//       <FlatList
//         data={videos}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         snapToAlignment="start"
//         decelerationRate="fast"
//         removeClippedSubviews={false}
//         windowSize={5}
//         initialNumToRender={2}
//         maxToRenderPerBatch={2}
//         getItemLayout={(_, index) => ({
//           length: pageHeight,
//           offset: pageHeight * index,
//           index,
//         })}
//         snapToInterval={pageHeight}
//         disableIntervalMomentum
//       />

//       {showComments && (
//         <CommentsPopup
//           postId={selectedPostId}
//           onClose={() => {
//             setShowComments(false);
//             setSelectedPostId(null);
//           }}
//         />
//       )}
//     </View>
//   );
// }

// /* ---------------- VIDEO CARD ---------------- */

// const VideoCard: React.FC<any> = ({
//   post,
//   pageHeight,
//   isActive,
//   isNext,
//   isPrev,
//   shouldPreload,
//   uploaderName,
//   onPressComments,
//   globalMute,
//   toggleGlobalMute,
// }) => {
//   const { user } = useAuth();
//   const videoRef = useRef<Video | null>(null);
//   const lastTapRef = useRef<number>(0);

//   const [userPaused, setUserPaused] = useState(false);
//   const [showFullDesc, setShowFullDesc] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
//   const [progress, setProgress] = useState(0);
//   const [duration, setDuration] = useState(1);
//   const [resizeMode, setResizeMode] = useState<"cover" | "contain">("cover");
//   const [aspectRatio, setAspectRatio] = useState<number | null>(null);
//   const [isVertical, setIsVertical] = useState(true);
//   const [progressBarWidth, setProgressBarWidth] = useState(0);

//   const onSeek = (evt: any) => {
//     if (!videoRef.current || !duration || progressBarWidth === 0) return;
//     const x = evt.nativeEvent.locationX;
//     const ratio = Math.max(0, Math.min(1, x / progressBarWidth));
//     videoRef.current.seek(ratio * duration);
//     setProgress(ratio);
//   };

//   const videoUrl =
//     isActive || isNext || isPrev ? post.media?.[0]?.url : undefined;

//   useEffect(() => {
//     if (!user || !post.id) return;
//     postsService.isPostLikedByUser(post.id, user.uid).then(setIsLiked);
//   }, [post.id, user]);

//   useEffect(() => {
//     if (!isActive) setUserPaused(false);
//   }, [isActive]);

//   const toggleLike = async () => {
//     if (!user) return;
//     if (isLiked) {
//       setIsLiked(false);
//       setLikeCount((c) => c - 1);
//       await postsService.unlikePost(post.id, user.uid);
//     } else {
//       setIsLiked(true);
//       setLikeCount((c) => c + 1);
//       await postsService.likePost(post.id, {
//         userId: user.uid,
//         name: user.fullName ?? "User",
//       });
//     }
//   };

//   const onVideoPress = () => {
//     const now = Date.now();
//     if (now - lastTapRef.current < 300) toggleLike();
//     else setUserPaused((p) => !p);
//     lastTapRef.current = now;
//   };

//   const onPressShare = async () => {
//     if (!user) return;
//     await shareService.addShare({
//       postId: post.id,
//       type: "video",
//       text: post.description,
//       user,
//     });
//   };

//   if (!shouldPreload) {
//     return <View style={[styles.cardContainer, { height: pageHeight }]} />;
//   }

//   return (
//     <View style={[styles.cardContainer, { height: pageHeight }]}>
//       <View style={styles.videoWrapper}>
//         <Video
//           ref={videoRef}
//           source={videoUrl ? { uri: videoUrl } : undefined}
//           resizeMode={resizeMode}
//           paused={!isActive || userPaused}
//           repeat
//           muted={globalMute || isNext || isPrev}
//           controls={false}
//           style={[
//             styles.video,
//             isVertical ? { height: "100%" } : null,
//             aspectRatio ? { aspectRatio } : null,
//           ]}
//           playInBackground={false}
//           playWhenInactive={false}
//           ignoreSilentSwitch="ignore"
//           automaticallyWaitsToMinimizeStalling={false}
//           bufferConfig={{
//             minBufferMs: 300,
//             maxBufferMs: 1200,
//             bufferForPlaybackMs: 150,
//             bufferForPlaybackAfterRebufferMs: 300,
//           }}
//           onLoad={({ duration, naturalSize }) => {
//             setDuration(duration || 1);
//             if (naturalSize?.width && naturalSize?.height) {
//               if (naturalSize.height > naturalSize.width) {
//                 setIsVertical(true);
//                 setResizeMode("cover");
//                 setAspectRatio(null);
//               } else {
//                 setIsVertical(false);
//                 setResizeMode("contain");
//                 setAspectRatio(naturalSize.width / naturalSize.height);
//               }
//             }
//           }}
//           onProgress={({ currentTime }) => setProgress(currentTime / duration)}
//         />

//         <Pressable style={StyleSheet.absoluteFill} onPress={onVideoPress} />

//         {userPaused && (
//           <View style={styles.playOverlay}>
//             <Ionicons name="play" size={64} color="#ffffffcc" />
//           </View>
//         )}

//         <Pressable
//           style={styles.progressBar}
//           onPress={onSeek}
//           onLayout={(e) => setProgressBarWidth(e.nativeEvent.layout.width)}
//         >
//           <View
//             style={[styles.progressFill, { width: `${progress * 100}%` }]}
//           />
//         </Pressable>
//       </View>

//       <View style={styles.actionsContainer}>
//         <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
//           <Ionicons
//             name={isLiked ? "heart" : "heart-outline"}
//             size={28}
//             color={isLiked ? "#ff4b67" : "#fff"}
//           />
//           <Text style={styles.actionLabel}>{likeCount}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={onPressComments} style={styles.actionButton}>
//           <Ionicons name="chatbubble-outline" size={28} color="#fff" />
//           <Text style={styles.actionLabel}>{post.commentCount}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={onPressShare} style={styles.actionButton}>
//           <Ionicons name="share-outline" size={28} color="#fff" />
//           <Text style={styles.actionLabel}>{post.shareCount ?? 0}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={toggleGlobalMute}
//           style={styles.actionButton}
//         >
//           <Ionicons
//             name={globalMute ? "volume-mute" : "volume-high"}
//             size={24}
//             color="#fff"
//           />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.bottomContainer}>
//         <Text style={styles.uploaderText}>@{uploaderName}</Text>

//         {post.title && (
//           <>
//             <Text
//               numberOfLines={showFullDesc ? undefined : 3}
//               style={styles.captionText}
//             >
//               {post.title}
//             </Text>
//             {post.title.length > 70 && (
//               <Text
//                 onPress={() => setShowFullDesc((s) => !s)}
//                 style={styles.moreText}
//               >
//                 {showFullDesc ? "Less" : "More"}
//               </Text>
//             )}
//           </>
//         )}
//       </View>
//     </View>
//   );
// };

// /* ---------------- STYLES ---------------- */

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   cardContainer: { width: "100%", backgroundColor: "#000" },
//   videoWrapper: {
//     flex: 1,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   video: { width: "100%", backgroundColor: "#000" },
//   playOverlay: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   progressBar: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 10,
//     backgroundColor: "rgba(255,255,255,0)",
//     justifyContent: "center",
//   },
//   progressFill: { height: 3, backgroundColor: "#00C6FF" },
//   actionsContainer: {
//     position: "absolute",
//     right: 16,
//     bottom: 75,
//     alignItems: "center",
//   },
//   actionButton: { alignItems: "center", marginBottom: 20 },
//   actionLabel: { color: "#fff", fontSize: 12, marginTop: 4 },
//   bottomContainer: {
//     position: "absolute",
//     left: 16,
//     right: 120,
//     bottom: 32,
//   },
//   uploaderText: { color: "#fff", fontSize: 14, fontWeight: "700" },
//   captionText: { color: "#fff", fontSize: 14, marginTop: 4 },
//   moreText: { color: "#00C6FF", marginTop: 4, fontWeight: "800" },
// });

// app/(user)/(tabs)/Video.tsx
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Video from "react-native-video";

import CommentsPopup from "@/app/(shared)/gallery/components/CommentsPopup";
import {
  GlobalUploader,
  globalUploaderService,
} from "@/app/services/globalUploaderService";
import { postsService } from "@/app/services/postsService";
import { shareService } from "@/app/services/shareService";
import { videoCacheService } from "@/app/services/videoCacheService";
import { videoService } from "@/app/services/videoService";
import { Post } from "@/app/utils/types";
import { useAuth } from "@/contexts/AuthContext";

const PAGE_SIZE = 8;
const PRELOAD_COUNT = 2;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

export default function VideoScreen() {
  const [allVideos, setAllVideos] = useState<Post[]>([]);
  const [videos, setVideos] = useState<Post[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [uploader, setUploader] = useState<GlobalUploader | null>(null);
  const [globalMute, setGlobalMute] = useState(true);
  const [pageHeight, setPageHeight] = useState(0);

  const viewedRef = useRef<Set<string>>(new Set());
  const pageRef = useRef(1);
  const isFocused = useIsFocused();

  useEffect(() => {
    return globalUploaderService.subscribe(setUploader);
  }, []);

  // ✅ load all videos once, show first 8
  useEffect(() => {
    const unsub = postsService.subscribeToPostType("video", (list) => {
      const arr = list as Post[];
      setAllVideos(arr);
      setVideos(arr.slice(0, PAGE_SIZE));
      pageRef.current = 1;
    });
    return unsub;
  }, []);

  const loadNextPage = () => {
    const start = pageRef.current * PAGE_SIZE;
    const next = allVideos.slice(start, start + PAGE_SIZE);
    if (next.length) {
      setVideos((prev) => [...prev, ...next]);
      pageRef.current += 1;
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems?.length) return;

    const first = viewableItems[0];
    const index = first.index ?? 0;
    const item = first.item as Post;

    setActiveIndex(index);

    if (item?.id && !viewedRef.current.has(item.id)) {
      viewedRef.current.add(item.id);
      videoService.incrementViewCount(item.id).catch(() => {});
    }

    if (index >= videos.length - 3) {
      loadNextPage();
    }
  }).current;

  // ✅ preload only next 2 videos (cache only)
  useEffect(() => {
    for (let i = 1; i <= PRELOAD_COUNT; i++) {
      const next = videos[activeIndex + i];
      const url = next?.media?.[0]?.url;
      if (next?.id && url) {
        videoCacheService.getCachedVideo(next.id, url).catch(() => {});
      }
    }
  }, [activeIndex, videos]);

  const openComments = (postId: string) => {
    setGlobalMute(true);
    setSelectedPostId(postId);
    setShowComments(true);
  };

  const renderItem = useCallback(
    ({ item, index }: { item: Post; index: number }) => {
      const shouldPreload =
        index === activeIndex ||
        index === activeIndex + 1 ||
        index === activeIndex - 1;

      return (
        <VideoCard
          post={item}
          pageHeight={pageHeight}
          shouldPreload={shouldPreload}
          isActive={index === activeIndex && isFocused && !showComments}
          isNext={index === activeIndex + 1}
          isPrev={index === activeIndex - 1}
          uploaderName={
            (item as any).uploaderName ||
            item.ownerName ||
            uploader?.name ||
            "Admin"
          }
          globalMute={globalMute}
          toggleGlobalMute={() => setGlobalMute((p) => !p)}
          onPressComments={() => openComments(item.id)}
        />
      );
    },
    [
      activeIndex,
      pageHeight,
      uploader?.name,
      globalMute,
      isFocused,
      showComments,
    ]
  );

  return (
    <View
      style={styles.container}
      onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToAlignment="start"
        decelerationRate="fast"
        removeClippedSubviews={false}
        windowSize={5}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        getItemLayout={(_, index) => ({
          length: pageHeight,
          offset: pageHeight * index,
          index,
        })}
        snapToInterval={pageHeight}
        disableIntervalMomentum
      />

      {showComments && (
        <CommentsPopup
          postId={selectedPostId}
          onClose={() => {
            setShowComments(false);
            setSelectedPostId(null);
          }}
        />
      )}
    </View>
  );
}

/* ---------------- VIDEO CARD ---------------- */

const VideoCard: React.FC<any> = ({
  post,
  pageHeight,
  isActive,
  isNext,
  isPrev,
  shouldPreload,
  uploaderName,
  onPressComments,
  globalMute,
  toggleGlobalMute,
}) => {
  const { user } = useAuth();
  const videoRef = useRef<Video | null>(null);
  const lastTapRef = useRef<number>(0);

  const [localUri, setLocalUri] = useState<string | null>(null);

  const [userPaused, setUserPaused] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);
  const [resizeMode, setResizeMode] = useState<"cover" | "contain">("cover");
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isVertical, setIsVertical] = useState(true);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  // ✅ load cached video only when active
  useEffect(() => {
    let alive = true;
    if (!isActive || !post.id || !post.media?.[0]?.url) return;

    videoCacheService
      .getCachedVideo(post.id, post.media[0].url)
      .then((path) => alive && setLocalUri(path))
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [isActive, post.id, post.media]);

  const videoUrl =
    localUri ||
    (isActive || isNext || isPrev ? post.media?.[0]?.url : undefined);

  useEffect(() => {
    if (!user || !post.id) return;
    postsService.isPostLikedByUser(post.id, user.uid).then(setIsLiked);
  }, [post.id, user]);

  useEffect(() => {
    if (!isActive) setUserPaused(false);
  }, [isActive]);

  const toggleLike = async () => {
    if (!user) return;
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((c) => c - 1);
      await postsService.unlikePost(post.id, user.uid);
    } else {
      setIsLiked(true);
      setLikeCount((c) => c + 1);
      await postsService.likePost(post.id, {
        userId: user.uid,
        name: user.fullName ?? "User",
      });
    }
  };

  const onVideoPress = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) toggleLike();
    else setUserPaused((p) => !p);
    lastTapRef.current = now;
  };

  const onPressShare = async () => {
    if (!user) return;
    await shareService.addShare({
      postId: post.id,
      type: "video",
      text: post.description,
      user,
    });
  };

  if (!shouldPreload) {
    return <View style={[styles.cardContainer, { height: pageHeight }]} />;
  }

  return (
    <View style={[styles.cardContainer, { height: pageHeight }]}>
      <View style={styles.videoWrapper}>
        <Video
          ref={videoRef}
          source={videoUrl ? { uri: videoUrl } : undefined}
          resizeMode={resizeMode}
          paused={!isActive || userPaused}
          repeat
          muted={globalMute || isNext || isPrev}
          controls={false}
          style={[
            styles.video,
            isVertical ? { height: "100%" } : null,
            aspectRatio ? { aspectRatio } : null,
          ]}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          automaticallyWaitsToMinimizeStalling={false}
          bufferConfig={{
            minBufferMs: 300,
            maxBufferMs: 1200,
            bufferForPlaybackMs: 150,
            bufferForPlaybackAfterRebufferMs: 300,
          }}
          onLoad={({ duration, naturalSize }) => {
            setDuration(duration || 1);
            if (naturalSize?.width && naturalSize?.height) {
              if (naturalSize.height > naturalSize.width) {
                setIsVertical(true);
                setResizeMode("cover");
                setAspectRatio(null);
              } else {
                setIsVertical(false);
                setResizeMode("contain");
                setAspectRatio(naturalSize.width / naturalSize.height);
              }
            }
          }}
          onProgress={({ currentTime }) => setProgress(currentTime / duration)}
        />

        <Pressable style={StyleSheet.absoluteFill} onPress={onVideoPress} />

        {userPaused && (
          <View style={styles.playOverlay}>
            <Ionicons name="play" size={64} color="#ffffffcc" />
          </View>
        )}

        <Pressable
          style={styles.progressBar}
          onPress={(e) => {
            if (!videoRef.current || !duration || progressBarWidth === 0)
              return;
            videoRef.current.seek(
              (e.nativeEvent.locationX / progressBarWidth) * duration
            );
          }}
          onLayout={(e) => setProgressBarWidth(e.nativeEvent.layout.width)}
        >
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </Pressable>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={28}
            color={isLiked ? "#ff4b67" : "#fff"}
          />
          <Text style={styles.actionLabel}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressComments} style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
          <Text style={styles.actionLabel}>{post.commentCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressShare} style={styles.actionButton}>
          <Ionicons name="share-outline" size={28} color="#fff" />
          <Text style={styles.actionLabel}>{post.shareCount ?? 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleGlobalMute}
          style={styles.actionButton}
        >
          <Ionicons
            name={globalMute ? "volume-mute" : "volume-high"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.uploaderText}>@{uploaderName}</Text>
        {post.title && (
          <>
            <Text
              numberOfLines={showFullDesc ? undefined : 3}
              style={styles.captionText}
            >
              {post.title}
            </Text>
            {post.title.length > 70 && (
              <Text
                onPress={() => setShowFullDesc((s) => !s)}
                style={styles.moreText}
              >
                {showFullDesc ? "Less" : "More"}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  cardContainer: { width: "100%", backgroundColor: "#000" },
  videoWrapper: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: { width: "100%", backgroundColor: "#000" },
  playOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: "rgba(255,255,255,0)",
    justifyContent: "center",
  },
  progressFill: { height: 3, backgroundColor: "#00C6FF" },
  actionsContainer: {
    position: "absolute",
    right: 16,
    bottom: 75,
    alignItems: "center",
  },
  actionButton: { alignItems: "center", marginBottom: 20 },
  actionLabel: { color: "#fff", fontSize: 12, marginTop: 4 },
  bottomContainer: {
    position: "absolute",
    left: 16,
    right: 120,
    bottom: 32,
  },
  uploaderText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  captionText: { color: "#fff", fontSize: 14, marginTop: 4 },
  moreText: { color: "#00C6FF", marginTop: 4, fontWeight: "800" },
});
