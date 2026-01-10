// // app/(shared)/video/AddVideo.tsx
// import { uploadVideoToCloudinary } from "@/app/api/uploadToCloudinary";
// import { postsService } from "@/app/services/postsService";
// import { useAuth } from "@/contexts/AuthContext";
// import * as ImagePicker from "expo-image-picker";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Video from "react-native-video";

// export default function AddVideo() {
//   const { user } = useAuth();
//   const role = user?.role ?? "user";

//   const [video, setVideo] = useState<string | null>(null);
//   const [title, setTitle] = useState("");
//   const [loading, setLoading] = useState(false);

//   if (role !== "admin" && role !== "monitor") {
//     return (
//       <View style={styles.denied}>
//         <Text style={styles.deniedText}>Not allowed</Text>
//       </View>
//     );
//   }

//   const pickVideo = async () => {
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//       quality: 1,
//     });

//     if (!res.canceled) {
//       setVideo(res.assets[0].uri);
//     }
//   };

//   const handleUpload = async () => {
//     if (!video || !user || !title.trim()) return;

//     setLoading(true);

//     try {
//       const { videoUrl, thumbnailUrl } = await uploadVideoToCloudinary(video);

//       await postsService.createPost({
//         type: "video",
//         title,
//         ownerId: user.uid,
//         ownerName: user.fullName,
//         ownerRole: role,
//         media: [
//           {
//             type: "video",
//             url: videoUrl,
//             thumbnailUrl,
//             order: 0,
//             publicId: "",
//           },
//         ],
//         allowComments: true,
//         allowLikes: true,
//         allowShares: true,
//       });

//       alert("Video uploaded");
//       setTitle("");
//       setVideo(null);
//     } catch (e) {
//       alert("Upload failed");
//     }

//     setLoading(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Upload Video</Text>

//       <TextInput
//         placeholder="Video caption..."
//         value={title}
//         onChangeText={setTitle}
//         style={styles.input}
//       />

//       <TouchableOpacity style={styles.button} onPress={pickVideo}>
//         <Text style={styles.buttonText}>
//           {video ? "Change Video" : "Pick Video"}
//         </Text>
//       </TouchableOpacity>

//       {video && (
//         <Video
//           source={{ uri: video }}
//           style={styles.preview}
//           resizeMode="contain"
//           controls
//         />
//       )}

