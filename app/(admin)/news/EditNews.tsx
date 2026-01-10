// app/(admin)/news/EditNews.tsx
import { uploadImageToCloudinary } from "@/app/api/uploadImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

import { getNews, updateNews } from "@/app/services/news";

export default function AdminEditNews() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const newsId = String(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const data = await getNews(newsId);
    if (data) {
      setTitle(data.title || "");
      setDescription(data.description || "");
      setImageUri(data.imageUrl || null);
    }
    setInitLoading(false);
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  const onUpdate = async () => {
    try {
      setLoading(true);

      let imageUrl = imageUri;

      if (imageUri?.startsWith("file:")) {
        imageUrl = await uploadImageToCloudinary(imageUri);
      }

      await updateNews(newsId, {
        title,
        description,
        imageUrl,
      });

      ToastAndroid.show("News updated!", ToastAndroid.BOTTOM);
      router.back();
    } catch (e) {
      console.log(e);
      ToastAndroid.show("Error updating", ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  if (initLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f7fb" }}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={26} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>✏️ Edit News</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            style={styles.input}
          />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            multiline
            style={[styles.input, { height: 120 }]}
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

          <TouchableOpacity style={styles.saveBtn} onPress={onUpdate}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 25,
    zIndex: 10,
    elevation: 3,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  scroll: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    backgroundColor: "#fff",
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginVertical: 12,
  },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
