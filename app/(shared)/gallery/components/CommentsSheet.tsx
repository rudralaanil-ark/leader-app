// // app/components/gallery/CommentsSheet.tsx
// import { auth, db } from "@/configs/FirebaseConfig";
// import Colors from "@/data/Colors";
// import { doc, getDoc } from "firebase/firestore";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   FlatList,
//   Image,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { commentsService } from "../../services/commentsService";

// /**
//  * CommentsSheet UI:
//  * - subscribes to comments in real-time
//  * - groups top-level comments (parentId===null) and attaches replies (parentId != null)
//  * - only 2 levels: top -> replies (replies cannot have replies beyond this)
//  */

// export default function CommentsSheet({
//   visible,
//   onClose,
//   postId,
// }: {
//   visible: boolean;
//   onClose: () => void;
//   postId: string;
// }) {
//   const [flatComments, setFlatComments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [text, setText] = useState("");
//   const [replyTo, setReplyTo] = useState<any | null>(null);
//   const [currentUser, setCurrentUser] = useState<any | null>(null);
//   const unsubRef = useRef<() => void | null>(null);

//   useEffect(() => {
//     const u = auth.currentUser;
//     if (u) {
//       // try to load user role from users collection
//       (async () => {
//         try {
//           const uDoc = await getDoc(doc(db, "users", u.uid));
//           const data = uDoc.exists() ? uDoc.data() : null;
//           setCurrentUser({
//             uid: u.uid,
//             name: u.displayName ?? "User",
//             profileImage: (u as any).photoURL ?? null,
//             role: data?.role ?? "user",
//           });
//         } catch (e) {
//           setCurrentUser({
//             uid: u.uid,
//             name: u.displayName ?? "User",
//             profileImage: (u as any).photoURL ?? null,
//             role: "user",
//           });
//         }
//       })();
//     }
//   }, []);

//   useEffect(() => {
//     if (!visible || !postId) return;
//     setLoading(true);
//     const unsub = commentsService.subscribeToComments(postId, (arr) => {
//       setFlatComments(arr);
//       setLoading(false);
//     });
//     unsubRef.current = unsub;
//     return () => {
//       if (unsubRef.current) unsubRef.current();
//       unsubRef.current = null;
//     };
//   }, [visible, postId]);

//   // Build threaded structure (top-level + replies). Limit replies to one level.
//   const threaded = useMemo(() => {
//     const map: Record<string, any> = {};
//     const top: any[] = [];
//     for (const c of flatComments) {
//       map[c.id] = { ...c, replies: [] };
//     }
//     for (const c of flatComments) {
//       if (c.parentId) {
//         if (map[c.parentId]) {
//           // attach as reply to top-level only
//           map[c.parentId].replies.push(map[c.id]);
//         } else {
//           // orphan reply -> push as top-level fallback
//           top.push(map[c.id]);
//         }
//       } else {
//         top.push(map[c.id]);
//       }
//     }
//     return top;
//   }, [flatComments]);

//   const send = async () => {
//     const u = auth.currentUser;
//     if (!u || !postId) return;
//     if (!text.trim()) return;
//     try {
//       await commentsService.addComment({
//         postId,
//         userId: u.uid,
//         name: u.displayName ?? "User",
//         role: currentUser?.role ?? "user",
//         profileImage: (u as any).photoURL ?? null,
//         text: text.trim(),
//         parentId: replyTo ? replyTo.id : null,
//       });
//       setText("");
//       setReplyTo(null);
//     } catch (e) {
//       console.warn("CommentsSheet.send error", e);
//     }
//   };

//   const onReplyPress = (comment: any) => {
//     setReplyTo(comment);
//   };

//   const onDeletePress = async (commentId: string) => {
//     try {
//       await commentsService.deleteComment(postId, commentId);
//     } catch (e) {
//       console.warn("CommentsSheet.delete error", e);
//     }
//   };

//   const canDelete = (c: any) => {
//     if (!currentUser) return false;
//     if (currentUser.role === "admin" || currentUser.role === "monitor")
//       return true;
//     return currentUser.uid === c.userId;
//   };

//   const renderReply = ({ item }: { item: any }) => (
//     <View style={styles.replyRow}>
//       {item.profileImage ? (
//         <Image source={{ uri: item.profileImage }} style={styles.smallAvatar} />
//       ) : (
//         <View style={styles.smallAvatarPlaceholder} />
//       )}
//       <View style={{ flex: 1 }}>
//         <Text style={styles.commentName}>
//           {item.name} <Text style={styles.commentRole}>· {item.role}</Text>
//         </Text>
//         <Text style={styles.commentText}>{item.text}</Text>
//       </View>
//     </View>
//   );

