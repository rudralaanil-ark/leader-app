// // app/(user)/(tabs)/ComplaintBox.tsx
// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   ToastAndroid,
//   View,
// } from "react-native";

// import { uploadImageToCloudinary } from "@/app/api/uploadImage";
// import {
//   ComplaintDoc,
//   ComplaintMedia,
//   complaintService,
// } from "@/app/services/complaintService";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";

// type LocalMedia = {
//   uri: string;
//   type: "image" | "video";
// };

// const ComplaintBox = () => {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [activeTab, setActiveTab] = useState<"new" | "list">("new");

//   // form state
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [phone, setPhone] = useState("");
//   const [place, setPlace] = useState("");
//   const [media, setMedia] = useState<LocalMedia[]>([]);

//   const [submitting, setSubmitting] = useState(false);
//   const [loadingList, setLoadingList] = useState(true);
//   const [complaints, setComplaints] = useState<ComplaintDoc[]>([]);

//   useEffect(() => {
//     if (!user?.uid) return;

//     const unsub = complaintService.subscribeToUserComplaints(
//       user.uid,
//       (list) => {
//         setComplaints(list);
//         setLoadingList(false);
//       }
//     );

//     return () => unsub();
//   }, [user?.uid]);

//   const showToast = (msg: string) => {
//     if (Platform.OS === "android") {
//       ToastAndroid.show(msg, ToastAndroid.SHORT);
//     } else {
//       Alert.alert(msg);
//     }
//   };

//   const validateForm = () => {
//     if (!title.trim()) {
//       showToast("Please enter a complaint title.");
//       return false;
//     }
//     if (!description.trim()) {
//       showToast("Please describe your complaint.");
//       return false;
//     }
//     if (!phone.trim()) {
//       showToast("Please enter your phone number.");
//       return false;
//     }
//     if (!place.trim()) {
//       showToast("Please enter your place/location.");
//       return false;
//     }
//     return true;
//   };

//   const handlePickMedia = async (source: "camera" | "library") => {
//     try {
//       if (source === "camera") {
//         const { status } = await ImagePicker.requestCameraPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert(
//             "Permission required",
//             "Camera permission is required to take a photo or video."
//           );
//           return;
//         }

//         const result = await ImagePicker.launchCameraAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.All,
//           quality: 0.7,
//         });

//         if (!result.canceled && result.assets?.length) {
//           const asset = result.assets[0];
//           const type =
//             asset.type === "video" ? ("video" as const) : ("image" as const);
//           setMedia((prev) => [...prev, { uri: asset.uri, type }]);
//         }
//       } else {
//         const { status } =
//           await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert(
//             "Permission required",
//             "Media library permission is required to select files."
//           );
//           return;
//         }

//         const result = await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.All,
//           allowsMultipleSelection: true,
//           quality: 0.7,
//         });

//         if (!result.canceled && result.assets?.length) {
//           const newMedia = result.assets.map((asset) => ({
//             uri: asset.uri,
//             type:
//               asset.type === "video" ? ("video" as const) : ("image" as const),
//           }));
//           setMedia((prev) => [...prev, ...newMedia]);
//         }
//       }
//     } catch (err) {
//       console.error("Media picker error", err);
//       showToast("Failed to pick media.");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!user?.uid || !user.fullName) {
//       showToast("You must be logged in to submit a complaint.");
//       return;
//     }

//     if (!validateForm()) return;

//     try {
//       setSubmitting(true);

//       // 1) upload media (image + video) using Cloudinary helper
//       const uploadedMedia: ComplaintMedia[] = [];

//       for (const item of media) {
//         const result = await uploadImageToCloudinary(item.uri);
//         // result is { url, publicId } | null
//         if (result && typeof result.url === "string" && result.url.length > 0) {
//           uploadedMedia.push({
//             type: item.type,
//             url: result.url,
//           });
//         }
//       }

//       const safeUploadedMedia = uploadedMedia.filter(
//         (m) => m && typeof m.url === "string" && m.url.length > 0
//       );

