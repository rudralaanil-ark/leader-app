// // app/(shared)/complaints/ComplaintDetailsManager.tsx
// import {
//   ComplaintDoc,
//   ComplaintReply,
//   ComplaintStatus,
//   complaintService,
// } from "@/app/services/complaintService";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   ImageBackground,
//   Modal,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import MessageBubble from "./components/MessageBubble";
// import StatusBadge from "./components/StatusBadge";

// export default function ComplaintDetailsManager() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { user } = useAuth();

//   const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [replyText, setReplyText] = useState("");
//   const [sending, setSending] = useState(false);

//   const [showImageViewer, setShowImageViewer] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   const [statusPickerOpen, setStatusPickerOpen] = useState(false);

//   const isAdmin = user?.role === "admin";
//   const isMonitor = user?.role === "monitor";

//   useEffect(() => {
//     if (!id) return;
//     const unsub = complaintService.subscribeToComplaint(String(id), (doc) => {
//       setComplaint(doc);
//       setLoading(false);
//     });
//     return () => unsub();
//   }, [id]);

//   // Mark read when manager opens
//   useEffect(() => {
//     if (!id) return;
//     if (isAdmin || isMonitor) {
//       complaintService.markReadByAdmin(String(id)).catch(() => {});
//     }
//   }, [id, isAdmin, isMonitor]);

//   const created = useMemo(() => {
//     if (!complaint?.createdAt) return new Date();
//     return complaint.createdAt?.toDate?.() ?? new Date();
//   }, [complaint]);

//   const repliesSorted: ComplaintReply[] = useMemo(() => {
//     if (!complaint?.replies || !Array.isArray(complaint.replies)) return [];
//     return [...complaint.replies].sort((a, b) => {
//       const ta = a.createdAt?.toDate?.()?.getTime?.() ?? 0;
//       const tb = b.createdAt?.toDate?.()?.getTime?.() ?? 0;
//       return ta - tb;
//     });
//   }, [complaint]);

//   const openImage = (url: string) => {
//     setSelectedImage(url);
//     setShowImageViewer(true);
//   };

//   const handleChangeStatus = async (status: ComplaintStatus) => {
//     if (!complaint) return;
//     setStatusPickerOpen(false);
//     try {
//       await complaintService.updateStatus(complaint.id, status);
//     } catch (e) {
//       console.error("updateStatus error:", e);
//     }
//   };

//   const handleSendReply = async () => {
//     if (!complaint || !user?.uid || !replyText.trim()) return;

//     try {
//       setSending(true);
//       await complaintService.addReply(complaint.id, {
//         message: replyText.trim(),
//         repliedBy: user.uid,
//         repliedByName: user.fullName || "Admin",
//         role: isAdmin ? "admin" : "monitor",
//         createdAt: new Date(), // will still be stored as raw; we don't rely on server timestamp here
//       });
//       setReplyText("");
//     } catch (e) {
//       console.error("addReply error:", e);
//     } finally {
//       setSending(false);
//     }
//   };

//   if (loading || !complaint) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color={Colors.primary} />
//       </View>
//     );
//   }

//   const statusOptions: ComplaintStatus[] = [
//     "pending",
//     "accepted",
//     "in_progress",
//     "need_info",
//     "resolved",
//   ];

//   return (
//     <>
//       <View style={styles.container}>
//         <ScrollView
//           style={{ flex: 1 }}
//           contentContainerStyle={{ paddingBottom: 90 }}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* HEADER */}
//           <Text style={styles.title}>{complaint.title}</Text>
//           <Text style={styles.meta}>Created: {created.toLocaleString()}</Text>

//           <View style={styles.rowBetween}>
//             <View style={{ flex: 1, paddingRight: 8 }}>
//               <Text style={styles.sectionLabel}>User</Text>
//               <Text style={styles.text}>{complaint.userName}</Text>
//               <Text style={styles.text}>Phone: {complaint.phone}</Text>
//               <Text style={styles.text}>Place: {complaint.place}</Text>
//             </View>

//             <View style={{ alignItems: "flex-end" }}>
//               <Text style={styles.sectionLabel}>Status</Text>
//               <StatusBadge
//                 status={complaint.status}
//                 viewerRole={isAdmin ? "admin" : "monitor"}
//               />

//               <Pressable
//                 style={styles.statusButton}
//                 onPress={() => setStatusPickerOpen((v) => !v)}
//               >
//                 <Text style={styles.statusButtonText}>Change Status</Text>
//               </Pressable>
//             </View>
//           </View>

