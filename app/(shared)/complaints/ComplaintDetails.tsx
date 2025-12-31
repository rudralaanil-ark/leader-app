// // app/(shared)/complaints/ComplaintDetails.tsx
// import {
//   ComplaintDoc,
//   complaintService,
// } from "@/app/services/complaintService";
// import Colors from "@/data/Colors";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   ImageBackground,
//   Modal,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import StatusBadge from "./components/StatusBadge";

// export default function ComplaintDetails() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);

//   const [showImageViewer, setShowImageViewer] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   useEffect(() => {
//     if (!id) return;
//     const unsub = complaintService.subscribeToComplaint(String(id), (doc) => {
//       setComplaint(doc);
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

//   return (
//     <>
//       <ScrollView style={styles.container}>
//         <Text style={styles.title}>{complaint.title}</Text>
//         <Text style={styles.meta}>Date: {created.toLocaleString()}</Text>

//         <StatusBadge status={complaint.status} viewerRole="user" />

//         <Text style={styles.sectionLabel}>Description</Text>
//         <Text style={styles.description}>{complaint.description}</Text>

//         <Text style={styles.sectionLabel}>Location</Text>
//         <Text style={styles.text}>{complaint.place}</Text>

//         <Text style={styles.sectionLabel}>Phone</Text>
//         <Text style={styles.text}>{complaint.phone}</Text>

//         {complaint.media?.length > 0 && (
//           <>
//             <Text style={styles.sectionLabel}>Attachments</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {complaint.media.map((m, i) => (
//                 <Pressable
//                   key={i}
//                   onPress={() => {
//                     if (m.type === "image") openImage(m.url);
//                   }}
//                 >
//                   <ImageBackground
//                     source={{ uri: m.url }}
//                     style={styles.mediaThumb}
//                     imageStyle={{ borderRadius: 10 }}
//                     resizeMode="cover"
//                   >
//                     {m.type === "video" && (
//                       <View style={styles.videoOverlay}>
//                         <Text style={styles.videoLabel}>Video</Text>
//                       </View>
//                     )}
//                   </ImageBackground>
//                 </Pressable>
//               ))}
//             </ScrollView>
//           </>
//         )}

//         <Pressable style={styles.backBtn} onPress={() => router.back()}>
//           <Text style={styles.backBtnText}>Go Back</Text>
//         </Pressable>
//       </ScrollView>

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
//     padding: 16,
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
//     marginBottom: 4,
//   },
//   description: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     lineHeight: 20,
//   },
//   mediaThumb: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     marginRight: 10,
//     backgroundColor: Colors.surfaceDark,
//     overflow: "hidden",
//   },
//   videoOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.35)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   videoLabel: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: Colors.textInverse,
//   },
//   backBtn: {
//     marginTop: 20,
//     backgroundColor: Colors.primary,
//     padding: 12,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   backBtnText: {
//     color: Colors.textInverse,
//     fontSize: 15,
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
//   complaintService,
// } from "@/app/services/complaintService";
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
//   TouchableOpacity,
//   View,
// } from "react-native";
// import StatusBadge from "./components/StatusBadge";

// export default function ComplaintDetails() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();

//   const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [showImageViewer, setShowImageViewer] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   useEffect(() => {
//     if (!id) return;
//     const unsub = complaintService.subscribeToComplaint(String(id), (doc) => {
//       setComplaint(doc);
//       setLoading(false);
//     });
//     return () => unsub();
//   }, [id]);

//   const safeDate = (d: any): Date =>
//     d?.toDate?.() ?? (d instanceof Date ? d : new Date());

//   const created = useMemo(
//     () => safeDate(complaint?.createdAt),
//     [complaint?.createdAt]
//   );

//   const openImage = (url: string) => {
//     setSelectedImage(url);
//     setShowImageViewer(true);
//   };

//   if (loading || !complaint) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <>
//       <ScrollView style={styles.container}>
//         <Text style={styles.title}>{complaint.title}</Text>
//         <Text style={styles.meta}>Created: {created.toLocaleString()}</Text>

//         <StatusBadge status={complaint.status} viewerRole="user" />

//         <Text style={styles.sectionLabel}>Description</Text>
//         <Text style={styles.description}>{complaint.description}</Text>

//         <Text style={styles.sectionLabel}>Contact</Text>
//         <Text style={styles.text}>Phone: {complaint.phone}</Text>
//         <Text style={styles.text}>Place: {complaint.place}</Text>

