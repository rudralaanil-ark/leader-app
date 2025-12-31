// app/(admin)/(tabs)/ManageNews.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import AdminNewsContent from "../content/NewsContent";

export default function ManageNews() {
  const [monitors, setMonitors] = useState<any[]>([]);

  const [selectedMonitor, setSelectedMonitor] = useState("all");
  const [selectedMonitorName, setSelectedMonitorName] =
    useState("All Monitors");

  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  /* LOAD MONITORS */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const list = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as any) }))
        .filter((u) => u.role === "monitor");

      setMonitors(list);
    });

    return unsub;
  }, []);

  const formatDate = (d?: Date) =>
    d
      ? d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Any";

  const clearFilters = () => {
    setSelectedMonitor("all");
    setSelectedMonitorName("All Monitors");
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <View style={styles.container}>
      {/* FILTER BAR */}
      <TouchableOpacity
        style={styles.filterBar}
        activeOpacity={0.9}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.filterTitle}>Filters</Text>

        <Text style={styles.filterText}>Monitor: {selectedMonitorName}</Text>

        <Text style={styles.filterText}>
          Date: {fromDate ? formatDate(fromDate) : "Any"} →{" "}
          {toDate ? formatDate(toDate) : "Any"}
        </Text>
      </TouchableOpacity>

      {/* FILTER MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Filter News</Text>

            {/* FROM DATE */}
            <View style={styles.filterItemRow}>
              <TouchableOpacity onPress={() => setShowFromPicker(true)}>
                <Text>From Date</Text>
                <Text style={styles.value}>
                  {fromDate ? formatDate(fromDate) : "Any"}
                </Text>
              </TouchableOpacity>

              {fromDate && (
                <TouchableOpacity onPress={() => setFromDate(undefined)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* TO DATE */}
            <View style={styles.filterItemRow}>
              <TouchableOpacity onPress={() => setShowToPicker(true)}>
                <Text>To Date</Text>
                <Text style={styles.value}>
                  {toDate ? formatDate(toDate) : "Any"}
                </Text>
              </TouchableOpacity>

              {toDate && (
                <TouchableOpacity onPress={() => setToDate(undefined)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* MONITOR SELECT */}
            <Text style={styles.sectionTitle}>Created By (Optional)</Text>

            <FlatList
              data={[{ id: "all", fullName: "All Monitors" }, ...monitors]}
              keyExtractor={(i) => i.id}
              style={{ maxHeight: 220 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    setSelectedMonitor(item.id);
                    setSelectedMonitorName(item.fullName);
                  }}
                >
                  {item.profileImage ? (
                    <Image
                      source={{ uri: item.profileImage }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>
                        {item.fullName.charAt(0)}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.name}>{item.fullName}</Text>
                </TouchableOpacity>
              )}
            />

            {/* ACTIONS */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
                <Text style={styles.clearBtnText}>Clear Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DATE PICKERS */}
      {showFromPicker && (
        <DateTimePicker
          value={fromDate ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(_, d) => {
            setShowFromPicker(false);
            if (d) setFromDate(d);
          }}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={toDate ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(_, d) => {
            setShowToPicker(false);
            if (d) setToDate(d);
          }}
        />
      )}

      {/* NEWS LIST */}
      <AdminNewsContent
        monitorId={selectedMonitor}
        dateRange={{ from: fromDate, to: toDate }}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },

  filterBar: {
    margin: 12,
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  filterTitle: {
    fontWeight: "800",
    marginBottom: 6,
    color: Colors.textPrimary,
  },

  filterText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },

  modal: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
    color: Colors.textPrimary,
  },

  filterItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  value: {
    fontWeight: "700",
    color: Colors.primary,
  },

  clearText: {
    color: Colors.error,
    fontWeight: "700",
    fontSize: 12,
  },

  sectionTitle: {
    marginTop: 10,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },

  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceDark,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  cancelText: {
    color: Colors.textSecondary,
    fontWeight: "700",
  },

  clearBtn: {
    backgroundColor: Colors.surfaceDark,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  clearBtnText: {
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  applyBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  applyText: {
    color: "#fff",
    fontWeight: "700",
  },
});
