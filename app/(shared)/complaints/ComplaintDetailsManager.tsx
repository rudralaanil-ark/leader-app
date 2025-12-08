// app/(shared)/complaints/ComplaintDetailsManager.tsx
import {
  ComplaintDoc,
  ComplaintReply,
  ComplaintStatus,
  complaintService,
} from "@/app/services/complaintService";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MessageBubble from "./components/MessageBubble";
import StatusBadge from "./components/StatusBadge";

export default function ComplaintDetailsManager() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState<ComplaintDoc | null>(null);
  const [loading, setLoading] = useState(true);

  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [statusPickerOpen, setStatusPickerOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const isMonitor = user?.role === "monitor";

  useEffect(() => {
    if (!id) return;
    const unsub = complaintService.subscribeToComplaint(String(id), (doc) => {
      setComplaint(doc);
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  // Mark read when manager opens
  useEffect(() => {
    if (!id) return;
    if (isAdmin || isMonitor) {
      complaintService.markReadByAdmin(String(id)).catch(() => {});
    }
  }, [id, isAdmin, isMonitor]);

  const created = useMemo(() => {
    if (!complaint?.createdAt) return new Date();
    return complaint.createdAt?.toDate?.() ?? new Date();
  }, [complaint]);

  const repliesSorted: ComplaintReply[] = useMemo(() => {
    if (!complaint?.replies || !Array.isArray(complaint.replies)) return [];
    return [...complaint.replies].sort((a, b) => {
      const ta = a.createdAt?.toDate?.()?.getTime?.() ?? 0;
      const tb = b.createdAt?.toDate?.()?.getTime?.() ?? 0;
      return ta - tb;
    });
  }, [complaint]);

  const openImage = (url: string) => {
    setSelectedImage(url);
    setShowImageViewer(true);
  };

  const handleChangeStatus = async (status: ComplaintStatus) => {
    if (!complaint) return;
    setStatusPickerOpen(false);
    try {
      await complaintService.updateStatus(complaint.id, status);
    } catch (e) {
      console.error("updateStatus error:", e);
    }
  };

  const handleSendReply = async () => {
    if (!complaint || !user?.uid || !replyText.trim()) return;

    try {
      setSending(true);
      await complaintService.addReply(complaint.id, {
        message: replyText.trim(),
        repliedBy: user.uid,
        repliedByName: user.fullName || "Admin",
        role: isAdmin ? "admin" : "monitor",
        createdAt: new Date(), // will still be stored as raw; we don't rely on server timestamp here
      });
      setReplyText("");
    } catch (e) {
      console.error("addReply error:", e);
    } finally {
      setSending(false);
    }
  };

  if (loading || !complaint) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  const statusOptions: ComplaintStatus[] = [
    "pending",
    "accepted",
    "in_progress",
    "need_info",
    "resolved",
  ];

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 90 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <Text style={styles.title}>{complaint.title}</Text>
          <Text style={styles.meta}>Created: {created.toLocaleString()}</Text>

          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.sectionLabel}>User</Text>
              <Text style={styles.text}>{complaint.userName}</Text>
              <Text style={styles.text}>Phone: {complaint.phone}</Text>
              <Text style={styles.text}>Place: {complaint.place}</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.sectionLabel}>Status</Text>
              <StatusBadge
                status={complaint.status}
                viewerRole={isAdmin ? "admin" : "monitor"}
              />

              <Pressable
                style={styles.statusButton}
                onPress={() => setStatusPickerOpen((v) => !v)}
              >
                <Text style={styles.statusButtonText}>Change Status</Text>
              </Pressable>
            </View>
          </View>

          {/* STATUS PICKER DROPDOWN */}
          {statusPickerOpen && (
            <View style={styles.statusPickerCard}>
              {statusOptions.map((s) => (
                <Pressable
                  key={s}
                  style={[
                    styles.statusOption,
                    s === complaint.status && styles.statusOptionActive,
                  ]}
                  onPress={() => handleChangeStatus(s)}
                >
                  <StatusBadge
                    status={s}
                    viewerRole={isAdmin ? "admin" : "monitor"}
                  />
                </Pressable>
              ))}
            </View>
          )}

          {/* ATTACHMENTS */}
          {complaint.media?.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Attachments</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 8 }}
              >
                {complaint.media.map((m, i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      if (m.type === "image") {
                        openImage(m.url);
                      }
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

          {/* CHAT / MESSAGE LIST */}
          <Text style={styles.sectionLabel}>Conversation</Text>

          {/* Original complaint as first "message" */}
          <MessageBubble
            text={complaint.description}
            label="User"
            isMe={false}
            timestamp={
              complaint.createdAt?.toDate?.() ??
              (complaint.createdAt instanceof Date ? complaint.createdAt : null)
            }
          />

          {/* Replies */}
          {repliesSorted.map((r) => {
            const ts =
              r.createdAt?.toDate?.() ??
              (r.createdAt instanceof Date ? r.createdAt : null);
            const isMe = r.repliedBy === user?.uid;
            const label =
              r.role === "admin"
                ? "Admin"
                : r.role === "monitor"
                ? "Monitor"
                : "Staff";

            return (
              <MessageBubble
                key={r.id}
                text={r.message}
                isMe={isMe}
                label={label}
                timestamp={ts}
              />
            );
          })}

          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </ScrollView>

        {/* REPLY INPUT BAR */}
        <View style={styles.replyBar}>
          <TextInput
            style={styles.replyInput}
            placeholder="Type a reply to the user..."
            placeholderTextColor={Colors.textMuted}
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <Pressable
            style={[
              styles.replyButton,
              (!replyText.trim() || sending) && { opacity: 0.6 },
            ]}
            onPress={handleSendReply}
            disabled={!replyText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator color={Colors.textInverse} />
            ) : (
              <Text style={styles.replyButtonText}>Send</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* POPUP IMAGE VIEWER */}
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
    paddingHorizontal: 16,
    paddingTop: 16,
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
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statusButton: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  statusPickerCard: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 4,
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusOptionActive: {
    backgroundColor: Colors.highlightSoft,
  },
  mediaThumb: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: Colors.surfaceDark,
    overflow: "hidden",
  },
  videoOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  videoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textInverse,
  },
  backBtn: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  backBtnText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: "700",
  },
  replyBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  replyInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 90,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  replyButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  replyButtonText: {
    color: Colors.textInverse,
    fontSize: 13,
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
