// import {
//   createEvent,
//   getEvent,
//   updateEvent,
// } from "@/app/(monitor)/(tabs)/api/events";
// import { uploadImageToCloudinary } from "@/app/api/uploadImage";
// import { useAuth } from "@/contexts/AuthContext";
// import Colors from "@/data/Colors";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import * as ImagePicker from "expo-image-picker";
// import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
// import { Timestamp } from "firebase/firestore";
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   BackHandler,
//   Image,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   ToastAndroid,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function AddEvent() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams<{ id?: string }>();
//   const isEdit = !!id;

//   const { user } = useAuth(); // ✅ single source of truth

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [venue, setVenue] = useState("");
//   const [date, setDate] = useState(new Date());
//   const [imageUri, setImageUri] = useState<string | null>(null);

//   const [loading, setLoading] = useState(false);
//   const [loadingInit, setLoadingInit] = useState(isEdit);

//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);

//   /* 🔙 Android hardware back */
//   useFocusEffect(
//     useCallback(() => {
//       const onBack = () => {
//         router.back();
//         return true;
//       };

//       const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
//       return () => sub.remove();
//     }, [])
//   );

//   /* 🔵 Load event when editing */
//   useEffect(() => {
//     if (isEdit && id) {
//       loadEvent(id);
//     } else {
//       setLoadingInit(false);
//     }
//   }, [id]);

//   const loadEvent = async (eventId: string) => {
//     try {
//       const data = await getEvent(eventId);
//       if (data) {
//         setTitle(data.title || "");
//         setDescription(data.description || "");
//         setVenue(data.venue || "");
//         if (data.dateTime?.toDate) setDate(data.dateTime.toDate());
//         if (data.imageUrl) setImageUri(data.imageUrl);
//       }
//     } catch (e) {
//       console.error("Load event error:", e);
//     } finally {
//       setLoadingInit(false);
//     }
//   };

//   /* 📸 Pick Image */
//   const pickImage = async () => {
//     const res = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!res.canceled) {
//       setImageUri(res.assets[0].uri);
//     }
//   };

//   /* 💾 Save Event */
//   const onSave = async () => {
//     if (!user) {
//       Platform.OS === "android" &&
//         ToastAndroid.show("Session expired!", ToastAndroid.BOTTOM);
//       return;
//     }

//     if (!title || !description || !venue) {
//       Platform.OS === "android" &&
//         ToastAndroid.show("Please fill all fields", ToastAndroid.BOTTOM);
//       return;
//     }

//     try {
//       setLoading(true);

//       let imageUrl: string | null = imageUri;

//       if (imageUri?.startsWith("file:")) {
//         const result: any = await uploadImageToCloudinary(imageUri);
//         imageUrl = result?.url || result?.secure_url || null;
//       }

//       const payload = {
//         title,
//         description,
//         venue,
//         imageUrl: imageUrl || null,
//         dateTime: Timestamp.fromDate(date),

//         // 🔐 author info
//         createdBy: user.uid,
//         createdByName: user.fullName,
//         role: user.role, // admin | monitor
//       };

//       if (isEdit && id) {
//         await updateEvent(id, payload);
//         Platform.OS === "android" &&
//           ToastAndroid.show("Event updated", ToastAndroid.BOTTOM);
//       } else {
//         await createEvent(payload);
//         Platform.OS === "android" &&
//           ToastAndroid.show("Event created", ToastAndroid.BOTTOM);
//       }

//       router.back();
//     } catch (e) {
//       console.error("Save event error:", e);
//       Platform.OS === "android" &&
//         ToastAndroid.show("Failed to save event", ToastAndroid.BOTTOM);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ⏳ Loader */
//   if (loadingInit) {
//     return (
//       <SafeAreaView style={styles.center}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </SafeAreaView>
//     );
//   }

//   /* ✅ UI (unchanged, safe for iOS/Android) */
//   return (
//     <SafeAreaView style={styles.safe}>
//       {/* 🔙 Top back button */}
//       <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//         <Ionicons name="arrow-back" size={24} color="#000" />
//       </TouchableOpacity>

//       <ScrollView
//         style={styles.container}
//         contentContainerStyle={{ paddingBottom: 40 }}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.header}>
//           {isEdit ? "Edit Event" : "Create Event"}
//         </Text>

//         <Text style={styles.label}>Event Title</Text>
//         <TextInput
//           style={styles.input}
//           value={title}
//           onChangeText={setTitle}
//           placeholder="Enter event title"
//         />

//         <Text style={styles.label}>Description</Text>
//         <TextInput
//           style={[styles.input, { height: 100 }]}
//           value={description}
//           multiline
//           onChangeText={setDescription}
//           placeholder="Enter description..."
//         />

//         <Text style={styles.label}>Venue</Text>
//         <TextInput
//           style={styles.input}
//           value={venue}
//           onChangeText={setVenue}
//           placeholder="Enter location / hall"
//         />

//         <Text style={styles.label}>Date & Time</Text>

//         <View style={styles.row}>
//           <TouchableOpacity
//             style={[styles.outline, { marginRight: 10 }]}
//             onPress={() => setShowDatePicker(true)}
//           >
//             <Ionicons
//               name="calendar-outline"
//               size={18}
//               color={Colors.primary}
//             />
//             <Text style={styles.outlineText}>{date.toLocaleDateString()}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.outline}
//             onPress={() => setShowTimePicker(true)}
//           >
//             <Ionicons name="time-outline" size={18} color={Colors.primary} />
//             <Text style={styles.outlineText}>
//               {date.toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {showDatePicker && (
//           <DateTimePicker
//             value={date}
//             mode="date"
//             onChange={(_, d) => {
//               setShowDatePicker(false);
//               if (d) setDate(d);
//             }}
//           />
//         )}

