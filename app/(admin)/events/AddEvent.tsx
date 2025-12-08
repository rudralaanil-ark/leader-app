import { createEvent, updateEvent } from "@/app/(monitor)/(tabs)/api/events";
import { uploadImageToCloudinary } from "@/app/api/uploadImage";
import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { Timestamp, doc, getDoc } from "firebase/firestore";
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

export default function AddEvent() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const user = getAuth().currentUser;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState(new Date());
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(isEdit);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  /* 🔵 Load event when editing */
  useEffect(() => {
    if (isEdit && id) {
      loadEventData(id);
    } else {
      setLoadingInit(false);
    }
  }, [id]);

  const loadEventData = async (eventId: string) => {
    try {
      const snap = await getDoc(doc(db, "events", eventId));

      if (snap.exists()) {
        const ev: any = snap.data();
        setTitle(ev.title || "");
        setDescription(ev.description || "");
        setVenue(ev.venue || "");
        if (ev.dateTime?.toDate) setDate(ev.dateTime.toDate());
        if (ev.imageUrl) setImageUri(ev.imageUrl);
      }
    } catch (err) {
      console.error("Error loading event:", err);
    } finally {
      setLoadingInit(false);
    }
  };

  /* 📸 Pick Image */
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  /* 💾 Save Event (Create / Update) */
  const onSave = async () => {
    if (!title || !description || !venue) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.BOTTOM);
      return;
    }

    if (!user) {
      ToastAndroid.show("Session expired!", ToastAndroid.BOTTOM);
      return;
    }

    try {
      setLoading(true);

      let imageUrl = imageUri;
      if (imageUri?.startsWith("file:")) {
        imageUrl = await uploadImageToCloudinary(imageUri);
      }

      const basePayload = {
        title,
        description,
        venue,
        dateTime: Timestamp.fromDate(date),
        imageUrl: imageUrl || null,
        createdBy: user.uid,
        createdByName: user.displayName || "Admin",
      };

      if (isEdit && id) {
        /* ✏️ Update Event */
        await updateEvent(id, {
          ...basePayload,
          updatedAt: Timestamp.now(),
        });

        ToastAndroid.show("Event updated", ToastAndroid.BOTTOM);
      } else {
        /* 🆕 Create Event (add createdAt) */
        await createEvent({
          ...basePayload,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        ToastAndroid.show("Event created", ToastAndroid.BOTTOM);
      }

      router.back();
    } catch (err) {
      console.error(err);
      ToastAndroid.show("Failed to save event", ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  /* ⏳ Show loader while initializing */
  if (loadingInit) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  /* UI */
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        {isEdit ? "Edit Event" : "Create Event"}
      </Text>

      <Text style={styles.label}>Event Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter event title"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        multiline
        onChangeText={setDescription}
        placeholder="Enter description..."
      />

      <Text style={styles.label}>Venue</Text>
      <TextInput
        style={styles.input}
        value={venue}
        onChangeText={setVenue}
        placeholder="Enter location / hall"
      />

      <Text style={styles.label}>Date & Time</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.outline, { marginRight: 10 }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
          <Text style={styles.outlineText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outline}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons name="time-outline" size={18} color={Colors.primary} />
          <Text style={styles.outlineText}>
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pickers */}
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
              const updated = new Date(date);
              updated.setHours(d.getHours());
              updated.setMinutes(d.getMinutes());
              setDate(updated);
            }
          }}
        />
      )}

      {/* Image */}
      <Text style={styles.label}>Event Image</Text>

      {imageUri ? (
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="#666" />
          <Text style={{ marginLeft: 8 }}>Pick Image</Text>
        </TouchableOpacity>
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
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

/* 🌈 Styles */
const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: Colors.surface },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
    marginVertical: 16,
    textAlign: "center",
  },
  label: { fontWeight: "700", marginTop: 12 },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },
  row: { flexDirection: "row", marginVertical: 10 },
  outline: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineText: { marginLeft: 6, color: Colors.primary },
  imagePicker: {
    flexDirection: "row",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.border,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 8,
  },
  image: { width: "100%", height: 200, borderRadius: 10, marginTop: 8 },
  saveBtn: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: 14,
    alignItems: "center",
    borderRadius: 10,
  },
  saveText: { color: Colors.textInverse, fontWeight: "700", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
