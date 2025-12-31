// // app/(admin)/(tabs)/Dashboard.tsx
// import GlossyBackground from "@/componenets/Shared/GlossyBackground";
// import { db } from "@/configs/FirebaseConfig";
// import Colors from "@/data/Colors";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { router } from "expo-router";
// import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Dimensions,
//   FlatList,
//   Image,
//   ImageBackground,
//   Pressable,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// const { width } = Dimensions.get("window");

// export default function Dashboard() {
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [events, setEvents] = useState<any[]>([]);
//   const [news, setNews] = useState<any[]>([]);

//   useEffect(() => {
//     const unsubEvents = onSnapshot(
//       query(collection(db, "events"), orderBy("createdAt", "desc")),
//       (snap) => {
//         setEvents(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
//         setLoading(false);
//       }
//     );

//     const unsubNews = onSnapshot(
//       query(collection(db, "news"), orderBy("createdAt", "desc")),
//       (snap) => {
//         setNews(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
//       }
//     );

//     return () => {
//       unsubEvents();
//       unsubNews();
//     };
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     setTimeout(() => setRefreshing(false), 1000);
//   };

//   const menuItems = [
//     {
//       icon: "people-outline",
//       label: "Manage Users",
//       route: "/(admin)/(tabs)/ManageUsers",
//     },
//     {
//       icon: "newspaper-outline",
//       label: "Manage News",
//       route: "/(admin)/(tabs)/ManageNews",
//     },
//     {
//       icon: "calendar-outline",
//       label: "Events",
//       route: "/(admin)/(tabs)/ManageEvents",
//     },
//     {
//       icon: "alert-circle-outline",
//       label: "Complaints",
//       route: "/(admin)/(tabs)/Complaints",
//     },
//     {
//       icon: "notifications-outline",
//       label: "Notifications",
//       route: "/(admin)/(tabs)/Notifications",
//     },
//     {
//       icon: "settings-outline",
//       label: "Settings",
//       route: "/(admin)/(tabs)/Settings",
//     },
//   ];

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <GlossyBackground>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {/* HEADER */}
//         <View style={styles.header}>
//           <View style={styles.leaderInfo}>
//             <Image
//               source={{ uri: "https://via.placeholder.com/80x80" }}
//               style={styles.leaderAvatar}
//             />
//             <View>
//               <Text style={styles.leaderName}>Welcome Back, Admin</Text>
//               <Text style={styles.subText}>System Overview</Text>
//             </View>
//           </View>
//           <Ionicons
//             name="person-circle-outline"
//             size={32}
//             color={Colors.icons}
//           />
//         </View>

//         {/* SECTION: Highlights */}
//         <View style={styles.sectionContainer}>
//           <SectionHeader
//             title="Highlights"
//             showViewAll
//             onViewAll={() => router.push("/(admin)/(tabs)/ManageNews")}
//           />
//           <FlatList
//             data={news.slice(0, 5)}
//             keyExtractor={(item) => item.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.carousel}
//             renderItem={({ item }) => (
//               <Pressable
//                 onPress={() =>
//                   router.push({
//                     pathname: "/(shared)/NewsDetails",
//                     params: { id: item.id },
//                   })
//                 }
//               >
//                 <ImageBackground
//                   source={{
//                     uri: item.imageUrl || "https://via.placeholder.com/400x200",
//                   }}
//                   style={styles.banner}
//                   imageStyle={styles.bannerImage}
//                 >
//                   <LinearGradient
//                     colors={["transparent", "rgba(0,0,0,0.65)"]}
//                     style={styles.bannerOverlay}
//                   >
//                     <Text style={styles.bannerTitle} numberOfLines={2}>
//                       {item.title || "Untitled News"}
//                     </Text>
//                   </LinearGradient>
//                 </ImageBackground>
//               </Pressable>
//             )}
//           />
//         </View>

//         <Divider />