//         {showTimePicker && (
//           <DateTimePicker
//             value={date}
//             mode="time"
//             onChange={(_, d) => {
//               setShowTimePicker(false);
//               if (d) {
//                 const updated = new Date(date);
//                 updated.setHours(d.getHours());
//                 updated.setMinutes(d.getMinutes());
//                 setDate(updated);
//               }
//             }}
//           />
//         )}

//         <Text style={styles.label}>Event Image</Text>

//         {imageUri ? (
//           <TouchableOpacity onPress={pickImage}>
//             <Image source={{ uri: imageUri }} style={styles.image} />
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
//             <Ionicons name="image-outline" size={24} color="#666" />
//             <Text style={{ marginLeft: 8 }}>Pick Image</Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.saveText}>
//               {isEdit ? "Update Event" : "Create Event"}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* 🎨 Styles (safe for notches & status bar) */
// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: Colors.surface,
//   },
//   container: {
//     paddingHorizontal: 16,
//   },
//   backBtn: {
//     position: "absolute",
//     top: 12,
//     left: 16,
//     zIndex: 10,
//     backgroundColor: "#fff",
//     padding: 8,
//     borderRadius: 20,
//     elevation: 3,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: Colors.primary,
//     marginTop: 40,
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   label: {
//     fontWeight: "700",
//     marginTop: 12,
//   },
//   input: {
//     backgroundColor: Colors.card,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: 10,
//     padding: 12,
//     marginTop: 6,
//   },
//   row: {
//     flexDirection: "row",
//     marginVertical: 10,
//   },
//   outline: {
//     flex: 1,
//     flexDirection: "row",
//     borderWidth: 1,
//     borderColor: Colors.primary,
//     padding: 10,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   outlineText: {
//     marginLeft: 6,
//     color: Colors.primary,
//   },
//   imagePicker: {
//     flexDirection: "row",
//     borderWidth: 1,
//     borderStyle: "dashed",
//     borderColor: Colors.border,
//     padding: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 10,
//     marginTop: 8,
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     borderRadius: 10,
//     marginTop: 8,
//   },
//   saveBtn: {
//     marginTop: 24,
//     backgroundColor: Colors.primary,
//     padding: 14,
//     alignItems: "center",
//     borderRadius: 10,
//   },
//   saveText: {
//     color: Colors.textInverse,
//     fontWeight: "700",
//     fontSize: 16,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

import { uploadImageToCloudinary } from "@/app/api/uploadImage";
import { createEvent, getEvent, updateEvent } from "@/app/services/events";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function AddEvent() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const { user } = useAuth();
  const insets = useSafeAreaInsets(); // ✅ notch-safe spacing

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState(new Date());
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(isEdit);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  /* 🔙 Android hardware back */
  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        router.back();
        return true;
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
      return () => sub.remove();
    }, [])
  );

  /* 🔵 Load event when editing */
  useEffect(() => {
    if (isEdit && id) loadEvent(id);
    else setLoadingInit(false);
  }, [id]);

  const loadEvent = async (eventId: string) => {
    try {
      const data = await getEvent(eventId);
      if (data) {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setVenue(data.venue || "");
        if (data.dateTime?.toDate) setDate(data.dateTime.toDate());
        if (data.imageUrl) setImageUri(data.imageUrl);
      }
    } catch (e) {
      console.error("Load event error:", e);
    } finally {
      setLoadingInit(false);
    }
  };

  /* 📸 Pick Image */
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  /* 💾 Save Event */
  const onSave = async () => {
    if (!user) {
      Platform.OS === "android" &&
        ToastAndroid.show("Session expired!", ToastAndroid.BOTTOM);
      return;
    }

    if (!title || !description || !venue) {
      Platform.OS === "android" &&
        ToastAndroid.show("Please fill all fields", ToastAndroid.BOTTOM);
      return;
    }

    try {
      setLoading(true);

      let imageUrl: string | null = imageUri;
      if (imageUri?.startsWith("file:")) {
        const result: any = await uploadImageToCloudinary(imageUri);
        imageUrl = result?.url || result?.secure_url || null;
      }

      const payload = {
        title,
        description,
        venue,
        imageUrl: imageUrl || null,
        dateTime: Timestamp.fromDate(date),
        createdBy: user.uid,
        createdByName: user.fullName,
        role: user.role,
      };

      if (isEdit && id) {
        await updateEvent(id, payload);
        Platform.OS === "android" &&
          ToastAndroid.show("Event updated", ToastAndroid.BOTTOM);
      } else {
        await createEvent(payload);
        Platform.OS === "android" &&
          ToastAndroid.show("Event created", ToastAndroid.BOTTOM);
      }

      router.back();
    } catch (e) {
      console.error("Save event error:", e);
      Platform.OS === "android" &&
        ToastAndroid.show("Failed to save event", ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  /* ⏳ Loader */
  if (loadingInit) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* 🔙 Back button (notch-safe) */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 8 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* ⌨️ Keyboard-aware layout */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
              <Ionicons
                name="calendar-outline"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.outlineText}>
                {date.toLocaleDateString()}
              </Text>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    paddingHorizontal: 16,
  },
  backBtn: {
    position: "absolute",
    left: 16,
    zIndex: 20,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    elevation: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
    marginTop: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontWeight: "700",
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    marginVertical: 10,
  },
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
  outlineText: {
    marginLeft: 6,
    color: Colors.primary,
  },
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
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
  saveBtn: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    padding: 14,
    alignItems: "center",
    borderRadius: 10,
  },
  saveText: {
    color: Colors.textInverse,
    fontWeight: "700",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
