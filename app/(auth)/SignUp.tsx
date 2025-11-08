import { uploadImageToCloudinary } from "@/app/api/uploadImage"; // ✅ imported
import { createUserInFirestore, fetchUserData } from "@/app/api/users"; // ✅ imported
import Button from "@/componenets/Shared/Button";
import TextInputField from "@/componenets/Shared/TextInputField";
import { auth } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
// import { SignIn } from "@/(auth)/SignIn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import authErrorMessage from "./utils/authErrors";

export default function SignUp() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [fullName, setFullName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onButtonPress = async () => {
    if (!email || !password || !fullName) {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.BOTTOM);
      return;
    }

    try {
      setLoading(true);

      // ✅ Create Firebase user first
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User created:", user.uid);

      // ✅ Upload image AFTER user is created
      let uploadedUrl: string | null = null;
      if (profileImage) {
        uploadedUrl = await uploadImageToCloudinary(profileImage);
      }

      // ✅ Save data to Firestore
      await createUserInFirestore(user.uid, fullName, email, uploadedUrl);

      const userData = await fetchUserData(user.uid);
      if (userData) {
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        ToastAndroid.show(
          "Account created successfully! Welcome, " + userData.fullName,
          ToastAndroid.BOTTOM
        );
      }
      router.push("/Screens/Home");
    } catch (error: any) {
      // console.error("Signup error:", error);
      const errorMsg = authErrorMessage(error?.message);
      ToastAndroid.show(errorMsg, ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  return (
    <View style={{ paddingTop: 40, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Create a New Account
      </Text>

      <View style={{ display: "flex", alignItems: "center" }}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../assets/images/profile.png")
            }
            style={styles.profileImage}
          />
          <Ionicons
            name="camera-sharp"
            size={24}
            color={Colors.icons}
            style={{ position: "absolute", bottom: 0, right: 0 }}
          />
        </TouchableOpacity>
      </View>

      {/* {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginVertical: 10 }}
        />
      )} */}

      <TextInputField lable="Full Name" onChangeText={(v) => setFullName(v)} />
      <TextInputField lable="Email" onChangeText={(v) => setEmail(v)} />
      <TextInputField
        lable="Password"
        password
        onChangeText={(v) => setPassword(v)}
      />

      <Button
        text="Create Account"
        onPress={() => onButtonPress()}
        loading={loading}
      />

      <Text style={{ fontSize: 16, textAlign: "center", marginTop: 10 }}>
        Already have an account?{" "}
        <Text
          style={{ color: "blue", fontWeight: "bold" }}
          onPress={() => router.push("../(auth)/SignIn")}
        >
          Sign In Here
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderColor: Colors.primary,
    borderRadius: 50,
    marginTop: 30,
  },
});
