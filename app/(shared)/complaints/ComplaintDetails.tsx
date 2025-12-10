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
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
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

  const scrollViewRef = useRef<ScrollView>(null);

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

  useEffect(() => {
    if (repliesSorted.length > 0) {
      setTimeout(
        () => scrollViewRef.current?.scrollToEnd({ animated: true }),
        100
      );
    }
  }, [repliesSorted.length]);

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
      setTimeout(
        () => scrollViewRef.current?.scrollToEnd({ animated: true }),
        150
      );
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
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.container}>
            {/* ===== Complaint Detail Card ===== */}
            <View style={styles.detailsCard}>
              <Text style={styles.title}>{complaint.title}</Text>
              <Text style={styles.meta}>
                Created: {created.toLocaleString()}
              </Text>

              <StatusBadge status={complaint.status} viewerRole="user" />

              <Text style={styles.sectionSmallLabel}>Description</Text>
              <Text style={styles.description}>{complaint.description}</Text>

              {complaint.phone ? (
                <>
                  <Text style={styles.sectionSmallLabel}>Phone</Text>
                  <Text style={styles.infoText}>{complaint.phone}</Text>
                </>
              ) : null}

              {complaint.place ? (
                <>
                  <Text style={styles.sectionSmallLabel}>Place</Text>
                  <Text style={styles.infoText}>{complaint.place}</Text>
                </>
              ) : null}

              {complaint.media?.length > 0 && (
                <>
                  <Text style={styles.sectionSmallLabel}>Attachments</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {complaint.media.map((m, i) => (
                      <Pressable key={i} onPress={() => openImage(m.url)}>
                        <ImageBackground
                          source={{ uri: m.url }}
                          style={styles.mediaThumb}
                          imageStyle={{ borderRadius: 10 }}
                        />
                      </Pressable>
                    ))}
                  </ScrollView>
                </>
              )}
            </View>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>Back</Text>
            </Pressable>
            {/* Chat Section Title */}
            <Text style={styles.chatTitle}>Conversation</Text>

            {/* ===== Chat Area ===== */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.chatArea}
              contentContainerStyle={{ paddingBottom: 80 }}
              keyboardShouldPersistTaps="handled"
            >
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

            {/* ===== Reply Bar / Status Notice ===== */}
            {complaint.status === "resolved" ? (
              <View style={styles.disabledBar}>
                <Text style={styles.disabledText}>
                  This complaint has been resolved. Chat is closed.
                </Text>
              </View>
            ) : (
              <View style={styles.replyBar}>
                <TextInput
                  style={styles.replyInput}
                  placeholder="Type your reply..."
                  placeholderTextColor={Colors.textMuted}
                  value={replyText}
                  onChangeText={setReplyText}
                  multiline
                />
                <Pressable
                  style={[
                    styles.replyButton,
                    (!replyText.trim() || sending) && { opacity: 0.6 },
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
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Image Popup */}
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

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  keyboardAvoiding: { flex: 1 },
  container: { flex: 1, padding: 12, backgroundColor: Colors.background },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  /* Complaint Card */
  detailsCard: {
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },

  title: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary },
  meta: { fontSize: 12, color: Colors.textMuted, marginBottom: 10 },

  description: { fontSize: 14, color: Colors.textPrimary, marginBottom: 10 },
  sectionSmallLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 2,
    color: Colors.textSecondary,
  },
  infoText: { fontSize: 13, color: Colors.textPrimary },

  mediaThumb: {
    width: 80,
    height: 80,
    marginRight: 8,
    backgroundColor: Colors.surfaceDark,
    borderRadius: 10,
  },

  /* Chat Header */
  chatTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    marginVertical: 6,
    paddingHorizontal: 4,
  },

  /* Chat Area */
  chatArea: { flex: 1, marginBottom: 0 },

  backBtn: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    marginRight: 10,
    paddingVertical: 8,
    borderRadius: 8,
    // marginTop: 5,
  },
  backBtnText: { color: Colors.textWhite, fontWeight: "600" },

  /* Reply Bar */
  replyBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  disabledBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: Colors.surfaceDark,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  disabledText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },

  replyInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxHeight: 100,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  replyButton: {
    marginLeft: 6,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  replyButtonText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: "700",
  },

  /* Modal */
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
  },
  popupImage: { width: "100%", height: "100%" },
});
