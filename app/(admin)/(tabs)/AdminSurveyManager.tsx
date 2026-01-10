// import React, { useEffect, useState } from "react";
// import {
//   FlatList,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import LocationAutocomplete from "@/app/(shared)/survey/components/LocationAutocomplete";
// import { adminSurveyService } from "@/app/services/adminSurveyService";
// import Colors from "@/data/Colors";

// type EditingSurvey = {
//   id: string;
//   person: {
//     name: string;
//     phone: string;
//   };
//   location: {
//     districtCode: string;
//     constituency: string;
//     mandal?: string;
//     village?: string;
//   };
// };

// export default function AdminSurveyManager() {
//   const [surveys, setSurveys] = useState<any[]>([]);
//   const [editing, setEditing] = useState<EditingSurvey | null>(null);

//   /* ================= LOAD ================= */

//   const loadSurveys = async () => {
//     const res = await adminSurveyService.getAllSurveys();
//     setSurveys(res);
//   };

//   useEffect(() => {
//     loadSurveys();
//   }, []);

//   /* ================= SAVE ================= */

//   const save = async () => {
//     if (!editing) return;

//     await adminSurveyService.updateSurvey(editing.id, {
//       person: editing.person,
//       location: editing.location,
//     });

//     setEditing(null);
//     loadSurveys();
//   };

//   /* ================= UI ================= */

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={surveys}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ paddingBottom: 40 }}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() =>
//               setEditing({
//                 id: item.id,
//                 person: { ...item.person },
//                 location: { ...item.location },
//               })
//             }
//           >
//             <Text style={styles.name}>{item.person?.name}</Text>
//             <Text>{item.person?.phone}</Text>
//             <Text style={styles.location}>
//               {item.location?.districtCode} · {item.location?.constituency}
//               {item.location?.mandal ? `, ${item.location.mandal}` : ""}
//               {item.location?.village ? `, ${item.location.village}` : ""}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />

//       {/* ================= EDIT MODAL ================= */}
//       {editing && (
//         <Modal visible animationType="slide">
//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : undefined}
//             style={{ flex: 1 }}
//           >
//             <View style={styles.modal}>
//               <Text style={styles.title}>Edit Survey</Text>

//               {/* Name */}
//               <Text style={styles.label}>Name</Text>
//               <TextInput
//                 value={editing.person.name}
//                 onChangeText={(v) =>
//                   setEditing({
//                     ...editing,
//                     person: { ...editing.person, name: v },
//                   })
//                 }
//                 style={styles.input}
//               />

//               {/* Phone */}
//               <Text style={styles.label}>Phone</Text>
//               <TextInput
//                 value={editing.person.phone}
//                 keyboardType="phone-pad"
//                 onChangeText={(v) =>
//                   setEditing({
//                     ...editing,
//                     person: { ...editing.person, phone: v },
//                   })
//                 }
//                 style={styles.input}
//               />

//               {/* 🔥 District (AUTOCOMPLETE) */}
//               <LocationAutocomplete
//                 label="District"
//                 type="district"
//                 value={editing.location.districtCode}
//                 onChange={(v) =>
//                   setEditing({
//                     ...editing,
//                     location: {
//                       districtCode: v,
//                       constituency: "",
//                       mandal: "",
//                       village: "",
//                     },
//                   })
//                 }
//               />

//               {/* Constituency */}
//               <LocationAutocomplete
//                 label="Constituency"
//                 type="constituency"
//                 districtCode={editing.location.districtCode}
//                 value={editing.location.constituency}
//                 onChange={(v) =>
//                   setEditing({
//                     ...editing,
//                     location: { ...editing.location, constituency: v },
//                   })
//                 }
//                 disabled={!editing.location.districtCode}
//               />

//               {/* Mandal */}
//               <LocationAutocomplete
//                 label="Mandal / City"
//                 type="mandal"
//                 districtCode={editing.location.districtCode}
//                 constituency={editing.location.constituency}
//                 value={editing.location.mandal || ""}
//                 onChange={(v) =>
//                   setEditing({
//                     ...editing,
//                     location: { ...editing.location, mandal: v },
//                   })
//                 }
//                 disabled={!editing.location.constituency}
//               />

