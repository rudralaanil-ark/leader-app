import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type HeaderProps = {
  name: string;
  title: string;
  profileImage?: string;
  onLanguageChange?: (lang: string) => void;
};

const Header: React.FC<HeaderProps> = ({
  name,
  title,
  profileImage,
  onLanguageChange,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <>
      {/* 🆕 FIX 1: Separate top bar so settings icon sits at the actual top-right of the screen */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setShowLangMenu(!showLangMenu)}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={26} color={Colors.primary} />
        </TouchableOpacity>

        {/* 🗣️ Dropdown menu appears below the settings icon */}
        {showLangMenu && (
          <Animated.View style={styles.langMenu}>
            <TouchableOpacity
              onPress={() => {
                onLanguageChange?.("Telugu");
                setShowLangMenu(false);
              }}
            >
              <Text style={styles.langText}>తెలుగు</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onLanguageChange?.("Hindi");
                setShowLangMenu(false);
              }}
            >
              <Text style={styles.langText}>हिंदी</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* 🧑 Profile Section */}
      <View style={styles.container}>
        <Image
          source={
            profileImage ? profileImage : require("@/assets/images/profile.png")
          }
          style={styles.image}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // 🆕 FIX 2: Added a top bar to hold settings icon — separate from profile section
  topBar: {
    width: "100%",
    alignItems: "flex-end", // aligns icon to the right edge of the screen
    paddingHorizontal: 20,
    paddingTop: 10,
    position: "relative",
  },

  // 🆕 FIX 3: Style for settings button — ensures good touch area and spacing
  settingsButton: {
    padding: 6,
  },

  // 🧑 Profile section (centered)
  container: {
    alignItems: "center",
    marginVertical: 10,
  },

  image: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderWidth: 2.5,
    borderColor: Colors.primary,
    marginTop: 10,
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  title: {
    fontSize: 16,
    color: Colors.secondary,
  },

  // 🗣️ Language dropdown menu styles
  langMenu: {
    marginTop: 10,
    position: "absolute",
    top: 40, // distance below the icon
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  langText: {
    fontSize: 16,
    paddingVertical: 5,
    color: Colors.primary,
    fontWeight: "500",
  },
});

export default Header;
