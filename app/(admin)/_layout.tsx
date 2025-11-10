// app/(admin)/_layout.tsx
// import {  } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 🟢 Redirect non-admin users back to login
    if (!loading && user && user.role !== "admin") {
      router.replace("/(auth)/SignIn");
    }
  }, [user, loading, router]);

  if (loading) return null; // optional: show splash loader

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
