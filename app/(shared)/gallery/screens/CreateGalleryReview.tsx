// // app/(monitor)/(tabs)/CreateGalleryReview.tsx

// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { serverTimestamp } from "firebase/firestore";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Modal,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import DraggableFlatList, {
//   RenderItemParams,
// } from "react-native-draggable-flatlist";
// import { uploadImageToCloudinary } from "../../../api/uploadImage";
// import { foldersService } from "../../../services/foldersService";
// import { postsService } from "../../../services/postsService";

// type ImageItem = {
//   key: string;
//   localPath: string;
//   order: number;
// };

// type UploadedMedia = {
//   url: string;
//   publicId: string;
//   order: number;
// };

// export default function CreateGalleryReview() {
//   const params = useLocalSearchParams();
//   const router = useRouter();

//   const incoming = params.images
//     ? (JSON.parse(String(params.images)) as any[])
//     : [];

//   const [items, setItems] = useState<ImageItem[]>(
//     incoming.map((it: any, idx: number) => ({
//       key: `${Date.now()}-${idx}`,
//       localPath: it.localPath || it.uri || it.path || it,
//       order: idx,
//     }))
//   );

//   const [description, setDescription] = useState("");
//   const [tagsText, setTagsText] = useState("");

//   const [createFolderMode, setCreateFolderMode] = useState(false);
//   const [folderName, setFolderName] = useState("");
//   const [folderDescription, setFolderDescription] = useState("");

//   const [selectedFolder, setSelectedFolder] = useState<any | null>(null);
//   const [existingFolders, setExistingFolders] = useState<any[]>([]);
//   const [showFolderModal, setShowFolderModal] = useState(false);

//   const [thumbnailIndex, setThumbnailIndex] = useState(0);
//   const [posting, setPosting] = useState(false);

//   // Engagement toggles (default true)
//   const [allowLikes, setAllowLikes] = useState(true);
//   const [allowComments, setAllowComments] = useState(true);
//   const [allowShares, setAllowShares] = useState(true);

//   // const user = auth.currentUser;
//   const { user } = useAuth();
//   const createdById = user?.uid ?? "unknown";
//   const createdByName = user?.fullName ?? "User";
//   const createdByRole = user?.role;

//   // Load existing folders for this user
//   useEffect(() => {
//     (async () => {
//       try {
//         const all = await foldersService.getAllFolders();
//         const mine = all.filter((f) => f.createdById === createdById);
//         setExistingFolders(mine);
//       } catch (err) {
//         console.warn("Failed to load folders", err);
//       }
//     })();
//   }, [createdById]);

//   // parse tags
//   const tagsArray = useMemo(() => {
//     return tagsText
//       .split(/[,\s]+/)
//       .map((t) => t.trim())
//       .filter(Boolean)
//       .map((t) => (t.startsWith("#") ? t : `#${t}`));
//   }, [tagsText]);

//   // draggable thumbnail render
//   const renderThumb = useCallback(
//     ({ item, drag, getIndex }: RenderItemParams<ImageItem>) => {
//       const idx = getIndex?.() ?? 0;
//       return (
//         <TouchableOpacity
//           onLongPress={drag}
//           onPress={() => setThumbnailIndex(idx)}
//           style={[
//             styles.thumbBox,
//             thumbnailIndex === idx && { borderColor: Colors.primary },
//           ]}
//         >
//           <Image source={{ uri: item.localPath }} style={styles.thumbImage} />
//         </TouchableOpacity>
//       );
//     },
//     [thumbnailIndex]
//   );

//   // select existing folder -> clear createFolderMode
//   const selectFolder = (folder: any) => {
//     setSelectedFolder(folder);
//     setCreateFolderMode(false);
//     setFolderName(folder.name || folder.folderName || "");
//     setFolderDescription(folder.description || folder.folderDescription || "");
//     setShowFolderModal(false);
//   };

//   // toggle create folder -> clear selectedFolder when turning on
//   const onToggleCreateFolder = (value: boolean) => {
//     setCreateFolderMode(value);
//     if (value) {
//       setSelectedFolder(null);
//     }
//   };

//   // main submit handler
//   const onSubmit = async () => {
//     if (!items.length) {
//       Alert.alert("No images selected");
//       return;
//     }

//     if (createFolderMode && !folderName.trim()) {
//       Alert.alert("Please enter folder name");
//       return;
//     }

//     setPosting(true);

//     try {
//       let folderId: string | null = null;

//       // handle existing folder / create folder
//       if (selectedFolder) {
//         const fid = selectedFolder.id; // narrowed to string

//         if (
//           (folderDescription || "") !==
//           (selectedFolder.folderDescription || selectedFolder.description || "")
//         ) {
//           await foldersService.updateFolder(fid, {
//             description: folderDescription || "",
//           });
//         }

//         folderId = fid;
//       } else if (createFolderMode) {
//         folderId = await foldersService.createFolder({
//           name: folderName,
//           description: folderDescription,
//           createdById,
//           createdByName,
//           createdByRole: "monitor",
//         });
//       }

//       // upload images sequentially
//       const uploaded: UploadedMedia[] = [];

//       for (let i = 0; i < items.length; i++) {
//         const it = items[i];
//         const segment = folderId
//           ? `${createdById}/${folderId}`
//           : `${createdById}/posts`;

//         const up = await uploadImageToCloudinary(it.localPath, {
//           folderPath: segment,
//         });

//         if (!up) throw new Error("Upload failed");

//         // uploadImageToCloudinary returns { url, publicId } per your uploader
//         const url = up.url;
//         const publicId = up.publicId;

//         uploaded.push({
//           url,
//           publicId,
//           order: it.order ?? i,
//         });
//       }

//       // add images to folder if folderId
//       if (folderId) {
//         for (let i = 0; i < uploaded.length; i++) {
//           const u = uploaded[i];
//           await foldersService.addImageToFolder(folderId, {
//             url: u.url,
//             publicId: u.publicId,
//             order: u.order ?? i,
//             createdAt: serverTimestamp() as any,
//           } as any);
//           await foldersService.incrementImageCount(folderId);
//         }

//         // set thumbnail (selected or fallback)
//         let thumbIndex = thumbnailIndex;
//         if (thumbIndex < 0 || thumbIndex >= uploaded.length) thumbIndex = 0;
//         const thumbUrl = uploaded[thumbIndex]?.url ?? uploaded[0]?.url;
//         if (thumbUrl) {
//           await foldersService.updateFolderThumbnail(folderId, thumbUrl);
//         }
//       }

//       // create post payload (folder posts include title)
//       const sortedMedia = uploaded
//         .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
//         .map((u) => ({
//           url: u.url,
//           publicId: u.publicId,
//           type: "image",
//         }));

//       const postPayload: any = {
//         ownerId: createdById,
//         ownerName: createdByName,
//         ownerRole: createdByRole,
//         description: description || "",
//         media: sortedMedia,
//         allowLikes,
//         allowComments,
//         allowShares,
//         tags: tagsArray,
//         createdAt: serverTimestamp(),
//         folderId: folderId ?? null,
//       };

//       if (folderId) {
//         postPayload.type = "event";
//         postPayload.title = folderName; // only for folder posts
//       } else {
//         postPayload.type = "post";
//       }

//       await postsService.createPost(postPayload);

//       setPosting(false);
//       router.replace("/(shared)/gallery/screens/GalleryList");
//     } catch (err) {
//       console.error("CreateGalleryReview - submit error", err);
//       setPosting(false);
//       Alert.alert("Upload failed", String(err?.message || err));
//     }
//   };

//   return (
//     <SafeAreaView
//       style={[
//         styles.safe,
//         Platform.OS === "android" ? { paddingTop: 8 } : null,
//       ]}
//     >
//       <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 160 }}>
//         <Text style={styles.heading}>Arrange Images</Text>
//         <Text style={styles.subText}>Long press & drag to reorder</Text>

//         <View style={{ height: 150, marginTop: 12 }}>
//           <DraggableFlatList
//             data={items}
//             horizontal
//             onDragEnd={({ data }) =>
//               setItems(
//                 data.map((d: ImageItem, idx: number) => ({ ...d, order: idx }))
//               )
//             }
//             keyExtractor={(it) => it.key}
//             renderItem={renderThumb}
//             contentContainerStyle={styles.thumbList}
//           />
//         </View>

//         {(createFolderMode || selectedFolder) && (
//           <View style={styles.sectionCard}>
//             <Text style={styles.label}>Folder Thumbnail</Text>
//             <Image
//               source={{ uri: items[thumbnailIndex]?.localPath }}
//               style={styles.mainThumbnail}
//             />
//             <Text style={[styles.subText, { marginTop: 10 }]}>
//               Tap an image below to change thumbnail
//             </Text>

//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               style={{ marginTop: 10 }}
//             >
//               {items.map((it, i) => (
//                 <TouchableOpacity
//                   key={it.key}
//                   onPress={() => setThumbnailIndex(i)}
//                   style={[
//                     styles.smallThumb,
//                     thumbnailIndex === i && {
//                       borderColor: Colors.primary,
//                       borderWidth: 2,
//                     },
//                   ]}
//                 >
//                   <Image
//                     source={{ uri: it.localPath }}
//                     style={{ width: 70, height: 70, borderRadius: 8 }}
//                   />
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         <View style={styles.sectionCard}>
//           <View style={styles.rowBetween}>
//             <View style={styles.row}>
//               <Switch
//                 value={createFolderMode}
//                 onValueChange={onToggleCreateFolder}
//               />
//               <Text style={styles.switchLabel}>Create new folder</Text>
//             </View>

