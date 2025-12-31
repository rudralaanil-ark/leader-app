// // import ProfileTabIcon from "@/componenets/Shared/ProfileTabIcon";
// // import { useAuth } from "@/contexts/AuthContext";
// // import Colors from "@/data/Colors";
// // import Ionicons from "@expo/vector-icons/Ionicons";
// // import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// // import { Tabs } from "expo-router";
// // import React from "react";
// // import { StatusBar } from "react-native";
// // // import ProfileTabIcon from "@/components/Shared/ProfileTabIcon";
// // export default function TabsLayout() {
// //   const user = useAuth().user;
// //   console.log(user?.profileImage);
// //   console.log("Current User in TabsLayout:", user);
// //   return (
// //     <>
// //       <StatusBar
// //         barStyle={"dark-content"}
// //         translucent
// //         backgroundColor="#ffff"
// //       />
// //       <Tabs
// //         screenOptions={{
// //           tabBarActiveTintColor: Colors.primary,
// //           // headerShown: false,
// //           tabBarStyle: {
// //             // backgroundColor: "#FFFF",
// //             // borderTopColor: "#0000",
// //             borderTopWidth: 2,
// //             paddingBottom: 0,
// //             height: 120,
// //             paddingTop: 10,
// //           },
// //           tabBarLabelStyle: {
// //             fontSize: 12,
// //             fontWeight: "600",
// //             paddingBottom: 2,
// //             color: Colors.textPrimary, // label text color
// //           },
// //           tabBarItemStyle: {
// //             marginHorizontal: 6, // spacing between tabs
// //           },
// //           headerTintColor: Colors.textWhite,
// //           headerTitleAlign: "center",
// //           headerStyle: {
// //             backgroundColor: Colors.headerBackground,
// //             // borderColor: "#0000",
// //             borderBottomColor: "#ffffff54",
// //             borderBottomWidth: 1,
// //           },
// //           headerTitleStyle: {
// //             letterSpacing: 0.5,
// //             fontFamily: "PoppinsSemiBold",
// //           },
// //         }}
// //       >
// //         <Tabs.Screen
// //           name="Home"
// //           options={{
// //             headerTitle: "",
// //             tabBarIcon: ({ color, size }) => (
// //               <Ionicons name="home" size={size} color={color} />
// //             ),
// //             // headerShown: false,
// //             //headersStyle is used to edit the top header bar
// //             headerStyle: {
// //               backgroundColor: Colors.background,
// //               height: 30,
// //             },
// //           }}
// //         />

// //         <Tabs.Screen
// //           name="News"
// //           options={{
// //             headerTitle: " Latest News",
// //             tabBarIcon: ({ color, size }) => (
// //               <Ionicons name="newspaper" size={size} color={color} />
// //             ),
// //           }}
// //         />

// //         <Tabs.Screen
// //           name="Events"
// //           options={{
// //             headerShown: false,
// //             headerTitle: "Events",
// //             tabBarIcon: ({ color, size }) => (
// //               <Ionicons name="calendar" size={size} color={color} />
// //             ),
// //           }}
// //         />
// //         <Tabs.Screen
// //           name="Poll"
// //           options={{
// //             headerTitle: "Choose your Opinion",
// //             tabBarIcon: ({ color, size }) => (
// //               <MaterialCommunityIcons name="poll" size={size} color={color} />
// //             ),
// //           }}
// //         />

// //         <Tabs.Screen
// //           name="User"
// //           options={{
// //             title: "User",
// //             tabBarIcon: ({ color, size, focused }) => (
// //               <ProfileTabIcon
// //                 color={color}
// //                 size={size}
// //                 focused={focused}
// //                 imageUrl={user?.profileImage}
// //               />
// //             ),
// //           }}
// //         />
// //         <Tabs.Screen name="Gallery" options={{ href: null }} />
// //         <Tabs.Screen name="Video" options={{ href: null }} />
// //         <Tabs.Screen
// //           name="Profile"
// //           options={{
// //             href: null,
// //             title: "About",
// //             // headerStatusBarHeight: 5,
// //             headerTintColor: Colors.background,
// //             headerStyle: {
// //               height: 30,
// //               backgroundColor: Colors.headerBackground,
// //             },
// //           }}
// //         />
// //         <Tabs.Screen name="ComplaintBox" options={{ href: null }} />
// //         <Tabs.Screen name="Survey" options={{ href: null }} />
// //         <Tabs.Screen name="Help" options={{ href: null }} />
// //         <Tabs.Screen name="NewsDetails" options={{ href: null }} />
// //         <Tabs.Screen
// //           name="EventDetailsUser"
// //           options={{
// //             href: null,
// //             headerStyle: {
// //               height: 30,
// //             },
// //           }}
// //         />
// //       </Tabs>
// //     </>
// //   );
// // }

// import ProfileTabIcon from "@/componenets/Shared/ProfileTabIcon";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import { Tabs } from "expo-router";
// import React from "react";
// import { StatusBar } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// export default function TabsLayout() {
//   const insets = useSafeAreaInsets();
//   const user = useAuth().user;

//   const BASE_TAB_HEIGHT = 58;

//   return (
//     <>
//       <StatusBar
//         barStyle="light-content"
//         translucent={false}
//         backgroundColor={Colors.headerBackground}
//       />

//       <Tabs
//         screenOptions={{
//           tabBarActiveTintColor: Colors.primary,

