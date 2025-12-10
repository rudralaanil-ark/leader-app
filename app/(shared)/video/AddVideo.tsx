import {
  // uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "@/app/api/uploadToCloudinary";
import { postsService } from "@/app/services/postsService";
import { useAuth } from "@/contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddVideo() {
  const [video, setVideo] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const role = user?.role ?? "user";

  if (role !== "admin" && role !== "monitor") {
    return (
      <View style={styles.deniedContainer}>
        <Text style={styles.deniedText}>
          You’re not allowed to upload videos
        </Text>
      </View>
    );
  }

  const pickVideo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!res.canceled) setVideo(res.assets[0].uri);
  };

  const pickThumbnail = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled) setThumbnail(res.assets[0].uri);
  };

  const handleUpload = async () => {
    if (!video || !user) return;

    setLoading(true);

    try {
      const videoUrl = await uploadVideoToCloudinary(video);
      const thumbUrl = thumbnail
        ? (await uploadImageToCloudinary(thumbnail))?.url
        : null;

      await postsService.createPost({
        type: "video",
        title,
        ownerId: user.uid,
        ownerName: user.fullName,
        ownerRole: role,
        media: [
          {
            type: "video",
            url: videoUrl,
            publicId: "",
            order: 0,
            thumbnailUrl: thumbUrl,
          },
        ],
        allowComments: true,
        allowLikes: true,
        allowShares: true,
      });

      alert("Uploaded successfully!");
      setTitle("");
      setVideo(null);
      setThumbnail(null);
    } catch (e) {
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Add Video</Text>

      <TextInput
        placeholder="Add caption..."
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>
          {video ? "Change Video" : "Pick Video"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickThumbnail}>
        <Text style={styles.buttonText}>
          {thumbnail ? "Change Thumbnail" : "Pick Thumbnail (optional)"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.uploadButton, loading && { opacity: 0.6 }]}
        disabled={loading}
        onPress={handleUpload}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>Upload</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: "#fff" },
  label: { fontSize: 18, fontWeight: "700", marginVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  uploadButton: {
    backgroundColor: "#34C759",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  uploadButtonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  deniedContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  deniedText: { color: "red", fontWeight: "600" },
});
