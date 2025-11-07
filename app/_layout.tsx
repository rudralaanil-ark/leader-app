import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="landing" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/SignUp" options={{ title: "Sign Up" }} />
      <Stack.Screen name="(auth)/SignIn" options={{ title: "Sign Up" }} />
    </Stack>
  );
}
