// // app/(shared)/polls/ManagePolls.tsx
// import { PollDoc, pollService } from "@/app/services/pollService";
// import Colors from "@/data/Colors";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   Alert,
//   FlatList,
//   Platform,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// const STATUSBAR_HEIGHT =
//   Platform.OS === "android" ? StatusBar.currentHeight || 0 : 24;

// export default function ManagePolls() {
//   const router = useRouter();
//   const [polls, setPolls] = useState<PollDoc[]>([]);

//   useEffect(() => pollService.subscribeToPolls(setPolls), []);

//   const deletePoll = (id: string) =>
//     Alert.alert("Confirm", "Delete this poll permanently?", [
//       { text: "Cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: () => pollService.deletePoll(id),
//       },
//     ]);

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

//       <View style={styles.headerRow}>
//         <Text style={styles.heading}>Manage Polls</Text>

//         <Pressable
//           style={styles.createBtn}
//           onPress={() => router.push("/(shared)/polls/CreatePoll")}
//         >
//           <Ionicons
//             name="add-circle-outline"
//             size={18}
//             color={Colors.textInverse}
//           />
//           <Text style={styles.createText}>Create</Text>
//         </Pressable>
//       </View>

//       <FlatList
//         data={polls}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ paddingBottom: 80 }}
//         showsVerticalScrollIndicator={false}
//         renderItem={({ item }) => {
//           const expired =
//             item.expiresAt && item.expiresAt.toDate() < new Date();

//           return (
//             <View style={styles.card}>
//               <Text style={styles.question}>{item.question}</Text>
//               <Text style={styles.meta}>
//                 {item.pollType.toUpperCase()} | {item.totalVotes} votes
//               </Text>

//               <View style={styles.bottomRow}>
//                 <Text
//                   style={[
//                     styles.statusTag,
//                     expired ? styles.tagEnded : styles.tagLive,
//                   ]}
//                 >
//                   {expired ? "Expired" : "Active"}
//                 </Text>

//                 <View style={styles.actions}>
//                   <Pressable
//                     style={styles.btnAction}
//                     onPress={() =>
//                       router.push({
//                         pathname: "/(shared)/polls/PollList",
//                         params: { pollId: item.id },
//                       })
//                     }
//                   >
//                     <Ionicons
//                       name="eye-outline"
//                       size={18}
//                       color={Colors.primary}
//                     />
//                   </Pressable>

//                   <Pressable
//                     style={[styles.btnAction, styles.deleteBtn]}
//                     onPress={() => deletePoll(item.id)}
//                   >
//                     <Ionicons
//                       name="trash-outline"
//                       size={18}
//                       color={Colors.error}
//                     />
//                   </Pressable>
//                 </View>
//               </View>
//             </View>
//           );
//         }}
//       />
//     </View>
//   );
// }

// /*** Styles ***/
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: STATUSBAR_HEIGHT + 10,
//     backgroundColor: Colors.background,
//     paddingHorizontal: 16,
//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 18,
//     alignItems: "center",
//   },
//   heading: { fontSize: 22, fontWeight: "700", color: Colors.textPrimary },
//   createBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 999,
//   },
//   createText: {
//     marginLeft: 4,
//     color: Colors.textInverse,
//     fontSize: 13,
//     fontWeight: "700",
//   },

//   card: {
//     backgroundColor: Colors.card,
//     padding: 14,
//     borderRadius: 18,
//     marginBottom: 18,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   question: { fontSize: 15, fontWeight: "700", color: Colors.textPrimary },
//   meta: {
//     marginTop: 3,
//     fontSize: 12,
//     color: Colors.textMuted,
//   },

//   bottomRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 10,
//     alignItems: "center",
//   },
//   statusTag: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 999,
//     fontSize: 11,
//     fontWeight: "700",
//   },
//   tagLive: { backgroundColor: Colors.success + "33" },
//   tagEnded: { backgroundColor: Colors.error + "33" },

//   actions: { flexDirection: "row", alignItems: "center" },
//   btnAction: {
//     padding: 6,
//     marginLeft: 6,
//     backgroundColor: Colors.surfaceDark,
//     borderRadius: 10,
//   },
//   deleteBtn: {
//     backgroundColor: Colors.tagHot,
//   },
// });

// app/(shared)/polls/ManagePolls.tsx
import { PollDoc, pollService } from "@/app/services/pollService";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ManagePolls() {
  const [polls, setPolls] = useState<PollDoc[]>([]);
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "monitor";

  useEffect(() => {
    const unsub = pollService.subscribeToPolls((list) => {
      setPolls(list);
    });
    return () => unsub();
  }, []);

  const handleDelete = (pollId: string) => {
    Alert.alert("Delete poll", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await pollService.deletePoll(pollId);
        },
      },
    ]);
  };

  const handleView = (pollId: string) => {
    router.push({
      pathname: "/(shared)/polls/PollList",
      params: { pollId },
    });
  };

  const timeAgo = (date: Date) => {
    const diff = (Date.now() - date.getTime()) / 1000;
    const d = Math.floor(diff / 86400);
    if (d <= 0) return "Today";
    if (d === 1) return "Yesterday";
    return `${d}d ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Manage Polls</Text>

        <Pressable
          style={styles.createBtn}
          onPress={() => router.push("/(shared)/polls/CreatePoll")}
        >
          <Text style={styles.createBtnText}>+ Create</Text>
        </Pressable>
      </View>

      <FlatList
        data={polls}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10, paddingBottom: 80 }}
        renderItem={({ item }) => {
          const expired =
            item.expiresAt && item.expiresAt.toDate() < new Date();
          const created = item.createdAt?.toDate?.() ?? new Date();

          return (
            <View style={styles.card}>
              <Text style={styles.question}>{item.question}</Text>

              {isAdmin && (
                <Text style={styles.owner}>
                  Owner: {item.createdBy.name} ({item.createdBy.role})
                </Text>
              )}

              <Text style={styles.meta}>
                {item.pollType.toUpperCase()} • {timeAgo(created)}
              </Text>
              <Text style={styles.votes}>Votes: {item.totalVotes ?? 0}</Text>

              <Text
                style={[
                  styles.status,
                  expired ? { color: Colors.error } : { color: Colors.success },
                ]}
              >
                {expired ? "EXPIRED" : "ACTIVE"}
              </Text>

              <View style={styles.row}>
                <Pressable
                  style={[styles.manageBtn, { backgroundColor: Colors.info }]}
                  onPress={() => handleView(item.id)}
                >
                  <Ionicons
                    name="eye-outline"
                    size={14}
                    color={Colors.textInverse}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.manageBtnText}>View</Text>
                </Pressable>

                <Pressable
                  style={[styles.manageBtn, { backgroundColor: Colors.error }]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={14}
                    color={Colors.textInverse}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.manageBtnText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

/********* STYLES *********/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 10 + (Platform.OS === "android" ? 25 : 40),
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  createBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: Colors.primary,
  },
  createBtnText: {
    color: Colors.textInverse,
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  question: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  owner: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  meta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  votes: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: "600",
  },

  status: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "flex-end",
  },
  manageBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 8,
  },
  manageBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textInverse,
  },
});