//           {/* STATUS PICKER DROPDOWN */}
//           {statusPickerOpen && (
//             <View style={styles.statusPickerCard}>
//               {statusOptions.map((s) => (
//                 <Pressable
//                   key={s}
//                   style={[
//                     styles.statusOption,
//                     s === complaint.status && styles.statusOptionActive,
//                   ]}
//                   onPress={() => handleChangeStatus(s)}
//                 >
//                   <StatusBadge
//                     status={s}
//                     viewerRole={isAdmin ? "admin" : "monitor"}
//                   />
//                 </Pressable>
//               ))}
//             </View>
//           )}

//           {/* ATTACHMENTS */}
//           {complaint.media?.length > 0 && (
//             <>
//               <Text style={styles.sectionLabel}>Attachments</Text>
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 style={{ marginBottom: 8 }}
//               >
//                 {complaint.media.map((m, i) => (
//                   <Pressable
//                     key={i}
//                     onPress={() => {
//                       if (m.type === "image") {
//                         openImage(m.url);
//                       }
//                     }}
//                   >
//                     <ImageBackground
//                       source={{ uri: m.url }}
//                       style={styles.mediaThumb}
//                       imageStyle={{ borderRadius: 10 }}
//                       resizeMode="cover"
//                     >
//                       {m.type === "video" && (
//                         <View style={styles.videoOverlay}>
//                           <Text style={styles.videoLabel}>Video</Text>
//                         </View>
//                       )}
//                     </ImageBackground>
//                   </Pressable>
//                 ))}
//               </ScrollView>
//             </>
//           )}

//           {/* CHAT / MESSAGE LIST */}
//           <Text style={styles.sectionLabel}>Conversation</Text>

//           {/* Original complaint as first "message" */}
//           <MessageBubble
//             text={complaint.description}
//             label="User"
//             isMe={false}
//             timestamp={
//               complaint.createdAt?.toDate?.() ??
//               (complaint.createdAt instanceof Date ? complaint.createdAt : null)
//             }
//           />

//           {/* Replies */}
//           {repliesSorted.map((r) => {
//             const ts =
//               r.createdAt?.toDate?.() ??
//               (r.createdAt instanceof Date ? r.createdAt : null);
//             const isMe = r.repliedBy === user?.uid;
//             const label =
//               r.role === "admin"
//                 ? "Admin"
//                 : r.role === "monitor"
//                 ? "Monitor"
//                 : "Staff";

//             return (
//               <MessageBubble
//                 key={r.id}
//                 text={r.message}
//                 isMe={isMe}
//                 label={label}
//                 timestamp={ts}
//               />
//             );
//           })}

//           <Pressable style={styles.backBtn} onPress={() => router.back()}>
//             <Text style={styles.backBtnText}>Go Back</Text>
//           </Pressable>
//         </ScrollView>

//         {/* REPLY INPUT BAR */}
//         <View style={styles.replyBar}>
//           <TextInput
//             style={styles.replyInput}
//             placeholder="Type a reply to the user..."
//             placeholderTextColor={Colors.textMuted}
//             value={replyText}
//             onChangeText={setReplyText}
//             multiline
//           />
//           <Pressable
//             style={[
//               styles.replyButton,
//               (!replyText.trim() || sending) && { opacity: 0.6 },
//             ]}
//             onPress={handleSendReply}
//             disabled={!replyText.trim() || sending}
//           >
//             {sending ? (
//               <ActivityIndicator color={Colors.textInverse} />
//             ) : (
//               <Text style={styles.replyButtonText}>Send</Text>
//             )}
//           </Pressable>
//         </View>
//       </View>

