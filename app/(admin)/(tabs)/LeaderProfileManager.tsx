// // app/(admin)/(tabs)/LeaderProfileManager.tsx
// import { uploadImageToCloudinary } from "@/app/api/uploadImage";
// import {
//   LeaderProfile,
//   leaderProfileService,
// } from "@/app/services/leaderProfileService";
// import Colors from "@/data/Colors";
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
// import React, { useEffect, useState } from "react";
// import {
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function LeaderProfileManager() {
//   const [data, setData] = useState<LeaderProfile | null | undefined>(undefined);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [imageChanged, setImageChanged] = useState(false);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     leaderProfileService.getOnce().then(setData);
//   }, []);

//   if (data === undefined) {
//     return <Text style={{ padding: 20 }}>Loading...</Text>;
//   }

//   if (data === null) {
//     return (
//       <View style={{ padding: 20 }}>
//         <TouchableOpacity
//           style={styles.primaryBtn}
//           onPress={() =>
//             setData({
//               name: "",
//               title: "",
//               imageUrl: "",
//               about: "",
//               achievements: [],
//               contact: { email: "", phone: "", address: "" },
//             })
//           }
//         >
//           <Text style={styles.primaryText}>Create Leader Profile</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   /* ================= IMAGE PICK ================= */

//   const pickImage = async () => {
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       // aspect: [3, 4],
//       quality: 0.85,
//     });

//     if (!res.canceled) {
//       setPreviewImage(res.assets[0].uri);
//       setImageChanged(true);
//     }
//   };

//   /* ================= SAVE ================= */

//   const save = async () => {
//     try {
//       setSaving(true);

//       let imageUrl = data.imageUrl;
//       if (imageChanged && previewImage) {
//         imageUrl = await uploadImageToCloudinary(previewImage);
//       }

//       await leaderProfileService.save({ ...data, imageUrl });

//       setImageChanged(false);
//       setPreviewImage(null);

//       Alert.alert("Success", "Profile updated successfully");
//     } catch (e: any) {
//       Alert.alert("Error", e?.message ?? "Failed to save profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scroll}
//         >
//           {/* ================= IMAGE CARD ================= */}
//           <View style={styles.imageCard}>
//             <Image
//               source={{
//                 uri: previewImage || data.imageUrl || undefined,
//               }}
//               style={styles.image}
//             />

//             <TouchableOpacity style={styles.imageEditBtn} onPress={pickImage}>
//               <Ionicons name="camera" size={20} color="#fff" />
//               <Text style={styles.imageEditText}>Change Photo</Text>
//             </TouchableOpacity>
//           </View>

//           {/* ================= BASIC INFO ================= */}
//           <Card title="Basic Information">
//             <Input
//               label="Name"
//               value={data.name}
//               onChange={(v) => setData({ ...data, name: v })}
//             />
//             <Input
//               label="Title"
//               value={data.title}
//               onChange={(v) => setData({ ...data, title: v })}
//             />
//           </Card>

//           {/* ================= ABOUT ================= */}
//           <Card title="About Leader">
//             <Input
//               multiline
//               value={data.about}
//               onChange={(v) => setData({ ...data, about: v })}
//             />
//           </Card>

//           {/* ================= ACHIEVEMENTS ================= */}
//           <Card title="Achievements">
//             {data.achievements.map((a, i) => (
//               <Input
//                 key={i}
//                 value={a}
//                 onChange={(v) => {
//                   const arr = [...data.achievements];
//                   arr[i] = v;
//                   setData({ ...data, achievements: arr });
//                 }}
//               />
//             ))}

//             <TouchableOpacity
//               onPress={() =>
//                 setData({
//                   ...data,
//                   achievements: [...data.achievements, ""],
//                 })
//               }
//             >
//               <Text style={styles.add}>+ Add Achievement</Text>
//             </TouchableOpacity>
//           </Card>

//           {/* ================= CONTACT ================= */}
//           <Card title="Contact Details">
//             <Input
//               label="Email"
//               value={data.contact.email}
//               onChange={(v) =>
//                 setData({
//                   ...data,
//                   contact: { ...data.contact, email: v },
//                 })
//               }
//             />
//             <Input
//               label="Phone"
//               value={data.contact.phone}
//               onChange={(v) =>
//                 setData({
//                   ...data,
//                   contact: { ...data.contact, phone: v },
//                 })
//               }
//             />
//             <Input
//               label="Address"
//               value={data.contact.address}
//               onChange={(v) =>
//                 setData({
//                   ...data,
//                   contact: { ...data.contact, address: v },
//                 })
//               }
//             />
//           </Card>
//         </ScrollView>

//         {/* ================= SAVE BAR ================= */}
//         <View style={styles.saveBar}>
//           <TouchableOpacity
//             style={styles.primaryBtn}
//             onPress={save}
//             disabled={saving}
//           >
//             <Text style={styles.primaryText}>
//               {saving ? "Saving..." : "Save Changes"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// /* ================= REUSABLE ================= */

// const Card = ({ title, children }: any) => (
//   <View style={styles.card}>
//     <Text style={styles.cardTitle}>{title}</Text>
//     {children}
//   </View>
// );

// const Input = ({ label, value, onChange, multiline }: any) => (
//   <View style={{ marginBottom: 14 }}>
//     {label && <Text style={styles.label}>{label}</Text>}
//     <TextInput
//       value={value}
//       onChangeText={onChange}
//       multiline={multiline}
//       style={[styles.input, multiline && { height: 120 }]}
//       placeholderTextColor={Colors.textMuted}
//     />
//   </View>
// );

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: Colors.background },

