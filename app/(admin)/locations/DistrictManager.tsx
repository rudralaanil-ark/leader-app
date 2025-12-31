// //app/(admin)/locations/DistrictManager.tsx
// import {
//   DistrictRow,
//   locationAdminService,
// } from "@/app/services/locationAdminService";
// import { parseCsv } from "@/app/utils/parseCsv";
// import { parseExcel } from "@/app/utils/parseExcel";
// import Colors from "@/data/Colors";
// import * as DocumentPicker from "expo-document-picker";
// import React, { useState } from "react";
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function DistrictManager() {
//   const [rows, setRows] = useState<DistrictRow[]>([]);
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const pickFile = async () => {
//     try {
//       const res = await DocumentPicker.getDocumentAsync({
//         type: [
//           "text/csv",
//           "application/vnd.ms-excel",
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         ],
//         copyToCacheDirectory: true,
//       });

//       if (res.canceled) return;

//       const file = res.assets[0];
//       setFileName(file.name);
//       setLoading(true);

//       let parsed: any[] = [];

//       if (file.name.toLowerCase().endsWith(".csv")) {
//         parsed = await parseCsv(file.uri, { type: "district" });
//       } else {
//         parsed = await parseExcel(file.uri, { type: "district" });
//       }

//       const cleaned: DistrictRow[] = parsed
//         .filter((r) => r.code && r.name)
//         .map((r) => ({
//           code: r.code!.toUpperCase(),
//           name: r.name.trim(),
//           duplicate: r.duplicate,
//         }));

//       const withExists = await locationAdminService.markExistingDistricts(
//         cleaned
//       );

//       setRows(withExists);
//     } catch (e) {
//       console.error(e);
//       Alert.alert("Error", "Failed to read file");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const save = async () => {
//     if (rows.length === 0) {
//       Alert.alert("No data", "Nothing to save");
//       return;
//     }

//     Alert.alert("Confirm Save", "Do you want to save the district data?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Save",
//         onPress: async () => {
//           try {
//             setLoading(true);
//             await locationAdminService.saveDistricts(rows);
//             Alert.alert("Success", "Districts saved successfully");
//             setRows([]);
//             setFileName(null);
//           } catch (e) {
//             Alert.alert("Error", "Failed to save districts");
//           } finally {
//             setLoading(false);
//           }
//         },
//       },
//     ]);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>District Manager</Text>

//       <View style={styles.helpBox}>
//         <Text style={styles.helpTitle}>Upload Instructions</Text>
//         <Text style={styles.helpText}>
//           Excel headers:
//           {"\n"}district_code | district_name
//           {"\n\n"}CSV format:
//           {"\n"}GNT-Guntur
//         </Text>
//       </View>

//       <TouchableOpacity
//         style={styles.uploadBtn}
//         onPress={pickFile}
//         disabled={loading}
//       >
//         <Text style={styles.uploadText}>
//           {loading ? "Processing..." : "Upload CSV / Excel"}
//         </Text>
//       </TouchableOpacity>

//       {fileName && <Text style={styles.fileName}>File: {fileName}</Text>}

//       {rows.length > 0 && (
//         <>
//           <ScrollView style={styles.previewBox}>
//             {rows.map((row, index) => (
//               <View key={index} style={styles.row}>
//                 <Text style={styles.rowText}>
//                   {row.code} - {row.name}
//                 </Text>

//                 {row.duplicate && (
//                   <Text style={styles.duplicate}>Duplicate in file</Text>
//                 )}

//                 {row.exists && (
//                   <View style={styles.actionBox}>
//                     <TouchableOpacity
//                       onPress={() => {
//                         row.action = "skip";
//                         setRows([...rows]);
//                       }}
//                     >
//                       <Text
//                         style={[
//                           styles.skip,
//                           row.action === "skip" && styles.active,
//                         ]}
//                       >
//                         Skip
//                       </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       onPress={() => {
//                         row.action = "overwrite";
//                         setRows([...rows]);
//                       }}
//                     >
//                       <Text
//                         style={[
//                           styles.overwrite,
//                           row.action === "overwrite" && styles.active,
//                         ]}
//                       >
//                         Overwrite
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             ))}
//           </ScrollView>

//           <TouchableOpacity
//             style={styles.saveBtn}
//             onPress={save}
//             disabled={loading}
//           >
//             <Text style={styles.saveText}>Save Districts</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: Colors.background },
//   title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
//   helpBox: {
//     backgroundColor: Colors.surface,
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   helpTitle: { fontWeight: "600", marginBottom: 4 },
//   helpText: { color: Colors.textSecondary },
//   uploadBtn: {
//     backgroundColor: Colors.primary,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   uploadText: { color: Colors.buttonText, fontWeight: "600" },
//   fileName: { fontSize: 12, color: Colors.textMuted },
//   previewBox: { marginTop: 12, maxHeight: 420 },
//   row: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderColor: Colors.border,
//   },
//   rowText: { fontSize: 14 },
//   duplicate: { color: Colors.warning, fontSize: 12 },
//   actionBox: { flexDirection: "row", gap: 16, marginTop: 4 },
//   skip: { color: Colors.warning },
//   overwrite: { color: Colors.error },
//   active: { fontWeight: "700", textDecorationLine: "underline" },
//   saveBtn: {
//     backgroundColor: Colors.success,
//     padding: 14,
//     borderRadius: 8,
//     marginTop: 12,
//     alignItems: "center",
//   },
//   saveText: { color: Colors.buttonText, fontWeight: "600" },
// });