//   const renderItem = ({ item }: { item: any }) => (
//     <View style={styles.commentBlock}>
//       <View style={styles.row}>
//         {item.profileImage ? (
//           <Image source={{ uri: item.profileImage }} style={styles.avatar} />
//         ) : (
//           <View style={styles.avatarPlaceholder} />
//         )}
//         <View style={{ flex: 1 }}>
//           <Text style={styles.commentName}>
//             {item.name} <Text style={styles.commentRole}>· {item.role}</Text>
//           </Text>
//           <Text style={styles.commentText}>{item.text}</Text>

//           <View style={styles.actionsRow}>
//             <TouchableOpacity onPress={() => onReplyPress(item)}>
//               <Text style={styles.actionText}>Reply</Text>
//             </TouchableOpacity>

//             {canDelete(item) ? (
//               <TouchableOpacity onPress={() => onDeletePress(item.id)}>
//                 <Text
//                   style={[
//                     styles.actionText,
//                     { color: Colors.error, marginLeft: 14 },
//                   ]}
//                 >
//                   Delete
//                 </Text>
//               </TouchableOpacity>
//             ) : null}
//           </View>

//           {/* Replies (one level) */}
//           {item.replies?.length ? (
//             <View style={{ marginTop: 8 }}>
//               <FlatList
//                 data={item.replies}
//                 renderItem={renderReply}
//                 keyExtractor={(r: any) => r.id}
//               />
//             </View>
//           ) : null}
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.backdrop}>
//         <SafeAreaView style={styles.sheet}>
//           <View style={styles.sheetHeader}>
//             <Text style={styles.title}>Comments</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Text style={styles.close}>Close</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.listWrap}>
//             {loading ? (
//               <Text style={{ color: Colors.textSecondary, padding: 12 }}>
//                 Loading comments...
//               </Text>
//             ) : threaded.length === 0 ? (
//               <View style={{ padding: 18 }}>
//                 <Text style={{ color: Colors.textSecondary }}>
//                   Be the first to comment
//                 </Text>
//               </View>
//             ) : (
//               <FlatList
//                 data={threaded}
//                 renderItem={renderItem}
//                 keyExtractor={(i) => i.id}
//               />
//             )}
//           </View>

//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//           >
//             <View style={styles.inputRow}>
//               {replyTo ? (
//                 <View style={styles.replyingBar}>
//                   <Text style={{ color: Colors.textSecondary }}>
//                     Replying to {replyTo.name}
//                   </Text>
//                   <TouchableOpacity onPress={() => setReplyTo(null)}>
//                     <Text
//                       style={{
//                         color: Colors.primary,
//                         fontWeight: "700",
//                         marginLeft: 12,
//                       }}
//                     >
//                       Cancel
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               ) : null}

//               <View style={styles.inputWrap}>
//                 <TextInput
//                   value={text}
//                   onChangeText={setText}
//                   placeholder="Write a comment..."
//                   style={styles.input}
//                 />
//               </View>

//               <TouchableOpacity onPress={send} style={styles.sendBtn}>
//                 <Text style={{ color: Colors.buttonText, fontWeight: "700" }}>
//                   Send
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </SafeAreaView>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.28)",
//     justifyContent: "flex-end",
//   },
//   sheet: {
//     maxHeight: "85%",
//     backgroundColor: Colors.lightCard,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     // margin: "auto",
//   },
//   sheetHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 14,
//     borderBottomWidth: 1,
//     borderColor: Colors.border,
//   },
//   title: { fontWeight: "700", fontSize: 16, color: Colors.textPrimary },
//   close: { color: Colors.primary, fontWeight: "700" },
//   listWrap: { flex: 1, paddingHorizontal: 12 },

//   row: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 12 },
//   avatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     marginRight: 12,
//     backgroundColor: Colors.surface,
//   },
//   avatarPlaceholder: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     marginRight: 12,
//     backgroundColor: Colors.surface,
//   },
//   smallAvatar: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     marginRight: 8,
//     backgroundColor: Colors.surface,
//   },
//   smallAvatarPlaceholder: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     marginRight: 8,
//     backgroundColor: Colors.surface,
//   },

