// app/services/pollService.ts
import { db } from "@/configs/FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

const POLLS = "polls";

export type PollVisibility = "all" | "user" | "monitor" | "admin";
export type PollType = "single" | "multiple" | "rating";
export type RatingStyle = "stars" | "emoji";

export type PollOption = {
  id: string;
  label: string;
  votesCount: number;
};

export type PollDoc = {
  id: string;
  question: string;
  pollType: PollType;
  ratingStyle?: RatingStyle;
  allowRevote: boolean;
  options: PollOption[];
  visibleTo: PollVisibility;
  createdBy: {
    uid: string;
    name: string;
    role?: string | null;
    profileImage?: string | null;
  };
  createdAt: Timestamp;
  expiresAt?: Timestamp | null;
  totalVotes: number;
};

export type VoteDoc = {
  userId: string;
  optionIds: string[];
  userName: string;
  userRole?: string | null;
  profileImage?: string | null;
  votedAt?: Timestamp | null;
};

export const pollService = {
  /** CREATE POLL **/
  async createPoll(data: {
    question: string;
    pollType: PollType;
    ratingStyle?: RatingStyle;
    options: { id: string; label: string }[];
    allowRevote: boolean;
    visibleTo?: PollVisibility;
    expiresAt?: Date | null;
    createdBy: {
      uid: string;
      name: string;
      role?: string | null;
      profileImage?: string | null;
    };
  }) {
    const ref = await addDoc(collection(db, POLLS), {
      question: data.question,
      pollType: data.pollType,
      ratingStyle: data.ratingStyle ?? "stars",
      allowRevote: data.allowRevote,
      options: data.options.map((o) => ({
        id: o.id,
        label: o.label,
        votesCount: 0,
      })),
      visibleTo: data.visibleTo ?? "all",
      createdBy: {
        uid: data.createdBy.uid,
        name: data.createdBy.name,
        role: data.createdBy.role ?? null,
        profileImage: data.createdBy.profileImage ?? null,
      },
      createdAt: serverTimestamp(),
      expiresAt: data.expiresAt ? Timestamp.fromDate(data.expiresAt) : null,
      totalVotes: 0,
    });

    return ref.id;
  },

  /** UPDATE POLL **/
  async updatePoll(pollId: string, data: Partial<Omit<PollDoc, "id">>) {
    const ref = doc(db, POLLS, pollId);
    const update: any = { ...data };

    if (data.expiresAt instanceof Date) {
      update.expiresAt = Timestamp.fromDate(data.expiresAt);
    }

    await updateDoc(ref, update);
  },

  /** DELETE POLL **/
  async deletePoll(pollId: string) {
    await deleteDoc(doc(db, POLLS, pollId));
  },

  /** SUBSCRIBE ALL POLLS **/
  subscribeToPolls(cb: (polls: PollDoc[]) => void) {
    const q = query(collection(db, POLLS), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list: PollDoc[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      cb(list);
    });

    return unsub;
  },

  /** SUBSCRIBE SINGLE POLL **/
  subscribeToPoll(pollId: string, cb: (poll: PollDoc | null) => void) {
    if (!pollId) return () => {};
    const ref = doc(db, POLLS, pollId);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) cb(null);
      else cb({ id: snap.id, ...(snap.data() as any) } as PollDoc);
    });
    return unsub;
  },

  /** GET ONE POLL ONCE **/
  async getPollOnce(pollId: string) {
    const ref = doc(db, POLLS, pollId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as any) } as PollDoc;
  },

  /** SUBSCRIBE TO USER'S VOTE **/
  subscribeToUserVote(
    pollId: string,
    userId: string,
    cb: (vote: VoteDoc | null) => void
  ) {
    const ref = doc(db, POLLS, pollId, "votes", userId);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) cb(null);
      else cb(snap.data() as VoteDoc);
    });
    return unsub;
  },

  /** GET USER VOTE ONCE **/
  async getUserVote(pollId: string, userId: string) {
    const voteRef = doc(db, POLLS, pollId, "votes", userId);
    const snap = await getDoc(voteRef);
    if (!snap.exists()) return null;
    return snap.data() as VoteDoc;
  },

  /** MULTIPLE-CHOICE VOTE **/
  async voteMultiple(
    pollId: string,
    userId: string,
    updatedOptionIds: string[],
    user: {
      uid: string;
      fullName: string;
      role?: string | null;
      profileImage?: string | null;
    }
  ) {
    const pollRef = doc(db, POLLS, pollId);
    const voteRef = doc(db, POLLS, pollId, "votes", userId);

    await runTransaction(db, async (tx) => {
      const pollSnap = await tx.get(pollRef);
      if (!pollSnap.exists()) throw new Error("Poll not found");

      const pollData = pollSnap.data() as PollDoc;
      let options = [...pollData.options];

      const voteSnap = await tx.get(voteRef);
      const prevOptionIds = voteSnap.exists()
        ? (voteSnap.data() as VoteDoc).optionIds
        : [];

      // remove previous selections
      prevOptionIds.forEach((id) => {
        const idx = options.findIndex((o) => o.id === id);
        if (idx !== -1 && options[idx].votesCount > 0) {
          options[idx].votesCount -= 1;
        }
      });

      // add new selections
      updatedOptionIds.forEach((id) => {
        const idx = options.findIndex((o) => o.id === id);
        if (idx !== -1) {
          options[idx].votesCount += 1;
        }
      });

      const totalVotes = options.reduce(
        (sum, opt) => sum + (opt.votesCount || 0),
        0
      );

      tx.update(pollRef, { options, totalVotes });

      tx.set(voteRef, {
        userId,
        optionIds: updatedOptionIds,
        userName: user.fullName,
        userRole: user.role ?? "user",
        profileImage: user.profileImage ?? null,
        votedAt: serverTimestamp(),
      } as VoteDoc);
    });
  },

  /** SINGLE / RATING VOTE **/
  async voteOnPoll(params: {
    pollId: string;
    userId: string;
    userName: string;
    userRole?: string | null;
    profileImage?: string | null;
    selectedOptionIds: string[];
  }) {
    const {
      pollId,
      userId,
      userName,
      userRole,
      profileImage,
      selectedOptionIds,
    } = params;

    const pollRef = doc(db, POLLS, pollId);
    const voteRef = doc(db, POLLS, pollId, "votes", userId);

    await runTransaction(db, async (tx) => {
      const pollSnap = await tx.get(pollRef);
      if (!pollSnap.exists()) throw new Error("Poll does not exist");

      const pollData = pollSnap.data() as PollDoc;
      const options: PollOption[] = pollData.options || [];
      let totalVotes: number = pollData.totalVotes || 0;
      const expiresAt: Timestamp | null = pollData.expiresAt ?? null;

      if (expiresAt && expiresAt.toDate() < new Date()) {
        throw new Error("Poll has expired");
      }

      const voteSnap = await tx.get(voteRef);
      const hasVoted = voteSnap.exists();

      // remove previous vote
      if (hasVoted) {
        const prev = voteSnap.data() as VoteDoc;
        const prevOptionIds = prev.optionIds || [];
        prevOptionIds.forEach((id) => {
          const idx = options.findIndex((o) => o.id === id);
          if (idx !== -1 && options[idx].votesCount > 0) {
            options[idx].votesCount -= 1;
            totalVotes -= 1;
          }
        });
      }

      // add current selection (single / rating will always have 1 id)
      selectedOptionIds.forEach((id) => {
        const idx = options.findIndex((o) => o.id === id);
        if (idx !== -1) {
          options[idx].votesCount = (options[idx].votesCount || 0) + 1;
          totalVotes += 1;
        }
      });

      tx.update(pollRef, { options, totalVotes });

      tx.set(voteRef, {
        userId,
        userName,
        userRole: userRole ?? "user",
        profileImage: profileImage ?? null,
        optionIds: selectedOptionIds,
        votedAt: serverTimestamp(),
      } as VoteDoc);
    });
  },

  /** REMOVE VOTE (for single / rating / multi) **/
  async removeVoteOnPoll(pollId: string, userId: string) {
    const pollRef = doc(db, POLLS, pollId);
    const voteRef = doc(db, POLLS, pollId, "votes", userId);

    await runTransaction(db, async (tx) => {
      const pollSnap = await tx.get(pollRef);
      const voteSnap = await tx.get(voteRef);

      if (!pollSnap.exists()) throw new Error("Poll not found");
      if (!voteSnap.exists()) return;

      const pollData = pollSnap.data() as PollDoc;
      const voteData = voteSnap.data() as VoteDoc;

      let options = [...pollData.options];
      let totalVotes = pollData.totalVotes;

      voteData.optionIds?.forEach((id) => {
        const idx = options.findIndex((o) => o.id === id);
        if (idx !== -1 && options[idx].votesCount > 0) {
          options[idx].votesCount -= 1;
          totalVotes -= 1;
        }
      });

      if (totalVotes < 0) totalVotes = 0;

      tx.update(pollRef, { options, totalVotes });
      tx.delete(voteRef);
    });
  },

  /** GET ALL VOTERS (list) **/
  async getVoters(pollId: string) {
    const votesCol = collection(db, POLLS, pollId, "votes");
    const q = query(votesCol, orderBy("votedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    })) as (VoteDoc & { id: string })[];
  },
};
