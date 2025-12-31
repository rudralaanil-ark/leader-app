// app/(user)/(tabs)/Home.tsx
import MenuButton from "@/componenets/Home/MenuButton";
import GlossyBackground from "@/componenets/Shared/GlossyBackground";
import Header from "@/componenets/Shared/Header";
import Colors from "@/data/Colors";
import GlossyTheme from "@/data/GlossyTheme";
import LeaderInfo from "@/data/LeaderInfo";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

// for fetching dynamic labels from firestore (not used currently)
import { db } from "@/configs/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

type Language = "en" | "te" | "hi";

const MENU_LABELS: Record<
  Language,
  {
    Profile: string;
    News: string;
    Gallery: string;
    Video: string;
    Events: string;
    Poll: string;
    Complaint: string;
    Survey: string;
    Help: string;
  }
> = {
  en: {
    Profile: "Profile",
    News: "News",
    Gallery: "Gallery",
    Video: "Video",
    Events: "Events",
    Poll: "Opinion Poll",
    Complaint: "Complaint Box",
    Survey: "Survey",
    Help: "Help",
  },
  te: {
    Profile: "ప్రొఫైల్",
    News: "వార్తలు",
    Gallery: "గ్యాలరీ",
    Video: "వీడియో",
    Events: "కార్యక్రమాలు",
    Poll: "అభిప్రాయ సర్వే",
    Complaint: "ఫిర్యాదు పెట్టె",
    Survey: "సర్వే",
    Help: "సహాయం",
  },
  hi: {
    Profile: "प्रोफ़ाइल",
    News: "समाचार",
    Gallery: "गैलरी",
    Video: "वीडियो",
    Events: "कार्यक्रम",
    Poll: "मत सर्वेक्षण",
    Complaint: "शिकायत बॉक्स",
    Survey: "सर्वे",
    Help: "सहायता",
  },
};

const LEADER_TEXT: Record<
  Language,
  {
    name: string;
    title: string;
  }
> = {
  en: {
    name: LeaderInfo.name,
    title: LeaderInfo.title,
  },
  te: {
    name: "చింతలపూడి అశోక్ కుమార్ ", //
    title: "The Leader", //
  },
  hi: {
    name: "चिंतलपुडी अशोक कुमार", //
    title: "The Leader",
  },
};

