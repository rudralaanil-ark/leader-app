import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  item: any;
  onPress: () => void;

  // Home vs Events screen
  showActions?: boolean;
  onInterested?: () => void;
  interested?: boolean;
  onShare?: () => void;
};

export default function EventCard({
  item,
  onPress,
  showActions = true,
  onInterested,
  interested,
  onShare,
}: Props) {
  const formatBadgeParts = (eventDate: any) => {
    if (!eventDate) return { top: "", bottom: "" };
    const d = eventDate.toDate ? eventDate.toDate() : new Date(eventDate);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString(undefined, { month: "short" });
    const time = d
      .toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase()
      .replace(":", " : ");
    return { top: `${day} ${month}`, bottom: time };
  };

  const { top, bottom } = formatBadgeParts(item.dateTime);

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
      <ImageBackground
        source={
          item.imageUrl
            ? { uri: item.imageUrl }
            : require("@/assets/images/react-logo.png")
        }
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.dateBadge}>
          <Text style={styles.dateTop}>{top}</Text>
          <Text style={styles.dateBottom}>{bottom}</Text>
        </View>
      </ImageBackground>

      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.label}>Event :</Text>
          <Text style={styles.event} numberOfLines={2}>
            {item.title || "-"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Venue :</Text>
          <Text style={styles.venue} numberOfLines={1}>
            {item.venue || "—"}
          </Text>
        </View>

        {/* ACTIONS — ONLY IN EVENTS TAB */}
        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.comingBtn, interested && styles.comingBtnActive]}
              onPress={onInterested}
            >
              <Ionicons
                name={interested ? "checkmark" : "checkmark-outline"}
                size={16}
                color={interested ? Colors.textInverse : Colors.text}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.comingText,
                  interested && styles.comingTextActive,
                ]}
              >
                I am coming
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={onShare}>
              <Ionicons name="share-outline" size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.elevatedCard,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: 220,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  dateBadge: {
    position: "absolute",
    left: 16,
    bottom: -18,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 90,
    alignItems: "center",
  },
  dateTop: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: "800",
  },
  dateBottom: {
    color: Colors.textInverse,
    fontSize: 14,
    marginTop: 2,
    fontWeight: "600",
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 22,
    paddingBottom: 14,
  },
  row: {
    flexDirection: "row",
    marginTop: 6,
  },
  label: {
    width: 64,
    color: Colors.textPrimary,
  },
  event: {
    flex: 1,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  venue: {
    flex: 1,
    color: Colors.textPrimary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-end",
  },
  comingBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.2,
    backgroundColor: "#F1F1F3",
  },
  comingBtnActive: {
    backgroundColor: Colors.primary,
  },
  comingText: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 14,
  },
  comingTextActive: {
    color: Colors.textInverse,
  },
  iconBtn: {
    marginLeft: 14,
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: Colors.accent,
  },
});
