// app/(admin)/content/ContentCreatedScreen.tsx
import TopSectionTabs from "@/componenets/TopSectionTabs";
import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import EventContent from "./EventContent";
import ImagesContent from "./ImagesContent";
import NewsContent from "./NewsContent";
import SurveyContent from "./SurveyContent";
import VideosContent from "./VideosContent";

export default function ContentCreatedScreen() {
  const [activeCategory, setActiveCategory] = useState("news");
  const [selectedMonitor, setSelectedMonitor] = useState("all");
  const [selectedMonitorName, setSelectedMonitorName] =
    useState("All Monitors");
  const [monitors, setMonitors] = useState([]);

  const [monitorModalVisible, setMonitorModalVisible] = useState(false);

  /* Load Monitors */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const all = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as any) }))
        .filter((u) => u.role === "monitor");

      setMonitors(all);
    });
    return unsub;
  }, []);

  const categories = [
    { key: "news", label: "News" },
    { key: "events", label: "Events" },
    { key: "surveys", label: "Surveys" },
    { key: "images", label: "Images" },
    { key: "videos", label: "Videos" },
  ];

  return (
    <View style={styles.container}>
      {/* 🔹 MONITOR SELECTOR BAR */}
      <TouchableOpacity
        style={styles.monitorSelectorBar}
        activeOpacity={0.9}
        onPress={() => setMonitorModalVisible(true)}
      >
        <Text style={styles.selectorLabel}>Monitor</Text>

        <View style={styles.selectorValue}>
          <Text style={styles.selectorValueText}>{selectedMonitorName}</Text>
        </View>
      </TouchableOpacity>

      {/* 🔹 MONITOR SELECTOR MODAL */}
      <Modal visible={monitorModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Monitor</Text>

            <FlatList
              data={[
                { id: "all", fullName: "All Monitors", profileImage: null },
                ...monitors,
              ]}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedMonitor(item.id);
                    setSelectedMonitorName(item.fullName);
                    setMonitorModalVisible(false);
                  }}
                >
                  {item.profileImage ? (
                    <Image
                      source={{ uri: item.profileImage }}
                      style={styles.modalAvatar}
                    />
                  ) : (
                    <View
                      style={[
                        styles.modalAvatar,
                        styles.modalAvatarPlaceholder,
                      ]}
                    >
                      <Text style={styles.modalAvatarLetter}>
                        {item.fullName.charAt(0)}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.modalItemLabel}>{item.fullName}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setMonitorModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CATEGORY TABS */}
      <TopSectionTabs
        tabs={categories}
        activeTab={activeCategory}
        onChange={setActiveCategory}
      />

      {/* CONTENT */}
      <View style={styles.contentWrapper}>
        {activeCategory === "news" && (
          <NewsContent monitorId={selectedMonitor} />
        )}
        {activeCategory === "events" && (
          <EventContent monitorId={selectedMonitor} />
        )}
        {activeCategory === "surveys" && (
          <SurveyContent monitorId={selectedMonitor} />
        )}
        {activeCategory === "images" && (
          <ImagesContent monitorId={selectedMonitor} />
        )}
        {activeCategory === "videos" && (
          <VideosContent monitorId={selectedMonitor} />
        )}
      </View>
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },

  /* 🔹 Monitor Selector Bar */
  monitorSelectorBar: {
    marginTop: 10,
    marginHorizontal: 12,
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  selectorLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },

  selectorValue: {
    flexDirection: "row",
    alignItems: "center",
  },

  selectorValueText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },

  /* 🔹 Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },

  modalCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    maxHeight: "75%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },

  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  modalAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 12,
  },

  modalAvatarPlaceholder: {
    backgroundColor: Colors.surfaceDark,
    justifyContent: "center",
    alignItems: "center",
  },

  modalAvatarLetter: {
    color: Colors.textInverse,
    fontWeight: "700",
  },

  modalItemLabel: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: "600",
  },

  modalCloseBtn: {
    marginTop: 14,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
  },

  modalCloseText: {
    color: Colors.textInverse,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
  },

  /* CONTENT */
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 12,
  },
});