//   commentBlock: {
//     borderBottomWidth: 1,
//     borderColor: Colors.tagNew,
//     paddingVertical: 6,
//   },
//   commentName: { fontWeight: "700", color: Colors.textPrimary },
//   commentRole: { color: Colors.textSecondary, fontWeight: "600", fontSize: 12 },
//   commentText: { color: Colors.textPrimary, marginTop: 6 },

//   actionsRow: { flexDirection: "row", marginTop: 8 },
//   actionText: { color: Colors.primary, fontWeight: "600" },

//   replyRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     paddingVertical: 8,
//     paddingLeft: 44,
//   },
//   replyingBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderBottomWidth: 1,
//     borderColor: Colors.border,
//   },

//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//   },
//   inputWrap: { flex: 1, marginRight: 12 },
//   input: {
//     backgroundColor: Colors.surface,
//     borderRadius: 24,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     color: Colors.textPrimary,
//   },
//   sendBtn: {
//     backgroundColor: Colors.primary,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//   },
// });
// app/components/gallery/CommentsSheet.tsx
// SAFEST CommentsSheet Version — No merge logic, No iterator crash
// CommentsSheet.tsx — ANDROID SAFE VERSION

// // app/components/gallery/CommentsSheet.tsx
// import { auth } from "@/configs/FirebaseConfig";
// import Colors from "@/data/Colors";
// import { formatDistanceToNow } from "date-fns";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   FlatList,
//   Image,
//   Keyboard,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { commentsService } from "../../../services/commentsService";

// interface CommentItemType {
//   id: string;
//   userId: string;
//   userName: string;
//   role?: string;
//   profileImage?: string | null;
//   text: string;
//   parentId?: string | null;
//   createdAt?: any;
//   __source?: string;
// }

// export default function CommentsSheet({
//   visible,
//   onClose,
//   postId,
// }: {
//   visible: boolean;
//   onClose: () => void;
//   postId: string;
// }) {
//   const [text, setText] = useState("");
//   const [replyTo, setReplyTo] = useState<CommentItemType | null>(null);
//   const [comments, setComments] = useState<CommentItemType[]>([]);
//   const listRef = useRef<FlatList<CommentItemType> | null>(null);
//   const inputRef = useRef<TextInput | null>(null);

//   const user = auth.currentUser;

//   // Load once (existing comments) then subscribe
//   useEffect(() => {
//     if (!visible) return;

//     let mounted = true;

//     (async () => {
//       try {
//         // 1) one-time load from nested location (safe)
//         let once: CommentItemType[] = [];
//         if (typeof commentsService.getCommentsOnce === "function") {
//           once = (await commentsService.getCommentsOnce(postId)) || [];
//         }
//         if (!mounted) return;
//         setComments(Array.isArray(once) ? once : []);

//         // scroll to bottom after brief delay
//         setTimeout(() => {
//           listRef.current?.scrollToEnd?.({ animated: false });
//         }, 120);

//         // 2) subscribe merges nested+legacy internally (see service)
//         const unsub = commentsService.subscribeToComments(
//           postId,
//           (arr: any[]) => {
//             if (!mounted) return;
//             setComments(Array.isArray(arr) ? arr : []);
//             // ensure we keep the list scrolled to bottom if user near bottom
//             setTimeout(() => {
//               listRef.current?.scrollToEnd?.({ animated: true });
//             }, 120);
//           }
//         );

//         return () => {
//           mounted = false;
//           if (unsub) unsub();
//         };
//       } catch (e) {
//         console.warn("CommentsSheet.load error", e);
//       }
//     })();
//   }, [visible, postId]);

//   // Send comment
//   const send = async () => {
//     if (!text.trim() || !user) return;
//     try {
//       await commentsService.addComment({
//         postId,
//         userId: user.uid,
//         name: user.displayName ?? "User",
//         role: "user",
//         profileImage: (user as any)?.photoURL ?? null,
//         text: text.trim(),
//         parentId: replyTo ? replyTo.id : null,
//       });

//       setText("");
//       setReplyTo(null);

//       // dismiss keyboard on Android sometimes helps visual
//       if (Platform.OS === "android") Keyboard.dismiss();

//       // scroll after small delay
//       setTimeout(() => {
//         listRef.current?.scrollToEnd?.({ animated: true });
//       }, 200);
//     } catch (e) {
//       console.warn("CommentsSheet.send error", e);
//     }
//   };

//   const repliesFor = (id: string) => comments.filter((c) => c.parentId === id);