//         {complaint.media?.length > 0 && (
//           <>
//             <Text style={styles.sectionLabel}>Attachments</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {complaint.media.map((m, i) => (
//                 <Pressable
//                   key={i}
//                   onPress={() => m.type === "image" && openImage(m.url)}
//                 >
//                   <ImageBackground
//                     source={{ uri: m.url }}
//                     style={styles.mediaThumb}
//                     imageStyle={{ borderRadius: 10 }}
//                   >
//                     {m.type === "video" && (
//                       <View style={styles.videoOverlay}>
//                         <Text style={styles.videoLabel}>Video</Text>
//                       </View>
//                     )}
//                   </ImageBackground>
//                 </Pressable>
//               ))}
//             </ScrollView>
//           </>
//         )}

//         <Pressable style={styles.backBtn} onPress={() => router.back()}>
//           <Text style={styles.backBtnText}>Go Back</Text>
//         </Pressable>
//       </ScrollView>

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
//     padding: 16,
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
//   description: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     lineHeight: 20,
//   },
//   text: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginBottom: 3,
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
//     backgroundColor: "rgba(0,0,0,0.35)",
//     borderRadius: 10,
//   },
//   videoLabel: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: Colors.textInverse,
//   },
//   backBtn: {
//     marginTop: 20,
//     backgroundColor: Colors.primary,
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   backBtnText: {
//     color: Colors.textInverse,
//     fontSize: 15,
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
// import { SafeAreaView } from "react-native-safe-area-context";
// import MessageBubble from "./components/MessageBubble";
// import StatusBadge from "./components/StatusBadge";

// export default function ComplaintDetailsUser() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { user } = useAuth();

//   const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [replyText, setReplyText] = useState("");
//   const [sending, setSending] = useState(false);

//   const [showImageViewer, setShowImageViewer] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   const safeDate = (d: any): Date =>
//     d?.toDate?.() ?? (d instanceof Date ? d : new Date());

//   useEffect(() => {
//     if (!id) return;
//     const unsub = complaintService.subscribeToComplaint(String(id), (doc) => {
//       setComplaint(doc);
//       setLoading(false);
//     });
//     return () => unsub();
//   }, [id]);

//   // Mark as read when user views
//   useEffect(() => {
//     if (complaint?.id) {
//       complaintService.markReadByUser(complaint.id).catch(() => {});
//     }
//   }, [complaint?.id]);

//   const created = safeDate(complaint?.createdAt);

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

//   const handleSendReply = async () => {
//     if (!complaint || !user?.uid || !replyText.trim()) return;

//     try {
//       setSending(true);
//       await complaintService.addReply(complaint.id, {
//         message: replyText.trim(),
//         repliedBy: user.uid,
//         repliedByName: user.fullName ?? "User",
//         role: "user",
//         createdAt: new Date(),
//       });
//       setReplyText("");
//     } catch (e) {
//       console.error("User reply error:", e);
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

//   return (
//     <>
//       <SafeAreaView style={styles.container}>
//         <ScrollView
//           style={{ flex: 1 }}
//           contentContainerStyle={{ paddingBottom: 90 }}
//           keyboardShouldPersistTaps="handled"
//         >
//           <Text style={styles.title}>{complaint.title}</Text>
//           <Text style={styles.meta}>Created: {created.toLocaleString()}</Text>

//           <StatusBadge status={complaint.status} viewerRole="user" />

//           {/* Chat view */}
//           <Text style={styles.sectionLabel}>Conversation</Text>

//           {/* Original complaint */}
//           <MessageBubble
//             text={complaint.description}
//             label="You"
//             isMe={true}
//             timestamp={created}
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
//                   : "You"
//               }
//               timestamp={safeDate(r.createdAt)}
//             />
//           ))}

//           {/* Media */}
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
//                     />
//                   </Pressable>
//                 ))}
//               </ScrollView>
//             </>
//           )}

//           <Pressable style={styles.backBtn} onPress={() => router.back()}>
//             <Text style={styles.backBtnText}>Back</Text>
//           </Pressable>
//         </ScrollView>

//         {/* Reply Input */}
//         <SafeAreaView style={styles.replyBar}>
//           <TextInput
//             style={styles.replyInput}
//             placeholder="Type your reply..."
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
//         </SafeAreaView>
//       </SafeAreaView>

//       {/* Full Image Viewer */}
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
//     padding: 16,
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
//     marginVertical: 12,
//     color: Colors.textPrimary,
//   },
//   mediaThumb: {
//     width: 90,
//     height: 90,
//     borderRadius: 10,
//     marginRight: 10,
//     backgroundColor: Colors.surfaceDark,
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
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 10,
//     flexDirection: "row",
//     backgroundColor: Colors.card,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//   },
//   replyInput: {
//     flex: 1,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     paddingHorizontal: 10,
//     minHeight: 40,
//     maxHeight: 100,
//     backgroundColor: Colors.surface,
//     fontSize: 13,
//   },
//   replyButton: {
//     marginLeft: 8,
//     backgroundColor: Colors.primary,
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     justifyContent: "center",
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

import {
  ComplaintDoc,
  ComplaintReply,
  complaintService,
} from "@/app/services/complaintService";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
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

export default function ComplaintDetailsUser() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const safeDate = (d: any): Date =>
    d?.toDate?.() ?? (d instanceof Date ? d : new Date());

  useEffect(() => {
    if (!id) return;
    const unsub = complaintService.subscribeToComplaint(String(id), (doc) => {
      setComplaint(doc);
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    if (complaint?.id) {
      complaintService.markReadByUser(complaint.id).catch(() => {});
    }
  }, [complaint?.id]);

  const created = safeDate(complaint?.createdAt);

  const repliesSorted: ComplaintReply[] = useMemo(() => {
    if (!complaint?.replies) return [];
    const getTS = (ts: any) =>
      ts?.toDate?.()?.getTime?.() ?? (ts instanceof Date ? ts.getTime() : 0);
    return [...complaint.replies].sort(
      (a, b) => getTS(a.createdAt) - getTS(b.createdAt)
    );
  }, [complaint?.replies]);

  const openImage = (url: string) => {
    setSelectedImage(url);
    setShowImageViewer(true);
  };

  const handleSendReply = async () => {
    if (!complaint || !user?.uid || !replyText.trim()) return;

    try {
      setSending(true);
      await complaintService.addReply(complaint.id, {
        message: replyText.trim(),
        repliedBy: user.uid,
        repliedByName: user.fullName ?? "User",
        role: "user",
        createdAt: new Date(),
      });
      setReplyText("");
    } catch (e) {
      console.error("User reply error:", e);
    } finally {
      setSending(false);
    }
  };

  if (loading || !complaint) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* ===========================
                COMPLAINT DETAILS
        ============================ */}
        <ScrollView
          style={styles.detailsScroll}
          contentContainerStyle={styles.detailsContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{complaint.title}</Text>
          <Text style={styles.meta}>Created: {created.toLocaleString()}</Text>

          <View style={{ marginTop: 8 }}>
            <StatusBadge status={complaint.status} viewerRole="user" />
          </View>

          <View style={styles.sectionBox}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.descriptionText}>{complaint.description}</Text>
          </View>

          {complaint.media?.length > 0 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>Attachments</Text>
              <View style={styles.attachmentGrid}>
                {complaint.media.map((m, i) => (
                  <Pressable key={i} onPress={() => openImage(m.url)}>
                    <ImageBackground
                      source={{ uri: m.url }}
                      style={styles.mediaThumb}
                      imageStyle={{ borderRadius: 10 }}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ===========================
                  CHAT SECTION
        ============================ */}
        <View style={styles.chatContainer}>
          <Text style={styles.chatHeader}>Conversation</Text>

          <ScrollView
            style={styles.chatScroll}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Original complaint */}
            <MessageBubble
              text={complaint.description}
              label="You"
              isMe={true}
              timestamp={created}
            />

            {/* Replies */}
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
                    : "You"
                }
                timestamp={safeDate(r.createdAt)}
              />
            ))}
          </ScrollView>
        </View>

        {/* REPLY BAR */}
        <View style={styles.replyBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.replyInput}
              placeholder="Write a message..."
              placeholderTextColor={Colors.textMuted}
              value={replyText}
              onChangeText={setReplyText}
              multiline
            />
          </View>

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
      </SafeAreaView>

      {/* FULL IMAGE VIEWER */}
      <Modal visible={showImageViewer} transparent animationType="fade">
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /* =======================
        DETAILS SECTION
  ======================== */
  detailsScroll: {
    flex: 1.3,
    backgroundColor: Colors.card,
  },
  detailsContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  meta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },

  sectionBox: {
    marginTop: 16,
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  attachmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  mediaThumb: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: Colors.surfaceDark,
  },

  backBtn: {
    marginTop: 25,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  backBtnText: {
    color: Colors.textInverse,
    fontWeight: "700",
  },

  /* =======================
          CHAT SECTION
  ======================== */
  chatContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  chatHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    padding: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  chatScroll: {
    flex: 1,
    paddingHorizontal: 12,
  },

  /* =======================
          REPLY BAR
  ======================== */
  replyBar: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  replyInput: {
    fontSize: 14,
    maxHeight: 120,
    color: Colors.textPrimary,
  },
  replyButton: {
    marginLeft: 10,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
  },
  replyButtonText: {
    color: Colors.textInverse,
    fontWeight: "700",
  },

  /* MODAL IMAGE */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupCard: {
    width: "85%",
    height: "70%",
    backgroundColor: Colors.card,
    borderRadius: 18,
    overflow: "hidden",
  },
  popupImage: {
    width: "100%",
    height: "100%",
  },

  /* LOADING */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
