import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Always show notification even when app is foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log("⚠️ Must use a physical device for push notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("❌ Push notification permission denied");
    return null;
  }

  // Expo Push Token (FCM backed)
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("✅ Expo Push Token:", token);

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#007AFF",
    });
  }

  return token;
}
