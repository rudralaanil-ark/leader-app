import ProfileTabIcon from "@/componenets/Shared/ProfileTabIcon";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";
// import ProfileTabIcon from "@/components/Shared/ProfileTabIcon";
export default function TabsLayout() {
  const user = useAuth().user;
  console.log(user?.profileImage);
  console.log("Current User in TabsLayout:", user);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        // headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tab_bar,
          borderTopColor: Colors.tab_bar_border,
          borderTopWidth: 2,
          paddingBottom: 10,
          height: 120,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          paddingBottom: 2,
          color: Colors.tab_text, // label text color
        },
        tabBarItemStyle: {
          marginHorizontal: 6, // spacing between tabs
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          headerTitle: "",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          //headersStyle is used to edit the top header bar
          headerStyle: {
            backgroundColor: Colors.background,
            height: 30,
          },
        }}
      />
      <Tabs.Screen
        name="News"
        options={{
          headerTitle: "News",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          ),
          headerStyle: {},
        }}
      />
      <Tabs.Screen
        name="Events"
        options={{
          headerTitle: "Events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Poll"
        options={{
          headerTitle: "Poll",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="poll" size={size} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="User"
        options={{
          headerTitle: "User",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                borderWidth: focused ? 2 : 0,
                borderColor: focused ? "#007AFF" : "transparent",
                borderRadius: size,
                padding: 1,
              }}
            >
              <Image
                source={
                  user?.profileImage
                    ? { uri: user?.profileImage }
                    : require("@/assets/images/profile.png") // fallback image
                }
                style={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                }}
              />
            </View>
          ),
        }}
      /> */}

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
      <Tabs.Screen name="Gallery" options={{ href: null }} />
      <Tabs.Screen name="Video" options={{ href: null }} />
      <Tabs.Screen name="Profile" options={{ href: null }} />
      <Tabs.Screen name="ComplaintBox" options={{ href: null }} />
      <Tabs.Screen name="Survey" options={{ href: null }} />
      <Tabs.Screen name="Help" options={{ href: null }} />
      <Tabs.Screen name="NewsDetails" options={{ href: null }} />
      <Tabs.Screen name="EventDetailsUser" options={{ href: null }} />
    </Tabs>
  );
}
