// monitor/(tabs)/AddEvent.tsx
import { uploadImageToCloudinary } from "@/app/api/uploadImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { createEvent, getEvent, updateEvent } from "./api/events";

export default function AddEvent() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!params?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(isEdit);

  // ✅ Handle Android hardware back button (navigate to EventList)
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/(monitor)/(tabs)/EventList");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [router])
  );

  // ✅ Reset form when adding a new event
  useFocusEffect(
    useCallback(() => {
      if (!params.id) {
        setTitle("");
        setDescription("");
        setVenue("");
        setImageUri(null);
        setDate(new Date());
      }
    }, [params.id])
  );

  useEffect(() => {
    if (params.id) {
      loadEvent(params.id);
    } else {
      setLoadingInit(false);
    }
  }, [params.id]);

  const loadEvent = async (eventId: string) => {
    try {
      const data = await getEvent(eventId);
      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setVenue(data.venue);
        if (data.dateTime?.toDate) setDate(data.dateTime.toDate());
        if (data.imageUrl) setImageUri(data.imageUrl);
      }
    } catch (err) {
      console.error("Failed to load event:", err);
    } finally {
      setLoadingInit(false);
    }
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleTimeChange = (_: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const updated = new Date(date);
      updated.setHours(selectedTime.getHours());
      updated.setMinutes(selectedTime.getMinutes());
      setDate(updated);
    }
  };

  const onSave = async () => {
    if (!title || !description || !venue) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.BOTTOM);
      return;
    }
    try {
      setLoading(true);
      let imageUrl = imageUri;
      if (imageUri?.startsWith("file:")) {
        imageUrl = await uploadImageToCloudinary(imageUri);
      }
      const payload = {
        title,
        description,
        venue,
        dateTime: Timestamp.fromDate(date),
        imageUrl: imageUrl || null,
      };
      if (isEdit && params.id) {
        await updateEvent(params.id, payload);
        ToastAndroid.show("Event updated", ToastAndroid.BOTTOM);
      } else {
        await createEvent(payload);
        ToastAndroid.show("Event created", ToastAndroid.BOTTOM);
      }
      router.replace("/(monitor)/(tabs)/EventList");
    } catch (e) {
      console.error(e);
      ToastAndroid.show("Error saving event", ToastAndroid.BOTTOM);
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
    <ScrollView style={{ padding: 15 }}>
      <View style={{ paddingTop: 40, paddingBottom: 10 }}>
        <Text style={styles.heading}>
          {isEdit ? "Edit Event" : "Create Event"}
        </Text>
      </View>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Event title"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Short description"
        multiline
      />

      <Text style={styles.label}>Venue / Location</Text>
      <TextInput
        style={styles.input}
        value={venue}
        onChangeText={setVenue}
        placeholder="Venue (e.g., Hall A)"
      />

      <Text style={styles.label}>Date & Time</Text>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity
          style={[styles.buttonOutline, { flex: 1, marginRight: 6 }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={18} color="#007AFF" />
          <Text style={{ color: "#007AFF", marginLeft: 5 }}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonOutline, { flex: 1 }]}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons name="time-outline" size={18} color="#007AFF" />
          <Text style={{ color: "#007AFF", marginLeft: 5 }}>
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
          display="default"
          onChange={handleDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Text style={styles.label}>Image (optional)</Text>
      {imageUri ? (
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="#666" />
          <Text style={{ marginLeft: 5 }}>Pick Image</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={onSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>
            {isEdit ? "Update Event" : "Create Event"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 10,
  },
  label: { fontWeight: "600", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonOutline: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#aaa",
    borderStyle: "dashed",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 15,
  },
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 15 },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
