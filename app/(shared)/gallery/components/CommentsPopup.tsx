// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   BackHandler,
//   FlatList,
//   Image,
//   Keyboard,
//   LayoutChangeEvent,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { commentsService } from "../../../services/commentsService";

// export default function CommentsPopup({ postId, onClose }: any) {
//   const { user } = useAuth();
//   const insets = useSafeAreaInsets();

//   const [text, setText] = useState("");
//   const [comments, setComments] = useState<any[]>([]);

//   // entrance animation
//   const slideUp = useRef(new Animated.Value(500)).current;

//   // keyboard animation & layout
//   const keyboardAnim = useRef(new Animated.Value(0)).current;
//   const [keyboardHeight, setKeyboardHeight] = useState(0);

//   // input bar height
//   const [inputBarHeight, setInputBarHeight] = useState(60);

//   const listRef = useRef<FlatList>(null);
//   const inputRef = useRef<TextInput>(null);

//   /** OPEN ANIMATION */
//   useEffect(() => {
//     Animated.timing(slideUp, {
//       toValue: 0,
//       duration: 250,
//       useNativeDriver: false,
//     }).start(() => {
//       setTimeout(() => inputRef.current?.focus(), 120);
//     });
//   }, []);

//   /** REALTIME COMMENTS */
//   useEffect(() => {
//     const unsub = commentsService.subscribeToComments(postId, (arr) => {
//       setComments(arr);
//     });
//     return () => unsub();
//   }, [postId]);

//   useEffect(() => {
//     const onShow = (e: any) => {
//       const height = (e.endCoordinates?.height ?? 0) - insets.bottom;

//       Animated.timing(keyboardAnim, {
//         toValue: height,
//         duration: 180,
//         useNativeDriver: false,
//       }).start();

//       setKeyboardHeight(height);
//     };

//     const onHide = () => {
//       // IMPORTANT: no animation, Samsung bug fix
//       keyboardAnim.setValue(0);
//       setKeyboardHeight(0);
//     };

//     const showEvent =
//       Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
//     const hideEvent =
//       Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";

//     const show = Keyboard.addListener(showEvent, onShow);
//     const hide = Keyboard.addListener(hideEvent, onHide);

//     return () => {
//       show.remove();
//       hide.remove();
//     };
//   }, [insets.bottom]);

//   /** HARDWARE BACK BUTTON */
//   useEffect(() => {
//     const handler = BackHandler.addEventListener("hardwareBackPress", () => {
//       onClose();
//       return true;
//     });
//     return () => handler.remove();
//   }, []);

//   /** SEND COMMENT */
//   const send = async () => {
//     if (!text.trim()) return;

//     await commentsService.addComment({
//       postId,
//       text: text.trim(),
//       userId: user?.uid ?? "",
//       name: user?.fullName ?? "User",
//       role: user?.role ?? "user",
//       profileImage: user?.profileImage ?? null,
//     });

//     setText("");
//     requestAnimationFrame(() => {
//       listRef.current?.scrollToOffset({ offset: 0, animated: true });
//     });
//   };

//   /** MEASURE INPUT BAR HEIGHT */
//   const onInputLayout = (e: LayoutChangeEvent) => {
//     const h = e.nativeEvent.layout.height;
//     if (h > 0) setInputBarHeight(h);
//   };

//   /** Padding for bottom of FlatList */
//   const listPaddingBottom =
//     keyboardHeight + inputBarHeight + insets.bottom + 10;

//   return (
//     <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
//       {/* BACKDROP */}
//       <Pressable
//         style={styles.backdrop}
//         onPress={onClose}
//         pointerEvents="auto"
//       />

//       {/* POPUP ALWAYS ABOVE AND TOUCHABLE */}
//       <Animated.View
//         pointerEvents="box-none"
//         style={[
//           styles.popup,
//           {
//             transform: [{ translateY: slideUp }],
//             bottom: keyboardAnim,
//           },
//         ]}
//       >
//         <View style={{ flex: 1 }} pointerEvents="auto">
//           {/* HEADER */}
//           <View style={styles.header}>
//             <Text style={styles.title}>Comments</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Text style={styles.close}>Close</Text>
//             </TouchableOpacity>
//           </View>

