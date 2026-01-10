// import messaging from "@react-native-firebase/messaging";

// export async function initFCM() {
//   const authStatus = await messaging().requestPermission();

//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (!enabled) {
//     console.log("❌ FCM permission not granted");
//     return;
//   }

//   const token = await messaging().getToken();
//   console.log("✅ FCM TOKEN:", token);

//   // Subscribe to topics
//   await messaging().subscribeToTopic("all_users");
//   await messaging().subscribeToTopic("news");

//   console.log("✅ Subscribed to FCM topics");
// }