//         {/* SECTION: Recent Events */}
//         <View style={styles.sectionContainer}>
//           <SectionHeader
//             title="Recent Events"
//             showViewAll
//             onViewAll={() => router.push("/(admin)/(tabs)/ManageEvents")}
//           />
//           <FlatList
//             data={events.slice(0, 4)}
//             keyExtractor={(item) => item.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.eventsList}
//             renderItem={({ item }) => (
//               <Pressable
//                 style={styles.eventCard}
//                 onPress={() =>
//                   router.push({
//                     pathname: "/(shared)/EventDetails",
//                     params: { id: item.id },
//                   })
//                 }
//               >
//                 <ImageBackground
//                   source={{
//                     uri: item.imageUrl || "https://via.placeholder.com/200x150",
//                   }}
//                   style={styles.eventImage}
//                   imageStyle={{ borderRadius: 14 }}
//                 >
//                   <LinearGradient
//                     colors={["transparent", "rgba(0,0,0,0.6)"]}
//                     style={styles.eventOverlay}
//                   >
//                     <Text style={styles.eventTitle} numberOfLines={2}>
//                       {item.title}
//                     </Text>
//                   </LinearGradient>
//                 </ImageBackground>
//               </Pressable>
//             )}
//           />
//         </View>

//         <Divider />

//         {/* SECTION: Quick Access */}
//         <View style={styles.sectionContainer}>
//           <SectionHeader title="Quick Access" />
//           <View style={styles.grid}>
//             {menuItems.map((m) => (
//               <Pressable
//                 key={m.label}
//                 style={({ pressed }) => [
//                   styles.gridItem,
//                   pressed && { transform: [{ scale: 0.97 }], opacity: 0.85 },
//                 ]}
//                 onPress={() => router.push(m.route)}
//               >
//                 <LinearGradient
//                   colors={Colors.gradientAccent ?? ["#007AFF", "#00C6FF"]}
//                   style={styles.iconBox}
//                 >
//                   <Ionicons
//                     name={m.icon as any}
//                     size={22}
//                     color={Colors.textInverse}
//                   />
//                 </LinearGradient>
//                 <Text style={styles.gridLabel}>{m.label}</Text>
//               </Pressable>
//             ))}
//           </View>
//         </View>

//         <View style={{ height: 100 }} />
//       </ScrollView>
//     </GlossyBackground>
//   );
// }

// /* --- Small Components --- */
// const SectionHeader = ({
//   title,
//   showViewAll = false,
//   onViewAll,
// }: {
//   title: string;
//   showViewAll?: boolean;
//   onViewAll?: () => void;
// }) => (
//   <View style={styles.sectionHeaderRow}>
//     <LinearGradient
//       colors={Colors.gradientAccent}
//       style={styles.sectionAccent}
//     />
//     <Text style={styles.sectionHeading}>{title}</Text>
//     {showViewAll && (
//       <Pressable onPress={onViewAll} style={styles.viewAllButton}>
//         <Text style={styles.viewAllText}>View All</Text>
//       </Pressable>
//     )}
//   </View>
// );

// const Divider = () => (
//   <LinearGradient
//     colors={[Colors.border, "transparent"]}
//     start={{ x: 0, y: 0 }}
//     end={{ x: 1, y: 0 }}
//     style={styles.divider}
//   />
// );

// const styles = StyleSheet.create({
//   loader: { flex: 1, justifyContent: "center", alignItems: "center" },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     marginTop: 40,
//   },
//   leaderInfo: { flexDirection: "row", alignItems: "center" },
//   leaderAvatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 14,
//     backgroundColor: Colors.surfaceDark,
//   },
//   leaderName: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: Colors.textPrimary,
//   },
//   subText: { fontSize: 13, color: Colors.textMuted },

//   sectionContainer: {
//     marginTop: 24,
//   },

//   sectionHeaderRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     marginBottom: 10,
//   },
//   sectionAccent: {
//     width: 4,
//     height: 22,
//     borderRadius: 4,
//     marginRight: 10,
//   },
//   sectionHeading: {
//     fontSize: 17,
//     fontWeight: "600",
//     letterSpacing: 0.3,
//     color: Colors.textPrimary,
//     flex: 1,
//   },
//   viewAllButton: { paddingHorizontal: 10 },
//   viewAllText: { color: Colors.info, fontWeight: "600", fontSize: 13 },

//   divider: {
//     height: 1.5,
//     marginHorizontal: 20,
//     opacity: 0.4,
//     marginTop: 20,
//   },

