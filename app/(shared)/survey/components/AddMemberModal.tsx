import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/data/Colors";

import { locationSuggestionService } from "@/app/services/locationSuggestionService";
import { surveyService } from "@/app/services/surveyService";
import LocationAutocomplete from "./LocationAutocomplete";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmitted: () => void;
};

export default function AddMemberModal({
  visible,
  onClose,
  onSubmitted,
}: Props) {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [mandal, setMandal] = useState("");
  const [village, setVillage] = useState("");

  /* -------- Submit -------- */
  const submit = async () => {
    if (!name || !phone || !district || !constituency) return;

    await surveyService.submitSurvey(user!.uid, {
      forSelf: false,
      person: { name, phone },
      location: {
        districtCode: district,
        constituency,
        mandal: mandal || undefined,
        village: village || undefined,
      },
    });

    // District
    await locationSuggestionService.addOrIncrementSuggestion(
      "district",
      {},
      district
    );

    // Constituency
    await locationSuggestionService.addOrIncrementSuggestion(
      "constituency",
      { districtCode: district },
      constituency
    );

    // Mandal
    if (mandal) {
      await locationSuggestionService.addOrIncrementSuggestion(
        "mandal",
        { districtCode: district, constituency },
        mandal
      );
    }

    // Village
    if (village) {
      await locationSuggestionService.addOrIncrementSuggestion(
        "village",
        { districtCode: district, constituency, mandal },
        village
      );
    }

    onSubmitted();
    onClose();

    // reset
    setName("");
    setPhone("");
    setDistrict("");
    setConstituency("");
    setMandal("");
    setVillage("");
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Add Member</Text>

        {/* Name */}
        <Text style={styles.label}>Name *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
          style={styles.input}
        />

        {/* Phone */}
        <Text style={styles.label}>Phone *</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Enter phone number"
          style={styles.input}
        />

        {/* District */}
        <LocationAutocomplete
          label="District *"
          type="district"
          districtCode=""
          value={district}
          onChange={(v) => {
            setDistrict(v);
            setConstituency("");
            setMandal("");
            setVillage("");
          }}
        />

        {/* Constituency */}
        <LocationAutocomplete
          label="Constituency *"
          type="constituency"
          districtCode={district}
          value={constituency}
          onChange={setConstituency}
          disabled={!district}
        />

        {/* Mandal */}
        <LocationAutocomplete
          label="Mandal / City"
          type="mandal"
          districtCode={district}
          constituency={constituency}
          value={mandal}
          onChange={setMandal}
          disabled={!constituency}
        />

        {/* Village */}
        <LocationAutocomplete
          label="Village (Optional)"
          type="village"
          districtCode={district}
          constituency={constituency}
          mandal={mandal}
          value={village}
          onChange={setVillage}
          disabled={!mandal}
        />

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={submit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: Colors.textPrimary,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: Colors.surface,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: Colors.buttonText,
    fontWeight: "600",
  },
  cancelBtn: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelText: {
    color: Colors.error,
  },
});