//               {/* Village */}
//               <LocationAutocomplete
//                 label="Village"
//                 type="village"
//                 districtCode={editing.location.districtCode}
//                 constituency={editing.location.constituency}
//                 mandal={editing.location.mandal}
//                 value={editing.location.village || ""}
//                 onChange={(v) =>
//                   setEditing({
//                     ...editing,
//                     location: { ...editing.location, village: v },
//                   })
//                 }
//                 disabled={!editing.location.mandal}
//               />

//               {/* Actions */}
//               <TouchableOpacity style={styles.saveBtn} onPress={save}>
//                 <Text style={styles.saveText}>Save Changes</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => setEditing(null)}
//                 style={styles.cancelBtn}
//               >
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </Modal>
//       )}
//     </View>
//   );
// }

// /* ===================== STYLES ===================== */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: Colors.background,
//   },
//   card: {
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: Colors.card,
//     marginBottom: 12,
//   },
//   name: {
//     fontWeight: "600",
//     color: Colors.textPrimary,
//   },
//   location: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     marginTop: 4,
//   },
//   modal: {
//     padding: 16,
//     backgroundColor: Colors.background,
//     flex: 1,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 16,
//     color: Colors.textPrimary,
//   },
//   label: {
//     fontWeight: "600",
//     marginBottom: 6,
//     color: Colors.textPrimary,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     backgroundColor: Colors.surface,
//   },
//   saveBtn: {
//     backgroundColor: Colors.primary,
//     padding: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   saveText: {
//     color: Colors.buttonText,
//     fontWeight: "600",
//   },
//   cancelBtn: {
//     marginTop: 12,
//     alignItems: "center",
//   },
//   cancelText: {
//     color: Colors.error,
//   },
// });

// // app/(admin)/(tabs)/AdminSurveyManager.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   FlatList,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import LocationAutocomplete from "@/app/(shared)/survey/components/LocationAutocomplete";
// import { adminSurveyService } from "@/app/services/adminSurveyService";
// import { exportSurveysAsExcel } from "@/app/services/surveyExportService";
// import Colors from "@/data/Colors";

// /* ===================== TYPES ===================== */

// type EditingSurvey = {
//   id: string;
//   person: {
//     name: string;
//     phone: string;
//   };
//   location: {
//     districtCode: string;
//     constituency: string;
//     mandal?: string;
//     village?: string;
//   };
// };

// /* ===================== COMPONENT ===================== */

// export default function AdminSurveyManager() {
//   const [surveys, setSurveys] = useState<any[]>([]);
//   const [editing, setEditing] = useState<EditingSurvey | null>(null);

//   /* 🔍 Filters */
//   const [search, setSearch] = useState("");
//   const [filterDistrict, setFilterDistrict] = useState("");
//   const [filterConstituency, setFilterConstituency] = useState("");
//   const [filterMandal, setFilterMandal] = useState("");

//   /* ================= LOAD ================= */

//   const loadSurveys = async () => {
//     const res = await adminSurveyService.getAllSurveys();
//     setSurveys(res);
//   };

//   useEffect(() => {
//     loadSurveys();
//   }, []);

//   /* ================= FILTER LOGIC ================= */

//   const filteredSurveys = useMemo(() => {
//     return surveys.filter((s) => {
//       const name = s.person?.name?.toLowerCase() || "";
//       const phone = s.person?.phone || "";

//       const matchesSearch =
//         !search ||
//         name.includes(search.toLowerCase()) ||
//         phone.includes(search);

//       const loc = s.location || {};

//       const matchesDistrict =
//         !filterDistrict || loc.districtCode === filterDistrict;

//       const matchesConstituency =
//         !filterConstituency || loc.constituency === filterConstituency;

//       const matchesMandal = !filterMandal || loc.mandal === filterMandal;

//       return (
//         matchesSearch && matchesDistrict && matchesConstituency && matchesMandal
//       );
//     });
//   }, [surveys, search, filterDistrict, filterConstituency, filterMandal]);

//   /* ================= SAVE ================= */

//   const save = async () => {
//     if (!editing) return;

//     await adminSurveyService.updateSurvey(editing.id, {
//       person: editing.person,
//       location: editing.location,
//     });

//     setEditing(null);
//     loadSurveys();
//   };

//   /* ================= UI ================= */

//   return (
//     <View style={styles.container}>
//       {/* 🔍 SEARCH */}
//       <TextInput
//         placeholder="Search by name or phone"
//         value={search}
//         onChangeText={setSearch}
//         style={styles.search}
//       />