//       <TouchableOpacity
//         style={[styles.uploadBtn, loading && { opacity: 0.6 }]}
//         disabled={loading}
//         onPress={handleUpload}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.uploadText}>Upload</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, backgroundColor: "#fff" },
//   label: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: "#007AFF",
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   buttonText: { color: "#fff", fontWeight: "600", textAlign: "center" },
//   preview: {
//     width: "100%",
//     height: 300,
//     backgroundColor: "#000",
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   uploadBtn: {
//     backgroundColor: "#34C759",
//     padding: 16,
//     borderRadius: 14,
//   },
//   uploadText: { color: "#fff", fontWeight: "700", textAlign: "center" },
//   denied: { flex: 1, justifyContent: "center", alignItems: "center" },
//   deniedText: { color: "red", fontWeight: "600" },
// });

// // app/(shared)/video/AddVideo.tsx
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Platform,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Video from "react-native-video";

// import { uploadVideoToS3 } from "@/app/api/uploadVideoToS3";
// import { postsService } from "@/app/services/postsService";
// import { compressVideoIfNeeded } from "@/app/utils/compressVideoIfNeeded";
// import { useAuth } from "@/contexts/AuthContext";

// /* ---------- SAFE ID GENERATOR (NO CRYPTO) ---------- */
// const generatePostId = () =>
//   `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

// export default function AddVideo() {
//   const { user } = useAuth();
//   const role = user?.role ?? "user";

//   const [videoUri, setVideoUri] = useState<string | null>(null);
//   const [title, setTitle] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ---------- PERMISSION ---------- */

//   if (role !== "admin" && role !== "monitor") {
//     return (
//       <SafeAreaView style={styles.denied}>
//         <StatusBar barStyle="dark-content" />
//         <Text style={styles.deniedText}>
//           You are not allowed to upload videos
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   /* ---------- PICK VIDEO ---------- */

//   const pickVideo = async () => {
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//       quality: 1,
//     });

//     if (!res.canceled) {
//       setVideoUri(res.assets[0].uri);
//     }
//   };

//   /* ---------- UPLOAD ---------- */

//   const handleUpload = async () => {
//     if (!videoUri || !user || !title.trim()) {
//       Alert.alert("Missing info", "Please select a video and add a caption.");
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1️⃣ Compress video if needed
//       const compressed = await compressVideoIfNeeded(videoUri);

//       // 2️⃣ Generate safe post ID
//       const postId = generatePostId();

//       // 3️⃣ Upload to AWS S3
//       const { videoUrl, key } = await uploadVideoToS3({
//         localUri: compressed.uri,
//         userId: user.uid,
//         postId,
//       });

//       // 4️⃣ Save Firestore post
//       await postsService.createPost({
//         id: postId,
//         type: "video",
//         title,
//         ownerId: user.uid,
//         ownerName: user.fullName,
//         ownerRole: role,
//         media: [
//           {
//             type: "video",
//             url: videoUrl,
//             s3Key: key,
//             order: 0,
//           },
//         ],
//         allowComments: true,
//         allowLikes: true,
//         allowShares: true,
//       });

//       Alert.alert("Success", "Video uploaded successfully 🎉");
//       setTitle("");
//       setVideoUri(null);
//     } catch (err: any) {
//       console.error(err);
//       Alert.alert("Upload failed", err?.message ?? "Something went wrong");
//     }

//     setLoading(false);
//   };

//   /* ---------- UI ---------- */

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar
//         barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
//       />

//       <View style={styles.container}>
//         <Text style={styles.header}>Upload Video</Text>

//         {/* Caption */}
//         <TextInput
//           placeholder="Write a caption..."
//           placeholderTextColor="#9CA3AF"
//           value={title}
//           onChangeText={setTitle}
//           style={styles.input}
//           maxLength={120}
//         />

//         {/* Pick video */}
//         <TouchableOpacity style={styles.pickBtn} onPress={pickVideo}>
//           <Ionicons name="videocam-outline" size={22} color="#fff" />
//           <Text style={styles.pickText}>
//             {videoUri ? "Change Video" : "Pick Video"}
//           </Text>
//         </TouchableOpacity>

//         {/* Preview */}
//         {videoUri && (
//           <View style={styles.previewCard}>
//             <Video
//               source={{ uri: videoUri }}
//               style={styles.preview}
//               resizeMode="contain"
//               controls
//             />
//           </View>
//         )}
//       </View>

//       {/* Upload button */}
//       <View style={styles.footer}>
//         <TouchableOpacity
//           disabled={loading}
//           onPress={handleUpload}
//           style={[styles.uploadBtn, loading && { opacity: 0.6 }]}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.uploadText}>Upload Video</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// /* ---------- STYLES ---------- */

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#F8FBFF",
//   },

//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 12,
//   },

//   header: {
//     fontSize: 22,
//     fontWeight: "800",
//     marginBottom: 12,
//     color: "#111827",
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 14,
//     padding: 14,
//     fontSize: 15,
//     backgroundColor: "#fff",
//     marginBottom: 14,
//     color: "#111827",
//   },

//   pickBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     backgroundColor: "#007AFF",
//     paddingVertical: 14,
//     borderRadius: 14,
//     marginBottom: 16,
//   },

//   pickText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 15,
//   },

//   previewCard: {
//     backgroundColor: "#000",
//     borderRadius: 16,
//     overflow: "hidden",
//   },

//   preview: {
//     width: "100%",
//     height: 260,
//   },

//   footer: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderColor: "#E5E7EB",
//     backgroundColor: "#fff",
//   },

//   uploadBtn: {
//     backgroundColor: "#34C759",
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: "center",
//   },

//   uploadText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "800",
//   },

//   denied: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   deniedText: {
//     color: "#DC2626",
//     fontSize: 16,
//     fontWeight: "700",
//   },
// });

// // this is the new old code

// // app/(shared)/video/AddVideo.tsx
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
// import * as VideoThumbnails from "expo-video-thumbnails";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Platform,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Video from "react-native-video";

// import { uploadThumbnailToS3 } from "@/app/api/uploadThumbnailToS3";
// import { uploadVideoToS3 } from "@/app/api/uploadVideoToS3";
// import { postsService } from "@/app/services/postsService";
// import { compressVideoIfNeeded } from "@/app/utils/compressVideoIfNeeded";
// import { useAuth } from "@/contexts/AuthContext";

// /* ---------- SAFE ID GENERATOR ---------- */
// const generatePostId = () =>
//   `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

// export default function AddVideo() {
//   const { user } = useAuth();
//   const role = user?.role ?? "user";

//   const [videoUri, setVideoUri] = useState<string | null>(null);
//   const [title, setTitle] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ---------- THUMBNAIL STATE ---------- */

//   const [frames, setFrames] = useState<{ uri: string; time: number }[]>([]);

//   const [selectedThumbnail, setSelectedThumbnail] = useState<{
//     type: "frame" | "custom";
//     uri: string;
//     frameTime?: number;
//   } | null>(null);

//   const [customThumbnailUri, setCustomThumbnailUri] = useState<string | null>(
//     null
//   );

//   /* ---------- PERMISSION ---------- */

//   if (role !== "admin" && role !== "monitor") {
//     return (
//       <SafeAreaView style={styles.denied}>
//         <StatusBar barStyle="dark-content" />
//         <Text style={styles.deniedText}>
//           You are not allowed to upload videos
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   /* ---------- FRAME GENERATION ---------- */

//   const generateFrames = async (uri: string) => {
//     try {
//       const times = [0.5, 1.5, 2.5, 3.5, 4.5];

//       const results = await Promise.all(
//         times.map(async (t) => {
//           const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(
//             uri,
//             {
//               time: t * 1000,
//             }
//           );

//           return { uri: thumbUri, time: t };
//         })
//       );

//       setFrames(results);

//       setSelectedThumbnail({
//         type: "frame",
//         uri: results[0].uri,
//         frameTime: results[0].time,
//       });
//     } catch (e) {
//       console.warn("Frame generation failed", e);
//     }
//   };

//   /* ---------- PICK VIDEO ---------- */

//   const pickVideo = async () => {
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//       quality: 1,
//     });

//     if (!res.canceled) {
//       const uri = res.assets[0].uri;
//       setVideoUri(uri);
//       setFrames([]);
//       setSelectedThumbnail(null);
//       setCustomThumbnailUri(null);
//       generateFrames(uri);
//     }
//   };

//   /* ---------- PICK CUSTOM THUMBNAIL ---------- */

//   const pickCustomThumbnail = async () => {
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.9,
//       allowsEditing: true,
//       aspect: [9, 16],
//     });

//     if (!res.canceled) {
//       const uri = res.assets[0].uri;
//       setCustomThumbnailUri(uri);
//       setSelectedThumbnail({
//         type: "custom",
//         uri,
//       });
//     }
//   };

//   /* ---------- UPLOAD ---------- */

//   const handleUpload = async () => {
//     if (!videoUri || !user || !title.trim() || !selectedThumbnail) {
//       Alert.alert(
//         "Missing info",
//         "Please select a video, thumbnail and add a caption."
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const compressed = await compressVideoIfNeeded(videoUri);
//       const postId = generatePostId();

//       const { videoUrl, key } = await uploadVideoToS3({
//         localUri: compressed.uri,
//         userId: user.uid,
//         postId,
//       });

//       // 🔥 upload thumbnail
//       const { thumbnailUrl } = await uploadThumbnailToS3({
//         localUri: selectedThumbnail.uri,
//         userId: user.uid,
//         postId,
//       });

//       // after video upload
//       // const { videoUrl, key } = await uploadVideoToS3({
//       //   localUri: compressed.uri,
//       //   userId: user.uid,
//       //   postId,
//       // });

//       // 🔥 upload thumbnail
//       // const { thumbnailUrl } = await uploadThumbnailToS3({
//       //   localUri: selectedThumbnail.uri,
//       //   userId: user.uid,
//       //   postId,
//       // });

//       // save post
//       await postsService.createPost({
//         id: postId,
//         type: "video",
//         title,
//         ownerId: user.uid,
//         ownerName: user.fullName,
//         ownerRole: role,
//         media: [
//           {
//             type: "video",
//             url: videoUrl,
//             s3Key: key,
//             thumbnailUrl, // ✅ NEW
//             thumbnailType: selectedThumbnail.type,
//             frameTime: selectedThumbnail.frameTime ?? null,
//             order: 0,
//           },
//         ],
//         allowComments: true,
//         allowLikes: true,
//         allowShares: true,
//       });

//       Alert.alert("Success", "Video uploaded successfully 🎉");

//       setTitle("");
//       setVideoUri(null);
//       setFrames([]);
//       setSelectedThumbnail(null);
//       setCustomThumbnailUri(null);
//     } catch (err: any) {
//       Alert.alert("Upload failed", err?.message ?? "Something went wrong");
//     }

//     setLoading(false);
//   };

//   /* ---------- UI ---------- */

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar
//         barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
//       />

//       {/* 🔥 SCROLLABLE CONTENT */}
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.header}>Upload Video</Text>

