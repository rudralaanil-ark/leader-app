import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CompleteProfile = () => {
  const router = useRouter();
  const { pendingProfile } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                          PREFILL FROM PROVIDER                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!pendingProfile) {
      // Safety: if user opens screen directly
      router.replace("/(auth)/SignIn");
      return;
    }

    if (pendingProfile.fullName) {
      setFullName(pendingProfile.fullName);
    }
  }, [pendingProfile]);

  if (!pendingProfile) return null;

  /* -------------------------------------------------------------------------- */
  /*                                UI ONLY                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete your profile</Text>

      {/* Profile Image Preview */}
      {pendingProfile.profileImage && (
        <Image
          source={{ uri: pendingProfile.profileImage }}
          style={styles.avatar}
        />
      )}

      {/* Email (read-only) */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyText}>{pendingProfile.email}</Text>
      </View>

      {/* Full Name (prefilled but editable) */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        placeholder="Your full name"
      />

      {/* Phone Number (required if missing) */}
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      {/* Continue Button (inactive logic later) */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Your name and photo are fetched from your sign-in provider.
      </Text>
    </View>
  );
};

export default CompleteProfile;

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: Colors.textPrimary,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: "center",
    marginBottom: 20,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    backgroundColor: Colors.lightCard,
    color: Colors.textPrimary,
  },
  readOnlyBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.surface,
  },
  readOnlyText: {
    color: Colors.textMuted,
  },
  button: {
    marginTop: 30,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.buttonText,
    fontSize: 16,
    fontWeight: "600",
  },
  note: {
    marginTop: 12,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
  },
});