//   scroll: { padding: 16, paddingBottom: 120 },

//   imageCard: {
//     height: 320,
//     borderRadius: 28,
//     overflow: "hidden",
//     marginBottom: 20,
//     backgroundColor: Colors.surface,
//     elevation: 6,
//     shadowColor: Colors.shadow,
//     shadowOpacity: 0.2,
//     shadowRadius: 12,
//   },
//   image: { width: "100%", height: "100%" },
//   imageEditBtn: {
//     position: "absolute",
//     bottom: 16,
//     right: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
//   imageEditText: { color: "#fff", fontWeight: "700" },

//   card: {
//     backgroundColor: Colors.card,
//     borderRadius: 20,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 4,
//     shadowColor: Colors.shadow,
//     shadowOpacity: 0.12,
//     shadowRadius: 8,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     marginBottom: 12,
//     color: Colors.textPrimary,
//   },

//   label: {
//     fontWeight: "700",
//     marginBottom: 6,
//     color: Colors.textSecondary,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: 14,
//     padding: 12,
//     backgroundColor: "#fff",
//     fontSize: 15,
//   },

//   add: {
//     color: Colors.primary,
//     fontWeight: "800",
//     marginTop: 8,
//   },

//   saveBar: {
//     padding: 16,
//     backgroundColor: Colors.background,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//   },

//   primaryBtn: {
//     backgroundColor: Colors.primary,
//     paddingVertical: 16,
//     borderRadius: 18,
//     alignItems: "center",
//   },
//   primaryText: {
//     color: "#fff",
//     fontWeight: "800",
//     fontSize: 16,
//   },
// });

// app/(admin)/(tabs)/LeaderProfileManager.tsx