//           {/* COMMENTS LIST */}
//           <FlatList
//             ref={listRef}
//             data={comments}
//             keyExtractor={(item) => item.id}
//             keyboardShouldPersistTaps="handled"
//             keyboardDismissMode="on-drag"
//             showsVerticalScrollIndicator={false}
//             nestedScrollEnabled
//             style={{ flex: 1 }}
//             contentContainerStyle={{
//               paddingBottom: listPaddingBottom,
//             }}
//             renderItem={({ item }) => (
//               <View style={styles.commentRow}>
//                 <Image
//                   source={
//                     item.profileImage ? { uri: item.profileImage } : undefined
//                   }
//                   style={styles.avatar}
//                 />
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.name}>
//                     {item.name}
//                     <Text style={styles.role}> · {item.role}</Text>
//                   </Text>
//                   <Text style={styles.text}>{item.text}</Text>
//                 </View>
//               </View>
//             )}
//           />

//           {/* INPUT BAR */}
//           <View style={styles.inputContainer} onLayout={onInputLayout}>
//             <View style={styles.inputRow}>
//               <TextInput
//                 ref={inputRef}
//                 placeholder="Add a comment..."
//                 placeholderTextColor={Colors.textMuted}
//                 style={styles.input}
//                 value={text}
//                 onChangeText={setText}
//                 returnKeyType="send"
//                 onSubmitEditing={send}
//               />
//               <TouchableOpacity
//                 onPress={send}
//                 disabled={!text.trim()}
//                 style={[styles.sendBtn, { opacity: text.trim() ? 1 : 0.4 }]}
//               >
//                 <Text style={styles.sendText}>Send</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   backdrop: {
//     position: "absolute",
//     inset: 0,
//     backgroundColor: "rgba(0,0,0,0.30)",
//     justifyContent: "flex-end",
//   },
//   popup: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     height: "75%",
//     backgroundColor: Colors.lightCard,
//     borderTopLeftRadius: 22,
//     borderTopRightRadius: 22,
//     overflow: "hidden",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 14,
//     borderBottomWidth: 1,
//     borderColor: Colors.border,
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//   },
//   close: { color: Colors.primary, fontWeight: "700" },

//   commentRow: {
//     flexDirection: "row",
//     padding: 12,
//     borderBottomWidth: 1,
//     borderColor: Colors.border,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//     backgroundColor: Colors.surface,
//   },
//   name: { fontWeight: "700", color: Colors.textPrimary },
//   role: { fontSize: 12, color: Colors.textSecondary },
//   text: { marginTop: 3, color: Colors.textPrimary },

//   inputContainer: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: Colors.lightCard,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//   },
//   inputRow: {
//     flexDirection: "row",
//     padding: 10,
//     alignItems: "center",
//   },
//   input: {
//     flex: 1,
//     backgroundColor: Colors.surface,
//     borderRadius: 20,
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     color: Colors.textPrimary,
//   },
//   sendBtn: {
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 12,
//     marginLeft: 10,
//   },
//   sendText: { color: "#fff", fontWeight: "600" },

//   debug: {
//     color: "#fff",
//     fontSize: 10,
//     marginBottom: 2,
//   },
// });

// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   BackHandler,
//   FlatList,
//   Image,
//   Keyboard,
//   LayoutChangeEvent,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { commentsService } from "../../../services/commentsService";

// export default function CommentsPopup({ postId, onClose }: any) {
//   const { user } = useAuth();
//   const insets = useSafeAreaInsets();

//   const [text, setText] = useState("");
//   const [comments, setComments] = useState<any[]>([]);
//   const slideUp = useRef(new Animated.Value(500)).current;
//   const keyboardAnim = useRef(new Animated.Value(0)).current;
//   const [keyboardHeight, setKeyboardHeight] = useState(0);
//   const [inputBarHeight, setInputBarHeight] = useState(60);
//   const listRef = useRef<FlatList>(null);
//   const inputRef = useRef<TextInput>(null);

//   /** Format Time */
//   const formatRelativeTime = (ts: any) => {
//     const ms = ts?.seconds ? ts.seconds * 1000 : Date.now();
//     const diff = Date.now() - ms;

//     const minutes = diff / 60000;
//     if (minutes < 1) return "Just now";
//     if (minutes < 60) return `${Math.floor(minutes)}m ago`;

//     const hours = minutes / 60;
//     if (hours < 24) return `${Math.floor(hours)}h ago`;

//     return `${Math.floor(hours / 24)}d ago`;
//   };

