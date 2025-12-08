import React, { useEffect, useState } from "react";
import {
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import { db } from "@/configs/FirebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Colors from "@/data/Colors";

export default function ImagesContent({ monitorId }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    let q;

    if (monitorId === "all") {
      q = query(collection(db, "images"), orderBy("createdAt", "desc"));
    } else {
      q = query(
        collection(db, "images"),
        where("createdBy", "==", monitorId),
        orderBy("createdAt", "desc")
      );
    }

    const unsub = onSnapshot(q, (snap) => {
      setImages(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });

    return unsub;
  }, [monitorId]);

  return (
    <FlatList
      data={images}
      keyExtractor={(i) => i.id}
      numColumns={2}
      contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card}>
          <Image source={{ uri: item.url }} style={styles.image} />
          <Text style={styles.monitor}>By {item.createdByName}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    margin: 6,
    width: "47%",
    padding: 8,
  },
  image: {
    height: 120,
    width: "100%",
    borderRadius: 10,
  },
  monitor: {
    fontSize: 11,
    marginTop: 4,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