//       {/* 📍 FILTERS */}
//       <LocationAutocomplete
//         label="Filter by District"
//         type="district"
//         value={filterDistrict}
//         onChange={(v) => {
//           setFilterDistrict(v);
//           setFilterConstituency("");
//           setFilterMandal("");
//         }}
//       />

//       <LocationAutocomplete
//         label="Filter by Constituency"
//         type="constituency"
//         districtCode={filterDistrict}
//         value={filterConstituency}
//         onChange={(v) => {
//           setFilterConstituency(v);
//           setFilterMandal("");
//         }}
//         disabled={!filterDistrict}
//       />

//       <LocationAutocomplete
//         label="Filter by Mandal"
//         type="mandal"
//         districtCode={filterDistrict}
//         constituency={filterConstituency}
//         value={filterMandal}
//         onChange={setFilterMandal}
//         disabled={!filterConstituency}
//       />

//       {/* 📊 COUNT */}
//       <Text style={styles.count}>
//         Showing {filteredSurveys.length} of {surveys.length} surveys
//       </Text>

//       {/* 📋 LIST */}
//       <FlatList
//         data={filteredSurveys}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() =>
//               setEditing({
//                 id: item.id,
//                 person: { ...item.person },
//                 location: { ...item.location },
//               })
//             }
//           >
//             <Text style={styles.name}>{item.person?.name}</Text>
//             <Text>{item.person?.phone}</Text>
//             <Text style={styles.location}>
//               {item.location?.districtCode} · {item.location?.constituency}
//               {item.location?.mandal ? `, ${item.location.mandal}` : ""}
//               {item.location?.village ? `, ${item.location.village}` : ""}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />

//       {/* ================= EDIT MODAL ================= */}
//       {editing && (
//         <Modal visible animationType="slide">
//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : undefined}
//             style={{ flex: 1 }}
//           >
//             <View style={styles.modal}>
//               <Text style={styles.title}>Edit Survey</Text>

//               <Text style={styles.label}>Name</Text>
//               <TextInput
//                 value={editing.person.name}
//                 onChangeText={(v) =>
//                   setEditing({
//                     ...editing,
//                     person: { ...editing.person, name: v },
//                   })
//                 }
//                 style={styles.input}
//               />

//               <Text style={styles.label}>Phone</Text>
//               <TextInput
//                 value={editing.person.phone}
//                 keyboardType="phone-pad"
//                 onChangeText={(v) =>
//                   setEditing({
//                     ...editing,
//                     person: { ...editing.person, phone: v },
//                   })
//                 }
//                 style={styles.input}
//               />

//               <LocationAutocomplete
//                 label="District"
//                 type="district"
//                 value={editing.location.districtCode}
//                 onChange={(v) =>
//                   setEditing({
//                     ...editing,
//                     location: {
//                       districtCode: v,
//                       constituency: "",
//                       mandal: "",
//                       village: "",
//                     },
//                   })
//                 }
//               />

//               <LocationAutocomplete
//                 label="Constituency"
//                 type="constituency"
//                 districtCode={editing.location.districtCode}
//                 value={editing.location.constituency}
//                 onChange={(v) =>
//                   setEditing({
//                     ...editing,
//                     location: { ...editing.location, constituency: v },
//                   })
//                 }
//                 disabled={!editing.location.districtCode}
//               />

//               <LocationAutocomplete
//                 label="Mandal / City"
//                 type="mandal"
//                 districtCode={editing.location.districtCode}
//                 constituency={editing.location.constituency}
//                 value={editing.location.mandal || ""}
//                 onChange={(v) =>
//                   setEditing({
//                     ...editing,
//                     location: { ...editing.location, mandal: v },
//                   })
//                 }
//                 disabled={!editing.location.constituency}
//               />

//               <LocationAutocomplete
//                 label="Village"
//                 type="village"
//                 districtCode={editing.location.districtCode}
//                 constituency={editing.location.constituency}
//                 mandal={editing.location.mandal}
//                 value={editing.location.village || ""}
//                 onChange={(v) =>
//                   setEditing({
//                     ...editing,
//                     location: { ...editing.location, village: v },
//                   })
//                 }
//                 disabled={!editing.location.mandal}
//               />

//               <TouchableOpacity style={styles.saveBtn} onPress={save}>
//                 <Text style={styles.saveText}>Save Changes</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => setEditing(null)}
//                 style={styles.cancelBtn}
//               >
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </Modal>
//       )}

