// app/(shared)/complaints/components/StatusBadge.tsx
import { ComplaintStatus } from "@/app/services/complaintService";
import Colors from "@/data/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ViewerRole = "user" | "admin" | "monitor";

type Props = {
  status: ComplaintStatus;
  viewerRole?: ViewerRole;
};

const StatusBadge: React.FC<Props> = ({ status, viewerRole = "user" }) => {
  // Label mapping based on role
  let label = "";
  let bg = Colors.tagNew;
  let color = Colors.textPrimary;

  const isManager = viewerRole === "admin" || viewerRole === "monitor";

  switch (status) {
    case "pending":
      label = isManager ? "New" : "Pending";
      bg = Colors.tagWarning;
      break;
    case "accepted":
      label = "Accepted";
      bg = Colors.info;
      color = Colors.textInverse;
      break;
    case "in_progress":
      label = "Under Process";
      bg = Colors.info;
      color = Colors.textInverse;
      break;
    case "need_info":
      label = "Need More Info";
      bg = Colors.warning;
      color = Colors.textInverse;
      break;
    case "resolved":
      label = "Resolved";
      bg = Colors.tagSuccess;
      break;
    default:
      label = status;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
});

export default StatusBadge;
