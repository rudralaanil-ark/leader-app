// import GlossyBackground from "@/componenets/Shared/GlossyBackground";
// import Colors from "@/data/Colors";
// import { LinearGradient } from "expo-linear-gradient";
// import React, { useState } from "react";
// import {
//   ImageBackground,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function LeaderProfile() {
//   const [activeTab, setActiveTab] = useState<
//     "about" | "achievements" | "contact"
//   >("about");

//   const leader = {
//     name: "Dr. Ch. Ashok Kumar",
//     title: "అద్దంకి  నియోజకవర్గ YSRCP ఇంచార్జ్ ",
//     image: require("@/assets/images/AshokAbout.jpg"),
//     about: `డా. చింతలపూడి అశోక్ కుమార్ గారు పళ్నాడు జిల్లా (ఆంధ్రప్రదేశ్)కు చెందిన యువ, చురుకైన నాయకులు. వైద్య వృత్తి ద్వారా ప్రజలకు సేవ చేసే ఆత్మీయతతో ప్రారంభమై, పబ్లిక్ సర్వీస్ పట్ల అంకితభావంతో ఆయన రాజకీయ రంగంలోకి అడుగుపెట్టారు.

// వైద్యరంగంలో, పళ్నాడు హాస్పిటల్స్‌లో ప్రసిద్ధ ఆర్థోపెడిక్ నిపుణుడిగా డా. అశోక్ కుమార్ గారు ప్రజల విశ్వాసాన్ని సంపాదించారు. ప్రజల ఆరోగ్య సమస్యలను సమీక్షించి, నిబద్ధతతో వైద్యం అందించే ఆయన సేవా ధోరణి ద్వారా ఎన్నో మంది జీవితాల్లో మార్పు తీసుకొచ్చారు.

// 2024లో, వైఎస్‌ఆర్ కాంగ్రెస్ పార్టీ పట్ల నమ్మకంతో, ఆయన రాజకీయ రంగంలోకి ప్రవేశించి, అద్దంకి నియోజకవర్గానికి పార్టీ ఇన్‌చార్జ్‌గా నియమితులయ్యారు. ఈ నియామకం ద్వారా పార్టీ ఆయనపై ఉంచిన విశ్వాసం, ప్రజా సేవ పట్ల ఆయన దృఢ సంకల్పం ప్రతిఫలిస్తుంది.

// డాక్టర్‌గా ప్రజల సేవలో నిమగ్నమైన ఆయన ఇప్పుడు ప్రజల సమస్యలను నేరుగా పరిష్కరించాలనే తపనతో రాజకీయ సేవలో కొనసాగుతున్నారు. ప్రజల సంక్షేమం, ఆరోగ్య వ్యవస్థ బలోపేతం, యువత సాధికారత మరియు పారదర్శక పాలనపై ఆయన ప్రత్యేక దృష్టి సారిస్తున్నారు.

// డా. అశోక్ కుమార్ గారు “ప్రజల విశ్వాసమే నా శక్తి – సేవే నా లక్ష్యం” అనే ధృక్పథంతో ముందుకు సాగుతున్నారు.`,
//     achievements: [
//       "పళ్నాడు హాస్పిటల్స్‌లో ప్రముఖ ఆర్థోపెడిక్ నిపుణుడిగా వేలాది మంది రోగులకు సేవలు.",
//       "ఉచిత ఆరోగ్య శిబిరాలు, పేదవారికి ఉచిత వైద్యం ద్వారా ప్రజల విశ్వాసం సంపాదించారు.",
//       "వైఎస్‌ఆర్ కాంగ్రెస్ పార్టీ అద్దంకి ఇన్‌చార్జ్‌గా ప్రజల అభివృద్ధికి కృషి.",
//       "గ్రామీణ ఆరోగ్య, విద్యా రంగాల్లో మౌలిక వసతుల బలోపేతం కోసం చొరవ.",
//       "పర్యావరణ పరిరక్షణ మరియు యువత సాధికారత కోసం సేవా కార్యక్రమాలు.",
//       "ఆధునిక సాంకేతికతతో పారదర్శక పాలనపై దృష్టి.",
//     ],
//     contact: {
//       email: "office@xxxxxxx.gov.in",
//       phone: "+91 xxx-xxxx-xxx",
//       address: "xxxxxx-xxxxx-xxx",
//     },
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "about":
//         return <Text style={styles.aboutText}>{leader.about}</Text>;
//       case "achievements":
//         return leader.achievements.map((item, index) => (
//           <View key={index} style={styles.achievementItem}>
//             <Text style={styles.achievementBullet}>•</Text>
//             <Text style={styles.achievementText}>{item}</Text>
//           </View>
//         ));
//       case "contact":
//         return (
//           <View>
//             <Text style={styles.contactLine}>📧 {leader.contact.email}</Text>
//             <Text style={styles.contactLine}>📞 {leader.contact.phone}</Text>
//             <Text style={styles.contactLine}>📍 {leader.contact.address}</Text>
//           </View>
//         );
//     }
//   };

