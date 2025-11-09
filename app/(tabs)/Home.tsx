import MenuButton from "@/componenets/Home/MenuButton";
import GlossyBackground from "@/componenets/Shared/GlossyBackground";
import Header from "@/componenets/Shared/Header";
import LeaderInfo from "@/data/LeaderInfo";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Home() {
  const [active, setActive] = useState<string | null>(null);

  const menuItems = [
    {
      icon: "person-circle-outline",
      label: "Profile",
      route: "/Screens/Profile",
    },
    { icon: "newspaper-outline", label: "News", route: "/(tabs)/News" },
    { icon: "images-outline", label: "Gallery", route: "/Screens/Gallery" },
    { icon: "videocam-outline", label: "Video", route: "/Screens/Video" },
    { icon: "calendar-outline", label: "Events", route: "/(tabs)/Events" },
    {
      icon: "chatbubbles-outline",
      label: "Opinion Poll",
      route: "/(tabs)/Poll",
    },
    {
      icon: "alert-circle-outline",
      label: "Complaint Box",
      route: "/Screens/ComplaintBox",
    },
    { icon: "clipboard-outline", label: "Survey", route: "/Screens/Survey" },
    { icon: "help-circle-outline", label: "Help", route: "/Screens/Help" },
  ];

  return (
    <GlossyBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <Header
          name={LeaderInfo.name}
          title={LeaderInfo.title}
          profileImage={LeaderInfo.profileImage}
          onLanguageChange={(lang) => console.log("Language selected:", lang)}
        />

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <MenuButton
              key={item.label}
              icon={item.icon as any}
              label={item.label}
              active={active === item.label}
              onPress={() => {
                setActive(item.label);
                router.push(item.route);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </GlossyBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.background,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 5,
    padding: 10,
    // backgroundColor: Colors.background,
  },
});