//       {/* POPUP IMAGE VIEWER */}
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: Colors.background,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//     marginBottom: 8,
//   },
//   meta: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     marginBottom: 12,
//   },
//   sectionLabel: {
//     fontSize: 14,
//     fontWeight: "700",
//     marginTop: 12,
//     marginBottom: 4,
//     color: Colors.textPrimary,
//   },
//   text: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },
//   statusButton: {
//     marginTop: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     backgroundColor: Colors.card,
//   },
//   statusButtonText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: Colors.textPrimary,
//   },
//   statusPickerCard: {
//     marginTop: 8,
//     borderRadius: 12,
//     backgroundColor: Colors.card,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     paddingVertical: 4,
//   },
//   statusOption: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   statusOptionActive: {
//     backgroundColor: Colors.highlightSoft,
//   },
//   mediaThumb: {
//     width: 90,
//     height: 90,
//     borderRadius: 10,
//     marginRight: 8,
//     backgroundColor: Colors.surfaceDark,
//     overflow: "hidden",
//   },
//   videoOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.35)",
//   },
//   videoLabel: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: Colors.textInverse,
//   },
//   backBtn: {
//     marginTop: 16,
//     backgroundColor: Colors.primary,
//     paddingVertical: 10,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   backBtnText: {
//     color: Colors.textInverse,
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   replyBar: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     flexDirection: "row",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: Colors.card,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     gap: 8,
//   },
//   replyInput: {
//     flex: 1,
//     minHeight: 40,
//     maxHeight: 90,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     fontSize: 13,
//     color: Colors.textPrimary,
//     backgroundColor: Colors.surface,
//   },
//   replyButton: {
//     alignSelf: "flex-end",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//     backgroundColor: Colors.primary,
//   },
//   replyButtonText: {
//     color: Colors.textInverse,
//     fontSize: 13,
//     fontWeight: "700",
//   },
//   modalOverlay: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   popupCard: {
//     width: "80%",
//     height: "60%",
//     backgroundColor: Colors.card,
//     borderRadius: 16,
//     overflow: "hidden",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   popupImage: {
//     width: "100%",
//     height: "100%",
//   },
// });

// import {
//   ComplaintDoc,
//   ComplaintReply,
//   ComplaintStatus,
//   complaintService,
// } from "@/app/services/complaintService";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   ImageBackground,
//   Modal,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import MessageBubble from "./components/MessageBubble";
// import StatusBadge from "./components/StatusBadge";

// export default function ComplaintDetailsManager() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { user } = useAuth();

//   const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [replyText, setReplyText] = useState("");
//   const [sending, setSending] = useState(false);

//   const [showImageViewer, setShowImageViewer] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   const [statusPickerOpen, setStatusPickerOpen] = useState(false);

//   const isAdmin = user?.role === "admin";
//   const isMonitor = user?.role === "monitor";

//   // Subscribe to complaint
//   useEffect(() => {
//     if (!id) return;
//     const unsub = complaintService.subscribeToComplaint(String(id), (doc) => {
//       setComplaint(doc);
//       setLoading(false);
//     });
//     return () => unsub();
//   }, [id]);

//   // Mark read when opened
//   useEffect(() => {
//     if (!id) return;
//     if (isAdmin || isMonitor) {
//       complaintService.markReadByAdmin(String(id)).catch(() => {});
//     }
//   }, [id, isAdmin, isMonitor]);

//   const safeDate = (d: any): Date =>
//     d?.toDate?.() ?? (d instanceof Date ? d : new Date());

//   const created = useMemo(
//     () => safeDate(complaint?.createdAt),
//     [complaint?.createdAt]
//   );

//   const repliesSorted: ComplaintReply[] = useMemo(() => {
//     if (!complaint?.replies) return [];

//     const getTS = (ts: any) =>
//       ts?.toDate?.()?.getTime?.() ?? (ts instanceof Date ? ts.getTime() : 0);

//     return [...complaint.replies].sort(
//       (a, b) => getTS(a.createdAt) - getTS(b.createdAt)
//     );
//   }, [complaint?.replies]);

//   const openImage = (url: string) => {
//     setSelectedImage(url);
//     setShowImageViewer(true);
//   };

//   const handleChangeStatus = async (status: ComplaintStatus) => {
//     if (!complaint) return;
//     setStatusPickerOpen(false);
//     try {
//       await complaintService.updateStatus(complaint.id, status);
//     } catch (e) {
//       console.error("updateStatus error:", e);
//     }
//   };

//   const handleSendReply = async () => {
//     if (!complaint || !user?.uid || !replyText.trim()) return;

//     try {
//       setSending(true);
//       await complaintService.addReply(complaint.id, {
//         message: replyText.trim(),
//         repliedBy: user.uid,
//         repliedByName: user.fullName || "Admin",
//         role: isAdmin ? "admin" : "monitor",
//         createdAt: new Date(), // replaced inside service
//       });
//       setReplyText("");
//     } catch (e) {
//       console.error("addReply error:", e);
//     } finally {
//       setSending(false);
//     }
//   };

