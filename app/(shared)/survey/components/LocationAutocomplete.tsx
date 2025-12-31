import {
  LocationSuggestionType,
  locationSuggestionService,
} from "@/app/services/locationSuggestionService";
import Colors from "@/data/Colors";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

/* ===================== CACHE ===================== */

const memoryCache = new Map<string, any[]>();

function cacheKey(
  type: LocationSuggestionType,
  d?: string,
  c?: string,
  m?: string
) {
  return `${type}|${d || ""}|${c || ""}|${m || ""}`;
}

type Props = {
  label: string;
  type: LocationSuggestionType;
  districtCode?: string;
  constituency?: string;
  mandal?: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
};

export default function LocationAutocomplete({
  label,
  type,
  districtCode,
  constituency,
  mandal,
  value,
  onChange,
  disabled,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const debounce = useRef<any>(null);
  const inputRef = useRef<TextInput>(null);

  /* ===================== LOAD ===================== */
  useEffect(() => {
    if (!focused) return;

    if (type !== "district" && !districtCode) return;
    if (type === "mandal" && !constituency) return;
    if (type === "village" && (!constituency || !mandal)) return;

    const key = cacheKey(type, districtCode, constituency, mandal);

    if (!value && memoryCache.has(key)) {
      setItems(memoryCache.get(key)!);
      return;
    }

    if (debounce.current) clearTimeout(debounce.current);

    debounce.current = setTimeout(async () => {
      const res = await locationSuggestionService.searchSuggestions(
        type,
        { districtCode, constituency, mandal },
        value
      );
      memoryCache.set(key, res);
      setItems(res);
    }, 250);

    return () => clearTimeout(debounce.current);
  }, [focused, value, districtCode, constituency, mandal, type]);

  /* ===================== SELECT (FIXED) ===================== */
  const select = (v: string) => {
    // 1️⃣ Kill keyboard first
    Keyboard.dismiss();

    // 2️⃣ Remove focus immediately
    inputRef.current?.blur();
    setFocused(false);

    // 3️⃣ Fill value
    onChange(v);

    // 4️⃣ Cleanup
    setItems([]);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
        editable={!disabled}
        placeholder={`Enter ${label}`}
        style={[
          styles.input,
          disabled && { backgroundColor: Colors.surfaceDark },
        ]}
      />

      {/* 🔥 PRESSABLE + onPressIn = RELIABLE */}
      {focused && !disabled && items.length > 0 && (
        <View style={styles.dropdown}>
          {items.map((i) => (
            <Pressable
              key={i.id}
              onPressIn={() => select(i.value)}
              android_disableSound
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            >
              <Text style={styles.text}>{i.value}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
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
    backgroundColor: Colors.surface,
  },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    maxHeight: 180,
    backgroundColor: Colors.card,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    backgroundColor: Colors.surfaceDark,
  },
  text: {
    color: Colors.textPrimary,
  },
});
