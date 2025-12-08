// app/(shared)/polls/PollCard.tsx
import { PollDoc, VoteDoc } from "@/app/services/pollService";
import Colors from "@/data/Colors";
import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  poll: PollDoc;
  userVote: VoteDoc | null;
  onVote: (pollId: string, optionId: string) => void;
  onViewVoters: (pollId: string) => void;
  isAdminOrMonitor: boolean;
  lastVotedPollId: string | null;
};

const PollCardComponent = ({
  poll,
  userVote,
  onVote,
  onViewVoters,
  isAdminOrMonitor,
  lastVotedPollId,
}: Props) => {
  const expired = poll.expiresAt ? poll.expiresAt.toDate() < new Date() : false;

  const isNew =
    poll.createdAt?.toDate &&
    Date.now() - poll.createdAt.toDate().getTime() < 24 * 60 * 60 * 1000;

  const showResults = expired || userVote !== null || isAdminOrMonitor;

  return (
    <View style={styles.card}>
      {/* Title Row */}
      <View style={styles.headerRow}>
        <Text style={styles.question}>{poll.question}</Text>
        {isNew && <Text style={styles.newTag}>NEW</Text>}
      </View>

      {/* Poll Type Info */}
      <Text style={styles.metaText}>
        {poll.pollType.toUpperCase()} •{" "}
        {poll.createdAt?.toDate().toDateString()}
      </Text>

      {/* Options */}
      {poll.options.map((opt) => {
        const votes = opt.votesCount ?? 0;
        const percent =
          poll.totalVotes > 0 ? Math.round((votes / poll.totalVotes) * 100) : 0;
        const selected = userVote?.optionIds.includes(opt.id);

        return (
          <Pressable
            key={opt.id}
            disabled={expired}
            onPress={() => onVote(poll.id, opt.id)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={styles.optionText}>{opt.label}</Text>

            {showResults && (
              <>
                <Text style={styles.percentLabel}>{percent}%</Text>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: `${percent}%`,
                        opacity: poll.id === lastVotedPollId ? 1 : 0.4,
                      },
                    ]}
                  />
                </View>
              </>
            )}
          </Pressable>
        );
      })}

      {/* Footer */}
      <View style={styles.footerRow}>
        <Text style={styles.votesLabel}>{poll.totalVotes} Votes</Text>
        <Text
          style={[
            styles.status,
            expired ? { color: Colors.error } : { color: Colors.success },
          ]}
        >
          {expired ? "Expired" : "Live"}
        </Text>
      </View>

      {/* Voters Button */}
      {isAdminOrMonitor && (
        <Pressable
          style={styles.votersBtn}
          onPress={() => onViewVoters(poll.id)}
        >
          <Text style={styles.votersText}>View Voters</Text>
        </Pressable>
      )}
    </View>
  );
};

/******** Memo Optimization ********/
export default React.memo(
  PollCardComponent,
  (prev, next) =>
    prev.poll.totalVotes === next.poll.totalVotes &&
    prev.userVote?.optionIds?.join() === next.userVote?.optionIds?.join() &&
    prev.lastVotedPollId === next.lastVotedPollId
);

/******** Styles ********/
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  newTag: {
    backgroundColor: Colors.tagNew,
    color: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: "700",
  },
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  option: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionSelected: {
    backgroundColor: Colors.highlight,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  percentLabel: {
    fontSize: 12,
    color: Colors.textPrimary,
    position: "absolute",
    right: 12,
    top: 10,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: Colors.surfaceDark,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  footerRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  votesLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  status: {
    fontSize: 12,
    fontWeight: "700",
  },
  votersBtn: {
    marginTop: 8,
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  votersText: {
    fontSize: 12,
    color: Colors.textInverse,
    fontWeight: "700",
  },
});
