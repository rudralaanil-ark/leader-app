// import {
//   ComplaintDoc,
//   complaintService,
//   ComplaintStatus,
// } from "@/app/services/complaintService";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   ImageBackground,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function ComplaintDetails() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { user } = useAuth();

//   const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);
//   const [replyText, setReplyText] = useState("");

//   const [showImageViewer, setShowImageViewer] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   const scrollRef = useRef<ScrollView>(null);

//   const isAdminOrMonitor = user?.role === "admin" || user?.role === "monitor";

//   useEffect(() => {
//     if (!id) return;

//     const unsub = complaintService.subscribeToComplaint(String(id), (doc) => {
//       setComplaint(doc);

//       if (user?.uid !== doc?.userId) {
//         complaintService.markReadByAdmin(String(id));
//       } else {
//         complaintService.markRepliesAsReadByUser(String(id));
//       }

//       setTimeout(() => {
//         scrollRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     });

//     return () => unsub();
//   }, [id]);

//   if (!complaint) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color={Colors.primary} />
//       </View>
//     );
//   }

//   const created = complaint.createdAt?.toDate?.() ?? new Date();

//   const openImage = (url: string) => {
//     setSelectedImage(url);
//     setShowImageViewer(true);
//   };

//   const sendReply = async () => {
//     if (!replyText.trim() || !user) return;

//     await complaintService.addReply(String(id), {
//       message: replyText.trim(),
//       repliedBy: user.uid,
//       repliedByName: user.fullName,
//       role: user.role === "admin" ? "admin" : "monitor",
//       createdAt: new Date(),
//     });

//     setReplyText("");
//   };

//   const updateStatus = async (status: ComplaintStatus) => {
//     await complaintService.updateStatus(String(id), status);
//   };

//   return (
//     <>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           style={styles.container}
//           ref={scrollRef}
//           contentContainerStyle={{ paddingBottom: 120 }}
//         >
//           <Text style={styles.title}>{complaint.title}</Text>
//           <Text style={styles.meta}>Created: {created.toLocaleString()}</Text>

//           <Text style={styles.sectionLabel}>Description</Text>
//           <Text style={styles.description}>{complaint.description}</Text>

//           <Text style={styles.sectionLabel}>Status</Text>
//           <Text style={styles.statusText}>{complaint.status}</Text>

//           {/*---------------- MEDIA ----------------*/}
//           {complaint.media?.length > 0 && (
//             <>
//               <Text style={styles.sectionLabel}>Attachments</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {complaint.media.map((m, i) => (
//                   <Pressable key={i} onPress={() => openImage(m.url)}>
//                     <ImageBackground
//                       source={{ uri: m.url }}
//                       style={styles.mediaThumb}
//                       imageStyle={{ borderRadius: 10 }}
//                       resizeMode="cover"
//                     />
//                   </Pressable>
//                 ))}
//               </ScrollView>
//             </>
//           )}

//           {/*---------------- CHAT REPLIES ----------------*/}
//           <Text style={styles.sectionLabel}>Conversation</Text>
//           {complaint.replies?.length === 0 ? (
//             <Text style={styles.emptyMsg}>No messages yet</Text>
//           ) : (
//             complaint.replies.map((r) => (
//               <View
//                 key={r.id}
//                 style={[
//                   styles.chatBubble,
//                   r.repliedBy === user?.uid
//                     ? styles.chatRight
//                     : styles.chatLeft,
//                 ]}
//               >
//                 <Text style={styles.chatMessage}>{r.message}</Text>
//                 <Text style={styles.chatMeta}>
//                   {r.repliedByName} ({r.role})
//                 </Text>
//               </View>
//             ))
//           )}

//           <View style={{ height: 20 }} />
//         </ScrollView>

//         {/*---------------- ADMIN/MONITOR STATUS ACTIONS ----------------*/}
//         {isAdminOrMonitor && (
//           <View style={styles.adminPanel}>
//             <Pressable
//               style={[styles.statusBtn, { backgroundColor: Colors.info }]}
//               onPress={() => updateStatus("in_progress")}
//             >
//               <Text style={styles.statusBtnText}>In-Progress</Text>
//             </Pressable>