//   /** OPEN ANIMATION */
//   useEffect(() => {
//     Animated.timing(slideUp, {
//       toValue: 0,
//       duration: 250,
//       useNativeDriver: false,
//     }).start(() => {
//       setTimeout(() => inputRef.current?.focus(), 120);
//     });
//   }, []);

//   /** REALTIME COMMENTS */
//   useEffect(() => {
//     const unsub = commentsService.subscribeToComments(postId, (arr) => {
//       setComments(arr);
//     });
//     return () => unsub();
//   }, [postId]);

//   /** KEYBOARD */
//   useEffect(() => {
//     const onShow = (e: any) => {
//       const height = (e.endCoordinates?.height ?? 0) - insets.bottom;

//       Animated.timing(keyboardAnim, {
//         toValue: height,
//         duration: 180,
//         useNativeDriver: false,
//       }).start();

//       setKeyboardHeight(height);
//     };

//     const onHide = () => {
//       keyboardAnim.setValue(0);
//       setKeyboardHeight(0);
//     };

//     const showEvent =
//       Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
//     const hideEvent =
//       Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";

//     const show = Keyboard.addListener(showEvent, onShow);
//     const hide = Keyboard.addListener(hideEvent, onHide);

//     return () => {
//       show.remove();
//       hide.remove();
//     };
//   }, [insets.bottom]);

//   /** BACK BUTTON */
//   useEffect(() => {
//     const handler = BackHandler.addEventListener("hardwareBackPress", () => {
//       onClose();
//       return true;
//     });
//     return () => handler.remove();
//   }, []);

//   /** SEND COMMENT */
//   const send = async () => {
//     if (!text.trim()) return;

//     await commentsService.addComment({
//       postId,
//       text: text.trim(),
//       userId: user?.uid ?? "",
//       name: user?.fullName ?? "User",
//       role: user?.role ?? "user",
//       profileImage: user?.profileImage ?? null,
//     });

//     setText("");
//     requestAnimationFrame(() => {
//       listRef.current?.scrollToOffset({ offset: 0, animated: true });
//     });
//   };

//   const onInputLayout = (e: LayoutChangeEvent) => {
//     const h = e.nativeEvent.layout.height;
//     if (h > 0) setInputBarHeight(h);
//   };

//   const listPaddingBottom =
//     keyboardHeight + inputBarHeight + insets.bottom + 10;

//   return (
//     <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
//       <Pressable
//         style={styles.backdrop}
//         onPress={onClose}
//         pointerEvents="auto"
//       />

//       <Animated.View
//         pointerEvents="box-none"
//         style={[
//           styles.popup,
//           { transform: [{ translateY: slideUp }], bottom: keyboardAnim },
//         ]}
//       >
//         <View style={{ flex: 1 }} pointerEvents="auto">
//           <View style={styles.header}>
//             <Text style={styles.title}>Comments</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Text style={styles.close}>Close</Text>
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             ref={listRef}
//             data={comments}
//             keyExtractor={(item) => item.id}
//             keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={false}
//             nestedScrollEnabled
//             style={{ flex: 1 }}
//             contentContainerStyle={{ paddingBottom: listPaddingBottom }}
//             renderItem={({ item }) => {
//               const showRole = item.role === "admin" || item.role === "monitor";

//               return (
//                 <View style={styles.commentRow}>
//                   <Image
//                     source={
//                       item.profileImage ? { uri: item.profileImage } : undefined
//                     }
//                     style={styles.avatar}
//                   />
//                   <View style={{ flex: 1 }}>
//                     <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
//                       <Text style={styles.name}>{item.name}</Text>

//                       {showRole && (
//                         <Text style={styles.role}> · {item.role}</Text>
//                       )}

//                       <Text style={styles.time}>
//                         · {formatRelativeTime(item.createdAt)}
//                       </Text>
//                     </View>

//                     <Text style={styles.text}>{item.text}</Text>
//                   </View>
//                 </View>
//               );
//             }}
//           />

