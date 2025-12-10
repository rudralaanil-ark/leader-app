// app/(user)/(tabs)/Video.tsx
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import VideoCommentsSheet from "@/app/(shared)/video/components/VideoCommentsSheet";
import {
  GlobalUploader,
  globalUploaderService,
} from "@/app/services/globalUploaderService";
import { postsService } from "@/app/services/postsService";
import { videoService } from "@/app/services/videoService";
import { Post } from "@/app/utils/types";
import { useAuth } from "@/contexts/AuthContext";

const { height, width } = Dimensions.get("window");

const viewabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

export default function VideoScreen() {
  const [videos, setVideos] = useState<Post[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploader, setUploader] = useState<GlobalUploader | null>(null);

  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const viewedRef = useRef<Set<string>>(new Set());
  const { user } = useAuth();

  // Live uploader metadata
  useEffect(() => {
    const unsub = globalUploaderService.subscribe((val) => setUploader(val));
    return unsub;
  }, []);

  // Live video posts
  useEffect(() => {
    const unsub = videoService.subscribeToVideos((list) => setVideos(list));
    return unsub;
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (!viewableItems || viewableItems.length === 0) return;

    const first = viewableItems[0];
    const index = first.index ?? 0;
    const item = first.item as Post;

    setActiveIndex(index);

    if (item?.id && !viewedRef.current.has(item.id)) {
      viewedRef.current.add(item.id);
      videoService.incrementViewCount(item.id).catch(() => {});
    }
  }).current;

  const keyExtractor = useCallback((item: any) => item.id, []);

  const openComments = (postId: string) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  const renderItem = useCallback(
    ({ item, index }: { item: Post; index: number }) => (
      <VideoCard
        post={item}
        isActive={index === activeIndex}
        uploaderName={item.ownerName ?? uploader?.name ?? "Admin"}
        currentUserId={user?.uid ?? null}
        onPressComments={() => openComments(item.id)}
      />
    ),
    [activeIndex, uploader?.name, user?.uid]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {videos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No videos yet</Text>
          <Text style={styles.emptySubText}>
            Videos uploaded by your leaders will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          decelerationRate="fast"
          snapToAlignment="start"
          getItemLayout={(_, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
        />
      )}

      {/* COMMENTS MODAL */}
      <VideoCommentsSheet
        visible={showComments}
        postId={selectedPostId}
        onClose={() => setShowComments(false)}
      />
    </View>
  );
}

// ---------------- Video Card Component ----------------

type VideoCardProps = {
  post: Post;
  isActive: boolean;
  uploaderName: string;
  currentUserId: string | null;
  onPressComments: () => void;
};

const VideoCard: React.FC<VideoCardProps> = ({
  post,
  isActive,
  uploaderName,
  currentUserId,
  onPressComments,
}) => {
  const { user } = useAuth();
  const videoRef = useRef<Video | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState((post as any).likeCount ?? 0);
  const [commentCount] = useState((post as any).commentCount ?? 0);

  const media = (post as any).media || [];
  const videoUrl = media.find((m: any) => m.type === "video")?.url;

  useEffect(() => {
    if (!user || !post.id) return;

    postsService
      .isPostLikedByUser(post.id, user.uid)
      .then((liked) => setIsLiked(liked))
      .catch(() => {});
  }, [post.id, user]);

  const toggleMute = () => setIsMuted((prev) => !prev);

  const toggleLike = async () => {
    if (!user || !post.id) return;

    try {
      if (isLiked) {
        setIsLiked(false);
        setLikeCount((c) => c - 1);
        await postsService.unlikePost(post.id, user.uid);
      } else {
        setIsLiked(true);
        setLikeCount((c) => c + 1);
        await postsService.likePost(post.id, {
          userId: user.uid,
          name: user.fullName ?? "User",
        });
      }
    } catch {}
  };

  if (!videoUrl) {
    return (
      <View style={[styles.cardContainer, styles.centerContent]}>
        <Text style={styles.emptyText}>Invalid video</Text>
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      <TouchableWithoutFeedback onPress={toggleMute}>
        <View style={styles.videoWrapper}>
          <Video
            ref={(ref) => (videoRef.current = ref)}
            source={{ uri: videoUrl }}
            style={styles.video}
            resizeMode="cover"
            shouldPlay={isActive}
            isLooping
            isMuted={isMuted}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* ACTIONS */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={28}
            color={isLiked ? "#ff4b67" : "#ffffff"}
          />
          <Text style={styles.actionLabel}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressComments} style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={28} color="#ffffff" />
          <Text style={styles.actionLabel}>{commentCount}</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity onPress={toggleMute} style={styles.actionButton}>
          <Ionicons
            name={isMuted ? "volume-mute" : "volume-high"}
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>

      {/* BOTTOM INFO */}
      <View style={styles.bottomContainer}>
        <Text style={styles.uploaderText}>@{uploaderName}</Text>
        {post.title ? (
          <Text numberOfLines={2} style={styles.captionText}>
            {post.title}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

// ---------------- Styles ----------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  emptySubText: { color: "#9ca3af", fontSize: 14, textAlign: "center" },
  cardContainer: { width, height, backgroundColor: "#000" },
  centerContent: { justifyContent: "center", alignItems: "center" },
  videoWrapper: { flex: 1 },
  video: { width: "100%", height: "100%" },
  actionsContainer: {
    position: "absolute",
    right: 16,
    bottom: 80,
    alignItems: "center",
  },
  actionButton: { alignItems: "center", marginBottom: 20 },
  actionLabel: { color: "#fff", fontSize: 12, marginTop: 4 },
  spacer: { height: 12 },
  bottomContainer: {
    position: "absolute",
    left: 16,
    right: 120,
    bottom: 32,
  },
  uploaderText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  captionText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
  },
});
