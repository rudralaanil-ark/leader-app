import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "@/data/Colors";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostFooter from "./PostFooter";

export default function PostCard({ post, onPress }: any) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded((p) => !p);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.95}
      onPress={() => onPress(post)}
    >
      {/* HEADER */}
      <PostHeader
        userName={post.createdByName}
        userImage={post.createdByImage}
        createdAt={post.createdAt}
      />

      {/* DESCRIPTION */}
      {!!post.description && (
        <Text
          style={styles.description}
          numberOfLines={expanded ? undefined : 3}
        >
          {post.description}
        </Text>
      )}

      {/* SEE MORE / SEE LESS */}
      {post.description?.length > 120 && (
        <TouchableOpacity onPress={toggleExpand}>
          <Text style={styles.seeMore}>
            {expanded ? "See less" : "See more"}
          </Text>
        </TouchableOpacity>
      )}

      {/* MEDIA (single / multiple swipe) */}
      <PostMedia images={post.images} />

      {/* FOOTER (like/comment/share) */}
      <PostFooter postId={post.id} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.lightCard,
    marginBottom: 18,
    paddingBottom: 12,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  description: {
    color: Colors.textPrimary,
    paddingHorizontal: 14,
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
  },
  seeMore: {
    color: Colors.primary,
    paddingHorizontal: 14,
    marginTop: 4,
    fontWeight: "600",
  },
});

// // /app/(shared)/feed/PostCard.tsx
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   FlatList,
//   Animated,
//   Image,
//   Alert,
//   Platform,
// } from "react-native";
// import Colors from "@/data/Colors";
// import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
// import { auth, db } from "@/configs/FirebaseConfig";
// import LikeListModal from "../../components/gallery/LikeListModal";
// import CommentsSheet from "../../components/gallery/CommentsSheet";
// import { likesService } from "../../services/likesService";
// import { commentsService } from "../../services/commentsService";
// import { doc, onSnapshot } from "firebase/firestore";

// const { width } = Dimensions.get("window");
// const IMAGE_HEIGHT = 450; // uniform height as requested
// const DOT_SIZE = 8;

// type Props = {
//   post: any;
//   showOwnerRole?: boolean; // show role title
//   onEdit?: (postId: string) => void;
//   style?: any;
// };

// const PostCard: React.FC<Props> = ({
//   post: postProp,
//   showOwnerRole = true,
//   onEdit,
//   style,
// }) => {
//   const [post, setPost] = useState<any>(postProp);
//   const [liked, setLiked] = useState<boolean>(!!postProp?.liked);
//   const [likeCount, setLikeCount] = useState<number>(postProp?.likeCount ?? 0);
//   const [commentCount, setCommentCount] = useState<number>(
//     postProp?.commentCount ?? 0
//   );
//   const [activeIndex, setActiveIndex] = useState<number>(0);
//   const [likesModalOpen, setLikesModalOpen] = useState<boolean>(false);
//   const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
//   const [currentUserRole, setCurrentUserRole] = useState<
//     "admin" | "monitor" | "user"
//   >("user");
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);

//   // Animations
//   const heartScale = useRef(new Animated.Value(0)).current; // double-tap big heart
//   const countAnim = useRef(new Animated.Value(1)).current; // like count pop
//   const lastTap = useRef<number>(0);

//   // Subscribe to live post doc to capture server side changes (hybrid approach: each PostCard listens itself)
//   useEffect(() => {
//     if (!postProp?.id) return;
//     const postRef = doc(db, "posts", postProp.id);
//     const unsub = onSnapshot(
//       postRef,
//       (snap) => {
//         if (!snap.exists()) return;
//         const data = { id: snap.id, ...(snap.data() as any) };
//         setPost((prev: any) => ({ ...prev, ...data }));
//         setLikeCount(data.likeCount ?? 0);
//         setCommentCount(data.commentCount ?? 0);
//       },
//       (err) => {
//         console.warn("post doc listener error", err);
//       }
//     );
//     return () => unsub();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [postProp?.id]);

//   // subscribe to current user's like doc for this post
//   useEffect(() => {
//     const u = auth.currentUser;
//     if (!u || !postProp?.id) {
//       setCurrentUserId(null);
//       return;
//     }
//     setCurrentUserId(u.uid);
//     // fetch role from user claims or users collection if you store it — fallback to 'user'
//     // If you have AuthContext, replace with that.
//     // For now, try using displayName containing admin/monitor is NOT reliable — so default to 'user'
//     // You can set currentUserRole via your app's user store/context.
//     // For demo, keep 'user'. If you want me to fetch role, I can add code to fetch from /users/{uid}
//     setCurrentUserRole("user");

//     const likeDoc = doc(db, "posts", postProp.id, "likes", u.uid);
//     const unsubLike = onSnapshot(
//       likeDoc,
//       (lsnap) => {
//         setLiked(lsnap.exists());
//       },
//       () => {}
//     );

//     return () => unsubLike();
//   }, [postProp?.id]);

