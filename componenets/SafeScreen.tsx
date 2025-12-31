import React from "react";
import { View, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafeScreen({
  children,
  backgroundColor = "#000",
}: {
  children: React.ReactNode;
  backgroundColor?: string;
}) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor }}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        translucent={Platform.OS === "android"}
        backgroundColor="transparent"
      />

      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