//         {/* Caption */}
//         <TextInput
//           placeholder="Write a caption..."
//           placeholderTextColor="#9CA3AF"
//           value={title}
//           onChangeText={setTitle}
//           style={styles.input}
//           maxLength={120}
//         />

//         {/* Pick video */}
//         <TouchableOpacity style={styles.pickBtn} onPress={pickVideo}>
//           <Ionicons name="videocam-outline" size={22} color="#fff" />
//           <Text style={styles.pickText}>
//             {videoUri ? "Change Video" : "Pick Video"}
//           </Text>
//         </TouchableOpacity>

//         {/* Preview */}
//         {videoUri && (
//           <View style={styles.previewCard}>
//             <Video
//               source={{ uri: videoUri }}
//               style={styles.preview}
//               resizeMode="contain"
//               controls
//             />
//           </View>
//         )}

//         {/* Thumbnail selector */}
//         {videoUri && (
//           <View style={styles.thumbSection}>
//             <Text style={styles.sectionTitle}>Thumbnail</Text>

//             {selectedThumbnail && (
//               <View style={styles.selectedThumb}>
//                 <Image
//                   source={{ uri: selectedThumbnail.uri }}
//                   style={styles.selectedThumbImg}
//                 />
//               </View>
//             )}

//             <View style={styles.frameRow}>
//               {frames.map((f) => {
//                 const selected = selectedThumbnail?.uri === f.uri;
//                 return (
//                   <TouchableOpacity
//                     key={f.uri}
//                     onPress={() =>
//                       setSelectedThumbnail({
//                         type: "frame",
//                         uri: f.uri,
//                         frameTime: f.time,
//                       })
//                     }
//                     style={[styles.frameItem, selected && styles.frameSelected]}
//                   >
//                     <Image source={{ uri: f.uri }} style={styles.frameImg} />
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>

