import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        raised: "rgb(var(--raised) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: {
          DEFAULT: "#22c55e",
          soft: "#4ade80",
          deep: "#15803d",
        },
        info: "#38bdf8",
        warn: "#f59e0b",
        danger: "#f43f5e",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(34 197 94 / 0.25), 0 20px 60px -20px rgb(34 197 94 / 0.35)",
        card: "0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 10px 40px -20px rgb(0 0 0 / 0.6)",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgb(var(--line) / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--line) / 0.6) 1px, transparent 1px)",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
