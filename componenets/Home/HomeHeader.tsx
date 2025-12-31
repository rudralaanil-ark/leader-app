// import React from "react";
// import { Image, StyleSheet, Text, View } from "react-native";

// import Colors from "@/data/Colors";
// import LeaderInfo from "@/data/LeaderInfo";

// export default function HomeHeader() {
//   return (
//     <View style={styles.container}>
//       <View style={styles.row}>
//         <Image
//           source={
//             typeof LeaderInfo.profileImage === "string"
//               ? { uri: LeaderInfo.profileImage }
//               : LeaderInfo.profileImage
//           }
//           style={styles.avatar}
//         />

//         <View style={styles.textBlock}>
//           <Text style={styles.name}>{LeaderInfo.name}</Text>
//           <Text style={styles.title}>{LeaderInfo.title}</Text>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     paddingBottom: 12,
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   avatar: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: Colors.surface,
//   },
//   textBlock: {
//     marginLeft: 12,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: Colors.textPrimary,
//   },
//   title: {
//     marginTop: 2,
//     fontSize: 13,
//     fontWeight: "500",
//     color: Colors.textSecondary,
//   },
// });

import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "@/data/Colors";
import LeaderInfo from "@/data/LeaderInfo";

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* LEFT: AVATAR + NAME */}
        <View style={styles.left}>
          <Image
            source={
              typeof LeaderInfo.profileImage === "string"
                ? { uri: LeaderInfo.profileImage }
                : LeaderInfo.profileImage
            }
            style={styles.avatar}
          />

          <View style={styles.textBlock}>
            <Text style={styles.name}>{LeaderInfo.name}</Text>
            <Text style={styles.title}>{LeaderInfo.title}</Text>
          </View>
        </View>

        {/* RIGHT: NOTIFICATION ICON */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.notificationBtn}
          onPress={() => {
            // later: router.push("/(tabs)/Notifications")
            console.log("Notifications pressed");
          }}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.textPrimary}
          />

          {/* 🔴 OPTIONAL BADGE */}
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0066B3",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 28,
    backgroundColor: Colors.surface,
  },

  textBlock: {
    marginLeft: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textWhite,
  },

  title: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textWhite,
  },

  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffff",
  },

  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
});
