import { commentsService } from "@/app/services/commentsService";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

type Props = {
  visible: boolean;
  postId: string | null;
  onClose: () => void;
};

export default function VideoCommentsSheet({
  visible,
  postId,
  onClose,
}: Props) {
  const [comments, setComments] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<FlatList>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!postId) return;
    setLoading(true);

    const unsub = commentsService.subscribeToComments(postId, (list) => {
      setComments(list);
      setLoading(false);

      // auto scroll to bottom when new comes
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 300);
    });

    return () => unsub && unsub();
  }, [postId]);

  const handleSend = async () => {
    if (!input.trim() || !postId) return;

    const userName = user?.displayName ?? "User";

    await commentsService.addComment({
      postId,
      userId: user!.uid,
      name: userName,
      profileImage: (user as any)?.photoURL ?? null,
      text: input.trim(),
    });

    setInput("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity style={styles.bg} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginTop: 20 }}
            />
          ) : (
            <FlatList
              ref={scrollRef}
              data={comments}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.text}>{item.text}</Text>
                </View>
              )}
            />
          )}

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Add a comment..."
              placeholderTextColor="#aaa"
              style={styles.input}
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity onPress={handleSend} disabled={!input.trim()}>
              <Ionicons
                name="send"
                size={26}
                color={input.trim() ? "#007AFF" : "#555"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#111",
    height: "60%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  comment: {
    marginBottom: 16,
  },
  name: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 3,
  },
  text: {
    color: "#ddd",
    fontSize: 14,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingVertical: 10,
    marginTop: 5,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    paddingVertical: 6,
    marginRight: 10,
  },
});