//   /* carousel */
//   carousel: { paddingLeft: 20 },
//   banner: {
//     width: width * 0.78,
//     height: 160,
//     marginRight: 14,
//     borderRadius: 16,
//     overflow: "hidden",
//   },
//   bannerImage: { borderRadius: 16 },
//   bannerOverlay: {
//     flex: 1,
//     justifyContent: "flex-end",
//     padding: 14,
//   },
//   bannerTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },

//   /* events */
//   eventsList: { paddingLeft: 20 },
//   eventCard: {
//     width: 150,
//     height: 120,
//     borderRadius: 14,
//     marginRight: 12,
//     overflow: "hidden",
//     backgroundColor: Colors.card,
//   },
//   eventImage: { width: "100%", height: "100%" },
//   eventOverlay: { flex: 1, justifyContent: "flex-end", padding: 10 },
//   eventTitle: { color: "#fff", fontWeight: "600", fontSize: 13 },

//   /* grid */
//   grid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-around",
//     marginTop: 10,
//     paddingHorizontal: 10,
//   },
//   gridItem: {
//     width: "28%",
//     aspectRatio: 1,
//     marginBottom: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 16,
//     backgroundColor: Colors.transparent,
//     shadowColor: Colors.shadow,
//     borderColor: Colors.border2,
//     borderWidth: 2,
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   iconBox: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   gridLabel: { fontSize: 12, fontWeight: "600", color: Colors.textWhite },
// });

// // app/(admin)/(tabs)/Dashboard.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Image,
//   Modal,
//   Pressable,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import { db } from "@/configs/FirebaseConfig";
// import Colors from "@/data/Colors";

// import {
//   ComplaintDoc,
//   complaintService,
// } from "@/app/services/complaintService";
// import { PollDoc, pollService } from "@/app/services/pollService";
// import { postsService } from "@/app/services/postsService";
// import { videoService } from "@/app/services/videoService";

// import {
//   collection,
//   getDocs,
//   onSnapshot,
//   orderBy,
//   query,
// } from "firebase/firestore";

// /* ---------------- CONSTANTS ---------------- */

// const IMAGE_HEIGHT = 110;
// const CAROUSEL_LIMIT = 3;

// /* ---------------- SCREEN ---------------- */

// export default function AdminDashboard() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();

//   /* ---------- STATE ---------- */

//   const [refreshing, setRefreshing] = useState(false);
//   const [fabOpen, setFabOpen] = useState(false);

//   const [complaints, setComplaints] = useState<ComplaintDoc[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [surveysCount, setSurveysCount] = useState(0);
//   const [activePolls, setActivePolls] = useState<PollDoc[]>([]);

//   const [latestNews, setLatestNews] = useState<any[]>([]);
//   const [latestEvents, setLatestEvents] = useState<any[]>([]);
//   const [latestPosts, setLatestPosts] = useState<any[]>([]);
//   const [latestVideos, setLatestVideos] = useState<any[]>([]);

//   /* ---------- DATA ---------- */

//   useEffect(() => complaintService.subscribeToAllComplaints(setComplaints), []);

//   useEffect(() => {
//     return pollService.subscribeToPolls((polls) => {
//       const now = new Date();
//       setActivePolls(
//         polls.filter((p) => !p.expiresAt || p.expiresAt.toDate() > now)
//       );
//     });
//   }, []);

//   useEffect(() => {
//     return onSnapshot(collection(db, "users"), (snap) =>
//       setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );
//   }, []);

//   useEffect(() => {
//     getDocs(collection(db, "surveys")).then((snap) =>
//       setSurveysCount(snap.size)
//     );
//   }, []);

//   useEffect(() => {
//     return onSnapshot(
//       query(collection(db, "news"), orderBy("createdAt", "desc")),
//       (snap) =>
//         setLatestNews(
//           snap.docs.slice(0, CAROUSEL_LIMIT).map((d) => ({
//             id: d.id,
//             ...d.data(),
//           }))
//         )
//     );
//   }, []);

//   useEffect(() => {
//     return onSnapshot(
//       query(collection(db, "events"), orderBy("createdAt", "desc")),
//       (snap) =>
//         setLatestEvents(
//           snap.docs.slice(0, CAROUSEL_LIMIT).map((d) => ({
//             id: d.id,
//             ...d.data(),
//           }))
//         )
//     );
//   }, []);