//             <TouchableOpacity
//               style={styles.customThumbBtn}
//               onPress={pickCustomThumbnail}
//             >
//               <Ionicons name="image-outline" size={20} color="#2563EB" />
//               <Text style={styles.customThumbText}>Upload custom image</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>

//       {/* 🔒 FIXED FOOTER */}
//       <View style={styles.footer}>
//         <TouchableOpacity
//           disabled={loading}
//           onPress={handleUpload}
//           style={[styles.uploadBtn, loading && { opacity: 0.6 }]}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.uploadText}>Upload Video</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// /* ---------- STYLES ---------- */

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#F8FBFF" },

//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 140, // 🔥 space for footer
//   },

//   header: {
//     fontSize: 22,
//     fontWeight: "800",
//     marginBottom: 12,
//     color: "#111827",
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 14,
//     padding: 14,
//     fontSize: 15,
//     backgroundColor: "#fff",
//     marginBottom: 14,
//     color: "#111827",
//   },

//   pickBtn: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 8,
//     backgroundColor: "#007AFF",
//     paddingVertical: 14,
//     borderRadius: 14,
//     marginBottom: 16,
//   },

//   pickText: { color: "#fff", fontWeight: "700", fontSize: 15 },

//   previewCard: {
//     backgroundColor: "#000",
//     borderRadius: 16,
//     overflow: "hidden",
//   },

//   preview: { width: "100%", height: 260 },

//   thumbSection: { marginTop: 16 },

//   sectionTitle: { fontWeight: "700", marginBottom: 8 },

//   selectedThumb: {
//     width: "100%",
//     height: 180,
//     borderRadius: 12,
//     overflow: "hidden",
//     backgroundColor: "#000",
//     marginBottom: 12,
//   },

//   selectedThumbImg: { width: "100%", height: "100%", resizeMode: "cover" },

//   frameRow: { flexDirection: "row", gap: 8, marginBottom: 12 },

//   frameItem: {
//     width: 64,
//     height: 64,
//     borderRadius: 8,
//     overflow: "hidden",
//     borderWidth: 2,
//     borderColor: "transparent",
//   },

//   frameSelected: { borderColor: "#007AFF" },

//   frameImg: { width: "100%", height: "100%" },

//   customThumbBtn: { flexDirection: "row", alignItems: "center", gap: 6 },

//   customThumbText: { color: "#2563EB", fontWeight: "700" },

