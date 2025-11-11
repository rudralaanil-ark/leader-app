import { uploadImageToCloudinary } from "@/app/api/uploadImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
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
import { createNews, getNews, updateNews } from "./api/news";

export default function AddNews() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(isEdit);

  // 🧩 Dynamic height states
  const [titleHeight, setTitleHeight] = useState(48);
  const [descHeight, setDescHeight] = useState(100);

  // ✅ Android Back Button → Always go to NewsList
  useEffect(() => {
    const backAction = () => {
      router.replace("/(monitor)/(tabs)/NewsList");
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => subscription.remove();
  }, [router]);

  // ✅ Load existing news if editing
  useEffect(() => {
    if (isEdit && id) {
      loadNews(id);
    }
  }, [id]);

  const loadNews = async (newsId: string) => {
    try {
      const data = await getNews(newsId);
      if (data) {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setImageUri(data.imageUrl || null);
      }
    } catch (err) {
      console.error("Error loading news:", err);
    } finally {
      setLoadingInit(false);
    }
  };

  // ✅ Clear form when adding new
  useFocusEffect(
    useCallback(() => {
      if (!isEdit) {
        setTitle("");
        setDescription("");
        setImageUri(null);
      }
    }, [isEdit])
  );

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

    try {
      setLoading(true);
      let imageUrl = imageUri;
      if (imageUri?.startsWith("file:")) {
        imageUrl = await uploadImageToCloudinary(imageUri);
      }

      const payload = { title, description, imageUrl: imageUrl || null };

      if (isEdit && id) {
        await updateNews(id, payload);
        ToastAndroid.show("News updated", ToastAndroid.BOTTOM);
      } else {
        await createNews(payload);
        ToastAndroid.show("News created", ToastAndroid.BOTTOM);
      }

      router.replace("/(monitor)/(tabs)/NewsList");
    } catch (e) {
      console.error(e);
      ToastAndroid.show("Error saving news", ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  if (loadingInit)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace("/(monitor)/(tabs)/NewsList")}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* 📰 Title Header */}
      <Text style={styles.headerText}>
        {isEdit ? "✏️ Update News" : "📰 Add News"}
      </Text>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Title */}
          <TextInput
            style={[styles.input, { height: titleHeight }]}
            placeholder="Enter News Title"
            multiline
            value={title}
            onChangeText={setTitle}
            onContentSizeChange={(e) =>
              setTitleHeight(Math.max(48, e.nativeEvent.contentSize.height))
            }
          />

          {/* Description */}
          <TextInput
            style={[styles.input, { height: descHeight }]}
            multiline
            placeholder="Write a short description..."
            value={description}
            onChangeText={setDescription}
            onContentSizeChange={(e) =>
              setDescHeight(Math.max(100, e.nativeEvent.contentSize.height))
            }
          />

          {/* Image Picker */}
          {imageUri ? (
            <TouchableOpacity onPress={pickImage}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Ionicons name="image-outline" size={28} color="#666" />
              <Text style={{ marginLeft: 8, color: "#666", fontSize: 15 }}>
                Choose Image
              </Text>
            </TouchableOpacity>
          )}

          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>
                {isEdit ? "Update News" : "Create News"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginTop: 30,
    alignSelf: "center",
    marginBottom: 14,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 14,
    fontSize: 15,
    textAlignVertical: "top", // ensures multiline text aligns top
  },
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "#fafafa",
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
    elevation: 2,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
