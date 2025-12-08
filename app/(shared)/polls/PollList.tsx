// // app/(shared)/polls/PollList.tsx
// import {
//   PollDoc,
//   PollOption,
//   VoteDoc,
//   pollService,
// } from "@/app/services/pollService";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   FlatList,
//   Image,
//   Modal,
//   Platform,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// const STATUSBAR_HEIGHT =
//   Platform.OS === "android" ? StatusBar.currentHeight || 0 : 24;

// // Time ago formatting
// const timeAgo = (date: Date) => {
//   const diff = (Date.now() - date.getTime()) / 1000;
//   const d = Math.floor(diff / 86400);
//   if (d === 0) return "Today";
//   if (d === 1) return "Yesterday";
//   return `${d}d ago`;
// };

// const OptionRow = ({
//   option,
//   selected,
//   disabled,
//   showResults,
//   percent,
//   onPress,
// }: {
//   option: PollOption;
//   selected: boolean;
//   disabled: boolean;
//   showResults: boolean;
//   percent: number;
//   onPress: () => void;
// }) => {
//   const anim = useRef(new Animated.Value(percent)).current;

//   useEffect(() => {
//     Animated.timing(anim, {
//       toValue: percent,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   }, [percent]);

//   return (
//     <Pressable
//       onPress={onPress}
//       disabled={disabled}
//       style={[
//         styles.optionRow,
//         selected && styles.optionRowSelected,
//         disabled && { opacity: 0.7 },
//       ]}
//     >
//       <View style={styles.optionHeader}>
//         <View style={styles.optionLeft}>
//           <Ionicons
//             name={selected ? "checkmark-circle" : "ellipse-outline"}
//             size={20}
//             color={selected ? Colors.primary : Colors.textMuted}
//             style={{ marginRight: 6 }}
//           />
//           <Text style={[styles.optionText, selected && { fontWeight: "700" }]}>
//             {option.label}
//           </Text>
//         </View>
//         {showResults && <Text style={styles.percentText}>{percent}%</Text>}
//       </View>

//       {showResults && (
//         <View style={styles.progress}>
//           <Animated.View
//             style={[
//               styles.progressFill,
//               {
//                 width: anim.interpolate({
//                   inputRange: [0, 100],
//                   outputRange: ["0%", "100%"],
//                 }),
//               },
//             ]}
//           />
//         </View>
//       )}
//     </Pressable>
//   );
// };

// export default function PollList() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const role = user?.role;
//   const userId = user?.uid ?? "";

//   const { pollId } = useLocalSearchParams<{ pollId?: string }>();
//   const canSeeAdminData = role === "admin" || role === "monitor";

//   const [polls, setPolls] = useState<PollDoc[]>([]);
//   const [userVotes, setUserVotes] = useState<Record<string, VoteDoc | null>>(
//     {}
//   );
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [votersLoading, setVotersLoading] = useState(false);
//   const [voters, setVoters] = useState<(VoteDoc & { id: string })[]>([]);

//   useEffect(() => {
//     return pollService.subscribeToPolls((list) => {
//       setPolls(pollId ? list.filter((p) => p.id === pollId) : list);
//       setLoading(false);
//     });
//   }, [pollId]);

//   useEffect(() => {
//     if (!userId) return;
//     const unsubs: (() => void)[] = [];

//     polls.forEach((p) => {
//       const unsub = pollService.subscribeToUserVote(p.id, userId, (vote) =>
//         setUserVotes((prev) => ({ ...prev, [p.id]: vote }))
//       );
//       unsubs.push(unsub);
//     });

//     return () => unsubs.forEach((u) => u());
//   }, [polls, userId]);

//   const handleVote = async (pollId: string, optionId: string) => {
//     const poll = polls.find((p) => p.id === pollId);
//     if (!poll) return;

//     const expired = poll.expiresAt && poll.expiresAt.toDate() < new Date();
//     if (expired) return Alert.alert("Poll ended");

//     const prev = userVotes[pollId];
//     const already = prev?.optionIds.includes(optionId);

//     if (!poll.allowRevote && prev) {
//       return Alert.alert("Vote locked");
//     }

//     if (already) {
//       await pollService.removeVoteOnPoll(pollId, userId);
//     } else {
//       await pollService.voteOnPoll({
//         pollId,
//         userId,
//         userName: user.fullName,
//         userRole: user.role,
//         profileImage: user.profileImage,
//         selectedOptionIds: [optionId],
//       });
//     }
//   };

//   const percent = (p: PollDoc, id: string) =>
//     p.totalVotes === 0
//       ? 0
//       : Math.round(
//           ((p.options.find((o) => o.id === id)?.votesCount || 0) /
//             p.totalVotes) *
//             100
//         );

//   const openVoters = async (pollId: string) => {
//     setModalVisible(true);
//     setVotersLoading(true);
//     setVoters(await pollService.getVoters(pollId));
//     setVotersLoading(false);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

//       {pollId && (
//         <Pressable onPress={() => router.back()} style={styles.backBtn}>
//           <Ionicons name="arrow-back" size={24} color={Colors.primary} />
//         </Pressable>
//       )}