//   return (
//     <GlossyBackground>
//       <ScrollView
//         contentContainerStyle={styles.container}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* 🖼️ Hero Image Section */}
//         <View style={styles.imageContainer}>
//           <ImageBackground
//             source={leader.image}
//             style={styles.imageBackground}
//             resizeMode="cover"
//           >
//             {/* 🌈 True Cinematic Fade — bottom 20% black, fading upward */}
//             <LinearGradient
//               colors={[
//                 "rgba(0,0,0,0)", // transparent top (80%)
//                 "rgba(0,0,0,0.01)",
//                 "rgba(0,0,0,0.45)",
//                 "rgba(0,0,0,0.7)",
//                 "rgba(0,0,0,0.70)", // darker bottom
//               ]}
//               locations={[0.0, 0.6, 0.75, 0.9, 1.0]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 0, y: 1 }}
//               style={StyleSheet.absoluteFill}
//             />

//             {/* 🧾 Name & Title Overlay */}
//             <View style={styles.overlayTextContainer}>
//               <Text style={styles.name}>{leader.name}</Text>
//               <Text style={styles.title}>{leader.title}</Text>
//             </View>
//           </ImageBackground>
//         </View>

//         {/* 🪩 Tabs */}
//         <View style={styles.tabBar}>
//           {["about", "achievements", "contact"].map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               onPress={() => setActiveTab(tab as any)}
//             >
//               <Text
//                 style={[
//                   styles.tabText,
//                   activeTab === tab && styles.activeTabText,
//                 ]}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </Text>
//               {activeTab === tab && <View style={styles.tabIndicator} />}
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* 📜 Tab Content */}
//         <LinearGradient
//           colors={[Colors.card, Colors.surface]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 0, y: 1 }}
//           style={styles.contentCard}
//         >
//           {renderTabContent()}
//         </LinearGradient>
//       </ScrollView>
//     </GlossyBackground>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     paddingBottom: 80,
//   },

//   // 🖼️ Hero Image
//   imageContainer: {
//     width: "100%",
//     height: 330,
//     overflow: "hidden",
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//     marginBottom: 20,
//     elevation: 10,
//   },
//   imageBackground: {
//     flex: 1,
//     justifyContent: "flex-end",
//   },

