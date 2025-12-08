// import React, { useState } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import Colors from "@/data/Colors";
// import { useAuth } from "@/contexts/AuthContext";
// import { pollService } from "@/app/services/pollService";
// import uuid from "react-native-uuid";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { useRouter } from "expo-router";

// export default function CreatePoll() {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [question, setQuestion] = useState("");
//   const [pollType, setPollType] = useState<"single" | "multiple" | "rating">(
//     "single"
//   );
//   const [allowRevote, setAllowRevote] = useState(true);
//   const [options, setOptions] = useState([
//     { id: uuid.v4().toString(), label: "" },
//     { id: uuid.v4().toString(), label: "" },
//   ]);
//   const [expiresAt, setExpiresAt] = useState<Date | null>(null);
//   const [showPicker, setShowPicker] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const handleAddOption = () => {
//     setOptions([...options, { id: uuid.v4().toString(), label: "" }]);
//   };

//   const handleRemoveOption = (id: string) => {
//     if (options.length <= 2) {
//       Alert.alert("Minimum 2 options required");
//       return;
//     }
//     setOptions(options.filter((opt) => opt.id !== id));
//   };

//   const handleSubmit = async () => {
//     if (!question.trim()) {
//       Alert.alert("Enter a question");
//       return;
//     }
//     const cleanOptions = options.filter(
//       (o) => o.label && o.label.trim().length > 0
//     );
//     if (cleanOptions.length < 2) {
//       Alert.alert("Minimum 2 valid options required");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       await pollService.createPoll({
//         question,
//         pollType,
//         options: cleanOptions,
//         allowRevote,
//         expiresAt,
//         createdBy: {
//           uid: user?.uid ?? "",
//           name: user?.fullName ?? "Unknown",
//           role: user?.role,
//           profileImage: user?.profileImage ?? null,
//         },
//       });

//       Alert.alert("Success", "Poll created successfully", [
//         {
//           text: "OK",
//           onPress: () => router.back(),
//         },
//       ]);
//     } catch (e) {
//       console.log(e);
//       Alert.alert("Failed", "Error creating poll");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.heading}>Create Poll</Text>

//       <Text style={styles.label}>Question</Text>
//       <TextInput
//         value={question}
//         onChangeText={setQuestion}
//         placeholder="Ask your opinion..."
//         placeholderTextColor={Colors.textMuted}
//         style={styles.textInput}
//       />

//       <Text style={styles.label}>Poll Type</Text>
//       <View style={styles.row}>
//         {["single", "multiple", "rating"].map((type) => (
//           <Pressable
//             key={type}
//             onPress={() => setPollType(type as any)}
//             style={[
//               styles.typeButton,
//               pollType === type && styles.typeButtonActive,
//             ]}
//           >
//             <Text
//               style={[
//                 styles.typeButtonText,
//                 pollType === type && styles.typeButtonTextActive,
//               ]}
//             >
//               {type}
//             </Text>
//           </Pressable>
//         ))}
//       </View>

//       <Text style={styles.label}>Options</Text>
//       {options.map((opt, idx) => (
//         <View key={opt.id} style={styles.optionRow}>
//           <TextInput
//             style={styles.optionInput}
//             placeholder={`Option ${idx + 1}`}
//             placeholderTextColor={Colors.textMuted}
//             value={opt.label}
//             onChangeText={(txt) =>
//               setOptions(
//                 options.map((o) => (o.id === opt.id ? { ...o, label: txt } : o))
//               )
//             }
//           />
//           <Pressable onPress={() => handleRemoveOption(opt.id)}>
//             <Text style={styles.removeBtn}>✕</Text>
//           </Pressable>
//         </View>
//       ))}

//       <Pressable style={styles.addOptionBtn} onPress={handleAddOption}>
//         <Text style={styles.addOptionText}>+ Add option</Text>
//       </Pressable>

//       <Pressable
//         style={styles.toggleRow}
//         onPress={() => setAllowRevote(!allowRevote)}
//       >
//         <Text style={styles.label}>Allow revote</Text>
//         <Text style={styles.toggleValue}>{allowRevote ? "YES" : "NO"}</Text>
//       </Pressable>

