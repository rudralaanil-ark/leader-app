// import { AuthProvider } from "@/contexts/AuthContext";
// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <Stack>
//         <Stack.Screen name="landing" options={{ headerShown: false }} />
//         <Stack.Screen name="(auth)/SignUp" options={{ title: "Sign Up" }} />
//         <Stack.Screen name="(auth)/SignIn" options={{ title: "Sign Up" }} />
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       </Stack>
//     </AuthProvider>
//   );
// }

import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(monitor)" />
        <Stack.Screen name="(user)" />
      </Stack>
    </AuthProvider>
  );
}
