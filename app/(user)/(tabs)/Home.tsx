import MenuButton from "@/componenets/Home/MenuButton";
import GlossyBackground from "@/componenets/Shared/GlossyBackground";
import Header from "@/componenets/Shared/Header";
import Colors from "@/data/Colors";
import GlossyTheme from "@/data/GlossyTheme";
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
      route: "/(tabs)/Profile",
    },
    { icon: "newspaper-outline", label: "News", route: "/(tabs)/News" },
    {
      icon: "images-outline",
      label: "Gallery",
      route: "/(tabs)/Gallery",
    },
    { icon: "videocam-outline", label: "Video", route: "/(tabs)/Video" },
    {
      icon: "calendar-outline",
      label: "Events",
      route: "/(tabs)/Events",
    },
    {
      icon: "chatbubbles-outline",
      label: "Opinion Poll",
      route: "/(tabs)/Poll",
    },
    {
      icon: "alert-circle-outline",
      label: "Complaint Box",
      route: "/(tabs)/ComplaintBox",
    },
    {
      icon: "clipboard-outline",
      label: "Survey",
      route: "/(tabs)/Survey",
    },
    {
      icon: "help-circle-outline",
      label: "Help",
      route: "/(user)/(tabs)/Help",
    },
  ];

  return (
    <GlossyBackground
      gradient={GlossyTheme.gradient.colors}
      blur={GlossyTheme.blur}
    >
      {/* <StatusBar barStyle="dark-content" backgroundColor={Colors.background} /> */}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
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
                router.push(item.route as any);
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
  contentContainer: {
    alignItems: "center",
    paddingBottom: 80,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 5,
    padding: 5,
    // backgroundColor: Colors.card,
    borderRadius: 20,
    shadowColor: Colors.strongShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    // borderWidth: 0,
    // borderColor: Colors.border,
    width: "98%",
  },
});