//           tabBarStyle: {
//             backgroundColor: Colors.surface,
//             borderTopWidth: 1,
//             borderTopColor: Colors.border,

//             // ⭐ Makes tab bar perfect for ALL iOS/Android screens
//             height: BASE_TAB_HEIGHT + insets.bottom,

//             // ⭐ Makes icon + text vertically centered
//             paddingBottom: insets.bottom > 0 ? insets.bottom - 2 : 6,
//             // paddingTop: 5,
//             // marginBottom: 10,
//           },

//           tabBarLabelStyle: {
//             fontSize: 12,
//             fontWeight: "600",
//             paddingBottom: 2,
//             color: Colors.textPrimary,
//           },

//           tabBarItemStyle: {
//             marginHorizontal: 6,
//           },

//           headerTintColor: Colors.textWhite,
//           headerTitleAlign: "center",
//           headerStyle: {
//             backgroundColor: Colors.headerBackground,
//             borderBottomColor: "#ffffff54",
//             borderBottomWidth: 1,
//           },
//           headerTitleStyle: {
//             letterSpacing: 0.5,
//             fontFamily: "PoppinsSemiBold",
//           },
//         }}
//       >
//         <Tabs.Screen
//           name="Home"
//           options={{
//             headerTitle: "",
//             headerShown: false,
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="home" size={size} color={color} />
//             ),
//             // headerStyle: {
//             //   backgroundColor: Colors.background,
//             //   height: 30,
//             // },
//           }}
//         />

//         <Tabs.Screen
//           name="News"
//           options={{
//             headerTitle: " Latest News",
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="newspaper" size={size} color={color} />
//             ),
//           }}
//         />

//         <Tabs.Screen
//           name="Events"
//           options={{
//             headerShown: false,
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="calendar" size={size} color={color} />
//             ),
//           }}
//         />

//         <Tabs.Screen
//           name="Poll"
//           options={{
//             headerTitle: "Choose your Opinion",
//             tabBarIcon: ({ color, size }) => (
//               <MaterialCommunityIcons name="poll" size={size} color={color} />
//             ),
//           }}
//         />

//         <Tabs.Screen
//           name="User"
//           options={{
//             title: "User",
//             tabBarIcon: ({ color, size, focused }) => (
//               <ProfileTabIcon
//                 color={color}
//                 size={size}
//                 focused={focused}
//                 imageUrl={user?.profileImage}
//               />
//             ),
//           }}
//         />

//         {/* Hidden screens */}
//         <Tabs.Screen name="Gallery" options={{ href: null }} />
//         <Tabs.Screen name="Video" options={{ href: null }} />
//         <Tabs.Screen name="Profile" options={{ href: null }} />
//         <Tabs.Screen name="ComplaintBox" options={{ href: null }} />
//         <Tabs.Screen name="Survey" options={{ href: null }} />
//         <Tabs.Screen name="Help" options={{ href: null }} />
//         <Tabs.Screen name="NewsDetails" options={{ href: null }} />
//         <Tabs.Screen name="EventDetailsUser" options={{ href: null }} />
//       </Tabs>
//     </>
//   );
// }

import ProfileTabIcon from "@/componenets/Shared/ProfileTabIcon";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const user = useAuth().user;
  const insets = useSafeAreaInsets();

  // Dynamic tab bar height (no hardcoding)
  const TAB_BAR_BASE = 60; // base height for all phones
  const MAX_TOP_PADDING = 12; // your chosen rule
  const MIN_BOTTOM_PADDING = 8;

  const TAB_BAR_HEIGHT = TAB_BAR_BASE + (insets.bottom > 0 ? insets.bottom : 8);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent={false}
        backgroundColor={Colors.headerBackground}
      />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,

          // ⭐ Tab bar automatically fits ALL devices
          tabBarStyle: {
            backgroundColor: Colors.background,
            height: TAB_BAR_HEIGHT,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
          },

          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginBottom: 2,
          },

          headerTintColor: Colors.textInverse,
          headerTitleAlign: "center",

          // ⭐ Dynamic header height — no more hardcoding
          headerStyle: {
            backgroundColor: Colors.headerBackground,
            height: undefined, // let system decide
            paddingTop: Math.min(insets.top, MAX_TOP_PADDING),
            paddingBottom: insets.bottom + MIN_BOTTOM_PADDING,
          },

          headerTitleStyle: {
            fontFamily: "PoppinsSemiBold",
            letterSpacing: 0.5,
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            headerTitle: "",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="News"
          options={{
            headerTitle: "Latest News",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="Gallery"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="images" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="Video"
          options={{
            headerTitle: "Videos",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="videocam" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="Events"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="User"
          options={{
            title: "User",
            tabBarIcon: ({ color, size, focused }) => (
              <ProfileTabIcon
                color={color}
                size={size}
                focused={focused}
                imageUrl={user?.profileImage}
              />
            ),
          }}
        />
        {/* Hidden screens */}

        <Tabs.Screen
          name="Poll"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen name="Profile" options={{ href: null }} />
        <Tabs.Screen name="ComplaintBox" options={{ href: null }} />
        <Tabs.Screen name="Survey" options={{ href: null }} />
        <Tabs.Screen name="Help" options={{ href: null }} />
        <Tabs.Screen name="NewsDetails" options={{ href: null }} />
        <Tabs.Screen name="EventDetailsUser" options={{ href: null }} />
        <Tabs.Screen name="ComplaintDetails" options={{ href: null }} />
      </Tabs>
    </>
  );
}
