import Button from "@/componenets/Shared/Button";
import TextInputField from "@/componenets/Shared/TextInputField";
import { auth } from "@/configs/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Image, Text, ToastAndroid, View } from "react-native";
import { fetchUserData } from "../api/users";

export default function SingIn() {
  const router = useRouter();
  const [email, setEmail] = React.useState<string | undefined>();
  const [password, setPassword] = React.useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const onSignInButtonPress = async () => {
    if (!email || !password) {
      ToastAndroid.show("Please enter email and password", ToastAndroid.BOTTOM);
      return;
    }
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed in:", user.uid);

      const userData = await fetchUserData(user.uid);

      if (userData) {
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        ToastAndroid.show(
          "Welcome back, " + userData.fullName,
          ToastAndroid.BOTTOM
        );
      }

      router.replace("/Screens/Home");
    } catch (error: any) {
      console.log("Error signing in:", error.message);
      ToastAndroid.show(
        "Sign in failed. Please check your credentials.",
        ToastAndroid.BOTTOM
      );
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        padding: 20,
        paddingTop: 40,
      }}
    >
      <View>
        <Image
          source={require("../../assets/images/AshokLogo.png")}
          style={{
            width: 150,
            height: 150,
            // resizeMode: "contain",
            marginTop: 50,
            alignSelf: "center",
          }}
        />
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Sign In to Leader App
      </Text>

      <TextInputField lable="Email" onChangeText={(v) => setEmail(v)} />
      <TextInputField
        lable="Password"
        password={true}
        onChangeText={(v) => setPassword(v)}
      />
      <Button
        text="Sign In"
        onPress={() => onSignInButtonPress()}
        loading={loading}
      />

      <Text style={{ fontSize: 16, textAlign: "center", marginTop: 10 }}>
        New to Leader App ,{" "}
        <Text
          style={{ color: "blue", fontWeight: "bold" }}
          onPress={() => router.push("/(auth)/SignUp")}
        >
          Sign Up Here
        </Text>
      </Text>
    </View>
  );
}