//   // If not visible render nothing (prevents keyboard issues)
//   if (!visible) return null;

//   return (
//     <Modal
//       visible={visible}
//       animationType="fade"
//       transparent
//       onRequestClose={onClose}
//     >
//       <SafeAreaView style={styles.modalOuter}>
//         {/* dark overlay */}
//         <View style={styles.overlay} />

//         {/* absolute sheet above bottom nav */}
//         <View style={styles.sheet}>
//           {/* header */}
//           <View style={styles.header}>
//             <Text style={styles.title}>Comments</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Text style={styles.close}>Close</Text>
//             </TouchableOpacity>
//           </View>

//           {/* list area */}
//           <View style={styles.listArea}>
//             <FlatList
//               ref={listRef}
//               data={comments.filter((c) => !c.parentId)}
//               keyExtractor={(i) => i.id}
//               renderItem={({ item }) => (
//                 <View style={styles.commentRow}>
//                   {item.profileImage ? (
//                     <Image
//                       source={{ uri: item.profileImage }}
//                       style={styles.avatar}
//                     />
//                   ) : (
//                     <View style={styles.avatarPlaceholder} />
//                   )}
//                   <View style={{ flex: 1 }}>
//                     <View style={styles.rowBetween}>
//                       <Text style={styles.name}>
//                         {item.userName}{" "}
//                         <Text style={styles.role}>· {item.role}</Text>
//                       </Text>
//                       <Text style={styles.time}>
//                         {item.createdAt?.toDate
//                           ? formatDistanceToNow(item.createdAt.toDate(), {
//                               addSuffix: true,
//                             })
//                           : ""}
//                       </Text>
//                     </View>
//                     <Text style={styles.commentText}>{item.text}</Text>

//                     {/* small actions */}
//                     <View style={styles.actionsRow}>
//                       <TouchableOpacity onPress={() => setReplyTo(item)}>
//                         <Text style={styles.replyBtn}>Reply</Text>
//                       </TouchableOpacity>
//                     </View>

//                     {/* replies (one level) */}
//                     {repliesFor(item.id).map((r) => (
//                       <View key={r.id} style={styles.replyRow}>
//                         <Text style={styles.replyName}>
//                           {r.userName}{" "}
//                           <Text style={styles.role}>· {r.role}</Text>
//                         </Text>
//                         <Text style={styles.replyText}>{r.text}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 </View>
//               )}
//               keyboardShouldPersistTaps="handled"
//               contentContainerStyle={{ paddingBottom: 12 }}
//               showsVerticalScrollIndicator={false}
//               ListEmptyComponent={() => (
//                 <View style={{ padding: 18 }}>
//                   <Text style={{ color: Colors.textSecondary }}>
//                     No comments yet
//                   </Text>
//                 </View>
//               )}
//             />
//           </View>

//           {/* input — wrapped by KeyboardAvoidingView so it moves with keyboard */}
//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
//           >
//             {replyTo && (
//               <View style={styles.replyBar}>
//                 <Text style={styles.replying}>
//                   Replying to {replyTo.userName}
//                 </Text>
//                 <TouchableOpacity onPress={() => setReplyTo(null)}>
//                   <Text style={styles.cancelReply}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//             <View style={styles.inputRow}>
//               <TextInput
//                 ref={inputRef}
//                 value={text}
//                 onChangeText={setText}
//                 placeholder={
//                   replyTo
//                     ? `Reply to ${replyTo.userName}...`
//                     : "Add a comment..."
//                 }
//                 placeholderTextColor={Colors.textMuted}
//                 style={styles.input}
//                 returnKeyType="send"
//                 onSubmitEditing={send}
//                 blurOnSubmit={false}
//               />
//               <TouchableOpacity
//                 onPress={send}
//                 disabled={!text.trim()}
//                 style={[styles.sendBtn, { opacity: text.trim() ? 1 : 0.45 }]}
//               >
//                 <Text style={styles.sendText}>Send</Text>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </View>
//       </SafeAreaView>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   modalOuter: {
//     flex: 1,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.35)",
//   },

//   sheet: {
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//     maxHeight: "80%",
//     minHeight: 260,
//     backgroundColor: Colors.lightCard,
//     borderTopLeftRadius: 18,
//     borderTopRightRadius: 18,
//     overflow: "hidden",
//     // paddingBottom: 50,
//   },

//   header: {
//     padding: 14,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     borderBottomWidth: 1,
//     borderColor: Colors.border,
//   },

