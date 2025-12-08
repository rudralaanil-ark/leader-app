import Colors from "@/data/Colors";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TopSectionTabs({ tabs, activeTab, onChange }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onChange(tab.key)}
              style={[
                styles.tabButton,
                isActive ? styles.activeTab : styles.inactiveTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    paddingLeft: 10,
    backgroundColor: "transparent",
  },
  scroll: {
    paddingRight: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
    maxWidth: 140,
  },
  activeTab: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  inactiveTab: {
    backgroundColor: Colors.surfaceDark,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    numberOfLines: 1,
    ellipsizeMode: "tail",
  },
  activeText: {
    color: Colors.textInverse,
  },
  inactiveText: {
    color: Colors.textSecondary,
  },
});