//             <Pressable
//               style={[styles.statusBtn, { backgroundColor: Colors.warning }]}
//               onPress={() => updateStatus("need_info")}
//             >
//               <Text style={styles.statusBtnText}>Need Info</Text>
//             </Pressable>

//             <Pressable
//               style={[styles.statusBtn, { backgroundColor: Colors.success }]}
//               onPress={() => updateStatus("resolved")}
//             >
//               <Text style={styles.statusBtnText}>Resolve</Text>
//             </Pressable>
//           </View>
//         )}

//         {/*---------------- REPLY BOX ----------------*/}
//         <View style={styles.replyBox}>
//           <TextInput
//             style={styles.replyInput}
//             placeholder="Type a message..."
//             placeholderTextColor={Colors.textMuted}
//             value={replyText}
//             onChangeText={setReplyText}
//           />
//           <Pressable style={styles.sendBtn} onPress={sendReply}>
//             <Text style={styles.sendBtnText}>Send</Text>
//           </Pressable>
//         </View>
//       </KeyboardAvoidingView>

//       {/*---------------- IMAGE POPUP VIEWER ----------------*/}
//       <Modal
//         visible={showImageViewer}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowImageViewer(false)}
//       >
//         <TouchableOpacity
//           activeOpacity={1}
//           style={styles.modalOverlay}
//           onPress={() => setShowImageViewer(false)}
//         >
//           {selectedImage && (
//             <View style={styles.popupCard}>
//               <ImageBackground
//                 source={{ uri: selectedImage }}
//                 style={styles.popupImage}
//                 resizeMode="contain"
//               />
//             </View>
//           )}
//         </TouchableOpacity>
//       </Modal>
//     </>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     padding: 16,
//   },
//   center: { flex: 1, justifyContent: "center" },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//     marginBottom: 8,
//   },
//   meta: { fontSize: 12, color: Colors.textMuted, marginBottom: 8 },
//   sectionLabel: {
//     fontSize: 14,
//     fontWeight: "700",
//     marginTop: 16,
//     marginBottom: 6,
//     color: Colors.textPrimary,
//   },
//   description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
//   statusText: {
//     backgroundColor: Colors.surfaceDark,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     fontSize: 13,
//     color: Colors.textPrimary,
//     alignSelf: "flex-start",
//   },
//   mediaThumb: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     marginRight: 10,
//     backgroundColor: Colors.surfaceDark,
//   },
//   emptyMsg: {
//     fontSize: 13,
//     color: Colors.textMuted,
//     marginTop: 4,
//   },
//   chatBubble: {
//     maxWidth: "80%",
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 4,
//   },
//   chatLeft: {
//     alignSelf: "flex-start",
//     backgroundColor: Colors.surfaceDark,
//   },
//   chatRight: {
//     alignSelf: "flex-end",
//     backgroundColor: Colors.primary,
//   },
//   chatMessage: { fontSize: 14, color: Colors.textInverse },
//   chatMeta: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },
//   adminPanel: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: Colors.surface,
//     padding: 8,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//   },
//   statusBtn: {
//     flex: 1,
//     marginHorizontal: 4,
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   statusBtnText: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: Colors.textInverse,
//   },
//   replyBox: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     padding: 10,
//     backgroundColor: Colors.card,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//   },
//   replyInput: {
//     flex: 1,
//     backgroundColor: Colors.surfaceDark,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     color: Colors.textPrimary,
//   },
//   sendBtn: {
//     marginLeft: 8,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     justifyContent: "center",
//   },
//   sendBtnText: {
//     color: Colors.textInverse,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   popupCard: {
//     width: "80%",
//     height: "65%",
//     backgroundColor: Colors.card,
//     borderRadius: 18,
//     overflow: "hidden",
//     elevation: 12,
//   },
//   popupImage: { width: "100%", height: "100%" },
// });

