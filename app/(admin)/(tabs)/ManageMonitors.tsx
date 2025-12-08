import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "@/data/Colors";
import ContentCreatedScreen from "../content/ContentCreatedScreen";
import EditMonitorsScreen from "../edit-monitors/EditMonitorsScreen";

const Tab = createMaterialTopTabNavigator();

export default function MonitorsTabs() {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeTop} />

      <View style={styles.tabContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarIndicatorStyle: styles.indicator,
            tabBarLabelStyle: styles.tabLabel,
          }}
        >
          <Tab.Screen
            name="ContentCreated"
            component={ContentCreatedScreen}
            options={{ title: "Content Created" }}
          />

          <Tab.Screen
            name="EditMonitors"
            component={EditMonitorsScreen}
            options={{ title: "Edit Monitors" }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // important
  },

  safeTop: {
    backgroundColor: "#FFFFFF",
  },

  tabContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  tabBar: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  indicator: {
    backgroundColor: Colors.primary,
    height: 3,
    borderRadius: 10,
    marginHorizontal: 40,
  },

  tabLabel: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "none",
    color: Colors.textPrimary,
  },
});