//   title: { fontSize: 18, fontWeight: "700", color: Colors.textPrimary },
//   close: { color: Colors.primary, fontWeight: "700" },

//   listArea: {
//     flex: 1,
//   },

//   commentRow: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderColor: Colors.tagNew,
//     flexDirection: "row",
//   },

//   avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
//   avatarPlaceholder: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//     backgroundColor: Colors.surface,
//   },

//   rowBetween: { flexDirection: "row", justifyContent: "space-between" },
//   name: { fontWeight: "700", color: Colors.textPrimary },
//   role: { color: Colors.textSecondary, fontSize: 12 },
//   time: { color: Colors.textMuted, fontSize: 12 },

//   commentText: { marginTop: 6, color: Colors.textPrimary },

//   actionsRow: { flexDirection: "row", marginTop: 8 },
//   replyBtn: { color: Colors.primary, fontWeight: "600" },

//   replyRow: {
//     marginTop: 8,
//     marginLeft: 8,
//     paddingLeft: 10,
//     borderLeftWidth: 2,
//     borderLeftColor: Colors.surfaceDark,
//   },
//   replyName: { fontWeight: "700", color: Colors.textPrimary },
//   replyText: { color: Colors.textSecondary, marginTop: 4 },

//   replyBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//     backgroundColor: Colors.surface,
//   },

//   replying: { color: Colors.textPrimary },
//   cancelReply: { color: Colors.primary, fontWeight: "700" },

//   inputRow: {
//     flexDirection: "row",
//     padding: 12,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//     backgroundColor: Colors.lightCard,
//     alignItems: "center",
//   },
//   input: {
//     flex: 1,
//     backgroundColor: Colors.surface,
//     paddingHorizontal: 14,
//     paddingVertical: Platform.OS === "ios" ? 12 : 8,
//     borderRadius: 20,
//     color: Colors.textPrimary,
//   },
//   sendBtn: {
//     marginLeft: 10,
//     backgroundColor: Colors.primary,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//   },
//   sendText: { color: Colors.buttonText, fontWeight: "700" },
// });

// // app/components/gallery/CommentsSheet.tsx
// import { auth } from "@/configs/FirebaseConfig";
// import Colors from "@/data/Colors";
// import { formatDistanceToNow } from "date-fns";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   FlatList,
//   Image,
//   Keyboard,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { commentsService } from "../../../services/commentsService";

// interface CommentItemType {
//   id: string;
//   userId: string;
//   userName: string;
//   role?: string;
//   profileImage?: string | null;
//   text: string;
//   parentId?: string | null;
//   createdAt?: any;
//   __source?: string;
// }

// export default function CommentsSheet({
//   visible,
//   onClose,
//   postId,
// }: {
//   visible: boolean;
//   onClose: () => void;
//   postId: string;
// }) {
//   const [text, setText] = useState("");
//   const [replyTo, setReplyTo] = useState<CommentItemType | null>(null);
//   const [comments, setComments] = useState<CommentItemType[]>([]);
//   const listRef = useRef<FlatList<CommentItemType> | null>(null);
//   const inputRef = useRef<TextInput | null>(null);

//   const user = auth.currentUser;

//   // Load once (existing comments) then subscribe
//   useEffect(() => {
//     if (!visible) return;

//     let mounted = true;

//     (async () => {
//       try {
//         // 1) one-time load from nested location (safe)
//         let once: CommentItemType[] = [];
//         if (typeof commentsService.getCommentsOnce === "function") {
//           once = (await commentsService.getCommentsOnce(postId)) || [];
//         }
//         if (!mounted) return;
//         setComments(Array.isArray(once) ? once : []);

//         // scroll to bottom after brief delay
//         setTimeout(() => {
//           listRef.current?.scrollToEnd?.({ animated: false });
//         }, 120);

//         // 2) subscribe merges nested+legacy internally (see service)
//         const unsub = commentsService.subscribeToComments(
//           postId,
//           (arr: any[]) => {
//             if (!mounted) return;
//             setComments(Array.isArray(arr) ? arr : []);
//             // ensure we keep the list scrolled to bottom if user near bottom
//             setTimeout(() => {
//               listRef.current?.scrollToEnd?.({ animated: true });
//             }, 120);
//           }
//         );

//         return () => {
//           mounted = false;
//           if (unsub) unsub();
//         };
//       } catch (e) {
//         console.warn("CommentsSheet.load error", e);
//       }
//     })();
//   }, [visible, postId]);

