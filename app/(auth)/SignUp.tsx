import Button from "@/componenets/Shared/Button";
import TextInputField from "@/componenets/Shared/TextInputField";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const { signUp, loading } = useAuth();
  const router = useRouter();

  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [fullName, setFullName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.6,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const onButtonPress = async () => {
    if (!email || !password || !fullName) {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.BOTTOM);
      return;
    }
    signUp(fullName, email, password, profileImage);
  };

  return (
    <LinearGradient
      colors={Colors.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 🌟 Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Your Account ✨</Text>
            <Text style={styles.subtitle}>
              Join the Leader App community today!
            </Text>
          </View>

          {/* 🖼 Profile Image */}
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.85}>
              <LinearGradient
                colors={Colors.gradientPrimary}
                style={styles.imageBorder}
              >
                <Image
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : require("../../assets/images/profile.png")
                  }
                  style={styles.profileImage}
                />
              </LinearGradient>
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color={Colors.textInverse} />
              </View>
            </TouchableOpacity>
          </View>

          {/* 🧾 Form Card */}
          <View style={styles.formCard}>
            <TextInputField
              lable="Full Name"
              placeholder="Enter your full name"
              onChangeText={(v) => setFullName(v)}
            />
            <TextInputField
              lable="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              onChangeText={(v) => setEmail(v)}
              autoCapitalize="none"
            />

            {/* 🔒 Password Field with Eye */}
            <View style={styles.passwordContainer}>
              <TextInputField
                lable="Password"
                placeholder="Enter your password"
                password={!showPassword}
                onChangeText={(v) => setPassword(v)}
                style={{ flex: 1 }}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* ✅ Button */}
            <Button
              text="Create Account"
              onPress={onButtonPress}
              loading={loading}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            {/* 🔁 Sign In */}
            <Text style={styles.signinText}>
              Already have an account?{" "}
              <Text
                style={styles.signinLink}
                onPress={() => router.push("../(auth)/SignIn")}
              >
                Sign In Here
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  imageBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  profileImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
    resizeMode: "cover",
    backgroundColor: Colors.surface,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 6,
    shadowColor: Colors.strongShadow,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 35,
    padding: 4,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  orText: {
    marginHorizontal: 8,
    color: Colors.textMuted,
    fontSize: 13,
  },
  signinText: {
    fontSize: 15,
    textAlign: "center",
    color: Colors.textSecondary,
  },
  signinLink: {
    color: Colors.primary,
    fontWeight: "700",
  },
});