//       {loading ? (
//         <ActivityIndicator size="large" color={Colors.primary} />
//       ) : (
//         <FlatList
//           data={polls}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingBottom: 80 }}
//           showsVerticalScrollIndicator={false}
//           renderItem={({ item }) => {
//             const expired =
//               item.expiresAt && item.expiresAt.toDate() < new Date();
//             const createdAt = item.createdAt?.toDate?.() ?? new Date();
//             const hrsAgo =
//               (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
//             const isNew = item.totalVotes === 0 || hrsAgo < 24;
//             const trending = item.totalVotes >= 8 && hrsAgo < 48;

//             const voted = !!userVotes[item.id];
//             const showResults = expired || voted || canSeeAdminData;

//             return (
//               <View style={styles.card}>
//                 <View style={styles.headerRow}>
//                   <View style={styles.tagWrap}>
//                     {isNew && (
//                       <Text style={[styles.tag, styles.newTag]}>NEW</Text>
//                     )}
//                     {trending && (
//                       <Text style={[styles.tag, styles.hotTag]}>🔥</Text>
//                     )}
//                   </View>

//                   <Text
//                     style={[
//                       styles.statusTag,
//                       expired ? styles.tagEnded : styles.tagLive,
//                     ]}
//                   >
//                     {expired ? "Ended" : "Live"}
//                   </Text>
//                 </View>

//                 <Text style={styles.question}>{item.question}</Text>

//                 {canSeeAdminData && (
//                   <Text style={styles.meta}>
//                     {item.createdBy.name} · {timeAgo(createdAt)}
//                   </Text>
//                 )}

//                 {item.options.map((opt) => (
//                   <OptionRow
//                     key={opt.id}
//                     option={opt}
//                     selected={
//                       userVotes[item.id]?.optionIds.includes(opt.id) ?? false
//                     }
//                     disabled={!pollId && !polls?.length}
//                     showResults={showResults}
//                     percent={percent(item, opt.id)}
//                     onPress={() => handleVote(item.id, opt.id)}
//                   />
//                 ))}

//                 <View style={styles.footerRow}>
//                   <Text style={styles.footerText}>{item.totalVotes} votes</Text>

//                   {canSeeAdminData && (
//                     <Pressable
//                       onPress={() => openVoters(item.id)}
//                       style={styles.userBtn}
//                     >
//                       <Ionicons
//                         name="people-outline"
//                         size={14}
//                         color={Colors.textInverse}
//                       />
//                       <Text style={styles.userBtnText}>Users</Text>
//                     </Pressable>
//                   )}
//                 </View>
//               </View>
//             );
//           }}
//         />
//       )}

//       <Modal visible={modalVisible} transparent animationType="fade">
//         <View style={styles.modalBg}>
//           <View style={styles.modalCard}>
//             {votersLoading ? (
//               <ActivityIndicator size="small" color={Colors.primary} />
//             ) : voters.length === 0 ? (
//               <Text style={styles.emptyText}>No votes yet</Text>
//             ) : (
//               voters.map((v) => (
//                 <View key={v.id} style={styles.voterRow}>
//                   <Image
//                     source={
//                       v.profileImage
//                         ? { uri: v.profileImage }
//                         : require("@/assets/images/profile.png")
//                     }
//                     style={styles.voterAvatar}
//                   />
//                   <Text style={styles.voterName}>{v.userName}</Text>
//                   <Text style={styles.voterRole}>{v.userRole}</Text>
//                 </View>
//               ))
//             )}
//             <Pressable onPress={() => setModalVisible(false)}>
//               <Text style={styles.close}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// /*** Styles ***/
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     paddingTop: STATUSBAR_HEIGHT + 10,
//     paddingHorizontal: 14,
//   },
//   backBtn: { paddingVertical: 6, paddingLeft: 2, marginBottom: 6 },
//   card: {
//     backgroundColor: Colors.card,
//     borderRadius: 18,
//     padding: 16,
//     marginBottom: 18,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   headerRow: { flexDirection: "row", justifyContent: "space-between" },
//   tagWrap: { flexDirection: "row", gap: 6 },
//   tag: {
//     fontSize: 11,
//     fontWeight: "700",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   newTag: { backgroundColor: Colors.tagNew },
//   hotTag: { backgroundColor: Colors.tagHot },
//   statusTag: {
//     fontSize: 13,
//     fontWeight: "700",
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 999,
//   },
//   tagLive: { backgroundColor: Colors.success + "33" },
//   tagEnded: { backgroundColor: Colors.error + "33" },
//   question: {
//     marginTop: 4,
//     fontSize: 16,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//   },
//   meta: {
//     marginTop: 2,
//     fontSize: 12,
//     fontStyle: "italic",
//     color: Colors.textSecondary,
//   },
//   optionRow: {
//     backgroundColor: Colors.surface,
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     marginTop: 10,
//   },
//   optionRowSelected: {
//     backgroundColor: Colors.highlight,
//     borderColor: Colors.primary,
//   },
//   optionHeader: { flexDirection: "row", justifyContent: "space-between" },
//   optionLeft: { flexDirection: "row", alignItems: "center" },
//   optionText: { fontSize: 14, color: Colors.textPrimary },
//   percentText: { fontSize: 12, fontWeight: "700", color: Colors.textSecondary },
//   progress: {
//     height: 6,
//     backgroundColor: Colors.surfaceDark,
//     borderRadius: 999,
//     marginTop: 4,
//   },
//   progressFill: {
//     height: 6,
//     backgroundColor: Colors.primary,
//     borderRadius: 999,
//   },
//   footerRow: {
//     marginTop: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   footerText: { fontSize: 12, color: Colors.textMuted },
//   userBtn: {
//     flexDirection: "row",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     backgroundColor: Colors.primary,
//     borderRadius: 999,
//     alignItems: "center",
//     gap: 4,
//   },
//   userBtnText: { fontSize: 12, color: Colors.textInverse, fontWeight: "600" },
//   modalBg: {
//     flex: 1,
//     backgroundColor: Colors.overlay,
//     justifyContent: "center",
//     paddingHorizontal: 20,
//   },
//   modalCard: {
//     backgroundColor: Colors.card,
//     borderRadius: 16,
//     padding: 16,
//     maxHeight: "70%",
//   },
//   close: {
//     marginTop: 10,
//     textAlign: "center",
//     fontSize: 14,
//     fontWeight: "700",
//     color: Colors.primary,
//   },
//   emptyText: {
//     textAlign: "center",
//     color: Colors.textMuted,
//     marginVertical: 10,
//   },
//   voterRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
//   voterAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
//   voterName: { flex: 1, fontSize: 14, fontWeight: "600" },
//   voterRole: { fontSize: 12, color: Colors.textSecondary },
// });