//             {!createFolderMode && (
//               <TouchableOpacity
//                 style={styles.selectFolderBtn}
//                 onPress={() => setShowFolderModal(true)}
//               >
//                 <Text style={styles.selectFolderText}>
//                   Select existing folder
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {(createFolderMode || selectedFolder) && (
//             <>
//               <Text style={styles.label}>Folder Name</Text>
//               <TextInput
//                 style={styles.input}
//                 value={folderName}
//                 onChangeText={setFolderName}
//                 placeholder="Enter folder name"
//               />

//               <Text style={styles.label}>Folder Description</Text>
//               <TextInput
//                 style={[styles.input, { height: 90 }]}
//                 value={folderDescription}
//                 onChangeText={setFolderDescription}
//                 placeholder="Add folder description"
//                 multiline
//               />
//             </>
//           )}
//         </View>

//         <View style={styles.sectionCard}>
//           <Text style={styles.label}>Post Description</Text>
//           <TextInput
//             style={[styles.input, { height: 120 }]}
//             value={description}
//             onChangeText={setDescription}
//             placeholder="Write something about this post..."
//             multiline
//           />
//         </View>

//         <View style={styles.sectionCard}>
//           <Text style={styles.label}>Tags</Text>
//           <TextInput
//             style={styles.input}
//             value={tagsText}
//             onChangeText={setTagsText}
//             placeholder="Add tags e.g. #trip #city"
//           />
//         </View>

//         <View style={styles.sectionCard}>
//           <Text style={styles.label}>Engagement Options</Text>

//           <View style={{ marginTop: 10 }}>
//             <View style={styles.toggleRow}>
//               <Text style={styles.toggleLabel}>Allow Likes</Text>
//               <Switch value={allowLikes} onValueChange={setAllowLikes} />
//             </View>

//             <View style={styles.toggleRow}>
//               <Text style={styles.toggleLabel}>Allow Comments</Text>
//               <Switch value={allowComments} onValueChange={setAllowComments} />
//             </View>

//             <View style={styles.toggleRow}>
//               <Text style={styles.toggleLabel}>Allow Shares</Text>
//               <Switch value={allowShares} onValueChange={setAllowShares} />
//             </View>
//           </View>
//         </View>

//         <View style={styles.bottomButtons}>
//           <TouchableOpacity
//             style={[styles.btn, { backgroundColor: Colors.primary }]}
//             onPress={onSubmit}
//             disabled={posting}
//           >
//             {posting ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.btnText}>Post</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <Modal
//         visible={showFolderModal}
//         animationType="slide"
//         onRequestClose={() => setShowFolderModal(false)}
//       >
//         <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Select Folder</Text>
//             <TouchableOpacity onPress={() => setShowFolderModal(false)}>
//               <Text style={{ color: Colors.primary }}>Close</Text>
//             </TouchableOpacity>
//           </View>

//           <ScrollView contentContainerStyle={{ padding: 12 }}>
//             {existingFolders.length === 0 ? (
//               <View style={{ alignItems: "center", marginTop: 40 }}>
//                 <Text style={{ color: Colors.textSecondary }}>
//                   No folders yet
//                 </Text>
//               </View>
//             ) : (
//               existingFolders.map((f) => (
//                 <TouchableOpacity
//                   key={f.id}
//                   onPress={() => selectFolder(f)}
//                   style={{ marginBottom: 12 }}
//                 >
//                   <View style={styles.folderRow}>
//                     <Image
//                       source={{ uri: f.thumbnailUrl || undefined }}
//                       style={styles.folderThumb}
//                     />
//                     <View style={{ flex: 1, marginLeft: 10 }}>
//                       <Text style={styles.folderName}>
//                         {f.name || "Untitled"}
//                       </Text>
//                       <Text style={styles.folderDesc} numberOfLines={2}>
//                         {f.description || "No description"}
//                       </Text>
//                       <Text style={styles.folderMeta}>
//                         {(f.numberOfImages || 0) + " images"}
//                       </Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               ))
//             )}
//           </ScrollView>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* STYLES */
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: Colors.background },

//   heading: { fontSize: 18, fontWeight: "700", color: Colors.textPrimary },
//   subText: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },

//   sectionCard: {
//     marginTop: 18,
//     backgroundColor: Colors.card,
//     padding: 14,
//     borderRadius: 12,
//     shadowColor: Colors.shadow,
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//   },

//   label: {
//     color: Colors.textPrimary,
//     fontWeight: "600",
//     marginBottom: 6,
//     fontSize: 14,
//   },

//   input: {
//     backgroundColor: Colors.lightCard,
//     borderColor: Colors.border,
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 8,
//     color: Colors.textPrimary,
//     fontSize: 15,
//   },

//   toggleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 10,
//   },

//   toggleLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: "500" },

//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   row: { flexDirection: "row", alignItems: "center" },

//   switchLabel: { marginLeft: 8, color: Colors.textPrimary },

//   selectFolderBtn: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderColor: Colors.border,
//     borderWidth: 1,
//   },
//   selectFolderText: { color: Colors.primary, fontWeight: "600" },

//   thumbList: { alignItems: "center", paddingHorizontal: 6 },
//   thumbBox: {
//     marginHorizontal: 6,
//     borderRadius: 12,
//     overflow: "hidden",
//     borderWidth: 2,
//     borderColor: "transparent",
//   },
//   thumbImage: { width: 100, height: 100, borderRadius: 10 },

//   mainThumbnail: {
//     width: 140,
//     height: 140,
//     borderRadius: 12,
//     alignSelf: "center",
//     marginTop: 10,
//     backgroundColor: Colors.surface,
//   },
//   smallThumb: {
//     marginRight: 10,
//     borderRadius: 8,
//     overflow: "hidden",
//     marginTop: 12,
//   },

//   bottomButtons: {
//     marginTop: 24,
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   btn: {
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 10,
//     alignItems: "center",
//     marginHorizontal: 8,
//   },

//   btnText: { color: Colors.textInverse, fontWeight: "700", fontSize: 15 },

//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 14,
//   },
//   modalTitle: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary },

//   folderRow: {
//     flexDirection: "row",
//     backgroundColor: Colors.lightCard,
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   folderThumb: {
//     width: 72,
//     height: 72,
//     borderRadius: 10,
//     backgroundColor: Colors.surface,
//   },
//   folderName: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary },
//   folderDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
//   folderMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
// });

// // app/(monitor)/(tabs)/CreateGalleryReview.tsx
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { serverTimestamp } from "firebase/firestore";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Modal,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import DraggableFlatList, {
//   RenderItemParams,
// } from "react-native-draggable-flatlist";
// import { uploadImageToCloudinary } from "../../../api/uploadImage";
// import { foldersService } from "../../../services/foldersService";
// import { postsService } from "../../../services/postsService";

// type ImageItem = {
//   key: string;
//   localPath: string; // uri or url
//   order: number;
//   isNew?: boolean; // new image (needs upload)
//   publicId?: string; // if existing
//   url?: string; // original url if existing
// };

// type UploadedMedia = {
//   url: string;
//   publicId: string;
//   order: number;
// };

// export default function CreateGalleryReview() {
//   const params = useLocalSearchParams();
//   const router = useRouter();

//   const incoming = params.images
//     ? (JSON.parse(String(params.images)) as any[])
//     : [];

//   const postId = (params.postId as string) || null;

//   const isEditing = !!postId;

//   const [items, setItems] = useState<ImageItem[]>(
//     incoming.map((it: any, idx: number) => ({
//       key: `${Date.now()}-${idx}`,
//       localPath: it.localPath || it.uri || it.path || it,
//       order: idx,
//       isNew: true,
//     }))
//   );

//   const [description, setDescription] = useState("");
//   const [tagsText, setTagsText] = useState("");

//   const [createFolderMode, setCreateFolderMode] = useState(false);
//   const [folderName, setFolderName] = useState("");
//   const [folderDescription, setFolderDescription] = useState("");

//   const [selectedFolder, setSelectedFolder] = useState<any | null>(null);
//   const [existingFolders, setExistingFolders] = useState<any[]>([]);
//   const [showFolderModal, setShowFolderModal] = useState(false);

//   const [thumbnailIndex, setThumbnailIndex] = useState(0);
//   const [posting, setPosting] = useState(false);

//   // Engagement toggles (default true)
//   const [allowLikes, setAllowLikes] = useState(true);
//   const [allowComments, setAllowComments] = useState(true);
//   const [allowShares, setAllowShares] = useState(true);

//   // mapping publicId -> folderImageDocId (used when post belongs to a folder)
//   const [folderImageMap, setFolderImageMap] = useState<Record<string, string>>(
//     {}
//   );

//   const { user } = useAuth();
//   const createdById = user?.uid ?? "unknown";
//   const createdByName = user?.fullName ?? "User";
//   const createdByRole = user?.role ?? "monitor";
//   const { back } = router;

//   // Load existing folders for this user
//   useEffect(() => {
//     (async () => {
//       try {
//         const all = await foldersService.getAllFolders();
//         const mine = all.filter((f) => f.createdById === createdById);
//         setExistingFolders(mine);
//       } catch (err) {
//         console.warn("Failed to load folders", err);
//       }
//     })();
//   }, [createdById]);

//   // If editing, load post and prefill
//   useEffect(() => {
//     if (!isEditing || !postId) return;

//     (async () => {
//       try {
//         const post = await postsService.getPost(postId);
//         if (!post) {
//           Alert.alert("Post not found");
//           back();
//           return;
//         }

//         setDescription(post.description ?? "");
//         setTagsText((post.tags ?? []).join(" "));
//         setAllowLikes(post.allowLikes ?? true);
//         setAllowComments(post.allowComments ?? true);
//         setAllowShares(post.allowShares ?? true);

//         if (post.folderId) {
//           const folder = await foldersService.getFolder(post.folderId);
//           if (folder) {
//             setSelectedFolder(folder);
//             setFolderName(folder.name || "");
//             setFolderDescription(folder.description || "");
//           }

//           const folderImages = await foldersService.getFolderImages(
//             post.folderId
//           );
//           const map: Record<string, string> = {};
//           folderImages.forEach((fi) => {
//             if (fi.publicId) map[fi.publicId] = fi.id;
//           });
//           setFolderImageMap(map);
//         }

//         const existingItems: ImageItem[] = (post.media ?? []).map(
//           (m: any, idx: number) => ({
//             key: `existing-${m.publicId}-${idx}`,
//             localPath: m.url,
//             url: m.url,
//             publicId: m.publicId,
//             order: m.order ?? idx,
//             isNew: false,
//           })
//         );

//         setItems(existingItems);
//         setThumbnailIndex(0);
//       } catch (err) {
//         console.error("Failed to load post for edit", err);
//         Alert.alert("Failed to load post");
//         back();
//       }
//     })();
//   }, [isEditing, postId, back]);

//   // parse tags
//   const tagsArray = useMemo(() => {
//     return tagsText
//       .split(/[,\s]+/)
//       .map((t) => t.trim())
//       .filter(Boolean)
//       .map((t) => (t.startsWith("#") ? t : `#${t}`));
//   }, [tagsText]);

//   // draggable thumbnail render
//   const renderThumb = useCallback(
//     ({ item, drag, getIndex }: RenderItemParams<ImageItem>) => {
//       const idx = getIndex?.() ?? 0;
//       return (
//         <TouchableOpacity
//           onLongPress={drag}
//           onPress={() => setThumbnailIndex(idx)}
//           style={[
//             styles.thumbBox,
//             thumbnailIndex === idx && { borderColor: Colors.primary },
//           ]}
//         >
//           <Image source={{ uri: item.localPath }} style={styles.thumbImage} />
//         </TouchableOpacity>
//       );
//     },
//     [thumbnailIndex]
//   );

//   // select existing folder -> clear createFolderMode
//   const selectFolder = (folder: any) => {
//     setSelectedFolder(folder);
//     setCreateFolderMode(false);
//     setFolderName(folder.name || folder.folderName || "");
//     setFolderDescription(folder.description || folder.folderDescription || "");
//     setShowFolderModal(false);
//   };

//   // toggle create folder -> clear selectedFolder when turning on
//   const onToggleCreateFolder = (value: boolean) => {
//     setCreateFolderMode(value);
//     if (value) {
//       setSelectedFolder(null);
//     }
//   };

//   // remove an item (either existing or new)
//   const removeItem = (key: string) => {
//     setItems((prev) => prev.filter((it) => it.key !== key));
//   };

//   // main submit handler
//   const onSubmit = async () => {
//     if (!items.length) {
//       Alert.alert("No images selected");
//       return;
//     }

//     if (createFolderMode && !folderName.trim()) {
//       Alert.alert("Please enter folder name");
//       return;
//     }

//     setPosting(true);

//     try {
//       let folderId: string | null = null;
//       let originalFolderId: string | null = null;

//       // If editing, fetch original post folderId to compare deletions
//       let originalMediaPublicIds: string[] = [];
//       if (isEditing && postId) {
//         const originalPost = await postsService.getPost(postId);
//         originalFolderId = originalPost?.folderId ?? null;
//         originalMediaPublicIds = (originalPost?.media ?? []).map(
//           (m: any) => m.publicId
//         );
//       }

//       // handle existing folder / create folder (same as create flow)
//       if (selectedFolder) {
//         const fid = selectedFolder.id; // narrowed to string

//         if (
//           (folderDescription || "") !==
//           (selectedFolder.folderDescription || selectedFolder.description || "")
//         ) {
//           await foldersService.updateFolder(fid, {
//             description: folderDescription || "",
//           });
//         }

//         folderId = fid;
//       } else if (createFolderMode) {
//         folderId = await foldersService.createFolder({
//           name: folderName,
//           description: folderDescription,
//           createdById,
//           createdByName,
//           createdByRole: "monitor",
//         });
//       } else if (isEditing) {
//         // keep existing originalFolderId if not changed
//         folderId = originalFolderId;
//       }

//       // Find items that are new (isNew === true) and upload them
//       const uploaded: UploadedMedia[] = [];
//       for (let i = 0; i < items.length; i++) {
//         const it = items[i];
//         if (!it.isNew) continue;

//         const segment = folderId
//           ? `${createdById}/${folderId}`
//           : `${createdById}/posts`;

//         const up = await uploadImageToCloudinary(it.localPath, {
//           folderPath: segment,
//         });

//         if (!up) throw new Error("Upload failed");

//         uploaded.push({
//           url: up.url,
//           publicId: up.publicId,
//           order: it.order ?? i,
//         });
//       }

//       // If folderId exists, add newly uploaded images to folder subcollection
//       if (folderId && uploaded.length) {
//         for (let i = 0; i < uploaded.length; i++) {
//           const u = uploaded[i];
//           await foldersService.addImageToFolder(folderId, {
//             url: u.url,
//             publicId: u.publicId,
//             order: u.order ?? i,
//             createdAt: serverTimestamp() as any,
//           } as any);
//           await foldersService.incrementImageCount(folderId);
//         }

//         // update thumbnail if needed
//         let thumbIndex = thumbnailIndex;
//         if (thumbIndex < 0 || thumbIndex >= items.length) thumbIndex = 0;
//         const thumbUrl = items[thumbIndex]?.localPath || uploaded[0]?.url;
//         if (thumbUrl) {
//           await foldersService.updateFolderThumbnail(folderId, thumbUrl);
//         }
//       }

//       // Build final media array (preserve order)
//       // For existing items keep url & publicId, for new items use uploaded result
//       const finalMedia: { url: string; publicId: string; order: number }[] = [];
//       for (let i = 0; i < items.length; i++) {
//         const it = items[i];
//         if (!it.isNew) {
//           finalMedia.push({
//             url: it.url ?? it.localPath,
//             publicId: it.publicId ?? "",
//             order: it.order ?? i,
//           });
//         } else {
//           // find uploaded result for this order / index by matching order or position
//           // uploaded items were pushed in the same order as items iteration above
//           // So we'll shift from uploaded list (simple pointer)
//         }
//       }

//       // To correctly match uploaded entries, create pointer
//       let uploadPtr = 0;
//       for (let i = 0; i < items.length; i++) {
//         const it = items[i];
//         if (it.isNew) {
//           const u = uploaded[uploadPtr++];
//           finalMedia.splice(i, 0, {
//             url: u.url,
//             publicId: u.publicId,
//             order: it.order ?? i,
//           });
//         }
//       }

//       // Sanity: ensure order fields are normalized
//       const normalizedMedia = finalMedia
//         .map((m, idx) => ({ ...m, order: idx }))
//         .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

//       // If editing: find removed existing images and delete their folder docs (if applicable)
//       if (isEditing) {
//         const remainingPublicIds = normalizedMedia.map((m) => m.publicId);
//         const removed = originalMediaPublicIds.filter(
//           (p) => !remainingPublicIds.includes(p)
//         );

//         // If original post belonged to a folder, try to remove the image docs from folder subcollection
//         if (originalFolderId && removed.length) {
//           for (const remPub of removed) {
//             const docId = folderImageMap[remPub];
//             if (docId) {
//               // delete subcollection document
//               await foldersService.deleteImage(originalFolderId, docId);
//             }
//             // NOTE: Cloudinary file remains unless you have a server-side endpoint to remove by publicId.
//             // If you have such an endpoint, call it here to clean up storage.
//           }

//           // TODO: optionally decrement numberOfImages in folder (not done automatically here)
//         }
//       }

//       // Prepare post payload
//       const postPayload: any = {
//         ownerId: createdById,
//         ownerName: createdByName,
//         ownerRole: createdByRole,
//         description: description || "",
//         media: normalizedMedia,
//         allowLikes,
//         allowComments,
//         allowShares,
//         tags: tagsArray,
//         folderId: folderId ?? null,
//       };

//       if (folderId) {
//         postPayload.type = "event";
//         postPayload.title = folderName || null; // folder title
//       } else {
//         postPayload.type = "post";
//         postPayload.title = null;
//       }

//       if (isEditing && postId) {
//         await postsService.updatePost(postId, postPayload);
//       } else {
//         await postsService.createPost(postPayload);
//       }

//       setPosting(false);
//       router.replace("/(shared)/gallery/screens/GalleryList");
//     } catch (err) {
//       console.error("CreateGalleryReview - submit error", err);
//       setPosting(false);
//       Alert.alert("Upload failed", String(err?.message || err));
//     }
//   };

//   return (
//     <SafeAreaView
//       style={[
//         styles.safe,
//         Platform.OS === "android" ? { paddingTop: 8 } : null,
//       ]}
//     >
//       <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 160 }}>
//         <Text style={styles.heading}>Arrange Images</Text>
//         <Text style={styles.subText}>Long press & drag to reorder</Text>

//         <View style={{ height: 150, marginTop: 12 }}>
//           <DraggableFlatList
//             data={items}
//             horizontal
//             onDragEnd={({ data }) =>
//               setItems(
//                 data.map((d: ImageItem, idx: number) => ({ ...d, order: idx }))
//               )
//             }
//             keyExtractor={(it) => it.key}
//             renderItem={renderThumb}
//             contentContainerStyle={styles.thumbList}
//           />
//         </View>

//         {(createFolderMode || selectedFolder) && (
//           <View style={styles.sectionCard}>
//             <Text style={styles.label}>Folder Thumbnail</Text>
//             <Image
//               source={{ uri: items[thumbnailIndex]?.localPath }}
//               style={styles.mainThumbnail}
//             />
//             <Text style={[styles.subText, { marginTop: 10 }]}>
//               Tap an image below to change thumbnail
//             </Text>

//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               style={{ marginTop: 10 }}
//             >
//               {items.map((it, i) => (
//                 <TouchableOpacity
//                   key={it.key}
//                   onPress={() => setThumbnailIndex(i)}
//                   style={[
//                     styles.smallThumb,
//                     thumbnailIndex === i && {
//                       borderColor: Colors.primary,
//                       borderWidth: 2,
//                     },
//                   ]}
//                 >
//                   <Image
//                     source={{ uri: it.localPath }}
//                     style={{ width: 70, height: 70, borderRadius: 8 }}
//                   />
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         <View style={styles.sectionCard}>
//           <View style={styles.rowBetween}>
//             <View style={styles.row}>
//               <Switch
//                 value={createFolderMode}
//                 onValueChange={onToggleCreateFolder}
//               />
//               <Text style={styles.switchLabel}>Create new folder</Text>
//             </View>

//             {!createFolderMode && (
//               <TouchableOpacity
//                 style={styles.selectFolderBtn}
//                 onPress={() => setShowFolderModal(true)}
//               >
//                 <Text style={styles.selectFolderText}>
//                   Select existing folder
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {(createFolderMode || selectedFolder) && (
//             <>
//               <Text style={styles.label}>Folder Name</Text>
//               <TextInput
//                 style={styles.input}
//                 value={folderName}
//                 onChangeText={setFolderName}
//                 placeholder="Enter folder name"
//               />

//               <Text style={styles.label}>Folder Description</Text>
//               <TextInput
//                 style={[styles.input, { height: 90 }]}
//                 value={folderDescription}
//                 onChangeText={setFolderDescription}
//                 placeholder="Add folder description"
//                 multiline
//               />
//             </>
//           )}
//         </View>

//         <View style={styles.sectionCard}>
//           <Text style={styles.label}>Post Description</Text>
//           <TextInput
//             style={[styles.input, { height: 120 }]}
//             value={description}
//             onChangeText={setDescription}
//             placeholder="Write something about this post..."
//             multiline
//           />
//         </View>

//         <View style={styles.sectionCard}>
//           <Text style={styles.label}>Tags</Text>
//           <TextInput
//             style={styles.input}
//             value={tagsText}
//             onChangeText={setTagsText}
//             placeholder="Add tags e.g. #trip #city"
//           />
//         </View>

//         <View style={styles.sectionCard}>
//           <Text style={styles.label}>Engagement Options</Text>

//           <View style={{ marginTop: 10 }}>
//             <View style={styles.toggleRow}>
//               <Text style={styles.toggleLabel}>Allow Likes</Text>
//               <Switch value={allowLikes} onValueChange={setAllowLikes} />
//             </View>

//             <View style={styles.toggleRow}>
//               <Text style={styles.toggleLabel}>Allow Comments</Text>
//               <Switch value={allowComments} onValueChange={setAllowComments} />
//             </View>

//             <View style={styles.toggleRow}>
//               <Text style={styles.toggleLabel}>Allow Shares</Text>
//               <Switch value={allowShares} onValueChange={setAllowShares} />
//             </View>
//           </View>
//         </View>

//         <View style={styles.bottomButtons}>
//           <TouchableOpacity
//             style={[styles.btn, { backgroundColor: Colors.primary }]}
//             onPress={onSubmit}
//             disabled={posting}
//           >
//             {posting ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.btnText}>{isEditing ? "Save" : "Post"}</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <Modal
//         visible={showFolderModal}
//         animationType="slide"
//         onRequestClose={() => setShowFolderModal(false)}
//       >
//         <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Select Folder</Text>
//             <TouchableOpacity onPress={() => setShowFolderModal(false)}>
//               <Text style={{ color: Colors.primary }}>Close</Text>
//             </TouchableOpacity>
//           </View>

//           <ScrollView contentContainerStyle={{ padding: 12 }}>
//             {existingFolders.length === 0 ? (
//               <View style={{ alignItems: "center", marginTop: 40 }}>
//                 <Text style={{ color: Colors.textSecondary }}>
//                   No folders yet
//                 </Text>
//               </View>
//             ) : (
//               existingFolders.map((f) => (
//                 <TouchableOpacity
//                   key={f.id}
//                   onPress={() => selectFolder(f)}
//                   style={{ marginBottom: 12 }}
//                 >
//                   <View style={styles.folderRow}>
//                     <Image
//                       source={{ uri: f.thumbnailUrl || undefined }}
//                       style={styles.folderThumb}
//                     />
//                     <View style={{ flex: 1, marginLeft: 10 }}>
//                       <Text style={styles.folderName}>
//                         {f.name || "Untitled"}
//                       </Text>
//                       <Text style={styles.folderDesc} numberOfLines={2}>
//                         {f.description || "No description"}
//                       </Text>
//                       <Text style={styles.folderMeta}>
//                         {(f.numberOfImages || 0) + " images"}
//                       </Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               ))
//             )}
//           </ScrollView>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* STYLES */
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: Colors.background },

//   heading: { fontSize: 18, fontWeight: "700", color: Colors.textPrimary },
//   subText: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },

//   sectionCard: {
//     marginTop: 18,
//     backgroundColor: Colors.card,
//     padding: 14,
//     borderRadius: 12,
//     shadowColor: Colors.shadow,
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//   },

//   label: {
//     color: Colors.textPrimary,
//     fontWeight: "600",
//     marginBottom: 6,
//     fontSize: 14,
//   },

//   input: {
//     backgroundColor: Colors.lightCard,
//     borderColor: Colors.border,
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 8,
//     color: Colors.textPrimary,
//     fontSize: 15,
//   },

//   toggleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 10,
//   },

//   toggleLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: "500" },

//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   row: { flexDirection: "row", alignItems: "center" },

//   switchLabel: { marginLeft: 8, color: Colors.textPrimary },

//   selectFolderBtn: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderColor: Colors.border,
//     borderWidth: 1,
//   },
//   selectFolderText: { color: Colors.primary, fontWeight: "600" },

//   thumbList: { alignItems: "center", paddingHorizontal: 6 },
//   thumbBox: {
//     marginHorizontal: 6,
//     borderRadius: 12,
//     overflow: "hidden",
//     borderWidth: 2,
//     borderColor: "transparent",
//   },
//   thumbImage: { width: 100, height: 100, borderRadius: 10 },

//   mainThumbnail: {
//     width: 140,
//     height: 140,
//     borderRadius: 12,
//     alignSelf: "center",
//     marginTop: 10,
//     backgroundColor: Colors.surface,
//   },
//   smallThumb: {
//     marginRight: 10,
//     borderRadius: 8,
//     overflow: "hidden",
//     marginTop: 12,
//   },

//   bottomButtons: {
//     marginTop: 24,
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   btn: {
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 10,
//     alignItems: "center",
//     marginHorizontal: 8,
//   },

//   btnText: { color: Colors.textInverse, fontWeight: "700", fontSize: 15 },

//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 14,
//   },
//   modalTitle: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary },

//   folderRow: {
//     flexDirection: "row",
//     backgroundColor: Colors.lightCard,
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   folderThumb: {
//     width: 72,
//     height: 72,
//     borderRadius: 10,
//     backgroundColor: Colors.surface,
//   },
//   folderName: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary },
//   folderDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
//   folderMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
// });

// // app/(monitor)/(tabs)/CreateGalleryReview.tsx
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { serverTimestamp } from "firebase/firestore";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Modal,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import DraggableFlatList, {
//   RenderItemParams,
// } from "react-native-draggable-flatlist";
// import { uploadImageToCloudinary } from "../../../api/uploadImage";
// import { foldersService } from "../../../services/foldersService";
// import { postsService } from "../../../services/postsService";
// import { Feather } from "@expo/vector-icons";

// type ImageItem = {
//   key: string;
//   localPath: string; // uri or url
//   order: number;
//   isNew?: boolean; // new image (needs upload)
//   publicId?: string; // if existing
//   url?: string; // original url if existing
// };

// type UploadedMedia = {
//   url: string;
//   publicId: string;
//   order: number;
// };

// export default function CreateGalleryReview() {
//   const params = useLocalSearchParams();
//   const router = useRouter();

//   const incoming = params.images
//     ? (JSON.parse(String(params.images)) as any[])
//     : [];

//   // initial postId from params (may be null)
//   const initialPostId = (params.postId as string) || null;
//   const folderIdParam = (params.folderId as string) || null; // Option 2 usage

//   // make postId stateful so we can set it when we find post by folderId
//   const [postId, setPostId] = useState<string | null>(initialPostId);
//   const isEditing = !!postId;

//   const [items, setItems] = useState<ImageItem[]>(
//     incoming.map((it: any, idx: number) => ({
//       key: `${Date.now()}-${idx}`,
//       localPath: it.localPath || it.uri || it.path || it,
//       order: idx,
//       isNew: true,
//     }))
//   );

//   const [description, setDescription] = useState("");
//   const [tagsText, setTagsText] = useState("");

//   const [createFolderMode, setCreateFolderMode] = useState(false);
//   const [folderName, setFolderName] = useState("");
//   const [folderDescription, setFolderDescription] = useState("");

//   const [selectedFolder, setSelectedFolder] = useState<any | null>(null);
//   const [existingFolders, setExistingFolders] = useState<any[]>([]);
//   const [showFolderModal, setShowFolderModal] = useState(false);

//   const [thumbnailIndex, setThumbnailIndex] = useState(0);
//   const [posting, setPosting] = useState(false);

//   // Engagement toggles (default true)
//   const [allowLikes, setAllowLikes] = useState(true);
//   const [allowComments, setAllowComments] = useState(true);
//   const [allowShares, setAllowShares] = useState(true);

//   // mapping publicId -> folderImageDocId (used when post belongs to a folder)
//   const [folderImageMap, setFolderImageMap] = useState<Record<string, string>>(
//     {}
//   );

//   const { user } = useAuth();
//   const createdById = user?.uid ?? "unknown";
//   const createdByName = user?.fullName ?? "User";
//   const createdByRole = user?.role ?? "monitor";
//   const { back } = router;

//   //
//   // --- Load existing folders for this user (unchanged) ---
//   //
//   useEffect(() => {
//     (async () => {
//       try {
//         const all = await foldersService.getAllFolders();
//         const mine = all.filter((f) => f.createdById === createdById);
//         setExistingFolders(mine);
//       } catch (err) {
//         console.warn("Failed to load folders", err);
//       }
//     })();
//   }, [createdById]);

//   //
//   // If folderId param is present (Option 2), load folder + find linked post.
//   // This runs once on mount; if it finds a post it will set postId state,
//   // which triggers the edit-loading useEffect below.
//   //
//   useEffect(() => {
//     (async () => {
//       try {
//         if (!folderIdParam) return;

//         // load folder info to prefill folder fields even if there's no post yet
//         const folder = await foldersService.getFolder(folderIdParam);
//         if (folder) {
//           setSelectedFolder(folder);
//           setFolderName(folder.name || "");
//           setFolderDescription(folder.description || "");
//         }

//         // find linked post (posts store folderId) — assumption: 1 folder -> 1 post
//         const allPosts = await postsService.getAllPosts();
//         const linked = allPosts.find((p: any) => p.folderId === folderIdParam);
//         if (linked) {
//           // set postId so the existing edit loading effect runs
//           setPostId(linked.id ?? null);
//         } else {
//           // no post found => user can create a new post tied to this folder
//           setCreateFolderMode(false);
//         }
//       } catch (err) {
//         console.warn("Failed to load folder or linked post", err);
//       }
//     })();
//     // Only run once for the incoming param
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [folderIdParam]);

//   //
//   // If editing (postId state), load post and prefill (your original effect, slightly adapted)
//   //
//   useEffect(() => {
//     if (!isEditing || !postId) return;

//     (async () => {
//       try {
//         const post = await postsService.getPost(postId);
//         if (!post) {
//           Alert.alert("Post not found");
//           back();
//           return;
//         }

//         // Prefill simple fields
//         setDescription(post.description ?? "");
//         setTagsText((post.tags ?? []).join(" "));
//         setAllowLikes(post.allowLikes ?? true);
//         setAllowComments(post.allowComments ?? true);
//         setAllowShares(post.allowShares ?? true);

//         // If the post refers to a folder, load folder and folder-images mapping
//         if (post.folderId) {
//           const folder = await foldersService.getFolder(post.folderId);
//           if (folder) {
//             setSelectedFolder(folder);
//             setFolderName(folder.name || "");
//             setFolderDescription(folder.description || "");
//           }

//           const folderImages = await foldersService.getFolderImages(
//             post.folderId
//           );
//           const map: Record<string, string> = {};
//           folderImages.forEach((fi) => {
//             if (fi.publicId) map[fi.publicId] = fi.id;
//           });
//           setFolderImageMap(map);
//         }

//         // media -> populate items with existing images (isNew = false)
//         const existingItems: ImageItem[] = (post.media ?? []).map(
//           (m: any, idx: number) => ({
//             key: `existing-${m.publicId ?? idx}-${idx}`,
//             localPath: m.url,
//             url: m.url,
//             publicId: m.publicId,
//             order: m.order ?? idx,
//             isNew: false,
//           })
//         );

//         setItems(existingItems);
//         setThumbnailIndex(0);
//       } catch (err) {
//         console.error("Failed to load post for edit", err);
//         Alert.alert("Failed to load post");
//         back();
//       }
//     })();
//   }, [isEditing, postId, back]);

//   // parse tags
//   const tagsArray = useMemo(() => {
//     return tagsText
//       .split(/[,\s]+/)
//       .map((t) => t.trim())
//       .filter(Boolean)
//       .map((t) => (t.startsWith("#") ? t : `#${t}`));
//   }, [tagsText]);

//   // Determine the current folder id to operate on (if any)
//   const currentFolderId = selectedFolder?.id ?? folderIdParam ?? null;

//   // draggable thumbnail render with delete overlay
//   const renderThumb = useCallback(
//     ({ item, drag, getIndex }: RenderItemParams<ImageItem>) => {
//       const idx = getIndex?.() ?? 0;

//       const handleDeleteThumb = async () => {
//         // If it's an existing image tied to folder, delete its folder doc now
//         if (!item.isNew && item.publicId && currentFolderId) {
//           try {
//             const docId = folderImageMap[item.publicId];
//             if (docId) {
//               await foldersService.deleteImage(currentFolderId, docId);
//               await foldersService.decrementImageCount(currentFolderId);
//             }
//           } catch (err) {
//             console.warn("Failed to delete folder image doc", err);
//             Alert.alert("Failed to delete image");
//             return;
//           }
//         }

//         // remove from UI
//         removeItem(item.key);

//         // adjust thumbnailIndex if needed
//         setThumbnailIndex((prev) => {
//           if (prev === idx) return 0;
//           if (prev > idx) return prev - 1;
//           return prev;
//         });
//       };

//       return (
//         <View style={{ marginHorizontal: 6 }}>
//           <TouchableOpacity
//             onLongPress={drag}
//             onPress={() => setThumbnailIndex(idx)}
//             style={[
//               styles.thumbBox,
//               thumbnailIndex === idx && { borderColor: Colors.primary },
//             ]}
//           >
//             <Image source={{ uri: item.localPath }} style={styles.thumbImage} />
//             {/* delete btn overlay */}
//             <TouchableOpacity
//               onPress={handleDeleteThumb}
//               style={styles.thumbDeleteBtn}
//             >
//               <Feather name="x" size={16} color="#fff" />
//             </TouchableOpacity>
//           </TouchableOpacity>
//         </View>
//       );
//     },
//     [thumbnailIndex, currentFolderId, folderImageMap]
//   );

//   // select existing folder -> clear createFolderMode
//   const selectFolder = (folder: any) => {
//     setSelectedFolder(folder);
//     setCreateFolderMode(false);
//     setFolderName(folder.name || folder.folderName || "");
//     setFolderDescription(folder.description || folder.folderDescription || "");
//     setShowFolderModal(false);
//   };

//   // toggle create folder -> clear selectedFolder when turning on
//   const onToggleCreateFolder = (value: boolean) => {
//     setCreateFolderMode(value);
//     if (value) {
//       setSelectedFolder(null);
//     }
//   };

//   // remove an item (either existing or new)
//   const removeItem = (key: string) => {
//     setItems((prev) => prev.filter((it) => it.key !== key));
//   };

//   // main submit handler (keeps your original logic)
//   const onSubmit = async () => {
//     if (!items.length) {
//       Alert.alert("No images selected");
//       return;
//     }

//     if (createFolderMode && !folderName.trim()) {
//       Alert.alert("Please enter folder name");
//       return;
//     }

//     setPosting(true);

//     try {
//       let folderId: string | null = null;
//       let originalFolderId: string | null = null;

//       // If editing, fetch original post folderId to compare deletions
//       let originalMediaPublicIds: string[] = [];
//       if (isEditing && postId) {
//         const originalPost = await postsService.getPost(postId);
//         originalFolderId = originalPost?.folderId ?? null;
//         originalMediaPublicIds = (originalPost?.media ?? []).map(
//           (m: any) => m.publicId
//         );
//       }

//       // handle existing folder / create folder (same as create flow)
//       if (selectedFolder) {
//         const fid = selectedFolder.id; // narrowed to string

//         if (
//           (folderDescription || "") !==
//           (selectedFolder.folderDescription || selectedFolder.description || "")
//         ) {
//           await foldersService.updateFolder(fid, {
//             description: folderDescription || "",
//           });
//         }

//         folderId = fid;
//       } else if (createFolderMode) {
//         folderId = await foldersService.createFolder({
//           name: folderName,
//           description: folderDescription,
//           createdById,
//           createdByName,
//           createdByRole: "monitor",
//         });
//       } else if (isEditing) {
//         // keep existing originalFolderId if not changed
//         folderId = originalFolderId;
//       }

//       // Find items that are new (isNew === true) and upload them
//       const uploaded: UploadedMedia[] = [];
//       for (let i = 0; i < items.length; i++) {
//         const it = items[i];
//         if (!it.isNew) continue;

//         const segment = folderId
//           ? `${createdById}/${folderId}`
//           : `${createdById}/posts`;

//         const up = await uploadImageToCloudinary(it.localPath, {
//           folderPath: segment,
//         });

//         if (!up) throw new Error("Upload failed");

//         uploaded.push({
//           url: up.url,
//           publicId: up.publicId,
//           order: it.order ?? i,
//         });
//       }

//       // If folderId exists, add newly uploaded images to folder subcollection
//       if (folderId && uploaded.length) {
//         for (let i = 0; i < uploaded.length; i++) {
//           const u = uploaded[i];
//           await foldersService.addImageToFolder(folderId, {
//             url: u.url,
//             publicId: u.publicId,
//             order: u.order ?? i,
//             createdAt: serverTimestamp() as any,
//           } as any);
//           await foldersService.incrementImageCount(folderId);
//         }

//         // update thumbnail if needed
//         let thumbIndex = thumbnailIndex;
//         if (thumbIndex < 0 || thumbIndex >= items.length) thumbIndex = 0;
//         const thumbUrl = items[thumbIndex]?.localPath || uploaded[0]?.url;
//         if (thumbUrl) {
//           await foldersService.updateFolderThumbnail(folderId, thumbUrl);
//         }
//       }

//       // Build final media array (preserve order)
//       const finalMedia: { url: string; publicId: string; order: number }[] = [];
//       for (let i = 0; i < items.length; i++) {
//         const it = items[i];
//         if (!it.isNew) {
//           finalMedia.push({
//             url: it.url ?? it.localPath,
//             publicId: it.publicId ?? "",
//             order: it.order ?? i,
//           });
//         } else {
//           // placeholder - we'll splice uploads in the next loop
//         }
//       }

//       // To correctly match uploaded entries, create pointer
//       let uploadPtr = 0;
//       for (let i = 0; i < items.length; i++) {
//         const it = items[i];
//         if (it.isNew) {
//           const u = uploaded[uploadPtr++];
//           finalMedia.splice(i, 0, {
//             url: u.url,
//             publicId: u.publicId,
//             order: it.order ?? i,
//           });
//         }
//       }

//       // Sanity: ensure order fields are normalized
//       const normalizedMedia = finalMedia
//         .map((m, idx) => ({ ...m, order: idx }))
//         .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

//       // If editing: find removed existing images and delete their folder docs (if applicable)
//       if (isEditing) {
//         const remainingPublicIds = normalizedMedia.map((m) => m.publicId);
//         const removed = originalMediaPublicIds.filter(
//           (p) => !remainingPublicIds.includes(p)
//         );

//         // If original post belonged to a folder, try to remove the image docs from folder subcollection
//         if (originalFolderId && removed.length) {
//           for (const remPub of removed) {
//             const docId = folderImageMap[remPub];
//             if (docId) {
//               // delete subcollection document
//               await foldersService.deleteImage(originalFolderId, docId);
//               await foldersService.decrementImageCount(originalFolderId);
//             }
//             // NOTE: Cloudinary file remains unless you have a server-side endpoint to remove by publicId.
//             // If you have such an endpoint, call it here to clean up storage.
//           }
//         }
//       }

//       // Prepare post payload
//       const postPayload: any = {
//         ownerId: createdById,
//         ownerName: createdByName,
//         ownerRole: createdByRole,
//         description: description || "",
//         media: normalizedMedia,
//         allowLikes,
//         allowComments,
//         allowShares,
//         tags: tagsArray,
//         folderId: folderId ?? null,
//       };

//       if (folderId) {
//         postPayload.type = "event";
//         postPayload.title = folderName || null; // folder title
//       } else {
//         postPayload.type = "post";
//         postPayload.title = null;
//       }

//       if (isEditing && postId) {
//         // expects your postsService to expose updatePost(postId, payload)
//         await postsService.updatePost(postId, postPayload);
//       } else {
//         await postsService.createPost(postPayload);
//       }

//       setPosting(false);
//       router.replace("/(shared)/gallery/screens/GalleryList");
//     } catch (err) {
//       console.error("CreateGalleryReview - submit error", err);
//       setPosting(false);
//       Alert.alert("Upload failed", String(err?.message || err));
//     }
//   };

//   return (
//     <SafeAreaView
//       style={[
//         styles.safe,
//         Platform.OS === "android" ? { paddingTop: 8 } : null,
//       ]}
//     >
//       <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 160 }}>
//         <Text style={styles.heading}>Arrange Images</Text>
//         <Text style={styles.subText}>Long press & drag to reorder</Text>

//         <View style={{ height: 150, marginTop: 12 }}>
//           <DraggableFlatList
//             data={items}
//             horizontal
//             onDragEnd={({ data }) =>
//               setItems(
//                 data.map((d: ImageItem, idx: number) => ({ ...d, order: idx }))
//               )
//             }
//             keyExtractor={(it) => it.key}
//             renderItem={renderThumb}
//             contentContainerStyle={styles.thumbList}
//           />
//         </View>

//         {(createFolderMode || selectedFolder) && (
//           <View style={styles.sectionCard}>
//             <Text style={styles.label}>Folder Thumbnail</Text>
//             <Image
//               source={{ uri: items[thumbnailIndex]?.localPath }}
//               style={styles.mainThumbnail}
//             />
//             <Text style={[styles.subText, { marginTop: 10 }]}>
//               Tap an image below to change thumbnail
//             </Text>

//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               style={{ marginTop: 10 }}
//             >
//               {items.map((it, i) => (
//                 <TouchableOpacity
//                   key={it.key}
//                   onPress={() => setThumbnailIndex(i)}
//                   style={[
//                     styles.smallThumb,
//                     thumbnailIndex === i && {
//                       borderColor: Colors.primary,
//                       borderWidth: 2,
//                     },
//                   ]}
//                 >
//                   <Image
//                     source={{ uri: it.localPath }}
//                     style={{ width: 70, height: 70, borderRadius: 8 }}
//                   />
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         <View style={styles.sectionCard}>
//           <View style={styles.rowBetween}>
//             <View style={styles.row}>
//               <Switch
//                 value={createFolderMode}
//                 onValueChange={onToggleCreateFolder}
//               />
//               <Text style={styles.switchLabel}>Create new folder</Text>
//             </View>

//             {!createFolderMode && (
//               <TouchableOpacity
//                 style={styles.selectFolderBtn}
//                 onPress={() => setShowFolderModal(true)}
//               >
//                 <Text style={styles.selectFolderText}>
//                   Select existing folder
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {(createFolderMode || selectedFolder) && (
//             <>
//               <Text style={styles.label}>Folder Name</Text>
//               <TextInput
//                 style={styles.input}
//                 value={folderName}
//                 onChangeText={setFolderName}
//                 placeholder="Enter folder name"
//               />

//               <Text style={styles.label}>Folder Description</Text>
//               <TextInput
//                 style={[styles.input, { height: 90 }]}
//                 value={folderDescription}
//                 onChangeText={setFolderDescription}
//                 placeholder="Add folder description"
//                 multiline
//               />
//             </>
//           )}
//         </View>

//         <View style={styles.sectionCard}>
//           <Text style={styles.label}>Post Description</Text>
//           <TextInput
//             style={[styles.input, { height: 120 }]}
//             value={description}
//             onChangeText={setDescription}
//             placeholder="Write something about this post..."
//             multiline
//           />
//         </View>

//         <View style={styles.sectionCard}>
//           <Text style={styles.label}>Tags</Text>
//           <TextInput
//             style={styles.input}
//             value={tagsText}
//             onChangeText={setTagsText}
//             placeholder="Add tags e.g. #trip #city"
//           />
//         </View>

//         <View style={styles.sectionCard}>
//           <Text style={styles.label}>Engagement Options</Text>

//           <View style={{ marginTop: 10 }}>
//             <View style={styles.toggleRow}>
//               <Text style={styles.toggleLabel}>Allow Likes</Text>
//               <Switch value={allowLikes} onValueChange={setAllowLikes} />
//             </View>

//             <View style={styles.toggleRow}>
//               <Text style={styles.toggleLabel}>Allow Comments</Text>
//               <Switch value={allowComments} onValueChange={setAllowComments} />
//             </View>

//             <View style={styles.toggleRow}>
//               <Text style={styles.toggleLabel}>Allow Shares</Text>
//               <Switch value={allowShares} onValueChange={setAllowShares} />
//             </View>
//           </View>
//         </View>

//         <View style={styles.bottomButtons}>
//           <TouchableOpacity
//             style={[styles.btn, { backgroundColor: Colors.primary }]}
//             onPress={onSubmit}
//             disabled={posting}
//           >
//             {posting ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.btnText}>{isEditing ? "Save" : "Post"}</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <Modal
//         visible={showFolderModal}
//         animationType="slide"
//         onRequestClose={() => setShowFolderModal(false)}
//       >
//         <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Select Folder</Text>
//             <TouchableOpacity onPress={() => setShowFolderModal(false)}>
//               <Text style={{ color: Colors.primary }}>Close</Text>
//             </TouchableOpacity>
//           </View>

//           <ScrollView contentContainerStyle={{ padding: 12 }}>
//             {existingFolders.length === 0 ? (
//               <View style={{ alignItems: "center", marginTop: 40 }}>
//                 <Text style={{ color: Colors.textSecondary }}>
//                   No folders yet
//                 </Text>
//               </View>
//             ) : (
//               existingFolders.map((f) => (
//                 <TouchableOpacity
//                   key={f.id}
//                   onPress={() => selectFolder(f)}
//                   style={{ marginBottom: 12 }}
//                 >
//                   <View style={styles.folderRow}>
//                     <Image
//                       source={{ uri: f.thumbnailUrl || undefined }}
//                       style={styles.folderThumb}
//                     />
//                     <View style={{ flex: 1, marginLeft: 10 }}>
//                       <Text style={styles.folderName}>
//                         {f.name || "Untitled"}
//                       </Text>
//                       <Text style={styles.folderDesc} numberOfLines={2}>
//                         {f.description || "No description"}
//                       </Text>
//                       <Text style={styles.folderMeta}>
//                         {(f.numberOfImages || 0) + " images"}
//                       </Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               ))
//             )}
//           </ScrollView>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* STYLES */
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: Colors.background },

//   heading: { fontSize: 18, fontWeight: "700", color: Colors.textPrimary },
//   subText: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },

//   sectionCard: {
//     marginTop: 18,
//     backgroundColor: Colors.card,
//     padding: 14,
//     borderRadius: 12,
//     shadowColor: Colors.shadow,
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//   },

//   label: {
//     color: Colors.textPrimary,
//     fontWeight: "600",
//     marginBottom: 6,
//     fontSize: 14,
//   },

//   input: {
//     backgroundColor: Colors.lightCard,
//     borderColor: Colors.border,
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 8,
//     color: Colors.textPrimary,
//     fontSize: 15,
//   },

//   toggleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 10,
//   },

//   toggleLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: "500" },

//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   row: { flexDirection: "row", alignItems: "center" },

//   switchLabel: { marginLeft: 8, color: Colors.textPrimary },

//   selectFolderBtn: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderColor: Colors.border,
//     borderWidth: 1,
//   },
//   selectFolderText: { color: Colors.primary, fontWeight: "600" },

//   thumbList: { alignItems: "center", paddingHorizontal: 6 },
//   thumbBox: {
//     marginHorizontal: 6,
//     borderRadius: 12,
//     overflow: "hidden",
//     borderWidth: 2,
//     borderColor: "transparent",
//   },
//   thumbImage: { width: 100, height: 100, borderRadius: 10 },

//   // delete button overlay on thumbnails
//   thumbDeleteBtn: {
//     position: "absolute",
//     top: 6,
//     right: 6,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     padding: 6,
//     borderRadius: 12,
//     zIndex: 10,
//   },

//   mainThumbnail: {
//     width: 140,
//     height: 140,
//     borderRadius: 12,
//     alignSelf: "center",
//     marginTop: 10,
//     backgroundColor: Colors.surface,
//   },
//   smallThumb: {
//     marginRight: 10,
//     borderRadius: 8,
//     overflow: "hidden",
//     marginTop: 12,
//   },

//   bottomButtons: {
//     marginTop: 24,
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   btn: {
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 10,
//     alignItems: "center",
//     marginHorizontal: 8,
//   },

//   btnText: { color: Colors.textInverse, fontWeight: "700", fontSize: 15 },

//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 14,
//   },
//   modalTitle: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary },

//   folderRow: {
//     flexDirection: "row",
//     backgroundColor: Colors.lightCard,
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   folderThumb: {
//     width: 72,
//     height: 72,
//     borderRadius: 10,
//     backgroundColor: Colors.surface,
//   },
//   folderName: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary },
//   folderDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
//   folderMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
// });

// (shared)/screens/CreateGalleryReview.tsx
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { serverTimestamp } from "firebase/firestore";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { uploadImageToCloudinary } from "../../../api/uploadImage";
import { foldersService } from "../../../services/foldersService";
import { postsService } from "../../../services/postsService";

type ImageItem = {
  key: string;
  localPath: string;
  order: number;
  isNew?: boolean;
  publicId?: string;
  url?: string;
};

type UploadedMedia = {
  url: string;
  publicId: string;
  order: number;
};

export default function CreateGalleryReview() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const incoming = params.images
    ? (JSON.parse(String(params.images)) as any[])
    : [];

  const initialPostId = (params.postId as string) || null;
  const folderIdParam = (params.folderId as string) || null;

  const [postId, setPostId] = useState<string | null>(initialPostId);
  const isEditing = !!postId;

  const [items, setItems] = useState<ImageItem[]>(
    incoming.map((it: any, idx: number) => ({
      key: `${Date.now()}-${idx}`,
      localPath: it.localPath || it.uri || it.path || it,
      order: idx,
      isNew: true,
    }))
  );

  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState("");

  const [createFolderMode, setCreateFolderMode] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderDescription, setFolderDescription] = useState("");

  const [selectedFolder, setSelectedFolder] = useState<any | null>(null);
  const [existingFolders, setExistingFolders] = useState<any[]>([]);
  const [showFolderModal, setShowFolderModal] = useState(false);

  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [posting, setPosting] = useState(false);

  const allowLikes = true;
  const allowComments = true;
  const allowShares = true;

  const [folderImageMap, setFolderImageMap] = useState<Record<string, string>>(
    {}
  );

  const { user } = useAuth();
  const createdById = user?.uid ?? "unknown";
  const createdByName = user?.fullName ?? "User";
  const createdByRole = user?.role ?? "monitor";
  const { back } = router;

  //----------------------------------------
  // LOAD EXISTING FOLDERS FOR THIS USER
  //----------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const all = await foldersService.getAllFolders();
        const mine = all.filter((f) => f.createdById === createdById);
        setExistingFolders(mine);
      } catch (err) {
        console.warn("Failed to load folders", err);
      }
    })();
  }, [createdById]);

  //----------------------------------------
  // OPTION 2 FLOW → folderId → auto-find linked post
  //----------------------------------------
  useEffect(() => {
    (async () => {
      try {
        if (!folderIdParam) return;

        // load folder details (for editing folder name/description)
        const folder = await foldersService.getFolder(folderIdParam);
        if (folder) {
          setSelectedFolder(folder);
          setFolderName(folder.name || "");
          setFolderDescription(folder.description || "");
        }

        // find linked post
        const allPosts = await postsService.getAllPosts();
        const linked = allPosts.find((p: any) => p.folderId === folderIdParam);
        if (linked) {
          setPostId(linked.id);
        } else {
          setCreateFolderMode(false); // user creates new post inside folder
        }
      } catch (err) {
        console.warn("Failed folder/post load", err);
      }
    })();
  }, [folderIdParam]);

  //----------------------------------------
  // LOAD POST FOR EDITING
  //----------------------------------------
  useEffect(() => {
    if (!isEditing || !postId) return;

    (async () => {
      try {
        const post = await postsService.getPost(postId);
        if (!post) {
          Alert.alert("Post not found");
          back();
          return;
        }

        // Fill basic post fields
        setDescription(post.description ?? "");
        setTagsText((post.tags ?? []).join(" "));

        // folder prefill
        if (post.folderId) {
          const folder = await foldersService.getFolder(post.folderId);
          if (folder) {
            setSelectedFolder(folder);
            setFolderName(folder.name || "");
            setFolderDescription(folder.description || "");
          }

          // load folder images => map
          const folderImages = await foldersService.getFolderImages(
            post.folderId
          );

          const map: Record<string, string> = {};
          folderImages.forEach((fi) => {
            if (fi.publicId) map[fi.publicId] = fi.id;
          });

          setFolderImageMap(map);
        }

        // media
        const existingItems: ImageItem[] = (post.media ?? []).map(
          (m: any, idx: number) => ({
            key: `existing-${m.publicId}-${idx}`,
            localPath: m.url,
            url: m.url,
            publicId: m.publicId,
            order: m.order ?? idx,
            isNew: false,
          })
        );

        setItems(existingItems);
        setThumbnailIndex(0);
      } catch (err) {
        console.error("Failed to load post for edit", err);
        Alert.alert("Failed to load post");
        back();
      }
    })();
  }, [isEditing, postId, back]);

  //----------------------------------------
  // TAGS PARSER
  //----------------------------------------
  const tagsArray = useMemo(() => {
    return tagsText
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));
  }, [tagsText]);

  //----------------------------------------
  // GET CURRENT FOLDER ID
  //----------------------------------------
  const currentFolderId = selectedFolder?.id ?? folderIdParam ?? null;

  //----------------------------------------
  // RENDER THUMBNAIL WITH DELETE BUTTON
  //----------------------------------------
  const renderThumb = useCallback(
    ({ item, drag, getIndex }: RenderItemParams<ImageItem>) => {
      const idx = getIndex?.() ?? 0;

      const handleDeleteThumb = async () => {
        // remove from folder (if old)
        if (!item.isNew && item.publicId && currentFolderId) {
          try {
            const docId = folderImageMap[item.publicId];
            if (docId) {
              await foldersService.deleteImage(currentFolderId, docId);
              await foldersService.decrementImageCount(currentFolderId);
            }
          } catch (err) {
            console.warn("Folder image delete failed", err);
          }
        }

        // remove locally
        setItems((prev) => prev.filter((it) => it.key !== item.key));

        // fix thumbnail index
        setThumbnailIndex((prev) => {
          if (prev === idx) return 0;
          if (prev > idx) return prev - 1;
          return prev;
        });
      };

      return (
        <View style={{ marginHorizontal: 6 }}>
          <TouchableOpacity
            onLongPress={drag}
            onPress={() => setThumbnailIndex(idx)}
            style={[
              styles.thumbBox,
              thumbnailIndex === idx && { borderColor: Colors.primary },
            ]}
          >
            <Image source={{ uri: item.localPath }} style={styles.thumbImage} />

            <TouchableOpacity
              onPress={handleDeleteThumb}
              style={styles.thumbDeleteBtn}
            >
              <Feather name="x" size={16} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      );
    },
    [thumbnailIndex, currentFolderId, folderImageMap]
  );
  //--------------------------------------------------
  // SUBMIT HANDLER — CREATE + FULL EDIT SUPPORT
  //--------------------------------------------------
  const onSubmit = async () => {
    if (!items.length) {
      Alert.alert("No images selected");
      return;
    }

    if ((createFolderMode || selectedFolder) && !folderName.trim()) {
      Alert.alert("Please enter folder name");
      return;
    }

    setPosting(true);

    try {
      let folderId: string | null = null;
      let originalFolderId: string | null = null;

      // 1) Fetch original post data if editing
      let originalMediaPublicIds: string[] = [];
      if (isEditing && postId) {
        const originalPost = await postsService.getPost(postId);
        originalFolderId = originalPost?.folderId ?? null;
        originalMediaPublicIds = (originalPost?.media ?? []).map(
          (m: any) => m.publicId
        );
      }

      // 2) Folder update / create
      if (selectedFolder) {
        const fid = selectedFolder.id;

        // Update folder name/description if changed
        if (
          folderName.trim() !== selectedFolder.name ||
          (folderDescription || "") !== (selectedFolder.description || "")
        ) {
          await foldersService.updateFolder(fid, {
            name: folderName.trim(),
            description: folderDescription || "",
          });
        }

        folderId = fid;
      } else if (createFolderMode) {
        // Create NEW folder
        folderId = await foldersService.createFolder({
          name: folderName.trim(),
          description: folderDescription,
          createdById,
          createdByName,
          createdByRole,
        });
      } else if (isEditing) {
        // Keep old folderId if editing & unchanged
        folderId = originalFolderId;
      }

      // 3) Upload NEW images
      const uploaded: UploadedMedia[] = [];
      for (let i = 0; i < items.length; i++) {
        const it = items[i];

        if (!it.isNew) continue;

        const segment = folderId
          ? `${createdById}/${folderId}`
          : `${createdById}/posts`;

        const up = await uploadImageToCloudinary(it.localPath, {
          folderPath: segment,
        });

        if (!up) throw new Error("Upload failed");

        uploaded.push({
          url: up.url,
          publicId: up.publicId,
          order: it.order ?? i,
        });
      }

      // 4) If folderId exists, register new images in subcollection
      if (folderId && uploaded.length > 0) {
        for (let i = 0; i < uploaded.length; i++) {
          const u = uploaded[i];
          await foldersService.addImageToFolder(folderId, {
            url: u.url,
            publicId: u.publicId,
            order: u.order,
            createdAt: serverTimestamp() as any,
          } as any);

          await foldersService.incrementImageCount(folderId);
        }

        // update folder thumbnail
        const thumbUrl =
          items[thumbnailIndex]?.localPath ??
          uploaded[0]?.url ??
          items[0]?.localPath;

        if (thumbUrl) {
          await foldersService.updateFolderThumbnail(folderId, thumbUrl);
        }
      }

      // 5) Build final media array (existing + newly uploaded)
      const finalMedia: { url: string; publicId: string; order: number }[] = [];

      for (let i = 0; i < items.length; i++) {
        const it = items[i];

        if (!it.isNew) {
          finalMedia.push({
            url: it.url ?? it.localPath,
            publicId: it.publicId ?? "",
            order: it.order ?? i,
          });
        }
      }

      let uploadPtr = 0;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];

        if (it.isNew) {
          const u = uploaded[uploadPtr++];
          finalMedia.splice(i, 0, {
            url: u.url,
            publicId: u.publicId,
            order: it.order ?? i,
          });
        }
      }

      // normalize ordering
      const normalizedMedia = finalMedia
        .map((m, idx) => ({ ...m, order: idx }))
        .sort((a, b) => a.order - b.order);

      // 6) Remove deleted images from folder subcollection
      if (isEditing) {
        const remaining = normalizedMedia.map((m) => m.publicId);
        const removed = originalMediaPublicIds.filter(
          (pub) => !remaining.includes(pub)
        );

        if (originalFolderId && removed.length > 0) {
          for (const p of removed) {
            const docId = folderImageMap[p];
            if (docId) {
              await foldersService.deleteImage(originalFolderId, docId);
              await foldersService.decrementImageCount(originalFolderId);
            }
          }
        }
      }

      // 7) POST PAYLOAD
      const postPayload: any = {
        ownerId: createdById,
        ownerName: createdByName,
        ownerRole: createdByRole,

        description: description || "",
        media: normalizedMedia,
        tags: tagsArray,

        allowLikes,
        allowComments,
        allowShares,

        folderId: folderId ?? null,
        type: folderId ? "event" : "post",
        title: folderId ? folderName.trim() : null,
      };

      // 8) UPDATE or CREATE POST
      if (isEditing && postId) {
        await postsService.updatePost(postId, postPayload);
      } else {
        await postsService.createPost(postPayload);
      }

      setPosting(false);

      // 9) RETURN USER TO SAME PLACE THEY CAME FROM
      if (params.returnTo) {
        router.replace(String(params.returnTo));
      } else {
        await new Promise((res) => setTimeout(res, 300));
        router.back();
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      Alert.alert("Upload failed", err?.message || String(err));
      setPosting(false);
    }
  };

  //--------------------------------------------------
  // UI LAYOUT
  //--------------------------------------------------
  return (
    <SafeAreaView
      style={[
        styles.safe,
        Platform.OS === "android" ? { paddingTop: 8 } : null,
      ]}
    >
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 160 }}>
        <Text style={styles.heading}>Arrange Images</Text>
        <Text style={styles.subText}>Long press & drag to reorder</Text>

        {/* THUMB STRIP */}
        <View style={{ height: 150, marginTop: 12 }}>
          <DraggableFlatList
            data={items}
            horizontal
            onDragEnd={({ data }) =>
              setItems(data.map((d, i) => ({ ...d, order: i })))
            }
            keyExtractor={(it) => it.key}
            renderItem={renderThumb}
            contentContainerStyle={styles.thumbList}
          />
        </View>

        {/* FOLDER CARD */}
        {(createFolderMode || selectedFolder) && (
          <View style={styles.sectionCard}>
            <Text style={styles.label}>Folder Thumbnail</Text>

            <Image
              source={{ uri: items[thumbnailIndex]?.localPath }}
              style={styles.mainThumbnail}
            />

            <Text style={[styles.subText, { marginTop: 10 }]}>
              Tap an image below to set thumbnail
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 10 }}
            >
              {items.map((it, i) => (
                <TouchableOpacity
                  key={it.key}
                  onPress={() => setThumbnailIndex(i)}
                  style={[
                    styles.smallThumb,
                    thumbnailIndex === i && {
                      borderColor: Colors.primary,
                      borderWidth: 2,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: it.localPath }}
                    style={{ width: 70, height: 70, borderRadius: 8 }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* FOLDER OPTIONS */}
        <View style={styles.sectionCard}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Switch
                value={createFolderMode}
                onValueChange={setCreateFolderMode}
              />
              <Text style={styles.switchLabel}>Create new folder</Text>
            </View>

            {!createFolderMode && (
              <TouchableOpacity
                style={styles.selectFolderBtn}
                onPress={() => setShowFolderModal(true)}
              >
                <Text style={styles.selectFolderText}>
                  Select existing folder
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {(createFolderMode || selectedFolder) && (
            <>
              <Text style={styles.label}>Folder Name</Text>
              <TextInput
                style={styles.input}
                value={folderName}
                onChangeText={setFolderName}
                placeholder="Enter folder name"
              />

              <Text style={styles.label}>Folder Description</Text>
              <TextInput
                style={[styles.input, { height: 90 }]}
                value={folderDescription}
                onChangeText={setFolderDescription}
                placeholder="Enter folder description"
                multiline
              />
            </>
          )}
        </View>

        {/* POST DESCRIPTION */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Post Description</Text>
          <TextInput
            style={[styles.input, { height: 120 }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Write description..."
            multiline
          />
        </View>

        {/* TAGS */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Tags</Text>
          <TextInput
            style={styles.input}
            value={tagsText}
            onChangeText={setTagsText}
            placeholder="Add tags e.g. #trip #city"
          />
        </View>

        {/* ENGAGEMENT TOGGLES
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Engagement</Text>

          <View style={{ marginTop: 10 }}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Allow Likes</Text>
              <Switch value={allowLikes} onValueChange={setAllowLikes} />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Allow Comments</Text>
              <Switch value={allowComments} onValueChange={setAllowComments} />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Allow Shares</Text>
              <Switch value={allowShares} onValueChange={setAllowShares} />
            </View>
          </View>
        </View> */}

        {/* SUBMIT */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: Colors.primary }]}
            onPress={onSubmit}
            disabled={posting}
          >
            {posting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>
                {isEditing ? "Save Changes" : "Post"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FOLDER SELECT MODAL */}
      <Modal
        visible={showFolderModal}
        animationType="slide"
        onRequestClose={() => setShowFolderModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Folder</Text>
            <TouchableOpacity onPress={() => setShowFolderModal(false)}>
              <Text style={{ color: Colors.primary }}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {existingFolders.length === 0 ? (
              <View style={{ alignItems: "center", marginTop: 40 }}>
                <Text style={{ color: Colors.textSecondary }}>
                  No folders yet
                </Text>
              </View>
            ) : (
              existingFolders.map((f) => (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => {
                    setSelectedFolder(f);
                    setFolderName(f.name || "");
                    setFolderDescription(f.description || "");
                    setShowFolderModal(false);
                  }}
                  style={{ marginBottom: 12 }}
                >
                  <View style={styles.folderRow}>
                    <Image
                      source={{ uri: f.thumbnailUrl || undefined }}
                      style={styles.folderThumb}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.folderName}>
                        {f.name || "Untitled"}
                      </Text>
                      <Text style={styles.folderDesc} numberOfLines={2}>
                        {f.description || "No description"}
                      </Text>
                      <Text style={styles.folderMeta}>
                        {(f.numberOfImages || 0) + " images"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

/* ------------ STYLES ------------ */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  heading: { fontSize: 18, fontWeight: "700", color: Colors.textPrimary },
  subText: { color: Colors.textSecondary, fontSize: 13 },

  sectionCard: {
    marginTop: 18,
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  label: {
    color: Colors.textPrimary,
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 14,
  },

  input: {
    backgroundColor: Colors.lightCard,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    color: Colors.textPrimary,
    fontSize: 15,
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    alignItems: "center",
  },

  toggleLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: "600" },

  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  row: { flexDirection: "row", alignItems: "center" },

  switchLabel: { marginLeft: 8, color: Colors.textPrimary },

  selectFolderBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectFolderText: {
    color: Colors.primary,
    fontWeight: "700",
  },

  thumbList: { alignItems: "center" },

  thumbBox: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },

  thumbImage: { width: 100, height: 100 },

  thumbDeleteBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.65)",
    padding: 6,
    borderRadius: 50,
  },

  mainThumbnail: {
    width: 140,
    height: 140,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 12,
  },

  smallThumb: {
    marginRight: 10,
    borderRadius: 8,
    overflow: "hidden",
  },

  bottomButtons: {
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "center",
  },

  btn: {
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 10,
  },

  btnText: {
    color: Colors.textInverse,
    fontWeight: "700",
    fontSize: 16,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  folderRow: {
    flexDirection: "row",
    backgroundColor: Colors.lightCard,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  folderThumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: Colors.surface,
  },

  folderName: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary },
  folderDesc: { fontSize: 13, color: Colors.textSecondary },
  folderMeta: { color: Colors.textMuted, fontSize: 11, marginTop: 4 },
});
