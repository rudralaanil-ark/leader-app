import { uploadImageToCloudinary } from "@/app/api/uploadImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNews } from "@/app/(monitor)/(tabs)/api/news";
import { getAuth } from "firebase/auth";

export default function AdminAddNews() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  const onSave = async () => {
    if (!title || !description) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.BOTTOM);
      return;
    }

    if (!user) {
      ToastAndroid.show("Login expired", ToastAndroid.BOTTOM);
      return;
    }

    try {
      setLoading(true);

      let imageUrl = imageUri;
      if (imageUri?.startsWith("file:")) {
        imageUrl = await uploadImageToCloudinary(imageUri);
      }

      await createNews(
        {
          title,
          description,
          imageUrl: imageUrl || null,
        },
        user.uid // createdBy (admin)
      );

      ToastAndroid.show("News created!", ToastAndroid.BOTTOM);
      router.back();
    } catch (e) {
      console.log(e);
      ToastAndroid.show("Error creating news", ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>📰 Create News</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <TextInput
            placeholder="Enter title..."
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Write description..."
            style={[styles.input, { height: 120 }]}
            value={description}
            multiline
            onChangeText={setDescription}
          />

          {imageUri ? (
            <TouchableOpacity onPress={pickImage}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Ionicons name="image-outline" size={30} color="#666" />
              <Text style={{ marginLeft: 10 }}>Pick Image</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Create</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f7fb" },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 25,
    elevation: 3,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 60,
    textAlign: "center",
  },
  scroll: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    elevation: 3,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    marginTop: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