export default function Home() {
  const [active, setActive] = useState<string | null>(null);

  // 🔹 Home Header data (from Admin)
  const [homeHeader, setHomeHeader] = useState<{
    name: string;
    title: string;
    image?: string;
  } | null>(null);

  useEffect(() => {
    const loadHomeHeader = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "homeHeader"));
        if (snap.exists()) {
          setHomeHeader(snap.data() as any);
        }
      } catch (e) {
        console.log("Failed to load home header", e);
      }
    };

    loadHomeHeader();
  }, []);

  const [language, setLanguage] = useState<Language>("en");
  const leaderText = LEADER_TEXT[language];

  const labels = MENU_LABELS[language];

  const menuItems = [
    { icon: "person-circle-outline", key: "Profile", route: "/(tabs)/Profile" },
    { icon: "newspaper-outline", key: "News", route: "/(tabs)/News" },
    { icon: "images-outline", key: "Gallery", route: "/(tabs)/Gallery" },
    { icon: "videocam-outline", key: "Video", route: "/(tabs)/Video" },
    { icon: "calendar-outline", key: "Events", route: "/(tabs)/Events" },
    { icon: "chatbubbles-outline", key: "Poll", route: "/(tabs)/Poll" },
    {
      icon: "alert-circle-outline",
      key: "Complaint",
      route: "/(tabs)/ComplaintBox",
    },
    { icon: "clipboard-outline", key: "Survey", route: "/(tabs)/Survey" },
    { icon: "help-circle-outline", key: "Help", route: "/(user)/(tabs)/Help" },
  ];

  return (
    <GlossyBackground
      gradient={GlossyTheme.gradient.colors}
      blur={GlossyTheme.blur}
    >
      {/* <ImageBackground
        source={HomeBackground}
        style={{ flex: 1 }}
        resizeMode="cover"
      > */}
      {/* overlay */}
      <View style={styles.overlay} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Header
          name={homeHeader?.name || leaderText.name}
          title={homeHeader?.title || leaderText.title}
          profileImage={homeHeader?.image}
          onLanguageChange={(lang) => {
            if (lang === "Telugu") setLanguage("te");
            if (lang === "Hindi") setLanguage("hi");
            if (lang === "English") setLanguage("en");
          }}
        />

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <MenuButton
              key={item.key}
              icon={item.icon as any}
              label={labels[item.key as keyof typeof labels]}
              active={active === item.key}
              onPress={() => {
                setActive(item.key);
                router.push(item.route as any);
              }}
            />
          ))}
        </View>
      </ScrollView>
      {/* </ImageBackground> */}
    </GlossyBackground>
  );

  // return (
  //   <ImageBackground
  //     source={HomeBackground}
  //     style={{ flex: 1 }}
  //     resizeMode="cover"
  //   >
  //     {/* 🌫️ Overlay for readability */}
  //     <View style={styles.overlay} />
  //     <GlossyBackground
  //       // gradient={GlossyTheme.gradient.colors}
  //       gradient={["transparent", "transparent"]}
  //       blur={GlossyTheme.blur}
  //     >
  //       {/* <StatusBar barStyle="dark-content" backgroundColor={Colors.background} /> */}

  //       <ScrollView
  //         style={styles.container}
  //         contentContainerStyle={styles.contentContainer}
  //         showsVerticalScrollIndicator={false}
  //       >
  //         <Header
  //           name={leaderText.name}
  //           title={leaderText.title}
  //           profileImage={LeaderInfo.profileImage}
  //           onLanguageChange={(lang) => {
  //             if (lang === "Telugu") setLanguage("te");
  //             if (lang === "Hindi") setLanguage("hi");
  //             if (lang === "English") setLanguage("en");
  //           }}
  //         />

  //         <View style={styles.grid}>
  //           {menuItems.map((item) => (
  //             <MenuButton
  //               key={item.key}
  //               icon={item.icon as any}
  //               label={labels[item.key as keyof typeof labels]}
  //               active={active === item.key}
  //               onPress={() => {
  //                 setActive(item.key);
  //                 router.push(item.route as any);
  //               }}
  //             />
  //           ))}
  //         </View>
  //       </ScrollView>
  //     </GlossyBackground>
  //   </ImageBackground>
  // );
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(31, 31, 31, 0.27)",
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 6,
    // borderWidth: 1,
    // borderColor: Colors.border,
    width: "98%",
  },
});

// import React from "react";
// import { ScrollView, StyleSheet, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import GlossyBackground from "@/componenets/Shared/GlossyBackground";
// import GlossyTheme from "@/data/GlossyTheme";

// import HomeHeader from "@/componenets/Home/HomeHeader";
// import HomeEventsSection from "@/componenets/Home/sections/HomeEventsSection";
// import HomeNewsFeedSection from "@/componenets/Home/sections/HomeNewsFeedSection";
// import HomeNewsSection from "@/componenets/Home/sections/HomeNewsSection";
// import HomePollSection from "@/componenets/Home/sections/HomePollSection";
// import HomePostsSection from "@/componenets/Home/sections/HomePostsSection";
// import HomeSurveySection from "@/componenets/Home/sections/HomeSurveySection";
// import HomeVideosSection from "@/componenets/Home/sections/HomeVideosSection";
// import QuickActions from "@/componenets/Home/sections/QuickActions";

// export default function Home() {
//   return (
//     <GlossyBackground
//       gradient={GlossyTheme.gradient.colors}
//       blur={GlossyTheme.blur}
//     >
//       <SafeAreaView style={styles.safe} edges={["top"]}>
//         <HomeHeader />
//         <ScrollView
//           style={styles.container}
//           contentContainerStyle={styles.content}
//           showsVerticalScrollIndicator={false}
//         >
//           <HomeNewsSection />

//           <HomeEventsSection />

//           <HomePostsSection />

//           <HomeVideosSection />

//           <HomeSurveySection />

//           <HomePollSection />

//           <HomeNewsFeedSection />

//           <View style={{ height: 40 }} />
//         </ScrollView>
//         <QuickActions />
//       </SafeAreaView>
//     </GlossyBackground>

//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//   },
//   content: {
//     paddingBottom: 24,
//   },
// });
