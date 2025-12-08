// // updating code according to role :

// // (shared)/screens/GalleryList.tsx
// import Colors from "@/data/Colors";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   StyleSheet,
//   TouchableOpacity,
//   useWindowDimensions,
//   View,
// } from "react-native";
// import { SceneMap, TabBar, TabView } from "react-native-tab-view";

// import GalleryFoldersTab from "./GalleryFolders";
// import GalleryPostsTab from "./GalleryPosts";

// // ⭐ USE AUTH CONTEXT — single source of truth
// import { useAuth } from "@/contexts/AuthContext";
// import CommentsPopup from "../components/CommentsPopup";

// export default function GalleryList() {
//   const layout = useWindowDimensions();
//   const router = useRouter();

//   const { user } = useAuth(); // ⭐ role, name, image, everything is here
//   // const [isCommentsPopupOpen, setIsCommentsPopupOpen] = useState(false);
//   const [commentsFor, setCommentsFor] = useState<string | null>(null);

//   const [index, setIndex] = useState(0);
//   const [routes] = useState([
//     { key: "posts", title: "Posts" },
//     { key: "folders", title: "Folders" },
//   ]);

//   const renderScene = SceneMap({
//     posts: () => <GalleryPostsTab setCommentsFor={setCommentsFor} />,
//     folders: GalleryFoldersTab,
//   });
//   const renderTabBar = (props: any) => (
//     <TabBar
//       {...props}
//       indicatorStyle={{ backgroundColor: Colors.primary }}
//       style={{ backgroundColor: Colors.lightCard }}
//       labelStyle={{ color: Colors.textPrimary, fontWeight: "700" }}
//       activeColor={Colors.primary}
//       inactiveColor={Colors.textSecondary}
//     />
//   );

//   const isElevatedUser = user?.role === "admin" || user?.role === "monitor";

//   return (
//     <View style={styles.container}>
//       {/* TAB VIEW */}
//       <TabView
//         navigationState={{ index, routes }}
//         renderScene={renderScene}
//         onIndexChange={setIndex}
//         initialLayout={{ width: layout.width }}
//         renderTabBar={renderTabBar}
//         swipeEnabled={false}
//       />

//       {commentsFor && (
//         <CommentsPopup
//           postId={commentsFor}
//           onClose={() => setCommentsFor(null)}
//         />
//       )}

//       {/* FAB — visible only to admin and monitor */}
//       {isElevatedUser && (
//         <TouchableOpacity
//           style={styles.fab}
//           onPress={() =>
//             router.push("/(shared)/gallery/screens/AddGalleryPicker")
//           }
//           activeOpacity={0.8}
//         >
//           <Ionicons name="add" size={32} color={Colors.buttonText} />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },

//   fab: {
//     position: "absolute",
//     bottom: 30,
//     right: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: Colors.primary,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 6,
//   },
// });

// updating code according to role :

// (shared)/screens/GalleryList.tsx
import Colors from "@/data/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

import GalleryFoldersTab from "./GalleryFolders";
import GalleryPostsTab from "./GalleryPosts";

// ⭐ USE AUTH CONTEXT — single source of truth
import { useAuth } from "@/contexts/AuthContext";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommentsPopup from "../components/CommentsPopup";

export default function GalleryList() {
  const layout = useWindowDimensions();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { user } = useAuth(); // ⭐ role, name, image, everything is here
  const [commentsFor, setCommentsFor] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "posts", title: "Posts" },
    { key: "folders", title: "Folders" },
  ]);

  const renderScene = SceneMap({
    posts: () => <GalleryPostsTab setCommentsFor={setCommentsFor} />,
    folders: GalleryFoldersTab,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: Colors.primary }}
      style={{ backgroundColor: Colors.lightCard }}
      labelStyle={{ color: Colors.textPrimary, fontWeight: "700" }}
      activeColor={Colors.primary}
      inactiveColor={Colors.textSecondary}
    />
  );

  const isElevatedUser = user?.role === "admin" || user?.role === "monitor";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* TAB VIEW */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        swipeEnabled={false}
      />

      {commentsFor && (
        <CommentsPopup
          postId={commentsFor}
          onClose={() => setCommentsFor(null)}
        />
      )}

      {/* FAB — visible only to admin and monitor */}
      {isElevatedUser && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            router.push("/(shared)/gallery/screens/AddGalleryPicker")
          }
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color={Colors.buttonText} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