//   // Send comment
//   const send = async () => {
//     if (!text.trim() || !user) return;
//     try {
//       await commentsService.addComment({
//         postId,
//         userId: user.uid,
//         name: user.displayName ?? "User",
//         role: "user",
//         profileImage: (user as any)?.photoURL ?? null,
//         text: text.trim(),
//         parentId: replyTo ? replyTo.id : null,
//       });

//       setText("");
//       setReplyTo(null);

//       // dismiss keyboard on Android sometimes helps visual
//       if (Platform.OS === "android") Keyboard.dismiss();

//       // scroll after small delay
//       setTimeout(() => {
//         listRef.current?.scrollToEnd?.({ animated: true });
//       }, 200);
//     } catch (e) {
//       console.warn("CommentsSheet.send error", e);
//     }
//   };

//   const repliesFor = (id: string) => comments.filter((c) => c.parentId === id);

//   // If not visible render nothing (prevents keyboard issues)
//   if (!visible) return null;

//   return (
//     <Modal
//       visible={visible}
//       animationType="fade"
//       transparent
//       onRequestClose={onClose}
//     >
//       <SafeAreaView style={styles.modalOuter}>
//         {/* dark overlay */}
//         <View style={styles.overlay} />

//         {/* KeyboardAvoidingView wraps the whole sheet */}
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : 5}
//           keyboardVerticalOffset={Platform.OS === "ios" ? 20 : -10}
//         >
//           {/* sheet anchored to bottom inside avoider */}
//           <View style={styles.sheet}>
//             {/* header */}
//             <View style={styles.header}>
//               <Text style={styles.title}>Comments</Text>
//               <TouchableOpacity onPress={onClose}>
//                 <Text style={styles.close}>Close</Text>
//               </TouchableOpacity>
//             </View>

//             {/* list area */}
//             <View style={styles.listArea}>
//               <FlatList
//                 ref={listRef}
//                 data={comments.filter((c) => !c.parentId)}
//                 keyExtractor={(i) => i.id}
//                 renderItem={({ item }) => (
//                   <View style={styles.commentRow}>
//                     {item.profileImage ? (
//                       <Image
//                         source={{ uri: item.profileImage }}
//                         style={styles.avatar}
//                       />
//                     ) : (
//                       <View style={styles.avatarPlaceholder} />
//                     )}
//                     <View style={{ flex: 1 }}>
//                       <View style={styles.rowBetween}>
//                         <Text style={styles.name}>
//                           {item.userName}{" "}
//                           <Text style={styles.role}>· {item.role}</Text>
//                         </Text>
//                         <Text style={styles.time}>
//                           {item.createdAt?.toDate
//                             ? formatDistanceToNow(item.createdAt.toDate(), {
//                                 addSuffix: true,
//                               })
//                             : ""}
//                         </Text>
//                       </View>
//                       <Text style={styles.commentText}>{item.text}</Text>

//                       {/* small actions */}
//                       <View style={styles.actionsRow}>
//                         <TouchableOpacity onPress={() => setReplyTo(item)}>
//                           <Text style={styles.replyBtn}>Reply</Text>
//                         </TouchableOpacity>
//                       </View>

//                       {/* replies (one level) */}
//                       {repliesFor(item.id).map((r) => (
//                         <View key={r.id} style={styles.replyRow}>
//                           <Text style={styles.replyName}>
//                             {r.userName}{" "}
//                             <Text style={styles.role}>· {r.role}</Text>
//                           </Text>
//                           <Text style={styles.replyText}>{r.text}</Text>
//                         </View>
//                       ))}
//                     </View>
//                   </View>
//                 )}
//                 keyboardShouldPersistTaps="handled"
//                 contentContainerStyle={{ paddingBottom: 12 }}
//                 showsVerticalScrollIndicator={false}
//                 ListEmptyComponent={() => (
//                   <View style={{ padding: 18 }}>
//                     <Text style={{ color: Colors.textSecondary }}>
//                       No comments yet
//                     </Text>
//                   </View>
//                 )}
//               />
//             </View>

