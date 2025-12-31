// // app/(admin)/(tabs)/_layout.tsx
// import ProfileTabIcon from "@/componenets/Shared/ProfileTabIcon";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { Tabs } from "expo-router";
// import { Feather } from "lucide-react-native";

// export default function AdminTabs() {
//   const { user } = useAuth();

//   return (
//     <Tabs
//       screenOptions={{
//         // headerShown: false,
//         tabBarActiveTintColor: Colors.primary,
//         tabBarInactiveTintColor: Colors.Gray,
//       }}
//     >
//       <Tabs.Screen
//         name="Dashboard"
//         options={{
//           title: "Dashboard",
//           headerShown: false,
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="speedometer-outline" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="ManageNews"
//         options={{
//           title: "News",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="newspaper-outline" color={color} size={size} />
//           ),
//         }}
//       />
//       {/* <Tabs.Screen
//         name="Monitors"
//         options={{
//           title: "Monitors",
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="people-outline" size={22} color={color} />
//           ),
//         }}
//       /> */}
//       <Tabs.Screen
//         name="ManageEvents"
//         options={{
//           title: "Events",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="calendar-outline" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="Complaints"
//         options={{
//           title: "Complaints",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="chatbubbles-outline" color={color} size={size} />
//           ),
//         }}
//       />

//       {/* Hidden screens */}
//       <Tabs.Screen name="ComplaintDetails" options={{ href: null }} />
//       <Tabs.Screen name="ReplyScreen" options={{ href: null }} />
//       <Tabs.Screen
//         name="Gallery"
//         options={{
//           title: "Gallery",
//           headerShown: false,
//           tabBarIcon: ({ color }) => (
//             <Feather name="image" size={22} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="ManageMonitors"
//         options={{
//           title: "Monitors",
//           headerShown: false,
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="people-outline" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="Admin"
//         options={{
//           title: "Admin",
//           tabBarIcon: ({ color, size, focused }) => (
//             <ProfileTabIcon
//               imageUri={user?.profileImage}
//               size={size}
//               color={color}
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="ManageVideos"
//         options={{
//           title: "Videos",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="videocam-outline" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="AddVideo"
//         options={{ title: "Add Video", href: null }}
//       />

//       <Tabs.Screen
//         name="Polls"
//         options={{
//           title: "Polls",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="stats-chart-outline" color={color} size={size} />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="AddMonitor"
//         options={{
//           title: " Monitors ",
//           href: null,
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="people-outline" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="ManageUsers"
//         options={{
//           title: "Manage Users",
//           href: null,
//         }}
//       />
//     </Tabs>
//   );
// }

import ProfileTabIcon from "@/componenets/Shared/ProfileTabIcon";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Feather } from "lucide-react-native";

export default function AdminTabs() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.Gray,
        headerShown: true,
      }}
    >
      {/* ================= MAIN TABS ================= */}

      {/* 1️⃣ Dashboard */}
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" color={color} size={size} />
          ),
        }}
      />

      {/* 2️⃣ News */}
      <Tabs.Screen
        name="ManageNews"
        options={{
          title: "News",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" color={color} size={size} />
          ),
        }}
      />

      {/* 3️⃣ Gallery */}
      <Tabs.Screen
        name="Gallery"
        options={{
          title: "Gallery",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="image" size={size} color={color} />
          ),
        }}
      />

      {/* 4️⃣ Videos */}
      <Tabs.Screen
        name="ManageVideos"
        options={{
          title: "Videos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="videocam-outline" color={color} size={size} />
          ),
        }}
      />

      {/* 5️⃣ Events */}
      <Tabs.Screen
        name="ManageEvents"
        options={{
          title: "Events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />

      {/* 6️⃣ Admin / More */}
      <Tabs.Screen
        name="Admin"
        options={{
          title: "Admin",
          tabBarIcon: ({ color, size, focused }) => (
            <ProfileTabIcon
              imageUrl={user?.profileImage}
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      {/* ================= HIDDEN ROUTES ================= */}

      {/* Complaints (open from Dashboard / Admin) */}
      <Tabs.Screen name="Complaints" options={{ href: null }} />
      <Tabs.Screen name="ComplaintDetails" options={{ href: null }} />
      <Tabs.Screen name="ReplyScreen" options={{ href: null }} />

      {/* Monitors */}
      <Tabs.Screen name="ManageMonitors" options={{ href: null }} />
      <Tabs.Screen name="AddMonitor" options={{ href: null }} />

      {/* Users */}
      <Tabs.Screen name="ManageUsers" options={{ href: null }} />

      {/* Polls */}
      <Tabs.Screen name="Polls" options={{ href: null }} />

      {/* Videos */}
      <Tabs.Screen name="AddVideo" options={{ href: null }} />

      <Tabs.Screen name="AdminSurveyManager" options={{ href: null }} />

      {/* Any future admin-only screens can be hidden here */}
    </Tabs>
  );
}
