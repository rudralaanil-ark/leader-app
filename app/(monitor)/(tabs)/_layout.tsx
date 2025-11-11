// app/(monitor)/(tabs)/_layout.tsx
import ProfileTabIcon from "@/componenets/Shared/ProfileTabIcon";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function MonitorTabs() {
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
        name="AddNews"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="NewsList"
        options={{
          title: "News",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" color={color} size={size} />
          ),
        }}
      />


      <Tabs.Screen
        name="EventList"
        options={{
          title: "Events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="Monitor"
        options={{
          title: "Monitor",
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

      <Tabs.Screen name="NewsDetails" options={{ href: null }} />
      <Tabs.Screen name="EditNews" options={{ href: null }} />
      <Tabs.Screen name="EditEvent" options={{ href: null }} />
      <Tabs.Screen name="AddEvent" options={{ href: null }} />
      <Tabs.Screen name="EventDetails" options={{ href: null }} />
    </Tabs>
  );
}