//             {/* input / reply bar (now inside same sheet, no inner KAV) */}
//             {replyTo && (
//               <View style={styles.replyBar}>
//                 <Text style={styles.replying}>
//                   Replying to {replyTo.userName}
//                 </Text>
//                 <TouchableOpacity onPress={() => setReplyTo(null)}>
//                   <Text style={styles.cancelReply}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//             <View style={styles.inputRow}>
//               <TextInput
//                 ref={inputRef}
//                 value={text}
//                 onChangeText={setText}
//                 placeholder={
//                   replyTo
//                     ? `Reply to ${replyTo.userName}...`
//                     : "Add a comment..."
//                 }
//                 placeholderTextColor={Colors.textMuted}
//                 style={styles.input}
//                 returnKeyType="send"
//                 onSubmitEditing={send}
//                 blurOnSubmit={false}
//               />
//               <TouchableOpacity
//                 onPress={send}
//                 disabled={!text.trim()}
//                 style={[styles.sendBtn, { opacity: text.trim() ? 1 : 0.45 }]}
//               >
//                 <Text style={styles.sendText}>Send</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   modalOuter: {
//     flex: 1,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.35)",
//   },

//   // NEW: wrapper that keeps sheet at bottom and cooperates with keyboard
//   keyboardAvoider: {
//     flex: 1,
//     justifyContent: "flex-end",
//   },

//   sheet: {
//     // no absolute positioning; let keyboardAvoider control the bottom
//     width: "100%",
//     maxHeight: "80%",
//     minHeight: 260,
//     backgroundColor: Colors.lightCard,
//     borderTopLeftRadius: 18,
//     borderTopRightRadius: 18,
//     overflow: "hidden",
//   },

//   header: {
//     padding: 14,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     borderBottomWidth: 1,
//     borderColor: Colors.border,
//   },

//   title: { fontSize: 18, fontWeight: "700", color: Colors.textPrimary },
//   close: { color: Colors.primary, fontWeight: "700" },

//   listArea: {
//     flex: 1,
//   },

//   commentRow: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderColor: Colors.tagNew,
//     flexDirection: "row",
//   },

//   avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
//   avatarPlaceholder: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//     backgroundColor: Colors.surface,
//   },

//   rowBetween: { flexDirection: "row", justifyContent: "space-between" },
//   name: { fontWeight: "700", color: Colors.textPrimary },
//   role: { color: Colors.textSecondary, fontSize: 12 },
//   time: { color: Colors.textMuted, fontSize: 12 },

//   commentText: { marginTop: 6, color: Colors.textPrimary },

//   actionsRow: { flexDirection: "row", marginTop: 8 },
//   replyBtn: { color: Colors.primary, fontWeight: "600" },

//   replyRow: {
//     marginTop: 8,
//     marginLeft: 8,
//     paddingLeft: 10,
//     borderLeftWidth: 2,
//     borderLeftColor: Colors.surfaceDark,
//   },
//   replyName: { fontWeight: "700", color: Colors.textPrimary },
//   replyText: { color: Colors.textSecondary, marginTop: 4 },

//   replyBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//     backgroundColor: Colors.surface,
//   },

//   replying: { color: Colors.textPrimary },
//   cancelReply: { color: Colors.primary, fontWeight: "700" },

//   inputRow: {
//     flexDirection: "row",
//     padding: 12,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//     backgroundColor: Colors.lightCard,
//     alignItems: "center",
//   },
//   input: {
//     flex: 1,
//     backgroundColor: Colors.surface,
//     paddingHorizontal: 14,
//     paddingVertical: Platform.OS === "ios" ? 12 : 8,
//     borderRadius: 20,
//     color: Colors.textPrimary,
//   },
//   sendBtn: {
//     marginLeft: 10,
//     backgroundColor: Colors.primary,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//   },
//   sendText: { color: Colors.buttonText, fontWeight: "700" },
// });

// app/components/gallery/CommentsSheet.tsx
import { auth } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { commentsService } from "../../../services/commentsService";

interface CommentItemType {
  id: string;
  userId: string;
  userName: string;
  role?: string;
  profileImage?: string | null;
  text: string;
  parentId?: string | null;
  createdAt?: any;
  __source?: string;
}

