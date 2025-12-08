import { db } from "@/configs/FirebaseConfig";
import Colors from "@/data/Colors";
import { Ionicons } from "@expo/vector-icons";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";

import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortType, setSortType] = useState("name-asc");
  const [filterOpen, setFilterOpen] = useState(false);

  /* Load All Users */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  /* Role Color */
  const getRoleColor = (role?: string) => {
    const r = role || "user";
    switch (r) {
      case "admin":
        return Colors.success;
      case "monitor":
        return Colors.info;
      default:
        return Colors.warning;
    }
  };

  /* Status Color */
  const getStatusColor = (banned: boolean) => {
    return banned ? Colors.error : Colors.success;
  };

  /* Ban / Unban */
  const toggleBanStatus = async (user: any) => {
    await updateDoc(doc(db, "users", user.id), {
      banned: !user.banned,
    });
  };

  /* Select User Modal */
  const openUserModal = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  /* Filtering + Sorting + Searching */
  const filteredUsers = useMemo(() => {
    let data = [...users];

    // Search
    if (search.trim()) {
      data = data.filter((u) =>
        (u.fullName || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    // Role Filter
    if (filterRole !== "all") {
      if (filterRole === "banned") {
        data = data.filter((u) => u.banned === true);
      } else if (filterRole === "active") {
        data = data.filter((u) => !u.banned);
      } else {
        data = data.filter((u) => (u.role || "user") === filterRole);
      }
    }

    // Sorting
    if (sortType === "name-asc") {
      data.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
    } else if (sortType === "name-desc") {
      data.sort((a, b) => (b.fullName || "").localeCompare(a.fullName || ""));
    }

    return data;
  }, [users, search, filterRole, sortType]);

  /* Render Row */
  const renderUser = ({ item }: { item: any }) => {
    const role = item.role || "user";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => openUserModal(item)}
      >
        {/* Avatar */}
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarLetter}>
              {(item.fullName || "U").charAt(0)}
            </Text>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoColumn}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.email}>{item.email}</Text>

          <View style={styles.badgesRow}>
            <View style={[styles.badge, { backgroundColor: getRoleColor(role) }]}>
              <Text style={styles.badgeText}>{role.toUpperCase()}</Text>
            </View>

            <View
              style={[
                styles.badge,
                { backgroundColor: getStatusColor(item.banned) },
              ]}
            >
              <Text style={styles.badgeText}>
                {item.banned ? "BANNED" : "ACTIVE"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          placeholder="Search users..."
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={() => setFilterOpen(!filterOpen)}>
          <Ionicons name="options-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* FILTER & SORT PANEL */}
      {filterOpen && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>Filter by Role</Text>
          <View style={styles.filterRow}>
            {["all", "admin", "monitor", "user", "active", "banned"].map(
              (role) => (
                <TouchableOpacity
                  key={role}
                  onPress={() => setFilterRole(role)}
                  style={[
                    styles.filterChip,
                    filterRole === role && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filterRole === role && styles.filterChipTextActive,
                    ]}
                  >
                    {role.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <Text style={styles.filterLabel}>Sort</Text>
          <View style={styles.filterRow}>
            {[
              { key: "name-asc", label: "Name ↑" },
              { key: "name-desc", label: "Name ↓" },
            ].map((s) => (
              <TouchableOpacity
                key={s.key}
                onPress={() => setSortType(s.key)}
                style={[
                  styles.filterChip,
                  sortType === s.key && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    sortType === s.key && styles.filterChipTextActive,
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* LIST */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(i) => i.id}
        renderItem={renderUser}
        contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
      />

      {/* USER DETAILS MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedUser && (
              <>
                {/* Avatar */}
                {selectedUser.profileImage ? (
                  <Image
                    source={{ uri: selectedUser.profileImage }}
                    style={styles.modalAvatar}
                  />
                ) : (
                  <View
                    style={[styles.modalAvatar, styles.modalAvatarPlaceholder]}
                  >
                    <Text style={styles.modalAvatarLetter}>
                      {(selectedUser.fullName || "U").charAt(0)}
                    </Text>
                  </View>
                )}

                <Text style={styles.modalName}>{selectedUser.fullName}</Text>
                <Text style={styles.modalEmail}>{selectedUser.email}</Text>

                {/* Ban Button */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: selectedUser.banned
                        ? Colors.success
                        : Colors.error,
                    },
                  ]}
                  onPress={() => {
                    toggleBanStatus(selectedUser);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.actionBtnText}>
                    {selectedUser.banned ? "UNBAN USER" : "BAN USER"}
                  </Text>
                </TouchableOpacity>

                {/* Close */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    { backgroundColor: Colors.primary },
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.actionBtnText}>CLOSE</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ------------------------------------------------------ */
/* STYLES */
/* ------------------------------------------------------ */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },

  /* SEARCH BAR */
  searchWrapper: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    margin: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },

  /* FILTER PANEL */
  filterPanel: {
    backgroundColor: Colors.card,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: Colors.surfaceDark,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textInverse,
  },

  /* LIST */
  card: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    padding: 14,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: Colors.shadow,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: Colors.surfaceDark,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textInverse,
  },
  infoColumn: {
    marginLeft: 12,
    justifyContent: "center",
    flex: 1,
  },
  name: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary },
  email: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  badgesRow: { flexDirection: "row", marginTop: 6 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.textInverse,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 18,
    alignItems: "center",
  },
  modalAvatar: {
    width: 85,
    height: 85,
    borderRadius: 42,
    marginBottom: 12,
  },
  modalAvatarPlaceholder: {
    backgroundColor: Colors.surfaceDark,
    alignItems: "center",
    justifyContent: "center",
  },
  modalAvatarLetter: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.textInverse,
  },
  modalName: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginTop: 6,
  },
  modalEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },

  actionBtn: {
    width: "100%",
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 10,
  },
  actionBtnText: {
    color: Colors.textInverse,
    fontWeight: "800",
    textAlign: "center",
    fontSize: 15,
  },
});
