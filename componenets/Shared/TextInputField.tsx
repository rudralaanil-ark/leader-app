import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type TextInputFieldProps = {
  lable: string;
  onChangeText: (text: string) => void;
  password?: boolean;
};

export default function TextInputField({
  lable,
  onChangeText,
  password = false,
}: TextInputFieldProps) {
  return (
    <View style={{ marginTop: 20 }}>
      <Text>{lable}</Text>
      <TextInput
        placeholder={lable}
        style={styles.textInput}
        secureTextEntry={password}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
});