export default function CommentsSheet({
  visible,
  onClose,
  postId,
}: {
  visible: boolean;
  onClose: () => void;
  postId: string;
}) {
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<CommentItemType | null>(null);
  const [comments, setComments] = useState<CommentItemType[]>([]);
  const listRef = useRef<FlatList<CommentItemType> | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  const user = auth.currentUser;

  // Load once (existing comments) then subscribe
  useEffect(() => {
    if (!visible) return;

    let mounted = true;

    (async () => {
      try {
        let once: CommentItemType[] = [];
        if (typeof commentsService.getCommentsOnce === "function") {
          once = (await commentsService.getCommentsOnce(postId)) || [];
        }
        if (!mounted) return;
        setComments(Array.isArray(once) ? once : []);

        // scroll to bottom after brief delay
        setTimeout(() => {
          listRef.current?.scrollToEnd?.({ animated: false });
        }, 120);

        const unsub = commentsService.subscribeToComments(
          postId,
          (arr: any[]) => {
            if (!mounted) return;
            setComments(Array.isArray(arr) ? arr : []);
            setTimeout(() => {
              listRef.current?.scrollToEnd?.({ animated: true });
            }, 120);
          }
        );

        return () => {
          mounted = false;
          if (unsub) unsub();
        };
      } catch (e) {
        console.warn("CommentsSheet.load error", e);
      }
    })();
  }, [visible, postId]);

  // Send comment
  const send = async () => {
    if (!text.trim() || !user) return;
    try {
      await commentsService.addComment({
        postId,
        userId: user.uid,
        name: user.displayName ?? "User",
        role: "user",
        profileImage: (user as any)?.photoURL ?? null,
        text: text.trim(),
        parentId: replyTo ? replyTo.id : null,
      });

      setText("");
      setReplyTo(null);

      if (Platform.OS === "android") Keyboard.dismiss();

      setTimeout(() => {
        listRef.current?.scrollToEnd?.({ animated: true });
      }, 200);
    } catch (e) {
      console.warn("CommentsSheet.send error", e);
    }
  };

  const repliesFor = (id: string) => comments.filter((c) => c.parentId === id);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOuter}>
        {/* dark background */}
        <View style={styles.overlay} />

        {/* Bottom anchored fixed sheet */}
        <View style={styles.bottomSheetContainer}>
          {/* Sheet */}
          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Comments</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.close}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Comments list */}
            <FlatList
              ref={listRef}
              data={comments.filter((c) => !c.parentId)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentRow}>
                  <Image
                    source={{ uri: item.profileImage }}
                    style={styles.avatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.userName}</Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <TouchableOpacity onPress={() => setReplyTo(item)}>
                      <Text style={styles.replyBtn}>Reply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 10 }}
            />

            {/* Reply Bar */}
            {replyTo && (
              <View style={styles.replyBar}>
                <Text style={styles.replying}>
                  Replying to {replyTo.userName}
                </Text>
                <TouchableOpacity onPress={() => setReplyTo(null)}>
                  <Text style={styles.cancelReply}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Input */}
            <View style={styles.inputRow}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Add a comment..."
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
                returnKeyType="send"
                onSubmitEditing={send}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                onPress={send}
                disabled={!text.trim()}
                style={[styles.sendBtn, { opacity: text.trim() ? 1 : 0.5 }]}
              >
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOuter: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  // 🔥 New: this pins the sheet to the bottom of the screen
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  bottomSheetContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  // you can keep this or remove, now unused
  keyboardAvoider: {
    flex: 1,
    justifyContent: "flex-end",
  },

  sheet: {
    width: "100%",
    maxHeight: "80%",
    minHeight: 260,
    backgroundColor: Colors.lightCard,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },

  header: {
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },

  title: { fontSize: 18, fontWeight: "700", color: Colors.textPrimary },
  close: { color: Colors.primary, fontWeight: "700" },

  listArea: {
    flex: 1,
  },

  commentRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: Colors.tagNew,
    flexDirection: "row",
  },

  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Colors.surface,
  },

  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontWeight: "700", color: Colors.textPrimary },
  role: { color: Colors.textSecondary, fontSize: 12 },
  time: { color: Colors.textMuted, fontSize: 12 },

  commentText: { marginTop: 6, color: Colors.textPrimary },

  actionsRow: { flexDirection: "row", marginTop: 8 },
  replyBtn: { color: Colors.primary, fontWeight: "600" },

  replyRow: {
    marginTop: 8,
    marginLeft: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: Colors.surfaceDark,
  },
  replyName: { fontWeight: "700", color: Colors.textPrimary },
  replyText: { color: Colors.textSecondary, marginTop: 4 },

  replyBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },

  replying: { color: Colors.textPrimary },
  cancelReply: { color: Colors.primary, fontWeight: "700" },

  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.lightCard,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    borderRadius: 20,
    color: Colors.textPrimary,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  sendText: { color: Colors.buttonText, fontWeight: "700" },
});
