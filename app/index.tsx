import { ActivityIndicator, View } from "react-native";

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
      {/* <Redirect href="/landing" /> */}

      {/* the ActivityIndicator is used to give the loading animation but it is not working , check it later */}
      <ActivityIndicator />
    </View>
  );
}
