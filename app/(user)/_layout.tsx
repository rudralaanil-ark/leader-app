// app/(user)/_layout.tsx
// import { Stack } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function UserLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 🟢 Redirect unauthorized users
    if (!loading && (!user || user.role !== "user")) {
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
