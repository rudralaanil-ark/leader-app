// import React from "react";
// import { Image, StyleSheet, View } from "react-native";

// interface ProfileTabIconProps {
//   color: string;
//   size: number;
//   focused: boolean;
//   imageUrl?: string;
// }

// const ProfileTabIcon: React.FC<ProfileTabIconProps> = ({
//   color,
//   size,
//   focused,
//   imageUrl,
// }) => {
//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           borderColor: focused ? color : "transparent",
//           borderWidth: focused ? 2 : 0,
//           borderRadius: size,
//         },
//       ]}
//     >
//       <Image
//         source={
//           imageUrl ? { uri: imageUrl } : require("@/assets/images/profile.png")
//         }
//         style={{
//           width: size,
//           height: size,
//           borderRadius: size / 2,
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 1,
//   },
// });

// export default ProfileTabIcon;

import { getProfileImageUrl } from "@/app/utils/profileImage";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const DEFAULT_AVATAR = require("@/assets/images/profile.png");

interface ProfileTabIconProps {
  color: string;
  size: number;
  focused: boolean;
  imageUrl?: any;
}

const ProfileTabIcon: React.FC<ProfileTabIconProps> = ({
  color,
  size,
  focused,
  imageUrl,
}) => {
  const uri = getProfileImageUrl(imageUrl);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: focused ? color : "transparent",
          borderWidth: focused ? 2 : 0,
          borderRadius: size,
        },
      ]}
    >
      <Image
        source={uri ? { uri } : DEFAULT_AVATAR}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
  },
});

export default ProfileTabIcon;

// import React from "react";
// import { Image, StyleSheet, View } from "react-native";

// interface ProfileTabIconProps {
//   color: string;
//   size: number;
//   focused: boolean;
//   imageUrl?: string;
// }

// const DEFAULT_AVATAR = require("@/assets/images/profile.png");

// const isValidImageUrl = (url?: string) => {
//   return (
//     typeof url === "string" &&
//     url.trim().length > 0 &&
//     (url.startsWith("http://") || url.startsWith("https://"))
//   );
// };

// const ProfileTabIcon: React.FC<ProfileTabIconProps> = ({
//   color,
//   size,
//   focused,
//   imageUrl,
// }) => {
//   const source = isValidImageUrl(imageUrl) ? { uri: imageUrl } : DEFAULT_AVATAR;

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           borderColor: focused ? color : "transparent",
//           borderWidth: focused ? 2 : 0,
//           borderRadius: size,
//         },
//       ]}
//     >
//       <Image
//         source={source}
//         style={{
//           width: size,
//           height: size,
//           borderRadius: size / 2,
//         }}
//         resizeMode="cover"
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 1,
//   },
// });

// export default ProfileTabIcon;