//   if (loading || !complaint) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color={Colors.primary} />
//       </View>
//     );
//   }

//   const statusOptions: ComplaintStatus[] = [
//     "pending",
//     "accepted",
//     "in_progress",
//     "need_info",
//     "resolved",
//   ];

//   return (
//     <>
//       <View style={styles.container}>
//         <ScrollView
//           style={{ flex: 1 }}
//           contentContainerStyle={{ paddingBottom: 90 }}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* HEADER */}
//           <Text style={styles.title}>{complaint.title}</Text>
//           <Text style={styles.meta}>Created: {created.toLocaleString()}</Text>

//           <View style={styles.rowBetween}>
//             <View style={{ flex: 1, paddingRight: 8 }}>
//               <Text style={styles.sectionLabel}>User</Text>
//               <Text style={styles.text}>{complaint.userName}</Text>
//               <Text style={styles.text}>Phone: {complaint.phone}</Text>
//               <Text style={styles.text}>Place: {complaint.place}</Text>
//             </View>

//             {/* Status */}
//             <View style={{ alignItems: "flex-end" }}>
//               <Text style={styles.sectionLabel}>Status</Text>
//               <StatusBadge
//                 status={complaint.status}
//                 viewerRole={isAdmin ? "admin" : "monitor"}
//               />

//               <Pressable
//                 style={styles.statusButton}
//                 onPress={() => setStatusPickerOpen((v) => !v)}
//               >
//                 <Text style={styles.statusButtonText}>Change Status</Text>
//               </Pressable>
//             </View>
//           </View>

//           {/* Status Picker */}
//           {statusPickerOpen && (
//             <View style={styles.statusPickerCard}>
//               {statusOptions.map((s) => (
//                 <Pressable
//                   key={s}
//                   style={[
//                     styles.statusOption,
//                     s === complaint.status && styles.statusOptionActive,
//                   ]}
//                   onPress={() => handleChangeStatus(s)}
//                 >
//                   <StatusBadge
//                     status={s}
//                     viewerRole={isAdmin ? "admin" : "monitor"}
//                   />
//                 </Pressable>
//               ))}
//             </View>
//           )}

//           {/* Attachments */}
//           {complaint.media?.length > 0 && (
//             <>
//               <Text style={styles.sectionLabel}>Attachments</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {complaint.media.map((m, i) => (
//                   <Pressable
//                     key={i}
//                     onPress={() => m.type === "image" && openImage(m.url)}
//                   >
//                     <ImageBackground
//                       source={{ uri: m.url }}
//                       style={styles.mediaThumb}
//                       imageStyle={{ borderRadius: 10 }}
//                       resizeMode="cover"
//                     >
//                       {m.type === "video" && (
//                         <View style={styles.videoOverlay}>
//                           <Text style={styles.videoLabel}>Video</Text>
//                         </View>
//                       )}
//                     </ImageBackground>
//                   </Pressable>
//                 ))}
//               </ScrollView>
//             </>
//           )}

//           {/* Conversation */}
//           <Text style={styles.sectionLabel}>Conversation</Text>

//           {/* Original Complaint */}
//           <MessageBubble
//             text={complaint.description}
//             label="User"
//             isMe={false}
//             timestamp={safeDate(complaint.createdAt)}
//           />

//           {/* Replies */}
//           {repliesSorted.map((r) => (
//             <MessageBubble
//               key={r.id}
//               text={r.message}
//               isMe={r.repliedBy === user?.uid}
//               label={
//                 r.role === "admin"
//                   ? "Admin"
//                   : r.role === "monitor"
//                   ? "Monitor"
//                   : "User"
//               }
//               timestamp={safeDate(r.createdAt)}
//             />
//           ))}

//           <Pressable style={styles.backBtn} onPress={() => router.back()}>
//             <Text style={styles.backBtnText}>Go Back</Text>
//           </Pressable>
//         </ScrollView>

//         {/* Send Message */}
//         <View style={styles.replyBar}>
//           <TextInput
//             style={styles.replyInput}
//             placeholder="Type a reply..."
//             placeholderTextColor={Colors.textMuted}
//             value={replyText}
//             onChangeText={setReplyText}
//             multiline
//           />
//           <Pressable
//             style={[
//               styles.replyButton,
//               (!replyText.trim() || sending) && { opacity: 0.6 },
//             ]}
//             onPress={handleSendReply}
//             disabled={!replyText.trim() || sending}
//           >
//             {sending ? (
//               <ActivityIndicator color={Colors.textInverse} />
//             ) : (
//               <Text style={styles.replyButtonText}>Send</Text>
//             )}
//           </Pressable>
//         </View>
//       </View>