//       // 2) create complaint document
//       await complaintService.createComplaint({
//         userId: user.uid,
//         userName: user.fullName,
//         phone: phone.trim(),
//         place: place.trim(),
//         title: title.trim(),
//         description: description.trim(),
//         media: safeUploadedMedia,
//       });

//       // 3) reset form
//       setTitle("");
//       setDescription("");
//       setPhone("");
//       setPlace("");
//       setMedia([]);
//       setActiveTab("list");

//       showToast("Complaint submitted successfully.");
//     } catch (err) {
//       console.error("Error submitting complaint", err);
//       Alert.alert(
//         "Error",
//         "Failed to submit complaint. Please try again in a moment."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const timeAgo = (date: Date) => {
//     const diffSec = (Date.now() - date.getTime()) / 1000;
//     const d = Math.floor(diffSec / 86400);
//     if (d <= 0) return "Today";
//     if (d === 1) return "Yesterday";
//     return `${d}d ago`;
//   };

//   const renderStatusChip = (status: string) => {
//     let label = "";
//     let bg = Colors.tagNew;
//     let color = Colors.textPrimary;

//     switch (status) {
//       case "pending":
//         label = "New";
//         bg = Colors.tagWarning;
//         break;
//       case "in_progress":
//         label = "Under Process";
//         bg = Colors.info;
//         color = Colors.textInverse;
//         break;
//       case "need_info":
//         label = "Need Info";
//         bg = Colors.warning;
//         color = Colors.textInverse;
//         break;
//       case "resolved":
//         label = "Resolved";
//         bg = Colors.tagSuccess;
//         break;
//       default:
//         label = status;
//     }

//     return (
//       <View style={[styles.statusChip, { backgroundColor: bg }]}>
//         <Text style={[styles.statusChipText, { color }]}>{label}</Text>
//       </View>
//     );
//   };

//   const renderComplaintItem = ({ item }: { item: ComplaintDoc }) => {
//     const created =
//       item.createdAt?.toDate?.() ??
//       (item.createdAt instanceof Date ? item.createdAt : new Date());

//     // ✅ Normalize media coming from Firestore (extra safety)
//     const rawMedia: any[] = Array.isArray((item as any).media)
//       ? ((item as any).media as any[])
//       : [];

//     const normalizedMedia: ComplaintMedia[] = rawMedia
//       .map((m) => {
//         if (!m) return null;

//         const url =
//           typeof m.url === "string" && m.url.length > 0
//             ? m.url
//             : typeof m.uri === "string" && m.uri.length > 0
//             ? m.uri
//             : null;

//         if (!url) return null;

//         const type: "image" | "video" = m.type === "video" ? "video" : "image";

//         return { url, type };
//       })
//       .filter(Boolean) as ComplaintMedia[];

//     return (
//       <Pressable
//         style={styles.card}
//         onPress={() =>
//           router.push({
//             pathname: "/(user)/(tabs)/ComplaintDetails",
//             params: { id: item.id },
//           })
//         }
//       >
//         <View style={styles.cardHeaderRow}>
//           <Text style={styles.cardTitle}>{item.title}</Text>
//           {renderStatusChip(item.status)}
//         </View>

//         <Text style={styles.cardMeta}>{timeAgo(created)}</Text>

//         <Text style={styles.cardDescription} numberOfLines={3}>
//           {item.description}
//         </Text>

//         {normalizedMedia.length > 0 && (
//           <View style={styles.mediaRow}>
//             {normalizedMedia.slice(0, 3).map((m, idx) => (
//               <View key={idx} style={styles.mediaThumb}>
//                 {m.type === "image" ? (
//                   <Image source={{ uri: m.url }} style={styles.mediaImage} />
//                 ) : (
//                   <View style={styles.videoPlaceholder}>
//                     <Text style={styles.videoText}>Video</Text>
//                   </View>
//                 )}
//               </View>
//             ))}
//             {normalizedMedia.length > 3 && (
//               <View style={styles.moreMedia}>
//                 <Text style={styles.moreMediaText}>
//                   +{normalizedMedia.length - 3} more
//                 </Text>
//               </View>
//             )}
//           </View>
//         )}
//       </Pressable>
//     );
//   };

