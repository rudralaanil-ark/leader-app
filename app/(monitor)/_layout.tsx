// app/(monitor)/_layout.tsx
// import { Stack } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="AddNews"
        options={{ presentation: "modal", title: "Add News" }}
      />
      <Stack.Screen name="NewsDetails" options={{ title: "News Details" }} />
      <Stack.Screen
        name="AddEvent"
        options={{ presentation: "modal", title: "Add Event" }}
      />
      <Stack.Screen name="EventDetails" options={{ title: "Event Details" }} />
    </Stack>
  );
}