// import {
//   ComplaintDoc,
//   complaintService,
//   ComplaintStatus,
// } from "@/app/services/complaintService";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import { useLocalSearchParams } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   ImageBackground,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function ComplaintDetails() {
//   const { id } = useLocalSearchParams();
//   const { user } = useAuth();

//   const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);
//   const [replyText, setReplyText] = useState("");

//   const [showImageViewer, setShowImageViewer] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   const scrollRef = useRef<ScrollView>(null);

//   const isAdminOrMonitor = user?.role === "admin" || user?.role === "monitor";

//   useEffect(() => {
//     if (!id) return;

//     const unsub = complaintService.subscribeToComplaint(
//       String(id),
//       async (doc) => {
//         setComplaint(doc);

//         // If complaint is deleted or not found, nothing else to do
//         if (!doc || !user) return;

//         // Mark read states safely based on role
//         if (user.uid === doc.userId) {
//           // 👉 Owner viewing – mark user side as read
//           try {
//             // If your service still has markRepliesAsReadByUser, use that instead:
//             // await complaintService.markRepliesAsReadByUser(String(id));
//             await complaintService.markReadByUser(String(id));
//           } catch (err) {
//             console.log("markReadByUser error", err);
//           }
//         } else if (user.role === "admin" || user.role === "monitor") {
//           // 👉 Admin / Monitor viewing – mark admin read
//           try {
//             await complaintService.markReadByAdmin(String(id));
//           } catch (err) {
//             console.log("markReadByAdmin error", err);
//           }
//         }

//         // Scroll to bottom of conversation
//         setTimeout(() => {
//           scrollRef.current?.scrollToEnd({ animated: true });
//         }, 100);
//       }
//     );

//     return () => unsub();
//   }, [id, user?.uid, user?.role]);

//   if (!complaint) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color={Colors.primary} />
//       </View>
//     );
//   }

//   const created = complaint.createdAt?.toDate?.() ?? new Date();

//   const openImage = (url: string) => {
//     setSelectedImage(url);
//     setShowImageViewer(true);
//   };

//   const sendReply = async () => {
//     if (!replyText.trim() || !user) return;

//     // Decide reply role for display
//     let replyRole: "admin" | "monitor" | "user" = "user";
//     if (user.role === "admin") replyRole = "admin";
//     else if (user.role === "monitor") replyRole = "monitor";

//     try {
//       await complaintService.addReply(String(id), {
//         message: replyText.trim(),
//         repliedBy: user.uid,
//         repliedByName: user.fullName,
//         role: replyRole,
//         createdAt: new Date(),
//       });

//       setReplyText("");
//       setTimeout(() => {
//         scrollRef.current?.scrollToEnd({ animated: true });
//       }, 150);
//     } catch (err) {
//       console.log("sendReply error", err);
//     }
//   };

//   const updateStatus = async (status: ComplaintStatus) => {
//     try {
//       await complaintService.updateStatus(String(id), status);
//     } catch (err) {
//       console.log("updateStatus error", err);
//     }
//   };

//   return (
//     <>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           style={styles.container}
//           ref={scrollRef}
//           contentContainerStyle={{ paddingBottom: 120 }}
//         >
//           <Text style={styles.title}>{complaint.title}</Text>
//           <Text style={styles.meta}>Created: {created.toLocaleString()}</Text>

//           <Text style={styles.sectionLabel}>Description</Text>
//           <Text style={styles.description}>{complaint.description}</Text>

//           <Text style={styles.sectionLabel}>Status</Text>
//           <Text style={styles.statusText}>{complaint.status}</Text>

//           {/* Attachments */}
//           {complaint.media?.length > 0 && (
//             <>
//               <Text style={styles.sectionLabel}>Attachments</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {complaint.media.map((m, i) => (
//                   <Pressable key={i} onPress={() => openImage(m.url)}>
//                     <ImageBackground
//                       source={{ uri: m.url }}
//                       style={styles.mediaThumb}
//                       imageStyle={{ borderRadius: 10 }}
//                       resizeMode="cover"
//                     />
//                   </Pressable>
//                 ))}
//               </ScrollView>
//             </>
//           )}

