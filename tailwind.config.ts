import type { Config } from "tailwindcss";
import scrollbarHide from 'tailwind-scrollbar-hide'

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000F89",
        secondary: "#190482",
        accent: "#7752FE",
        highlight: "#8E8FFA",
        soft: "#C2D9FF",
        danger: "#e00202",
        white: "#ffffff",
        black: "#000000",
        success: "#22c55e",
        warning: "#f59e0b",
        info: "#3b82f6",
        muted: "#6b7280",
        light: "#f8fafc",
        "primary-light": "#E8EBFF",
        "secondary-light": "#F0EFFF",
        "accent-light": "#F5F3FF",
        "success-light": "#dcfce7",
        "warning-light": "#fef3c7",
        "info-light": "#dbeafe",
        "danger-light": "#fecaca"
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        sinhala: ["Noto Sans Sinhala", "sans-serif"],
      },
    },
  },
  plugins: [scrollbarHide],
} satisfies Config;
