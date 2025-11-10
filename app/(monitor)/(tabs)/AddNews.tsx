import uploadImageToCloudinary from "@/app/api/uploadImage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";

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

const BACKEND_URL = "http://10.141.73.170:8080"; // ✅ Update your backend IP

export default function AddNews() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Clear form fields every time screen is opened
      setTitle("");
      setDescription("");
      setCategory("");
      setImageUri(null);
    }, [])
  );

  // Choose image from gallery or camera
  const handleImagePick = async (fromCamera = false) => {
    const permissionResult = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow access to continue.");
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
        });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Upload and submit form
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Missing info", "Please fill in all required fields.");
      return;
    }

    setUploading(true);
    try {
      const user = getAuth().currentUser;
      const token = await user?.getIdToken();
      let imageUrl = "";

      if (imageUri) {
        setImageUploading(true);
        imageUrl = await uploadImageToCloudinary(imageUri);
        setImageUploading(false);
      }

      const response = await fetch(`${BACKEND_URL}/news/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category: category || "General",
          imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to add news");

      Alert.alert("✅ Success", data.message || "News added successfully!");
      router.push("/(monitor)/(tabs)/NewsList");
    } catch (err: any) {
      console.error("News upload failed:", err);
      Alert.alert("❌ Error", err.message || "Something went wrong.");
    } finally {
      setUploading(false);
      setImageUploading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        backgroundColor: "#f9f9f9",
        flexGrow: 1,
      }}
    >
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 15 }}>
        📰 Add News
      </Text>

      {/* Title */}
      <TextInput
        placeholder="Enter news title"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          fontSize: 16,
          marginBottom: 10,
        }}
      />

      {/* Description */}
      <TextInput
        placeholder="Enter detailed description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          fontSize: 15,
          height: 130,
          textAlignVertical: "top",
          marginBottom: 10,
        }}
      />

      {/* Category Input */}
      <TextInput
        placeholder="Category (e.g., Sports, Politics, Tech)"
        value={category}
        onChangeText={setCategory}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          fontSize: 15,
          marginBottom: 10,
        }}
      />

      {/* Image Picker Section */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 10 }}>
          Attach an Image
        </Text>

        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 10,
              marginBottom: 10,
            }}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="image-outline" size={60} color="#aaa" />
        )}

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() => handleImagePick(false)}
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#eee",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="images-outline" size={20} color="#007bff" />
            <Text style={{ marginLeft: 6 }}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleImagePick(true)}
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#eee",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="camera-outline" size={20} color="#007bff" />
            <Text style={{ marginLeft: 6 }}>Camera</Text>
          </TouchableOpacity>
        </View>

        {imageUploading && (
          <View style={{ marginTop: 10 }}>
            <ActivityIndicator size="small" color="#007bff" />
            <Text>Uploading image...</Text>
          </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        disabled={uploading}
        onPress={handleSubmit}
        style={{ borderRadius: 10, overflow: "hidden", marginTop: 10 }}
      >
        <LinearGradient
          colors={["#007bff", "#0056d2"]}
          start={[0, 0]}
          end={[1, 1]}
          style={{
            padding: 15,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "bold" }}>
              Post News
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}
