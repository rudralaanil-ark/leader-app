import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface ProfileTabIconProps {
  color: string;
  size: number;
  focused: boolean;
  imageUrl?: string;
}

const ProfileTabIcon: React.FC<ProfileTabIconProps> = ({
  color,
  size,
  focused,
  imageUrl,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: focused ? color : "transparent",
          borderWidth: focused ? 2 : 0,
          borderRadius: size,
        },
      ]}
    >
      <Image
        source={
          imageUrl ? { uri: imageUrl } : require("@/assets/images/profile.png")
        }
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
  },
});

export default ProfileTabIcon;
