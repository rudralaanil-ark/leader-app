// app/(auth)/SignIn.tsx
import Button from "@/componenets/Shared/Button";
import TextInputField from "@/componenets/Shared/TextInputField";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
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

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading } = useAuth();

  // 🔹 Show Gmail suggestion if no '@' yet
  const showGmailSuggestion =
    email.length > 0 && !email.includes("@") && !email.includes(" ");

  const suggestedEmail = `${email}@gmail.com`;

  const onSignInButtonPress = async () => {
    if (!email || !password) {
      ToastAndroid.show("Please enter email and password", ToastAndroid.BOTTOM);
      return;
    }
    signIn(email, password);
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
          {/* 🔷 Logo Section */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={Colors.gradientPrimary}
              style={styles.logoWrapper}
            >
              <Image
                source={require("../../assets/images/AshokLogo.png")}
                style={styles.logo}
              />
            </LinearGradient>
            <Text style={styles.title}>Welcome Back 👋</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* 🔹 Input Fields */}
          <View style={styles.formCard}>
            {/* Email Field */}
            <View style={{ position: "relative" }}>
              <TextInputField
                lable="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                onChangeText={(v) => setEmail(v.trim())}
                value={email}
                autoCapitalize="none"
              />

              {/* 🔹 Gmail Suggestion */}
              {showGmailSuggestion && (
                <TouchableOpacity
                  onPress={() => setEmail(suggestedEmail)}
                  style={styles.suggestionBox}
                >
                  <Text style={styles.suggestionText}>{suggestedEmail}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Password with eye toggle */}
            <View style={styles.passwordContainer}>
              <TextInputField
                lable="Password"
                placeholder="Enter your password"
                password={!showPassword}
                onChangeText={(v) => setPassword(v)}
                style={{ flex: 1 }}
                value={password}
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

            {/* Sign In Button */}
            <Button
              text="Sign In"
              onPress={onSignInButtonPress}
              loading={loading}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            {/* Sign Up Link */}
            <Text style={styles.signupText}>
              New to Leader App?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => router.push("/(auth)/SignUp")}
              >
                Sign Up Here
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoWrapper: {
    width: 156,
    height: 156,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 100,
    resizeMode: "cover",
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.primary,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
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
  signupText: {
    fontSize: 15,
    textAlign: "center",
    color: Colors.textSecondary,
  },
  signupLink: {
    color: Colors.primary,
    fontWeight: "700",
  },

  // ✨ Gmail Suggestion Styling
  suggestionBox: {
    position: "absolute",
    top: 75, // below TextInputField
    left: 30,
    right: 0,
    zIndex: 2,
    backgroundColor: Colors.elevatedCard,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  suggestionText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
});