//           {/* Conversation */}
//           <Text style={styles.sectionLabel}>Conversation</Text>
//           {!complaint.replies || complaint.replies.length === 0 ? (
//             <Text style={styles.emptyMsg}>No messages yet</Text>
//           ) : (
//             complaint.replies.map((r) => {
//               const isMine = r.repliedBy === user?.uid;
//               return (
//                 <View
//                   key={r.id}
//                   style={[
//                     styles.chatBubble,
//                     isMine ? styles.chatRight : styles.chatLeft,
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.chatMessage,
//                       !isMine && { color: Colors.textPrimary },
//                     ]}
//                   >
//                     {r.message}
//                   </Text>
//                   <Text style={styles.chatMeta}>
//                     {r.repliedByName} ({r.role})
//                   </Text>
//                 </View>
//               );
//             })
//           )}

//           <View style={{ height: 20 }} />
//         </ScrollView>

//         {/* Admin / Monitor Status Buttons */}
//         {isAdminOrMonitor && (
//           <View style={styles.adminPanel}>
//             <Pressable
//               style={[styles.statusBtn, { backgroundColor: Colors.info }]}
//               onPress={() => updateStatus("in_progress")}
//             >
//               <Text style={styles.statusBtnText}>In-Progress</Text>
//             </Pressable>

//             <Pressable
//               style={[styles.statusBtn, { backgroundColor: Colors.warning }]}
//               onPress={() => updateStatus("need_info")}
//             >
//               <Text style={styles.statusBtnText}>Need Info</Text>
//             </Pressable>

//             <Pressable
//               style={[styles.statusBtn, { backgroundColor: Colors.success }]}
//               onPress={() => updateStatus("resolved")}
//             >
//               <Text style={styles.statusBtnText}>Resolve</Text>
//             </Pressable>
//           </View>
//         )}

//         {/* Reply Box (all roles can reply in chat-mode) */}
//         <View style={styles.replyBox}>
//           <TextInput
//             style={styles.replyInput}
//             placeholder="Type a message..."
//             placeholderTextColor={Colors.textMuted}
//             value={replyText}
//             onChangeText={setReplyText}
//           />
//           <Pressable style={styles.sendBtn} onPress={sendReply}>
//             <Text style={styles.sendBtnText}>Send</Text>
//           </Pressable>
//         </View>
//       </KeyboardAvoidingView>

//       {/* Image Viewer Modal */}
//       <Modal
//         visible={showImageViewer}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowImageViewer(false)}
//       >
//         <TouchableOpacity
//           activeOpacity={1}
//           style={styles.modalOverlay}
//           onPress={() => setShowImageViewer(false)}
//         >
//           {selectedImage && (
//             <View style={styles.popupCard}>
//               <ImageBackground
//                 source={{ uri: selectedImage }}
//                 style={styles.popupImage}
//                 resizeMode="contain"
//               />
//             </View>
//           )}
//         </TouchableOpacity>
//       </Modal>
//     </>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     padding: 16,
//   },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//     marginBottom: 8,
//   },
//   meta: { fontSize: 12, color: Colors.textMuted, marginBottom: 8 },
//   sectionLabel: {
//     fontSize: 14,
//     fontWeight: "700",
//     marginTop: 16,
//     marginBottom: 6,
//     color: Colors.textPrimary,
//   },
//   description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
//   statusText: {
//     backgroundColor: Colors.surfaceDark,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     fontSize: 13,
//     color: Colors.textPrimary,
//     alignSelf: "flex-start",
//   },
//   mediaThumb: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     marginRight: 10,
//     backgroundColor: Colors.surfaceDark,
//   },
//   emptyMsg: {
//     fontSize: 13,
//     color: Colors.textMuted,
//     marginTop: 4,
//   },
//   chatBubble: {
//     maxWidth: "80%",
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 4,
//   },
//   chatLeft: {
//     alignSelf: "flex-start",
//     backgroundColor: Colors.surfaceDark,
//   },
//   chatRight: {
//     alignSelf: "flex-end",
//     backgroundColor: Colors.primary,
//   },
//   chatMessage: {
//     fontSize: 14,
//     color: Colors.textInverse,
//   },
//   chatMeta: {
//     fontSize: 10,
//     color: Colors.textMuted,
//     marginTop: 4,
//   },
//   adminPanel: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: Colors.surface,
//     padding: 8,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//   },
//   statusBtn: {
//     flex: 1,
//     marginHorizontal: 4,
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   statusBtnText: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: Colors.textInverse,
//   },
//   replyBox: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     padding: 10,
//     backgroundColor: Colors.card,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//   },
//   replyInput: {
//     flex: 1,
//     backgroundColor: Colors.surfaceDark,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     color: Colors.textPrimary,
//   },
//   sendBtn: {
//     marginLeft: 8,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     justifyContent: "center",
//   },
//   sendBtnText: {
//     color: Colors.textInverse,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   popupCard: {
//     width: "80%",
//     height: "65%",
//     backgroundColor: Colors.card,
//     borderRadius: 18,
//     overflow: "hidden",
//     elevation: 12,
//   },
//   popupImage: { width: "100%", height: "100%" },
// });