//           <View style={styles.inputContainer} onLayout={onInputLayout}>
//             <View style={styles.inputRow}>
//               <TextInput
//                 ref={inputRef}
//                 placeholder="Add a comment..."
//                 placeholderTextColor={Colors.textMuted}
//                 style={styles.input}
//                 value={text}
//                 onChangeText={setText}
//                 returnKeyType="send"
//                 onSubmitEditing={send}
//               />
//               <TouchableOpacity
//                 onPress={send}
//                 disabled={!text.trim()}
//                 style={[styles.sendBtn, { opacity: text.trim() ? 1 : 0.4 }]}
//               >
//                 <Text style={styles.sendText}>Send</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   backdrop: {
//     position: "absolute",
//     inset: 0,
//     backgroundColor: "rgba(0,0,0,0.30)",
//     justifyContent: "flex-end",
//   },
//   popup: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     height: "75%",
//     backgroundColor: Colors.lightCard,
//     borderTopLeftRadius: 22,
//     borderTopRightRadius: 22,
//     overflow: "hidden",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 14,
//     borderBottomWidth: 1,
//     borderColor: Colors.border,
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//   },
//   close: { color: Colors.primary, fontWeight: "700" },

//   commentRow: {
//     flexDirection: "row",
//     padding: 12,
//     borderBottomWidth: 1,
//     borderColor: Colors.border,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//     backgroundColor: Colors.surface,
//   },
//   name: { fontWeight: "700", color: Colors.textPrimary },
//   role: { fontSize: 12, color: Colors.warning, marginLeft: 4 },
//   time: { fontSize: 12, color: Colors.textSecondary, marginLeft: 4 },
//   text: { marginTop: 3, color: Colors.textPrimary },

//   inputContainer: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: Colors.lightCard,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//   },
//   inputRow: {
//     flexDirection: "row",
//     padding: 10,
//     alignItems: "center",
//   },
//   input: {
//     flex: 1,
//     backgroundColor: Colors.surface,
//     borderRadius: 20,
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     color: Colors.textPrimary,
//   },
//   sendBtn: {
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 12,
//     marginLeft: 10,
//   },
//   sendText: { color: "#fff", fontWeight: "600" },
// });

// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   BackHandler,
//   FlatList,
//   Image,
//   LayoutChangeEvent,
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { commentsService } from "../../../services/commentsService";

// export default function CommentsPopup({ postId, onClose }: any) {
//   const { user } = useAuth();
//   const insets = useSafeAreaInsets();

//   const [text, setText] = useState("");
//   const [comments, setComments] = useState<any[]>([]);
//   const slideUp = useRef(new Animated.Value(500)).current;
//   const [inputBarHeight, setInputBarHeight] = useState(60);
//   const listRef = useRef<FlatList>(null);
//   const inputRef = useRef<TextInput>(null);

//   const formatRelativeTime = (ts: any) => {
//     const ms = ts?.seconds ? ts.seconds * 1000 : Date.now();
//     const diff = Date.now() - ms;

//     const minutes = diff / 60000;
//     if (minutes < 1) return "Just now";
//     if (minutes < 60) return `${Math.floor(minutes)}m ago`;

//     const hours = minutes / 60;
//     if (hours < 24) return `${Math.floor(hours)}h ago`;

//     return `${Math.floor(hours / 24)}d ago`;
//   };

//   useEffect(() => {
//     Animated.timing(slideUp, {
//       toValue: 0,
//       duration: 250,
//       useNativeDriver: false,
//     }).start(() => {
//       setTimeout(() => inputRef.current?.focus(), 120);
//     });
//   }, []);

//   useEffect(() => {
//     const unsub = commentsService.subscribeToComments(postId, (arr) =>
//       setComments(arr)
//     );
//     return () => unsub();
//   }, [postId]);

//   useEffect(() => {
//     const handler = BackHandler.addEventListener("hardwareBackPress", () => {
//       onClose();
//       return true;
//     });
//     return () => handler.remove();
//   }, []);

//   const send = async () => {
//     if (!text.trim()) return;

//     await commentsService.addComment({
//       postId,
//       text: text.trim(),
//       userId: user?.uid ?? "",
//       name: user?.fullName ?? "User",
//       role: user?.role ?? "user",
//       profileImage: user?.profileImage ?? null,
//     });

//     setText("");
//     requestAnimationFrame(() => {
//       listRef.current?.scrollToOffset({ offset: 0, animated: true });
//     });
//   };

//   const onInputLayout = (e: LayoutChangeEvent) => {
//     const h = e.nativeEvent.layout.height;
//     if (h > 0) setInputBarHeight(h);
//   };

//   return (
//     <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
//       <Pressable
//         style={styles.backdrop}
//         onPress={onClose}
//         pointerEvents="auto"
//       />

