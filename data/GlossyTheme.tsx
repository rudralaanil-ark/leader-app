// ✅ /data/GlossyTheme.ts
export default {
  gradient: {
    colors: ["#38084eff", "#006335ff"], // default soft purple-pink
    start: { x: 1, y: 0.5 },
    end: { x: 1, y: 1 },
  },
  blur: {
    intensity: 20, // how glossy it looks
    tint: "light" as "light" | "dark" | "default", // you can switch to 'dark' easily
  },
};