import {
  ComplaintDoc,
  complaintService,
  ComplaintStatus,
} from "@/app/services/complaintService";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ComplaintDetails() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);
  const [replyText, setReplyText] = useState("");

  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);

  const isAdminOrMonitor = user?.role === "admin" || user?.role === "monitor";

  // --- NEW: track keyboard height and visibility to position reply bar precisely
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  useEffect(() => {
    const onShow = (e: any) => {
      // e.endCoordinates.height is the keyboard height
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
      // scroll to bottom so latest message is visible above keyboard
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    };
    const onHide = () => {
      setKeyboardHeight(0);
    };

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    const unsub = complaintService.subscribeToComplaint(
      String(id),
      async (doc) => {
        setComplaint(doc);

        if (!doc || !user) return;

        if (user.uid === doc.userId) {
          try {
            await complaintService.markReadByUser(String(id));
          } catch (err) {
            console.log("markReadByUser error", err);
          }
        } else if (user.role === "admin" || user.role === "monitor") {
          try {
            await complaintService.markReadByAdmin(String(id));
          } catch (err) {
            console.log("markReadByAdmin error", err);
          }
        }

        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => unsub();
  }, [id, user?.uid, user?.role]);

  if (!complaint) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  const created = complaint.createdAt?.toDate?.() ?? new Date();

  const openImage = (url: string) => {
    setSelectedImage(url);
    setShowImageViewer(true);
  };

  const sendReply = async () => {
    if (!replyText.trim() || !user) return;

    let replyRole: "admin" | "monitor" | "user" = "user";
    if (user.role === "admin") replyRole = "admin";
    else if (user.role === "monitor") replyRole = "monitor";

    try {
      await complaintService.addReply(String(id), {
        message: replyText.trim(),
        repliedBy: user.uid,
        repliedByName: user.fullName,
        role: replyRole,
        createdAt: new Date(),
      });

      setReplyText("");
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 150);
    } catch (err) {
      console.log("sendReply error", err);
    }
  };

  const updateStatus = async (status: ComplaintStatus) => {
    try {
      await complaintService.updateStatus(String(id), status);
    } catch (err) {
      console.log("updateStatus error", err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ScrollView (no KeyboardAvoidingView) — we manage keyboard manually */}
      <ScrollView
        style={styles.container}
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 + keyboardHeight }}
      >
        <Text style={styles.title}>{complaint.title}</Text>
        <Text style={styles.meta}>Created: {created.toLocaleString()}</Text>

        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{complaint.description}</Text>

        <Text style={styles.sectionLabel}>Status</Text>
        <Text style={styles.statusText}>{complaint.status}</Text>

        {complaint.media?.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Attachments</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {complaint.media.map((m, i) => (
                <Pressable key={i} onPress={() => openImage(m.url)}>
                  <ImageBackground
                    source={{ uri: m.url }}
                    style={styles.mediaThumb}
                    imageStyle={{ borderRadius: 10 }}
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        <Text style={styles.sectionLabel}>Conversation</Text>
        {!complaint.replies || complaint.replies.length === 0 ? (
          <Text style={styles.emptyMsg}>No messages yet</Text>
        ) : (
          complaint.replies.map((r) => {
            const isMine = r.repliedBy === user?.uid;
            return (
              <View
                key={r.id}
                style={[
                  styles.chatBubble,
                  isMine ? styles.chatRight : styles.chatLeft,
                ]}
              >
                <Text
                  style={[
                    styles.chatMessage,
                    !isMine && { color: Colors.textPrimary },
                  ]}
                >
                  {r.message}
                </Text>
                <Text style={styles.chatMeta}>
                  {r.repliedByName} ({r.role})
                </Text>
              </View>
            );
          })
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Admin / Monitor Status Buttons */}
      {isAdminOrMonitor && (
        <View style={styles.adminPanel}>
          <Pressable
            style={[styles.statusBtn, { backgroundColor: Colors.info }]}
            onPress={() => updateStatus("in_progress")}
          >
            <Text style={styles.statusBtnText}>In-Progress</Text>
          </Pressable>

          <Pressable
            style={[styles.statusBtn, { backgroundColor: Colors.warning }]}
            onPress={() => updateStatus("need_info")}
          >
            <Text style={styles.statusBtnText}>Need Info</Text>
          </Pressable>

          <Pressable
            style={[styles.statusBtn, { backgroundColor: Colors.success }]}
            onPress={() => updateStatus("resolved")}
          >
            <Text style={styles.statusBtnText}>Resolve</Text>
          </Pressable>
        </View>
      )}

      {/* Reply Box — positioned using keyboardHeight so it sits flush above keyboard */}
      <View
        style={[
          styles.replyBox,
          {
            // bottom moves up by keyboard height; when keyboard hidden keyboardHeight === 0
            bottom: keyboardHeight ? keyboardHeight : 0,
            // small extra padding so it doesn't touch keyboard directly
            paddingBottom: Platform.OS === "ios" ? 12 : 8,
          },
        ]}
      >
        <TextInput
          style={styles.replyInput}
          placeholder="Type your reply..."
          placeholderTextColor={Colors.textMuted}
          value={replyText}
          onChangeText={setReplyText}
          // ensure tapping stays in input instead of dismissing keyboard
          blurOnSubmit={false}
        />
        <Pressable style={styles.sendBtn} onPress={sendReply}>
          <Text style={styles.sendBtnText}>Send</Text>
        </Pressable>
      </View>

      {/* Image Viewer Modal */}
      <Modal
        visible={showImageViewer}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageViewer(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setShowImageViewer(false)}
        >
          {selectedImage && (
            <View style={styles.popupCard}>
              <ImageBackground
                source={{ uri: selectedImage }}
                style={styles.popupImage}
                resizeMode="contain"
              />
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  meta: { fontSize: 12, color: Colors.textMuted, marginBottom: 8 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 6,
    color: Colors.textPrimary,
  },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  statusText: {
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 13,
    color: Colors.textPrimary,
    alignSelf: "flex-start",
  },
  mediaThumb: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: Colors.surfaceDark,
  },
  emptyMsg: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  chatBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
  },
  chatLeft: {
    alignSelf: "flex-start",
    backgroundColor: Colors.surfaceDark,
  },
  chatRight: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
  },
  chatMessage: {
    fontSize: 14,
    color: Colors.textInverse,
  },
  chatMeta: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  adminPanel: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.surface,
    padding: 8,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  statusBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  statusBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textInverse,
  },
  replyBox: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  replyInput: {
    flex: 1,
    backgroundColor: Colors.surfaceDark,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: Colors.textPrimary,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: "center",
  },
  sendBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupCard: {
    width: "80%",
    height: "65%",
    backgroundColor: Colors.card,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 12,
  },
  popupImage: { width: "100%", height: "100%" },
});
