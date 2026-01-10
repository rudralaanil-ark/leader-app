// monitor/(tabs)/AddEvent.tsx
import { uploadImageToCloudinary } from "@/app/api/uploadImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
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
import { createEvent, getEvent, updateEvent } from "../../services/events";

export default function AddEvent() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  console.log("[ADD EVENT] Screen loaded. Edit mode:", isEdit, "ID:", id);

  const user = getAuth().currentUser;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(isEdit);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Handle Android hardware back button
  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        console.log("[ADD EVENT] Back pressed → EventList");
        router.replace("/(monitor)/(tabs)/EventList");
        return true;
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
      return () => sub.remove();
    }, [])
  );

  // Reset form on mode switch
  useFocusEffect(
    useCallback(() => {
      if (!isEdit) {
        console.log("[ADD EVENT] Resetting form");
        setTitle("");
        setDescription("");
        setVenue("");
        setImageUri(null);
        setDate(new Date());
      }
    }, [isEdit])
  );

  // Load event when editing
  useEffect(() => {
    if (isEdit && id) {
      console.log("[ADD EVENT] Fetching event:", id);
      loadEvent(id);
    } else {
      setLoadingInit(false);
    }
  }, [id]);

  const loadEvent = async (eventId: string) => {
    try {
      const data = await getEvent(eventId);
      console.log("[ADD EVENT] Loaded event:", data);

      if (data) {
        setTitle(String(data.title ?? ""));
        setDescription(String(data.description ?? ""));
        setVenue(String(data.venue ?? ""));
        if (data.dateTime?.toDate) setDate(data.dateTime.toDate());
        if (data.imageUrl) setImageUri(String(data.imageUrl));
      }
    } catch (err) {
      console.log("[ADD EVENT] Error loading:", err);
    } finally {
      setLoadingInit(false);
    }
  };

  const pickImage = async () => {
    console.log("[ADD EVENT] Image picker opened");
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      console.log("[ADD EVENT] Image selected:", res.assets[0].uri);
      setImageUri(res.assets[0].uri);
    }
  };

  const onSave = async () => {
    console.log("[ADD EVENT] Save clicked");

    if (!user) {
      ToastAndroid.show("Login expired!", ToastAndroid.BOTTOM);
      return;
    }
    if (!title || !description || !venue) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.BOTTOM);
      return;
    }

    try {
      setLoading(true);

      let imageUrl: string | null = imageUri;

      // Upload new image → extract only URL
      if (imageUri?.startsWith("file:")) {
        console.log("[ADD EVENT] Uploading image...");
        const result = await uploadImageToCloudinary(imageUri);
        console.log("[ADD EVENT] Cloudinary response:", result);

        imageUrl = result?.url ?? null;
      }

      // Always convert to string
      imageUrl = imageUrl ? String(imageUrl) : "";

      const payload = {
        title: String(title),
        description: String(description),
        venue: String(venue),
        imageUrl: imageUrl, // ← FINAL FIX HERE
        dateTime: Timestamp.fromDate(date),
      };

      console.log("[ADD EVENT] Final Payload:", payload);

      if (isEdit && id) {
        console.log("[ADD EVENT] Updating event...");
        await updateEvent(id, payload);
        ToastAndroid.show("Event Updated!", ToastAndroid.BOTTOM);
      } else {
        console.log("[ADD EVENT] Creating event...");
        await createEvent(
          {
            ...payload,
            createdBy: user.uid,
            createdByName: user.displayName || "Monitor",
            createdByImage: user.photoURL || null,
          },
          user.uid
        );
        ToastAndroid.show("Event Created!", ToastAndroid.BOTTOM);
      }

      router.replace("/(monitor)/(tabs)/EventList");
    } catch (err) {
      console.log("[ADD EVENT] Save error:", err);
      ToastAndroid.show("Save failed", ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  if (loadingInit)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace("/(monitor)/(tabs)/EventList")}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>
        {isEdit ? "✏️ Edit Event" : "📅 Add Event"}
      </Text>

      <ScrollView style={styles.scroll}>
        <View style={styles.card}>
          <TextInput
            placeholder="Event Title"
            value={String(title ?? "")}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            value={String(description ?? "")}
            multiline
            style={[styles.input, { height: 100 }]}
            onChangeText={setDescription}
          />

          <TextInput
            placeholder="Venue"
            value={String(venue ?? "")}
            onChangeText={setVenue}
            style={styles.input}
          />

          {/* DATE & TIME */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color="#007AFF" />
              <Text style={styles.outlineText}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={18} color="#007AFF" />
              <Text style={styles.outlineText}>
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              onChange={(_, d) => {
                setShowDatePicker(false);
                if (d) setDate(d);
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              onChange={(_, d) => {
                setShowTimePicker(false);
                if (d) {
                  const newDate = new Date(date);
                  newDate.setHours(d.getHours());
                  newDate.setMinutes(d.getMinutes());
                  setDate(newDate);
                }
              }}
            />
          )}

          {/* IMAGE PICKER */}
          {imageUri ? (
            <TouchableOpacity onPress={pickImage}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Ionicons name="image-outline" size={26} color="#666" />
              <Text style={{ marginLeft: 8, color: "#666" }}>Pick Image</Text>
            </TouchableOpacity>
          )}

          {/* SAVE BUTTON */}
          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>
                {isEdit ? "Update Event" : "Create Event"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ----------------------- STYLES --------------------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f7fb" },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    zIndex: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginTop: 30,
    alignSelf: "center",
    marginBottom: 10,
  },
  scroll: { paddingHorizontal: 16, marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 15,
  },
  row: { flexDirection: "row", marginBottom: 12 },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  outlineText: { marginLeft: 4, color: "#007AFF" },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderStyle: "dashed",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  image: { width: "100%", height: 220, borderRadius: 12 },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