//       {/* Full Image viewer */}
//       <Modal visible={showImageViewer} transparent animationType="fade">
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: Colors.background,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//   },
//   meta: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     marginBottom: 12,
//   },
//   sectionLabel: {
//     fontSize: 14,
//     fontWeight: "700",
//     marginTop: 12,
//     marginBottom: 4,
//     color: Colors.textPrimary,
//   },
//   text: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   statusButton: {
//     marginTop: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     backgroundColor: Colors.card,
//   },
//   statusButtonText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: Colors.textPrimary,
//   },
//   statusPickerCard: {
//     marginTop: 8,
//     borderRadius: 12,
//     backgroundColor: Colors.card,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     paddingVertical: 4,
//   },
//   statusOption: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   statusOptionActive: {
//     backgroundColor: Colors.tagNew,
//   },
//   mediaThumb: {
//     width: 90,
//     height: 90,
//     borderRadius: 10,
//     marginRight: 8,
//     backgroundColor: Colors.surfaceDark,
//   },
//   videoOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.4)",
//   },
//   videoLabel: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: Colors.textInverse,
//   },
//   backBtn: {
//     marginTop: 16,
//     backgroundColor: Colors.primary,
//     paddingVertical: 10,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   backBtnText: {
//     color: Colors.textInverse,
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   replyBar: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     flexDirection: "row",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: Colors.card,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     gap: 8,
//   },
//   replyInput: {
//     flex: 1,
//     minHeight: 40,
//     maxHeight: 90,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     fontSize: 13,
//     color: Colors.textPrimary,
//     backgroundColor: Colors.surface,
//   },
//   replyButton: {
//     alignSelf: "flex-end",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//     backgroundColor: Colors.primary,
//   },
//   replyButtonText: {
//     color: Colors.textInverse,
//     fontSize: 13,
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
//     height: "60%",
//     backgroundColor: Colors.card,
//     borderRadius: 16,
//     overflow: "hidden",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   popupImage: {
//     width: "100%",
//     height: "100%",
//   },
// });

// import {
//   ComplaintDoc,
//   ComplaintReply,
//   ComplaintStatus,
//   complaintService,
// } from "@/app/services/complaintService";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import MessageBubble from "./components/MessageBubble";
// import StatusBadge from "./components/StatusBadge";

// export default function ComplaintDetailsManager() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { user } = useAuth();

//   const scrollViewRef = useRef<ScrollView>(null);

//   const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [replyText, setReplyText] = useState("");
//   const [sending, setSending] = useState(false);

//   const [showImageViewer, setShowImageViewer] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   const [statusPickerOpen, setStatusPickerOpen] = useState(false);

//   const isAdmin = user?.role === "admin";
//   const isMonitor = user?.role === "monitor";

//   const safeDate = (d: any): Date =>
//     d?.toDate?.() ?? (d instanceof Date ? d : new Date());

//   useEffect(() => {
//     if (!id) return;
//     const unsub = complaintService.subscribeToComplaint(String(id), (doc) => {
//       setComplaint(doc);
//       setLoading(false);
//       setTimeout(
//         () => scrollViewRef.current?.scrollToEnd({ animated: true }),
//         150
//       );
//     });
//     return () => unsub();
//   }, [id]);

//   useEffect(() => {
//     if (complaint?.id && (isAdmin || isMonitor)) {
//       complaintService.markReadByAdmin(complaint.id).catch(() => {});
//     }
//   }, [complaint?.id]);

//   const repliesSorted: ComplaintReply[] = useMemo(() => {
//     if (!complaint?.replies) return [];
//     return [...complaint.replies].sort(
//       (a, b) =>
//         safeDate(a.createdAt).getTime() - safeDate(b.createdAt).getTime()
//     );
//   }, [complaint?.replies]);

