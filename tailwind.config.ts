import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: "#D4621A",
          light: "#E8854A",
          dark: "#A84D12",
          50: "#FDF2EC",
        },
        brand: {
          black: "#0F0F0F",
          white: "#FAFAF8",
          marble: "#F5F3EF",
        }
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Jost", "system-ui", "sans-serif"],
      },
      animation: {
        "scroll-left": "scrollLeft 30s linear infinite",
        "scroll-right": "scrollRight 25s linear infinite",
        "fade-up": "fadeUp 0.8s ease forwards",
      },
    },
  },
  plugins: [],
};
export default config;
