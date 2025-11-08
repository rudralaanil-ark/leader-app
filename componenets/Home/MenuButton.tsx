import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type MenuButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  active?: boolean;
};

const MenuButton: React.FC<MenuButtonProps> = ({
  icon,
  label,
  onPress,
  active,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, active && styles.active]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={28}
        color={active ? "#fff" : Colors.primary}
      />
      <Text style={[styles.label, active && { color: "#fff" }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // it is the cards style in home grid

  button: {
    width: 100,
    height: 100,
    borderRadius: 20,
    // backgroundColor: Colors.cards,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  active: {
    backgroundColor: Colors.primary,
  },
  label: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
});

export default MenuButton;