//   const handleSendReply = async () => {
//     if (!complaint || !user?.uid || !replyText.trim()) return;
//     try {
//       setSending(true);
//       await complaintService.addReply(complaint.id, {
//         message: replyText.trim(),
//         repliedBy: user.uid,
//         repliedByName: user.fullName || (isAdmin ? "Admin" : "Monitor"),
//         role: isAdmin ? "admin" : "monitor",
//         createdAt: new Date(),
//       });
//       setReplyText("");
//       setTimeout(
//         () => scrollViewRef.current?.scrollToEnd({ animated: true }),
//         120
//       );
//     } catch (e) {
//       console.error("Reply error:", e);
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleChangeStatus = async (status: ComplaintStatus) => {
//     if (!complaint) return;
//     setStatusPickerOpen(false);
//     await complaintService.updateStatus(complaint.id, status);
//   };

//   if (loading || !complaint) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color={Colors.primary} size="large" />
//       </View>
//     );
//   }

//   const created = safeDate(complaint.createdAt);
//   const statusOptions: ComplaintStatus[] = [
//     "pending",
//     "accepted",
//     "in_progress",
//     "need_info",
//     "resolved",
//   ];

//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//         keyboardVerticalOffset={80}
//       >
//         <View style={styles.container}>
//           <ScrollView
//             ref={scrollViewRef}
//             style={{ flex: 1 }}
//             contentContainerStyle={{ paddingBottom: 140 }}
//             keyboardShouldPersistTaps="handled"
//           >
//             <Text style={styles.title}>{complaint.title}</Text>
//             <Text style={styles.meta}>Created: {created.toLocaleString()}</Text>

//             <View style={styles.rowBetween}>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.sectionLabel}>User</Text>
//                 <Text style={styles.text}>{complaint.userName}</Text>
//                 <Text style={styles.text}>📞 {complaint.phone}</Text>
//                 <Text style={styles.text}>📍 {complaint.place}</Text>
//               </View>

//               <View style={{ alignItems: "flex-end" }}>
//                 <Text style={styles.sectionLabel}>Status</Text>
//                 <StatusBadge
//                   status={complaint.status}
//                   viewerRole={isAdmin ? "admin" : "monitor"}
//                 />

//                 <Pressable
//                   style={styles.statusButton}
//                   onPress={() => setStatusPickerOpen((s) => !s)}
//                 >
//                   <Text style={styles.statusButtonText}>Change Status</Text>
//                 </Pressable>
//               </View>
//             </View>

//             {statusPickerOpen && (
//               <View style={styles.statusPickerCard}>
//                 {statusOptions.map((s) => (
//                   <Pressable
//                     key={s}
//                     style={[
//                       styles.statusOption,
//                       s === complaint.status && styles.statusOptionActive,
//                     ]}
//                     onPress={() => handleChangeStatus(s)}
//                   >
//                     <StatusBadge
//                       status={s}
//                       viewerRole={isAdmin ? "admin" : "monitor"}
//                     />
//                   </Pressable>
//                 ))}
//               </View>
//             )}

//             <Text style={styles.sectionLabel}>Conversation</Text>

//             <MessageBubble
//               text={complaint.description}
//               label="User"
//               isMe={false}
//               timestamp={created}
//             />

//             {repliesSorted.map((r) => (
//               <MessageBubble
//                 key={r.id}
//                 text={r.message}
//                 isMe={r.repliedBy === user?.uid}
//                 label={
//                   r.role === "admin"
//                     ? "Admin"
//                     : r.role === "monitor"
//                     ? "Monitor"
//                     : "User"
//                 }
//                 timestamp={safeDate(r.createdAt)}
//               />
//             ))}
//           </ScrollView>

//           {/* Reply Bar */}
//           <View style={styles.replyBar}>
//             <TextInput
//               style={styles.replyInput}
//               placeholder="Reply..."
//               placeholderTextColor={Colors.textMuted}
//               value={replyText}
//               onChangeText={setReplyText}
//               multiline
//             />
//             <Pressable
//               style={[
//                 styles.replyButton,
//                 (!replyText.trim() || sending) && { opacity: 0.5 },
//               ]}
//               onPress={handleSendReply}
//               disabled={!replyText.trim() || sending}
//             >
//               {sending ? (
//                 <ActivityIndicator color={Colors.textInverse} />
//               ) : (
//                 <Text style={styles.replyButtonText}>Send</Text>
//               )}
//             </Pressable>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: Colors.background },
//   container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   title: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary },
//   meta: { fontSize: 12, color: Colors.textMuted, marginBottom: 12 },
//   sectionLabel: { fontSize: 14, fontWeight: "700", marginTop: 12 },
//   text: { fontSize: 14, color: Colors.textSecondary },
//   rowBetween: { flexDirection: "row", justifyContent: "space-between" },
//   statusButton: {
//     marginTop: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//     backgroundColor: Colors.card,
//     borderColor: Colors.border,
//     borderWidth: 1,
//   },
//   statusButtonText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: Colors.primary,
//   },
//   statusPickerCard: {
//     marginTop: 6,
//     borderRadius: 12,
//     backgroundColor: Colors.card,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     paddingVertical: 4,
//   },
//   statusOption: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   statusOptionActive: {
//     backgroundColor: Colors.tagNew,
//   },
//   replyBar: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     padding: 10,
//     backgroundColor: Colors.card,
//     alignItems: "flex-end",
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//   },
//   replyInput: {
//     flex: 1,
//     minHeight: 40,
//     maxHeight: 110,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     fontSize: 13,
//     backgroundColor: Colors.surface,
//     color: Colors.textPrimary,
//   },
//   replyButton: {
//     marginLeft: 10,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 10,
//     backgroundColor: Colors.primary,
//   },
//   replyButtonText: { color: Colors.textInverse, fontWeight: "700" },
// });

import {
  ComplaintDoc,
  ComplaintReply,
  ComplaintStatus,
  complaintService,
} from "@/app/services/complaintService";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
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
import { SafeAreaView } from "react-native-safe-area-context";
import MessageBubble from "./components/MessageBubble";
import StatusBadge from "./components/StatusBadge";

export default function ComplaintDetailsManager() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const scrollViewRef = useRef<ScrollView>(null);

  const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [statusPickerOpen, setStatusPickerOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const isMonitor = user?.role === "monitor";

  const safeDate = (d: any): Date =>
    d?.toDate?.() ?? (d instanceof Date ? d : new Date());

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 80);
  };

  useEffect(() => {
    if (!id) return;
    const unsub = complaintService.subscribeToComplaint(String(id), (doc) => {
      setComplaint(doc);
      setLoading(false);
      scrollToBottom();
    });

    return () => unsub();
  }, [id]);

  useEffect(() => {
    if (complaint?.id && (isAdmin || isMonitor)) {
      complaintService.markReadByAdmin(complaint.id).catch(() => {});
    }
  }, [complaint?.id, isAdmin, isMonitor]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", scrollToBottom);
    const hideSub = Keyboard.addListener("keyboardDidHide", scrollToBottom);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const repliesSorted: ComplaintReply[] = useMemo(() => {
    if (!complaint?.replies) return [];
    return [...complaint.replies].sort(
      (a, b) =>
        safeDate(a.createdAt).getTime() - safeDate(b.createdAt).getTime()
    );
  }, [complaint?.replies]);

  const handleSendReply = async () => {
    if (!complaint || !user?.uid || !replyText.trim()) return;

    try {
      setSending(true);
      await complaintService.addReply(complaint.id, {
        message: replyText.trim(),
        repliedBy: user.uid,
        repliedByName: user.fullName || (isAdmin ? "Admin" : "Monitor"),
        role: isAdmin ? "admin" : "monitor",
        createdAt: new Date(),
      });

      setReplyText("");
      scrollToBottom();
    } catch (e) {
      console.error("Reply error:", e);
    } finally {
      setSending(false);
    }
  };

  const handleChangeStatus = async (status: ComplaintStatus) => {
    if (!complaint) return;
    setStatusPickerOpen(false);
    await complaintService.updateStatus(complaint.id, status);
  };

  const openImage = (url: string) => {
    setSelectedImage(url);
    setShowImageViewer(true);
  };

  if (loading || !complaint) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  const created = safeDate(complaint.createdAt);
  const statusOptions: ComplaintStatus[] = [
    "pending",
    "accepted",
    "in_progress",
    "need_info",
    "resolved",
  ];

  return (
    <>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <View style={styles.container}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              onLayout={scrollToBottom}
            >
              {/* ==== TOP CARD ==== */}
              <View style={styles.complaintCard}>
                <View style={styles.headerRow}>
                  <View style={styles.headerTextArea}>
                    <Text style={styles.title}>{complaint.title}</Text>
                    <Text style={styles.meta}>
                      Created: {created.toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.statusArea}>
                    <StatusBadge
                      status={complaint.status}
                      viewerRole={isAdmin ? "admin" : "monitor"}
                    />

                    <Pressable
                      style={styles.statusButton}
                      onPress={() => setStatusPickerOpen(true)}
                    >
                      <Text style={styles.statusButtonText}>Change</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* User Details */}
                <Text style={styles.sectionLabel}>User Details</Text>
                <View style={styles.userRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{complaint.userName}</Text>
                    <Text style={styles.userMeta}>📞 {complaint.phone}</Text>
                    <Text style={styles.userMeta}>📍 {complaint.place}</Text>
                  </View>
                </View>

                {/* Attachments */}
                {complaint.media?.length > 0 && (
                  <>
                    <Text style={styles.sectionLabel}>Attachments</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.attachScroll}
                    >
                      {complaint.media.map((m, i) => (
                        <Pressable
                          key={i}
                          onPress={() =>
                            m.type === "image" ? openImage(m.url) : null
                          }
                        >
                          <ImageBackground
                            source={{ uri: m.url }}
                            style={styles.mediaThumb}
                            imageStyle={{ borderRadius: 10 }}
                          >
                            {m.type === "video" && (
                              <View style={styles.videoOverlay}>
                                <Text style={styles.videoLabel}>Video</Text>
                              </View>
                            )}
                          </ImageBackground>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </>
                )}
              </View>

              {/* ==== CONVERSATION ==== */}
              <Text style={styles.sectionLabelConversation}>Conversation</Text>

              <View style={styles.chatCard}>
                <MessageBubble
                  text={complaint.description}
                  label="User"
                  isMe={false}
                  timestamp={created}
                />

                {repliesSorted.map((r) => (
                  <MessageBubble
                    key={r.id}
                    text={r.message}
                    isMe={r.repliedBy === user?.uid}
                    label={
                      r.role === "admin"
                        ? "Admin"
                        : r.role === "monitor"
                        ? "Monitor"
                        : "User"
                    }
                    timestamp={safeDate(r.createdAt)}
                  />
                ))}
              </View>

              <Pressable style={styles.backBtn} onPress={() => router.back()}>
                <Text style={styles.backBtnText}>Go Back</Text>
              </Pressable>
            </ScrollView>

            {/* ==== REPLY BAR ==== */}
            <View style={styles.replyBar}>
              <TextInput
                style={styles.replyInput}
                placeholder="Reply..."
                placeholderTextColor={Colors.textMuted}
                value={replyText}
                onChangeText={setReplyText}
                multiline
                onFocus={scrollToBottom}
              />
              <Pressable
                style={[
                  styles.replyButton,
                  (!replyText.trim() || sending) && { opacity: 0.5 },
                ]}
                onPress={handleSendReply}
                disabled={!replyText.trim() || sending}
              >
                {sending ? (
                  <ActivityIndicator color={Colors.textInverse} />
                ) : (
                  <Text style={styles.replyButtonText}>Send</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ==== STATUS SHEET ==== */}
      <Modal
        visible={statusPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusPickerOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.sheetOverlay}
          onPress={() => setStatusPickerOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.sheetContainer}
            onPress={() => {}}
          >
            <Text style={styles.sheetTitle}>Change Status</Text>

            {statusOptions.map((s) => (
              <Pressable
                key={s}
                style={styles.sheetOption}
                onPress={() => handleChangeStatus(s)}
              >
                <StatusBadge
                  status={s}
                  viewerRole={isAdmin ? "admin" : "monitor"}
                />
              </Pressable>
            ))}

            <Pressable
              style={styles.sheetCancel}
              onPress={() => setStatusPickerOpen(false)}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </Pressable>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ==== IMAGE VIEWER ==== */}
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
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 200, // ensures full scroll height
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Top complaint card
  complaintCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  headerTextArea: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  meta: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  statusArea: {
    alignItems: "flex-end",
  },
  statusButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginTop: 4,
  },
  statusButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  userMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  attachScroll: {
    marginTop: 4,
  },
  mediaThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: Colors.surfaceDark,
    overflow: "hidden",
  },
  videoOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textInverse,
  },

  // Conversation
  sectionLabelConversation: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  chatCard: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },

  backBtn: {
    alignSelf: "center",
    marginTop: 4,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  backBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: "700",
  },

  // Reply bar
  replyBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
  },
  replyInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
  },
  replyButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: "center",
  },
  replyButtonText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: "700",
  },

  // Status Sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  sheetOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sheetCancel: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: Colors.surfaceDark,
  },
  sheetCancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },

  // Image Viewer
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupCard: {
    width: "80%",
    height: "60%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  popupImage: {
    width: "100%",
    height: "100%",
  },
});