//   // handle optimistic toggle like
//   const toggleLike = useCallback(async () => {
//     const uid = currentUserId || (auth.currentUser && auth.currentUser.uid);
//     if (!uid) {
//       Alert.alert("Sign in required", "Please sign in to like posts.");
//       return;
//     }

//     // optimistic UI
//     const wasLiked = liked;
//     setLiked(!wasLiked);
//     setLikeCount((c) => (wasLiked ? Math.max(0, c - 1) : c + 1));
//     // play count animation
//     Animated.sequence([
//       Animated.timing(countAnim, {
//         toValue: 1.12,
//         duration: 120,
//         useNativeDriver: true,
//       }),
//       Animated.timing(countAnim, {
//         toValue: 1,
//         duration: 140,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     try {
//       const already = await likesService.hasUserLiked(postProp.id, uid);
//       if (already) {
//         await likesService.removeLike({ postId: postProp.id, userId: uid });
//       } else {
//         await likesService.addLike({
//           postId: postProp.id,
//           userId: uid,
//           userName: auth.currentUser?.displayName ?? "User",
//           userRole: currentUserRole,
//         });
//       }
//     } catch (e) {
//       console.warn("toggleLike failed", e);
//       // revert optimistic
//       setLiked(wasLiked);
//       setLikeCount((c) => (wasLiked ? c + 1 : Math.max(0, c - 1)));
//     }
//   }, [currentUserId, liked, postProp?.id, currentUserRole, countAnim]);

//   // double-tap handler
//   const onImageTap = useCallback(() => {
//     const now = Date.now();
//     if (now - lastTap.current < 300) {
//       // double tap detected
//       Animated.sequence([
//         Animated.spring(heartScale, {
//           toValue: 1.0,
//           friction: 6,
//           useNativeDriver: true,
//         }),
//         Animated.timing(heartScale, {
//           toValue: 0,
//           duration: 320,
//           useNativeDriver: true,
//         }),
//       ]).start();
//       // trigger like on double-tap
//       toggleLike();
//     }
//     lastTap.current = now;
//   }, [heartScale, toggleLike]);

//   // open likes modal (admin/monitor sees full list - but all users will see modal too)
//   const openLikes = useCallback(() => {
//     setLikesModalOpen(true);
//   }, []);

//   // open comments bottom sheet
//   const openComments = useCallback(() => {
//     setCommentsOpen(true);
//   }, []);

//   // render media item
//   const renderMediaItem = useCallback(
//     ({ item }: { item: any }) => {
//       // item expected { url, publicId, type? }
//       return (
//         <TouchableOpacity
//           activeOpacity={1}
//           onPress={onImageTap}
//           style={fixed.imageTouch}
//         >
//           <Image
//             source={{ uri: item?.url ?? item }}
//             style={[fixed.image, { height: IMAGE_HEIGHT }]}
//             resizeMode="cover"
//           />
//           <Animated.View
//             style={[fixed.heartWrap, { transform: [{ scale: heartScale }] }]}
//           >
//             <AntDesign
//               name="heart"
//               size={110}
//               color={Colors.error || "#FF3B30"}
//             />
//           </Animated.View>
//         </TouchableOpacity>
//       );
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     []
//   );

//   const media = useMemo(() => {
//     if (!post?.media) return [];
//     return Array.isArray(post.media) ? post.media : [post.media];
//   }, [post]);

//   // page dots
//   const renderDots = () => {
//     if (!media || media.length <= 1) return null;
//     return (
//       <View style={s.dotsWrap}>
//         {media.map((_, i) => {
//           const active = i === activeIndex;
//           return <View key={i} style={[s.dot, active ? s.dotActive : null]} />;
//         })}
//       </View>
//     );
//   };

//   // header actions (edit for admin/monitor)
//   const onEditPress = () => {
//     if (!onEdit) return;
//     onEdit(post?.id);
//   };

//   // ensure counts show consistent server state if parent updates postProp
//   useEffect(() => {
//     setLikeCount(postProp?.likeCount ?? likeCount);
//     setCommentCount(postProp?.commentCount ?? commentCount);
//     setLiked(!!postProp?.liked);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [postProp?.likeCount, postProp?.commentCount, postProp?.liked]);

//   return (
//     <View style={[s.cardWrapper, style]}>
//       {/* HEADER */}
//       <View style={s.header}>
//         <View style={s.headerLeft}>
//           <Image
//             source={{ uri: post?.ownerProfileImage || undefined }}
//             style={s.avatar}
//             resizeMode="cover"
//             defaultSource={require("@/assets/images/profile.png")}
//           />
//           <View style={{ marginLeft: 10 }}>
//             <Text style={s.ownerName}>{post?.ownerName ?? "User"}</Text>
//             {showOwnerRole && (
//               <Text style={s.roleText}>{post?.ownerRole ?? ""}</Text>
//             )}
//             {post?.createdAt && (
//               <Text style={s.timeText}>
//                 {/* format if you have date-fns */ ""}
//               </Text>
//             )}
//           </View>
//         </View>

