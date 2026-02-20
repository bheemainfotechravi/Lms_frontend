/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        secondary: "#06B6D4",
        background: "#0F0F0F",
        surface: "#1A1A2E",
        border: "#2D2D44",
        textPrimary: "#F1F5F9",
        textMuted: "#94A3B8",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #7C3AED, #06B6D4)",
      },
    },
  },
  plugins: [],
};