import { uploadImageToCloudinary } from "@/app/api/uploadImage";
import {
  LeaderProfile,
  leaderProfileService,
} from "@/app/services/leaderProfileService";
import Colors from "@/data/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LeaderProfileManager() {
  const [data, setData] = useState<LeaderProfile | null | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    leaderProfileService.getOnce().then(setData);
  }, []);

  /* ================= LOADING ================= */

  if (data === undefined) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  /* ================= CREATE PROFILE ================= */

  if (data === null) {
    return (
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() =>
            setData({
              name: "",
              title: "",
              imageUrl: {
                url: "",
                publicId: "",
              },
              about: "",
              achievements: [],
              contact: {
                email: "",
                phone: "",
                address: "",
              },
            })
          }
        >
          <Text style={styles.primaryText}>Create Leader Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ================= IMAGE PICK ================= */

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });

    if (!res.canceled) {
      setPreviewImage(res.assets[0].uri);
      setImageChanged(true);
    }
  };

  /* ================= SAVE ================= */

  const save = async () => {
    try {
      setSaving(true);

      let imageUrl = data.imageUrl;

      if (imageChanged && previewImage) {
        const uploaded = await uploadImageToCloudinary(previewImage);
        imageUrl = uploaded; // must be { url, publicId }
      }

      await leaderProfileService.save({
        ...data,
        imageUrl,
      });

      setPreviewImage(null);
      setImageChanged(false);

      Alert.alert("Success", "Profile updated successfully");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* IMAGE */}
          <View style={styles.imageCard}>
            <Image
              source={
                previewImage
                  ? { uri: previewImage }
                  : data.imageUrl?.url
                  ? { uri: data.imageUrl.url }
                  : require("@/assets/images/placeholder.png")
              }
              style={styles.image}
            />

            <TouchableOpacity style={styles.imageEditBtn} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.imageEditText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <Card title="Basic Info">
            <Input
              label="Name"
              value={data.name}
              onChange={(v) => setData({ ...data, name: v })}
            />
            <Input
              label="Title"
              value={data.title}
              onChange={(v) => setData({ ...data, title: v })}
            />
          </Card>

          <Card title="About">
            <Input
              multiline
              value={data.about}
              onChange={(v) => setData({ ...data, about: v })}
            />
          </Card>

          <Card title="Achievements">
            {data.achievements.map((a, i) => (
              <Input
                key={i}
                value={a}
                onChange={(v) => {
                  const arr = [...data.achievements];
                  arr[i] = v;
                  setData({ ...data, achievements: arr });
                }}
              />
            ))}

            <TouchableOpacity
              onPress={() =>
                setData({
                  ...data,
                  achievements: [...data.achievements, ""],
                })
              }
            >
              <Text style={styles.add}>+ Add Achievement</Text>
            </TouchableOpacity>
          </Card>

          <Card title="Contact">
            <Input
              label="Email"
              value={data.contact.email}
              onChange={(v) =>
                setData({
                  ...data,
                  contact: { ...data.contact, email: v },
                })
              }
            />
            <Input
              label="Phone"
              value={data.contact.phone}
              onChange={(v) =>
                setData({
                  ...data,
                  contact: { ...data.contact, phone: v },
                })
              }
            />
            <Input
              label="Address"
              value={data.contact.address}
              onChange={(v) =>
                setData({
                  ...data,
                  contact: { ...data.contact, address: v },
                })
              }
            />
          </Card>
        </ScrollView>

        <View style={styles.saveBar}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={save}
            disabled={saving}
          >
            <Text style={styles.primaryText}>
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= HELPERS ================= */

const Card = ({ title, children }: any) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const Input = ({ label, value, onChange, multiline }: any) => (
  <View style={{ marginBottom: 12 }}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      value={value}
      onChangeText={onChange}
      multiline={multiline}
      style={[styles.input, multiline && { height: 120 }]}
    />
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 120 },

  imageCard: {
    height: 320,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 20,
  },

  image: { width: "100%", height: "100%" },

  imageEditBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 20,
    flexDirection: "row",
    gap: 6,
  },

  imageEditText: { color: "#fff", fontWeight: "700" },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: { fontSize: 16, fontWeight: "800", marginBottom: 10 },

  label: { fontWeight: "700", marginBottom: 4 },

  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#fff",
  },

  add: { color: Colors.primary, fontWeight: "800" },

  saveBar: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },

  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  primaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