//         <View style={s.headerRight}>
//           {(currentUserRole === "admin" || currentUserRole === "monitor") && (
//             <TouchableOpacity onPress={onEditPress} style={s.iconBtn}>
//               <Feather name="edit-2" size={18} color={Colors.textPrimary} />
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity onPress={() => {}} style={s.iconBtn}>
//             <Feather
//               name="more-vertical"
//               size={18}
//               color={Colors.textSecondary}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* MEDIA */}
//       <View style={s.mediaWrap}>
//         {media && media.length > 0 ? (
//           <FlatList
//             data={media}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={(m: any, i: number) => m.publicId ?? `${i}`}
//             renderItem={renderMediaItem}
//             onMomentumScrollEnd={(ev) => {
//               const offsetX = ev.nativeEvent.contentOffset.x;
//               const idx = Math.round(offsetX / width);
//               setActiveIndex(idx);
//             }}
//             style={{ width }}
//           />
//         ) : (
//           <View style={[fixed.placeholder, { height: IMAGE_HEIGHT }]} />
//         )}
//         {renderDots()}
//       </View>

//       {/* ACTIONS */}
//       <View style={s.actionRow}>
//         <TouchableOpacity onPress={toggleLike} style={s.actionBtn}>
//           <AntDesign
//             userName={liked ? "heart" : "hearto"}
//             size={24}
//             color={liked ? Colors.error : Colors.textPrimary}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={openComments} style={s.actionBtn}>
//           <Feather name="message-circle" size={24} color={Colors.textPrimary} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => Alert.alert("Share", "Share not implemented")}
//           style={s.actionBtn}
//         >
//           <Feather name="send" size={24} color={Colors.textPrimary} />
//         </TouchableOpacity>

//         <View style={{ flex: 1 }} />

//         <TouchableOpacity onPress={openLikes} style={{ paddingHorizontal: 8 }}>
//           <Animated.Text
//             style={[s.countText, { transform: [{ scale: countAnim }] }]}
//           >
//             {likeCount ?? 0} likes
//           </Animated.Text>
//         </TouchableOpacity>
//       </View>

//       {/* DESCRIPTION */}
//       {post?.description ? (
//         <View style={s.descWrap}>
//           <Text style={s.descText}>{post.description}</Text>
//         </View>
//       ) : null}

//       {/* Like List Modal */}
//       <LikeListModal
//         visible={likesModalOpen}
//         onClose={() => setLikesModalOpen(false)}
//         postId={post?.id}
//       />

//       {/* Comments bottom sheet */}
//       <CommentsSheet
//         visible={commentsOpen}
//         onClose={() => setCommentsOpen(false)}
//         postId={post?.id}
//       />
//     </View>
//   );
// };

// export default PostCard;

// /* ===========================
//    Styles (kept after component)
//    =========================== */

// const s = StyleSheet.create({
//   cardWrapper: {
//     marginBottom: 16,
//     borderRadius: 12,
//     overflow: "hidden",
//     backgroundColor: Colors.lightCard,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },

//   header: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },

//   headerRight: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   avatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: Colors.surface,
//   },

//   ownerName: {
//     fontWeight: "700",
//     color: Colors.textPrimary,
//     fontSize: 15,
//   },

//   roleText: {
//     color: Colors.textSecondary,
//     fontSize: 12,
//     marginTop: 2,
//   },

//   timeText: {
//     color: Colors.textMuted,
//     fontSize: 11,
//     marginTop: 2,
//   },

//   iconBtn: {
//     paddingHorizontal: 8,
//   },

//   mediaWrap: {
//     width,
//     height: IMAGE_HEIGHT,
//     backgroundColor: "#000",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   dotsWrap: {
//     position: "absolute",
//     bottom: 12,
//     alignSelf: "center",
//     flexDirection: "row",
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 16,
//     backgroundColor: "rgba(0,0,0,0.28)",
//   },

//   dot: {
//     width: DOT_SIZE,
//     height: DOT_SIZE,
//     borderRadius: DOT_SIZE / 2,
//     backgroundColor: "rgba(255,255,255,0.45)",
//     marginHorizontal: 5,
//   },

//   dotActive: {
//     backgroundColor: "#fff",
//     width: DOT_SIZE + 4,
//     height: DOT_SIZE + 4,
//     borderRadius: (DOT_SIZE + 4) / 2,
//   },

//   actionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },

//   actionBtn: {
//     marginRight: 10,
//   },

//   countText: {
//     color: Colors.textSecondary,
//     fontWeight: "700",
//   },

//   descWrap: {
//     paddingHorizontal: 12,
//     paddingBottom: 12,
//   },

//   descText: {
//     color: Colors.textPrimary,
//   },
// });

// /* fixed styles used by media item */
// const fixed = StyleSheet.create({
//   imageTouch: {
//     width,
//     height: IMAGE_HEIGHT,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   image: {
//     width,
//     height: IMAGE_HEIGHT,
//   },

//   placeholder: {
//     width,
//     height: IMAGE_HEIGHT,
//     backgroundColor: Colors.surface,
//   },

//   heartWrap: {
//     position: "absolute",
//     top: "38%",
//     left: "38%",
//     opacity: 0.98,
//   },
// });
