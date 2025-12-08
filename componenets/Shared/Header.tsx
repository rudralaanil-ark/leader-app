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
      {/* ⚙️ Settings Icon (Floating) */}
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => setShowLangMenu(!showLangMenu)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // invisible touch padding
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={26} color={Colors.homeIcon} />
        </TouchableOpacity>

        {/* 🌐 Language Menu */}
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

export default Header;

const styles = StyleSheet.create({
  /**
   * 🧭 Settings icon container
   * - Absolute positioning lets you move it anywhere on the screen
   */
  iconContainer: {
    position: "absolute",
    top: 20, // 🔧 adjust vertical position (distance from top)
    right: 10, // 🔧 adjust horizontal position (distance from right)
    zIndex: 20, // ensures it stays above everything
  },

  /**
   * ⚙️ Settings button styling
   */
  settingsButton: {
    // backgroundColor: Colors.card,
    borderRadius: 50,
    paddingRight: 10,
    paddingTop: 25,
    marginLeft: 50,
    // adjust visible padding
    // shadowColor: Colors.shadow,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.15,
    // shadowRadius: 6,
    // elevation: 3,
  },

  /**
   * 🌐 Language menu dropdown
   */
  langMenu: {
    position: "absolute",
    top: 60, // distance below settings icon
    right: 0,
    backgroundColor: Colors.card,
    borderRadius: 10,
    elevation: 5,
    // padding: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langText: {
    fontSize: 16,
    paddingVertical: 5,
    color: Colors.primary,
    fontWeight: "500",
  },

  /**
   * 🧑 Profile Section
   */
  container: {
    alignItems: "center",
    marginTop: 50, // give space for the floating icon
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2.5,
    borderColor: Colors.homeProfileBorder,
    marginTop: 10,
  },
  name: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.textWhite,
  },
  title: {
    fontSize: 16,
    color: Colors.textWhite,
  },
});
