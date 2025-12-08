// app/(shared)/complaints/ComplaintDetails.tsx
import {
  ComplaintDoc,
  complaintService,
} from "@/app/services/complaintService";
import Colors from "@/data/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import StatusBadge from "./components/StatusBadge";

export default function ComplaintDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);

  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const unsub = complaintService.subscribeToComplaint(String(id), (doc) => {
      setComplaint(doc);
    });
    return () => unsub();
  }, [id]);

  if (!complaint) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  const created = complaint.createdAt?.toDate?.() ?? new Date();

  const openImage = (url: string) => {
    setSelectedImage(url);
    setShowImageViewer(true);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{complaint.title}</Text>
        <Text style={styles.meta}>Date: {created.toLocaleString()}</Text>

        <StatusBadge status={complaint.status} viewerRole="user" />

        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{complaint.description}</Text>

        <Text style={styles.sectionLabel}>Location</Text>
        <Text style={styles.text}>{complaint.place}</Text>

        <Text style={styles.sectionLabel}>Phone</Text>
        <Text style={styles.text}>{complaint.phone}</Text>

        {complaint.media?.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Attachments</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {complaint.media.map((m, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    if (m.type === "image") openImage(m.url);
                  }}
                >
                  <ImageBackground
                    source={{ uri: m.url }}
                    style={styles.mediaThumb}
                    imageStyle={{ borderRadius: 10 }}
                    resizeMode="cover"
                  >
                    {m.type === "video" && (
                      <View style={styles.videoOverlay}>
                        <Text style={styles.videoLabel}>Video</Text>
                      </View>
                    )}
                  </ImageBackground>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={showImageViewer}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageViewer(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setShowImageViewer(false)}
        >
          {selectedImage && (
            <View style={styles.popupCard}>
              <ImageBackground
                source={{ uri: selectedImage }}
                style={styles.popupImage}
                resizeMode="contain"
              />
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  text: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  mediaThumb: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: Colors.surfaceDark,
    overflow: "hidden",
  },
  videoOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textInverse,
  },
  backBtn: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  backBtnText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupCard: {
    width: "80%",
    height: "60%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  popupImage: {
    width: "100%",
    height: "100%",
  },
});