/// app/(shared)/polls/PollList.tsx

// import {
//   PollDoc,
//   PollOption,
//   VoteDoc,
//   pollService,
// } from "@/app/services/pollService";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   FlatList,
//   Image,
//   Modal,
//   Platform,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// const STATUSBAR_HEIGHT =
//   Platform.OS === "android" ? StatusBar.currentHeight || 0 : 28;

// export default function PollList() {
//   const router = useRouter();
//   const { pollId } = useLocalSearchParams<{ pollId?: string }>();
//   const { user } = useAuth();
//   const userId = user?.uid ?? "";
//   const role = user?.role ?? "user";
//   const isAdmin = role === "admin" || role === "monitor";

//   const [polls, setPolls] = useState<PollDoc[]>([]);
//   const [userVotes, setUserVotes] = useState<Record<string, VoteDoc | null>>(
//     {}
//   );
//   const [loading, setLoading] = useState(true);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [voters, setVoters] = useState<(VoteDoc & { id: string })[]>([]);
//   const [votersLoading, setVotersLoading] = useState(false);

//   useEffect(() => {
//     return pollService.subscribeToPolls((list) => {
//       const filtered = pollId ? list.filter((p) => p.id === pollId) : list;
//       setPolls(filtered);
//       setLoading(false);
//     });
//   }, [pollId]);

//   useEffect(() => {
//     if (!userId) return;
//     const unsubs: any[] = [];

//     polls.forEach((p) => {
//       const unsub = pollService.subscribeToUserVote(p.id, userId, (vote) =>
//         setUserVotes((prev) => ({
//           ...prev,
//           [p.id]: vote,
//         }))
//       );
//       unsubs.push(unsub);
//     });

//     return () => unsubs.forEach((u) => u());
//   }, [polls, userId]);

//   const percent = (p: PollDoc, id: string) => {
//     const opt = p.options.find((o) => o.id === id);
//     if (p.totalVotes === 0 || !opt) return 0;
//     return Math.round((opt.votesCount / p.totalVotes) * 100);
//   };

//   const handleVote = async (pollId: string, optionId: string) => {
//     const poll = polls.find((p) => p.id === pollId);
//     if (!poll) return;

//     if (poll.expiresAt && poll.expiresAt.toDate() < new Date())
//       return Alert.alert("Poll expired");

//     const prev = userVotes[pollId];
//     const selectedAlready = prev?.optionIds.includes(optionId);

//     if (poll.pollType === "multiple") {
//       const updatedIds = selectedAlready
//         ? prev?.optionIds.filter((id) => id !== optionId) || []
//         : [...(prev?.optionIds ?? []), optionId];

//       return pollService.voteMultiple(pollId, userId, updatedIds, user);
//     }

//     if (selectedAlready) return pollService.removeVoteOnPoll(pollId, userId);

//     return pollService.voteOnPoll({
//       pollId,
//       userId,
//       selectedOptionIds: [optionId],
//       userName: user.fullName,
//       userRole: user.role,
//       profileImage: user.profileImage,
//     });
//   };

