// app/(admin)/(tabs)/_layout.tsx
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
        // headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.Gray,
      }}
    >
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
      <Tabs.Screen
        name="ManageNews"
        options={{
          title: "News",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" color={color} size={size} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="Monitors"
        options={{
          title: "Monitors",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={22} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="ManageEvents"
        options={{
          title: "Events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Complaints"
        options={{
          title: "Complaints",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Hidden screens */}
      <Tabs.Screen name="ComplaintDetails" options={{ href: null }} />
      <Tabs.Screen name="ReplyScreen" options={{ href: null }} />
      <Tabs.Screen
        name="Gallery"
        options={{
          title: "Gallery",
          tabBarIcon: ({ color }) => (
            <Feather name="image" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ManageMonitors"
        options={{
          title: "Monitors",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Admin"
        options={{
          title: "Admin",
          tabBarIcon: ({ color, size, focused }) => (
            <ProfileTabIcon
              imageUri={user?.profileImage}
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen name="ManageVideos" options={{ title: "Videos" }} />
      <Tabs.Screen name="AddVideo" options={{ title: "Add Video" }} />

      <Tabs.Screen
        name="AddMonitor"
        options={{
          title: "s Monitors ",
          href: null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ManageUsers"
        options={{
          title: "Manage Users",
          href: null,
        }}
      />
    </Tabs>
  );
}