//   footer: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderColor: "#E5E7EB",
//     backgroundColor: "#fff",
//   },

//   uploadBtn: {
//     backgroundColor: "#34C759",
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: "center",
//   },

//   uploadText: { color: "#fff", fontSize: 16, fontWeight: "800" },

//   denied: { flex: 1, justifyContent: "center", alignItems: "center" },

//   deniedText: { color: "#DC2626", fontSize: 16, fontWeight: "700" },
// });

// app/(shared)/video/AddVideo.tsx
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Video from "react-native-video";

import { uploadThumbnailToS3 } from "@/app/api/uploadThumbnailToS3";
import { uploadVideoToS3 } from "@/app/api/uploadVideoToS3";
import { postsService } from "@/app/services/postsService";
import { compressVideoIfNeeded } from "@/app/utils/compressVideoIfNeeded";
import { useAuth } from "@/contexts/AuthContext";

/* ---------- SAFE ID GENERATOR ---------- */
const generatePostId = () =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export default function AddVideo() {
  const { user } = useAuth();
  const role = user?.role ?? "user";

  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔥 NEW: progress + cancel */
  const [progress, setProgress] = useState<number>(0);
  const uploadTaskRef = useRef<any>(null);
  const postIdRef = useRef<string | null>(null);

  /* ---------- THUMBNAIL STATE ---------- */

  const [frames, setFrames] = useState<{ uri: string; time: number }[]>([]);

  const [selectedThumbnail, setSelectedThumbnail] = useState<{
    type: "frame" | "custom";
    uri: string;
    frameTime?: number;
  } | null>(null);

  const [customThumbnailUri, setCustomThumbnailUri] = useState<string | null>(
    null
  );

  /* ---------- PERMISSION ---------- */

  if (role !== "admin" && role !== "monitor") {
    return (
      <SafeAreaView style={styles.denied}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.deniedText}>
          You are not allowed to upload videos
        </Text>
      </SafeAreaView>
    );
  }

  /* ---------- FRAME GENERATION ---------- */

  const generateFrames = async (uri: string) => {
    try {
      const times = [0.5, 1.5, 2.5, 3.5, 4.5];

      const results = await Promise.all(
        times.map(async (t) => {
          const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(
            uri,
            { time: t * 1000 }
          );
          return { uri: thumbUri, time: t };
        })
      );

      setFrames(results);

      setSelectedThumbnail({
        type: "frame",
        uri: results[0].uri,
        frameTime: results[0].time,
      });
    } catch (e) {
      console.warn("Frame generation failed", e);
    }
  };

  /* ---------- PICK VIDEO ---------- */

  const pickVideo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!res.canceled) {
      const uri = res.assets[0].uri;
      setVideoUri(uri);
      setFrames([]);
      setSelectedThumbnail(null);
      setCustomThumbnailUri(null);
      setProgress(0);
      generateFrames(uri);
    }
  };

  /* ---------- PICK CUSTOM THUMBNAIL ---------- */

  const pickCustomThumbnail = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: true,
      aspect: [9, 16],
    });

    if (!res.canceled) {
      const uri = res.assets[0].uri;
      setCustomThumbnailUri(uri);
      setSelectedThumbnail({ type: "custom", uri });
    }
  };

  /* ---------- UPLOAD ---------- */

  const handleUpload = async () => {
    if (!videoUri || !user || !title.trim() || !selectedThumbnail) {
      Alert.alert(
        "Missing info",
        "Please select a video, thumbnail and add a caption."
      );
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const postId = generatePostId();
      postIdRef.current = postId;

      // 🔥 compression with progress
      const compressed = await compressVideoIfNeeded(videoUri, (p) => {
        setProgress(Math.round(p * 0.4));
      });

      // 🔥 upload with progress + cancel support
      const { videoUrl, key } = await uploadVideoToS3({
        localUri: compressed.uri,
        userId: user.uid,
        postId,
        onProgress: (p) => {
          setProgress(40 + Math.round(p * 0.6));
        },
        onTask: (task) => {
          uploadTaskRef.current = task;
        },
      });

      // upload thumbnail (unchanged)
      const { thumbnailUrl } = await uploadThumbnailToS3({
        localUri: selectedThumbnail.uri,
        userId: user.uid,
        postId,
      });

      // save post (unchanged)
      await postsService.createPost({
        id: postId,
        type: "video",
        title,
        ownerId: user.uid,
        ownerName: user.fullName,
        ownerRole: role,
        media: [
          {
            type: "video",

            url: videoUrl,
            publicId: key,
            s3Key: key,
            thumbnailUrl,
            thumbnailType: selectedThumbnail.type,
            frameTime: selectedThumbnail.frameTime ?? null,
            order: 0,
          },
        ],
        allowComments: true,
        allowLikes: true,
        allowShares: true,
      });

      Alert.alert("Success", "Video uploaded successfully 🎉");

      setTitle("");
      setVideoUri(null);
      setFrames([]);
      setSelectedThumbnail(null);
      setCustomThumbnailUri(null);
      setProgress(0);
    } catch (err: any) {
      Alert.alert("Upload failed", err?.message ?? "Something went wrong");
    }

    setLoading(false);
  };

  /* ---------- CANCEL ---------- */

  const cancelUpload = async () => {
    try {
      await uploadTaskRef.current?.cancelAsync();
      setLoading(false);
      setProgress(0);
      Alert.alert("Cancelled", "Upload cancelled");
    } catch {}
  };

  /* ---------- UI ---------- */

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Upload Video</Text>

        <TextInput
          placeholder="Write a caption..."
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          maxLength={120}
        />

        <TouchableOpacity style={styles.pickBtn} onPress={pickVideo}>
          <Ionicons name="videocam-outline" size={22} color="#fff" />
          <Text style={styles.pickText}>
            {videoUri ? "Change Video" : "Pick Video"}
          </Text>
        </TouchableOpacity>

        {videoUri && (
          <View style={styles.previewCard}>
            <Video
              source={{ uri: videoUri }}
              style={styles.preview}
              resizeMode="contain"
              controls
            />
          </View>
        )}

        {/* 🔥 Progress UI */}
        {loading && (
          <View style={{ marginTop: 16 }}>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>

            <TouchableOpacity onPress={cancelUpload}>
              <Text style={styles.cancelText}>Cancel Upload</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Thumbnail selector (UNCHANGED) */}
        {videoUri && (
          <View style={styles.thumbSection}>
            <Text style={styles.sectionTitle}>Thumbnail</Text>

            {selectedThumbnail && (
              <View style={styles.selectedThumb}>
                <Image
                  source={{ uri: selectedThumbnail.uri }}
                  style={styles.selectedThumbImg}
                />
              </View>
            )}

            <View style={styles.frameRow}>
              {frames.map((f) => {
                const selected = selectedThumbnail?.uri === f.uri;
                return (
                  <TouchableOpacity
                    key={f.uri}
                    onPress={() =>
                      setSelectedThumbnail({
                        type: "frame",
                        uri: f.uri,
                        frameTime: f.time,
                      })
                    }
                    style={[styles.frameItem, selected && styles.frameSelected]}
                  >
                    <Image source={{ uri: f.uri }} style={styles.frameImg} />
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.customThumbBtn}
              onPress={pickCustomThumbnail}
            >
              <Ionicons name="image-outline" size={20} color="#2563EB" />
              <Text style={styles.customThumbText}>Upload custom image</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          disabled={loading}
          onPress={handleUpload}
          style={[styles.uploadBtn, loading && { opacity: 0.6 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.uploadText}>Upload Video</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FBFF" },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 140,
  },
  header: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#fff",
    marginBottom: 14,
  },
  pickBtn: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  pickText: { color: "#fff", fontWeight: "700" },
  previewCard: { backgroundColor: "#000", borderRadius: 16 },
  preview: { width: "100%", height: 260 },
  progressBarBg: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#34C759",
  },
  progressText: { marginTop: 6, fontWeight: "700" },
  cancelText: {
    marginTop: 8,
    color: "#DC2626",
    fontWeight: "700",
    textAlign: "center",
  },
  thumbSection: { marginTop: 16 },
  sectionTitle: { fontWeight: "700", marginBottom: 8 },
  selectedThumb: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
    marginBottom: 12,
  },
  selectedThumbImg: { width: "100%", height: "100%" },
  frameRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  frameItem: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: "hidden",
  },
  frameSelected: { borderColor: "#007AFF", borderWidth: 2 },
  frameImg: { width: "100%", height: "100%" },
  customThumbBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  customThumbText: { color: "#2563EB", fontWeight: "700" },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  uploadBtn: {
    backgroundColor: "#34C759",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  uploadText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  denied: { flex: 1, justifyContent: "center", alignItems: "center" },
  deniedText: { color: "#DC2626", fontSize: 16, fontWeight: "700" },
});
