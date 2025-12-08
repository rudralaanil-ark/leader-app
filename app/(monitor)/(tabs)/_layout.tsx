// app/(monitor)/(tabs)/_layout.tsx

import ProfileTabIcon from "@/componenets/Shared/ProfileTabIcon";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function MonitorTabs() {
  const { user } = useAuth();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.Gray,
        }}
      >
        {/* MAIN TABS */}
        <Tabs.Screen
          name="Dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="speedometer-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="NewsList"
          options={{
            title: "News",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="EventList"
          options={{
            title: "Events",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Gallery"
          options={{
            title: "Gallery",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="images-outline" size={size} color={color} />
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
        {/* HIDDEN SCREENS */}
        <Tabs.Screen name="AddNews" options={{ href: null }} />
        <Tabs.Screen name="EditNews" options={{ href: null }} />
        <Tabs.Screen name="NewsDetails" options={{ href: null }} />
        <Tabs.Screen name="AddEvent" options={{ href: null }} />
        <Tabs.Screen name="EditEvent" options={{ href: null }} />
        <Tabs.Screen name="EventDetails" options={{ href: null }} />
        <Tabs.Screen name="FoldersListScreen" options={{ href: null }} />
        {/* GALLERY HIDDEN SCREENS */}
        <Tabs.Screen name="AddGalleryPicker" options={{ href: null }} />
        <Tabs.Screen
          name="EditCropImages"
          options={{
            href: null,
            headerStyle: {
              height: 30,
            },
          }}
        />
        <Tabs.Screen name="CreateGalleryReview" options={{ href: null }} />
        <Tabs.Screen name="GalleryDetail" options={{ href: null }} />
        <Tabs.Screen name="GalleryView" options={{ href: null }} />
        <Tabs.Screen name="FolderView" options={{ href: null }} />
        <Tabs.Screen name="FolderSelector" options={{ href: null }} />
      </Tabs>
    </GestureHandlerRootView>
  );
}