//   if (!user) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.centerText}>
//           Please sign in to use Complaint Box.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <Text style={styles.heading}>Complaint Box</Text>

//       {/* Tabs */}
//       <View style={styles.tabRow}>
//         <Pressable
//           onPress={() => setActiveTab("new")}
//           style={[
//             styles.tabButton,
//             activeTab === "new" && styles.tabButtonActive,
//           ]}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === "new" && styles.tabTextActive,
//             ]}
//           >
//             New Complaint
//           </Text>
//         </Pressable>

//         <Pressable
//           onPress={() => setActiveTab("list")}
//           style={[
//             styles.tabButton,
//             activeTab === "list" && styles.tabButtonActive,
//           ]}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === "list" && styles.tabTextActive,
//             ]}
//           >
//             My Complaints
//           </Text>
//         </Pressable>
//       </View>

//       {activeTab === "new" ? (
//         <ScrollView
//           style={styles.formScroll}
//           contentContainerStyle={{ paddingBottom: 40 }}
//           keyboardShouldPersistTaps="handled"
//         >
//           <Text style={styles.label}>Title</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter complaint title"
//             placeholderTextColor={Colors.textMuted}
//             value={title}
//             onChangeText={setTitle}
//           />

//           <Text style={styles.label}>Description</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder="Describe your issue in detail"
//             placeholderTextColor={Colors.textMuted}
//             value={description}
//             onChangeText={setDescription}
//             multiline
//             numberOfLines={4}
//           />

//           <Text style={styles.label}>Phone Number</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Your phone number"
//             placeholderTextColor={Colors.textMuted}
//             value={phone}
//             onChangeText={setPhone}
//             keyboardType="phone-pad"
//           />

//           <Text style={styles.label}>Place / Location</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g. Hostel Block A, Room 102"
//             placeholderTextColor={Colors.textMuted}
//             value={place}
//             onChangeText={setPlace}
//           />

//           <Text style={styles.label}>Attach Images / Videos (optional)</Text>
//           <View style={styles.mediaButtonsRow}>
//             <Pressable
//               style={styles.mediaButton}
//               onPress={() => handlePickMedia("camera")}
//             >
//               <Text style={styles.mediaButtonText}>Take Photo / Video</Text>
//             </Pressable>
//             <Pressable
//               style={styles.mediaButton}
//               onPress={() => handlePickMedia("library")}
//             >
//               <Text style={styles.mediaButtonText}>Choose from Gallery</Text>
//             </Pressable>
//           </View>

//           {media.length > 0 && (
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               style={{ marginTop: 10 }}
//             >
//               {media.map((m, idx) => (
//                 <View key={idx} style={styles.mediaPreview}>
//                   {m.type === "image" ? (
//                     <Image source={{ uri: m.uri }} style={styles.mediaImage} />
//                   ) : (
//                     <View style={styles.videoPlaceholder}>
//                       <Text style={styles.videoText}>Video</Text>
//                     </View>
//                   )}
//                 </View>
//               ))}
//             </ScrollView>
//           )}