//   useEffect(() => {
//     return postsService.subscribeToPostType("image", (list) =>
//       setLatestPosts(list.slice(0, CAROUSEL_LIMIT))
//     );
//   }, []);

//   useEffect(() => {
//     videoService
//       .getVideosOnce()
//       .then((list) => setLatestVideos(list.slice(0, CAROUSEL_LIMIT)));
//   }, []);

//   /* ---------- DERIVED ---------- */

//   const stats = useMemo(() => {
//     let pending = 0,
//       needInfo = 0,
//       inProgress = 0,
//       resolved = 0;

//     complaints.forEach((c) => {
//       if (c.status === "pending") pending++;
//       else if (c.status === "need_info") needInfo++;
//       else if (c.status === "accepted" || c.status === "in_progress")
//         inProgress++;
//       else if (c.status === "resolved") resolved++;
//     });

//     return {
//       users: users.length,
//       monitors: users.filter((u) => u.role === "monitor").length,
//       surveys: surveysCount,
//       polls: activePolls.length,
//       pending,
//       needInfo,
//       inProgress,
//       resolved,
//     };
//   }, [complaints, users, surveysCount, activePolls]);

//   /* ---------- UI ---------- */

//   return (
//     <View style={styles.root}>
//       <StatusBar style="dark" />

//       {/* ===== HEADER (FIXED) ===== */}
//       <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
//         <Text style={styles.headerTitle}>Admin Dashboard</Text>
//         <Ionicons
//           name="notifications-outline"
//           size={24}
//           color={Colors.textPrimary}
//         />
//       </View>

//       {/* ===== SCROLL CONTENT ===== */}
//       <ScrollView
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={() => {}} />
//         }
//         contentContainerStyle={{
//           padding: 16,
//           paddingBottom: insets.bottom + 140,
//         }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* SYSTEM HEALTH */}
//         <Section title="System Health" />
//         <StatsGrid
//           items={[
//             {
//               label: "Users",
//               value: stats.users,
//               onPress: () => router.push("/(admin)/(tabs)/ManageUsers"),
//             },
//             {
//               label: "Monitors",
//               value: stats.monitors,
//               onPress: () => router.push("/(admin)/(tabs)/ManageMonitors"),
//             },
//             {
//               label: "Surveys",
//               value: stats.surveys,
//               onPress: () => router.push("/(admin)/(tabs)/AdminSurveyManager"),
//             },
//             {
//               label: "Active Polls",
//               value: stats.polls,
//               onPress: () => router.push("/(admin)/(tabs)/Polls"),
//             },
//           ]}
//         />

//         {/* COMPLAINTS */}
//         <Section title="Complaints Overview" />
//         <StatsGrid
//           items={[
//             {
//               label: "Pending",
//               value: stats.pending,
//               onPress: () =>
//                 router.push("/(admin)/(tabs)/Complaints?filter=pending"),
//             },
//             {
//               label: "Need Info",
//               value: stats.needInfo,
//               onPress: () =>
//                 router.push("/(admin)/(tabs)/Complaints?filter=need_info"),
//             },
//             {
//               label: "In Progress",
//               value: stats.inProgress,
//               onPress: () =>
//                 router.push("/(admin)/(tabs)/Complaints?filter=in_progress"),
//             },
//             {
//               label: "Resolved",
//               value: stats.resolved,
//               onPress: () =>
//                 router.push("/(admin)/(tabs)/Complaints?filter=resolved"),
//             },
//           ]}
//         />

//         {/* CAROUSELS */}
//         <Carousel
//           title="Latest News"
//           data={latestNews}
//           onViewAll={() => router.push("/(admin)/(tabs)/ManageNews")}
//         />

//         <Carousel
//           title="Latest Events"
//           data={latestEvents}
//           onViewAll={() => router.push("/(admin)/(tabs)/ManageEvents")}
//         />

//         <Carousel
//           title="Latest Posts"
//           data={latestPosts}
//           onViewAll={() => router.push("/(admin)/(tabs)/Gallery")}
//         />

//         <Carousel
//           title="Latest Videos"
//           data={latestVideos}
//           isVideo
//           onViewAll={() => router.push("/(admin)/(tabs)/ManageVideos")}
//         />
//       </ScrollView>

