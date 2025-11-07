import Colors from "@/data/Colors";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  text: string;
  onPress: () => void;
  loading?: boolean;
};

export default function Button({
  text,
  onPress,
  loading = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: 30,
        marginLeft: 50,
        marginRight: 50,
        padding: 10,
        backgroundColor: Colors.primary,
        borderRadius: 10,
      }}
    >
      {loading ? <ActivityIndicator size="small" color="#fff" /> : null}
      <Text
        style={{
          color: "#fff",
          fontSize: 18,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