//       {/* ⬇️ FAB — DOWNLOAD ALL SURVEYS */}
//       <TouchableOpacity
//         style={styles.fab}
//         onPress={exportSurveysAsExcel}
//         activeOpacity={0.85}
//       >
//         <Text style={styles.fabIcon}>⬇️</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// /* ===================== STYLES ===================== */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: Colors.background,
//   },
//   search: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     backgroundColor: Colors.surface,
//   },
//   count: {
//     marginVertical: 8,
//     fontSize: 12,
//     color: Colors.textMuted,
//   },
//   card: {
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: Colors.card,
//     marginBottom: 12,
//   },
//   name: {
//     fontWeight: "600",
//     color: Colors.textPrimary,
//   },
//   location: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     marginTop: 4,
//   },
//   modal: {
//     padding: 16,
//     backgroundColor: Colors.background,
//     flex: 1,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 16,
//     color: Colors.textPrimary,
//   },
//   label: {
//     fontWeight: "600",
//     marginBottom: 6,
//     color: Colors.textPrimary,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     backgroundColor: Colors.surface,
//   },
//   saveBtn: {
//     backgroundColor: Colors.primary,
//     padding: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   saveText: {
//     color: Colors.buttonText,
//     fontWeight: "600",
//   },
//   cancelBtn: {
//     marginTop: 12,
//     alignItems: "center",
//   },
//   cancelText: {
//     color: Colors.error,
//   },

//   /* 🔥 FAB */
//   fab: {
//     position: "absolute",
//     right: 20,
//     bottom: 30,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: Colors.primary,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 6,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   fabIcon: {
//     fontSize: 24,
//     color: Colors.buttonText,
//     fontWeight: "700",
//   },
// });

// app/(admin)/(tabs)/AdminSurveyManager.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import LocationAutocomplete from "@/app/(shared)/survey/components/LocationAutocomplete";
import { adminSurveyService } from "@/app/services/adminSurveyService";
import { exportSurveysAsExcel } from "@/app/services/surveyExportService";
import Colors from "@/data/Colors";

/* ===================== TYPES ===================== */

type EditingSurvey = {
  id: string;
  person: {
    name: string;
    phone: string;
  };
  location: {
    districtCode: string;
    constituency: string;
    mandal?: string;
    village?: string;
  };
};

/* ===================== COMPONENT ===================== */

