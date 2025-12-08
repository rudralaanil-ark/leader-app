// ✅ /data/GlossyTheme.ts
export default {
  gradient: {
    colors: ["#0066B3", "#2E8B57"], // default soft purple-pink
    start: { x: 1, y: 0.1 },
    end: { x: 1, y: 1 },
  },
  blur: {
    intensity: 0, // how glossy it looks
    tint: "light" as "light" | "dark" | "default", // you can switch to 'dark' easily
  },
};
