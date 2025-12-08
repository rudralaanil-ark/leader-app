import Colors from "@/data/Colors";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type TextInputFieldProps = {
  lable?: string;
  placeholder?: string;
  keyboardType?: any;
  onChangeText?: (text: string) => void;
  value?: string; // ✅ include value prop
  password?: boolean;
  style?: object;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export default function TextInputField({
  lable,
  placeholder,
  keyboardType = "default",
  onChangeText,
  value,
  password = false,
  style,
  autoCapitalize = "none",
}: TextInputFieldProps) {
  return (
    <View style={[styles.container, style]}>
      {lable && <Text style={styles.label}>{lable}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        value={value} // ✅ now it’s controlled by React state
        secureTextEntry={password}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
});