export default function AdminSurveyManager() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [editing, setEditing] = useState<EditingSurvey | null>(null);

  /* 🔍 Filters */
  const [search, setSearch] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterConstituency, setFilterConstituency] = useState("");
  const [filterMandal, setFilterMandal] = useState("");

  /* ================= LOAD ================= */

  const loadSurveys = async () => {
    const res = await adminSurveyService.getAllSurveys();
    setSurveys(res);
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  /* ================= FILTER LOGIC ================= */

  const filteredSurveys = useMemo(() => {
    return surveys.filter((s) => {
      const name = s.person?.name?.toLowerCase() || "";
      const phone = s.person?.phone || "";

      const matchesSearch =
        !search ||
        name.includes(search.toLowerCase()) ||
        phone.includes(search);

      const loc = s.location || {};

      const matchesDistrict =
        !filterDistrict || loc.districtCode === filterDistrict;

      const matchesConstituency =
        !filterConstituency || loc.constituency === filterConstituency;

      const matchesMandal = !filterMandal || loc.mandal === filterMandal;

      return (
        matchesSearch && matchesDistrict && matchesConstituency && matchesMandal
      );
    });
  }, [surveys, search, filterDistrict, filterConstituency, filterMandal]);

  /* ================= SAVE ================= */

  const save = async () => {
    if (!editing) return;

    await adminSurveyService.updateSurvey(editing.id, {
      person: editing.person,
      location: editing.location,
    });

    setEditing(null);
    loadSurveys();
  };

  /* ================= DELETE ================= */

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Delete Survey",
      "Are you sure you want to delete this survey?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await adminSurveyService.deleteSurvey(id);
            loadSurveys();
          },
        },
      ]
    );
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* 🔍 SEARCH */}
      <TextInput
        placeholder="Search by name or phone"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* 📍 FILTERS */}
      <LocationAutocomplete
        label="Filter by District"
        type="district"
        value={filterDistrict}
        onChange={(v) => {
          setFilterDistrict(v);
          setFilterConstituency("");
          setFilterMandal("");
        }}
      />

      <LocationAutocomplete
        label="Filter by Constituency"
        type="constituency"
        districtCode={filterDistrict}
        value={filterConstituency}
        onChange={(v) => {
          setFilterConstituency(v);
          setFilterMandal("");
        }}
        disabled={!filterDistrict}
      />

      <LocationAutocomplete
        label="Filter by Mandal"
        type="mandal"
        districtCode={filterDistrict}
        constituency={filterConstituency}
        value={filterMandal}
        onChange={setFilterMandal}
        disabled={!filterConstituency}
      />

      {/* 📊 COUNT */}
      <Text style={styles.count}>
        Showing {filteredSurveys.length} of {surveys.length} surveys
      </Text>

      {/* 📋 LIST */}
      <FlatList
        data={filteredSurveys}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.person?.name}</Text>
            <Text>{item.person?.phone}</Text>
            <Text style={styles.location}>
              {item.location?.districtCode} · {item.location?.constituency}
              {item.location?.mandal ? `, ${item.location.mandal}` : ""}
              {item.location?.village ? `, ${item.location.village}` : ""}
            </Text>

            {/* 🔧 ACTIONS */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  setEditing({
                    id: item.id,
                    person: { ...item.person },
                    location: { ...item.location },
                  })
                }
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => confirmDelete(item.id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* ================= EDIT MODAL ================= */}
      {editing && (
        <Modal visible animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <View style={styles.modal}>
              <Text style={styles.title}>Edit Survey</Text>

              <Text style={styles.label}>Name</Text>
              <TextInput
                value={editing.person.name}
                onChangeText={(v) =>
                  setEditing({
                    ...editing,
                    person: { ...editing.person, name: v },
                  })
                }
                style={styles.input}
              />

              <Text style={styles.label}>Phone</Text>
              <TextInput
                value={editing.person.phone}
                keyboardType="phone-pad"
                onChangeText={(v) =>
                  setEditing({
                    ...editing,
                    person: { ...editing.person, phone: v },
                  })
                }
                style={styles.input}
              />

              <LocationAutocomplete
                label="District"
                type="district"
                value={editing.location.districtCode}
                onChange={(v) =>
                  setEditing({
                    ...editing,
                    location: {
                      districtCode: v,
                      constituency: "",
                      mandal: "",
                      village: "",
                    },
                  })
                }
              />

              <LocationAutocomplete
                label="Constituency"
                type="constituency"
                districtCode={editing.location.districtCode}
                value={editing.location.constituency}
                onChange={(v) =>
                  setEditing({
                    ...editing,
                    location: { ...editing.location, constituency: v },
                  })
                }
                disabled={!editing.location.districtCode}
              />

              <LocationAutocomplete
                label="Mandal / City"
                type="mandal"
                districtCode={editing.location.districtCode}
                constituency={editing.location.constituency}
                value={editing.location.mandal || ""}
                onChange={(v) =>
                  setEditing({
                    ...editing,
                    location: { ...editing.location, mandal: v },
                  })
                }
                disabled={!editing.location.constituency}
              />

              <LocationAutocomplete
                label="Village"
                type="village"
                districtCode={editing.location.districtCode}
                constituency={editing.location.constituency}
                mandal={editing.location.mandal}
                value={editing.location.village || ""}
                onChange={(v) =>
                  setEditing({
                    ...editing,
                    location: { ...editing.location, village: v },
                  })
                }
                disabled={!editing.location.mandal}
              />

              <TouchableOpacity style={styles.saveBtn} onPress={save}>
                <Text style={styles.saveText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setEditing(null)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}

      {/* ⬇️ FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={exportSurveysAsExcel}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>⬇️</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  search: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: Colors.surface,
  },
  count: {
    marginVertical: 8,
    fontSize: 12,
    color: Colors.textMuted,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.card,
    marginBottom: 12,
  },
  name: {
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  location: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },

  /* 🔧 ACTIONS */
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.info,
    marginRight: 8,
  },
  editText: {
    color: Colors.textInverse,
    fontWeight: "600",
    fontSize: 12,
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.error,
  },
  deleteText: {
    color: Colors.textInverse,
    fontWeight: "600",
    fontSize: 12,
  },

  modal: {
    padding: 16,
    backgroundColor: Colors.background,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: Colors.textPrimary,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: Colors.surface,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: Colors.buttonText,
    fontWeight: "600",
  },
  cancelBtn: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelText: {
    color: Colors.error,
  },

  /* 🔥 FAB */
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 24,
    color: Colors.buttonText,
    fontWeight: "700",
  },
});