//   // 🧾 Text Overlay
//   overlayTextContainer: {
//     alignItems: "center",
//     paddingBottom: 15,
//   },
//   name: {
//     fontSize: 30,
//     fontWeight: "800",
//     color: Colors.textInverse,
//     textAlign: "center",
//     letterSpacing: 0.3,
//     textShadowColor: "rgba(0,0,0,0.4)",
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   title: {
//     fontSize: 16,
//     color: Colors.textInverse,
//     // fontStyle: "italic",
//     fontWeight: "500",
//     opacity: 0.95,
//     marginTop: 5,
//     textShadowColor: "rgba(0,0,0,0.3)",
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 3,
//   },

//   // 🪩 Tabs
//   tabBar: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "90%",
//     marginTop: 5,
//     marginBottom: 10,
//   },
//   tabText: {
//     fontSize: 16,
//     color: Colors.textMuted,
//     paddingVertical: 8,
//     fontWeight: "600",
//   },
//   activeTabText: {
//     color: Colors.textWhite,
//   },
//   tabIndicator: {
//     height: 3,
//     backgroundColor: Colors.primary,
//     borderRadius: 2,
//     marginTop: 2,
//   },

//   // 📄 Content
//   contentCard: {
//     width: "90%",
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: Colors.shadow,
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   aboutText: {
//     fontSize: 15.5,
//     lineHeight: 23,
//     color: Colors.textSecondary,
//     textAlign: "justify",
//   },
//   achievementItem: {
//     flexDirection: "row",
//     marginBottom: 10,
//   },
//   achievementBullet: {
//     fontSize: 20,
//     color: Colors.primary,
//     marginRight: 8,
//   },
//   achievementText: {
//     fontSize: 15.5,
//     color: Colors.textSecondary,
//     lineHeight: 22,
//     flex: 1,
//   },
//   contactLine: {
//     fontSize: 15.5,
//     color: Colors.textSecondary,
//     marginVertical: 6,
//   },
// });

// app/(user)/(tabs)/Profile.tsx
import {
  LeaderProfile,
  leaderProfileService,
} from "@/app/services/leaderProfileService";
import GlossyBackground from "@/componenets/Shared/GlossyBackground";
import Colors from "@/data/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<
    "about" | "achievements" | "contact"
  >("about");

  const [data, setData] = useState<LeaderProfile | null | undefined>(undefined);

  useEffect(() => {
    leaderProfileService.getOnce().then(setData);
  }, []);

  /* ================= STATES ================= */

  if (data === undefined) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (data === null) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.textMuted }}>
          Leader profile not available
        </Text>
      </View>
    );
  }

  /* ================= CONTENT ================= */

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return <Text style={styles.aboutText}>{data.about}</Text>;

      case "achievements":
        return data.achievements.map((item, index) => (
          <View key={index} style={styles.achievementItem}>
            <Text style={styles.achievementBullet}>•</Text>
            <Text style={styles.achievementText}>{item}</Text>
          </View>
        ));

      case "contact":
        return (
          <View>
            <Text style={styles.contactLine}>📧 {data.contact.email}</Text>
            <Text style={styles.contactLine}>📞 {data.contact.phone}</Text>
            <Text style={styles.contactLine}>📍 {data.contact.address}</Text>
          </View>
        );
    }
  };

  /* ================= UI ================= */

  return (
    <GlossyBackground>
      <ScrollView contentContainerStyle={styles.container}>
        {/* HERO */}
        <View style={styles.imageContainer}>
          <ImageBackground
            source={
              data.imageUrl?.url
                ? { uri: data.imageUrl.url }
                : require("@/assets/images/AshokAbout.jpg") // fallback
            }
            style={styles.imageBackground}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.75)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.overlayTextContainer}>
              <Text style={styles.name}>{data.name}</Text>
              <Text style={styles.title}>{data.title}</Text>
            </View>
          </ImageBackground>
        </View>

        {/* TABS */}
        <View style={styles.tabBar}>
          {["about", "achievements", "contact"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab.toUpperCase()}
              </Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* CONTENT */}
        <LinearGradient
          colors={[Colors.card, Colors.surface]}
          style={styles.contentCard}
        >
          {renderTabContent()}
        </LinearGradient>
      </ScrollView>
    </GlossyBackground>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingBottom: 80 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    width: "100%",
    height: 330,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    marginBottom: 20,
  },

  imageBackground: { flex: 1, justifyContent: "flex-end" },

  overlayTextContainer: { alignItems: "center", paddingBottom: 16 },

  name: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.textInverse,
  },

  title: {
    fontSize: 16,
    color: Colors.textInverse,
    opacity: 0.95,
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginBottom: 12,
  },

  tabText: {
    fontSize: 14.5,
    color: Colors.textMuted,
    fontWeight: "600",
  },

  activeTabText: { color: Colors.textWhite },

  tabIndicator: {
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: 4,
  },

  contentCard: {
    width: "90%",
    borderRadius: 20,
    padding: 20,
  },

  aboutText: {
    fontSize: 14,
    lineHeight: 23,
    color: Colors.textSecondary,
    textAlign: "justify",
  },

  achievementItem: { flexDirection: "row", marginBottom: 10 },

  achievementBullet: {
    fontSize: 20,
    color: Colors.primary,
    marginRight: 8,
  },

  achievementText: {
    fontSize: 15.5,
    color: Colors.textSecondary,
    flex: 1,
  },

  contactLine: {
    fontSize: 15.5,
    color: Colors.textSecondary,
    marginVertical: 6,
  },
});