//           <Pressable
//             style={[styles.submitButton, submitting && { opacity: 0.7 }]}
//             onPress={handleSubmit}
//             disabled={submitting}
//           >
//             {submitting ? (
//               <ActivityIndicator color={Colors.textInverse} />
//             ) : (
//               <Text style={styles.submitButtonText}>Submit Complaint</Text>
//             )}
//           </Pressable>
//         </ScrollView>
//       ) : (
//         <View style={{ flex: 1 }}>
//           {loadingList ? (
//             <View style={styles.center}>
//               <ActivityIndicator color={Colors.primary} />
//             </View>
//           ) : complaints.length === 0 ? (
//             <View style={styles.center}>
//               <Text style={styles.centerText}>
//                 No complaints yet. Create your first complaint.
//               </Text>
//             </View>
//           ) : (
//             <FlatList
//               data={complaints}
//               keyExtractor={(item) => item.id}
//               contentContainerStyle={{ paddingBottom: 80 }}
//               renderItem={renderComplaintItem}
//             />
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// export default ComplaintBox;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     paddingTop: Platform.OS === "android" ? 30 : 50,
//     paddingHorizontal: 16,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//     marginBottom: 12,
//   },
//   tabRow: {
//     flexDirection: "row",
//     backgroundColor: Colors.surface,
//     borderRadius: 999,
//     padding: 4,
//     marginBottom: 12,
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 8,
//     alignItems: "center",
//     borderRadius: 999,
//   },
//   tabButtonActive: {
//     backgroundColor: Colors.primary,
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: Colors.textSecondary,
//   },
//   tabTextActive: {
//     color: Colors.textInverse,
//   },
//   formScroll: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: Colors.textPrimary,
//     marginTop: 8,
//     marginBottom: 4,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     fontSize: 14,
//     color: Colors.textPrimary,
//     backgroundColor: Colors.card,
//   },
//   textArea: {
//     minHeight: 90,
//     textAlignVertical: "top",
//   },
//   mediaButtonsRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 4,
//   },
//   mediaButton: {
//     flex: 1,
//     borderRadius: 10,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     backgroundColor: Colors.surfaceDark,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   mediaButtonText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: Colors.textPrimary,
//   },
//   mediaPreview: {
//     width: 70,
//     height: 70,
//     borderRadius: 10,
//     overflow: "hidden",
//     marginRight: 8,
//     backgroundColor: Colors.surfaceDark,
//   },
//   mediaImage: {
//     width: "100%",
//     height: "100%",
//   },
//   videoPlaceholder: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   videoText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//   },
//   submitButton: {
//     marginTop: 20,
//     backgroundColor: Colors.primary,
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   submitButtonText: {
//     color: Colors.textInverse,
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   centerText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     textAlign: "center",
//     paddingHorizontal: 24,
//   },
//   card: {
//     backgroundColor: Colors.card,
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   cardHeaderRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   cardTitle: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//     flex: 1,
//     paddingRight: 8,
//   },
//   cardMeta: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     marginTop: 2,
//   },
//   cardDescription: {
//     fontSize: 13,
//     color: Colors.textSecondary,
//     marginTop: 6,
//   },
//   statusChip: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 999,
//   },
//   statusChipText: {
//     fontSize: 11,
//     fontWeight: "700",
//   },
//   mediaRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 8,
//   },
//   mediaThumb: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     overflow: "hidden",
//     marginRight: 6,
//     backgroundColor: Colors.surfaceDark,
//   },
//   moreMedia: {
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 999,
//     backgroundColor: Colors.surfaceDark,
//   },
//   moreMediaText: {
//     fontSize: 11,
//     fontWeight: "600",
//     color: Colors.textPrimary,
//   },
// });

import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";

import { uploadImageToCloudinary } from "@/app/api/uploadImage";
import {
  ComplaintDoc,
  ComplaintMedia,
  complaintService,
} from "@/app/services/complaintService";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";

type LocalMedia = {
  uri: string;
  type: "image" | "video";
};

const ComplaintBox = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"new" | "list">("new");

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [place, setPlace] = useState("");
  const [media, setMedia] = useState<LocalMedia[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [complaints, setComplaints] = useState<ComplaintDoc[]>([]);

  const prevUid = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    if (prevUid.current === user.uid) return;
    prevUid.current = user.uid;

    setLoadingList(true);

    const unsub = complaintService.subscribeToUserComplaints(
      user.uid,
      (list) => {
        setComplaints(list);
        setLoadingList(false);
      }
    );

    return () => {
      unsub();
    };
  }, [user?.uid]);

  const showToast = (msg: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      showToast("Please enter a complaint title.");
      return false;
    }
    if (!description.trim()) {
      showToast("Please describe your complaint.");
      return false;
    }
    if (!phone.trim()) {
      showToast("Please enter your phone number.");
      return false;
    }
    if (!place.trim()) {
      showToast("Please enter your place/location.");
      return false;
    }
    return true;
  };

  const handlePickMedia = async (source: "camera" | "library") => {
    try {
      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Camera permission is required to take a photo or video."
          );
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 0.7,
        });

        if (!result.canceled && result.assets?.length) {
          const asset = result.assets[0];
          const type =
            asset.type === "video" ? ("video" as const) : ("image" as const);
          setMedia((prev) => [...prev, { uri: asset.uri, type }]);
        }
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Media library permission is required to select files."
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsMultipleSelection: true,
          quality: 0.7,
        });

        if (!result.canceled && result.assets?.length) {
          const newMedia = result.assets.map((asset) => ({
            uri: asset.uri,
            type:
              asset.type === "video" ? ("video" as const) : ("image" as const),
          }));
          setMedia((prev) => [...prev, ...newMedia]);
        }
      }
    } catch (err) {
      console.error("Media picker error", err);
      showToast("Failed to pick media.");
    }
  };

  const handleSubmit = async () => {
    if (!user?.uid || !user.fullName) {
      showToast("You must be logged in to submit a complaint.");
      return;
    }

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const uploadedMedia: ComplaintMedia[] = [];

      for (const item of media) {
        const result = await uploadImageToCloudinary(item.uri);
        if (result && typeof result.url === "string" && result.url.length > 0) {
          uploadedMedia.push({
            type: item.type,
            url: result.url,
          });
        }
      }

      const safeUploadedMedia = uploadedMedia.filter(
        (m) => m && typeof m.url === "string" && m.url.length > 0
      );

      await complaintService.createComplaint({
        userId: user.uid,
        userName: user.fullName,
        phone: phone.trim(),
        place: place.trim(),
        title: title.trim(),
        description: description.trim(),
        media: safeUploadedMedia,
      });

      setTitle("");
      setDescription("");
      setPhone("");
      setPlace("");
      setMedia([]);
      setActiveTab("list");

      showToast("Complaint submitted successfully.");
    } catch (err) {
      console.error("Error submitting complaint", err);
      Alert.alert(
        "Error",
        "Failed to submit complaint. Please try again in a moment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (date: Date) => {
    const diffSec = (Date.now() - date.getTime()) / 1000;
    const d = Math.floor(diffSec / 86400);
    if (d <= 0) return "Today";
    if (d === 1) return "Yesterday";
    return `${d}d ago`;
  };

  const renderStatusChip = (status: string) => {
    let label = "";
    let bg = Colors.tagNew;
    let color = Colors.textPrimary;

    switch (status) {
      case "pending":
        label = "New";
        bg = Colors.tagWarning;
        break;
      case "in_progress":
        label = "Under Process";
        bg = Colors.info;
        color = Colors.textInverse;
        break;
      case "need_info":
        label = "Need Info";
        bg = Colors.warning;
        color = Colors.textInverse;
        break;
      case "resolved":
        label = "Resolved";
        bg = Colors.tagSuccess;
        break;
      default:
        label = status;
    }

    return (
      <View style={[styles.statusChip, { backgroundColor: bg }]}>
        <Text style={[styles.statusChipText, { color }]}>{label}</Text>
      </View>
    );
  };

  const renderComplaintItem = ({ item }: { item: ComplaintDoc }) => {
    const created =
      item.createdAt?.toDate?.() ??
      (item.createdAt instanceof Date ? item.createdAt : new Date());

    const rawMedia: any[] = Array.isArray((item as any).media)
      ? ((item as any).media as any[])
      : [];

    const normalizedMedia: ComplaintMedia[] = rawMedia
      .map((m) => {
        if (!m) return null;

        const url =
          typeof m.url === "string" && m.url.length > 0
            ? m.url
            : typeof m.uri === "string" && m.uri.length > 0
            ? m.uri
            : null;

        if (!url) return null;

        const type: "image" | "video" = m.type === "video" ? "video" : "image";

        return { url, type };
      })
      .filter(Boolean) as ComplaintMedia[];

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/(user)/(tabs)/ComplaintDetails",
            params: { id: item.id },
          })
        }
      >
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {renderStatusChip(item.status)}
        </View>

        <Text style={styles.cardMeta}>{timeAgo(created)}</Text>

        <Text style={styles.cardDescription} numberOfLines={3}>
          {item.description}
        </Text>

        {normalizedMedia.length > 0 && (
          <View style={styles.mediaRow}>
            {normalizedMedia.slice(0, 3).map((m, idx) => (
              <View key={idx} style={styles.mediaThumb}>
                {m.type === "image" ? (
                  <Image source={{ uri: m.url }} style={styles.mediaImage} />
                ) : (
                  <View style={styles.videoPlaceholder}>
                    <Text style={styles.videoText}>Video</Text>
                  </View>
                )}
              </View>
            ))}
            {normalizedMedia.length > 3 && (
              <View style={styles.moreMedia}>
                <Text style={styles.moreMediaText}>
                  +{normalizedMedia.length - 3} more
                </Text>
              </View>
            )}
          </View>
        )}
      </Pressable>
    );
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>
          Please sign in to use Complaint Box.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>Complaint Box</Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <Pressable
          onPress={() => setActiveTab("new")}
          style={[
            styles.tabButton,
            activeTab === "new" && styles.tabButtonActive,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "new" && styles.tabTextActive,
            ]}
          >
            New Complaint
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("list")}
          style={[
            styles.tabButton,
            activeTab === "list" && styles.tabButtonActive,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "list" && styles.tabTextActive,
            ]}
          >
            My Complaints
          </Text>
        </Pressable>
      </View>

      {activeTab === "new" ? (
        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter complaint title"
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your issue in detail"
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Your phone number"
            placeholderTextColor={Colors.textMuted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Place / Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Hostel Block A, Room 102"
            placeholderTextColor={Colors.textMuted}
            value={place}
            onChangeText={setPlace}
          />

          <Text style={styles.label}>Attach Images / Videos (optional)</Text>
          <View style={styles.mediaButtonsRow}>
            <Pressable
              style={styles.mediaButton}
              onPress={() => handlePickMedia("camera")}
            >
              <Text style={styles.mediaButtonText}>Take Photo / Video</Text>
            </Pressable>
            <Pressable
              style={styles.mediaButton}
              onPress={() => handlePickMedia("library")}
            >
              <Text style={styles.mediaButtonText}>Choose from Gallery</Text>
            </Pressable>
          </View>

          {media.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 10 }}
            >
              {media.map((m, idx) => (
                <View key={idx} style={styles.mediaPreview}>
                  {m.type === "image" ? (
                    <Image source={{ uri: m.uri }} style={styles.mediaImage} />
                  ) : (
                    <View style={styles.videoPlaceholder}>
                      <Text style={styles.videoText}>Video</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          <Pressable
            style={[styles.submitButton, submitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={Colors.textInverse} />
            ) : (
              <Text style={styles.submitButtonText}>Submit Complaint</Text>
            )}
          </Pressable>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          {loadingList ? (
            <View style={styles.center}>
              <ActivityIndicator color={Colors.primary} />
            </View>
          ) : complaints.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.centerText}>
                No complaints yet. Create your first complaint.
              </Text>
            </View>
          ) : (
            <FlatList
              data={complaints}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 80 }}
              renderItem={renderComplaintItem}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default ComplaintBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? 30 : 50,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 999,
    padding: 4,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 999,
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textInverse,
  },
  formScroll: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.card,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  mediaButtonsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  mediaButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.surfaceDark,
    alignItems: "center",
    justifyContent: "center",
  },
  mediaButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  mediaPreview: {
    width: 70,
    height: 70,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 8,
    backgroundColor: Colors.surfaceDark,
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  videoText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    flex: 1,
    paddingRight: 8,
  },
  cardMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "700",
  },
  mediaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  mediaThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 6,
    backgroundColor: Colors.surfaceDark,
  },
  moreMedia: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.surfaceDark,
  },
  moreMediaText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});