//       <Animated.View
//         pointerEvents="box-none"
//         style={[styles.popup, { transform: [{ translateY: slideUp }] }]}
//       >
//         <View style={{ flex: 1 }} pointerEvents="auto">
//           <View style={styles.header}>
//             <Text style={styles.title}>Comments</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Text style={styles.close}>Close</Text>
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             ref={listRef}
//             data={comments}
//             keyExtractor={(item) => item.id}
//             keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={false}
//             nestedScrollEnabled
//             style={{ flex: 1 }}
//             contentContainerStyle={{
//               paddingBottom: inputBarHeight + insets.bottom + 12, // ✔ Fixed padding
//             }}
//             renderItem={({ item }) => {
//               const showRole = item.role === "admin" || item.role === "monitor";

//               return (
//                 <View style={styles.commentRow}>
//                   <Image
//                     source={
//                       item.profileImage ? { uri: item.profileImage } : undefined
//                     }
//                     style={styles.avatar}
//                   />
//                   <View style={{ flex: 1 }}>
//                     <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
//                       <Text style={styles.name}>{item.name}</Text>
//                       {showRole && (
//                         <Text style={styles.role}> · {item.role}</Text>
//                       )}
//                       <Text style={styles.time}>
//                         · {formatRelativeTime(item.createdAt)}
//                       </Text>
//                     </View>
//                     <Text style={styles.text}>{item.text}</Text>
//                   </View>
//                 </View>
//               );
//             }}
//           />

//           {/* 📌 Input bar always fixed at bottom */}
//           <View style={styles.inputContainer} onLayout={onInputLayout}>
//             <View style={styles.inputRow}>
//               <TextInput
//                 ref={inputRef}
//                 placeholder="Add a comment..."
//                 placeholderTextColor={Colors.textMuted}
//                 style={styles.input}
//                 value={text}
//                 onChangeText={setText}
//                 returnKeyType="send"
//                 onSubmitEditing={send}
//               />
//               <TouchableOpacity
//                 onPress={send}
//                 disabled={!text.trim()}
//                 style={[styles.sendBtn, { opacity: text.trim() ? 1 : 0.4 }]}
//               >
//                 <Text style={styles.sendText}>Send</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   backdrop: {
//     position: "absolute",
//     inset: 0,
//     backgroundColor: "rgba(0,0,0,0.30)",
//   },
//   popup: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: "75%",
//     paddingBottom: 20,
//     backgroundColor: Colors.lightCard,
//     borderTopLeftRadius: 22,
//     borderTopRightRadius: 22,
//     overflow: "hidden",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 14,
//     borderBottomWidth: 1,
//     borderColor: Colors.border,
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//   },
//   close: { color: Colors.primary, fontWeight: "700" },
//   commentRow: {
//     flexDirection: "row",
//     padding: 12,
//     borderBottomWidth: 1,
//     borderColor: Colors.border,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//     backgroundColor: Colors.surface,
//   },
//   name: { fontWeight: "700", color: Colors.textPrimary },
//   role: { fontSize: 12, color: Colors.warning, marginLeft: 4 },
//   time: { fontSize: 12, color: Colors.textSecondary, marginLeft: 4 },
//   text: { marginTop: 3, color: Colors.textPrimary },

//   /** 🔥 Input always fixed */
//   inputContainer: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     // paddingBottom: 10,
//     backgroundColor: Colors.lightCard,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//   },
//   inputRow: {
//     flexDirection: "row",
//     padding: 10,
//     alignItems: "center",
//   },
//   input: {
//     flex: 1,
//     backgroundColor: Colors.surface,
//     borderRadius: 20,
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     color: Colors.textPrimary,
//   },
//   sendBtn: {
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 12,
//     marginLeft: 10,
//   },
//   sendText: { color: "#fff", fontWeight: "600" },
// });

// (shared)/gallery/components/CommentsPopup.tsx
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  FlatList,
  Image,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { commentsService } from "../../../services/commentsService";

