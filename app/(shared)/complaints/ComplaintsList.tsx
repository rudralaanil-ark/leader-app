// app/(shared)/complaints/ComplaintsList.tsx
import { useLocalSearchParams, useRouter } from "expo-router";

import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  ComplaintDoc,
  ComplaintStatus,
  complaintService,
} from "@/app/services/complaintService";
import Colors from "@/data/Colors";
import StatusBadge from "./components/StatusBadge";

type ViewerRole = "admin" | "monitor";
type FilterKey = "all" | ComplaintStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "New" },
  { key: "accepted", label: "Accepted" },
  { key: "in_progress", label: "Under Process" },
  { key: "need_info", label: "Need Info" },
  { key: "resolved", label: "Resolved" },
];

const safeDate = (d: any): Date =>
  d?.toDate?.() ?? (d instanceof Date ? d : new Date());

const formatTimeAgo = (date: Date): string => {
  const diff = (Date.now() - date.getTime()) / 1000;
  const d = Math.floor(diff / 86400);
  if (d <= 0) return "Today";
  if (d === 1) return "Yesterday";
  return `${d}d ago`;
};

export default function ComplaintsList({
  viewerRole,
}: {
  viewerRole: ViewerRole;
}) {
  const router = useRouter();
  const [complaints, setComplaints] = useState<ComplaintDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams<{ filter?: FilterKey }>();

  const [filter, setFilter] = useState<FilterKey>(params.filter ?? "all");

  /* 🔥 Sync filter when coming from dashboard */
  useEffect(() => {
    if (params.filter) {
      setFilter(params.filter);
    }
  }, [params.filter]);

  useEffect(() => {
    const unsub = complaintService.subscribeToAllComplaints((list) => {
      setComplaints(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredList = useMemo(() => {
    if (filter === "all") return complaints;

    if (filter === "in_progress") {
      return complaints.filter(
        (c) => c.status === "accepted" || c.status === "in_progress"
      );
    }

    return complaints.filter((c) => c.status === filter);
  }, [complaints, filter]);

  const renderItem = ({ item }: { item: ComplaintDoc }) => {
    const created = safeDate(item.createdAt);

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/(shared)/complaints/ComplaintDetailsManager",
            params: { id: item.id },
          })
        }
      >
        {/* Title + Status */}
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <StatusBadge status={item.status} viewerRole={viewerRole} />
        </View>

        {/* Meta */}
        <Text style={styles.cardMeta}>
          {item.userName} • {formatTimeAgo(created)}
        </Text>
        <Text style={styles.cardMetaSmall}>Phone: {item.phone}</Text>

        {/* Description */}
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>

        {/* New indicator */}
        {!item.isReadByAdmin && (
          <View style={styles.newRow}>
            <View style={styles.newDot} />
            <Text style={styles.newText}>New</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Complaints</Text>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <Pressable
              key={f.key}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Body */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : filteredList.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No complaints.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textInverse,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginRight: 8,
  },
  cardMeta: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  cardMetaSmall: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  newRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    marginRight: 5,
  },
  newText: {
    fontSize: 11,
    color: Colors.error,
    fontWeight: "600",
  },
});
