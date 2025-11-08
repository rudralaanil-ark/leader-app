import { auth } from "@/configs/FirebaseConfig";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { View } from "react-native";

export default function Index() {
  // onAuthStateChanged(auth, (user) => {
  //   console.log(user);
  // });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Redirect href="/landing" />
    </View>
  );
}