//   // Animated Progress Bar
//   const AnimatedBar = ({ percentage }: { percentage: number }) => {
//     const widthAnim = useRef(new Animated.Value(0)).current;
//     useEffect(() => {
//       Animated.timing(widthAnim, {
//         toValue: percentage,
//         duration: 600,
//         useNativeDriver: false,
//       }).start();
//     }, [percentage]);

//     return (
//       <Animated.View
//         style={{
//           height: 6,
//           backgroundColor: Colors.primary,
//           width: widthAnim.interpolate({
//             inputRange: [0, 100],
//             outputRange: ["0%", "100%"],
//           }),
//           borderRadius: 999,
//         }}
//       />
//     );
//   };

//   const timeAgo = (date: Date) => {
//     const diff = (Date.now() - date.getTime()) / 1000;
//     const d = Math.floor(diff / 86400);
//     if (d <= 0) return "Today";
//     if (d === 1) return "Yesterday";
//     return `${d}d ago`;
//   };

//   const isNewPoll = (created: Date) => {
//     const hours = (Date.now() - created.getTime()) / (1000 * 60 * 60);
//     return hours < 48; // 🔥 new if < 2 days old
//   };

//   const renderOption = (opt: PollOption, poll: PollDoc) => {
//     const userVote = userVotes[poll.id];
//     const selected = userVote?.optionIds.includes(opt.id) ?? false;
//     const showResults =
//       userVote ||
//       isAdmin ||
//       (poll.expiresAt && poll.expiresAt.toDate() < new Date());

//     const p = percent(poll, opt.id);

//     return (
//       <Pressable
//         key={opt.id}
//         onPress={() => handleVote(poll.id, opt.id)}
//         style={[
//           styles.optionRow,
//           selected && {
//             backgroundColor: Colors.highlight,
//             borderColor: Colors.primary,
//             transform: [{ scale: 1.02 }],
//             shadowColor: Colors.primary,
//             shadowOpacity: 0.2,
//             shadowRadius: 9,
//           },
//         ]}
//       >
//         <View style={styles.optionTop}>
//           <Text style={[styles.optionText, selected && styles.bold]}>
//             {opt.label}
//           </Text>
//           {showResults && <Text style={styles.percentText}>{p}%</Text>}
//         </View>

//         {showResults && (
//           <View style={styles.progressTrack}>
//             <AnimatedBar percentage={p} />
//           </View>
//         )}
//       </Pressable>
//     );
//   };

//   const openVoters = async (pollId: string) => {
//     setModalVisible(true);
//     setVotersLoading(true);
//     const list = await pollService.getVoters(pollId);
//     setVoters(list);
//     setVotersLoading(false);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" />

//       {pollId && (
//         <Pressable onPress={() => router.back()} style={{ marginBottom: 12 }}>
//           <Ionicons name="arrow-back" size={26} color={Colors.primary} />
//         </Pressable>
//       )}

//       {loading ? (
//         <ActivityIndicator size="large" color={Colors.primary} />
//       ) : (
//         <FlatList
//           data={polls}
//           keyExtractor={(i) => i.id}
//           contentContainerStyle={{ paddingBottom: 90 }}
//           renderItem={({ item }) => {
//             const created = item.createdAt?.toDate?.() ?? new Date();
//             const expired =
//               item.expiresAt && item.expiresAt.toDate() < new Date();

//             const sortedOptions =
//               item.pollType === "rating"
//                 ? [...item.options].sort(
//                     (a, b) => parseInt(b.id) - parseInt(a.id)
//                   )
//                 : item.options;

//             const newTag = isNewPoll(created);

//             return (
//               <View
//                 style={[
//                   styles.card,
//                   newTag && {
//                     borderColor: Colors.primary,
//                     borderWidth: 2,
//                     shadowColor: Colors.primary,
//                     shadowOpacity: 0.25,
//                     shadowRadius: 12,
//                   },
//                 ]}
//               >
//                 <View style={styles.rowBetween}>
//                   <Text style={styles.question}>{item.question}</Text>

//                   {newTag && (
//                     <View style={styles.newTag}>
//                       <Text style={styles.newTagText}>✨ NEW</Text>
//                     </View>
//                   )}
//                 </View>

//                 <Text style={styles.dateText}>
//                   {created.toDateString()} • {timeAgo(created)}
//                 </Text>

//                 {sortedOptions.map((o) => renderOption(o, item))}

//                 <View style={styles.footerRow}>
//                   <Text style={styles.votesText}>{item.totalVotes} votes</Text>

//                   {isAdmin && (
//                     <Pressable
//                       style={styles.voterBtn}
//                       onPress={() => openVoters(item.id)}
//                     >
//                       <Ionicons name="eye-outline" size={14} color="#fff" />
//                       <Text style={styles.voterBtnText}>View</Text>
//                     </Pressable>
//                   )}
//                 </View>
//               </View>
//             );
//           }}
//         />
//       )}