//       {/* ===== FAB ===== */}
//       <TouchableOpacity
//         style={[styles.fab, { bottom: insets.bottom + 20 }]}
//         onPress={() => setFabOpen(true)}
//       >
//         <Ionicons name="add" size={30} color="#fff" />
//       </TouchableOpacity>

//       {/* ===== FAB MENU ===== */}
//       <Modal visible={fabOpen} transparent animationType="fade">
//         <Pressable style={styles.overlay} onPress={() => setFabOpen(false)} />

//         <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
//           {[
//             ["Add Monitor", "/(admin)/(tabs)/ManageMonitors"],
//             ["Add News", "/(admin)/(tabs)/AddNews"],
//             ["Add Event", "/(admin)/(tabs)/AddEvent"],
//             ["Add Video", "/(shared)/video/AddVideo"],
//             ["Create Poll", "/(shared)/polls/CreatePoll"],
//             ["Surveys", "/(admin)/(tabs)/AdminSurveyManager"],
//             ["Manage Users", "/(admin)/(tabs)/ManageUsers"],
//           ].map(([label, route]) => (
//             <Pressable
//               key={label}
//               style={styles.fabItem}
//               onPress={() => {
//                 setFabOpen(false);
//                 router.push(route as string);
//               }}
//             >
//               <Text style={styles.fabText}>{label}</Text>
//             </Pressable>
//           ))}
//         </View>
//       </Modal>
//     </View>
//   );
// }

// /* ---------------- COMPONENTS ---------------- */

// const Section = ({ title }: { title: string }) => (
//   <Text style={styles.sectionTitle}>{title}</Text>
// );

// function StatsGrid({
//   items,
// }: {
//   items: {
//     label: string;
//     value: number;
//     onPress: () => void;
//   }[];
// }) {
//   return (
//     <View style={styles.grid}>
//       {items.map((i) => (
//         <Pressable key={i.label} style={styles.statCard} onPress={i.onPress}>
//           <Text style={styles.statValue}>{i.value}</Text>
//           <Text style={styles.statLabel}>{i.label}</Text>
//         </Pressable>
//       ))}
//     </View>
//   );
// }

// function Carousel({ title, data, onViewAll, isVideo = false }: any) {
//   return (
//     <>
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>{title}</Text>
//         <Pressable onPress={onViewAll}>
//           <Text style={styles.viewAll}>View All</Text>
//         </Pressable>
//       </View>

//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         {data.map((item: any) => {
//           const media = item.media?.[0];
//           const image = isVideo
//             ? media?.thumbnailUrl || media?.url
//             : item.imageUrl || media?.url;

//           return (
//             <View key={item.id} style={styles.carouselCard}>
//               {image && (
//                 <Image source={{ uri: image }} style={styles.carouselImage} />
//               )}
//               <Text style={styles.carouselTitle} numberOfLines={2}>
//                 {item.title || "Untitled"}
//               </Text>
//             </View>
//           );
//         })}
//       </ScrollView>
//     </>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: Colors.background },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//     backgroundColor: Colors.background,
//   },
//   headerTitle: {
//     flex: 1,
//     fontSize: 22,
//     fontWeight: "800",
//     color: Colors.textPrimary,
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     marginVertical: 14,
//     color: Colors.textPrimary,
//   },

//   grid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   statCard: {
//     width: "48%",
//     height: 110,
//     backgroundColor: Colors.card,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     justifyContent: "center",
//   },
//   statValue: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: Colors.textPrimary,
//   },
//   statLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: Colors.textSecondary,
//     marginTop: 4,
//   },

//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 26,
//     marginBottom: 10,
//   },
//   viewAll: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: Colors.primary,
//   },

//   carouselCard: {
//     width: 200,
//     marginRight: 14,
//   },
//   carouselImage: {
//     width: "100%",
//     height: IMAGE_HEIGHT,
//     borderRadius: 14,
//     backgroundColor: Colors.surface,
//     marginBottom: 6,
//   },
//   carouselTitle: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: Colors.textPrimary,
//   },

//   fab: {
//     position: "absolute",
//     right: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: Colors.primary,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 8,
//   },

//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//   },
//   sheet: {
//     backgroundColor: Colors.card,
//     borderTopLeftRadius: 22,
//     borderTopRightRadius: 22,
//     paddingHorizontal: 16,
//     paddingTop: 12,
//   },
//   fabItem: {
//     paddingVertical: 16,
//   },
//   fabText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//   },
// });

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";