//       <Pressable style={styles.toggleRow} onPress={() => setShowPicker(true)}>
//         <Text style={styles.label}>Expiry date</Text>
//         <Text style={styles.toggleValue}>
//           {expiresAt ? expiresAt.toDateString() : "Not set"}
//         </Text>
//       </Pressable>

//       {showPicker && (
//         <DateTimePicker
//           value={expiresAt ?? new Date()}
//           onChange={(e, date) => {
//             setShowPicker(false);
//             if (date) setExpiresAt(date);
//           }}
//         />
//       )}

//       <Pressable
//         style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
//         disabled={submitting}
//         onPress={handleSubmit}
//       >
//         <Text style={styles.submitBtnText}>
//           {submitting ? "Saving..." : "Create Poll"}
//         </Text>
//       </Pressable>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     padding: 16,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginBottom: 12,
//     color: Colors.textPrimary,
//   },
//   label: {
//     marginTop: 12,
//     fontSize: 14,
//     fontWeight: "600",
//     color: Colors.textSecondary,
//   },
//   textInput: {
//     backgroundColor: Colors.surface,
//     borderRadius: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     marginTop: 4,
//   },
//   row: {
//     flexDirection: "row",
//     marginTop: 8,
//   },
//   typeButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     marginRight: 8,
//   },
//   typeButtonActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   typeButtonText: {
//     color: Colors.textPrimary,
//     fontSize: 13,
//   },
//   typeButtonTextActive: {
//     color: Colors.textInverse,
//     fontWeight: "700",
//   },
//   optionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 6,
//   },
//   optionInput: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: Colors.surface,
//     borderColor: Colors.border,
//     borderWidth: 1,
//     borderRadius: 10,
//   },
//   removeBtn: {
//     marginLeft: 8,
//     fontSize: 18,
//     color: Colors.error,
//   },
//   addOptionBtn: {
//     alignSelf: "flex-start",
//     marginVertical: 8,
//   },
//   addOptionText: {
//     color: Colors.primary,
//     fontSize: 14,
//   },
//   toggleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 12,
//   },
//   toggleValue: {
//     color: Colors.primary,
//     fontWeight: "600",
//   },
//   submitBtn: {
//     marginTop: 24,
//     backgroundColor: Colors.primary,
//     paddingVertical: 12,
//     alignItems: "center",
//     borderRadius: 12,
//   },
//   submitBtnText: {
//     color: Colors.textInverse,
//     fontWeight: "700",
//   },
// });

import { pollService } from "@/app/services/pollService";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import uuid from "react-native-uuid";

const STAR_OPTIONS = [
  { id: "1", label: "⭐ 1" },
  { id: "2", label: "⭐⭐ 2" },
  { id: "3", label: "⭐⭐⭐ 3" },
  { id: "4", label: "⭐⭐⭐⭐ 4" },
  { id: "5", label: "⭐⭐⭐⭐⭐ 5" },
];

const EMOJI_OPTIONS = [
  { id: "a", label: "😡" },
  { id: "b", label: "😕" },
  { id: "c", label: "😐" },
  { id: "d", label: "😊" },
  { id: "e", label: "😍" },
];

