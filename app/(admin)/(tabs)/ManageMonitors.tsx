import { createUserInFirestore } from "@/app/api/users";
// import { auth } from "@/configs/FirebaseConfig";
import { getSecondaryAuth } from "@/configs/FirebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useState } from "react";
// import { createUserWithEmailAndPassword, signOut } from "firebase/auth";

// import { auth } from "@/configs/FirebaseConfig";
import {
  ActivityIndicator,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

export default function ManageMonitors() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // current admin

  const handleCreateMonitor = async () => {
    if (!email || !password || !fullName) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.BOTTOM);
      return;
    }

    try {
      setLoading(true);

      // ✅ Use secondary auth to avoid logging out current admin
      const secondaryAuth = getSecondaryAuth();
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      const newUser = userCredential.user;

      // ✅ Save user data in Firestore with role: monitor
      await createUserInFirestore(
        newUser.uid,
        fullName,
        email,
        null,
        "monitor",
        user?.uid || null
      );

      ToastAndroid.show("Monitor created successfully ✅", ToastAndroid.BOTTOM);

      // ✅ Sign out from the secondary app to keep admin logged in
      await signOut(secondaryAuth);

      // Clear form
      setEmail("");
      setFullName("");
      setPassword("");
    } catch (error: any) {
      console.error(error);
      ToastAndroid.show("Error creating monitor", ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Create New Monitor
      </Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={{
          borderWidth: 1,
          borderColor: Colors.border,
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: Colors.border,
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: Colors.border,
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleCreateMonitor}
        disabled={loading}
        style={{
          backgroundColor: Colors.primary,
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Create Monitor
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
