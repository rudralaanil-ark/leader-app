// // app/utils/compressVideoIfNeeded.ts
// import * as FileSystem from "expo-file-system/legacy";
// import { Alert } from "react-native";
// import { Video } from "react-native-compressor";

// const MAX_SIZE_MB = 100;

// export type CompressedVideoResult = {
//   uri: string;
//   sizeMB: number;
//   compressed: boolean;
// };

// export async function compressVideoIfNeeded(
//   uri: string
// ): Promise<CompressedVideoResult> {
//   // 1️⃣ Get file info (legacy-safe)
//   const info = await FileSystem.getInfoAsync(uri, { size: true });

//   if (!info.exists || !info.size) {
//     throw new Error("Video file not found");
//   }

//   const originalSizeMB = info.size / (1024 * 1024);

//   // 2️⃣ Skip compression for small videos
//   if (originalSizeMB <= 30) {
//     return {
//       uri,
//       sizeMB: originalSizeMB,
//       compressed: false,
//     };
//   }

//   try {
//     // 3️⃣ Native compression
//     const compressedUri = await Video.compress(
//       uri,
//       {
//         compressionMethod: "auto",
//         minimumFileSizeForCompress: 30,
//       },
//       (progress) => {
//         console.log(`Compressing: ${Math.round(progress * 100)}%`);
//       }
//     );

//     const compressedInfo = await FileSystem.getInfoAsync(compressedUri, {
//       size: true,
//     });

//     if (!compressedInfo.size) {
//       throw new Error("Compression failed");
//     }

//     const compressedSizeMB = compressedInfo.size / (1024 * 1024);

//     // 4️⃣ Enforce hard limit
//     if (compressedSizeMB > MAX_SIZE_MB) {
//       Alert.alert(
//         "Video too large",
//         "Please upload a shorter video (max 100 MB after compression)."
//       );
//       throw new Error("Video exceeds size limit");
//     }

//     return {
//       uri: compressedUri,
//       sizeMB: compressedSizeMB,
//       compressed: true,
//     };
//   } catch (err) {
//     console.error("Compression error:", err);
//     throw err;
//   }
// }

// app/utils/compressVideoIfNeeded.ts
import * as FileSystem from "expo-file-system/legacy";
import { Alert } from "react-native";
import { Video } from "react-native-compressor";

const MAX_SIZE_MB = 1024;

export type CompressedVideoResult = {
  uri: string;
  sizeMB: number;
  compressed: boolean;
};

export async function compressVideoIfNeeded(
  uri: string,
  onProgress?: (progress: number) => void
): Promise<CompressedVideoResult> {
  // 1️⃣ Get file info (legacy-safe)
  const info = await FileSystem.getInfoAsync(uri);

  // ✅ PROPER TYPE NARROWING (THIS FIXES THE ERROR)
  if (!info.exists || !("size" in info) || typeof info.size !== "number") {
    throw new Error("Video file not found");
  }

  const originalSizeMB = info.size / (1024 * 1024);

  // 2️⃣ Skip compression for small videos
  if (originalSizeMB <= 30) {
    return {
      uri,
      sizeMB: originalSizeMB,
      compressed: false,
    };
  }

  try {
    // 3️⃣ Native compression
    const compressedUri = await Video.compress(
      uri,
      {
        compressionMethod: "auto",
        minimumFileSizeForCompress: 30,
      },
      (progress) => {
        const percent = Math.round(progress * 100);

        // report progress
        onProgress?.(percent);

        // keep existing log
        console.log(`Compressing: ${percent}%`);
      }
    );

    const compressedInfo = await FileSystem.getInfoAsync(compressedUri);

    // ✅ SAME NARROWING AGAIN
    if (
      !compressedInfo.exists ||
      !("size" in compressedInfo) ||
      typeof compressedInfo.size !== "number"
    ) {
      throw new Error("Compression failed");
    }

    const compressedSizeMB = compressedInfo.size / (1024 * 1024);

    // 4️⃣ Enforce hard limit
    if (compressedSizeMB > MAX_SIZE_MB) {
      console.log();
      Alert.alert(
        "Video too large",
        "Please upload a shorter video (max 100 MB after compression)."
      );
      throw new Error("Video exceeds size limit");
    }

    return {
      uri: compressedUri,
      sizeMB: compressedSizeMB,
      compressed: true,
    };
  } catch (err) {
    console.error("Compression error:", err);
    throw err;
  }
}
