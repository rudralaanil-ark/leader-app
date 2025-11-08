import GlossyTheme from "@/data/GlossyTheme";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function GlossyBackground({ children }: Props) {
  return (
    <View style={styles.container}>
      {/* 🌈 Gradient Layer (configurable) */}
      <LinearGradient
        colors={GlossyTheme.gradient.colors}
        start={GlossyTheme.gradient.start}
        end={GlossyTheme.gradient.end}
        style={StyleSheet.absoluteFill}
      />

      {/* 💎 Glossy Blur Overlay (configurable) */}
      <BlurView
        intensity={GlossyTheme.blur.intensity}
        tint={GlossyTheme.blur.tint}
        style={StyleSheet.absoluteFill}
      />

      {/* 🧩 Screen Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    // paddingHorizontal: 20,
    // paddingTop: 40,
  },
});