export default function CommentsPopup({ postId, onClose }: any) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [text, setText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const slideUp = useRef(new Animated.Value(500)).current;

  /** Small gap when keyboard opens */
  const keyboardGap = useRef(new Animated.Value(0)).current;

  const [inputBarHeight, setInputBarHeight] = useState(60);
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const formatRelativeTime = (ts: any) => {
    const ms = ts?.seconds ? ts.seconds * 1000 : Date.now();
    const diff = Date.now() - ms;

    const minutes = diff / 60000;
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${Math.floor(minutes)}m ago`;

    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}h ago`;

    return `${Math.floor(hours / 24)}d ago`;
  };

  /** Popup opening animation */
  useEffect(() => {
    Animated.timing(slideUp, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => inputRef.current?.focus(), 150);
    });
  }, []);

  /** Real-time comments */
  useEffect(() => {
    const unsub = commentsService.subscribeToComments(postId, (arr) =>
      setComments(arr)
    );
    return () => unsub();
  }, [postId]);

  /** ⭐ Keyboard → create only a small gap, DO NOT MOVE INPUT BAR */
  useEffect(() => {
    const onShow = (e: any) => {
      const gap = 12; // 12px space between input bar & keyboard

      Animated.timing(keyboardGap, {
        toValue: gap,
        duration: 180,
        useNativeDriver: false,
      }).start();
    };

    const onHide = () => {
      Animated.timing(keyboardGap, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    };

    const showEvent =
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
    const hideEvent =
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";

    const show = Keyboard.addListener(showEvent, onShow);
    const hide = Keyboard.addListener(hideEvent, onHide);

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  /** Android back press */
  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });
    return () => handler.remove();
  }, []);

  /** Send comment */
  // const send = async () => {
  //   if (!text.trim()) return;

  //   await commentsService.addComment({
  //     postId,
  //     text: text.trim(),
  //     userId: user?.uid ?? "",
  //     name: user?.fullName ?? "User",
  //     role: user?.role ?? "user",
  //     profileImage: user?.profileImage ?? null,
  //   });

  //   setText("");

  //   requestAnimationFrame(() => {
  //     listRef.current?.scrollToOffset({ offset: 0, animated: true });
  //   });
  // };

  const send = async () => {
    if (!text.trim()) return;

    const newComment = {
      id: Math.random().toString(), // temp id
      text: text.trim(),
      userId: user?.uid ?? "",
      name: user?.fullName ?? "User",
      role: user?.role ?? "user",
      profileImage: user?.profileImage ?? null,
      createdAt: { seconds: Date.now() / 1000 }, // local timestamp
    };

    // ⭐ 1. Update UI immediately
    setComments((prev) => [newComment, ...prev]);

    // ⭐ 2. Clear input instantly
    setText("");

    // ⭐ 3. Scroll instantly
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });

    // ⭐ 4. Send to Firestore in background
    await commentsService.addComment({
      postId,
      text: newComment.text,
      userId: newComment.userId,
      name: newComment.name,
      role: newComment.role,
      profileImage: newComment.profileImage,
    });
  };

  const onInputLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) setInputBarHeight(h);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[styles.popup, { transform: [{ translateY: slideUp }] }]}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={listRef}
            data={comments}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={{
              paddingBottom: inputBarHeight + insets.bottom + 12,
            }}
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              const showRole = item.role === "admin" || item.role === "monitor";

              return (
                <View style={styles.commentRow}>
                  <Image
                    source={
                      item.profileImage ? { uri: item.profileImage } : undefined
                    }
                    style={styles.avatar}
                  />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      <Text style={styles.name}>{item.name}</Text>
                      {showRole && (
                        <Text style={styles.role}> · {item.role}</Text>
                      )}
                      <Text style={styles.time}>
                        · {formatRelativeTime(item.createdAt)}
                      </Text>
                    </View>
                    <Text style={styles.text}>{item.text}</Text>
                  </View>
                </View>
              );
            }}
          />

          {/* ⭐ Input bar stays FIXED — we add ONLY paddingBottom gap */}
          <Animated.View
            style={[styles.inputContainer, { paddingBottom: keyboardGap }]}
            onLayout={onInputLayout}
          >
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                placeholder="Add a comment..."
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
                value={text}
                onChangeText={setText}
                returnKeyType="send"
                onSubmitEditing={send}
              />

              <TouchableOpacity
                onPress={send}
                disabled={!text.trim()}
                style={[styles.sendBtn, { opacity: text.trim() ? 1 : 0.4 }]}
              >
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  popup: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
    backgroundColor: Colors.lightCard,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  close: {
    color: Colors.primary,
    fontWeight: "700",
  },
  commentRow: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Colors.surface,
  },
  name: { fontWeight: "700", color: Colors.textPrimary },
  role: {
    fontSize: 12,
    color: Colors.warning,
    marginLeft: 4,
  },
  time: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  text: { marginTop: 3, color: Colors.textPrimary },

  inputContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0, // fixed at bottom
    backgroundColor: Colors.lightCard,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: Colors.textPrimary,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 10,
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
  },
});
