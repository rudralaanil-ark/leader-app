import uploadImageToCloudinary from "@/app/api/uploadImage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BACKEND_URL = "http://10.141.73.170:8080"; // ✅ your backend IP

export default function EditNews() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, title, description, imageUrl } = params;

  const [newsTitle, setNewsTitle] = useState("");
  const [newsDesc, setNewsDesc] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // ✅ Function to load the correct data
  const initializeData = useCallback(() => {
    if (title && description) {
      setNewsTitle(title as string);
      setNewsDesc(description as string);
      setImageUri(imageUrl ? (imageUrl as string) : null);
      setInitializing(false);
    } else {
      fetchNewsById();
    }
  }, [id, title, description, imageUrl]);

  // ✅ Reload when params (id) change
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // ✅ Reload when screen regains focus
  useFocusEffect(
    useCallback(() => {
      initializeData();
    }, [initializeData])
  );

  // ✅ Fetch news by ID (in case no params passed)
  const fetchNewsById = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/news/${id}`);
      const data = await res.json();
      setNewsTitle(data.title);
      setNewsDesc(data.description);
      setImageUri(data.imageUrl);
    } catch (err) {
      console.error("Error loading news:", err);
      Alert.alert("Error", "Failed to load news details.");
    } finally {
      setInitializing(false);
    }
  };

  // 🖼️ Pick new image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // 💾 Update news
  const handleUpdate = async () => {
    if (!newsTitle.trim() || !newsDesc.trim()) {
      Alert.alert("Validation", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      let newImageUrl = imageUri;
      if (imageUri && !imageUri.startsWith("http")) {
        newImageUrl = await uploadImageToCloudinary(imageUri);
      }

      const res = await fetch(`${BACKEND_URL}/news/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newsTitle,
          description: newsDesc,
          imageUrl: newImageUrl,
        }),
      });

      if (res.ok) {
        Alert.alert("✅ Success", "News updated successfully!", [
          {
            text: "OK",
            onPress: () => router.push("/(monitor)/(tabs)/NewsList"),
          },
        ]);
      } else {
        const errData = await res.json();
        Alert.alert("❌ Error", errData.message || "Failed to update news.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      Alert.alert("Error", "Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, color: "#555" }}>Loading news...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        backgroundColor: "#fff",
        flexGrow: 1,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 15 }}>
        ✏️ Edit News
      </Text>

      {/* Title */}
      <TextInput
        placeholder="News Title"
        value={newsTitle}
        onChangeText={setNewsTitle}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
          fontSize: 16,
        }}
      />

      {/* Description */}
      <TextInput
        placeholder="News Description"
        value={newsDesc}
        onChangeText={setNewsDesc}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          height: 130,
          fontSize: 15,
          textAlignVertical: "top",
          marginBottom: 10,
        }}
      />

      {/* Image */}
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: 180,
            borderRadius: 8,
            marginBottom: 10,
          }}
        />
      ) : (
        <View
          style={{
            height: 180,
            borderRadius: 8,
            backgroundColor: "#eee",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Ionicons name="image-outline" size={50} color="#aaa" />
          <Text style={{ color: "#aaa", marginTop: 8 }}>No image selected</Text>
        </View>
      )}

      {/* Change Image */}
      <TouchableOpacity
        onPress={pickImage}
        style={{
          backgroundColor: "#E3F2FD",
          padding: 10,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Ionicons name="image-outline" size={20} color="#007bff" />
        <Text style={{ color: "#007bff", fontWeight: "500" }}>
          Change Image
        </Text>
      </TouchableOpacity>

      {/* Update Button */}
      <TouchableOpacity
        onPress={handleUpdate}
        disabled={loading}
        style={{
          backgroundColor: "#007bff",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Update News
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
