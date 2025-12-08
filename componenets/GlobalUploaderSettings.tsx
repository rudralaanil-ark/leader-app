// components/Shared/GlobalUploaderSettings.tsx
import {
  GlobalUploader,
  globalUploaderService,
} from "@/app/services/globalUploaderService";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function GlobalUploaderSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<GlobalUploader>({
    name: "Admin",
    profileImage: null,
  });

  const isAdmin = user?.role === "admin";

  // Only admin can see this block
  if (!isAdmin) return null;

  useEffect(() => {
    const unsub = globalUploaderService.subscribe((val) => {
      setForm(val);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const onSave = async () => {
    try {
      await globalUploaderService.update(form);
      Alert.alert("Saved", "Global uploader identity updated.");
    } catch (err) {
      Alert.alert("Error", "Failed to save global identity.");
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Global Uploader Identity</Text>
      <Text style={styles.caption}>
        This name and picture will be shown to normal users for all posts and
        comments.
      </Text>

      <Text style={styles.label}>Display Name</Text>
      <TextInput
        value={form.name}
        onChangeText={(t) => setForm((p) => ({ ...p, name: t }))}
        style={styles.input}
        placeholder="Admin"
        placeholderTextColor={Colors.textMuted}
      />

      <Text style={styles.label}>Profile Image URL</Text>
      <TextInput
        value={form.profileImage ?? ""}
        onChangeText={(t) =>
          setForm((p) => ({ ...p, profileImage: t.trim() || null }))
        }
        style={styles.input}
        placeholder="https://..."
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
      />

      {/* You can later replace above URL input with an image picker + upload */}

      <TouchableOpacity
        onPress={onSave}
        style={[styles.button, !form.name.trim() && { opacity: 0.5 }]}
        disabled={!form.name.trim()}
      >
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Save Global Identity"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.lightCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  caption: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  label: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  input: {
    marginTop: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  button: {
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: Colors.buttonText,
    fontWeight: "600",
  },
});