import {
  ComplaintDoc,
  complaintService,
} from "@/app/services/complaintService";
import { PollDoc, pollService } from "@/app/services/pollService";
import { postsService } from "@/app/services/postsService";
import { videoService } from "@/app/services/videoService";

import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

/* ---------------- CONSTANTS ---------------- */

const CAROUSEL_LIMIT = 3;

/* ---------------- SCREEN ---------------- */

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fabOpen, setFabOpen] = useState(false);

  const [complaints, setComplaints] = useState<ComplaintDoc[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [surveysCount, setSurveysCount] = useState(0);
  const [activePolls, setActivePolls] = useState<PollDoc[]>([]);

  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [latestEvents, setLatestEvents] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [latestVideos, setLatestVideos] = useState<any[]>([]);

  /* ---------- DATA ---------- */

  useEffect(() => complaintService.subscribeToAllComplaints(setComplaints), []);

  useEffect(() => {
    return pollService.subscribeToPolls((polls) => {
      const now = new Date();
      setActivePolls(
        polls.filter((p) => !p.expiresAt || p.expiresAt.toDate() > now)
      );
    });
  }, []);

  useEffect(() => {
    return onSnapshot(collection(db, "users"), (snap) =>
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  useEffect(() => {
    getDocs(collection(db, "surveys")).then((snap) =>
      setSurveysCount(snap.size)
    );
  }, []);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "news"), orderBy("createdAt", "desc")),
      (snap) =>
        setLatestNews(
          snap.docs.slice(0, CAROUSEL_LIMIT).map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        )
    );
  }, []);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "events"), orderBy("createdAt", "desc")),
      (snap) =>
        setLatestEvents(
          snap.docs.slice(0, CAROUSEL_LIMIT).map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        )
    );
  }, []);

  useEffect(() => {
    return postsService.subscribeToPostType("image", (list) =>
      setLatestPosts(list.slice(0, CAROUSEL_LIMIT))
    );
  }, []);

  useEffect(() => {
    videoService
      .getVideosOnce()
      .then((list) => setLatestVideos(list.slice(0, CAROUSEL_LIMIT)));
  }, []);

  /* ---------- DERIVED ---------- */

  const stats = useMemo(() => {
    let pending = 0,
      needInfo = 0,
      inProgress = 0,
      resolved = 0;

    complaints.forEach((c) => {
      if (c.status === "pending") pending++;
      else if (c.status === "need_info") needInfo++;
      else if (c.status === "accepted" || c.status === "in_progress")
        inProgress++;
      else if (c.status === "resolved") resolved++;
    });

    return {
      users: users.length,
      monitors: users.filter((u) => u.role === "monitor").length,
      surveys: surveysCount,
      polls: activePolls.length,
      pending,
      needInfo,
      inProgress,
      resolved,
    };
  }, [complaints, users, surveysCount, activePolls]);

  /* ---------- UI ---------- */

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Ionicons
          name="notifications-outline"
          size={24}
          color={Colors.textPrimary}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 140,
        }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Section title="System Health" />
        <StatsGrid
          items={[
            {
              label: "Users",
              value: stats.users,
              onPress: () => router.push("/(admin)/(tabs)/ManageUsers"),
            },
            {
              label: "Monitors",
              value: stats.monitors,
              onPress: () => router.push("/(admin)/(tabs)/ManageMonitors"),
            },
            {
              label: "Surveys",
              value: stats.surveys,
              onPress: () => router.push("/(admin)/(tabs)/AdminSurveyManager"),
            },
            {
              label: "Active Polls",
              value: stats.polls,
              onPress: () => router.push("/(admin)/(tabs)/Polls"),
            },
          ]}
        />

        <Section title="Complaints Overview" />
        <StatsGrid
          items={[
            {
              label: "Pending",
              value: stats.pending,
              onPress: () =>
                router.push("/(admin)/(tabs)/Complaints?filter=pending"),
            },
            {
              label: "Need Info",
              value: stats.needInfo,
              onPress: () =>
                router.push("/(admin)/(tabs)/Complaints?filter=need_info"),
            },
            {
              label: "In Progress",
              value: stats.inProgress,
              onPress: () =>
                router.push("/(admin)/(tabs)/Complaints?filter=in_progress"),
            },
            {
              label: "Resolved",
              value: stats.resolved,
              onPress: () =>
                router.push("/(admin)/(tabs)/Complaints?filter=resolved"),
            },
          ]}
        />

        {/* CAROUSELS */}
        <Carousel
          title="Latest News"
          data={latestNews}
          onViewAll={() => router.push("/(admin)/(tabs)/ManageNews")}
          onItemPress={(item: any) =>
            router.push({
              pathname: "/(admin)/(tabs)/ManageNews",
              params: { highlightId: item.id },
            })
          }
        />

        <Carousel
          title="Latest Events"
          data={latestEvents}
          onViewAll={() => router.push("/(admin)/(tabs)/ManageEvents")}
          onItemPress={(item: any) =>
            router.push({
              pathname: "/(admin)/(tabs)/ManageEvents",
              params: { highlightId: item.id },
            })
          }
        />

        <Carousel
          title="Latest Posts"
          data={latestPosts}
          onViewAll={() => router.push("/(admin)/(tabs)/Gallery")}
          onItemPress={(item: any) =>
            router.push({
              pathname: "/(admin)/(tabs)/Gallery",
              params: { postId: item.id },
            })
          }
        />

        <Carousel
          title="Latest Videos"
          data={latestVideos}
          isVideo
          onViewAll={() => router.push("/(admin)/(tabs)/ManageVideos")}
          onItemPress={(item: any) =>
            router.push({
              pathname: "/(admin)/(tabs)/ManageVideos",
              params: { videoId: item.id },
            })
          }
        />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => setFabOpen(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* FAB MENU */}
      <Modal visible={fabOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setFabOpen(false)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {[
            ["Add Monitor", "/(admin)/(tabs)/ManageMonitors"],
            ["Add News", "/(admin)/(tabs)/AddNews"],
            ["Add Event", "/(admin)/(tabs)/AddEvent"],
            ["Add Video", "/(shared)/video/AddVideo"],
            ["Create Poll", "/(shared)/polls/CreatePoll"],
            ["Surveys", "/(admin)/(tabs)/AdminSurveyManager"],
            ["Manage Users", "/(admin)/(tabs)/ManageUsers"],
          ].map(([label, route]) => (
            <Pressable
              key={label}
              style={styles.fabItem}
              onPress={() => {
                setFabOpen(false);
                router.push(route as string);
              }}
            >
              <Text style={styles.fabText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- COMPONENTS ---------------- */

const Section = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

function StatsGrid({ items }: any) {
  return (
    <View style={styles.grid}>
      {items.map((i: any) => (
        <Pressable key={i.label} style={styles.statCard} onPress={i.onPress}>
          <Text style={styles.statValue}>{i.value}</Text>
          <Text style={styles.statLabel}>{i.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

/* ---------- SMART CAROUSEL ---------- */

function Carousel({
  title,
  data,
  onViewAll,
  onItemPress,
  isVideo = false,
}: any) {
  const isPost = title.includes("Post");

  const imageHeight = isVideo ? 120 : isPost ? 160 : 110;
  const cardWidth = isVideo ? 200 : isPost ? 180 : 220;

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item: any) => {
          const media = item.media?.[0];
          const image = isVideo
            ? media?.thumbnailUrl || media?.url
            : item.imageUrl || media?.url;

          return (
            <Pressable
              key={item.id}
              style={[styles.carouselCard, { width: cardWidth }]}
              onPress={() => onItemPress(item)}
            >
              {image && (
                <Image
                  source={{ uri: image }}
                  style={[styles.carouselImage, { height: imageHeight }]}
                />
              )}
              <Text style={styles.carouselTitle} numberOfLines={2}>
                {item.title || "Untitled"}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: Colors.textPrimary,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginVertical: 14,
    color: Colors.textPrimary,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    height: 110,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    justifyContent: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 10,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
  },

  carouselCard: {
    marginRight: 14,
  },
  carouselImage: {
    width: "100%",
    borderRadius: 14,
    backgroundColor: Colors.surface,
    marginBottom: 6,
  },
  carouselTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },

  fab: {
    position: "absolute",
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  fabItem: {
    paddingVertical: 16,
  },
  fabText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
});
