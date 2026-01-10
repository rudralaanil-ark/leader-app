import Colors from "@/data/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* Enable animation on Android */
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

/* ================= CONTENT ================= */

const CONTENT = {
  en: [
    {
      title: "About This App",
      body:
        "This app helps you stay informed, raise complaints, and participate in public activities. " +
        "It is optimized to save mobile data and works smoothly even on slow networks.",
    },
    {
      title: "Home Screen",
      body:
        "The Home screen shows the latest updates, important announcements, and quick access " +
        "to all main sections of the app.",
    },
    {
      title: "News",
      body:
        "Read verified and reliable news in a simple format. " +
        "This section is only for reading and staying informed.",
    },
    {
      title: "Videos",
      body:
        "Watch informative videos that are optimized to use less data. " +
        "You can like, comment, and share videos. Video playback is smooth and adaptive.",
    },
    {
      title: "Gallery",
      body:
        "View images related to events and activities. Photos are neatly organized into folders " +
        "for easy browsing.",
    },
    {
      title: "Events",
      body:
        "View upcoming and completed events with details such as date and location, " +
        "so you stay aware of activities around you.",
    },
    {
      title: "Polls",
      body:
        "Participate in polls and share your opinion. You can vote only once per poll. " +
        "Polls help understand public opinion.",
    },
    {
      title: "Surveys",
      body:
        "Fill surveys to share feedback about local issues and public needs. " +
        "Your responses help improve services.",
    },
    {
      title: "Complaints",
      body:
        "Submit complaints and attach photos or videos as proof. " +
        "You can track the status clearly as Pending, Under process, or Resolved.",
    },
    {
      title: "Data & Performance",
      body:
        "The app is designed to save data. Videos and images are optimized, " +
        "and large files are handled efficiently in the background.",
    },
    {
      title: "Profile",
      body:
        "View your personal details, see your submitted complaints and surveys, " +
        "and manage your account settings.",
    },
    {
      title: "Privacy & Safety",
      body:
        "Your data is securely stored. Only necessary information is collected, " +
        "and your privacy is always protected.",
    },
  ],

  te: [
    {
      title: "యాప్ గురించి",
      body:
        "ఈ యాప్ మీకు సమాచారం తెలుసుకోవడానికి, ఫిర్యాదులు ఇవ్వడానికి, " +
        "మరియు ప్రజా కార్యక్రమాల్లో పాల్గొనేందుకు సహాయపడుతుంది. " +
        "తక్కువ డేటా వినియోగానికి అనుకూలంగా రూపొందించబడింది.",
    },
    {
      title: "హోమ్ స్క్రీన్",
      body:
        "హోమ్ స్క్రీన్‌లో తాజా సమాచారం, ముఖ్య ప్రకటనలు, " +
        "మరియు అన్ని విభాగాలకు త్వరిత ప్రాప్యత ఉంటుంది.",
    },
    {
      title: "న్యూస్",
      body:
        "ధృవీకరించిన న్యూస్‌ను సులభమైన రూపంలో చదవవచ్చు. " +
        "ఇది కేవలం సమాచారం కోసం మాత్రమే.",
    },
    {
      title: "వీడియోలు",
      body:
        "తక్కువ డేటా వినియోగంతో సమాచార వీడియోలు చూడవచ్చు. " +
        "వీడియోలను లైక్, కామెంట్, షేర్ చేయవచ్చు.",
    },
    {
      title: "గ్యాలరీ",
      body:
        "ఈవెంట్లు మరియు కార్యక్రమాలకు సంబంధించిన ఫోటోలు చూడవచ్చు. " +
        "ఫోల్డర్లలో క్రమబద్ధంగా ఉంటాయి.",
    },
    {
      title: "ఈవెంట్లు",
      body:
        "రాబోయే మరియు పూర్తైన ఈవెంట్ల వివరాలు (తేదీ, ప్రదేశం) చూడవచ్చు. " +
        "మీ చుట్టూ జరుగుతున్న కార్యక్రమాల సమాచారం అందుతుంది.",
    },
    {
      title: "పోల్స్",
      body:
        "పోల్స్‌లో పాల్గొని మీ అభిప్రాయం చెప్పవచ్చు. " +
        "ఒక్క పోల్కి ఒక్కసారి మాత్రమే ఓటు వేయవచ్చు.",
    },
    {
      title: "సర్వేలు",
      body:
        "స్థానిక సమస్యలు మరియు అవసరాలపై సర్వేలు పూర్తి చేయవచ్చు. " +
        "మీ సమాధానాలు సేవలను మెరుగుపరుస్తాయి.",
    },
    {
      title: "ఫిర్యాదులు",
      body:
        "ఫిర్యాదులు నమోదు చేసి ఫోటో లేదా వీడియో జత చేయవచ్చు. " +
        "పెండింగ్, ప్రాసెస్‌లో, పరిష్కరించబడింది అనే స్థితులు చూడవచ్చు.",
    },
    {
      title: "డేటా & పనితీరు",
      body:
        "యాప్ డేటా ఆదా చేసే విధంగా పనిచేస్తుంది. " +
        "పెద్ద ఫైళ్లు బ్యాక్‌గ్రౌండ్‌లో సమర్థవంతంగా నిర్వహించబడతాయి.",
    },
    {
      title: "ప్రొఫైల్",
      body:
        "మీ వివరాలు, మీరు ఇచ్చిన ఫిర్యాదులు మరియు సర్వేలు చూడవచ్చు. " +
        "అకౌంట్ నిర్వహణ చేయవచ్చు.",
    },
    {
      title: "గోప్యత & భద్రత",
      body:
        "మీ సమాచారం భద్రంగా ఉంటుంది. అవసరమైన సమాచారమే సేకరిస్తారు. " +
        "మీ గోప్యత పూర్తిగా రక్షించబడుతుంది.",
    },
  ],
};

/* ================= COMPONENT ================= */

export default function Help() {
  const [lang, setLang] = useState<"en" | "te">("en");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Language Toggle ONLY */}
      <View style={styles.header}>
        <View style={styles.langSwitch}>
          <TouchableOpacity
            style={[styles.langBtn, lang === "en" && styles.langActive]}
            onPress={() => setLang("en")}
          >
            <Text style={styles.langText}>English</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langBtn, lang === "te" && styles.langActive]}
            onPress={() => setLang("te")}
          >
            <Text style={styles.langText}>తెలుగు</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {CONTENT[lang].map((item, index) => {
          const open = openIndex === index;

          return (
            <View key={index} style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => toggle(index)}
              >
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Ionicons
                  name={open ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>

              {open && <Text style={styles.cardBody}>{item.body}</Text>}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },

  langSwitch: {
    flexDirection: "row",
    gap: 10,
  },

  langBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  langActive: {
    backgroundColor: Colors.primary,
  },

  langText: {
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  card: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },

  cardBody: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
});
