// app/(admin)/(tabs)/_layout.tsx
import ProfileTabIcon from "@/componenets/Shared/ProfileTabIcon";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function AdminTabs() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.Gray,
      }}
    >
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ManageMonitors"
        options={{
          title: "Monitors",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
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

      <Tabs.Screen
        name="Monitors"
        options={{
          title: "Monitors",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
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
    </Tabs>
  );
}
