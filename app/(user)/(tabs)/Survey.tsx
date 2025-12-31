// import React, { useEffect, useState } from "react";
// import {
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import AddMemberModal from "@/app/(shared)/survey/components/AddMemberModal";
// import { surveyService } from "@/app/services/surveyService";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";

// export default function Survey() {
//   const { user } = useAuth();

//   const [surveys, setSurveys] = useState<any[]>([]);
//   const [showModal, setShowModal] = useState(false);

//   const load = async () => {
//     const res = await surveyService.getUserSurveys(user!.uid);
//     setSurveys(res);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={surveys}
//         keyExtractor={(item) => item.id}
//         ListEmptyComponent={
//           <Text style={styles.empty}>No surveys submitted</Text>
//         }
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Text style={styles.name}>{item.person.name}</Text>
//             <Text>{item.person.phone}</Text>
//             <Text style={styles.location}>
//               {item.location.constituency}
//               {item.location.mandal ? `, ${item.location.mandal}` : ""}
//               {item.location.village ? `, ${item.location.village}` : ""}
//             </Text>
//           </View>
//         )}
//       />

//       {/* FAB */}
//       <TouchableOpacity onPress={() => setShowModal(true)} style={styles.fab}>
//         <Text style={styles.fabText}>+</Text>
//       </TouchableOpacity>

//       <AddMemberModal
//         visible={showModal}
//         onClose={() => setShowModal(false)}
//         onSubmitted={load}
//       />
//     </View>
//   );
// }

// /* ===================== STYLES ===================== */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: Colors.background,
//   },
//   empty: {
//     textAlign: "center",
//     marginTop: 40,
//     color: Colors.textMuted,
//   },
//   card: {
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: Colors.card,
//     marginBottom: 12,
//   },
//   name: {
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   location: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     marginTop: 4,
//   },
//   fab: {
//     position: "absolute",
//     right: 20,
//     bottom: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: Colors.primary,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 4, // Android
//     shadowColor: "#000", // iOS
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   fabText: {
//     color: "white",
//     fontSize: 28,
//     lineHeight: 30,
//   },
// });

// app/(user)/(tabs)/Survey.tsx
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddMemberModal from "@/app/(shared)/survey/components/AddMemberModal";
import { surveyService } from "@/app/services/surveyService";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";

export default function Survey() {
  const { user } = useAuth();

  const [surveys, setSurveys] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    const res = await surveyService.getUserSurveys(user!.uid);
    setSurveys(res);
  };

  useEffect(() => {
    load();
  }, []);

  const renderItem = ({ item }: any) => {
    const initials =
      item.person?.name
        ?.split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "?";

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.name}>{item.person.name}</Text>
            <Text style={styles.phone}>{item.person.phone}</Text>

            <View style={styles.locationPill}>
              <Text style={styles.locationText}>
                {item.location.constituency}
                {item.location.mandal ? `, ${item.location.mandal}` : ""}
                {item.location.village ? `, ${item.location.village}` : ""}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={surveys}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          surveys.length === 0 ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No Surveys Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap + to add your first survey
            </Text>
          </View>
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setShowModal(true)}
        style={styles.fab}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <AddMemberModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmitted={load}
      />
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  /* Empty State */
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyBox: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
  },

  /* Card */
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* Avatar */
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.highlight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },

  /* Content */
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  phone: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },

  /* Location pill */
  locationPill: {
    alignSelf: "flex-start",
    backgroundColor: Colors.tagNew,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  locationText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },

  /* FAB */
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  fabText: {
    color: Colors.buttonText,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "600",
  },
});