//       {/* VOTERS MODAL */}
//       <Modal visible={modalVisible} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             {votersLoading ? (
//               <ActivityIndicator color={Colors.primary} />
//             ) : voters.length === 0 ? (
//               <Text style={styles.empty}>No votes yet</Text>
//             ) : (
//               voters.map((u) => (
//                 <View key={u.id} style={styles.voterRow}>
//                   <Image
//                     source={
//                       u.profileImage
//                         ? { uri: u.profileImage }
//                         : require("@/assets/images/profile.png")
//                     }
//                     style={styles.avatar}
//                   />
//                   <Text style={styles.voterName}>{u.userName}</Text>
//                   <Text style={styles.voterRole}>{u.userRole}</Text>
//                 </View>
//               ))
//             )}

//             <Pressable onPress={() => setModalVisible(false)}>
//               <Text style={styles.closeBtn}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     paddingTop: STATUSBAR_HEIGHT + 10,
//     paddingHorizontal: 12,
//   },
//   card: {
//     backgroundColor: Colors.card,
//     padding: 14,
//     borderRadius: 14,
//     borderColor: Colors.border,
//     borderWidth: 1,
//     marginBottom: 18,
//   },
//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   newTag: {
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 999,
//     shadowColor: Colors.primary,
//     shadowOpacity: 0.4,
//     shadowRadius: 7,
//   },
//   newTagText: {
//     color: Colors.textInverse,
//     fontSize: 11,
//     fontWeight: "700",
//   },
//   dateText: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//     marginTop: 3,
//     marginBottom: 6,
//   },
//   question: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//   },
//   optionRow: {
//     marginTop: 12,
//     padding: 12,
//     backgroundColor: Colors.surface,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   optionTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   optionText: {
//     fontSize: 15,
//     color: Colors.textPrimary,
//   },
//   bold: {
//     fontWeight: "700",
//   },
//   percentText: {
//     fontSize: 12,
//     color: "rgba(0,0,0,0.45)",
//   },
//   progressTrack: {
//     marginTop: 6,
//     backgroundColor: Colors.surfaceDark,
//     height: 6,
//     borderRadius: 999,
//     overflow: "hidden",
//   },
//   footerRow: {
//     marginTop: 14,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   votesText: {
//     fontSize: 12,
//     color: Colors.textMuted,
//   },
//   voterBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 999,
//   },
//   voterBtnText: {
//     marginLeft: 4,
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#fff",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: Colors.overlay,
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalCard: {
//     backgroundColor: Colors.card,
//     borderRadius: 16,
//     padding: 20,
//     maxHeight: "70%",
//   },
//   voterRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 6,
//   },
//   avatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 999,
//     marginRight: 10,
//   },
//   voterName: {
//     flex: 1,
//     fontWeight: "700",
//     fontSize: 14,
//   },
//   voterRole: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//   },
//   closeBtn: {
//     textAlign: "center",
//     marginTop: 14,
//     fontSize: 14,
//     color: Colors.primary,
//     fontWeight: "700",
//   },
//   empty: {
//     textAlign: "center",
//     color: Colors.textMuted,
//     marginBottom: 10,
//   },
// });

// // app/(shared)/polls/PollList.tsx
// import {
//   PollDoc,
//   PollOption,
//   VoteDoc,
//   pollService,
// } from "@/app/services/pollService";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   FlatList,
//   Image,
//   Modal,
//   Platform,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// const STATUSBAR_HEIGHT =
//   Platform.OS === "android" ? StatusBar.currentHeight || 0 : 28;

// export default function PollList() {
//   const router = useRouter();
//   const { pollId } = useLocalSearchParams<{ pollId?: string }>();
//   const { user } = useAuth();
//   const userId = user?.uid ?? "";
//   const role = user?.role ?? "user";
//   const isAdminOrMonitor = role === "admin" || role === "monitor";

//   const [polls, setPolls] = useState<PollDoc[]>([]);
//   const [userVotes, setUserVotes] = useState<Record<string, VoteDoc | null>>(
//     {}
//   );
//   const [loading, setLoading] = useState(true);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [voters, setVoters] = useState<(VoteDoc & { id: string })[]>([]);
//   const [votersLoading, setVotersLoading] = useState(false);

//   // 💡 Track which poll was last interacted, to animate only that one
//   const [lastVotedPollId, setLastVotedPollId] = useState<string | null>(null);

//   // Subscribe to polls
//   useEffect(() => {
//     return pollService.subscribeToPolls((list) => {
//       const filtered = pollId ? list.filter((p) => p.id === pollId) : list;
//       setPolls(filtered);
//       setLoading(false);
//     });
//   }, [pollId]);

//   // Subscribe to each poll's vote for this user
//   useEffect(() => {
//     if (!userId) return;
//     const unsubs: (() => void)[] = [];

//     polls.forEach((p) => {
//       const unsub = pollService.subscribeToUserVote(p.id, userId, (vote) =>
//         setUserVotes((prev) => ({
//           ...prev,
//           [p.id]: vote,
//         }))
//       );
//       unsubs.push(unsub);
//     });

//     return () => unsubs.forEach((u) => u());
//   }, [polls, userId]);

//   // Percent based on actual options sum (not trusting totalVotes only)
//   const percent = (p: PollDoc, optionId: string) => {
//     const total = p.options.reduce((sum, o) => sum + (o.votesCount || 0), 0);
//     if (total === 0) return 0;
//     const opt = p.options.find((o) => o.id === optionId);
//     if (!opt) return 0;
//     return Math.round(((opt.votesCount || 0) / total) * 100);
//   };

//   const handleVote = async (pollId: string, optionId: string) => {
//     const poll = polls.find((p) => p.id === pollId);
//     if (!poll) return;

//     if (poll.expiresAt && poll.expiresAt.toDate() < new Date()) {
//       return Alert.alert("Poll expired");
//     }

//     const prev = userVotes[pollId];
//     const selectedAlready = prev?.optionIds.includes(optionId);

//     // Mark which poll to animate
//     setLastVotedPollId(pollId);

//     if (poll.pollType === "multiple") {
//       const updatedIds = selectedAlready
//         ? prev?.optionIds.filter((id) => id !== optionId) || []
//         : [...(prev?.optionIds ?? []), optionId];

//       return pollService.voteMultiple(pollId, userId, updatedIds, {
//         uid: user.uid,
//         fullName: user.fullName,
//         role: user.role,
//         profileImage: user.profileImage,
//       });
//     }

//     // single / rating — toggle off if already selected
//     if (selectedAlready) {
//       return pollService.removeVoteOnPoll(pollId, userId);
//     }

//     return pollService.voteOnPoll({
//       pollId,
//       userId,
//       selectedOptionIds: [optionId],
//       userName: user.fullName,
//       userRole: user.role,
//       profileImage: user.profileImage,
//     });
//   };

//   // Animated bar that only animates for lastVotedPollId
//   const AnimatedBar = ({
//     percentage,
//     animated,
//   }: {
//     percentage: number;
//     animated: boolean;
//   }) => {
//     const widthAnim = useRef(new Animated.Value(percentage)).current;

//     useEffect(() => {
//       if (!animated) {
//         // directly jump to current percentage for other polls
//         widthAnim.setValue(percentage);
//         return;
//       }

//       Animated.timing(widthAnim, {
//         toValue: percentage,
//         duration: 550,
//         delay: 60,
//         useNativeDriver: false,
//       }).start();
//     }, [percentage, animated]);

//     const animatedWidth = widthAnim.interpolate({
//       inputRange: [0, 100],
//       outputRange: ["0%", "100%"],
//     });

//     return (
//       <Animated.View
//         style={{
//           height: 6,
//           width: animatedWidth,
//           backgroundColor: Colors.primary,
//           borderRadius: 999,
//         }}
//       />
//     );
//   };

//   const timeAgo = (date: Date) => {
//     const diff = (Date.now() - date.getTime()) / 1000;
//     const d = Math.floor(diff / 86400);
//     if (d <= 0) return "Today";
//     if (d === 1) return "Yesterday";
//     return `${d}d ago`;
//   };

//   const isNewPoll = (created: Date) => {
//     const hours = (Date.now() - created.getTime()) / (1000 * 60 * 60);
//     return hours < 48; // < 2 days
//   };

//   const renderOption = (opt: PollOption, poll: PollDoc) => {
//     const userVote = userVotes[poll.id];
//     const selected = userVote?.optionIds.includes(opt.id) ?? false;
//     const showResults =
//       !!userVote ||
//       isAdminOrMonitor ||
//       (poll.expiresAt && poll.expiresAt.toDate() < new Date());

//     const p = percent(poll, opt.id);

//     return (
//       <Pressable
//         key={`${poll.id}-${opt.id}`}
//         onPress={() => handleVote(poll.id, opt.id)}
//         style={[
//           styles.optionRow,
//           selected && {
//             backgroundColor: Colors.highlight,
//             borderColor: Colors.primary,
//             transform: [{ scale: 1.02 }],
//             shadowColor: Colors.primary,
//             shadowOpacity: 0.22,
//             shadowRadius: 8,
//           },
//         ]}
//       >
//         <View style={styles.optionTop}>
//           <Text style={[styles.optionText, selected && styles.bold]}>
//             {opt.label}
//           </Text>
//           {showResults && <Text style={styles.percentText}>{p}%</Text>}
//         </View>

//         {showResults && (
//           <View style={styles.progressTrack}>
//             <AnimatedBar
//               percentage={p}
//               animated={lastVotedPollId === poll.id}
//             />
//           </View>
//         )}
//       </Pressable>
//     );
//   };

//   const openVoters = async (pollId: string) => {
//     setModalVisible(true);
//     setVotersLoading(true);
//     const list = await pollService.getVoters(pollId);
//     setVoters(list);
//     setVotersLoading(false);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

//       {pollId && (
//         <Pressable onPress={() => router.back()} style={{ marginBottom: 10 }}>
//           <Ionicons name="arrow-back" size={26} color={Colors.primary} />
//         </Pressable>
//       )}

//       {loading ? (
//         <ActivityIndicator size="large" color={Colors.primary} />
//       ) : (
//         <FlatList
//           data={polls}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingBottom: 90 }}
//           renderItem={({ item }) => {
//             const created = item.createdAt?.toDate?.() ?? new Date();
//             const isNew = isNewPoll(created);

//             // Rating: sort stars 5→1, emojis 😍→😡
//             const sortedOptions =
//               item.pollType === "rating"
//                 ? [...item.options].sort((a, b) => {
//                     const na = parseInt(a.id);
//                     const nb = parseInt(b.id);
//                     if (!isNaN(na) && !isNaN(nb)) {
//                       // stars: numeric IDs
//                       return nb - na;
//                     }
//                     // emoji IDs: a..e → sort reverse alphabet
//                     if (a.id < b.id) return 1;
//                     if (a.id > b.id) return -1;
//                     return 0;
//                   })
//                 : item.options;

//             // For votes text, recompute from options so it's always correct
//             const totalVotes = item.options.reduce(
//               (sum, o) => sum + (o.votesCount || 0),
//               0
//             );

//             return (
//               <View
//                 style={[
//                   styles.card,
//                   isNew && {
//                     borderColor: Colors.primary,
//                     borderWidth: 2,
//                     shadowColor: Colors.primary,
//                     shadowOpacity: 0.25,
//                     shadowRadius: 12,
//                   },
//                 ]}
//               >
//                 <View style={styles.rowBetween}>
//                   <Text style={styles.question}>{item.question}</Text>
//                   {isNew && (
//                     <View style={styles.newTag}>
//                       <Text style={styles.newTagText}>✨ NEW</Text>
//                     </View>
//                   )}
//                 </View>

//                 <Text style={styles.dateText}>
//                   {created.toDateString()} • {timeAgo(created)}
//                 </Text>

//                 {sortedOptions.map((o) => renderOption(o, item))}

//                 <View style={styles.footerRow}>
//                   <Text style={styles.votesText}>{totalVotes} votes</Text>

//                   {isAdminOrMonitor && (
//                     <Pressable
//                       style={styles.voterBtn}
//                       onPress={() => openVoters(item.id)}
//                     >
//                       <Ionicons
//                         name="eye-outline"
//                         size={14}
//                         color={Colors.textInverse}
//                       />
//                       <Text style={styles.voterBtnText}>Users</Text>
//                     </Pressable>
//                   )}
//                 </View>
//               </View>
//             );
//           }}
//         />
//       )}

//       {/* Voters Modal (Admins & Monitors only can open) */}
//       <Modal visible={modalVisible} transparent animationType="fade">
//         <View className="overlay" style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             {votersLoading ? (
//               <ActivityIndicator color={Colors.primary} />
//             ) : voters.length === 0 ? (
//               <Text style={styles.empty}>No votes yet</Text>
//             ) : (
//               voters.map((u) => (
//                 <View key={u.id} style={styles.voterRow}>
//                   <Image
//                     source={
//                       u.profileImage
//                         ? { uri: u.profileImage }
//                         : require("@/assets/images/profile.png")
//                     }
//                     style={styles.avatar}
//                   />
//                   <Text style={styles.voterName}>{u.userName}</Text>
//                   <Text style={styles.voterRole}>{u.userRole}</Text>
//                 </View>
//               ))
//             )}

//             <Pressable onPress={() => setModalVisible(false)}>
//               <Text style={styles.closeBtn}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// /********* STYLES *********/
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     paddingTop: STATUSBAR_HEIGHT + 10,
//     paddingHorizontal: 12,
//   },
//   card: {
//     backgroundColor: Colors.card,
//     padding: 14,
//     borderRadius: 14,
//     borderColor: Colors.border,
//     borderWidth: 1,
//     marginBottom: 18,
//   },
//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   question: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//     flex: 1,
//     paddingRight: 8,
//   },
//   newTag: {
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 999,
//     shadowColor: Colors.primary,
//     shadowOpacity: 0.4,
//     shadowRadius: 7,
//   },
//   newTagText: {
//     color: Colors.textInverse,
//     fontSize: 11,
//     fontWeight: "700",
//   },
//   dateText: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//     marginTop: 3,
//     marginBottom: 6,
//   },
//   optionRow: {
//     marginTop: 12,
//     padding: 12,
//     backgroundColor: Colors.surface,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   optionTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   optionText: {
//     fontSize: 15,
//     color: Colors.textPrimary,
//   },
//   bold: {
//     fontWeight: "700",
//   },
//   percentText: {
//     fontSize: 12,
//     color: "rgba(0,0,0,0.45)",
//   },
//   progressTrack: {
//     marginTop: 6,
//     backgroundColor: Colors.surfaceDark,
//     height: 6,
//     borderRadius: 999,
//     overflow: "hidden",
//   },
//   footerRow: {
//     marginTop: 14,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   votesText: {
//     fontSize: 12,
//     color: Colors.textMuted,
//   },
//   voterBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 999,
//   },
//   voterBtnText: {
//     marginLeft: 4,
//     fontSize: 11,
//     fontWeight: "700",
//     color: Colors.textInverse,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: Colors.overlay,
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalCard: {
//     backgroundColor: Colors.card,
//     borderRadius: 16,
//     padding: 20,
//     maxHeight: "70%",
//   },
//   voterRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 6,
//   },
//   avatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 999,
//     marginRight: 10,
//   },
//   voterName: {
//     flex: 1,
//     fontWeight: "700",
//     fontSize: 14,
//   },
//   voterRole: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//   },
//   closeBtn: {
//     textAlign: "center",
//     marginTop: 14,
//     fontSize: 14,
//     color: Colors.primary,
//     fontWeight: "700",
//   },
//   empty: {
//     textAlign: "center",
//     color: Colors.textMuted,
//     marginBottom: 10,
//   },
// });

// app/(shared)/polls/PollList.tsx
import { PollDoc, VoteDoc, pollService } from "@/app/services/pollService";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PollCard from "./PollCard";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 0 : 28;

export default function PollList() {
  const router = useRouter();
  const { pollId } = useLocalSearchParams<{ pollId?: string }>();
  const { user } = useAuth();
  const userId = user?.uid ?? "";
  const role = user?.role ?? "user";
  const isAdminOrMonitor = role === "admin" || role === "monitor";

  const [polls, setPolls] = useState<PollDoc[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, VoteDoc | null>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  const [lastVotedPollId, setLastVotedPollId] = useState<string | null>(null);

  // Voters Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [voters, setVoters] = useState<(VoteDoc & { id: string })[]>([]);
  const [votersLoading, setVotersLoading] = useState(false);

  // Subscribe to polls list
  useEffect(() => {
    return pollService.subscribeToPolls((list) => {
      const filtered = pollId ? list.filter((p) => p.id === pollId) : list;
      setPolls(filtered);
      setLoading(false);
    });
  }, [pollId]);

  // Subscribe to each poll vote state
  useEffect(() => {
    if (!userId) return;
    const unsubs: (() => void)[] = [];

    polls.forEach((p) => {
      const unsub = pollService.subscribeToUserVote(p.id, userId, (vote) =>
        setUserVotes((prev) => ({
          ...prev,
          [p.id]: vote,
        }))
      );
      unsubs.push(unsub);
    });

    return () => unsubs.forEach((u) => u());
  }, [polls, userId]);

  const handleVote = async (pollId: string, optionId: string) => {
    const poll = polls.find((p) => p.id === pollId);
    if (!poll) return;

    if (poll.expiresAt && poll.expiresAt.toDate() < new Date())
      return Alert.alert("Poll expired");

    const prev = userVotes[pollId];
    const selected = prev?.optionIds.includes(optionId);

    setLastVotedPollId(pollId);

    if (poll.pollType === "multiple") {
      const updatedIds = selected
        ? prev?.optionIds.filter((x) => x !== optionId) || []
        : [...(prev?.optionIds ?? []), optionId];

      return pollService.voteMultiple(pollId, userId, updatedIds, user);
    }

    if (selected) return pollService.removeVoteOnPoll(pollId, userId);

    return pollService.voteOnPoll({
      pollId,
      userId,
      selectedOptionIds: [optionId],
      userName: user.fullName,
      userRole: user.role,
      profileImage: user.profileImage,
    });
  };

  // Voters modal open
  const openVoters = async (pollId: string) => {
    setModalVisible(true);
    setVotersLoading(true);
    const list = await pollService.getVoters(pollId);
    setVoters(list);
    setVotersLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {pollId && (
        <Pressable onPress={() => router.back()} style={{ marginBottom: 12 }}>
          <Ionicons name="arrow-back" size={26} color={Colors.primary} />
        </Pressable>
      )}

      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item }) => (
            <PollCard
              poll={item}
              userVote={userVotes[item.id]}
              onVote={handleVote}
              onViewVoters={openVoters}
              isAdminOrMonitor={isAdminOrMonitor}
              lastVotedPollId={lastVotedPollId}
            />
          )}
        />
      )}

      {/* 🤫 VOTERS MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {votersLoading ? (
              <ActivityIndicator color={Colors.primary} />
            ) : voters.length === 0 ? (
              <Text style={styles.noVotes}>No votes yet</Text>
            ) : (
              voters.map((u) => (
                <View key={u.id} style={styles.voterRow}>
                  <Image
                    source={
                      u.profileImage
                        ? { uri: u.profileImage }
                        : require("@/assets/images/profile.png")
                    }
                    style={styles.avatar}
                  />
                  <Text style={styles.voterName}>{u.userName}</Text>
                  <Text style={styles.voterRole}>{u.userRole}</Text>
                </View>
              ))
            )}

            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtn}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/********* STYLES *********/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    maxHeight: "70%",
  },
  noVotes: {
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: 8,
  },
  voterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 99,
    marginRight: 10,
  },
  voterName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  voterRole: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  closeBtn: {
    color: Colors.primary,
    textAlign: "center",
    marginTop: 14,
    fontWeight: "700",
    fontSize: 14,
  },
});