export default function CreatePoll() {
  const router = useRouter();
  const { user } = useAuth();

  const [question, setQuestion] = useState("");
  const [pollType, setPollType] = useState<"single" | "multiple" | "rating">(
    "single"
  );
  const [ratingStyle, setRatingStyle] = useState<"stars" | "emoji">("stars");
  const [allowRevote, setAllowRevote] = useState(true);
  const [options, setOptions] = useState([
    { id: uuid.v4().toString(), label: "" },
    { id: uuid.v4().toString(), label: "" },
  ]);

  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, { id: uuid.v4().toString(), label: "" }]);
  };

  const handleSubmit = async () => {
    if (!question.trim()) return Alert.alert("Enter a question");

    let finalOptions = [...options];

    if (pollType === "rating") {
      finalOptions = ratingStyle === "stars" ? STAR_OPTIONS : EMOJI_OPTIONS;
    } else {
      finalOptions = finalOptions.filter((o) => o.label.trim() !== "");
      if (finalOptions.length < 2)
        return Alert.alert("Minimum 2 valid options required");
    }

    try {
      setSubmitting(true);

      await pollService.createPoll({
        question,
        pollType,
        ratingStyle,
        options: finalOptions,
        allowRevote,
        expiresAt,
        createdBy: {
          uid: user?.uid ?? "",
          name: user?.fullName ?? "Unknown",
          role: user?.role,
          profileImage: user?.profileImage ?? null,
        },
      });

      Alert.alert("Success", "Poll created", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create Poll</Text>

      {/* Question */}
      <Text style={styles.label}>Question</Text>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        style={styles.textInput}
        placeholder="Ask your opinion..."
        placeholderTextColor={Colors.textMuted}
      />

      {/* Poll Type */}
      <Text style={styles.label}>Poll Type</Text>
      <View style={styles.row}>
        {["single", "multiple", "rating"].map((type) => (
          <Pressable
            key={type}
            style={[
              styles.typeButton,
              pollType === type && styles.typeButtonActive,
            ]}
            onPress={() => setPollType(type as any)}
          >
            <Text
              style={[
                styles.typeButtonText,
                pollType === type && { color: Colors.textInverse },
              ]}
            >
              {type.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Rating Style Selection */}
      {pollType === "rating" && (
        <>
          <Text style={styles.label}>Rating Style</Text>
          <View style={styles.row}>
            {["stars", "emoji"].map((style) => (
              <Pressable
                key={style}
                style={[
                  styles.typeButton,
                  ratingStyle === style && styles.typeButtonActive,
                ]}
                onPress={() => setRatingStyle(style as any)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    ratingStyle === style && { color: Colors.textInverse },
                  ]}
                >
                  {style}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {/* Options – hidden for rating polls */}
      {pollType !== "rating" && (
        <>
          <Text style={styles.label}>Options</Text>
          {options.map((opt, idx) => (
            <View key={opt.id} style={styles.optionRow}>
              <TextInput
                style={styles.optionInput}
                value={opt.label}
                placeholder={`Option ${idx + 1}`}
                onChangeText={(txt) =>
                  setOptions(
                    options.map((o) =>
                      o.id === opt.id ? { ...o, label: txt } : o
                    )
                  )
                }
              />
            </View>
          ))}

          <Pressable style={styles.addOptionBtn} onPress={handleAddOption}>
            <Text style={styles.addOptionText}>+ Add Option</Text>
          </Pressable>
        </>
      )}

      {/* Toggle */}
      <Pressable
        style={styles.toggleRow}
        onPress={() => setAllowRevote(!allowRevote)}
      >
        <Text style={styles.label}>Allow revote</Text>
        <Text style={styles.toggleValue}>{allowRevote ? "YES" : "NO"}</Text>
      </Pressable>

      {/* Date Picker */}
      <Pressable style={styles.toggleRow} onPress={() => setShowPicker(true)}>
        <Text style={styles.label}>Expiry date</Text>
        <Text style={styles.toggleValue}>
          {expiresAt ? expiresAt.toDateString() : "Not set"}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={expiresAt ?? new Date()}
          onChange={(e, date) => {
            setShowPicker(false);
            if (date) setExpiresAt(date);
          }}
        />
      )}

      {/* Submit */}
      <Pressable
        style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
        disabled={submitting}
        onPress={handleSubmit}
      >
        <Text style={styles.submitBtnText}>
          {submitting ? "Processing..." : "Create Poll"}
        </Text>
      </Pressable>

      <View style={{ height: 40 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  heading: { fontSize: 22, fontWeight: "700", color: Colors.textPrimary },
  label: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: { flexDirection: "row", marginTop: 8 },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeButtonText: { color: Colors.textPrimary, fontSize: 13 },
  optionRow: { flexDirection: "row", marginTop: 8 },
  optionInput: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 10,
  },
  addOptionBtn: { marginTop: 10 },
  addOptionText: { color: Colors.primary, fontWeight: "700" },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  toggleValue: { color: Colors.primary, fontWeight: "700" },
  submitBtn: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
  },
  submitBtnText: { color: Colors.textInverse, fontWeight: "700", fontSize: 15 },
});
