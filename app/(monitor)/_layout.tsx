// app/(monitor)/_layout.tsx
// import { Stack } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";

export default function MonitorLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 🟢 Redirect non-monitor users
    if (!loading && user && user.role !== "monitor") {
      router.replace("/(auth)/SignIn");
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
