// app/(monitor)/(tabs)/Dashboard.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/data/Colors";

import {
  ComplaintDoc,
  complaintService,
} from "@/app/services/complaintService";
import { PollDoc, pollService } from "@/app/services/pollService";
import { postsService } from "@/app/services/postsService";
import { videoService } from "@/app/services/videoService";

import { listenToEvents } from "./api/events";
import { listenToNews } from "./api/news";

import AttentionCards from "./components/AttentionCards";
import SummaryCards from "./components/SummaryCards";

const IMAGE_SIZE = 56;

export default function Dashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  /* ---------------- STATE ---------------- */
  const [refreshing, setRefreshing] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  const [complaints, setComplaints] = useState<ComplaintDoc[]>([]);

  const [eventsCount, setEventsCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [videosCount, setVideosCount] = useState(0);
  const [activePollsCount, setActivePollsCount] = useState(0);

  const [latestEvents, setLatestEvents] = useState<any[]>([]);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [latestGalleryPosts, setLatestGalleryPosts] = useState<any[]>([]);
  const [latestVideos, setLatestVideos] = useState<any[]>([]);
  const [latestPoll, setLatestPoll] = useState<PollDoc | null>(null);

  /* ---------------- DATA SUBSCRIPTIONS ---------------- */

  useEffect(() => {
    return complaintService.subscribeToAllComplaints(setComplaints);
  }, []);

  useEffect(() => {
    return listenToEvents((list) => {
      setEventsCount(list.length);
      setLatestEvents(list.slice(0, 3));
    });
  }, []);

  useEffect(() => {
    return listenToNews((list) => {
      setNewsCount(list.length);
      setLatestNews(list.slice(0, 3));
    });
  }, []);

  useEffect(() => {
    return postsService.subscribeToPostType("image", (list) => {
      setLatestGalleryPosts(list.slice(0, 3));
    });
  }, []);

  const loadVideos = useCallback(async () => {
    const list = await videoService.getVideosOnce();
    setVideosCount(list.length);
    setLatestVideos(list.slice(0, 3));
  }, []);

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    return pollService.subscribeToPolls((polls) => {
      const now = new Date();
      const active = polls.filter(
        (p) => !p.expiresAt || p.expiresAt.toDate() > now
      );
      setActivePollsCount(active.length);
      setLatestPoll(active[0] ?? null);
    });
  }, []);

  /* ---------------- REFRESH ---------------- */

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadVideos(); // only non-realtime fetch
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  /* ---------------- COMPLAINT STATS ---------------- */

  const complaintStats = useMemo(() => {
    let pending = 0;
    let needInfo = 0;
    let inProgress = 0;

    complaints.forEach((c) => {
      if (c.status === "pending") pending++;
      else if (c.status === "need_info") needInfo++;
      else if (c.status === "accepted" || c.status === "in_progress")
        inProgress++;
    });

    return { pending, needInfo, inProgress };
  }, [complaints]);

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.root}>
      <StatusBar style="dark" backgroundColor={Colors.background} />

      {/* ===== FIXED HEADER ===== */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Monitor Dashboard</Text>

        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* ===== SCROLLING CONTENT ===== */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ATTENTION */}
        <AttentionCards
          pending={complaintStats.pending}
          needInfo={complaintStats.needInfo}
          inProgress={complaintStats.inProgress}
          onPressPending={() =>
            router.push("/(monitor)/(tabs)/Complaints?filter=pending")
          }
          onPressNeedInfo={() =>
            router.push("/(monitor)/(tabs)/Complaints?filter=need_info")
          }
          onPressInProgress={() =>
            router.push("/(monitor)/(tabs)/Complaints?filter=in_progress")
          }
        />

        {/* SUMMARY */}
        <SummaryCards
          events={eventsCount}
          news={newsCount}
          videos={videosCount}
          polls={activePollsCount}
          onEvents={() => router.push("/(monitor)/(tabs)/EventList")}
          onNews={() => router.push("/(monitor)/(tabs)/NewsList")}
          onVideos={() => router.push("/(monitor)/(tabs)/ManageVideos")}
          onPolls={() => router.push("/(monitor)/(tabs)/Polls")}
        />

        {/* LATEST NEWS */}
        <SectionHeader
          title="Latest News"
          onViewAll={() => router.push("/(monitor)/(tabs)/NewsList")}
        />
        {latestNews.map((n) => (
          <ImageCard
            key={n.id}
            image={n.imageUrl}
            title={n.title}
            subtitle={n.description}
            onPress={() =>
              router.push({
                pathname: "/(shared)/NewsDetails",
                params: { id: n.id },
              })
            }
          />
        ))}

        {/* LATEST EVENTS */}
        <SectionHeader
          title="Latest Events"
          onViewAll={() => router.push("/(monitor)/(tabs)/EventList")}
        />
        {latestEvents.map((e) => (
          <ImageCard
            key={e.id}
            image={e.imageUrl}
            title={e.title}
            subtitle={e.venue}
            onPress={() =>
              router.push({
                pathname: "/(shared)/EventDetails",
                params: { id: e.id },
              })
            }
          />
        ))}

        {/* LATEST POSTS */}
        <SectionHeader
          title="Latest Posts"
          onViewAll={() => router.push("/(monitor)/(tabs)/Gallery")}
        />
        {latestGalleryPosts.map((p) => (
          <ImageCard
            key={p.id}
            image={p.media?.[0]?.url}
            title={p.title || "Gallery Post"}
            subtitle={`❤️ ${p.likeCount} · 💬 ${p.commentCount}`}
            onPress={() => router.push("/(monitor)/(tabs)/Gallery")}
          />
        ))}

        {/* LATEST VIDEOS */}
        <SectionHeader
          title="Latest Videos"
          onViewAll={() => router.push("/(monitor)/(tabs)/ManageVideos")}
        />
        {latestVideos.map((v) => {
          const media = v.media?.[0];
          const thumb = media?.thumbnailUrl || media?.url;

          return (
            <ImageCard
              key={v.id}
              image={thumb}
              title={v.title || "Video"}
              subtitle={v.description || "Video post"}
              onPress={() => router.push("/(monitor)/(tabs)/ManageVideos")}
            />
          );
        })}

        {/* LATEST POLL */}
        {latestPoll && (
          <>
            <SectionHeader
              title="Latest Poll"
              onViewAll={() => router.push("/(monitor)/(tabs)/Polls")}
            />
            <Pressable
              style={styles.pollCard}
              onPress={() =>
                router.push({
                  pathname: "/(monitor)/(tabs)/Polls",
                  params: { pollId: latestPoll.id },
                })
              }
            >
              <Text style={styles.pollTitle}>{latestPoll.question}</Text>
              <Text style={styles.pollSub}>
                Total votes: {latestPoll.totalVotes}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => setFabOpen(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* FAB SHEET */}
      <Modal visible={fabOpen} transparent animationType="fade">
        <Pressable
          style={styles.fabOverlay}
          onPress={() => setFabOpen(false)}
        />
        <View style={[styles.fabSheet, { paddingBottom: insets.bottom + 12 }]}>
          <FabItem
            icon="calendar-outline"
            label="Add Event"
            onPress={() => router.push("/(monitor)/(tabs)/AddEvent")}
          />
          <FabItem
            icon="newspaper-outline"
            label="Add News"
            onPress={() => router.push("/(monitor)/(tabs)/AddNews")}
          />
          <FabItem
            icon="videocam-outline"
            label="Add Video"
            onPress={() => router.push("/(shared)/video/AddVideo")}
          />
          <FabItem
            icon="stats-chart-outline"
            label="Create Poll"
            onPress={() => router.push("/(shared)/polls/CreatePoll")}
          />
          <FabItem
            icon="images-outline"
            label="Add Gallery Post"
            onPress={() =>
              router.push("/(shared)/gallery/screens/AddGalleryPicker")
            }
          />
        </View>
      </Modal>
    </View>
  );
}

/* ---------- HELPERS ---------- */

function SectionHeader({ title, onViewAll }: any) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable onPress={onViewAll}>
        <Text style={styles.viewAll}>View All</Text>
      </Pressable>
    </View>
  );
}

function ImageCard({ image, title, subtitle, onPress }: any) {
  return (
    <Pressable style={styles.imageCard} onPress={onPress}>
      {image ? (
        <Image source={{ uri: image }} style={styles.thumb} />
      ) : (
        <View style={styles.thumbPlaceholder} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.cardSub} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

function FabItem({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.fabItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={Colors.primary} />
      <Text style={styles.fabItemText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: Colors.textPrimary,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  viewAll: { color: Colors.primary, fontWeight: "700" },

  imageCard: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  thumb: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    marginRight: 10,
  },
  thumbPlaceholder: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: Colors.surface,
  },

  pollCard: {
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  fab: {
    position: "absolute",
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  fabOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  fabSheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },
  fabItem: { flexDirection: "row", paddingVertical: 14 },
  fabItemText: { marginLeft: 14, fontWeight: "600" },
});
