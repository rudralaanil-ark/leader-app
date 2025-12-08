// app/(monitor)/(tabs)/FolderSelector.tsx
import Colors from "@/data/Colors";
import React from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FolderItem = {
  id: string;
  folderName: string;
  folderDescription?: string | null;
  numberOfImages?: number;
  thumbnailImageUrl?: string | null;
};

export default function FolderSelector({
  visible,
  onClose,
  folders,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  folders: FolderItem[];
  onSelect: (folder: FolderItem) => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Folder</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={folders}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  onSelect(item);
                }}
              >
                <Image
                  source={{ uri: item.thumbnailImageUrl || "" }}
                  style={styles.thumb}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.folderName}</Text>
                  <Text numberOfLines={1} style={styles.desc}>
                    {item.folderDescription || "No description"}
                  </Text>
                  <Text style={styles.meta}>
                    {(item.numberOfImages || 0) + " images"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ padding: 12 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "70%",
    backgroundColor: Colors.lightCard,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  title: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary },
  close: { color: Colors.primary, fontWeight: "600" },

  row: { flexDirection: "row", alignItems: "center" },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    marginRight: 12,
  },
  name: { fontWeight: "700", color: Colors.textPrimary },
  desc: { color: Colors.textSecondary, marginTop: 2 },
  meta: { color: Colors.textSecondary, marginTop: 4, fontSize: 12 },
});
