import Button from "@/componenets/Shared/Button";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

export default function LandingScreen() {
  const router = useRouter();
  return (
    <View>
      <Image
        source={require("../assets/images/AshokLogo.png")}
        style={{
          width: 200,
          height: 200,
          // resizeMode: "contain",
          marginTop: 250,
          alignSelf: "center",
        }}
      />
      <View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          The Leader App
        </Text>

        <Button
          text="Get Started"
          onPress={() => router.push("/(auth)/SignUp")}
        />

        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Already have an account?{" "}
          <Text
            style={{ color: "blue", fontWeight: "bold" }}
            onPress={() => router.push("/(auth)/SignIn")}
          >
            Sign In Here
          </Text>
        </Text>
      </View>
    </View>
  );
}
